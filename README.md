# 🎓 MÓDULO DE HORARIOS INTELIGENTES

## 🚀 INICIO RÁPIDO

**¿Primero aquí?** Lee esto en 2 minutos:

1. **Abre** `index.html` en tu navegador
2. **Haz clic** en la tab "📅 Horarios"
3. **Crea** un nuevo perfil
4. **Agrega** una clase
5. **Descarga** tu PDF

¡Listo! ✅

---

## 📋 ¿QUÉ ES?

Un sistema profesional y modular de **generación de horarios académicos** con:

✅ Control reversible de materias aprobadas  
✅ Detección automática de conflictos de horario  
✅ Soporte para múltiples estudiantes  
✅ Exportación a PDF profesional  
✅ Interfaz responsive y animada  
✅ Persistencia en localStorage  
✅ 100% frontend (sin servidor necesario)  

---

## 🎯 CARACTERÍSTICAS PRINCIPALES

### 1. Control de Materias
```javascript
Schedule.approveSubject('Matemática I')      // Marcar
Schedule.unapproveSubject('Matemática I')    // Desmarcar (DESHACE)
```

### 2. Generador de Horarios
```javascript
Schedule.addScheduleEvent({
  subject: 'Programación II',
  day: 'Lunes',
  startTime: '07:30',
  endTime: '09:00',
  modality: 'Virtual'
})
```

### 3. Detección de Conflictos
```javascript
// Automática - se detectan solapamientos
Schedule.detectConflicts(event)
```

### 4. Múltiples Usuarios
```javascript
Schedule.createUser('Juan Pérez')
Schedule.switchUser('María García')
// Cada usuario tiene sus datos independientes
```

### 5. Exportación a PDF
```javascript
SchedulePDF.exportScheduleToPDF()  // Descarga PDF profesional
```

---

## 📚 DOCUMENTACIÓN

Toda la documentación está en archivos `.md`:

| Documento | Para | Tiempo |
|-----------|------|--------|
| 🚀 [INSTALACION_RAPIDA.md](INSTALACION_RAPIDA.md) | Usuarios nuevos | 5 min |
| ⚡ [REFERENCIA_RAPIDA.md](REFERENCIA_RAPIDA.md) | Consulta rápida | 2 min |
| 📖 [DOCUMENTACION_HORARIOS.md](DOCUMENTACION_HORARIOS.md) | Desarrolladores | 30 min |
| 💻 [EJEMPLOS_USO.js](EJEMPLOS_USO.js) | Código práctico | 10 min |
| 🏗️ [ARQUITECTURA_VISUAL.md](ARQUITECTURA_VISUAL.md) | Diagramas | 15 min |
| 📦 [RESUMEN_ENTREGA.md](RESUMEN_ENTREGA.md) | Resumen final | 10 min |
| 📚 [INDICE_DOCUMENTACION.md](INDICE_DOCUMENTACION.md) | Navegación | - |

---

## 🛠️ ARCHIVOS DEL PROYECTO

### JavaScript (Lógica)
```
js/
├─ schedule.js      (475 líneas) - Motor de horarios
├─ scheduleUI.js    (645 líneas) - Interfaz visual
├─ schedulePDF.js   (340 líneas) - Exportación PDF
└─ storage.js       (actualizado) - localStorage
```

### CSS (Diseño)
```
css/
├─ schedule.css     (570 líneas) - Estilos responsivos
├─ styles.css       (actualizado) - Estilos base
├─ themes.css       (existente) - Temas de color
└─ animations.css   (existente) - Animaciones
```

### HTML
```
index.html (actualizado)
├─ Navigation tabs  → Pensum | Horarios
├─ Tab containers   → Contenido dinámico
└─ Scripts          → Todos los archivos JS necesarios
```

---

## 🎬 PRIMEROS PASOS

### Opción 1: Interfaz Gráfica (Recomendado)
```
1. index.html → Click "Horarios"
2. Click "Nuevo Perfil"
3. Completa el formulario
4. Visualiza tabla y descarga PDF
```

### Opción 2: Consola JavaScript
```javascript
// Abre DevTools (F12) → Consola

// Crear usuario
Schedule.createUser('Mi Nombre')

// Agregar clase
Schedule.addScheduleEvent({
  subject: 'Programación II',
  day: 'Lunes',
  startTime: '07:30',
  endTime: '09:00',
  modality: 'Virtual'
})

// Ver horario
console.log(Schedule.getScheduleByDay())

// Descargar PDF
SchedulePDF.exportScheduleToPDF()
```

### Opción 3: Ejemplos de Código
```javascript
// Abre EJEMPLOS_USO.js en consola
// Ejecuta:
caso_estudianteNuevo()      // Caso completo
ejemplo_agregarMultiplesClases()  // Múltiples clases
```

---

## 🧠 CONCEPTOS CLAVE

### Control de Materias
Las materias aprobadas **NO se bloquean permanentemente**:
- Puedes marcar como aprobada ✓
- Puedes desmarcar en cualquier momento ↩️
- Sistema pide confirmación
- Sin restricciones

### Detección de Conflictos
Sistema detecta automáticamente **solapamientos de horario**:
- Lunes 08:00-09:00 + Lunes 08:30-09:30 ❌ CONFLICTO
- Lunes 08:00-09:00 + Lunes 09:00-10:00 ✓ Permitido
- Lunes 08:00-09:00 + Martes 08:00-09:00 ✓ Permitido

### Múltiples Usuarios
Cada usuario es completamente independiente:
```
Usuario 1: 6 clases, 3 aprobadas
Usuario 2: 5 clases, 4 aprobadas
← Datos nunca se mezclan
```

---

## 📱 FUNCIONALIDAD COMPLETA

| Característica | Desktop | Tablet | Móvil |
|---|---|---|---|
| Crear usuarios | ✅ | ✅ | ✅ |
| Agregar clases | ✅ | ✅ | ✅ |
| Ver tabla | ✅ | ✅ | ✅ (scroll) |
| Editar/eliminar | ✅ | ✅ | ✅ |
| Marcar materias | ✅ | ✅ | ✅ |
| Exportar PDF | ✅ | ✅ | ✅ |
| Animaciones | ✅ | ✅ | ✅ |

---

## 🎨 VISTA PREVIA

### Secciones del Módulo

```
┌─ 👥 Perfiles ─────────────────────────┐
│ [Selector ▼] [Cambiar] [+ Nuevo]     │
│ Juan Pérez • Ing. Sistemas • Ciclo 2 │
└────────────────────────────────────────┘

┌─ ✅ Materias Aprobadas ────────────────┐
│ [Programación I] [✕ Desm.]            │
│ [Matemática I] [✕ Desm.]              │
│ [Física I] [✕ Desm.]                  │
└────────────────────────────────────────┘

┌─ ➕ Agregar Clase ──────────────────────┐
│ Materia: [_____________________]      │
│ Día: [▼ Lunes] Hora: [08:00]-[09:00] │
│ Modalidad: [▼ Virtual] Aula: [_____] │
│ [Agregar] [Limpiar]                  │
└────────────────────────────────────────┘

┌─ 📅 Horario Semanal ────────────────────┐
│ [Descargar PDF] [Limpiar Horario]     │
│                                       │
│ ┌────┬──────┬──────┬───────┬────┐   │
│ │ H. │Lunes │Martes│Miér..│... │   │
│ ├────┼──────┼──────┼───────┼────┤   │
│ │07h │Prog. │      │  BD   │    │   │
│ │    │  II  │      │       │    │   │
│ └────┴──────┴──────┴───────┴────┘   │
└────────────────────────────────────────┘
```

---

## 💾 DATOS GUARDADOS

Todos los datos se guardan automáticamente en `localStorage`:

```javascript
{
  name: "Juan Pérez",
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
      room: "Zoom"
    }
  ],
  approvedSubjects: ["Programación I", "Matemática I"]
}
```

---

## 🐛 PROBLEMAS COMUNES

### "PDF no se descarga"
✓ Verifica que jsPDF esté cargada en consola: `console.log(typeof jsPDF)`

### "Datos no se guardan"
✓ Revisa que localStorage esté habilitado en navegador

### "Horario no aparece"
✓ Ejecuta en consola: `ScheduleUI_Instance.renderScheduleModule()`

### "El módulo no carga"
✓ Abre DevTools (F12) → revisa Console por errores

---

## 📞 SOPORTE

1. **Primero:** Abre [INSTALACION_RAPIDA.md](INSTALACION_RAPIDA.md) → "Troubleshooting"
2. **Luego:** Consulta [REFERENCIA_RAPIDA.md](REFERENCIA_RAPIDA.md) → "Errores Comunes"
3. **Finalmente:** Revisa [DOCUMENTACION_HORARIOS.md](DOCUMENTACION_HORARIOS.md) → "Debugging"

---

## 📊 REQUERIMIENTOS CUMPLIDOS

✅ Control de materias (NO bloqueo irreversible)
- Marcar sin perder datos
- Desmarcar cuando quieras
- Confirmación de usuario

✅ Generador de horario inteligente
- Seleccionar materia, día, hora, modalidad
- Detectar choques automáticamente
- Tabla visual profesional
- Colores por modalidad

✅ Múltiples usuarios/perfiles
- Crear perfiles nuevos
- Cambiar sin perder datos
- Persistencia en localStorage

✅ Exportación automática a PDF
- Botón "Descargar PDF"
- PDF profesional y legible
- Datos del estudiante incluidos

✅ UX/UI profesional
- Animaciones suaves
- Feedback visual claro
- Responsive en todos los dispositivos

---

## 🚀 SIGUIENTE PASO

### Nuevo usuario?
→ Abre [INSTALACION_RAPIDA.md](INSTALACION_RAPIDA.md)

### Desarrollador?
→ Lee [DOCUMENTACION_HORARIOS.md](DOCUMENTACION_HORARIOS.md)

### Necesito ejemplos?
→ Consulta [EJEMPLOS_USO.js](EJEMPLOS_USO.js)

### Referencia rápida?
→ Ve a [REFERENCIA_RAPIDA.md](REFERENCIA_RAPIDA.md)

---

## 📈 ESTADÍSTICAS

```
Código:
├─ JavaScript:   1,460 líneas (4 archivos)
├─ CSS:          570 líneas (1 archivo)
└─ HTML:         actualizado

Documentación:
├─ Archivos:     7 documentos
├─ Líneas:       2,500+ líneas
├─ Ejemplos:     30+ casos prácticos
└─ Diagramas:    10+ visualizaciones
```

---

## ✨ CARACTERÍSTICAS DESTACADAS

🎯 **Inteligente**
- Detección automática de conflictos
- Validación de datos en tiempo real
- Sugerencias de horario

🔒 **Seguro**
- Confirmación para acciones críticas
- Sin bloqueos permanentes
- Reversible todo

📱 **Responsive**
- 100% funcional en móvil
- Diseño adaptable
- Tabla scrolleable

⚡ **Rápido**
- Sin servidor necesario
- localStorage local
- Carga instantánea

🎨 **Moderno**
- Animaciones suaves
- Colores profesionales
- UI intuitiva

---

## 🎓 CRÉDITOS

Sistema desarrollado con:
- ✅ HTML5 semántico
- ✅ CSS3 modular
- ✅ JavaScript ES6+ puro
- ✅ jsPDF (solo para PDF)
- ✅ localStorage (navegador)

**Sin frameworks.** Totalmente modular y escalable.

---

## 📜 VERSIÓN Y ESTADO

**Versión:** 1.0 (Completa)  
**Fecha:** Enero 2026  
**Estado:** ✅ Producción  
**Pruebas:** ✅ Completadas

---

**¿Listo para empezar?** 🚀

Abre `index.html` → Haz clic en "Horarios" → Crea tu primer horario

**¡Bienvenido al módulo de horarios inteligentes!**

---

Para más información, consulta los documentos en el proyecto:
- 📖 [DOCUMENTACION_HORARIOS.md](DOCUMENTACION_HORARIOS.md)
- ⚡ [REFERENCIA_RAPIDA.md](REFERENCIA_RAPIDA.md)
- 📚 [INDICE_DOCUMENTACION.md](INDICE_DOCUMENTACION.md)
