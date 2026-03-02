# Checkout Onboarding Platform

**Prueba técnica FullStack**: Plataforma de pagos integrada con pasarela local, diseñada con un flujo de 5 pasos y optimizada para dispositivos móviles (iOS/Safari).

🚀 **Despliegue en vivo**: [https://dev.julio-bonifacio.com/](https://dev.julio-bonifacio.com/)
📖 **Documentación API (Swagger)**: [https://backend-ecommerce.julio-bonifacio.com/api/docs](https://backend-ecommerce.julio-bonifacio.com/api/docs)

---

## 🎥 Demos

Para una mejor visualización, puedes ver los vídeos demo aquí:

- 💻 [**Ver Video Demo Desktop**](./assets/desktop-demo.mp4)
- 📱 [**Ver Video Demo Mobile (Safari/iOS)**](./assets/mobile-demo.mp4)

---

## 🛠️ Guía de Instalación y Uso

### 1. Clonar el repositorio
```bash
git clone https://github.com/JuliCesar2022/checkout-onboarding-platform.git
cd checkout-onboarding-platform
```

### 2. Configuración de Variables de Entorno
Debes crear los archivos `.env` siguiendo los ejemplos:
- **Root**: Copia/crea un `.env` en la raíz si es necesario para Docker.
- **Frontend**: `frontend/.env.local` (Ver [Frontend README](./frontend/README.md))
- **Backend**: `backend/.env` (Ver [Backend README](./backend/README.md))

### 3. Ejecución con Docker (Recomendado)
Levanta todo el ecosistema (Base de datos, Backend y Frontend) con un solo comando:

```bash
docker-compose up --build
```
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3000/api`
- **Swagger**: `http://localhost:3000/api/docs`

---

## 🏗️ Arquitectura del Monorepo

```bash
checkout-onboarding-platform/
├── frontend/    # React 19 SPA + Redux Toolkit + Tailwind v4
├── backend/     # NestJS API + TypeORM + PostgreSQL
├── assets/      # Recursos de documentación (videos, imágenes)
└── docker-compose.yml
```

---

## 📚 Documentación por Módulo

Para detalles técnicos avanzados, consulta los README específicos:

- 💻 [**Frontend README**](./frontend/README.md): React arquitectura y mobile UX.
- ⚙️ [**Backend README**](./backend/README.md): Endpoints, Schema DB y Tests.

🚀 **Node.js v24** | **PostgreSQL** | **React 19** | **NestJS 11**

---
**Desarrollado como prueba técnica | 2026**
