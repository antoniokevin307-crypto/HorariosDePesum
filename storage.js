/**
 * MÓDULO: storage.js
 * Gestión centralizada del localStorage
 * Maneja pensum, usuarios, horarios y preferencias
 */

const Storage = {
  // ============ PENSUM Y PROGRESO ============
  
  getCompleted() {
    return JSON.parse(localStorage.getItem("completed")) || [];
  },
  
  saveCompleted(list) {
    localStorage.setItem("completed", JSON.stringify(list));
  },

  /**
   * Obtiene las notas de las materias aprobadas
   */
  getNotes() {
    return JSON.parse(localStorage.getItem("notes")) || {};
  },

  /**
   * Guarda las notas de las materias
   */
  saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
  },
  
  getTheme() {
    return localStorage.getItem("theme") || "rosa";
  },
  
  saveTheme(theme) {
    localStorage.setItem("theme", theme);
  },

  // ============ GESTIÓN DE USUARIOS ============
  
  /**
   * Obtiene la lista de todos los usuarios
   */
  getUsers() {
    const users = localStorage.getItem("users");
    if (!users) {
      // Crear usuario por defecto si no existe
      const defaultUser = {
        name: 'Usuario Default',
        career: 'Ingeniería en Sistemas',
        currentCycle: 1,
        schedule: [],
        approvedSubjects: []
      };
      localStorage.setItem("users", JSON.stringify([defaultUser]));
      return [defaultUser];
    }
    return JSON.parse(users);
  },
  
  /**
   * Guarda la lista de usuarios
   */
  saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  },
  
  /**
   * Obtiene el usuario actual (por nombre)
   */
  getUser() {
    return localStorage.getItem("currentUser") || 'Usuario Default';
  },
  
  /**
   * Establece el usuario actual
   */
  setUser(userName) {
    localStorage.setItem("currentUser", userName);
  },
  
  /**
   * Limpia todos los datos (para testing)
   */
  clearAll() {
    localStorage.clear();
  },
  
  /**
   * Exporta todos los datos del usuario actual
   */
  exportUserData(userName) {
    const users = this.getUsers();
    const user = users.find(u => u.name === userName);
    return user || null;
  },
  
  /**
   * Importa datos de un usuario (para backup/restore)
   */
  importUserData(userData) {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.name === userData.name);
    
    if (existingIndex > -1) {
      users[existingIndex] = userData;
    } else {
      users.push(userData);
    }
    
    this.saveUsers(users);
    return true;
  }
};
