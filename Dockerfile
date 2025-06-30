# Gunakan image resmi Node.js
FROM node:18

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua source code
COPY . .

# Expose port
EXPOSE 3000

# Jalankan server
CMD ["npm", "start"]
