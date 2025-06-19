-- 📌 Crear base de datos (opcional, si el usuario aún no tiene la BD creada)
CREATE DATABASE FleetMonitorDB;
GO
USE FleetMonitorDB;
GO

-- 🚗 Tabla de Vehículos
CREATE TABLE Vehicles (
    Id INT PRIMARY KEY IDENTITY(1,1),
    PlateNumber NVARCHAR(50) NOT NULL,
    Model NVARCHAR(100) NOT NULL,
    Year INT NOT NULL,
    DriverId INT NULL -- Relación opcional, puede ir como FK
);
GO

-- 👨‍✈️ Tabla de Motoristas
CREATE TABLE Drivers (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    LicenseNumber NVARCHAR(50) NOT NULL
);
GO

-- 🛠️ Tabla de Mantenimientos
CREATE TABLE Maintenances (
    Id INT PRIMARY KEY IDENTITY(1,1),
    VehicleId INT NOT NULL,
    Description NVARCHAR(255) NOT NULL,
    MaintenanceDate DATE NOT NULL,
    FOREIGN KEY (VehicleId) REFERENCES Vehicles(Id)
);
GO

-- 🚨 Datos de prueba (opcional)
INSERT INTO Drivers (Name, LicenseNumber) VALUES
('Carlos Martinez', 'LIC123'),
('Laura Silva', 'LIC456');

INSERT INTO Vehicles (PlateNumber, Model, Year, DriverId) VALUES
('ABC-123', 'Toyota Corolla', 2019, 1),
('LMN-456', 'Ford Ranger', 2021, 2);

INSERT INTO Maintenances (VehicleId, Description, MaintenanceDate) VALUES
(1, 'Cambio de aceite', '2025-06-01'),
(2, 'Revisión de frenos', '2025-06-10');
GO