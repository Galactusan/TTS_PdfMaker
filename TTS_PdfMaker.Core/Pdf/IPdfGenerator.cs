using TTS_PdfMaker.Core.Models;

namespace TTS_PdfMaker.Core.Pdf;

public interface IPdfGenerator
{
    byte[] Generate(ReportRequest request);
}
