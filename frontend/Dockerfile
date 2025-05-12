<<<<<<< HEAD
# Build stage
=======
>>>>>>> eaf0d4fa7a24ede93833733bcb806c757706a214
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

<<<<<<< HEAD
# Nginx stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
=======
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
>>>>>>> eaf0d4fa7a24ede93833733bcb806c757706a214
EXPOSE 80 