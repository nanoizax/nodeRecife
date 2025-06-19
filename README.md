
# 📦 Fleet Monitor - Sistema de Gestión de Flotas

Fleet Monitor es un sistema completo para gestión de flotas de vehículos con módulos para vehículos, motoristas, mantenimientos y telemetría en tiempo real. Incluye backend con Express + MSSQL + MongoDB y frontend en Vue 3.

---

## 📑 Contenido del Proyecto

- **Backend:** Node.js + Express + MSSQL + MongoDB (Mongoose)
- **Frontend:** Vue 3 + Axios + SweetAlert2
- **Base de datos SQL:** MSSQL para vehículos, motoristas y mantenimientos
- **Base de datos NoSQL:** MongoDB para telemetría

---

## 🛠️ Requisitos Previos

### Software necesario antes de comenzar:

- Node.js >= 18.x.x
- NPM >= 8.x.x
- SQL Server (MSSQL) configurado y en funcionamiento
- MongoDB en ejecución (local o Atlas)
- Visual Studio Code (opcional pero recomendado)
- Postman o Insomnia (para pruebas de API)

---

## ⚙️ Configuración de Base de Datos

### 📍 MSSQL (SQL Server):

1. Crear una base de datos nueva llamada por ejemplo: `FleetMonitorDB`.
2. Crear las tablas necesarias:

- **Tabla `Vehicles`:**
```sql
CREATE TABLE Vehicles (
  Id INT PRIMARY KEY IDENTITY,
  PlateNumber NVARCHAR(50) NOT NULL,
  Model NVARCHAR(100) NOT NULL,
  Year INT NOT NULL,
  DriverId INT NULL
);
```

- **Tabla `Drivers`:**
```sql
CREATE TABLE Drivers (
  Id INT PRIMARY KEY IDENTITY,
  Name NVARCHAR(100) NOT NULL,
  LicenseNumber NVARCHAR(50) NOT NULL
);
```

- **Tabla `Maintenances`:**
```sql
CREATE TABLE Maintenances (
  Id INT PRIMARY KEY IDENTITY,
  VehicleId INT NOT NULL,
  Description NVARCHAR(255) NOT NULL,
  MaintenanceDate DATE NOT NULL
);
```

> **⚠️ Nota:** Asegúrate de tener el usuario, contraseña y puerto del servidor MSSQL.

### 📍 MongoDB:

1. Tener MongoDB ejecutándose local o en MongoDB Atlas.
2. Crear una base de datos por ejemplo: `FleetMonitorMongo`.
3. No hace falta crear colecciones manualmente. Mongoose las creará.

---

## 🧱 Estructura de Carpetas

```
backend/
  ├─ config/
  ├─ interfaces/
  ├─ infrastructure/
  ├─ middlewares/
  └─ server.js

frontend/
  ├─ src/
      ├─ pages/
      ├─ components/
      └─ services/
```

---

## ⚙️ Configuración de Variables de Entorno `.env`

Crear un archivo `.env` en el backend:

```
MSSQL_USER=tu_usuario_sql
MSSQL_PASSWORD=tu_contraseña_sql
MSSQL_SERVER=localhost
MSSQL_DATABASE=FleetMonitorDB
MONGODB_URI=mongodb://localhost:27017/FleetMonitorMongo
PORT=3000
JWT_SECRET=una_clave_secreta
```

---

## ▶️ Pasos para Ejecutar el Proyecto

### Backend:

1. Ir a la carpeta `backend/`
2. Instalar dependencias:

```
npm install
```

3. Iniciar el servidor:

```
npm run dev
```

Esto levantará el servidor Express en el puerto 3000.

### Frontend:

1. Ir a la carpeta `frontend/`
2. Instalar dependencias:

```
npm install
```

3. Levantar el frontend:

```
npm run dev
```

Esto abrirá el Vue App normalmente en el puerto 5173 (Vite).

---

## ✅ Módulos Incluidos

- **Módulo Vehículos:** CRUD completo.
- **Módulo Motoristas:** CRUD completo + asignación a vehículo.
- **Módulo Mantenimientos:** CRUD completo con selección de vehículos existentes.
- **Módulo Telemetría:** Registro de telemetrías por vehículo y motorista + Simulación en tiempo real.

---

## 🔗 Endpoints principales del Backend

| Módulo | Endpoint |
|------|----|
| Auth | `/auth/login` |
| Vehículos | `/vehiculos` |
| Motoristas | `/motoristas` |
| Mantenimientos | `/mantenimientos` |
| Telemetría | `/telemetria` |

---

## 🚀 Funcionalidad Especial

### Simulación Global de Telemetría

- Un botón en el módulo Telemetría inicia una simulación en tiempo real que genera cambios de ubicación y velocidad para todas las telemetrías activas.

---

## 👨‍💻 Autor

Proyecto desarrollado por Leandro Manuel Pérez para prácticas y demostración de arquitectura de proyectos backend + frontend + múltiples bases de datos.

---
