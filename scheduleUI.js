/**
 * MÓDULO: scheduleUI.js
 * Gestión de UI/UX para el módulo de horarios
 * 
 * Responsabilidades:
 * - Renderización de tabla de horarios
 * - Formularios de creación/edición
 * - Modales de confirmación
 * - Feedback visual
 */

class ScheduleUI {
  constructor() {
    this.hoursRange = {
      start: 7,  // 07:00
      end: 22    // 22:00
    };
    this.days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    this.modalityColors = {
      'Virtual': '#7c3aed',
      'Presencial': '#0891b2'
    };
  }

  /**
   * Renderiza toda la sección de horarios
   */
  renderScheduleModule() {
    const container = document.getElementById('scheduleContainer');
    if (!container) return;

    // Obtener materias aprobadas del pensum
    const approvedFromPensum = Storage.getCompleted();

    container.innerHTML = `
      <div class="schedule-wrapper">
        
        <!-- Sección de control de usuarios -->
        <section class="schedule-section user-management">
          <h2>👥 Perfiles de Estudiante</h2>
          <div class="user-controls">
            <div class="user-selector">
              <select id="userSelect" class="user-dropdown">
                <option value="">-- Selecciona usuario --</option>
              </select>
              <button class="btn btn-primary" id="switchUserBtn">Cambiar Usuario</button>
              <button class="btn btn-secondary" id="newUserBtn">+ Nuevo Perfil</button>
            </div>
            <div id="currentUserDisplay" class="current-user-display"></div>
          </div>
        </section>

        <!-- Sección de ciclo y agregar evento -->
        <section class="schedule-section form-section">
          <h2>➕ Agregar a Horario</h2>
          <form id="scheduleForm" class="schedule-form">
            <div class="form-grid">
              <div class="form-group">
                <label for="cycleSelect">Ciclo:</label>
                <select id="cycleSelect" required>
                  <option value="">-- Selecciona ciclo --</option>
                </select>
              </div>
              <div class="form-group">
                <label for="subjectSelect">Materia:</label>
                <select id="subjectSelect" required>
                  <option value="">-- Selecciona materia --</option>
                </select>
              </div>
              <div class="form-group">
                <label for="daySelect">Día:</label>
                <select id="daySelect" required></select>
              </div>
              <div class="form-group">
                <label for="startTimeInput">Hora Inicio:</label>
                <input type="time" id="startTimeInput" required>
              </div>
              <div class="form-group">
                <label for="endTimeInput">Hora Fin:</label>
                <input type="time" id="endTimeInput" required>
              </div>
              <div class="form-group">
                <label for="modalitySelect">Modalidad:</label>
                <select id="modalitySelect" required>
                  <option value="">-- Selecciona modalidad --</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Presencial">Presencial</option>
                </select>
              </div>
              <div class="form-group">
                <label for="docenteInput">Docente:</label>
                <input type="text" id="docenteInput" placeholder="Ej: Dr. Juan Pérez">
              </div>
              <div class="form-group">
                <label for="roomInput">Aula/Link:</label>
                <input type="text" id="roomInput" placeholder="Ej: Aula 305 o Zoom Link">
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-success">Agregar al Horario</button>
              <button type="reset" class="btn btn-neutral">Limpiar</button>
            </div>
          </form>
          <div id="formFeedback" class="form-feedback"></div>
        </section>

        <!-- Sección de horario visual -->
        <section class="schedule-section table-section">
          <div class="table-header">
            <h2>📅 Horario Semanal</h2>
            <div class="table-controls">
              <button class="btn btn-primary" id="exportPdfBtn">📥 Descargar PDF</button>
              <button class="btn btn-danger" id="clearScheduleBtn">🗑️ Limpiar Horario</button>
            </div>
          </div>
          <div id="scheduleTableContainer" class="schedule-table-wrapper"></div>
        </section>

      </div>
    `;

    this.populateDaySelect();
    this.populateCycleSelect();
    this.populateSubjectSelect();
    this.populateUserSelect();
    this.displayCurrentUser();
    this.renderScheduleTable();
    this.attachEventListeners();
    this.setupThemeListener();
  }

  /**
   * Llena el selector de días
   */
  populateDaySelect() {
    const select = document.getElementById('daySelect');
    this.days.forEach(day => {
      const option = document.createElement('option');
      option.value = day;
      option.textContent = day;
      select.appendChild(option);
    });
  }

  /**
   * Llena el selector de materias desde el pensum aprobado
   */
  /**
   * Llena el selector de ciclos
   */
  populateCycleSelect() {
    const select = document.getElementById('cycleSelect');
    if (!select) return;

    // Limpiar
    while (select.children.length > 1) {
      select.removeChild(select.lastChild);
    }

    // Agregar opciones de ciclos
    pensum.forEach(cycle => {
      const option = document.createElement('option');
      option.value = cycle.ciclo;
      option.textContent = cycle.ciclo;
      select.appendChild(option);
    });

    // Escuchar cambios
    select.addEventListener('change', () => this.updateSubjectsForCycle());
  }

  /**
   * Actualiza materias cuando cambia el ciclo
   */
  updateSubjectsForCycle() {
    const cycleSelect = document.getElementById('cycleSelect');
    const selectedCycle = cycleSelect.value;

    if (!selectedCycle) {
      document.getElementById('subjectSelect').innerHTML = '<option value="">-- Selecciona materia --</option>';
      return;
    }

    // Encontrar ciclo en pensum
    const cycle = pensum.find(c => c.ciclo === selectedCycle);
    if (!cycle) return;

    // Llenar selector de materias
    const subjectSelect = document.getElementById('subjectSelect');
    subjectSelect.innerHTML = '<option value="">-- Selecciona materia --</option>';

    const completed = Storage.getCompleted();
    cycle.materias.forEach(subject => {
      const option = document.createElement('option');
      option.value = subject;
      
      // Mostrar si está aprobada
      if (completed.includes(subject)) {
        option.textContent = `✓ ${subject}`;
        option.disabled = true;
      } else {
        option.textContent = subject;
      }
      
      subjectSelect.appendChild(option);
    });
  }

  /**
   * Llena el selector de materias (mantener para compatibilidad)
   */
  populateSubjectSelect() {
    this.updateSubjectsForCycle();
  }

  /**
   * Renderiza las materias aprobadas del pensum
   */
  /**
   * Llena el selector de usuarios
   */
  populateUserSelect() {
    const select = document.getElementById('userSelect');
    const users = Schedule.getAllUsers();
    
    select.innerHTML = '<option value="">-- Selecciona usuario --</option>';
    users.forEach(user => {
      const option = document.createElement('option');
      option.value = user.name;
      option.textContent = user.name;
      option.selected = user.name === Schedule.currentUser;
      select.appendChild(option);
    });
  }

  /**
   * Muestra el usuario actual
   */
  displayCurrentUser() {
    const display = document.getElementById('currentUserDisplay');
    const user = Schedule.getCurrentUserData();
    
    display.innerHTML = `
      <div class="user-info">
        <p><strong>${user.name}</strong></p>
        <p>${user.career} • Ciclo ${user.currentCycle}</p>
      </div>
    `;
  }

  /**
   * Renderiza el control de materias aprobadas
   */
  /**
   * Renderiza la tabla de horarios
   */
  renderScheduleTable() {
    const container = document.getElementById('scheduleTableContainer');
    const schedule = Schedule.getScheduleByDay();
    const schedule_arr = Schedule.getSchedule();

    if (schedule_arr.length === 0) {
      container.innerHTML = '<p class="empty-state">Aún no hay clases en el horario</p>';
      return;
    }

    // Generar tabla
    let html = '<table class="schedule-table"><thead><tr><th>Hora</th>';
    this.days.forEach(day => {
      html += `<th>${day}</th>`;
    });
    html += '</tr></thead><tbody>';

    // Filas por hora
    for (let hour = this.hoursRange.start; hour < this.hoursRange.end; hour++) {
      html += `<tr><td class="time-cell">${String(hour).padStart(2, '0')}:00</td>`;

      this.days.forEach(day => {
        const eventsThisHour = schedule[day].filter(event => {
          const eventHour = parseInt(event.startTime.split(':')[0]);
          return eventHour === hour;
        });

        if (eventsThisHour.length > 0) {
          const event = eventsThisHour[0];
          const color = this.modalityColors[event.modality] || '#6366f1';
          html += `
          <td class="schedule-event" style="background-color: ${color}; color: white;">
              <div class="event-content">
                <strong>${event.subject}</strong>
                <p class="event-time">${event.startTime} - ${event.endTime}</p>
                <p class="event-modality">${event.modality}</p>
                ${event.docente ? `<p class="event-docente">👨‍🏫 ${event.docente}</p>` : ''}
                ${event.room ? `<p class="event-room">📍 ${event.room}</p>` : ''}
                <div class="event-actions">
                  <button class="btn-icon" data-action="edit" data-event-id="${event.id}" title="Editar">✏️</button>
                  <button class="btn-icon" data-action="delete" data-event-id="${event.id}" title="Eliminar">🗑️</button>
                </div>
              </div>
            </td>
          `;
        } else {
          html += '<td class="schedule-empty"></td>';
        }
      });

      html += '</tr>';
    }

    html += '</tbody></table>';
    container.innerHTML = html;

    // Event listeners para edición/eliminación
    container.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.editEventHandler(e);
      });
    });
    container.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.deleteEventHandler(e);
      });
    });
  }

  /**
   * Adjunta listeners a elementos del formulario
   */
  attachEventListeners() {
    document.getElementById('scheduleForm').addEventListener('submit', (e) => this.submitForm(e));
    document.getElementById('switchUserBtn').addEventListener('click', () => this.switchUserHandler());
    document.getElementById('newUserBtn').addEventListener('click', () => this.newUserHandler());
    document.getElementById('exportPdfBtn').addEventListener('click', () => this.exportPdf());
    document.getElementById('clearScheduleBtn').addEventListener('click', () => this.clearScheduleHandler());
    
    // Escuchar cambios en modalidad
    const modalitySelect = document.getElementById('modalitySelect');
    const roomInput = document.getElementById('roomInput');
    if (modalitySelect && roomInput) {
      modalitySelect.addEventListener('change', (e) => {
        const isVirtual = e.target.value === 'Virtual';
        
        if (isVirtual) {
          roomInput.value = 'Microsoft Teams';
          roomInput.disabled = true;
          roomInput.style.backgroundColor = '#e5e7eb';
          roomInput.style.cursor = 'not-allowed';
          roomInput.style.opacity = '0.6';
        } else {
          roomInput.value = '';
          roomInput.disabled = false;
          roomInput.style.backgroundColor = '';
          roomInput.style.cursor = 'auto';
          roomInput.style.opacity = '1';
        }
      });
      
      // Aplicar estado inicial si está en Virtual
      if (modalitySelect.value === 'Virtual') {
        roomInput.value = 'Microsoft Teams';
        roomInput.disabled = true;
      }
    }
  }

  /**
   * Maneja el envío del formulario
   */
  submitForm(e) {
    e.preventDefault();
    const form = e.target;

    const event = {
      subject: document.getElementById('subjectSelect').value,
      day: document.getElementById('daySelect').value,
      startTime: document.getElementById('startTimeInput').value,
      endTime: document.getElementById('endTimeInput').value,
      modality: document.getElementById('modalitySelect').value,
      docente: document.getElementById('docenteInput').value || null,
      room: document.getElementById('roomInput').value || null
    };

    const result = Schedule.addScheduleEvent(event);
    this.showFeedback(result);

    if (result.success) {
      form.reset();
      this.renderScheduleTable();
      this.animateAddEvent();
    }
  }

  /**
   * Muestra feedback del formulario
   */
  showFeedback(result) {
    const feedback = document.getElementById('formFeedback');
    
    feedback.className = `form-feedback ${result.success ? 'success' : 'error'} show`;
    feedback.textContent = result.message;

    setTimeout(() => {
      feedback.classList.remove('show');
    }, 4000);
  }

  /**
   * Cambia de usuario
   */
  switchUserHandler() {
    const select = document.getElementById('userSelect');
    const userName = select.value;

    if (!userName) {
      this.showFeedback({ success: false, message: 'Selecciona un usuario' });
      return;
    }

    if (Schedule.switchUser(userName)) {
      this.showFeedback({ success: true, message: `Cambio a ${userName}` });
      setTimeout(() => this.renderScheduleModule(), 500);
    }
  }

  /**
   * Crea un nuevo usuario
   */
  newUserHandler() {
    const name = prompt('¿Nombre del nuevo estudiante?');
    if (!name || name.trim() === '') return;

    const result = Schedule.createUser(name.trim());
    this.showFeedback(result);

    if (result.success) {
      setTimeout(() => this.renderScheduleModule(), 500);
    }
  }

  /**
   * Desaprueba una materia
   */
  /**
   * Edita un evento - Abre modal de edición
   */
  editEventHandler(e) {
    const eventId = parseInt(e.target.dataset.eventId);
    const schedule = Schedule.getSchedule();
    const event = schedule.find(e => e.id === eventId);

    if (!event) return;

    this.showEditModal(event);
  }

  /**
   * Elimina un evento - Abre modal de confirmación
   */
  deleteEventHandler(e) {
    const eventId = parseInt(e.target.dataset.eventId);
    const schedule = Schedule.getSchedule();
    const event = schedule.find(e => e.id === eventId);

    if (!event) return;

    this.showDeleteConfirmModal(event);
  }

  /**
   * Muestra modal de edición de evento
   */
  showEditModal(event) {
    // Prevenir que el evento se propague
    if (window.event) window.event.cancelBubble = true;

    const modalId = `edit-modal-${event.id}`;
    const existingModal = document.getElementById(modalId);
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'modal-overlay';
    
    modal.innerHTML = `
      <div class="modal-box">
        <div class="modal-header">
          <h3>✏️ Editar Evento</h3>
          <button class="modal-close-btn" aria-label="Cerrar modal">&times;</button>
        </div>
        <div class="modal-content">
          <form id="editEventForm-${event.id}">
            <div class="modal-form-group">
              <label for="editSubject-${event.id}">Materia / Asignatura</label>
              <input type="text" id="editSubject-${event.id}" value="${event.subject}" required>
            </div>

            <div class="modal-form-group">
              <label for="editDay-${event.id}">Día</label>
              <select id="editDay-${event.id}" required>
                ${this.days.map(day => `
                  <option value="${day}" ${day === event.day ? 'selected' : ''}>${day}</option>
                `).join('')}
              </select>
            </div>

            <div class="modal-form-group">
              <label for="editStartTime-${event.id}">Hora de Inicio</label>
              <input type="time" id="editStartTime-${event.id}" value="${event.startTime}" required>
            </div>

            <div class="modal-form-group">
              <label for="editEndTime-${event.id}">Hora de Fin</label>
              <input type="time" id="editEndTime-${event.id}" value="${event.endTime}" required>
            </div>

            <div class="modal-form-group">
              <label for="editModality-${event.id}">Modalidad</label>
              <select id="editModality-${event.id}" required>
                <option value="Presencial" ${event.modality === 'Presencial' ? 'selected' : ''}>Presencial</option>
                <option value="Virtual" ${event.modality === 'Virtual' ? 'selected' : ''}>Virtual</option>
              </select>
            </div>

            <div class="modal-form-group">
              <label for="editRoom-${event.id}">Salón / Aula (Opcional)</label>
              <input type="text" id="editRoom-${event.id}" value="${event.room || ''}" placeholder="Ej: Aula 101">
            </div>

            <div class="modal-form-group">
              <label for="editDocente-${event.id}">Docente (Opcional)</label>
              <input type="text" id="editDocente-${event.id}" value="${event.docente || ''}" placeholder="Ej: Ing. Juan Pérez">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="modal-btn modal-btn-secondary" data-action="cancel">Cancelar</button>
          <button class="modal-btn modal-btn-primary" data-action="save">Guardar Cambios</button>
        </div>
      </div>
    `;

    // NO agregar listeners aquí, agregarlos después de append
    document.body.appendChild(modal);

    // Obtener referencias a los botones
    const closeBtn = modal.querySelector('.modal-close-btn');
    const cancelBtn = modal.querySelector('[data-action="cancel"]');
    const saveBtn = modal.querySelector('[data-action="save"]');

    // Crear función para cerrar modal
    const closeModal = () => {
      const el = document.getElementById(modalId);
      if (el) el.remove();
    };

    // Crear función para guardar
    const saveHandler = () => {
      const updatedEvent = {
        ...event,
        subject: document.getElementById(`editSubject-${event.id}`).value,
        day: document.getElementById(`editDay-${event.id}`).value,
        startTime: document.getElementById(`editStartTime-${event.id}`).value,
        endTime: document.getElementById(`editEndTime-${event.id}`).value,
        modality: document.getElementById(`editModality-${event.id}`).value,
        room: document.getElementById(`editRoom-${event.id}`).value || null,
        docente: document.getElementById(`editDocente-${event.id}`).value || null
      };

      // Validar que hora de fin sea posterior a hora de inicio
      if (updatedEvent.startTime >= updatedEvent.endTime) {
        this.showFeedback({ success: false, message: 'La hora de fin debe ser posterior a la de inicio' });
        return;
      }

      // Detectar conflictos (excluyendo el evento actual)
      const currentSchedule = Schedule.getSchedule().filter(e => e.id !== event.id);
      const conflicts = Schedule.detectConflicts(updatedEvent, currentSchedule);
      if (conflicts.length > 0) {
        this.showFeedback({ success: false, message: `⚠️ Conflicto detectado: ${conflicts[0].subject}` });
        return;
      }

      // Actualizar evento
      const result = Schedule.updateScheduleEvent(event.id, updatedEvent);
      if (result.success) {
        this.showFeedback({ success: true, message: '✅ Evento actualizado correctamente' });
        closeModal();
        this.renderScheduleTable();
      } else {
        this.showFeedback({ success: false, message: result.error || 'Error al actualizar el evento' });
      }
    };

    // Agregar listeners con referencias controladas
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.stopPropagation();
        closeModal();
      };
    }

    if (cancelBtn) {
      cancelBtn.onclick = (e) => {
        e.stopPropagation();
        closeModal();
      };
    }

    if (saveBtn) {
      saveBtn.onclick = (e) => {
        e.stopPropagation();
        saveHandler();
      };
    }
  }

  /**
   * Muestra modal de confirmación para eliminar evento
   */
  showDeleteConfirmModal(event) {
    // Prevenir que el evento se propague
    if (window.event) window.event.cancelBubble = true;

    const modalId = `delete-modal-${event.id}`;
    const existingModal = document.getElementById(modalId);
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'modal-overlay';

    modal.innerHTML = `
      <div class="modal-box modal-confirm">
        <div class="modal-header">
          <h3>⚠️ Eliminar Evento</h3>
          <button class="modal-close-btn" aria-label="Cerrar modal">&times;</button>
        </div>
        <div class="modal-content">
          <div class="modal-confirm-icon">🗑️</div>
          <div class="modal-confirm-title">¿Eliminar este evento?</div>
          <p class="modal-confirm-message">Esta acción no se puede deshacer. Se eliminarán todos los datos asociados al evento.</p>
          
          <div class="modal-confirm-details">
            <p><strong>Materia:</strong> ${event.subject}</p>
            <p><strong>Día:</strong> ${event.day}</p>
            <p><strong>Hora:</strong> ${event.startTime} - ${event.endTime}</p>
            <p><strong>Modalidad:</strong> ${event.modality}</p>
            ${event.room ? `<p><strong>Salón:</strong> ${event.room}</p>` : ''}
            ${event.docente ? `<p><strong>Docente:</strong> ${event.docente}</p>` : ''}
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn modal-btn-secondary" data-action="cancel">Cancelar</button>
          <button class="modal-btn modal-btn-danger" data-action="delete">Sí, Eliminar</button>
        </div>
      </div>
    `;

    // NO agregar listeners aquí, agregarlos después de append
    document.body.appendChild(modal);

    // Obtener referencias a los botones
    const closeBtn = modal.querySelector('.modal-close-btn');
    const cancelBtn = modal.querySelector('[data-action="cancel"]');
    const deleteBtn = modal.querySelector('[data-action="delete"]');

    // Crear función para cerrar modal
    const closeModal = () => {
      const el = document.getElementById(modalId);
      if (el) el.remove();
    };

    // Crear función para eliminar
    const deleteHandler = () => {
      const result = Schedule.deleteScheduleEvent(event.id);
      if (result.success) {
        this.showFeedback({ success: true, message: '🗑️ Evento eliminado correctamente' });
        closeModal();
        this.renderScheduleTable();
        this.animateRemoveEvent();
      } else {
        this.showFeedback({ success: false, message: result.error || 'Error al eliminar el evento' });
      }
    };

    // Agregar listeners con referencias controladas
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.stopPropagation();
        closeModal();
      };
    }

    if (cancelBtn) {
      cancelBtn.onclick = (e) => {
        e.stopPropagation();
        closeModal();
      };
    }

    if (deleteBtn) {
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteHandler();
      };
    }
  }

  /**
   * Limpia todo el horario
   */
  clearScheduleHandler() {
    if (!confirm('¿Descartar TODO el horario actual?')) return;

    const user = Schedule.getCurrentUserData();
    user.schedule = [];
    Schedule.updateUser(user);
    this.showFeedback({ success: true, message: 'Horario limpiado' });
    this.renderScheduleTable();
  }

  /**
   * Exporta el horario a PDF
   */
  exportPdf() {
    try {
      const data = Schedule.getExportData();
      
      // Intentar obtener jsPDF de múltiples formas
      let jsPDFLib = null;
      
      if (window.jsPDF && window.jsPDF.jsPDF) {
        jsPDFLib = window.jsPDF.jsPDF;
      } else if (window.jsPDF) {
        jsPDFLib = window.jsPDF;
      } else if (window.jspdf && window.jspdf.jsPDF) {
        jsPDFLib = window.jspdf.jsPDF;
      }
      
      if (!jsPDFLib) {
        this.showFeedback({ success: false, message: 'Error: librería PDF no cargada. Espere unos segundos e intente de nuevo.' });
        console.error('jsPDF no disponible:', {
          jsPDF: window.jsPDF,
          jspdf: window.jspdf,
          disponibles: Object.keys(window).filter(k => k.toLowerCase().includes('pdf'))
        });
        return;
      }

      const doc = new jsPDFLib({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      let yPosition = 15;

      // Título y datos generales
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('HORARIO ACADÉMICO', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(`Estudiante: ${data.studentName}`, 15, yPosition);
      yPosition += 7;
      doc.text(`Carrera: ${data.career}`, 15, yPosition);
      yPosition += 7;
      doc.text(`Ciclo: ${data.cycle}`, 15, yPosition);
      yPosition += 7;
      doc.text(`Generado: ${data.generatedAt}`, 15, yPosition);
      yPosition += 12;

      // Tabla de horarios
      const tableData = [];
      const days = Object.keys(data.schedule);
      
      // Encabezado
      const headers = ['Hora', ...days];
      tableData.push(headers);

      // Llenar datos por hora (comenzar desde las 7:00)
      for (let hour = 7; hour < 22; hour++) {
        const row = [`${String(hour).padStart(2, '0')}:00`];
        
        days.forEach(day => {
          const events = data.schedule[day].filter(e => {
            const eventHour = parseInt(e.startTime.split(':')[0]);
            return eventHour === hour;
          });
          
          if (events.length > 0) {
            const event = events[0];
            row.push(`${event.subject}\n${event.startTime}-${event.endTime}\n[${event.modality}]`);
          } else {
            row.push('');
          }
        });

        tableData.push(row);
      }

      // Crear tabla usando autoTable si está disponible
      if (doc.autoTable) {
        doc.autoTable({
          head: [tableData[0]],
          body: tableData.slice(1),
          startY: yPosition,
          margin: 10,
          styles: {
            fontSize: 8,
            cellPadding: 3,
            overflow: 'linebreak',
            halign: 'center',
            valign: 'middle'
          },
          headStyles: {
            fillColor: [99, 102, 241],
            textColor: 255,
            fontStyle: 'bold'
          },
          columnStyles: {
            0: { cellWidth: 12, fontStyle: 'bold' }
          }
        });
      } else {
        // Si autoTable no está disponible, crear tabla manual simple
        console.warn('autoTable no disponible, creando tabla manual');
        yPosition += 10;
        tableData.forEach((row, rowIndex) => {
          let xPosition = 15;
          row.forEach((cell, colIndex) => {
            if (rowIndex === 0) {
              doc.setFont('helvetica', 'bold');
              doc.setFillColor(99, 102, 241);
              doc.setTextColor(255, 255, 255);
            } else {
              doc.setFont('helvetica', 'normal');
              doc.setTextColor(0, 0, 0);
            }
            doc.rect(xPosition, yPosition, 20, 10, rowIndex === 0 ? 'F' : '');
            doc.text(cell.substring(0, 15), xPosition + 2, yPosition + 5);
            xPosition += 22;
          });
          yPosition += 12;
        });
      }

      // Guardar PDF
      const filename = `Horario_${data.studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      this.showFeedback({ success: true, message: '✅ PDF descargado correctamente' });
      this.animatePdfExport();
    } catch (error) {
      console.error('Error al generar PDF:', error);
      this.showFeedback({ success: false, message: 'Error al generar el PDF: ' + error.message });
    }
  }

  /**
   * Animaciones
   */
  animateAddEvent() {
    const table = document.querySelector('.schedule-table');
    table?.classList.add('animate-pulse');
    setTimeout(() => table?.classList.remove('animate-pulse'), 500);
  }

  animateRemoveEvent() {
    const table = document.querySelector('.schedule-table');
    table?.classList.add('animate-fade');
    setTimeout(() => table?.classList.remove('animate-fade'), 300);
  }

  animatePdfExport() {
    const btn = document.getElementById('exportPdfBtn');
    btn.classList.add('animate-download');
    setTimeout(() => btn.classList.remove('animate-download'), 600);
  }

  /**
   * Crea un diálogo de confirmación
   */
  createConfirmDialog(title, message, buttons = ['Cancelar', 'Confirmar']) {
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    overlay.style.display = 'none';

    const dialog = document.createElement('div');
    dialog.className = 'dialog-confirm';
    dialog.innerHTML = `
      <div class="dialog-header">
        <h3>${title}</h3>
        <button class="btn-close">×</button>
      </div>
      <div class="dialog-content">
        ${message}
      </div>
      <div class="dialog-actions">
        ${buttons.map((btn, idx) => `
          <button class="btn dialog-btn" data-index="${idx}">${btn}</button>
        `).join('')}
      </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    const closeDialog = () => {
      overlay.remove();
    };

    const dialObj = {
      show: () => {
        overlay.style.display = 'flex';
        overlay.classList.add('show');
      },
      close: closeDialog,
      onAction: null
    };

    dialog.querySelector('.btn-close').addEventListener('click', closeDialog);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDialog();
    });

    dialog.querySelectorAll('.dialog-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        if (dialObj.onAction) dialObj.onAction(index);
        closeDialog();
      });
    });

    return dialObj;
  }

  /**
   * Escucha cambios de tema dinámicamente
   */
  setupThemeListener() {
    // Aplicar tema actual
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Escuchar cambios de tema (desde otro lugar de la app)
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-theme') || 'light';
      this.applyThemeToSchedule(newTheme);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Escuchar también localStorage (para sincronización entre tabs)
    window.addEventListener('storage', (e) => {
      if (e.key === 'theme') {
        const theme = e.newValue || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        this.applyThemeToSchedule(theme);
      }
    });
  }

  /**
   * Aplica tema al módulo de horarios
   */
  applyThemeToSchedule(theme) {
    const scheduleSection = document.querySelector('.schedule-wrapper');
    if (!scheduleSection) return;

    // Aplicar clases de tema
    scheduleSection.classList.remove('theme-light', 'theme-dark', 'theme-blue', 'theme-green', 'theme-purple');
    scheduleSection.classList.add(`theme-${theme}`);

    // Forzar re-render de tabla si es necesario
    if (window.matchMedia('(prefers-color-scheme: dark)').matches && theme === 'dark') {
      this.renderScheduleTable();
    }
  }
}

// Instancia global
const ScheduleUI_Instance = new ScheduleUI();
