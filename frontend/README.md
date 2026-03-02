# Frontend - Wompi Checkout SPA

Esta es una SPA (Single Page Application) construida con **React 19** y **Vite**, enfocada en la experiencia de usuario y el rendimiento.

## 🚀 Comandos de Desarrollo

```bash
# Instalación
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construcción para producción
npm run build

# Ejecutar pruebas unitarias
npm test
```

## 🎨 Características Destacadas

### 1. UX Móvil Premium (Safari/iOS)
- **Responsive-First**: Layouts optimizados para pantallas pequeñas.
- **Safe Area Support**: Uso de `env(safe-area-inset-bottom)` para evitar que el buscador de Safari tape botones críticos.
- **Backdrop Pro**: Resumen de pedido deslizante con efecto de desenfoque (`blur`) y cobertura total de pantalla mediante **React Portals**.

### 2. Gestión de Estado con Redux
- **Máquina de Estados**: El flujo de pago se gestiona mediante un `checkoutSlice` que controla los pasos (Envío, Pago, Resumen).
- **Persistencia**: Uso de `redux-persist` para que el usuario no pierda su progreso al recargar la página.

### 3. Internacionalización
- **100% en Español**: Todos los textos, mensajes de validación y estados están traducidos para el mercado local.

## 📦 Estructura de código

- `src/features`: Lógica de negocio dividida por dominios (cart, checkout, products).
- `src/shared`: Componentes UI reutilizables, hooks globales e interfaces.
- `src/utils`: Validaciones (Luhn para tarjetas) y calculadoras de fees.

---
[Volver al inicio](../README.md)
