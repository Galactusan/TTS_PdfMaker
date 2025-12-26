using TTS_PdfMaker.Core.Models;

namespace TTS_PdfMaker.Core.Models;

public class PdfDocument
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public ContentType ContentType { get; set; }
    public DateTime CreatedAt { get; set; }
}