namespace TTS_PdfMaker.Core.Models;

public sealed record ReportRequest(
    string Title,
    string Content,
    ContentType ContentType
);
