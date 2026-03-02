# Frontend - Checkout SPA

Single Page Application (SPA) de alto rendimiento construida con **React 19** y **Vite**, optimizada para una experiencia de pago fluida y segura.

## 🚀 Guía de Instalación (Manual)

### 1. Requisitos
- **Node.js**: v24
- **Administrador de paquetes**: npm o yarn

### 2. Configuración
```bash
cd frontend
npm install

# Configura las variables de entorno
cp .env.example .env.local
```

### 3. Variables de Entorno (.env.local)

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | URL del Backend API | `http://localhost:3000/api` |
| `VITE_PUB_KEY` | Llave pública de la pasarela | `pub_test_...` |

### 4. Ejecución
```bash
# Servidor de desarrollo
npm run dev

# Construcción de producción
npm run build

# Ejecutar tests unitarios
npm test
```

## 🏗️ Arquitectura y Decisiones Técnicas

El proyecto utiliza una estructura inspirada en **Feature-Sliced Design (FSD)** para mantener la escalabilidad y bajo acoplamiento:

- **`features/`**: Lógica de negocio por dominio (`checkout`, `cart`, `products`). Cada feature contiene sus componentes, slices de Redux y hooks propios.
- **`shared/`**: Componentes UI atómicos (Button, Input), utilidades globales y configuración de la API.
- **`pages/`**: Composición final de las vistas de la aplicación.

### Gestión de Estado (Redux Toolkit)
Se utiliza Redux para orquestar el flujo de compra:
- **`checkoutSlice`**: Maneja el progreso del stepper (Envío -> Pago -> Resumen).
- **`cartSlice`**: Gestiona el carrito de compras persistente.
- **Persistencia**: Implementado con `redux-persist` para asegurar que el progreso no se pierda al recargar la página.

## 📱 UX/UI Premium y Mobile First

Este frontend ha sido diseñado con un enfoque **Mobile-First**, priorizando dispositivos iOS/Safari:

1.  **Safe Area Support**: Implementación de `env(safe-area-inset-bottom)` en layouts críticos para evitar interferencias con la UI del navegador.
2.  **React Portals**: El resumen de pedido (`OrderSummaryBackdrop`) utiliza Portals para renderizarse sobre toda la jerarquía de componentes, garantizando cobertura total.
3.  **Glassmorphism**: Uso de `backdrop-blur` y capas translúcidas para un acabado estético moderno y premium.
4.  **Validación de Tarjetas**: Implementación del **Algoritmo de Luhn** para validación en tiempo real de números de tarjeta.

## ✅ Pruebas Unitarias

Se mantiene un estándar de calidad riguroso con **Jest** y **React Testing Library**.

### Último resultado:
```text
Test Suites: 12 passed, 12 total
Tests:       78 passed, 78 total
Snapshots:   0 total
Time:        38.237 s
```
*Cobertura completa en validaciones, cálculos de fees y componentes de UI.*

---
[Volver al inicio](../README.md)
