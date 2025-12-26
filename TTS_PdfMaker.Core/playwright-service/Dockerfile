# Use the Playwright image matching your npm package version
FROM mcr.microsoft.com/playwright:v1.57.0-noble

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install Node.js dependencies (Playwright runtime + Express)
RUN npm install

# Copy the Playwright service files
COPY . .

# Expose the HTTP port your service listens on
EXPOSE 3000

CMD ["node", "index.js"]
