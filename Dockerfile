# Use the latest Playwright image
FROM mcr.microsoft.com/playwright:v1.40.0

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Set default command
CMD ["yarn", "test:playwright"]
