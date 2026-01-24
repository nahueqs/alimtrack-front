import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { message } from 'antd';
import type { EstadoActualProduccionResponseDTO } from '@/pages/common/DetalleProduccion/types/Productions.ts';

export const exportProductionAsPdf = async (
  estadoActual: EstadoActualProduccionResponseDTO,
  fileName: string
): Promise<void> => {
  try {
    const doc = new jsPDF('p', 'pt', 'a4');
    let yPos = 40;

    doc.setFontSize(18);
    doc.text(`Reporte de Producción: ${estadoActual.produccion.codigoProduccion}`, 40, yPos);
    yPos += 30;

    doc.setFontSize(12);
    doc.text('Información General', 40, yPos);
    yPos += 15;

    const produccionData = [
      ['Lote', estadoActual.produccion.lote || 'N/A'],
      ['Estado', estadoActual.produccion.estado],
      ['Encargado', estadoActual.produccion.encargado || 'N/A'],
      ['Iniciado por', estadoActual.produccion.emailCreador],
      ['Fecha de Inicio', new Date(estadoActual.produccion.fechaInicio).toLocaleString('es-AR')],
      [
        'Fecha de Finalización',
        estadoActual.produccion.fechaFin
          ? new Date(estadoActual.produccion.fechaFin).toLocaleString('es-AR')
          : 'En curso',
      ],
    ];
    autoTable(doc, {
      startY: yPos,
      body: produccionData,
      theme: 'grid',
      styles: { fontSize: 8 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 20;

    const metadata = estadoActual.estructura.metadata; // Corregido: metadata está directo en estructura
    const versionData = [
      ['Código Versión', metadata.codigoVersionReceta],
      ['Nombre Versión', metadata.nombre],
      ['Receta Padre', `${metadata.nombreRecetaPadre} (${metadata.codigoRecetaPadre})`],
    ];
    autoTable(doc, {
      startY: yPos,
      body: versionData,
      theme: 'grid',
      styles: { fontSize: 8 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 30;

    // Crear mapas para acceso rápido a respuestas
    const respuestasCamposMap = new Map(
      estadoActual.respuestasCampos.map((r) => [r.idCampo, r.valor])
    );

    for (const seccion of estadoActual.estructura.estructura) {
      doc.setFontSize(14);
      doc.text(seccion.titulo, 40, yPos);
      yPos += 20;

      const camposSimplesData = seccion.camposSimples.map((c) => [
        c.nombre,
        respuestasCamposMap.get(c.id) || '',
      ]);
      if (camposSimplesData.length > 0) {
        autoTable(doc, {
          startY: yPos,
          head: [['Campo', 'Valor']],
          body: camposSimplesData,
          theme: 'striped',
          styles: { fontSize: 8 },
        });
        yPos = (doc as any).lastAutoTable.finalY + 20;
      }

      for (const grupo of seccion.gruposCampos) {
        doc.setFontSize(10);
        doc.text(grupo.subtitulo, 40, yPos);
        yPos += 15;

        const camposGrupoData = grupo.campos.map((c) => [
          c.nombre,
          respuestasCamposMap.get(c.id) || '',
        ]);
        autoTable(doc, {
          startY: yPos,
          head: [['Campo', 'Valor']],
          body: camposGrupoData,
          theme: 'striped',
          styles: { fontSize: 8 },
        });
        yPos = (doc as any).lastAutoTable.finalY + 20;
      }

      for (const tabla of seccion.tablas) {
        doc.setFontSize(10);
        doc.text(tabla.nombre, 40, yPos);
        yPos += 15;

        const head = [['Concepto', ...(tabla.columnas?.map((c) => c.nombre) || [])]];

        // Filtrar respuestas para esta tabla
        const respuestasDeLaTabla = estadoActual.respuestasTablas.filter(
          (rt) => rt.idTabla === tabla.id
        );

        const body =
          tabla.filas?.map((fila) => {
            const rowData: string[] = [fila.nombre];
            tabla.columnas?.forEach((col) => {
              const celda = respuestasDeLaTabla.find(
                (c) => c.idFila === fila.id && c.idColumna === col.id
              );
              rowData.push(celda?.valor || '');
            });
            return rowData;
          }) || [];

        autoTable(doc, {
          startY: yPos,
          head: head,
          body: body,
          theme: 'grid',
          styles: { fontSize: 8 },
        });
        yPos = (doc as any).lastAutoTable.finalY + 20;
      }
    }

    doc.save(fileName);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error al generar el PDF:', error);
    }
    message.error('Ocurrió un error al generar el PDF.');
  }
};
