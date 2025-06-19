<template>
    <div class="vehicles-page">
      <h1>🚗 Lista de Vehículos</h1>
  
      <!-- Buscador -->
      <input v-model="busqueda" placeholder="🔎 Buscar por placa o modelo..." class="search-box" />
  
      <button @click="abrirModal()">➕ Nuevo Vehículo</button>
  
      <div class="vehicle-list">
        <div v-for="vehicle in vehiclesFiltrados" :key="vehicle.Id" class="vehicle-card">
          <h2>{{ vehicle.PlateNumber }}</h2>
          <p><strong>Motorista:</strong> {{ vehicle.DriverName || 'Sin asignar' }}</p>
          <p><strong>Modelo:</strong> {{ vehicle.Model }}</p>
          <p><strong>Año:</strong> {{ vehicle.Year }}</p>
  
          <button @click="abrirModal(vehicle)">✏️ Editar</button>
          <button @click="confirmarEliminar(vehicle.Id)">🗑️ Eliminar</button>
        </div>
      </div>
  
      <!-- Modal Crear/Editar -->
      <div v-if="mostrarModal" class="modal-overlay">
        <div class="modal-content">
          <h2>{{ vehiculoEdit.Id ? 'Editar Vehículo' : 'Nuevo Vehículo' }}</h2>
  
          <form @submit.prevent="guardarVehiculo">
            <input v-model="vehiculoEdit.PlateNumber" placeholder="Número de Placa" required />
            <input v-model="vehiculoEdit.Model" placeholder="Modelo" required />
            <input v-model.number="vehiculoEdit.Year" placeholder="Año" type="number" required />
  
            <button type="submit">{{ vehiculoEdit.Id ? 'Actualizar' : 'Crear' }}</button>
            <button type="button" @click="cerrarModal">Cancelar</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import api from '../services/axios';
  import Swal from 'sweetalert2';
  
  export default {
    data() {
      return {
        vehicles: [],
        mostrarModal: false,
        vehiculoEdit: { Id: null, PlateNumber: '', Model: '', Year: '' },
        busqueda: ''
      };
    },
    async mounted() {
      await this.cargarVehiculos();
    },
    computed: {
      vehiclesFiltrados() {
        if (!this.busqueda.trim()) return this.vehicles;
        const texto = this.busqueda.toLowerCase();
        return this.vehicles.filter(v =>
          v.PlateNumber.toLowerCase().includes(texto) ||
          v.Model.toLowerCase().includes(texto)
        );
      }
    },
    methods: {
      async cargarVehiculos() {
        try {
          const res = await api.get('/vehiculos');
          this.vehicles = res.data;
        } catch (error) {
          console.error('Error al cargar vehículos', error);
        }
      },
      abrirModal(vehicle = null) {
        if (vehicle) {
          this.vehiculoEdit = { ...vehicle };
        } else {
          this.vehiculoEdit = { Id: null, PlateNumber: '', Model: '', Year: '' };
        }
        this.mostrarModal = true;
      },
      cerrarModal() {
        this.mostrarModal = false;
      },
      async guardarVehiculo() {
        try {
          if (this.vehiculoEdit.Id) {
            await api.put(`/vehiculos/${this.vehiculoEdit.Id}`, this.vehiculoEdit);
            Swal.fire('✅ Éxito', 'Vehículo actualizado', 'success');
          } else {
            await api.post('/vehiculos', this.vehiculoEdit);
            Swal.fire('✅ Éxito', 'Vehículo creado', 'success');
          }
          this.cerrarModal();
          await this.cargarVehiculos();
        } catch (error) {
          Swal.fire('❌ Error', 'No se pudo guardar el vehículo', 'error');
          console.error(error);
        }
      },
      confirmarEliminar(id) {
        Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción eliminará el vehículo permanentemente.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then(async (result) => {
          if (result.isConfirmed) {
            await this.eliminarVehiculo(id);
          }
        });
      },
      async eliminarVehiculo(id) {
        try {
          await api.delete(`/vehiculos/${id}`);
          Swal.fire('✅ Eliminado', 'Vehículo eliminado exitosamente.', 'success');
          await this.cargarVehiculos();
        } catch (error) {
          Swal.fire('❌ Error', 'No se pudo eliminar el vehículo.', 'error');
          console.error(error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .vehicles-page {
    max-width: 900px;
    margin: 40px auto;
    padding: 2rem;
    background-color: #f9fbfd;
    border-radius: 10px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  }
  
  h1 {
    text-align: center;
    color: #0077cc;
    margin-bottom: 1rem;
    font-size: 2rem;
  }
  
  button {
    margin: 0.3rem 0.2rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: bold;
    background-color: #1597fa;
    color: white;
  }
  
  button:hover {
    opacity: 0.9;
  }
  
  .vehicle-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.2rem;
  }
  
  .vehicle-card {
    background-color: #ffffff;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.06);
  }
  
  .vehicle-card h2 {
    color: #0077cc;
    margin-bottom: 0.5rem;
  }
  
  .vehicle-card p {
    margin: 0.2rem 0;
    color: #444;
  }
  
  .search-box {
    width: 100%;
    padding: 0.6rem;
    margin-bottom: 1rem;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    width: 400px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  .modal-content h2 {
    margin-bottom: 1rem;
    color: #0284c7;
  }
  
  .modal-content form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .modal-content input,
  .modal-content button {
    padding: 0.6rem;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
  }
  
  .modal-content button {
    background-color: #0ea5e9;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .modal-content button:hover {
    background-color: #0284c7;
  }

  .vehicle-card button {
  padding: 0.4rem 0.8rem;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.vehicle-card button:first-of-type {
  background-color: #1597fa; /* Amarillo suave */
  color: #ffffff;
}

.vehicle-card button:first-of-type:hover {
  background-color: #0062ff;
  box-shadow: 0 2px 8px rgba(250, 191, 36, 0.3);
}

.vehicle-card button:last-of-type {
  background-color: #ef4444; /* Rojo */
  color: white;
}

.vehicle-card button:last-of-type:hover {
  background-color: #dc2626;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
}
  </style>