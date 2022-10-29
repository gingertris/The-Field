FROM node:17-alpine AS base



FROM base as builder

WORKDIR /app

COPY . .

RUN npm install

RUN npx tsc

FROM base

WORKDIR /app

COPY --from=builder /app/build .
COPY --from=builder /app/views ./views
COPY --from=builder /app/package*.json .

RUN npm ci --omit=dev

EXPOSE 8000

CMD ["node", "app.js"]