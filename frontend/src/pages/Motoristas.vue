<template>
    <div class="drivers-page">
      <h1>👨‍✈️ Gestión de Motoristas y Asignaciones / Gestão de Motoristas e Atribuições</h1>
  
      <!-- Crear nuevo motorista / Criar novo motorista -->
      <div class="new-driver-form">
        <input v-model="newDriverName" placeholder="Nombre del nuevo motorista / Nome do novo motorista..." />
        <input v-model="newDriverLicense" placeholder="Número de licencia / Número da carteira..." />
        <button @click="createDriver">➕ Crear Motorista / Criar Motorista</button>
      </div>
  
      <!-- Lista de motoristas / Lista de motoristas -->
      <div class="driver-list">
        <div v-for="driver in drivers" :key="driver.Id" class="driver-card">
          <h2>{{ driver.Name }}</h2>
          <p><strong>Licencia:</strong> {{ driver.LicenseNumber }}</p>
  
          <h4>🚗 Vehículos asignados / Veículos atribuídos:</h4>
          <ul v-if="driver.vehicles.length > 0">
            <li v-for="vehicle in driver.vehicles" :key="vehicle.Id">
              {{ vehicle.PlateNumber }} - {{ vehicle.Model }} ({{ vehicle.Year }})
              <button class="btn-remove" @click="unassignVehicle(vehicle.Id)">❌ Quitar / Remover</button>
            </li>
          </ul>
          <p v-else>Sin vehículos asignados / Sem veículos atribuídos.</p>
  
          <!-- Asignar vehículo / Atribuir veículo -->
          <div class="assign-section">
            <select v-model="selectedVehicle[driver.Id]">
              <option disabled value="">Selecciona un vehículo / Selecione um veículo</option>
              <option v-for="vehicle in availableVehicles" :key="vehicle.Id" :value="vehicle.Id">
                {{ vehicle.PlateNumber }} - {{ vehicle.Model }}
              </option>
            </select>
            <p></p>
            <div class="assign-button-container">
                <button class="btn-assign" @click="assignDriver(driver.Id)">✅ Asignar Vehículo / Atribuir Veículo</button>
            </div>            
          </div>
  
          <!-- Acciones del motorista / Ações do motorista -->
          <div class="driver-actions">
            <button class="btn-edit" @click="editDriver(driver)">✏️ Editar</button>
            <button class="btn-delete" @click="deleteDriver(driver.Id)">🗑️ Eliminar / Deletar</button>
          </div>
        </div>
      </div>
  
      <!-- Modal de edición / Modal de edição -->
      <div v-if="editingDriver" class="modal">
        <div class="modal-content">
          <h3>✏️ Editar Motorista / Editar Motorista</h3>
          <input v-model="editingDriver.Name" placeholder="Nuevo nombre / Novo nome..." />
          <input v-model="editingDriver.LicenseNumber" placeholder="Nuevo número de licencia / Novo número da carteira..." />
          <div class="modal-buttons">
            <button class="btn-save" @click="saveDriverEdit">💾 Guardar / Salvar</button>
            <button class="btn-cancel" @click="cancelEdit">❌ Cancelar / Cancelar</button>
          </div>
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
        drivers: [],
        vehicles: [],
        selectedVehicle: {},
        newDriverName: '',
        newDriverLicense: '',
        editingDriver: null
      };
    },
    computed: {
      // Filtrar vehículos disponibles (no asignados) / Filtrar veículos disponíveis (não atribuídos)
      availableVehicles() {
        return this.vehicles.filter(vehicle => !vehicle.DriverId);
      }
    },
    async mounted() {
      await this.loadDrivers();
      await this.loadVehicles();
    },
    methods: {
      // Cargar motoristas / Carregar motoristas
      async loadDrivers() {
        try {
          const res = await api.get('/motoristas/con-vehiculos');
          this.drivers = res.data;
        } catch (error) {
          Swal.fire('❌ Error', 'No se pudo cargar la lista de motoristas. / Não foi possível carregar a lista de motoristas.', 'error');
        }
      },
      // Cargar vehículos / Carregar veículos
      async loadVehicles() {
        try {
          const res = await api.get('/vehiculos');
          this.vehicles = res.data;
        } catch (error) {
          Swal.fire('❌ Error', 'No se pudo cargar la lista de vehículos. / Não foi possível carregar a lista de veículos.', 'error');
        }
      },
      // Crear motorista / Criar motorista
      async createDriver() {
        if (!this.newDriverName.trim() || !this.newDriverLicense.trim()) {
          return Swal.fire('⚠️ Atención', 'Nombre y licencia son obligatorios. / Nome e licença são obrigatórios.', 'warning');
        }
        try {
          await api.post('/motoristas', {
            Name: this.newDriverName,
            LicenseNumber: this.newDriverLicense
          });
          this.newDriverName = '';
          this.newDriverLicense = '';
          await this.loadDrivers();
          await this.loadVehicles();
          Swal.fire('✅ Éxito', 'Motorista creado correctamente. / Motorista criado com sucesso.', 'success');
        } catch (error) {
          Swal.fire('❌ Error', 'No se pudo crear el motorista. / Não foi possível criar o motorista.', 'error');
        }
      },
      // Eliminar motorista / Deletar motorista
      async deleteDriver(id) {
        const confirm = await Swal.fire({
            title: '¿Eliminar motorista? / Excluir motorista?',
            text: 'Esta acción no se puede deshacer / Esta ação não pode ser desfeita.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar / Sim, excluir'
        });

        if (confirm.isConfirmed) {
            try {
            await api.delete(`/motoristas/${id}`);
            await this.loadDrivers();
            Swal.fire('✅ Eliminado', 'Motorista eliminado correctamente / Motorista excluído com sucesso.', 'success');
            } catch (error) {
            if (error.response && error.response.status === 400) {
                Swal.fire('❌ Error', error.response.data.error, 'error');
            } else {
                Swal.fire('❌ Error', 'Ocurrió un error al eliminar / Ocorreu um erro ao excluir.', 'error');
            }
            }
        }
        },
      // Editar motorista / Editar motorista
      editDriver(driver) {
        this.editingDriver = { ...driver };
      },
      // Guardar edición / Salvar edição
      async saveDriverEdit() {
        if (!this.editingDriver.Name.trim() || !this.editingDriver.LicenseNumber.trim()) {
          return Swal.fire('⚠️ Atención', 'Nombre y licencia son obligatorios. / Nome e licença são obrigatórios.', 'warning');
        }
        await api.put(`/motoristas/${this.editingDriver.Id}`, {
          Name: this.editingDriver.Name,
          LicenseNumber: this.editingDriver.LicenseNumber
        });
        this.editingDriver = null;
        await this.loadDrivers();
        await this.loadVehicles();
        Swal.fire('✅ Actualizado', 'Motorista actualizado. / Motorista atualizado.', 'success');
      },
      cancelEdit() {
        this.editingDriver = null;
      },
      // Desasignar vehículo / Remover veículo
      async unassignVehicle(vehicleId) {
        await api.post(`/vehiculos/${vehicleId}/assign-driver`, { driverId: null });
        await this.loadDrivers();
        await this.loadVehicles();
        Swal.fire('✅ Actualizado', 'Vehículo desasignado. / Veículo removido.', 'success');
      },
      // Asignar vehículo a motorista / Atribuir veículo ao motorista
      async assignDriver(driverId) {
        const vehicleId = this.selectedVehicle[driverId];
        if (!vehicleId) {
          return Swal.fire('⚠️ Atención', 'Selecciona un vehículo primero. / Selecione um veículo primeiro.', 'warning');
        }
        try {
          await api.post(`/vehiculos/${vehicleId}/assign-driver`, { driverId });
          this.selectedVehicle[driverId] = '';
          await this.loadDrivers();
          await this.loadVehicles();
          Swal.fire('✅ Asignado', 'Vehículo asignado. / Veículo atribuído.', 'success');
        } catch (error) {
          Swal.fire('❌ Error', 'No se pudo asignar el motorista. / Não foi possível atribuir o motorista.', 'error');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* 🟢 Contenedor principal / Container principal */
  .drivers-page {
    max-width: 1100px;
    margin: 2rem auto;
    padding: 1rem;
  }
  
  /* 🟢 Título / Título */
  h1 {
    text-align: center;
    color: #2563eb;
    margin-bottom: 1.5rem;
  }
  
  /* 🟢 Formulario de creación de motorista / Formulário de criação de motorista */
  .new-driver-form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  input {
    flex: 1;
    padding: 0.6rem;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
  }
  
  /* 🟢 Estilo general de botones / Estilo geral dos botões */
  button {
    padding: 0.6rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    border: none;
  }
  
    /* 🟢 Contenedor general de la lista de motoristas / Container geral da lista de motoristas */
    .driver-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* ✅ Máximo 3 por fila si el ancho da */
    gap: 1rem;
    margin-top: 1rem;
    }

    /* 🟢 Tarjeta individual de motorista / Cartão individual de motorista */
    .driver-card {
    background: #f0f9ff;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    }
  
  .driver-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
  
  .driver-card h2 {
    color: #0077cc;
    margin-bottom: 0.5rem;
  }
  
  .driver-card p {
    margin: 0.2rem 0;
    color: #444;
  }
  
  /* 🟢 Acciones de cada motorista / Ações de cada motorista */
  .driver-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.8rem;
  }
  
  .btn-edit {
    background-color: #3b82f6;
    color: white;
  }
  
  .btn-delete {
    background-color: #ef4444;
    color: white;
  }
  
  .btn-remove {
    background-color: #f87171;
    color: white;
    border: none;
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    margin-left: 0.5rem;
  }
  
/* 🟢 Sección de asignación de vehículo / Seção de atribuição de veículo */
.assign-section {
  margin-top: 0.7rem;
  display: flex;
  flex-direction: column; /* ✅ Esto hace que el botón baje debajo del select */
  gap: 0.5rem;
}

.assign-section select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
}
  
/* 🟢 Botón Asignar vehículo / Botão Atribuir veículo */
.btn-assign {
  background-color: #22c55e;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  text-align: center;
  margin-top: 0.5rem;
}

.btn-assign:hover {
  background-color: #16a34a;
}

/* 🟢 Contenedor botones Editar y Eliminar / Container botões Editar e Deletar */
.driver-actions {
  margin-top: 0.8rem;
  display: flex;
  gap: 0.5rem;
}
  
  /* 🟢 Modal de edición / Modal de edição */
  .modal {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  .modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
  }
  
  .btn-save {
    background-color: #22c55e;
    color: white;
  }
  
  .btn-cancel {
    background-color: #6b7280;
    color: white;
  }
  </style>