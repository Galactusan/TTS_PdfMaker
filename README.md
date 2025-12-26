# TTS_PdfMaker

# Aspire Solution

This repository contains a multi-project .NET solution developed using Visual Studio 2022 with the Aspire environment.

## Projects

- `Tests` - Unit tests of the following projects (Empty after the last revision. WIP)
- `Core` - Logic implementations of PDF processes.
- `Api` - REST API with endpoints.
- `Frontend` - Web frontend

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)
- Visual Studio 2022 (optional, only for IDE users)
- Docker Desktop (projects are run in containers)
- Node.js 22+

## Running the solution

You can run the projects without Visual Studio using the .NET CLI:

1. Restore dependencies:
    ```bash
    dotnet restore
    ```

2. Build the solution:
    ```bash
    dotnet build
    ```

3. Run a specific project:
    ```bash
    dotnet run --project TTS_PdfMaker.AppHost/TTS_PdfMaker.AppHost.csproj
    ```
## Notes

- All projects use NuGet package references. No external DLLs are required.
