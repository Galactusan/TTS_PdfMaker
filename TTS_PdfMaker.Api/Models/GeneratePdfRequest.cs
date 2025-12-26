namespace TTS_PdfMaker.Api.Models;

public sealed record GeneratePdfRequest(
    string Title,
    string Content,
    string ContentType // "plain" | "html"
);
