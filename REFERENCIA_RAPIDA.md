# 🎯 REFERENCIA RÁPIDA - MÓDULO DE HORARIOS

## 🚀 INICIO RÁPIDO (30 segundos)

```javascript
// 1. Crear usuario
Schedule.createUser('Tu Nombre')

// 2. Agregar clase
Schedule.addScheduleEvent({
  subject: 'Programación II',
  day: 'Lunes',
  startTime: '07:30',
  endTime: '09:00',
  modality: 'Virtual'
})

// 3. Descargar PDF
SchedulePDF.exportScheduleToPDF()
```

---

## 📋 MÉTODOS PRINCIPALES

### Usuarios
| Método | Resultado |
|--------|-----------|
| `Schedule.createUser('Nombre')` | Crea nuevo perfil |
| `Schedule.switchUser('Nombre')` | Cambia usuario activo |
| `Schedule.getAllUsers()` | Lista todos usuarios |
| `Schedule.getCurrentUserData()` | Datos usuario actual |

### Materias
| Método | Resultado |
|--------|-----------|
| `Schedule.approveSubject('Materia')` | Marca aprobada |
| `Schedule.unapproveSubject('Materia')` | Desaprueba (DESHACE) |
| `Schedule.getApprovedSubjects()` | Lista aprobadas |
| `Schedule.isSubjectApproved('Materia')` | ¿Está aprobada? |

### Horario
| Método | Resultado |
|--------|-----------|
| `Schedule.addScheduleEvent(event)` | Agrega clase |
| `Schedule.updateScheduleEvent(id, event)` | Edita clase |
| `Schedule.deleteScheduleEvent(id)` | Elimina clase |
| `Schedule.getSchedule()` | Array de eventos |
| `Schedule.getScheduleByDay()` | Organizados por día |
| `Schedule.detectConflicts(event)` | Detecta choques |
| `Schedule.validateEvent(event)` | Valida datos |

### Exportación
| Método | Resultado |
|--------|-----------|
| `SchedulePDF.exportScheduleToPDF()` | Descarga PDF |
| `SchedulePDF.exportScheduleAsText()` | Descarga TXT |
| `SchedulePDF.copyToClipboard()` | Copia al portapapeles |

### Storage
| Método | Resultado |
|--------|-----------|
| `Storage.getUsers()` | Array de usuarios |
| `Storage.getUser()` | Usuario actual (string) |
| `Storage.setUser('Nombre')` | Establecer usuario |
| `Storage.exportUserData('Nombre')` | Exportar perfil |
| `Storage.importUserData(user)` | Importar perfil |

---

## 🎨 ESTRUCTURA DEL EVENTO

```javascript
const evento = {
  subject: 'Programación II',      // REQUERIDO: nombre de materia
  day: 'Lunes',                    // REQUERIDO: Lunes-Domingo
  startTime: '07:30',              // REQUERIDO: HH:MM (formato 24h)
  endTime: '09:00',                // REQUERIDO: HH:MM (debe ser > startTime)
  modality: 'Virtual',             // REQUERIDO: 'Virtual' o 'Presencial'
  room: 'Zoom Link'                // OPCIONAL: Aula 305 o link
}
```

---

## ✅ VALIDACIONES AUTOMÁTICAS

```javascript
✓ Materia: no vacía
✓ Día: Lunes-Domingo válidos
✓ Horas: formato HH:MM correcto
✓ Fin > Inicio: rango válido
✓ Modalidad: Virtual o Presencial
✓ Sin conflictos: no solapamiento en mismo día
```

---

## 🧠 DETECCIÓN DE CONFLICTOS

```javascript
// DETECTA CONFLICTO
Lunes 08:00-09:00
+ Lunes 08:30-09:30    ❌ Se solapan

// NO detecta conflicto (back-to-back está permitido)
Lunes 08:00-09:00
+ Lunes 09:00-10:00    ✓ Permitido

// NO detecta conflicto (diferente día)
Lunes 08:00-09:00
+ Martes 08:00-09:00   ✓ Permitido
```

---

## 💾 LOCALSTORAGE KEYS

```javascript
localStorage['users']      // Array de usuarios
localStorage['currentUser'] // Usuario activo (string)
localStorage['theme']      // Tema activo
localStorage['completed']  // Materias completadas (pensum)
```

---

## 🎛️ INTERFAZ DE USUARIO

### Secciones
1. **👥 Perfiles** - Crear/cambiar usuario
2. **✅ Materias** - Ver aprobadas, desmarcar
3. **➕ Formulario** - Agregar clase
4. **📅 Tabla** - Visualizar horario + editar/eliminar

### Colores
- **Virtual**: Púrpura (#7c3aed)
- **Presencial**: Cian (#0891b2)

### Botones
| Botón | Acción |
|-------|--------|
| Agregar al Horario | Agrega clase (con validación) |
| Descargar PDF | Exporta PDF profesional |
| Limpiar Horario | Vacía todas las clases |
| Cambiar Usuario | Selecciona otro perfil |
| Nuevo Perfil | Crea usuario |
| ✏️ en evento | Edita clase |
| 🗑️ en evento | Elimina clase |
| ✕ en materia | Desaprueba |

---

## 🔍 DEBUGGING EN CONSOLA

```javascript
// Ver usuario actual
Schedule.getCurrentUserData()

// Ver todos los usuarios
Storage.getUsers()

// Ver horario actual
Schedule.getScheduleByDay()

// Ver materias aprobadas
Schedule.getApprovedSubjects()

// Verificar conflictos
Schedule.detectConflicts({...})

// Validar evento
Schedule.validateEvent({...})

// Ver localStorage completo
console.log(localStorage)

// Limpiar todo (testing)
Storage.clearAll()
```

---

## 🐛 ERRORES COMUNES

| Error | Solución |
|-------|----------|
| "PDF no se descarga" | Verifica que jsPDF esté cargada: `console.log(typeof jsPDF)` |
| "localStorage vacío" | Comprueba configuración de privacidad del navegador |
| "Horario no se renderiza" | Ejecuta: `ScheduleUI_Instance.renderScheduleModule()` |
| "Clase no se guarda" | Abre DevTools, busca errores en Consola |
| "Usuario no cambia" | Verifica que el nombre exista: `Storage.getUsers()` |

---

## 📱 RESPONSIVE BREAKPOINTS

```css
Desktop:      >1024px   (100% funcionalidad)
Tablet:       768-1024px (grid 2 cols)
Móvil:        480-768px  (grid 1 col)
Mini móvil:   <480px     (compactado)
```

---

## 🎬 CASOS DE PRUEBA RÁPIDOS

### Test 1: Crear usuario y agregar clase
```javascript
Schedule.createUser('Test User')
Schedule.addScheduleEvent({
  subject: 'Test',
  day: 'Lunes',
  startTime: '08:00',
  endTime: '09:00',
  modality: 'Virtual'
})
console.log(Schedule.getSchedule()) // Debe mostrar 1 evento
```

### Test 2: Detectar conflicto
```javascript
const resultado = Schedule.addScheduleEvent({
  subject: 'Test 2',
  day: 'Lunes',
  startTime: '08:30',
  endTime: '09:30',
  modality: 'Virtual'
})
console.log(resultado.conflicts) // Debe mostrar conflicto
```

### Test 3: Múltiples usuarios
```javascript
Schedule.createUser('User 1')
Schedule.addScheduleEvent({...}) // Agrega clase
Schedule.createUser('User 2')
// User 2 tiene horario vacío
console.log(Storage.getUsers()) // Ambos usuarios con datos diferentes
```

---

## 📚 DOCUMENTACIÓN DISPONIBLE

| Documento | Contenido |
|-----------|-----------|
| **DOCUMENTACION_HORARIOS.md** | Guía completa (800+ líneas) |
| **INSTALACION_RAPIDA.md** | Setup en 5 minutos |
| **ARQUITECTURA_VISUAL.md** | Diagramas y flujos |
| **EJEMPLOS_USO.js** | 30+ ejemplos funcionales |
| **RESUMEN_ENTREGA.md** | Resumen de entrega |

---

## 🚀 WORKFLOW TÍPICO

```
1. Usuario abre index.html
         ↓
2. Haz clic en "Horarios" (tab)
         ↓
3. Click "Nuevo Perfil" → ingresa nombre
         ↓
4. Completa formulario (materia, día, horas, modalidad)
         ↓
5. Click "Agregar al Horario"
         ↓
6. Clase aparece en tabla
         ↓
7. Puedes:
   - Agregar más clases
   - Editar (✏️) o eliminar (🗑️)
   - Cambiar usuario
   - Descargar PDF
         ↓
8. Click "Descargar PDF"
         ↓
9. Descarga archivo PDF profesional
```

---

## 🎯 REQUERIMIENTOS CUMPLIDOS

✅ **Control de materias sin bloqueo**
- Marcar aprobadas: `Schedule.approveSubject()`
- Desmarcar (DESHACE): `Schedule.unapproveSubject()`
- Confirmación visual: modal integrado

✅ **Generador de horario inteligente**
- Seleccionar materia, día, horas, modalidad
- Detecta automáticamente choques
- Tabla visual profesional
- Colores por modalidad

✅ **Múltiples usuarios**
- Crear perfiles: `Schedule.createUser()`
- Cambiar usuarios: `Schedule.switchUser()`
- Datos independientes
- Persistencia total

✅ **Exportación a PDF**
- Botón "Descargar PDF"
- PDF profesional con tabla
- 100% frontend (jsPDF)
- Incluye datos del estudiante

✅ **UX/UI profesional**
- Animaciones suaves
- Feedback visual (éxito/error)
- Responsive (Desktop + Móvil)
- Interfaz intuitiva

---

## 💡 TIPS Y TRUCOS

💡 **Generar horario de prueba rápido:**
```javascript
const materias = ['Prog II', 'BD', 'Redes', 'Algoritmos']
const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves']
materias.forEach((m, i) => {
  Schedule.addScheduleEvent({
    subject: m,
    day: dias[i],
    startTime: '08:00',
    endTime: '09:30',
    modality: i % 2 ? 'Virtual' : 'Presencial'
  })
})
```

💡 **Exportar datos de usuario para backup:**
```javascript
const backup = Storage.exportUserData('María García')
console.log(JSON.stringify(backup))
// Copiar JSON y guardar en archivo
```

💡 **Re-renderizar si algo falla:**
```javascript
ScheduleUI_Instance.renderScheduleModule()
```

---

## 📞 REFERENCIA DE FUNCIONES ÚTILES

```javascript
// USUARIOS
Schedule.createUser(name, career?, cycle?)
Schedule.switchUser(userName)
Schedule.getAllUsers()
Schedule.getCurrentUserData()

// MATERIAS
Schedule.approveSubject(subjectName)
Schedule.unapproveSubject(subjectName)
Schedule.getApprovedSubjects()
Schedule.isSubjectApproved(subjectName)

// EVENTOS
Schedule.addScheduleEvent(event)
Schedule.updateScheduleEvent(eventId, event)
Schedule.deleteScheduleEvent(eventId)

// HORARIO
Schedule.getSchedule()
Schedule.getScheduleByDay()
Schedule.detectConflicts(event)
Schedule.validateEvent(event)

// EXPORTACIÓN
SchedulePDF.exportScheduleToPDF()
SchedulePDF.exportScheduleAsText()
SchedulePDF.copyToClipboard()

// STORAGE
Storage.getUsers()
Storage.saveUsers(users)
Storage.getUser()
Storage.setUser(userName)
```

---

**Última actualización**: Enero 2026  
**Versión**: 1.0  
**Estado**: ✅ Producción

