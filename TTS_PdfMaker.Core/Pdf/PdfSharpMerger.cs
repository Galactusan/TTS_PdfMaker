using PdfSharp.Drawing;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using System;
using System.IO;

namespace TTS_PdfMaker.Core.Pdf
{
    public sealed class PdfSharpMerger
    {
        /// <summary>
        /// Merge a generated PDF with a template (antet) without adding fonts.
        /// </summary>
        /// <param name="contentPdf">Generated PDF bytes</param>
        /// <param name="antetPath">Path to the template PDF</param>
        /// <returns>Merged PDF as byte array</returns>
        public byte[] MergeWithAntet(byte[] contentPdf, string antetPath)
        {
            using var outputDocument = new PdfDocument();

            using var antetDocument = PdfReader.Open(antetPath, PdfDocumentOpenMode.Import);
            using var contentStream = new MemoryStream(contentPdf);
            var contentForm = XPdfForm.FromStream(contentStream);

            int pageCount = contentForm.PageCount;

            for (int i = 0; i < pageCount; i++)
            {
                // Add template page
                var page = outputDocument.AddPage(antetDocument.Pages[0]);
                using var gfx = XGraphics.FromPdfPage(page);

                // Draw generated content over the template
                contentForm.PageNumber = i + 1;
                gfx.DrawImage(contentForm, 0, 0, page.Width, page.Height);
            }

            using var outputStream = new MemoryStream();
            outputDocument.Save(outputStream);
            return outputStream.ToArray();
        }
    }
}
