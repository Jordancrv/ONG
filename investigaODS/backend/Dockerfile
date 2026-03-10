# Dev image
FROM node:20-alpine 
RUN apk add --no-cache bash curl git openssh shadow sudo \
    libc6-compat ca-certificates
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]