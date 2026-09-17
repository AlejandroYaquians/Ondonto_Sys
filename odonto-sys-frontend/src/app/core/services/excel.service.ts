import { Injectable } from '@angular/core';
import ExcelJS from 'exceljs';

const NOMBRE_CLINICA = 'Clínica Dental Fernando Ancheta';
const FORMATO_MONEDA = '"Q"#,##0.00';

const BORDE_LINEA: Partial<ExcelJS.Border> = { style: 'thin', color: { argb: 'FF000000' } };
const BORDE_CELDA: Partial<ExcelJS.Borders> = {
  top: BORDE_LINEA,
  left: BORDE_LINEA,
  bottom: BORDE_LINEA,
  right: BORDE_LINEA
};

export interface LibroExcel {
  workbook: ExcelJS.Workbook;
  hoja: ExcelJS.Worksheet;
  filaActual: number;
}

@Injectable({ providedIn: 'root' })
export class ExcelService {
  crearLibro(titulo: string, subtitulo: string): LibroExcel {
    const workbook = new ExcelJS.Workbook();
    const hoja = workbook.addWorksheet('Reporte');

    hoja.mergeCells('A1:D1');
    const celdaClinica = hoja.getCell('A1');
    celdaClinica.value = NOMBRE_CLINICA;
    celdaClinica.font = { bold: true, size: 14 };
    celdaClinica.alignment = { horizontal: 'center' };

    hoja.mergeCells('A2:D2');
    const celdaTitulo = hoja.getCell('A2');
    celdaTitulo.value = titulo;
    celdaTitulo.font = { bold: true, size: 11 };
    celdaTitulo.alignment = { horizontal: 'center' };

    hoja.mergeCells('A3:D3');
    const celdaSubtitulo = hoja.getCell('A3');
    celdaSubtitulo.value = subtitulo;
    celdaSubtitulo.font = { size: 10, italic: true };
    celdaSubtitulo.alignment = { horizontal: 'center' };

    return { workbook, hoja, filaActual: 5 };
  }

  agregarSeccion(hoja: ExcelJS.Worksheet, fila: number, texto: string): number {
    const celda = hoja.getCell(fila, 1);
    celda.value = texto;
    celda.font = { bold: true, size: 11 };
    return fila + 1;
  }

  agregarTabla(
    hoja: ExcelJS.Worksheet,
    filaInicio: number,
    encabezados: string[],
    filas: (string | number)[][],
    columnasMoneda: number[] = []
  ): number {
    const filaEncabezado = hoja.getRow(filaInicio);
    encabezados.forEach((texto, indice) => {
      const celda = filaEncabezado.getCell(indice + 1);
      celda.value = texto;
      celda.font = { bold: true };
      celda.border = BORDE_CELDA;
      celda.alignment = { horizontal: 'center' };
      const columna = hoja.getColumn(indice + 1);
      columna.width = Math.max(columna.width ?? 0, 24);
    });

    let fila = filaInicio + 1;
    for (const valores of filas) {
      const filaHoja = hoja.getRow(fila);
      valores.forEach((valor, indice) => {
        const celda = filaHoja.getCell(indice + 1);
        celda.value = valor;
        celda.border = BORDE_CELDA;
        if (columnasMoneda.includes(indice)) {
          celda.numFmt = FORMATO_MONEDA;
        }
      });
      fila++;
    }

    return fila + 1;
  }

  async descargar(workbook: ExcelJS.Workbook, nombreArchivo: string): Promise<void> {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = window.URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombreArchivo;
    enlace.click();
    window.URL.revokeObjectURL(url);
  }
}
