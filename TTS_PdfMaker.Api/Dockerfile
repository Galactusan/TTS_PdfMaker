# Base runtime image 
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base 
WORKDIR /app 
EXPOSE 8080

# Set Kestrel to listen on all container interfaces 
ENV ASPNETCORE_URLS=http://+:8080

# Build image 
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build 
ARG BUILD_CONFIGURATION=Release 
WORKDIR /src

# Copy project files for restore 
COPY ["TTS_PdfMaker.Api/TTS_PdfMaker.Api.csproj", "TTS_PdfMaker.Api/"] 
COPY ["TTS_PdfMaker.Core/TTS_PdfMaker.Core.csproj", "TTS_PdfMaker.Core/"]

# Restore
RUN dotnet restore "./TTS_PdfMaker.Api/TTS_PdfMaker.Api.csproj"

# Copy all source 
COPY . .

WORKDIR "/src/TTS_PdfMaker.Api" 
RUN dotnet build "./TTS_PdfMaker.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish 
FROM build AS publish 
ARG BUILD_CONFIGURATION=Release 
RUN dotnet publish "./TTS_PdfMaker.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final image 
FROM base AS final 
WORKDIR /app 
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TTS_PdfMaker.Api.dll"]