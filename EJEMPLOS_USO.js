/**
 * EJEMPLOS PRÁCTICOS DE USO DEL MÓDULO DE HORARIOS
 * 
 * Este archivo contiene ejemplos reales de cómo usar cada función
 * Cópialos en la consola del navegador para probar
 */

// ===================================================================
// EJEMPLOS 1: GESTIÓN DE USUARIOS
// ===================================================================

/**
 * Ejemplo 1.1: Crear un nuevo usuario
 */
function ejemplo_crearUsuario() {
  const resultado = Schedule.createUser('Carlos Mendez', 'Ingeniería en Sistemas', 2);
  console.log(resultado);
  // Output: { success: true, message: 'Perfil "Carlos Mendez" creado exitosamente' }
}

/**
 * Ejemplo 1.2: Cambiar entre usuarios
 */
function ejemplo_cambiarUsuario() {
  // Cambiar a un usuario existente
  const exito = Schedule.switchUser('Juan Pérez');
  console.log('¿Cambio exitoso?', exito);
  
  // Mostrar usuario actual
  const usuarioActual = Schedule.getCurrentUserData();
  console.log('Usuario actual:', usuarioActual.name);
}

/**
 * Ejemplo 1.3: Listar todos los usuarios
 */
function ejemplo_listarUsuarios() {
  const usuarios = Schedule.getAllUsers();
  console.table(usuarios.map(u => ({
    nombre: u.name,
    carrera: u.career,
    ciclo: u.currentCycle,
    clases: u.schedule.length,
    aprobadas: u.approvedSubjects.length
  })));
}

/**
 * Ejemplo 1.4: Obtener datos del usuario actual
 */
function ejemplo_datosCuenta() {
  const user = Schedule.getCurrentUserData();
  console.log(`=== Datos de ${user.name} ===`);
  console.log(`Carrera: ${user.career}`);
  console.log(`Ciclo actual: ${user.currentCycle}`);
  console.log(`Clases en horario: ${user.schedule.length}`);
  console.log(`Materias aprobadas: ${user.approvedSubjects.length}`);
}

// ===================================================================
// EJEMPLOS 2: GESTIÓN DE MATERIAS APROBADAS
// ===================================================================

/**
 * Ejemplo 2.1: Marcar una materia como aprobada
 */
function ejemplo_marcarAprobada() {
  const materias = [
    'Programación I',
    'Matemática I',
    'Física General',
    'Lógica Matemática'
  ];
  
  materias.forEach(materia => {
    Schedule.approveSubject(materia);
    console.log(`✓ ${materia} marcada como aprobada`);
  });
}

/**
 * Ejemplo 2.2: Verificar si una materia está aprobada
 */
function ejemplo_verificarAprobada() {
  const materia = 'Programación I';
  const estaAprobada = Schedule.isSubjectApproved(materia);
  console.log(`¿"${materia}" está aprobada?`, estaAprobada ? 'Sí' : 'No');
}

/**
 * Ejemplo 2.3: Obtener lista de materias aprobadas
 */
function ejemplo_listarAprobadas() {
  const aprobadas = Schedule.getApprovedSubjects();
  console.log(`=== Materias Aprobadas (${aprobadas.length}) ===`);
  aprobadas.forEach((materia, i) => {
    console.log(`${i + 1}. ${materia}`);
  });
}

/**
 * Ejemplo 2.4: Desmarcar una materia (DESHACE la aprobación)
 */
function ejemplo_desmarcarAprobada() {
  const materia = 'Matemática I';
  const resultado = Schedule.unapproveSubject(materia);
  console.log(`¿Se desmarcó "${materia}"?`, resultado ? 'Sí' : 'No');
  console.log('⚠️ La materia se puede volver a marcar fácilmente');
}

// ===================================================================
// EJEMPLOS 3: AGREGAR CLASES AL HORARIO
// ===================================================================

/**
 * Ejemplo 3.1: Agregar una clase simple (sin conflicto)
 */
function ejemplo_agregarClase() {
  const clase = {
    subject: 'Programación II',
    day: 'Lunes',
    startTime: '07:30',
    endTime: '09:00',
    modality: 'Virtual',
    room: 'https://zoom.us/...'
  };
  
  const resultado = Schedule.addScheduleEvent(clase);
  
  if (resultado.success) {
    console.log('✓ Clase agregada exitosamente');
    console.log('ID del evento:', resultado.event.id);
  } else {
    console.error('✗ Error:', resultado.message);
  }
}

/**
 * Ejemplo 3.2: Agregar múltiples clases
 */
function ejemplo_agregarMultiplesClases() {
  const clases = [
    {
      subject: 'Programación II',
      day: 'Lunes',
      startTime: '07:30',
      endTime: '09:00',
      modality: 'Virtual'
    },
    {
      subject: 'Base de Datos',
      day: 'Martes',
      startTime: '10:00',
      endTime: '11:30',
      modality: 'Presencial',
      room: 'Aula 305'
    },
    {
      subject: 'Estructuras de Datos',
      day: 'Miércoles',
      startTime: '08:00',
      endTime: '09:30',
      modality: 'Virtual'
    },
    {
      subject: 'Algoritmos',
      day: 'Jueves',
      startTime: '09:00',
      endTime: '10:30',
      modality: 'Presencial',
      room: 'Aula 215'
    },
    {
      subject: 'Redes',
      day: 'Viernes',
      startTime: '14:00',
      endTime: '15:30',
      modality: 'Virtual'
    }
  ];
  
  clases.forEach(clase => {
    const resultado = Schedule.addScheduleEvent(clase);
    if (resultado.success) {
      console.log(`✓ ${clase.subject} agregada`);
    } else {
      console.log(`✗ ${clase.subject}: ${resultado.message}`);
    }
  });
}

/**
 * Ejemplo 3.3: Intento de agregar con conflicto
 */
function ejemplo_conflictoDetectado() {
  // Primero agregar una clase
  Schedule.addScheduleEvent({
    subject: 'Programación II',
    day: 'Lunes',
    startTime: '10:00',
    endTime: '11:30',
    modality: 'Virtual'
  });
  
  // Intentar agregar clase que se superpone
  const resultado = Schedule.addScheduleEvent({
    subject: 'Base de Datos',
    day: 'Lunes',
    startTime: '11:00',  // Se superpone con la anterior
    endTime: '12:30',
    modality: 'Presencial'
  });
  
  console.log('Resultado:', resultado.message);
  // Output: "Conflicto detectado: Programación II (10:00 - 11:30)"
  console.log('Conflictos encontrados:', resultado.conflicts);
}

// ===================================================================
// EJEMPLOS 4: DETECCIÓN DE CONFLICTOS
// ===================================================================

/**
 * Ejemplo 4.1: Detectar conflictos manualmente
 */
function ejemplo_detectarConflictos() {
  const nuevoEvento = {
    subject: 'Nuevas Materias',
    day: 'Martes',
    startTime: '09:00',
    endTime: '10:30',
    modality: 'Virtual'
  };
  
  const conflictos = Schedule.detectConflicts(nuevoEvento);
  
  if (conflictos.length > 0) {
    console.log('⚠️ Se encontraron conflictos:');
    conflictos.forEach(c => {
      console.log(`  - ${c.subject} (${c.time})`);
    });
  } else {
    console.log('✓ No hay conflictos');
  }
}

/**
 * Ejemplo 4.2: Validar evento
 */
function ejemplo_validarEvento() {
  const evento = {
    subject: 'Programación II',
    day: 'Lunes',
    startTime: '07:30',
    endTime: '09:00',
    modality: 'Virtual'
  };
  
  const validacion = Schedule.validateEvent(evento);
  console.log('¿Evento válido?', validacion.valid);
  if (!validacion.valid) {
    console.log('Error:', validacion.message);
  }
}

// ===================================================================
// EJEMPLOS 5: EDITAR Y ELIMINAR CLASES
// ===================================================================

/**
 * Ejemplo 5.1: Obtener ID de un evento
 */
function ejemplo_obtenerIDEvento() {
  const schedule = Schedule.getSchedule();
  if (schedule.length > 0) {
    const evento = schedule[0];
    console.log(`Primer evento: ID=${evento.id}, Materia=${evento.subject}`);
  }
}

/**
 * Ejemplo 5.2: Editar una clase
 */
function ejemplo_editarClase() {
  const schedule = Schedule.getSchedule();
  if (schedule.length === 0) {
    console.log('No hay clases para editar');
    return;
  }
  
  const eventoID = schedule[0].id;
  
  const eventoActualizado = {
    subject: 'Programación II Avanzada',  // Cambiar nombre
    day: 'Martes',                         // Cambiar día
    startTime: '08:00',                    // Cambiar hora
    endTime: '09:30',
    modality: 'Presencial',                // Cambiar modalidad
    room: 'Aula 101'
  };
  
  const resultado = Schedule.updateScheduleEvent(eventoID, eventoActualizado);
  
  if (resultado.success) {
    console.log('✓ Clase actualizada');
  } else {
    console.log('✗ Error:', resultado.message);
  }
}

/**
 * Ejemplo 5.3: Eliminar una clase
 */
function ejemplo_eliminarClase() {
  const schedule = Schedule.getSchedule();
  if (schedule.length === 0) {
    console.log('No hay clases para eliminar');
    return;
  }
  
  const eventoID = schedule[0].id;
  const resultado = Schedule.deleteScheduleEvent(eventoID);
  
  if (resultado.success) {
    console.log('✓ Clase eliminada');
  } else {
    console.log('✗ Error:', resultado.message);
  }
}

// ===================================================================
// EJEMPLOS 6: OBTENER Y VISUALIZAR HORARIO
// ===================================================================

/**
 * Ejemplo 6.1: Obtener horario como array
 */
function ejemplo_obtenerHorario() {
  const schedule = Schedule.getSchedule();
  console.log(`Total de clases: ${schedule.length}`);
  console.table(schedule.map(s => ({
    Materia: s.subject,
    Día: s.day,
    Hora: `${s.startTime} - ${s.endTime}`,
    Modalidad: s.modality
  })));
}

/**
 * Ejemplo 6.2: Obtener horario organizado por día
 */
function ejemplo_horarioPorDia() {
  const horarioPorDia = Schedule.getScheduleByDay();
  
  Object.entries(horarioPorDia).forEach(([dia, eventos]) => {
    console.log(`\n=== ${dia.toUpperCase()} ===`);
    if (eventos.length === 0) {
      console.log('Sin clases');
    } else {
      eventos.forEach(e => {
        console.log(`${e.startTime}-${e.endTime} | ${e.subject} (${e.modality})`);
      });
    }
  });
}

/**
 * Ejemplo 6.3: Obtener clases de un día específico
 */
function ejemplo_clasesDelDia() {
  const dia = 'Lunes';
  const horarioPorDia = Schedule.getScheduleByDay();
  const clasesDelDia = horarioPorDia[dia];
  
  console.log(`\n=== Clases del ${dia} ===`);
  if (clasesDelDia.length === 0) {
    console.log('Sin clases este día');
  } else {
    clasesDelDia.forEach(clase => {
      console.log(`${clase.startTime} - ${clase.endTime}: ${clase.subject}`);
    });
  }
}

// ===================================================================
// EJEMPLOS 7: EXPORTACIÓN Y PERSISTENCIA
// ===================================================================

/**
 * Ejemplo 7.1: Obtener datos para exportar
 */
function ejemplo_datosExportacion() {
  const datos = Schedule.getExportData();
  console.log('=== Datos para PDF ===');
  console.log(`Estudiante: ${datos.studentName}`);
  console.log(`Carrera: ${datos.career}`);
  console.log(`Ciclo: ${datos.cycle}`);
  console.log(`Clases totales: ${Object.values(datos.schedule).reduce((a, b) => a + b.length, 0)}`);
  console.log(`Fecha generación: ${datos.generatedAt}`);
}

/**
 * Ejemplo 7.2: Exportar a PDF
 */
function ejemplo_exportarPDF() {
  // Asegurarse de que jsPDF está disponible
  if (typeof jsPDF === 'undefined') {
    console.error('Error: jsPDF no cargada');
    return;
  }
  
  const exito = SchedulePDF.exportScheduleToPDF();
  console.log('PDF exportado:', exito ? 'Sí' : 'No');
}

/**
 * Ejemplo 7.3: Exportar a texto
 */
function ejemplo_exportarTexto() {
  SchedulePDF.exportScheduleAsText();
  console.log('Archivo de texto descargado');
}

/**
 * Ejemplo 7.4: Copiar horario a portapapeles (Markdown)
 */
function ejemplo_copiarPortapapeles() {
  const resultado = SchedulePDF.copyToClipboard();
  console.log(resultado);
}

// ===================================================================
// EJEMPLOS 8: DATOS DE ALMACENAMIENTO
// ===================================================================

/**
 * Ejemplo 8.1: Ver todos los datos en localStorage
 */
function ejemplo_verAlmacenamiento() {
  console.log('=== Datos en localStorage ===');
  
  // Usuarios
  const usuarios = Storage.getUsers();
  console.log(`Usuarios (${usuarios.length}):`, usuarios);
  
  // Usuario actual
  const usuarioActual = Storage.getUser();
  console.log(`Usuario actual: ${usuarioActual}`);
  
  // Tema
  const tema = Storage.getTheme();
  console.log(`Tema: ${tema}`);
}

/**
 * Ejemplo 8.2: Exportar datos de un usuario (para backup)
 */
function ejemplo_backupUsuario() {
  const usuarioName = 'Juan Pérez';
  const datos = Storage.exportUserData(usuarioName);
  
  if (datos) {
    console.log(`=== Backup de ${usuarioName} ===`);
    console.log(JSON.stringify(datos, null, 2));
    
    // Copiar JSON al portapapeles
    const json = JSON.stringify(datos, null, 2);
    navigator.clipboard.writeText(json);
    console.log('✓ Datos copiados al portapapeles');
  } else {
    console.log('Usuario no encontrado');
  }
}

/**
 * Ejemplo 8.3: Importar datos de un usuario (restore)
 */
function ejemplo_restoreUsuario() {
  const datosUsuario = {
    name: 'Nuevo Usuario Importado',
    career: 'Ingeniería en Sistemas',
    currentCycle: 1,
    schedule: [
      {
        id: Date.now(),
        subject: 'Programación I',
        day: 'Lunes',
        startTime: '08:00',
        endTime: '09:30',
        modality: 'Virtual'
      }
    ],
    approvedSubjects: ['Lógica']
  };
  
  Storage.importUserData(datosUsuario);
  console.log('✓ Usuario importado exitosamente');
}

// ===================================================================
// EJEMPLOS 9: CASOS REALES COMPLETOS
// ===================================================================

/**
 * Caso Real 1: Estudiante nuevo crea su primer horario
 */
function caso_estudianteNuevo() {
  console.log('=== CASO: Estudiante Nuevo ===\n');
  
  // 1. Crear perfil
  console.log('1. Creando perfil...');
  Schedule.createUser('Ana Silva', 'Ingeniería en Sistemas', 1);
  console.log('✓ Perfil creado\n');
  
  // 2. Marcar materias aprobadas del ciclo anterior
  console.log('2. Marcando materias aprobadas...');
  const aprobadas = ['Matemática I', 'Lógica Matemática', 'Introducción a la Programación'];
  aprobadas.forEach(m => Schedule.approveSubject(m));
  console.log(`✓ ${aprobadas.length} materias marcadas\n`);
  
  // 3. Agregar clases
  console.log('3. Agregando clases al horario...');
  const clases = [
    { subject: 'Programación II', day: 'Lunes', startTime: '07:00', endTime: '08:30', modality: 'Virtual' },
    { subject: 'Programación II', day: 'Miércoles', startTime: '07:00', endTime: '08:30', modality: 'Virtual' },
    { subject: 'Base de Datos', day: 'Martes', startTime: '09:00', endTime: '10:30', modality: 'Presencial', room: 'Aula 301' },
    { subject: 'Base de Datos', day: 'Jueves', startTime: '09:00', endTime: '10:30', modality: 'Presencial', room: 'Aula 301' }
  ];
  
  clases.forEach(clase => {
    Schedule.addScheduleEvent(clase);
  });
  console.log(`✓ ${clases.length} clases agregadas\n`);
  
  // 4. Mostrar resumen
  console.log('4. Resumen del horario:');
  const horario = Schedule.getScheduleByDay();
  const totalClases = Object.values(horario).reduce((a, b) => a + b.length, 0);
  console.log(`Total de clases: ${totalClases}`);
  console.log(`Materias únicas: ${new Set(clases.map(c => c.subject)).size}`);
  console.log(`Aprobadas: ${Schedule.getApprovedSubjects().length}\n`);
  
  // 5. Exportar PDF
  console.log('5. Exportando PDF...');
  SchedulePDF.exportScheduleToPDF();
  console.log('✓ PDF descargado');
}

/**
 * Caso Real 2: Corregir horario por conflicto
 */
function caso_corregirConflicto() {
  console.log('=== CASO: Corregir Conflicto ===\n');
  
  // 1. Ver horario actual
  const schedule = Schedule.getSchedule();
  console.log(`Clases actuales: ${schedule.length}\n`);
  
  // 2. Intento de agregar clase conflictiva
  console.log('1. Intentando agregar clase conflictiva...');
  const resultado = Schedule.addScheduleEvent({
    subject: 'Física II',
    day: 'Lunes',
    startTime: '07:30',
    endTime: '09:00',
    modality: 'Presencial'
  });
  
  if (!resultado.success) {
    console.log(`✗ ${resultado.message}`);
    console.log('Conflicto con:', resultado.conflicts);
    
    // 3. Corregir horario
    console.log('\n2. Cambiando horario de la clase...');
    const resultado2 = Schedule.addScheduleEvent({
      subject: 'Física II',
      day: 'Lunes',
      startTime: '09:30',  // Nueva hora sin conflicto
      endTime: '11:00',
      modality: 'Presencial'
    });
    
    if (resultado2.success) {
      console.log('✓ Clase agregada sin conflictos');
    }
  }
}

/**
 * Caso Real 3: Cambiar entre perfiles de estudiantes
 */
function caso_cambiarEstudiantes() {
  console.log('=== CASO: Cambiar Entre Estudiantes ===\n');
  
  // 1. Crear dos usuarios
  console.log('1. Creando dos perfiles...');
  Schedule.createUser('María García', 'Ingeniería en Sistemas', 2);
  Schedule.createUser('Pedro López', 'Ingeniería en Sistemas', 2);
  
  // 2. Cambiar a María y agregar clases
  console.log('2. Horario de María:');
  Schedule.switchUser('María García');
  Schedule.addScheduleEvent({
    subject: 'Bases de Datos Avanzada',
    day: 'Lunes',
    startTime: '10:00',
    endTime: '11:30',
    modality: 'Presencial'
  });
  console.log(`   Clases: ${Schedule.getSchedule().length}`);
  
  // 3. Cambiar a Pedro y agregar clases diferentes
  console.log('3. Horario de Pedro:');
  Schedule.switchUser('Pedro López');
  Schedule.addScheduleEvent({
    subject: 'Redes de Computadoras',
    day: 'Martes',
    startTime: '14:00',
    endTime: '15:30',
    modality: 'Virtual'
  });
  console.log(`   Clases: ${Schedule.getSchedule().length}`);
  
  // 4. Verificar independencia
  console.log('\n4. Los horarios son independientes:');
  console.log(`   María tiene ${Storage.getUsers().find(u => u.name === 'María García').schedule.length} clases`);
  console.log(`   Pedro tiene ${Storage.getUsers().find(u => u.name === 'Pedro López').schedule.length} clases`);
}

// ===================================================================
// MENÚ DE PRUEBAS
// ===================================================================

/**
 * Ejecutar todos los ejemplos
 */
function ejecutarTodos() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║        EJEMPLOS DEL MÓDULO DE HORARIOS INTELIGENTES        ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  console.log('Ejemplos disponibles:\n');
  console.log('USUARIOS:');
  console.log('  ejemplo_crearUsuario()');
  console.log('  ejemplo_cambiarUsuario()');
  console.log('  ejemplo_listarUsuarios()');
  console.log('  ejemplo_datosCuenta()');
  
  console.log('\nMATERIAS APROBADAS:');
  console.log('  ejemplo_marcarAprobada()');
  console.log('  ejemplo_verificarAprobada()');
  console.log('  ejemplo_listarAprobadas()');
  console.log('  ejemplo_desmarcarAprobada()');
  
  console.log('\nCLASES:');
  console.log('  ejemplo_agregarClase()');
  console.log('  ejemplo_agregarMultiplesClases()');
  console.log('  ejemplo_conflictoDetectado()');
  console.log('  ejemplo_editarClase()');
  console.log('  ejemplo_eliminarClase()');
  
  console.log('\nHORARIO:');
  console.log('  ejemplo_obtenerHorario()');
  console.log('  ejemplo_horarioPorDia()');
  console.log('  ejemplo_clasesDelDia()');
  
  console.log('\nEXPORTACIÓN:');
  console.log('  ejemplo_datosExportacion()');
  console.log('  ejemplo_exportarPDF()');
  console.log('  ejemplo_exportarTexto()');
  
  console.log('\nCASOS REALES:');
  console.log('  caso_estudianteNuevo()');
  console.log('  caso_corregirConflicto()');
  console.log('  caso_cambiarEstudiantes()');
  
  console.log('\n💡 Copia cualquier función en la consola para ejecutarla');
}

// Mostrar menú al cargar
ejecutarTodos();
