FROM denoland/deno:alpine-2.1
WORKDIR /app
COPY functions/ .
EXPOSE 8000
CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "server.ts"]
