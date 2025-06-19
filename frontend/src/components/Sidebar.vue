<template>
    <aside class="sidebar">
      <h1 class="logo-title">
        <span class="logo-icon">🚚</span>
        <span>Fleet Monitor</span>
      </h1>
      <nav>
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :class="{ active: $route.path === item.path }"
        >
          <span class="icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>
  </template>
  
  <script>
  export default {
    data() {
      return {
        menuItems: [
          { path: "/vehicles", label: "Vehículos", icon: "🚗" },
          { path: "/motoristas", label: "Motoristas", icon: "👨‍✈️" },
          { path: "/mantenimientos", label: "Mantenimientos", icon: "🛠️" },
          { path: "/telemetria", label: "Telemetría", icon: "📡" }
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  /* ✅ Sidebar fijo / Sidebar fixo */
  .sidebar {
    position: fixed;             /* Fijo en pantalla / Fixo na tela */
    top: 0;
    left: 0;
    width: 240px;
    height: 100vh;               /* Altura completa del viewport / Altura completa da tela */
    background: linear-gradient(135deg, #1e3a8a, #2563eb);
    color: #fff;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.15);
    overflow-y: auto;            /* Si en el futuro el menú crece / Caso o menu cresça */
  }
  
  h1 {
    font-size: 1.8rem;
    margin-bottom: 2rem;
    font-weight: bold;
    text-align: center;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.7rem 1rem;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    text-decoration: none;
    color: #cbd5e1;
    transition: background 0.2s, color 0.2s;
  }
  
  .nav-link:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }
  
  .nav-link.active {
    background: #3b82f6;
    color: white;
    font-weight: bold;
  }
  
  .icon {
    font-size: 1.3rem;
  }
  
  .logo-title {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    font-size: 1.6rem;
    font-weight: 800;
    margin-bottom: 2rem;
    color: white;
    letter-spacing: 0.5px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }
  
  .logo-icon {
    font-size: 1.8rem;
    transform: translateY(2px);
  }
  </style>