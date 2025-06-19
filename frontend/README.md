"""# Fleet Monitor – Sistema de Monitoramento de Frotas  
> Full Stack App · Node.js + Express · MSSQL & MongoDB · Vue 3 + Vite

## 📝 Tabla de Contenidos · Índice · Índice
1. [Visión general / Visão geral](#visión-general--visão-geral)
2. [Arquitectura y tecnologías / Arquitetura e tecnologias](#arquitectura-y-tecnologías--arquitetura-e-tecnologias)
3. [Estructura de carpetas / Estrutura de pastas](#estructura-de-carpetas--estrutura-de-pastas)
4. [Instalación & puesta en marcha / Instalação & execução](#instalación--puesta-en-marcha--instalação--execução)
5. [Variables de entorno / Variáveis de ambiente](#variables-de-entorno--variáveis-de-ambiente)
6. [Scripts útiles](#scripts-útiles)
7. [API REST (back-end)](#api-rest-back-end)
8. [Front-end (Vue 3)](#front-end-vue-3)
9. [Simulación de telemetría / Simulação de telemetria](#simulación-de-telemetría--simulação-de-telemetria)
10. [Pruebas / Testes](#pruebas--testes)
11. [Licencia / Licença](#licencia--licença)

---

## Visión general / Visão geral
**ES:** Fleet Monitor es una aplicación full-stack para el seguimiento en tiempo real de flotas de vehículos.  
**PT-BR:** Fleet Monitor é um aplicativo full-stack para rastreamento em tempo real de frotas de veículos.

Funcionalidades principales | Funcionalidades principais
:----------------------------|:---------------------------
🚗 CRUD de vehículos (MSSQL) | 🚗 CRUD de veículos (MSSQL)
👨‍✈️ CRUD de motoristas y asignación a vehículos | 👨‍✈️ CRUD de motoristas e atribuição a veículos
🛠️ CRUD de mantenimientos por vehículo | 🛠️ CRUD de manutenções por veículo
📡 Registro & simulación de telemetría (MongoDB) | 📡 Registro & simulação de telemetria (MongoDB)
🔐 JWT Auth (login básico) | 🔐 JWT Auth (login básico)
🌐 Dashboard Vue 3 con sidebar, cards y estilos responsivos | 🌐 Dashboard Vue 3 com sidebar, cards e estilos responsivos

---

## Arquitectura y tecnologías / Arquitetura e tecnologias
Componente | Stack / Libs
-----------|--------------
**Back-end API** | Node.js 18 · Express 4 · JSON Web Token · Morgan · Cors
**Bases de datos** | **MSSQL** (vehículos, motoristas, mantenimientos) – Docker SQL Server 2019  
| **MongoDB Atlas / local** (telemetría)
**ORM / Drivers** | `mssql` (pool de conexiones) · `mongoose` (ODM)
**Colas (simulación)** | `setInterval` (demostración) – puede migrarse a BullMQ
**Front-end** | Vite + Vue 3 Composition API · Vue Router 4 · Axios · SweetAlert2
**Arquitectura** | Clean Architecture (domain · application · infrastructure · interfaces)

---

## Estructura de carpetas / Estrutura de pastas
```text
.
├── backend/
│   ├── config/           # Conexiones MSSQL & Mongo
│   ├── domain/           # Entidades
│   ├── application/      # Casos de uso
│   ├── infrastructure/
│   │   ├── mongo/        # TelemetryModel.js
│   │   └── ...
│   ├── interfaces/
│   │   ├── controllers/  # vehicleController, driverController...
│   │   └── routes/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── layouts/
    │   ├── pages/
    │   └── services/
    └── vite.config.js
```

---

## Instalación & puesta en marcha / Instalação & execução
### 1. Clonar y variables
```bash
git clone <repo>
cd fleet-monitor
cp .env.example .env
```
### 2. Back‑end
```bash
cd backend
npm i
docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=Password123!' -p 1433:1433 --platform linux/arm64/v8 --name sqlserver -d mcr.microsoft.com/mssql/server:2019-latest
npm run dev
```
### 3. Front‑end
```bash
cd ../frontend
npm i
npm run dev
```

---

## Variables de entorno / Variáveis de ambiente
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/monitoramento_frotas
SQL_USER=sa
SQL_PASSWORD=Password123!
SQL_DATABASE=FleetMonitoring
SQL_SERVER=localhost
JWT_SECRET=supersecreto123
```

---

## Scripts útiles
Comando | Descripción
--------|------------
`npm run dev` | nodemon backend
`npm test`    | placeholder tests
`npm run lint`| ESLint

---

## API REST (back‑end)
Método | Ruta | Descripción
-------|------|------------
POST | /auth/login | login → token
GET  | /vehiculos | listar
POST | /vehiculos | crear
PUT  | /vehiculos/:id | editar
DELETE| /vehiculos/:id | eliminar
POST | /vehiculos/:id/assign-driver | asignar motorista
GET  | /motoristas | listar
GET  | /motoristas/con-vehiculos | mot. + vehículos
POST | /mantenimientos | crear
GET  | /mantenimientos | listar
POST | /telemetria | registrar
GET  | /telemetria | listar enriquecido

Todas requieren **Bearer JWT** salvo `/auth`.

---

## Front‑end (Vue 3)
- Layout global con Sidebar + Topbar.
- Páginas: Vehículos, Motoristas, Mantenimientos, Telemetría.
- Axios: token persistente en `localStorage`.

---

## Simulación de telemetría
Botón **🚀 Iniciar Simulación** ⇒ inserta lecturas aleatorias cada 3 s para todas las tarjetas y las resalta.  
**🛑 Detener** para parar.

---

## Pruebas / Testes
Jest + Supertest (unit & integration).

---

## Licencia / Licença
MIT © 2025 — Leandro Manuel Pérez Montaña 
"""
path = "/mnt/data/README.md"
with open(path, "w", encoding="utf-8") as f:
    f.write(readme_content)
path