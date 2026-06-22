FROM oven/bun:1-slim AS build
WORKDIR /app
ARG VITE_INSFORGE_URL=/api
ENV VITE_INSFORGE_URL=$VITE_INSFORGE_URL
COPY frontend/package.json ./
RUN bun install --no-save
COPY frontend/ .
RUN bun run build

FROM nginx:alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
