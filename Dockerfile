FROM node:18.20.4-alpine3.20 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18.20.4-alpine3.20 AS runtime

# user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copie des dépendances
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copie des fichiers
COPY --chown=nextjs:nodejs package*.json ./
COPY --chown=nextjs:nodejs server.js ./

ENV NODE_ENV=production
USER nextjs

EXPOSE 3000

# Health check pour Docker
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/health', (res) => { \
    process.exit(res.statusCode === 200 ? 0 : 1) \
  }).on('error', () => process.exit(1))"

# Démarrage de l'application
CMD ["node", "server.js"]