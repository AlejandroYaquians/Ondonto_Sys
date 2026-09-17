import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

const MARGEN_IZQUIERDO = 14;
const ALTO_LOGO_MM = 16;
const LADO_MAYOR_LOGO_PX = 240;

export const ESTILO_TABLA_PDF = {
  theme: 'grid' as const,
  styles: {
    textColor: 0,
    lineColor: 0,
    lineWidth: 0.1,
    fontSize: 10
  },
  headStyles: {
    fillColor: 255,
    textColor: 0,
    lineColor: 0,
    lineWidth: 0.1,
    fontStyle: 'bold' as const
  }
};

interface LogoCargado {
  dataUrl: string;
  anchoAltoRatio: number;
}

@Injectable({ providedIn: 'root' })
export class PdfService {
  private logo: LogoCargado | null = null;

  private async obtenerLogo(): Promise<LogoCargado> {
    if (this.logo) {
      return this.logo;
    }

    const imagen = await new Promise<HTMLImageElement>((resolve, reject) => {
      const elemento = new Image();
      elemento.onload = () => resolve(elemento);
      elemento.onerror = () => reject(new Error('No se pudo cargar el logo.'));
      elemento.src = '/logo.png';
    });

    const ratio = imagen.naturalWidth / imagen.naturalHeight;
    const canvas = document.createElement('canvas');
    canvas.width = ratio >= 1 ? LADO_MAYOR_LOGO_PX : Math.round(LADO_MAYOR_LOGO_PX * ratio);
    canvas.height = ratio >= 1 ? Math.round(LADO_MAYOR_LOGO_PX / ratio) : LADO_MAYOR_LOGO_PX;

    const contexto = canvas.getContext('2d')!;
    contexto.drawImage(imagen, 0, 0, canvas.width, canvas.height);

    this.logo = { dataUrl: canvas.toDataURL('image/png'), anchoAltoRatio: ratio };
    return this.logo;
  }

  async crearDocumento(titulo: string): Promise<{ doc: jsPDF; primeraLineaY: number }> {
    const doc = new jsPDF({ format: 'letter' });
    const logo = await this.obtenerLogo();
    const anchoPagina = doc.internal.pageSize.getWidth();
    const centroPagina = anchoPagina / 2;
    const altoLogo = ALTO_LOGO_MM;
    const anchoLogo = altoLogo * logo.anchoAltoRatio;

    doc.addImage(logo.dataUrl, 'PNG', centroPagina - anchoLogo / 2, 10, anchoLogo, altoLogo);

    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(titulo, centroPagina, 10 + altoLogo + 8, { align: 'center' });

    const lineaY = 10 + altoLogo + 14;
    doc.setDrawColor(0);
    doc.line(MARGEN_IZQUIERDO, lineaY, anchoPagina - MARGEN_IZQUIERDO, lineaY);

    return { doc, primeraLineaY: lineaY + 8 };
  }

  abrir(doc: jsPDF, nombreArchivo: string): void {
    doc.save(nombreArchivo);
  }
}
