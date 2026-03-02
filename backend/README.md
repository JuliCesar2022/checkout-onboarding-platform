# Backend - Wompi Checkout API

API robusta construida con **NestJS 11** para gestionar transacciones, productos y sincronización con Wompi.

## 🚀 Comandos de Desarrollo

```bash
# Instalación
npm install

# Iniciar en modo watch
npm run start:dev

# Ejecutar tests
npm run test
```

## 🛠️ Funcionalidades Principales

### 1. Integración con Wompi
- **Integridad de Datos**: Generación de firmas para asegurar que los montos no sean alterados.
- **Polling de Estado**: Mecanismo automático para consultar el estado final de una transacción (APPROVED/DECLINED) cuando Wompi termina el procesamiento.

### 2. Gestión de Productos y Stock
- Endpoints para consultar disponibilidad y actualizar existencias tras una transacción exitosa.

### 3. Arquitectura Limpia
- Uso de **TypeORM** para una interacción estructurada con la base de datos PostgreSQL.
- Módulos desacoplados para fácil escalabilidad.

## 🔑 Configuración

El archivo `.env` debe configurarse con las llaves privadas de Wompi y las credenciales de la base de datos.

---
[Volver al inicio](../README.md)
