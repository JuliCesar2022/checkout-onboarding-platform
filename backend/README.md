# Backend - Checkout API

API robusta construida con **NestJS 11** siguiendo principios de **Clean Architecture** para gestionar transacciones, productos y sincronización de pagos.

## 🚀 Guía de Instalación (Manual)

### 1. Requisitos
- **Node.js**: v24
- **Database**: PostgreSQL (vía Prisma ORM)

### 2. Instalación y Setup
```bash
cd backend
npm install

# Generar cliente de Prisma
npx prisma generate

# Aplicar migraciones y poblar base de datos (Seed)
npx prisma migrate dev
npx prisma db seed
```

### 3. Configuración (.env)
Crea un archivo `.env` en la carpeta `backend/` con las siguientes variables:

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `DATABASE_URL` | Conexión a PostgreSQL | `postgresql://user:pass@localhost:5432/db` |
| `PORT` | Puerto del servidor (Def: 3000) | `3000` |
| `FRONTEND_URL` | URL permitida por CORS | `http://localhost:5173` |
| `PRIVATE_KEY` | Llave para firmas de pago | `prv_test_...` |

### 4. Ejecución
```bash
# Modo desarrollo con auto-reload
npm run start:dev

# Ejecutar todas las pruebas unitarias
npm test
```

## 🏗️ Arquitectura del Sistema

El backend está organizado en módulos siguiendo un patrón de **Capas**:
- **Domain**: Entidades y reglas de negocio puras.
- **Application**: Servicios, casos de uso y lógica de orquestación.
- **Infrastructure**: Implementaciones técnicas (Prisma, Adapters de Pago, Repositorios).

### Estructura de Módulos
- `products`: Catálogo, stock e imágenes.
- `transactions`: Core del proceso de pago y generación de firmas.
- `payment`: Adaptadores para comunicación con la pasarela.
- `customers` & `deliveries`: Gestión de perfiles y logística de envío.

## 📊 Modelo de Datos (ERD)

![Modelo de Datos](../assets/database-schema.png)

## 🌐 Endpoints Principales (REST API)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **GET** | `/api/products` | Lista de productos con stock y categorías. |
| **POST** | `/api/transactions` | Inicia un proceso de pago. Genera montos y firmas. |
| **GET** | `/api/transactions/:id` | Consulta el estado final del pago (Polling). |
| **GET** | `/api/categories` | Árbol jerárquico de categorías de productos. |

> **Swagger UI**: Documentación interactiva completa disponible en `http://localhost:3000/api/docs`.

## 📁 Estructura de Carpetas

```bash
backend/
├── src/
│   ├── modules/          # Lógica de negocio (FSD-ish)
│   │   ├── products/     # Catálogo y stock
│   │   ├── transactions/ # Requerimiento core de pagos
│   │   └── ...
│   ├── prisma/           # Schema y migraciones
│   └── main.ts           # Punto de entrada
└── test/                 # E2E Tests
```

## ✅ Estado de Pruebas Unitarias
Se cuenta con una base sólida de pruebas para asegurar la integridad de la lógica de negocio.

### Resultado de la última ejecución:
```text
Test Suites: 18 passed, 19 total
Tests:       56 passed, 63 total
Snapshots:   0 total
Time:        25.89 s
```
*Nota: Se están refinando los adapters de integración para completar el 100% de éxito en todas las suites.*

---
[Volver al inicio](../README.md)
