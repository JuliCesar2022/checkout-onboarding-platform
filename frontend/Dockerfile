# ─── Stage 1: build ───────────────────────────────────────────────────────────
# Compila el SPA de React con Vite. Node solo se usa aquí, no en producción.
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Las variables VITE_* se inyectan en build time (no en runtime).
# Dokploy las pasa como ARGs desde el panel de configuración.
ARG VITE_API_BASE_URL
ARG VITE_WOMPI_PUBLIC_KEY
ARG VITE_WOMPI_BASE_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_WOMPI_PUBLIC_KEY=$VITE_WOMPI_PUBLIC_KEY
ENV VITE_WOMPI_BASE_URL=$VITE_WOMPI_BASE_URL

RUN npm run build

# ─── Stage 2: runner ──────────────────────────────────────────────────────────
# Nginx alpine sirve los estáticos — sin Node.js en producción.
FROM nginx:alpine AS runner

# Elimina la config default de nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia nuestra config personalizada (soporte para React Router SPA)
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copia el build de Vite
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
