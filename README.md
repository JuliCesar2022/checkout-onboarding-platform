# Wompi Checkout Onboarding Platform

**Prueba técnica FullStack**: Plataforma de pagos integrada con Wompi, diseñada con un flujo de 5 pasos y optimizada para dispositivos móviles (iOS/Safari).

## 📋 Descripción del Proyecto

Esta aplicación permite gestionar un proceso de compra completo:
1.  **Catálogo**: Selección de productos con gestión de stock en tiempo real.
2.  **Información de Envío**: Formulario validado para datos de entrega.
3.  **Pago con Tarjeta**: Integración segura para tokenización de tarjetas.
4.  **Resumen y Revisión**: Desglose detallado de cargos (fees) y total.
5.  **Estado de Transacción**: Polling en tiempo real del estado en Wompi (Aprobado/Rechazado).

## 🏗️ Arquitectura del Monorepo

```bash
checkout-onboarding-platform/
├── frontend/    # React 19 SPA + Redux Toolkit + Tailwind v4
├── backend/     # NestJS API + TypeORM + PostgreSQL
└── docker-compose.yml
```

## 🚀 Inicio Rápido con Docker

Para levantar todo el ecosistema (Base de datos, Backend y Frontend):

```bash
docker-compose up --build
```

El sistema estará disponible en:
-   **Frontend**: `http://localhost:5173`
-   **Backend API**: `http://localhost:3000/api`

---

## 📚 Documentación Detallada

Para detalles específicos de cada módulo, consulta sus respectivos manuales:

### 💻 [Frontend README](./frontend/README.md)
*Arquitectura, manejo de estado con Redux, componentes UI y optimizaciones para Safari/iOS.*

### ⚙️ [Backend README](./backend/README.md)
*Endpoints de la API, integración con Wompi, modelos de base de datos y lógica de polling.*

---

## 🛠️ Tecnologías Principales

-   **Frontend**: React 19, Vite, Redux Toolkit, Tailwind CSS v4, Jest.
-   **Backend**: NestJS 11, TypeScript, TypeORM, PostgreSQL.
-   **Infraestructura**: Docker, Docker Compose.

---
**Desarrollado como prueba técnica | 2026**
