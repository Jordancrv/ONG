FROM node:20-alpine
RUN apk add --no-cache libstdc++ ca-certificates
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# CMD ["tail", "-f", "/dev/null"]
EXPOSE 5173
CMD ["npm","run","dev","--","--host","0.0.0.0"]
