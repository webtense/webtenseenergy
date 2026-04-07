FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm install --legacy-peer-deps --omit=dev
EXPOSE 3010
ENV PORT=3010
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production
CMD ["node", "server.js"]
