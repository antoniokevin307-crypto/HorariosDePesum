/**
 * Muestra diálogo para aprobar una materia (con nota)
 */
function showApproveDialog(subject, callback) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  const modal = document.createElement('div');
  modal.className = 'modal-content';
  modal.innerHTML = `
    <div class="modal-header">
      <h3>✅ Aprobar Materia</h3>
      <button class="modal-close">×</button>
    </div>
    <div class="modal-body">
      <p><strong>Materia:</strong> ${subject}</p>
      <div class="form-group">
        <label for="noteInput">Nota obtenida:</label>
        <input type="text" id="noteInput" placeholder="Ej: 4.5, A+, Excelente" autofocus>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-cancel">Cancelar</button>
      <button class="btn btn-confirm">Confirmar</button>
    </div>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  setTimeout(() => overlay.classList.add('show'), 10);
  
  const closeModal = () => {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 300);
    callback();
  };
  
  modal.querySelector('.modal-close').onclick = closeModal;
  modal.querySelector('.btn-cancel').onclick = closeModal;
  
  modal.querySelector('.btn-confirm').onclick = () => {
    const note = document.getElementById('noteInput').value.trim();
    completeSubject(subject, note);
    closeModal();
  };
}

/**
 * Muestra diálogo para desaprobar una materia (con razón)
 */
function showDisapproveDialog(subject, callback) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  const modal = document.createElement('div');
  modal.className = 'modal-content';
  modal.innerHTML = `
    <div class="modal-header">
      <h3>❌ Desaprobar Materia</h3>
      <button class="modal-close">×</button>
    </div>
    <div class="modal-body">
      <p><strong>Materia:</strong> ${subject}</p>
      <div class="form-group">
        <label for="reasonInput">¿Por qué deseas desaprobar?</label>
        <textarea id="reasonInput" placeholder="Ej: Voy a cambiar de carrera, No me va bien, etc." rows="3" autofocus></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-cancel">Cancelar</button>
      <button class="btn btn-delete">Desaprobar</button>
    </div>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  setTimeout(() => overlay.classList.add('show'), 10);
  
  const closeModal = () => {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 300);
    callback();
  };
  
  modal.querySelector('.modal-close').onclick = closeModal;
  modal.querySelector('.btn-cancel').onclick = closeModal;
  
  modal.querySelector('.btn-delete').onclick = () => {
    const reason = document.getElementById('reasonInput').value.trim();
    removeSubject(subject, reason);
    closeModal();
  };
}

/**
 * Aprueba una materia y la guarda con nota
 */
function completeSubject(m, note=""){
  const c = Storage.getCompleted();
  if(!c.includes(m)){
    c.push(m);
    Storage.saveCompleted(c);
    
    // Guardar nota si existe
    if(note){
      let notes = Storage.getNotes ? Storage.getNotes() : {};
      notes[m] = note;
      if(Storage.saveNotes) Storage.saveNotes(notes);
    }
    
    renderPensum();
    showMessage(`✅ "${m}" aprobada${note ? ` con nota ${note}` : ''}`, 'success');
  }
}

/**
 * Desaprueba una materia
 */
function removeSubject(m, reason=""){
  const c = Storage.getCompleted();
  const filtered = c.filter(s => s !== m);
  Storage.saveCompleted(filtered);
  
  // Remover nota si existe
  if(Storage.getNotes){
    let notes = Storage.getNotes();
    delete notes[m];
    if(Storage.saveNotes) Storage.saveNotes(notes);
  }
  
  renderPensum();
  showMessage(`❌ "${m}" desaprobada${reason ? ` (${reason})` : ''}`, 'warning');
}

/**
 * Muestra mensaje de feedback
 */
function showMessage(text, type='info'){
  let msgContainer = document.getElementById('messageContainer');
  if(!msgContainer){
    msgContainer = document.createElement('div');
    msgContainer.id = 'messageContainer';
    msgContainer.className = 'message-container';
    document.body.appendChild(msgContainer);
  }
  
  const msg = document.createElement('div');
  msg.className = `message message-${type}`;
  msg.textContent = text;
  msgContainer.appendChild(msg);
  
  setTimeout(() => {
    msg.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    msg.classList.remove('show');
    setTimeout(() => msg.remove(), 300);
  }, 3000);
}

function updateProgress(done,total){
  const p=Math.round(done/total*100);
  document.getElementById("progress").style.width=p+"%";
  document.getElementById("progressText").textContent=
    `Progreso ${done}/${total} (${p}%)`;
}

renderPensum();
