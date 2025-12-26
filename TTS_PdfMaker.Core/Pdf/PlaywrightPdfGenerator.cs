using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using TTS_PdfMaker.Core.Models;

namespace TTS_PdfMaker.Core.Pdf
{
    public sealed class PlaywrightPdfGenerator
    {
        private readonly HttpClient _httpClient;

        public PlaywrightPdfGenerator(HttpClient? httpClient = null)
        {
            _httpClient = httpClient ?? new HttpClient();
        }

        public async Task<byte[]> GeneratePdfAsync(ReportRequest request, Guid documentId, DateTime createdAt)
        {
            string html = WrapContent(request, documentId, createdAt);

            // Playwright container URL (Aspire sets endpoint automatically)
            var playwrightUrl = Environment.GetEnvironmentVariable("PLAYWRIGHT_HTTP_ENDPOINT")
                                ?? "http://playwright:3000/generate-pdf";

            var payload = new { html };
            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(playwrightUrl, content);
            response.EnsureSuccessStatusCode();

            var base64Pdf = await response.Content.ReadAsStringAsync();
            return Convert.FromBase64String(base64Pdf);
        }

        private string WrapContent(ReportRequest request, Guid documentId, DateTime createdAt)
        {
            // Unified styling for both plain text and HTML
            string contentHtml = request.ContentType == ContentType.PlainText
                ? $"<div style='font-family: Arial, sans-serif; font-size:14px; line-height:1.6; white-space: pre-wrap; word-wrap: break-word;'>{System.Net.WebUtility.HtmlEncode(request.Content)}</div>"
                : $"<div style='font-family: Arial, sans-serif; font-size:14px; line-height:1.6;'>{request.Content}</div>";

            string titleHtml = request.ContentType == ContentType.PlainText
                ? $"<div class='pdf-title' style='text-align:center;'>{request.Title}</div>"
                : $"<div class='pdf-title'>{request.Title}</div>";
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>{request.Title}</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin:0;
            padding:0;
        }}

        main {{
            margin: 0;
            padding: 0;
        }}

        /* Page margins */
        @page:first {{
            margin-top: 21mm;       /* first page top */
            margin-bottom: 30mm;    /* bottom margin */
            margin-left: 24mm;      /* left margin */
            margin-right: 22mm;     /* right margin */
        }}

        @page {{
            margin-top: 25mm;       /* other pages top */
            margin-bottom: 31mm;    /* bottom margin */
            margin-left: 24mm;      /* left margin */
            margin-right: 22mm;     /* right margin */
        }}

        .pdf-header {{
            font-size: 12px;
            color: gray;
            margin-bottom: 10px;
            text-align: right; /* right align ID/Date */
        }}

        .pdf-title {{
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }}
    </style>
</head>
<body>
    <main>
        <div class='pdf-header'>
            <div>Belge Numarası: {documentId:D}</div>
            <div>Oluşturulma Tarihi: {createdAt:yyyy-MM-dd HH:mm:ss}</div>
        </div>
        {titleHtml}
        {contentHtml}
    </main>
</body>
</html>";
        }

    }

}
