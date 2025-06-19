<template>
    <div class="layout">
      <Sidebar />
      <main class="content">
        <header class="topbar">
          <button @click="logout">Cerrar sesión / Sair</button>
        </header>
        <section class="page-content">
          <router-view />
        </section>
      </main>
    </div>
  </template>
  
  <script>
  import Sidebar from '../components/Sidebar.vue';
  
  export default {
    components: { Sidebar },
    methods: {
      logout() {
        localStorage.removeItem('token');
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style scoped>
  /* 🟢 Layout principal / Layout principal */
  .layout {
    display: flex;
    height: 100vh;
    overflow: hidden; /* ✅ Evita desbordamientos */
  }
  
  /* 🟢 Contenido principal / Conteúdo principal */
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 272px; /* ✅ Ajuste para que respete el ancho del sidebar / Ajuste para respeitar a largura do sidebar */
    height: 100vh;
    overflow: hidden;
  }
  
  /* 🟢 Barra superior / Barra superior */
  .topbar {
    background-color: #d5e0ec;
    padding: 1rem;
    display: flex;
    justify-content: flex-end;
    position: sticky; /* ✅ Fija la topbar mientras haces scroll / Fixa a topbar ao rolar */
    top: 0;
    z-index: 50;
  }
  
  /* 🟢 Botón de logout / Botão de logout */
  .topbar button {
    background-color: #ef4444;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .topbar button:hover {
    background-color: #dc2626;
  }
  
  /* 🟢 Contenido desplazable / Conteúdo com scroll */
  .page-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
    background-color: #f8fafc;
  }
  </style>