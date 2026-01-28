# 📅 MÓDULO DE HORARIOS INTELIGENTES - DOCUMENTACIÓN COMPLETA

## 🎯 VISIÓN GENERAL

Sistema profesional y modular de generación y gestión de horarios académicos para una plataforma de pensum universitario, desarrollado en HTML, CSS y JavaScript puro (sin frameworks).

### Características Principales:
- ✅ Gestión de materias aprobadas sin bloqueo irreversible
- ✅ Generador de horarios con detección automática de conflictos
- ✅ Múltiples perfiles de estudiantes con datos independientes
- ✅ Exportación automática a PDF profesional
- ✅ UX/UI responsive y animado
- ✅ Persistencia total en localStorage
- ✅ 100% Frontend (sin backend requerido)

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
e:\CICLO V\Sistema de Pesum Html, CSS y JS\
│
├── index.html                    # HTML principal (actualizado con tabs)
│
├── css/
│   ├── styles.css               # Estilos base (actualizado)
│   ├── themes.css               # Sistema de temas
│   ├── animations.css           # Animaciones
│   └── schedule.css             # Estilos del módulo de horarios
│
├── js/
│   ├── data.js                  # Datos del pensum
│   ├── storage.js               # Gestión de localStorage (actualizado)
│   ├── ui.js                    # Renderización del pensum
│   ├── app.js                   # App principal
│   ├── schedule.js              # Lógica de horarios (NUEVO)
│   ├── scheduleUI.js            # UI del módulo de horarios (NUEVO)
│   └── schedulePDF.js           # Exportación a PDF (NUEVO)
│
├── manifest.json                # PWA manifest
├── sw.js                        # Service Worker
│
└── assets/
    └── icons/                   # Iconos PWA
```

---

## 🔧 ARQUITECTURA MODULAR

### 1️⃣ **schedule.js** - Motor de Lógica
**Clase: `ScheduleManager`**

Responsabilidades centrales:
```javascript
// Gestión de usuarios
Schedule.createUser(name)           // Crear nuevo perfil
Schedule.switchUser(userName)       // Cambiar usuario
Schedule.getCurrentUserData()       // Obtener datos del usuario actual

// Gestión de materias aprobadas
Schedule.approveSubject(name)       // Marcar como aprobada
Schedule.unapproveSubject(name)     // Desmarcar (DESHACE)
Schedule.getApprovedSubjects()      // Lista de aprobadas

// Gestión de horarios
Schedule.addScheduleEvent(event)       // Agregar clase (con validación)
Schedule.updateScheduleEvent(id, event) // Editar clase
Schedule.deleteScheduleEvent(id)        // Eliminar clase
Schedule.getSchedule()                  // Obtener horario
Schedule.getScheduleByDay()             // Horario organizado por día

// Detección de conflictos
Schedule.detectConflicts(event)     // Detecta solapamientos
Schedule.validateEvent(event)       // Valida datos del evento

// Exportación
Schedule.getExportData()            // Datos para PDF
```

**Funcionalidad de Conflictos:**
```javascript
// Ejemplo: Martes 10:00-11:30 vs Martes 11:00-12:00
detectConflicts() {
  // Compara solo el MISMO DÍA
  if (newStart < eventEnd && newEnd > eventStart) {
    // CONFLICTO DETECTADO
    return [{ subject: '...', time: '...' }]
  }
}
```

### 2️⃣ **scheduleUI.js** - Interfaz de Usuario
**Clase: `ScheduleUI`**

Responsabilidades:
```javascript
// Renderización principal
ScheduleUI_Instance.renderScheduleModule()   // Renderiza toda la sección

// Componentes individuales
renderSubjectsControl()     // Lista de materias aprobadas
renderScheduleTable()       // Tabla de horarios visual
populateUserSelect()        // Selector de usuarios
displayCurrentUser()        // Info del usuario actual

// Gestión de formularios
submitForm(event)           // Procesa nuevo evento
attachEventListeners()      // Carga todos los listeners

// Handlers de usuario
switchUserHandler()         // Cambiar de usuario
newUserHandler()            // Crear nuevo perfil
unapproveSubjectHandler()   // Desmarcar materia
editEventHandler()          // Editar clase
deleteEventHandler()        // Eliminar clase
clearScheduleHandler()      // Limpiar horario

// Retroalimentación
showFeedback(result)        // Muestra mensajes (éxito/error)

// Animaciones
animateAddEvent()           // Anima adición
animateRemoveEvent()        // Anima eliminación
animatePdfExport()          // Anima descarga
```

**Tabla Visual:**
```
┌──────────┬────────────┬──────────┬─────────────┬─────────────┬──────────┬──────────┬───────────┐
│   Hora   │   Lunes    │ Martes   │  Miércoles  │   Jueves    │ Viernes  │ Sábado   │  Domingo  │
├──────────┼────────────┼──────────┼─────────────┼─────────────┼──────────┼──────────┼───────────┤
│ 06:00    │            │          │             │             │          │          │           │
│ 07:00    │ Prog II    │ Prog II  │  BD         │  Prog II    │ BD       │          │           │
│          │ 07:30-09:00│ 07:30-09 │ 07:00-09:30 │ 07:30-09:00 │ 07:00-09 │          │           │
│          │ Virtual    │ Presenc. │  Presencial │  Virtual    │ Virtual  │          │           │
└──────────┴────────────┴──────────┴─────────────┴─────────────┴──────────┴──────────┴───────────┘
```

### 3️⃣ **schedulePDF.js** - Exportación
**Clase: `SchedulePDFExporter`**

Métodos:
```javascript
SchedulePDF.exportScheduleToPDF()      // Descarga PDF (jsPDF + autoTable)
SchedulePDF.exportScheduleAsText()     // Descarga como TXT
SchedulePDF.copyToClipboard()          // Copia a portapapeles (Markdown)
```

**Contenido del PDF:**
- Header profesional con nombre y carrera
- Tabla de 7 días x 16 horas
- Información del estudiante
- Footer con numeración de páginas
- Diseño responsive landscape

### 4️⃣ **storage.js** - Persistencia
**Objeto: `Storage`**

```javascript
// Usuarios
Storage.getUsers()              // Array de todos los usuarios
Storage.saveUsers(users)        // Guardar usuarios
Storage.getUser()               // Usuario actual
Storage.setUser(userName)       // Establecer usuario actual
Storage.exportUserData(name)    // Exportar perfil completo
Storage.importUserData(user)    // Importar perfil (backup)

// Legacy (Pensum)
Storage.getCompleted()          // Materias completadas
Storage.saveCompleted(list)     // Guardar completadas
Storage.getTheme()              // Tema activo
Storage.saveTheme(theme)        // Guardar tema
```

**Estructura de Usuario en localStorage:**
```json
{
  "name": "Juan Pérez",
  "career": "Ingeniería en Sistemas",
  "currentCycle": 3,
  "schedule": [
    {
      "id": 1674950400000,
      "subject": "Programación II",
      "day": "Lunes",
      "startTime": "07:30",
      "endTime": "09:00",
      "modality": "Virtual",
      "room": "Zoom Link"
    }
  ],
  "approvedSubjects": ["Lógica", "Matemática I", "Física"]
}
```

---

## 🚀 FLUJOS DE TRABAJO

### 1. CREAR NUEVO USUARIO
```
[Usuario] → Click "Nuevo Perfil"
  ↓
[ScheduleUI] → prompt nombre
  ↓
[Schedule.createUser()] → Validar nombre único
  ↓
[Storage] → Guardar en localStorage
  ↓
[ScheduleUI] → Re-renderizar módulo
  ✅ Nuevo usuario activo
```

### 2. MARCAR MATERIA APROBADA
```
[Usuario] → Click materia en tabla
  ↓
[ScheduleUI] → Confirmación visual
  ↓
[Schedule.approveSubject()] → Agregar a lista
  ↓
[Storage] → Guardar en localStorage
  ↓
[ScheduleUI] → Mostrar en "Materias Aprobadas"
  ✅ Materia marcada (NO BLOQUEADA)
```

### 3. DESMARCAR MATERIA (Deshacer Aprobación)
```
[Usuario] → Click "Desmarcar" en Materias Aprobadas
  ↓
[ScheduleUI] → Confirmación (¿Desmarcar?)
  ↓
[Schedule.unapproveSubject()] → Remover de lista
  ↓
[Storage] → Guardar en localStorage
  ↓
[ScheduleUI] → Remover de "Materias Aprobadas"
  ✅ Materia desmarcada (REVERSIBLE)
```

### 4. AGREGAR CLASE AL HORARIO
```
[Usuario] → Llena formulario + Click "Agregar"
  ↓
[ScheduleUI.submitForm()] → Recopila datos
  ↓
[Schedule.validateEvent()] → ¿Datos válidos?
  ├─ NO → Mostrar error
  └─ SÍ → Siguiente
      ↓
  [Schedule.detectConflicts()] → ¿Hay solapamiento?
      ├─ SÍ → Mostrar conflicto y sugerencias
      └─ NO → Siguiente
          ↓
      [Schedule.addScheduleEvent()] → Agregar a lista
          ↓
      [Storage] → Guardar en localStorage
          ↓
      [ScheduleUI] → Re-renderizar tabla + animación
        ✅ Clase agregada
```

### 5. DETECTAR CONFLICTOS
```javascript
// Ejemplo de colisión:
Evento Nuevo:  Martes 10:00-11:30
Evento Actual: Martes 11:00-12:00

Lógica:
  newStart (600 min)  < eventEnd (720 min) ✓
  newEnd (690 min)    > eventStart (660 min) ✓
  → CONFLICTO DETECTADO

Resultado: {
  subject: "Programación II",
  day: "Martes",
  time: "11:00 - 12:00"
}
```

### 6. EDITAR EVENTO
```
[Usuario] → Click ✏️ en evento
  ↓
[ScheduleUI] → Poblamos formulario con datos
  ↓
[Usuario] → Modifica datos + Click "Actualizar"
  ↓
[Schedule.updateScheduleEvent()] → Valida sin contar evento actual
  ↓
[Storage] → Guardar cambios
  ↓
[ScheduleUI] → Re-renderizar tabla
  ✅ Evento actualizado
```

### 7. EXPORTAR A PDF
```
[Usuario] → Click "Descargar PDF"
  ↓
[SchedulePDF.exportScheduleToPDF()]
  ├─ Verifica jsPDF disponible
  ├─ Genera header profesional
  ├─ Crea tabla con autoTable
  ├─ Agrega footer con páginas
  └─ doc.save(nombre_archivo)
      ↓
[navegador] → Descarga archivo PDF
  ✅ PDF generado (100% Frontend)
```

---

## 🎨 DISEÑO Y ESTILOS

### Paleta de Colores:
```css
--schedule-primary:     #6366f1 (Índigo)
--schedule-success:     #10b981 (Verde)
--schedule-danger:      #ef4444 (Rojo)
--schedule-warning:     #f59e0b (Ámbar)
--schedule-info:        #0891b2 (Cian)
--schedule-virtual:     #7c3aed (Púrpura)
--schedule-presencial:  #0891b2 (Cian)
```

### Componentes Visuales:
```
┌─ Sección de Usuarios (Gradiente Púrpura)
│  └─ Selector + Botones + Info Actual
│
├─ Sección de Materias (Gradiente Rosa)
│  └─ Tarjetas aprobadas con deshacer
│
├─ Sección de Formulario (Blanco con gradiente)
│  └─ Campos + Buttons + Feedback
│
└─ Sección de Horario (Tabla profesional)
   └─ Tabla 7 días x 16 horas
```

### Animaciones:
- **slideIn**: Aparición de eventos (0.3s)
- **pulse**: Parpadeo al agregar (0.5s)
- **fadeInUp**: Fade al eliminar (0.3s)
- **download**: Movimiento al descargar (0.6s)
- **hover**: Escalado de eventos (transform scale)

### Responsive:
- **Desktop** (>1024px): Grid completo, tabla con scroll horizontal
- **Tablet** (768px-1024px): 2 columnas en formulario
- **Móvil** (<768px): 1 columna, tabs verticales, tabla scrolleable
- **Small móvil** (<480px): Fuentes reducidas, compactación máxima

---

## 📊 DATOS Y PERSISTENCIA

### LocalStorage Keys:
```javascript
"users"           // Array: [{ name, career, cycle, schedule, approvedSubjects }]
"currentUser"     // String: nombre del usuario activo
"completed"       // Array: materias completadas del pensum
"theme"           // String: tema activo (rosa, azul, etc)
```

### Estructura Completa de Usuario:
```javascript
{
  name: "María García",
  career: "Ingeniería en Sistemas",
  currentCycle: 2,
  
  schedule: [
    {
      id: 1674950400000,
      subject: "Programación II",
      day: "Lunes",
      startTime: "07:30",
      endTime: "09:00",
      modality: "Virtual",
      room: "https://zoom.us/..."
    },
    // ... más eventos
  ],
  
  approvedSubjects: [
    "Lógica Matemática",
    "Matemática I",
    "Física General"
  ]
}
```

### Capacidad Estimada:
- localStorage típico: 5-10 MB
- Por usuario (horario completo): ~10-15 KB
- Soporta: +300 usuarios simultáneamente

---

## 🔐 VALIDACIONES

### Evento de Horario:
```javascript
validations: [
  ✓ Materia: no vacía, no repetida en el mismo horario
  ✓ Día: Lunes-Domingo válidos
  ✓ Inicio/Fin: formato HH:MM válido
  ✓ Fin > Inicio: verificación de rango
  ✓ Modalidad: Virtual | Presencial
  ✓ Sin conflictos: no solapamiento en mismo día
]
```

### Detección de Conflictos:
```javascript
// Solo compara:
- MISMO DÍA
- HORAS QUE SE SOLAPAN

// Permite:
- Lunes 8:00-9:00 + Lunes 9:00-10:00 (back-to-back ✓)
- Lunes 8:00-9:00 + Martes 8:00-9:00 (diferente día ✓)

// Rechaza:
- Lunes 8:00-10:00 + Lunes 9:00-11:00 (solapamiento ✗)
- Lunes 8:00-11:00 + Lunes 9:00-10:00 (contiene ✗)
```

---

## 🎯 CASOS DE USO COMPLETOS

### Caso 1: Estudiante Juan crea su horario
```
1. Crea perfil: "Juan Pérez"
2. Marca Programación II como aprobada
3. Agrega clase: 
   - Materia: Programación II
   - Día: Lunes
   - 07:30 - 09:00
   - Modalidad: Virtual
   - Link: https://zoom.us/...
4. Sistema valida ✓
5. Agrega a tabla
6. Descarga PDF con su horario
```

### Caso 2: Error y corrección
```
1. Juan intenta agregar:
   - Programación II: Martes 10:00-11:30
2. Sistema detecta conflicto con Martes 11:00-12:00
3. Muestra: "Conflicto: Base de Datos (11:00-12:00)"
4. Juan modifica a Martes 08:00-09:30
5. Sin conflicto ✓ → Agregado exitosamente
```

### Caso 3: Cambio de usuario
```
1. Juan está activo con horario
2. Click en "Cambiar Usuario" → Selecciona "María García"
3. Sistema cambia localStorage:currentUser = "María García"
4. Se renderiza horario de María (diferente)
5. Horario de Juan permanece intacto
6. María desaprueba una materia (Juan no se afecta)
7. Vuelve a Juan → su horario intacto
```

---

## 🛠️ INSTALACIÓN Y USO

### 1. Cargar módulo en HTML:
```html
<!-- En <head> -->
<link rel="stylesheet" href="css/schedule.css">

<!-- Antes de </body> -->
<script src="js/schedule.js"></script>
<script src="js/scheduleUI.js"></script>
<script src="js/schedulePDF.js"></script>

<!-- Librerías para PDF -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js"></script>

<!-- Inicializar -->
<script>
  document.addEventListener('DOMContentLoaded', () => {
    ScheduleUI_Instance.renderScheduleModule();
  });
</script>
```

### 2. Uso programático:
```javascript
// Crear usuario
Schedule.createUser('Pedro López');

// Marcar materia
Schedule.approveSubject('Matemática I');

// Agregar clase
Schedule.addScheduleEvent({
  subject: 'Programación II',
  day: 'Lunes',
  startTime: '07:30',
  endTime: '09:00',
  modality: 'Virtual',
  room: 'Zoom Link'
});

// Obtener horario
const schedule = Schedule.getScheduleByDay();

// Exportar a PDF
SchedulePDF.exportScheduleToPDF();
```

---

## 📝 MÉTODOS Y FUNCIONES

### Métodos Públicos de Schedule:

| Método | Parámetros | Retorna | Descripción |
|--------|-----------|---------|-------------|
| `createUser()` | name, career?, cycle? | {success, message} | Crea perfil nuevo |
| `switchUser()` | userName | boolean | Cambia usuario activo |
| `getAllUsers()` | - | User[] | Lista todos usuarios |
| `approveSubject()` | subjectName | boolean | Marca aprobada |
| `unapproveSubject()` | subjectName | boolean | Desaprueba (DESHACE) |
| `getApprovedSubjects()` | - | string[] | Lista aprobadas |
| `addScheduleEvent()` | event | {success, message, event?} | Agrega clase |
| `updateScheduleEvent()` | eventId, event | {success, message} | Edita clase |
| `deleteScheduleEvent()` | eventId | {success, message} | Elimina clase |
| `getSchedule()` | - | Event[] | Array de eventos |
| `getScheduleByDay()` | - | {[day]: Event[]} | Eventos por día |
| `detectConflicts()` | event, schedule? | Conflict[] | Detecta solapamientos |
| `validateEvent()` | event | {valid, message} | Valida evento |
| `getExportData()` | - | ExportData | Datos para PDF |

---

## 🐛 DEBUGGING

### Herramientas útiles en consola:
```javascript
// Ver usuario actual
console.log(Schedule.getCurrentUserData());

// Ver todos los usuarios
console.log(Storage.getUsers());

// Ver horario actual
console.log(Schedule.getScheduleByDay());

// Ver materias aprobadas
console.log(Schedule.getApprovedSubjects());

// Limpiar todo (testing)
Storage.clearAll();

// Detectar conflicto específico
Schedule.detectConflicts({
  subject: 'Test',
  day: 'Lunes',
  startTime: '08:00',
  endTime: '09:00'
});
```

---

## 📱 CARACTERÍSTICAS RESPONSIVE

| Dispositivo | Comportamiento |
|-------------|----------------|
| Desktop (>1024px) | Tabla completa, grid 3 cols, todos los controles visibles |
| Tablet (768-1024px) | Grid 2 cols, tabla con scroll, controles apilados |
| Móvil (480-768px) | Grid 1 col, tabla scrolleable, botones full-width |
| Small móvil (<480px) | Fuentes 70%, compactación máxima, tabla muy comprimida |

---

## 🔮 MEJORAS FUTURAS

1. **Integración con Pensum**:
   - Bloquear agregar clases de materias no aprobadas (opcional)
   - Sincronizar ciclo actual automáticamente

2. **Características Avanzadas**:
   - Importar horario desde archivo JSON
   - Exportar horario a iCal (Google Calendar)
   - Recordatorios de clases (notifications API)
   - Tema oscuro dedicado
   - Colores personalizados por materia

3. **Backend (Opcional)**:
   - Sincronizar con servidor
   - Compartir horario con compañeros
   - Historial de cambios
   - Estadísticas de carga académica

4. **UX/UI**:
   - Drag & drop para reorganizar clases
   - Vista mensual
   - Filtros avanzados
   - Búsqueda de clases

---

## 📄 LICENCIA Y CRÉDITOS

Sistema desarrollado con:
- **HTML5** semántico
- **CSS3** modular (sin frameworks)
- **JavaScript ES6+** puro (sin librerías excepto jsPDF)
- **jsPDF + autoTable** para exportación

Totalmente **responsivo**, **accesible** y **profesional**.

---

**Versión**: 1.0  
**Última actualización**: Enero 2026  
**Autor**: Sistema Académico Modular

