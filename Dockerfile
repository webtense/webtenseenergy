FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npx prisma generate
ARG DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/webtense_energy?schema=public"
ENV DATABASE_URL=${DATABASE_URL}
RUN npm run build

FROM node:20-alpine
RUN apk add --no-cache fontconfig ttf-liberation font-noto && fc-cache -f
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
