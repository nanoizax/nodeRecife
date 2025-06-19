<template>
    <div class="maintenances-page">
      <h1>🛠️ Historial de Mantenimientos / Histórico de Manutenções</h1>
  
      <!-- Formulario de creación/edición / Formulário de criação/edição -->
      <div class="new-maintenance-form">
        <select v-model="form.VehicleId">
          <option disabled value="">Selecciona un vehículo / Selecione um veículo</option>
          <option v-for="v in vehicles" :key="v.Id" :value="v.Id">
            {{ v.PlateNumber }} - {{ v.Model }} ({{ v.Year }})
          </option>
        </select>
  
        <input v-model="form.Description" placeholder="Descripción / Descrição" />
        <input v-model="form.MaintenanceDate" type="date" />
  
        <button v-if="!form.Id" @click="createMaintenance">➕ Agregar / Adicionar</button>
        <button v-else @click="updateMaintenance">💾 Guardar Cambios / Salvar Alterações</button>
        <button v-if="form.Id" class="btn-cancel" @click="cancelEdit">❌ Cancelar</button>
      </div>
  
      <!-- Lista de mantenimientos / Lista de manutenções -->
      <div class="maintenance-grid">
        <div v-for="m in mantenimientos" :key="m.Id" class="maintenance-card">
          <p><strong>Vehículo ID:</strong> {{ m.VehicleId }}</p>
          <p><strong>Descripción / Descrição:</strong> {{ m.Description }}</p>
          <p><strong>Fecha / Data:</strong> {{ formatDate(m.MaintenanceDate) }}</p>
  
          <div class="card-actions">
            <button class="btn-edit" @click="editMaintenance(m)">✏️ Editar</button>
            <button class="btn-delete" @click="deleteMaintenance(m.Id)">🗑️ Eliminar / Deletar</button>
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
        mantenimientos: [],
        vehicles: [],
        form: {
          Id: null,
          VehicleId: '',
          Description: '',
          MaintenanceDate: ''
        }
      };
    },
    async mounted() {
      await this.loadMaintenances();
      await this.loadVehicles();
    },
    methods: {
      async loadMaintenances() {
        try {
          const res = await api.get('/mantenimientos');
          this.mantenimientos = res.data;
        } catch (error) {
          Swal.fire('❌ Error', 'No se pudieron cargar los mantenimientos.', 'error');
        }
      },
      async loadVehicles() {
        try {
          const res = await api.get('/vehiculos');
          this.vehicles = res.data;
        } catch (error) {
          Swal.fire('❌ Error', 'No se pudo cargar la lista de vehículos.', 'error');
        }
      },
      async createMaintenance() {
        if (!this.form.VehicleId || !this.form.Description || !this.form.MaintenanceDate) {
          return Swal.fire('⚠️ Atención', 'Todos los campos son obligatorios.', 'warning');
        }
        try {
          await api.post('/mantenimientos', this.form);
          await this.loadMaintenances();
          this.resetForm();
          Swal.fire('✅ Éxito', 'Mantenimiento agregado correctamente.', 'success');
        } catch (error) {
          Swal.fire('❌ Error', 'No se pudo agregar el mantenimiento.', 'error');
        }
      },
      async updateMaintenance() {
        try {
          await api.put(`/mantenimientos/${this.form.Id}`, this.form);
          await this.loadMaintenances();
          this.resetForm();
          Swal.fire('✅ Actualizado', 'Mantenimiento actualizado.', 'success');
        } catch (error) {
          Swal.fire('❌ Error', 'No se pudo actualizar el mantenimiento.', 'error');
        }
      },
      async deleteMaintenance(id) {
        const confirm = await Swal.fire({
          title: '¿Eliminar mantenimiento?',
          text: 'Esta acción no se puede deshacer.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar'
        });
        if (confirm.isConfirmed) {
          try {
            await api.delete(`/mantenimientos/${id}`);
            await this.loadMaintenances();
            Swal.fire('✅ Eliminado', 'Mantenimiento eliminado.', 'success');
          } catch (error) {
            Swal.fire('❌ Error', 'No se pudo eliminar el mantenimiento.', 'error');
          }
        }
      },
      editMaintenance(m) {
        this.form = { ...m, MaintenanceDate: m.MaintenanceDate.split('T')[0] };
      },
      cancelEdit() {
        this.resetForm();
      },
      resetForm() {
        this.form = {
          Id: null,
          VehicleId: '',
          Description: '',
          MaintenanceDate: ''
        };
      },
      formatDate(date) {
        return new Date(date).toLocaleDateString();
      }
    }
  };
  </script>
  
  <style scoped>
  .maintenances-page {
    max-width: 1100px;
    margin: 2rem auto;
    padding: 1rem;
  }
  
  h1 {
    text-align: center;
    color: #d97706;
    margin-bottom: 1.5rem;
    font-size: 2rem;
  }
  
  .new-maintenance-form {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .new-maintenance-form input,
  .new-maintenance-form select {
    flex: 1 1 200px;
    padding: 0.6rem;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
  }
  
  .new-maintenance-form button {
    padding: 0.6rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    border: none;
    background-color: #3b82f6;
    color: white;
  }
  
  .btn-cancel {
    background-color: #6b7280;
  }
  
  .maintenance-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .maintenance-card {
    background: #ffffff;
    padding: 1.2rem;
    border-radius: 8px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s;
    text-align: center;
  }
  
  .maintenance-card:hover {
    transform: translateY(-5px);
  }
  
  .card-actions button {
    margin-top: 0.5rem;
    margin-right: 0.5rem;
    padding: 0.4rem 0.8rem;
    border-radius: 5px;
    cursor: pointer;
    border: none;
  }
  
  .btn-edit {
    background-color: #56e16d;
    color: white;
  }
  
  .btn-delete {
    background-color: #ef4444;
    color: white;
  }
  </style>