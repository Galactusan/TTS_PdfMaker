# TTS_PdfMaker

# Aspire Solution

This repository contains a multi-project .NET solution developed using Visual Studio 2022 with the Aspire environment.
Goal of the project is make a robust PDF Making website which generates PDF's from given user plain text input or HTML input.
Generated PDF's have creation date and unique identifiers for recalling the same documents via search feature in the website.


The project uses a docker contained services to make a fullstack web service using .NET Aspire for centralized access and diagnostic features for the future.
PostgreSQL database is used to hold the mentioned documents.
The project uses playwright library to make a containerized Chromium so we can access all the HTML rendering features for our PDF's. This makes the initial download longer but provides extensive editing features to our PDF's.
Frontend implementation is a vibe React project which has very basic implementation of 2 pages and a homepage.

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

### IMPORTANT: Database auto migrations is open in the API's startpoint (program.cs) for development purposes. Disabe in production.
### Download times may be longer depending on the required packages and the inital builds, check the download and build processes from the Aspire Dashboard consoles for the services.
### Aspire Dashboard can fail depending on the computer's network configuration or the operating system (Win 10 is deprecated so maybe some issues)
### If Dasboard fails on startup, wait for all containers to show up in docker desktop, (should be 5 with the pgAdmin, db, api, frontend, playwright) you can access the website from the docker container url of the frontend.
### Everything still works

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
4. Login to the Aspire Dashboard to navigate to other endpoints.

OR

In Visual Studio:

1. Open the TTS_PdfMaker.sln
   
3. Set the starting project to TTS_PdfMaker.AppHost
   
5. Run with F5 or from GUI

6. Login to the Aspire Dashboard to navigate to other endpoints.

## Notes

- All projects use NuGet package references. No external DLLs are required.
