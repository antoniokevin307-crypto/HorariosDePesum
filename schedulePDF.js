/**
 * MÓDULO: schedulePDF.js
 * Generación de PDF para horarios académicos
 * 
 * Responsabilidades:
 * - Exportar horario a PDF con jsPDF
 * - Formateo profesional del documento
 * - Incluir datos del estudiante y carrera
 */

class SchedulePDFExporter {
  constructor() {
    this.pageWidth = null;
    this.pageHeight = null;
    this.currentY = 15;
  }

  /**
   * Exporta el horario actual a PDF
   */
  exportScheduleToPDF() {
    // Validar que jsPDF esté disponible
    if (typeof jsPDF === 'undefined') {
      alert('Error: No se puede generar PDF. Falta cargar la librería jsPDF');
      return false;
    }

    const data = Schedule.getExportData();
    const { jsPDF } = window;

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    this.pageWidth = doc.internal.pageSize.getWidth();
    this.pageHeight = doc.internal.pageSize.getHeight();
    this.currentY = 15;

    // Agregar contenido
    this.addHeader(doc, data);
    this.addStudentInfo(doc, data);
    this.addScheduleTable(doc, data);
    this.addFooter(doc);

    // Guardar PDF
    const fileName = `Horario_${data.studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    return true;
  }

  /**
   * Agrega encabezado profesional
   */
  addHeader(doc, data) {
    // Fondo gradiente (simulado con rectángulo)
    doc.setFillColor(102, 126, 234); // Color primario
    doc.rect(0, 0, this.pageWidth, 30, 'F');

    // Título
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('HORARIO ACADÉMICO', this.pageWidth / 2, 15, { align: 'center' });

    // Línea decorativa
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(20, 22, this.pageWidth - 20, 22);

    this.currentY = 40;
  }

  /**
   * Agrega información del estudiante
   */
  addStudentInfo(doc, data) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55); // Texto oscuro

    const infoX = 20;
    const colWidth = 80;

    // Primera columna
    doc.setFont('helvetica', 'bold');
    doc.text('Estudiante:', infoX, this.currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(data.studentName, infoX + 40, this.currentY);

    this.currentY += 8;

    // Segunda columna
    doc.setFont('helvetica', 'bold');
    doc.text('Carrera:', infoX, this.currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(data.career, infoX + 40, this.currentY);

    this.currentY += 8;

    // Tercera columna
    doc.setFont('helvetica', 'bold');
    doc.text('Ciclo:', infoX, this.currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${data.cycle}`, infoX + 40, this.currentY);

    // Datos a la derecha
    const rightX = this.pageWidth - 60;
    doc.setFont('helvetica', 'bold');
    doc.text('Generado:', rightX, this.currentY - 16);
    doc.setFont('helvetica', 'normal');
    doc.text(data.generatedAt, rightX, this.currentY - 8);

    this.currentY += 15;
  }

  /**
   * Agrega tabla de horario
   */
  addScheduleTable(doc, data) {
    const tableData = this.generateTableData(data);
    const days = Object.keys(data.schedule);

    // Crear tabla con autoTable
    doc.autoTable({
      head: [['Hora', ...days]],
      body: tableData,
      startY: this.currentY,
      margin: { left: 10, right: 10 },
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 5,
        overflow: 'linebreak',
        halign: 'center',
        valign: 'middle',
        textColor: 31
      },
      headStyles: {
        fillColor: [102, 126, 234],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        alternateRowStyles: {
          fillColor: [249, 250, 251]
        }
      },
      columnStyles: {
        0: {
          cellWidth: 20,
          fontStyle: 'bold',
          fillColor: [243, 244, 246]
        }
      },
      didDrawPage: (data) => {
        // Callback si es necesario para siguiente página
      }
    });

    this.currentY = doc.lastAutoTable.finalY + 10;
  }

  /**
   * Genera datos para la tabla
   */
  generateTableData(data) {
    const tableData = [];
    const days = Object.keys(data.schedule);

    // Iterar sobre horas
    for (let hour = 6; hour < 22; hour++) {
      const row = [`${String(hour).padStart(2, '0')}:00`];

      days.forEach(day => {
        const events = data.schedule[day].filter(event => {
          const eventHour = parseInt(event.startTime.split(':')[0]);
          return eventHour === hour;
        });

        if (events.length > 0) {
          const event = events[0];
          const eventText = [
            event.subject.toUpperCase(),
            `${event.startTime} - ${event.endTime}`,
            `[${event.modality}]`,
            event.room ? event.room : ''
          ].filter(t => t).join('\n');

          row.push(eventText);
        } else {
          row.push('');
        }
      });

      tableData.push(row);
    }

    return tableData;
  }

  /**
   * Agrega pie de página
   */
  addFooter(doc) {
    const pageCount = doc.internal.pages.length - 1;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128); // Texto gris

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Página ${i} de ${pageCount}`,
        this.pageWidth / 2,
        this.pageHeight - 8,
        { align: 'center' }
      );

      // Línea separadora
      doc.setDrawColor(229, 231, 235);
      doc.line(10, this.pageHeight - 12, this.pageWidth - 10, this.pageHeight - 12);
    }
  }

  /**
   * Exporta a formato de texto (para compartir)
   */
  exportScheduleAsText() {
    const data = Schedule.getExportData();
    let text = '';

    text += '='.repeat(80) + '\n';
    text += 'HORARIO ACADÉMICO\n';
    text += '='.repeat(80) + '\n\n';

    text += `Estudiante: ${data.studentName}\n`;
    text += `Carrera: ${data.career}\n`;
    text += `Ciclo: ${data.cycle}\n`;
    text += `Generado: ${data.generatedAt}\n\n`;

    text += '='.repeat(80) + '\n';
    text += 'HORARIO SEMANAL\n';
    text += '='.repeat(80) + '\n\n';

    Object.entries(data.schedule).forEach(([day, events]) => {
      text += `${day.toUpperCase()}\n`;
      text += '-'.repeat(40) + '\n';

      if (events.length === 0) {
        text += 'Sin clases\n';
      } else {
        events.forEach(event => {
          text += `${event.startTime} - ${event.endTime}: ${event.subject} [${event.modality}]\n`;
          if (event.room) text += `  Aula/Link: ${event.room}\n`;
        });
      }
      text += '\n';
    });

    // Descargar como archivo de texto
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Horario_${data.studentName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return true;
  }

  /**
   * Copia el horario al portapapeles (markdown)
   */
  copyToClipboard() {
    const data = Schedule.getExportData();
    let markdown = '';

    markdown += `# Horario Académico\n\n`;
    markdown += `**Estudiante:** ${data.studentName}\n`;
    markdown += `**Carrera:** ${data.career}\n`;
    markdown += `**Ciclo:** ${data.cycle}\n`;
    markdown += `**Generado:** ${data.generatedAt}\n\n`;

    markdown += `## Horario Semanal\n\n`;

    Object.entries(data.schedule).forEach(([day, events]) => {
      markdown += `### ${day}\n`;

      if (events.length === 0) {
        markdown += `- Sin clases\n\n`;
      } else {
        events.forEach(event => {
          markdown += `- **${event.subject}** (${event.startTime} - ${event.endTime})\n`;
          markdown += `  - Modalidad: ${event.modality}\n`;
          if (event.room) markdown += `  - Aula/Link: ${event.room}\n`;
        });
        markdown += '\n';
      }
    });

    navigator.clipboard.writeText(markdown).then(() => {
      return { success: true, message: 'Horario copiado al portapapeles' };
    }).catch(() => {
      return { success: false, message: 'Error al copiar al portapapeles' };
    });
  }
}

// Instancia global
const SchedulePDF = new SchedulePDFExporter();
