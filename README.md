# Wompi Checkout Onboarding Platform

**Prueba técnica FullStack**: Payment checkout SPA integrada con Wompi.

## 📋 Descripción

Aplicación completa para un proceso de pago de 5 pasos:
1. **Catálogo de productos** - Seleccionar producto y cantidad
2. **Formulario de pago** - Información de tarjeta de crédito + entrega
3. **Resumen** - Desglose de fees y total a pagar
4. **Procesamiento** - Transacción con Wompi
5. **Resultado** - Confirmación APROBADA/RECHAZADA

## 🏗️ Estructura

```
checkout-onboarding-platform/
├── backend/              # NestJS API (en desarrollo)
│   ├── src/
│   ├── package.json
│   └── README.md
├── frontend/             # React SPA (skeleton completado)
│   ├── src/
│   ├── package.json
│   └── README.md
├── .gitignore           # Configuración Git para el monorepo
├── GIT_SETUP.md         # Guía para inicializar repositorio
└── README.md            # Este archivo
```

## 🚀 Inicio rápido

### Frontend

```bash
cd frontend
npm install              # Ya hecho
npm run dev              # http://localhost:5173
npm run build
npm test
```

### Backend

```bash
cd backend
npm install
npm run start:dev        # http://localhost:3000
npm test
```

## 📚 Documentación

- **[Frontend README](./frontend/README.md)** - React arquitectura, rutas, Redux state
- **[Backend README](./backend/README.md)** - NestJS endpoints, modelos, base de datos (por hacer)
- **[Git Setup](./GIT_SETUP.md)** - Cómo inicializar y usar el repositorio

## 🛠️ Tech Stack

### Frontend
- **React 19** + Vite (SPA)
- **Redux Toolkit** + redux-persist (state management)
- **React Router v7** (routing)
- **Tailwind CSS v4** (styling)
- **Jest + TypeScript** (testing)

### Backend
- **NestJS 11** (framework)
- **TypeScript** (lenguaje)
- **PostgreSQL** (recomendado) o DynamoDB
- **TypeORM** (ORM)
- **Jest** (testing)

### Deployment
- **Frontend**: AWS S3 + CloudFront (SPA)
- **Backend**: AWS Lambda, ECS, o Fargate (API)

## 📍 Rutas Frontend

| Ruta | Componente | Paso |
|------|-----------|------|
| `/` | ProductsPage | 1 - Catálogo |
| `/checkout` | CheckoutPage | 2, 3, 4 - Formulario, Resumen, Cargando |
| `/status` | TransactionStatusPage | 5 - Resultado |

**Navegación:** Click en los links de la barra superior para navegar.

## 🔐 Variables de entorno

### Frontend (`frontend/.env.local`)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WOMPI_PUBLIC_KEY=pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7
VITE_WOMPI_BASE_URL=https://api-sandbox.co.uat.wompi.dev/v1
```

### Backend (`backend/.env.local`)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/checkout_db
WOMPI_PRIVATE_KEY=prv_stagtest_5i0ZGIGiFcDQifYsXxvsny7Y37tKqFWg
```

## ✅ Estado actual

### Frontend ✓ Completado
- [x] Estructura Vite + React 19
- [x] Redux store (3 slices: products, checkout, transaction)
- [x] React Router (3 rutas)
- [x] Componentes skeleton (Button, Input, Modal, Backdrop, etc.)
- [x] Páginas skeleton (ProductsPage, CheckoutPage, TransactionStatusPage)
- [x] Navegación UI con links clickeables
- [x] Utilities (cardValidation, feeCalculator, currencyFormat)
- [x] 16 tests pasando
- [x] Tailwind CSS v4 configurado
- [x] Build sin errores

### Frontend 🔄 Por hacer
- [ ] Implementar estilos Tailwind en componentes
- [ ] Implementar CardForm con validaciones (react-hook-form + zod)
- [ ] Implementar DeliveryForm
- [ ] Integración con Wompi API (tokenización)
- [ ] Componente tests
- [ ] E2E tests

### Backend ⚠️ Por hacer (boilerplate vacío)
- [ ] Módulos: Products, Customers, Transactions, Deliveries
- [ ] Base de datos con TypeORM
- [ ] Seed con productos dummy
- [ ] API endpoints
- [ ] Wompi integration
- [ ] Tests

## 💯 Requisitos del test

| Requisito | Puntos | Estado |
|-----------|--------|--------|
| README completado | 5 | ✓ |
| Imágenes rápidas + UI/UX | 5 | 🔄 |
| Full checkout functionality | 20 | 🔄 |
| API funcionando | 20 | ⚠️ |
| >80% test coverage | 30 | 🔄 |
| Deploy en AWS | 20 | ⚠️ |
| **Subtotal** | **100** | **~30-40** |
| **Bonus (OWASP, Responsive, etc.)** | **60** | 🔄 |

**Mínimo para pasar: 100 puntos**

## 🤖 Git Workflow

```bash
# Clonar/inicializar
git clone <repo-url>
cd checkout-onboarding-platform

# Ver guía de setup
cat GIT_SETUP.md

# Crear rama de feature
git checkout -b feature/mi-feature

# Hacer cambios...
git add .
git commit -m "feat: descripción"

# Mergear a develop
git push origin feature/mi-feature
# → Crear Pull Request en GitHub
```

## 📞 Contacto / Preguntas

Para detalles de arquitectura o problemas específicos, revisa:
- `frontend/README.md` - Arquitectura React
- `backend/README.md` - Arquitectura NestJS (próximamente)

---

**Última actualización:** Febrero 2026 | Estado: En desarrollo 🚧
