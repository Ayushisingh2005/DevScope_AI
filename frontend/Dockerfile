FROM node:18-alpine

WORKDIR /app

# The asterisk (*) ensures both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose Vite port
EXPOSE 5173

# Just install missing packages and run Vite
CMD ["sh", "-c", "npm install && npm run dev"]