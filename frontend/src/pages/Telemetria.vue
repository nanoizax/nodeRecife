<template>
    <div class="telemetry-page">
      <h1>📡 Telemetría / Telemetria</h1>
  
      <!-- ▸ Formulario de nueva telemetría / Formulário de nova telemetria -->
      <div class="telemetry-form">
        <select v-model="form.vehicleId">
          <option disabled value="">🚗 Selecciona un vehículo / Selecione um veículo</option>
          <option v-for="v in vehicles" :key="v.Id" :value="v.Id">
            {{ v.PlateNumber }} - {{ v.Model }}
          </option>
        </select>
  
        <select v-model="form.driverId">
          <option disabled value="">👨‍✈️ Selecciona un motorista / Selecione um motorista</option>
          <option v-for="d in drivers" :key="d.Id" :value="d.Id">
            {{ d.Name }}
          </option>
        </select>
  
        <input  v-model="form.lat"   placeholder="Latitud / Latitude"   type="number" step="any" />
        <input  v-model="form.lng"   placeholder="Longitud / Longitude" type="number" step="any" />
        <input  v-model="form.speed" placeholder="Velocidad (km/h)"     type="number" />
  
        <select v-model="form.engineStatus">
          <option disabled value="">Estado motor / Estado do motor</option>
          <option value="on">Encendido / Ligado</option>
          <option value="off">Apagado / Desligado</option>
        </select>
  
        <button class="btn-save" @click="saveTelemetry">
          💾 Guardar Telemetría / Salvar Telemetria
        </button>
      </div>
  
      <!-- ▸ Controles de simulación global / Controles de simulação global -->
      <div class="simulation-controls">
        <button :disabled="isSimulating"  @click="startSimulation">🚀 Iniciar Simulación</button>
        <button :disabled="!isSimulating" @click="stopSimulation">🛑 Detener Simulación</button>
      </div>
  
      <!-- ▸ Tarjetas / Cartões -->
      <div class="telemetry-grid">
        <div
          v-for="t in telemetries"
          :key="t._id"
          :class="['telemetry-card', { simulating: isSimulating }]"
        >
          <p><strong>Vehículo:</strong>   {{ t.vehicle?.PlateNumber || '—' }}</p>
          <p><strong>Motorista:</strong>  {{ t.driver?.Name        || '—' }}</p>
          <p><strong>Coord:</strong>      {{ t.lat }}, {{ t.lng }}</p>
          <p><strong>Velocidad:</strong>  {{ t.speed }} km/h</p>
          <p><strong>Motor:</strong>      {{ t.engineStatus }}</p>
          <p><strong>Hora:</strong>       {{ formatDate(t.timestamp) }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import api  from '../services/axios';
  import Swal from 'sweetalert2';
  
  export default {
    /* ───── Datos / Dados ───── */
    data() {
      return {
        vehicles: [],
        drivers: [],
        telemetries: [],
        isSimulating: false,     // ← bandera de simulación
        simulationInterval: null,
        form: {
          vehicleId:  '',
          driverId:   '',
          lat:        '',
          lng:        '',
          speed:      '',
          engineStatus: ''
        }
      };
    },
  
    /* ───── Carga inicial / Carga inicial ───── */
    async mounted() { await this.loadData(); },
  
    /* ───── Métodos / Métodos ───── */
    methods: {
      /* Cargar vehículos, motoristas y telemetrías */
      async loadData() {
        try {
          const [v, d, t] = await Promise.all([
            api.get('/vehiculos'),
            api.get('/motoristas'),
            api.get('/telemetria')
          ]);
          this.vehicles    = v.data;
          this.drivers     = d.data;
          this.telemetries = t.data;
        } catch (err) {
          console.error(err);
          Swal.fire('❌ Error', 'No se pudieron cargar los datos.', 'error');
        }
      },
  
      /* Guardar telemetría manual */
      async saveTelemetry() {
        const f = this.form;
        if (!f.vehicleId || !f.driverId || !f.lat || !f.lng || !f.speed || !f.engineStatus) {
          return Swal.fire('⚠️ Atención', 'Todos los campos son obligatorios.', 'warning');
        }
        try {
          await api.post('/telemetria', f);
          await this.loadData();
          Object.assign(this.form, { vehicleId:'', driverId:'', lat:'', lng:'', speed:'', engineStatus:'' });
          Swal.fire('✅ Guardado', 'Telemetría registrada.', 'success');
        } catch (err) {
          Swal.fire('❌ Error', err.response?.data?.error || 'Error al guardar.', 'error');
        }
      },
  
      /* Iniciar simulación global */
      startSimulation() {
        this.isSimulating = true;
        Swal.fire('✅ Simulación iniciada', '', 'success');
  
        this.simulationInterval = setInterval(async () => {
          for (const t of this.telemetries) {
            await api.post('/telemetria', {
              vehicleId: t.vehicleId,
              driverId : t.driverId,
              lat  : parseFloat(t.lat) + Math.random()*0.001,
              lng  : parseFloat(t.lng) + Math.random()*0.001,
              speed: Math.floor(Math.random()*100)+10,
              engineStatus: 'on'
            }).catch(console.error);
          }
          await this.loadData();   // refresca la vista
        }, 3000);
      },
  
      /* Detener simulación */
      stopSimulation() {
        clearInterval(this.simulationInterval);
        this.isSimulating = false;
        Swal.fire('🛑 Simulación detenida', '', 'info');
      },
  
      formatDate(d) { return new Date(d).toLocaleString(); }
    }
  };
  </script>
  
  <style scoped>
  /* ---------- layout base ---------- */
  .telemetry-page { max-width:1200px; margin:2rem auto; padding:1rem; }
  h1 { text-align:center; color:#3b82f6; margin-bottom:1.5rem; }
  
  .telemetry-form { display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:2rem; }
  .telemetry-form select,
  .telemetry-form input { flex:1 1 180px; padding:0.5rem; border:1px solid #cbd5e1; border-radius:6px; }
  
  .btn-save { background:#22c55e; color:#fff; border:none; padding:0.6rem 1.2rem; border-radius:6px; cursor:pointer; }
  .btn-save:hover { background:#16a34a; }
  
  /* ---------- controles de simulación ---------- */
  .simulation-controls { margin-bottom:1.5rem; display:flex; gap:0.5rem; }
  .simulation-controls button {
    padding:0.6rem 1.2rem; border:none; border-radius:6px; cursor:pointer; color:#fff;
  }
  .simulation-controls button:disabled { opacity:.5; cursor:not-allowed; }
  .simulation-controls button:first-child { background:#3b82f6; }
  .simulation-controls button:last-child  { background:#ef4444; }
  
  /* ---------- grid & cards ---------- */
  .telemetry-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:1rem; }
  .telemetry-card { background:#f8fafc; padding:1rem; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,.05); }
  .telemetry-card.simulating { border:2px solid #3b82f6; background:#eff6ff; transition:all .3s; }
  </style>