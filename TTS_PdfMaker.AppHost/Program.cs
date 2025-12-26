using Aspire.Hosting;
using YamlDotNet.Core.Tokens;

var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
    .WithDataVolume()
    .WithPgAdmin();

var db = postgres.AddDatabase("pdfmakerdb");

var backend = builder.AddContainer("api", "tts-pdfmaker-api")
    .WithDockerfile(contextPath: "..", dockerfilePath: "TTS_PdfMaker.Api/Dockerfile")
    .WithReference(db)
    .WithHttpEndpoint(name: "http", targetPort: 8080, port: 5047)
    .WithHttpsEndpoint(name: "https", targetPort: 8081, port: 7102);

var playwright = builder.AddContainer("playwright", "tts-pdfmaker-playwright")
    .WithDockerfile(
        contextPath: "../TTS_PdfMaker.Core/playwright-service",
        dockerfilePath: "Dockerfile")
    .WithHttpEndpoint(name: "http", targetPort: 3000, port: 5300);

var frontend = builder.AddContainer("frontend", "tts-pdfmaker-frontend")
    .WithDockerfile(contextPath: "../TTS_PdfMaker.Frontend", dockerfilePath: "Dockerfile")
    .WithEnvironment("VITE_API_BASE_URL", backend.GetEndpoint("http"))
    .WithHttpEndpoint(name: "http", targetPort: 80, port: 52913);


builder.Build().Run();
