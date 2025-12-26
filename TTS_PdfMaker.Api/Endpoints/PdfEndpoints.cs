using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;
using TTS_PdfMaker.Api.Models;
using TTS_PdfMaker.Core.Data;
using TTS_PdfMaker.Core.Models;
using TTS_PdfMaker.Core.Pdf;

namespace TTS_PdfMaker.Api.Endpoints;

public static class PdfEndpoints
{
    public static void MapPdfEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/pdf", async Task<IResult> (GeneratePdfRequest request, PdfDbContext dbContext, HttpContext httpContext) =>
        {
            // ---- Validation ----
            if (string.IsNullOrWhiteSpace(request.Title))
                return Results.BadRequest("Title is required.");

            if (string.IsNullOrWhiteSpace(request.Content))
                return Results.BadRequest("Content is required.");

            if (string.IsNullOrWhiteSpace(request.ContentType))
                return Results.BadRequest("ContentType is required.");

            var contentTypeLower = request.ContentType.ToLowerInvariant();

            if (contentTypeLower != "plain" && contentTypeLower != "html")
                return Results.BadRequest("ContentType must be 'plain' or 'html'.");

            var contentType = contentTypeLower == "html"
                ? ContentType.Html
                : ContentType.PlainText;

            // Generate ID and timestamp
            var documentId = Guid.NewGuid();
            var createdAt = DateTime.UtcNow;

            // Create and save document
            var pdfDocument = new PdfDocument
            {
                Id = documentId,
                Title = request.Title,
                Content = request.Content,
                ContentType = contentType,
                CreatedAt = createdAt
            };

            dbContext.PdfDocuments.Add(pdfDocument);
            await dbContext.SaveChangesAsync();

            // Generate PDF with ID and CreatedAt
            var reportRequest = new ReportRequest(
                request.Title,
                request.Content,
                contentType
            );

            var contentGenerator = new PlaywrightPdfGenerator();
            var merger = new PdfSharpMerger();

            var contentPdf = await contentGenerator.GeneratePdfAsync(reportRequest, documentId, createdAt);

            var antetPath = Path.Combine(
                AppContext.BaseDirectory,
                "Assets",
                "antet.pdf"
            );

            var finalPdf = merger.MergeWithAntet(contentPdf, antetPath);

            // Set custom headers
            httpContext.Response.Headers.Append("X-PDF-Id", documentId.ToString());
            httpContext.Response.Headers.Append("X-PDF-Created-At", createdAt.ToString("O"));

            return Results.File(
                finalPdf,
                "application/pdf",
                $"report-{documentId:N}.pdf"
            );
        });

        // Get PDF by ID (regenerate from database)
        app.MapGet("/pdf/{id:guid}", async Task<IResult> (Guid id, PdfDbContext dbContext) =>
        {
            var pdfDocument = await dbContext.PdfDocuments.FindAsync(id);
            
            if (pdfDocument == null)
                return Results.NotFound($"PDF with ID {id} not found.");

            // Regenerate PDF from stored data
            var reportRequest = new ReportRequest(
                pdfDocument.Title,
                pdfDocument.Content,
                pdfDocument.ContentType
            );

            var contentGenerator = new PlaywrightPdfGenerator();
            var merger = new PdfSharpMerger();

            var contentPdf = await contentGenerator.GeneratePdfAsync(
                reportRequest, 
                pdfDocument.Id, 
                pdfDocument.CreatedAt
            );

            var antetPath = Path.Combine(
                AppContext.BaseDirectory,
                "Assets",
                "antet.pdf"
            );

            var finalPdf = merger.MergeWithAntet(contentPdf, antetPath);

            return Results.File(
                finalPdf,
                "application/pdf",
                $"report-{pdfDocument.Id:N}.pdf"
            );
        });

        // Get PDF metadata by ID
        app.MapGet("/pdf/{id:guid}/metadata", async Task<IResult> (Guid id, PdfDbContext dbContext) =>
        {
            var pdfDocument = await dbContext.PdfDocuments
                .Where(d => d.Id == id)
                .Select(d => new
                {
                    d.Id,
                    d.Title,
                    ContentType = d.ContentType.ToString(),
                    d.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (pdfDocument == null)
                return Results.NotFound($"PDF with ID {id} not found.");

            return Results.Ok(pdfDocument);
        });
    }
}