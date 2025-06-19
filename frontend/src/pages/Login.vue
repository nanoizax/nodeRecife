<template>
    <div class="login-page">
      <div class="login-card">
        <h1>🔐 Iniciar Sesión</h1>
        <form @submit.prevent="login">
          <input v-model="username" placeholder="Usuario" />
          <input v-model="password" type="password" placeholder="Contraseña" />
          <button type="submit">Entrar</button>
          <p v-if="error" class="error">{{ error }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import api from '../services/axios';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        error: ''
      };
    },
    methods: {
      async login() {
        try {
          const response = await api.post('/auth/login', {
            username: this.username,
            password: this.password
          });
          localStorage.setItem('token', response.data.token);
          this.$router.push('/vehicles');
        } catch (err) {
          this.error = 'Usuario o contraseña incorrectos';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f1f5f9;
  }
  
  .login-card {
    background-color: white;
    padding: 2rem 3rem;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    text-align: center;
    max-width: 400px;
    width: 100%;
  }
  
  .login-card h1 {
    color: #1e3a8a;
    margin-bottom: 1.5rem;
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  input {
    padding: 0.7rem;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    outline: none;
    background-color: #f8fafc;
    transition: border-color 0.3s;
  }
  
  input:focus {
    border-color: #3b82f6;
  }
  
  button {
    padding: 0.8rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
  }
  
  button:hover {
    background-color: #2563eb;
  }
  
  .error {
    color: #dc2626;
    margin-top: 0.5rem;
    font-weight: bold;
  }
  </style>