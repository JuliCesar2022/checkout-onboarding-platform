# Frontend - Wompi Checkout SPA

React 19 + Vite + Redux Toolkit + Tailwind CSS v4

## 🚀 Inicio rápido

```bash
# Instalar dependencias (ya hecho)
npm install

# Desarrollo
npm run dev          # http://localhost:5173

# Build
npm run build

# Tests
npm test             # run tests
npm run test:watch   # watch mode
npm run test:coverage
```

## 📍 Rutas disponibles

| Ruta | Componente | Paso | Descripción |
|------|-----------|------|-------------|
| `/` | `ProductsPage` | 1 y 5 | Catálogo de productos + stock |
| `/checkout` | `CheckoutPage` | 2, 3, 4 | Modal de formulario → Backdrop de resumen → Cargando |
| `/status` | `TransactionStatusPage` | 4 | Resultado del pago (APPROVED/DECLINED) |

**Nota:** El `paso` se controla con el Redux `state.checkout.step`:
- `IDLE` → muestra `/`
- `FORM` → muestra modal en `/checkout`
- `SUMMARY` → muestra backdrop en `/checkout`
- `PROCESSING` → muestra loading en `/checkout`
- `COMPLETE` → navega a `/status`

## 📦 Estructura de carpetas

```
src/
├── api/                    # Capa de servicios HTTP (axios)
│   ├── client.ts
│   ├── products.api.ts
│   ├── checkout.api.ts
│   └── transactions.api.ts
├── store/                  # Redux Toolkit
│   ├── index.ts           # configureStore + persistor
│   ├── rootReducer.ts
│   ├── persistence.ts     # redux-persist config
│   └── slices/
│       ├── productsSlice.ts
│       ├── checkoutSlice.ts        # ⭐ MÁQUINA DE ESTADOS
│       └── transactionSlice.ts
├── hooks/
│   ├── useAppDispatch.ts
│   ├── useAppSelector.ts
│   ├── useCheckoutFlow.ts  # Recuperación de estado en refresh
│   └── useCardValidation.ts
├── pages/
│   ├── ProductsPage/
│   ├── CheckoutPage/
│   └── TransactionStatusPage/
├── components/
│   ├── layout/
│   ├── products/
│   ├── checkout/
│   ├── transaction/
│   └── ui/
├── types/                  # Interfaces TypeScript
├── utils/                  # Funciones puras (cardValidation, fees, currency)
├── constants/              # fees, routes, wompi keys
└── styles/                 # Tailwind + globals
```

## 🔑 Variables de entorno

Crear `.env.local` en el directorio `frontend/`:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WOMPI_PUBLIC_KEY=pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7
VITE_WOMPI_BASE_URL=https://api-sandbox.co.uat.wompi.dev/v1
```

## 🏗️ Estado Redux

### 3 Slices principales:

**1. productsSlice**
```typescript
{
  items: Product[];
  selectedProductId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number | null;
}
```

**2. checkoutSlice** ⭐
```typescript
{
  step: 'IDLE' | 'FORM' | 'SUMMARY' | 'PROCESSING' | 'COMPLETE';
  selectedProductId: string | null;
  quantity: number;
  cardData: { number, holderName, expiry, brand, token } | null;
  deliveryAddress: { recipientName, address, city, dept, phone } | null;
  fees: { productAmount, baseFee, deliveryFee, totalAmount } | null;
  wompiAcceptanceToken: string | null;
  error: string | null;
}
```

**3. transactionSlice**
```typescript
{
  id: string | null;
  status: 'APPROVED' | 'DECLINED' | 'PENDING' | 'ERROR' | null;
  reference: string | null;
  amountInCents: number | null;
  createdAt: string | null;
  loadingState: 'idle' | 'submitting' | 'polling' | 'settled';
  error: string | null;
}
```

## 🔐 Seguridad

- **CVV nunca se guarda** en Redux ni localStorage (solo en estado local del componente)
- **Tarjetas enmascaradas**: `4111 **** **** 1111`
- **Tokens de Wompi**: almacenados en Redux (no sensibles)
- **Persistencia selectiva**: redux-persist guarda solo lo necesario

## ✅ Tests

```bash
npm test              # Corre 16 tests (cardValidation + feeCalculator)
npm run test:coverage # Ver cobertura
```

Archivos de test:
- `src/utils/cardValidation.test.ts` - Luhn, Visa/MC detection, expiry
- `src/utils/feeCalculator.test.ts` - Cálculos de fees

**Próximo paso:** Agregar tests a componentes (CardForm, ProductCard, etc.) para llegar a >80% cobertura global.

## 🎨 Tailwind CSS v4

- Configuración en `vite.config.ts` (plugin `@tailwindcss/vite`)
- **No hay `tailwind.config.js`** (no necesario en v4)
- Importación en `src/styles/index.css`: `@import "tailwindcss"`
- Animaciones personalizadas en `src/styles/globals.css`

## 📋 Flujo de 5 pasos

```
1. ProductsPage (/)
   ↓ usuario hace clic "Pay with credit card"

2. CheckoutModal (/checkout, step=FORM)
   ↓ rellena formulario tarjeta + entrega

3. OrderSummaryBackdrop (/checkout, step=SUMMARY)
   ↓ ve desglose de fees

4. TransactionStatusPage (/status, step=COMPLETE)
   ↓ ve resultado APPROVED/DECLINED

5. ProductsPage (/, step=IDLE)
   ↓ stock actualizado
```

## 🔧 TODO (próximas tareas)

### Implementación de componentes UI
- [ ] Estilos Tailwind en todos los componentes
- [ ] Card branding icons (Visa/Mastercard)
- [ ] Modal animations (slideUp)
- [ ] Backdrop animations

### Lógica de formularios
- [ ] CardForm con react-hook-form + zod
- [ ] DeliveryForm validaciones
- [ ] Integración con Wompi tokenization

### Testing
- [ ] Component tests (ProductCard, CardForm, etc.)
- [ ] Integration tests (checkout flow)
- [ ] E2E tests (Playwright/Cypress)
- [ ] Llegar a >80% cobertura global

### Backend integration
- [ ] Conectar API endpoints reales
- [ ] Polling de estado de transacción
- [ ] Manejo de errores Wompi

## 📚 Referencias

- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Redux Persist](https://github.com/rt2zz/redux-persist)
- [Wompi API Docs](https://docs.wompi.co)
- [Tailwind CSS v4](https://tailwindcss.com)
- [React Router v7](https://reactrouter.com)
