/**
 * MÓDULO: schedule.js
 * Gestión de lógica de horarios, conflictos y persistencia
 * 
 * Responsabilidades:
 * - Crear/editar/eliminar eventos de horario
 * - Detectar conflictos de horario
 * - Persistencia en localStorage
 * - Gestión de usuarios
 */

class ScheduleManager {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  /**
   * Inicializa el gestor con el usuario actual
   */
  init() {
    this.currentUser = Storage.getUser() || 'Usuario Default';
    this.ensureUserExists();
  }

  /**
   * Asegura que el usuario actual exista en el almacén
   */
  ensureUserExists() {
    const users = Storage.getUsers();
    if (!users.find(u => u.name === this.currentUser)) {
      const newUser = {
        name: this.currentUser,
        career: 'Ingeniería en Sistemas',
        currentCycle: 1,
        schedule: [],
        approvedSubjects: []
      };
      users.push(newUser);
      Storage.saveUsers(users);
    }
  }

  /**
   * Obtiene el usuario actual completo
   */
  getCurrentUserData() {
    const users = Storage.getUsers();
    return users.find(u => u.name === this.currentUser);
  }

  /**
   * Cambia al usuario especificado
   */
  switchUser(userName) {
    const users = Storage.getUsers();
    const userExists = users.find(u => u.name === userName);
    if (userExists) {
      this.currentUser = userName;
      Storage.setUser(userName);
      return true;
    }
    return false;
  }

  /**
   * Crea un nuevo usuario/perfil
   */
  createUser(name, career = 'Ingeniería en Sistemas', cycle = 1) {
    const users = Storage.getUsers();
    if (users.find(u => u.name === name)) {
      return { success: false, message: 'El usuario ya existe' };
    }

    const newUser = {
      name,
      career,
      currentCycle: cycle,
      schedule: [],
      approvedSubjects: []
    };
    users.push(newUser);
    Storage.saveUsers(users);
    this.currentUser = name;
    Storage.setUser(name);
    return { success: true, message: `Perfil "${name}" creado exitosamente` };
  }

  /**
   * Obtiene la lista de todos los usuarios
   */
  getAllUsers() {
    return Storage.getUsers();
  }

  /**
   * Marca una materia como aprobada
   */
  approveSubject(subjectName) {
    const user = this.getCurrentUserData();
    if (!user.approvedSubjects.includes(subjectName)) {
      user.approvedSubjects.push(subjectName);
      this.updateUser(user);
      return true;
    }
    return false;
  }

  /**
   * Desaprueba una materia (deshace la aprobación)
   */
  unapproveSubject(subjectName) {
    const user = this.getCurrentUserData();
    const index = user.approvedSubjects.indexOf(subjectName);
    if (index > -1) {
      user.approvedSubjects.splice(index, 1);
      this.updateUser(user);
      return true;
    }
    return false;
  }

  /**
   * Obtiene materias aprobadas del usuario actual
   */
  getApprovedSubjects() {
    const user = this.getCurrentUserData();
    return user ? user.approvedSubjects : [];
  }

  /**
   * Verifica si una materia está aprobada
   */
  isSubjectApproved(subjectName) {
    return this.getApprovedSubjects().includes(subjectName);
  }

  /**
   * Agrega un evento al horario
   * @param {Object} event - { subject, day, startTime, endTime, modality, room }
   */
  addScheduleEvent(event) {
    const validation = this.validateEvent(event);
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }

    // Detectar conflictos
    const conflicts = this.detectConflicts(event);
    if (conflicts.length > 0) {
      return {
        success: false,
        message: `Conflicto detectado: ${conflicts[0].subject} (${conflicts[0].time})`,
        conflicts
      };
    }

    const user = this.getCurrentUserData();
    const eventWithId = {
      id: Date.now(),
      ...event
    };
    user.schedule.push(eventWithId);
    this.updateUser(user);
    return { success: true, event: eventWithId };
  }

  /**
   * Actualiza un evento existente
   */
  updateScheduleEvent(eventId, updatedEvent) {
    const validation = this.validateEvent(updatedEvent);
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }

    const user = this.getCurrentUserData();
    const eventIndex = user.schedule.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      return { success: false, message: 'Evento no encontrado' };
    }

    // Verificar conflictos sin contar el evento actual
    const tempSchedule = user.schedule.filter(e => e.id !== eventId);
    const conflicts = this.detectConflicts(updatedEvent, tempSchedule);
    
    if (conflicts.length > 0) {
      return {
        success: false,
        message: `Conflicto detectado: ${conflicts[0].subject}`,
        conflicts
      };
    }

    user.schedule[eventIndex] = {
      id: eventId,
      ...updatedEvent
    };
    this.updateUser(user);
    return { success: true, event: user.schedule[eventIndex] };
  }

  /**
   * Elimina un evento del horario
   */
  deleteScheduleEvent(eventId) {
    const user = this.getCurrentUserData();
    const filteredSchedule = user.schedule.filter(e => e.id !== eventId);
    
    if (filteredSchedule.length === user.schedule.length) {
      return { success: false, message: 'Evento no encontrado' };
    }

    user.schedule = filteredSchedule;
    this.updateUser(user);
    return { success: true };
  }

  /**
   * Obtiene el horario del usuario actual
   */
  getSchedule() {
    const user = this.getCurrentUserData();
    return user ? user.schedule : [];
  }

  /**
   * Obtiene el horario organizado por día
   */
  getScheduleByDay() {
    const schedule = this.getSchedule();
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const organized = {};

    days.forEach(day => {
      organized[day] = schedule
        .filter(event => event.day === day)
        .sort((a, b) => this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime));
    });

    return organized;
  }

  /**
   * Detecta conflictos de horario
   * @param {Object} newEvent - Evento a verificar
   * @param {Array} schedule - Horario a usar (por defecto el actual)
   */
  detectConflicts(newEvent, schedule = null) {
    schedule = schedule || this.getSchedule();
    const conflicts = [];

    schedule.forEach(event => {
      // Solo verificar conflictos el mismo día
      if (event.day !== newEvent.day) return;

      const newStart = this.timeToMinutes(newEvent.startTime);
      const newEnd = this.timeToMinutes(newEvent.endTime);
      const eventStart = this.timeToMinutes(event.startTime);
      const eventEnd = this.timeToMinutes(event.endTime);

      // Detectar solapamiento
      if (newStart < eventEnd && newEnd > eventStart) {
        conflicts.push({
          subject: event.subject,
          day: event.day,
          time: `${event.startTime} - ${event.endTime}`
        });
      }
    });

    return conflicts;
  }

  /**
   * Valida un evento antes de guardarlo
   */
  validateEvent(event) {
    if (!event.subject || event.subject.trim() === '') {
      return { valid: false, message: 'La materia es requerida' };
    }
    if (!event.day || !['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].includes(event.day)) {
      return { valid: false, message: 'Día inválido' };
    }
    if (!event.startTime || !event.endTime) {
      return { valid: false, message: 'Las horas son requeridas' };
    }
    if (!event.modality || !['Virtual', 'Presencial'].includes(event.modality)) {
      return { valid: false, message: 'Modalidad inválida' };
    }

    const startMin = this.timeToMinutes(event.startTime);
    const endMin = this.timeToMinutes(event.endTime);
    if (startMin >= endMin) {
      return { valid: false, message: 'La hora de fin debe ser posterior a la de inicio' };
    }

    return { valid: true };
  }

  /**
   * Convierte formato HH:MM a minutos
   */
  timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Convierte minutos a formato HH:MM
   */
  minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  /**
   * Actualiza los datos del usuario
   */
  updateUser(user) {
    const users = Storage.getUsers();
    const index = users.findIndex(u => u.name === user.name);
    if (index > -1) {
      users[index] = user;
      Storage.saveUsers(users);
    }
  }

  /**
   * Obtiene datos para exportar a PDF
   */
  getExportData() {
    const user = this.getCurrentUserData();
    const schedule = this.getScheduleByDay();
    
    return {
      studentName: user.name,
      career: user.career,
      cycle: user.currentCycle,
      schedule,
      approvedSubjects: user.approvedSubjects,
      generatedAt: new Date().toLocaleDateString('es-ES')
    };
  }
}

// Instancia global
const Schedule = new ScheduleManager();
