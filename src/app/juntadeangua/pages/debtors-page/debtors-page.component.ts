import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MeasureServiceTsService } from '../../services/measure.service.ts.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface Debtor {
  idCliente: number;
  Nombre: string;
  Ruc: string;
  Email: string;
  Manzana: string;
  Lote: string;
  Codigo: string;
  deudaAgua: number;
  mesesAgua: number;
  deudaMultas: number;
  cantidadMultas: number;
  totalDeuda: number;
}

type TipoDeuda = 'deudores' | 'agua' | 'multas' | 'ambos' | 'aldia' | 'todos';

@Component({
  selector: 'app-debtors-page',
  templateUrl: './debtors-page.component.html',
  styleUrls: ['./debtors-page.component.css'],
})
export class DebtorsPageComponent implements OnInit {
  dataSource = new MatTableDataSource<Debtor>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loading = false;
  allDebtors: Debtor[] = [];

  // Estado de los filtros
  searchText = '';
  tipoDeuda: TipoDeuda = 'deudores';
  manzanaSel = '';
  manzanas: string[] = [];

  displayedColumns: string[] = [
    'index',
    'Nombre',
    'Manzana',
    'Lote',
    'Ruc',
    'Email',
    'deudaAgua',
    'cantidadMultas',
    'deudaMultas',
    'totalDeuda',
  ];

  constructor(private measureService: MeasureServiceTsService) {}

  ngOnInit(): void {
    this.loadDebtors();
  }

  loadDebtors(): void {
    this.loading = true;
    this.measureService.getDebtorsReport().subscribe((data: Debtor[]) => {
      this.allDebtors = (data || []).map((d) => ({
        ...d,
        deudaAgua: Number(d.deudaAgua) || 0,
        mesesAgua: Number(d.mesesAgua) || 0,
        deudaMultas: Number(d.deudaMultas) || 0,
        cantidadMultas: Number(d.cantidadMultas) || 0,
        totalDeuda: Number(d.totalDeuda) || 0,
      }));

      this.manzanas = Array.from(
        new Set(
          this.allDebtors
            .map((d) => (d.Manzana || '').trim())
            .filter((m) => m !== '')
        )
      ).sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));

      this.applyFilters();
      this.loading = false;
    });
  }

  /** Aplica todos los filtros (tipo de deuda + manzana + texto) sobre la data. */
  applyFilters(): void {
    const text = this.searchText.trim().toLowerCase();

    const filtered = this.allDebtors.filter((d) => {
      const tieneAgua = d.deudaAgua > 0;
      const tieneMultas = d.cantidadMultas > 0;
      const debe = tieneAgua || tieneMultas;

      // Filtro por tipo de deuda
      let pasaTipo = true;
      switch (this.tipoDeuda) {
        case 'deudores':
          pasaTipo = debe;
          break;
        case 'agua':
          pasaTipo = tieneAgua;
          break;
        case 'multas':
          pasaTipo = tieneMultas;
          break;
        case 'ambos':
          pasaTipo = tieneAgua && tieneMultas;
          break;
        case 'aldia':
          pasaTipo = !debe;
          break;
        case 'todos':
          pasaTipo = true;
          break;
      }
      if (!pasaTipo) return false;

      // Filtro por manzana
      if (this.manzanaSel && (d.Manzana || '').trim() !== this.manzanaSel) {
        return false;
      }

      // Filtro por texto libre
      if (text) {
        const haystack = [
          d.Nombre,
          d.Ruc,
          d.Email,
          d.Manzana,
          d.Lote,
          d.Codigo,
        ]
          .map((v) => (v || '').toString().toLowerCase())
          .join(' ');
        if (!haystack.includes(text)) return false;
      }

      return true;
    });

    this.dataSource.data = filtered;
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
    if (this.paginator) this.paginator.firstPage();
  }

  onSearch(event: Event): void {
    this.searchText = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  limpiarFiltros(): void {
    this.searchText = '';
    this.tipoDeuda = 'deudores';
    this.manzanaSel = '';
    this.applyFilters();
  }

  get pageOffset(): number {
    return this.paginator
      ? this.paginator.pageIndex * this.paginator.pageSize
      : 0;
  }

  // ---- Totales del resultado filtrado (para las tarjetas y el pie del PDF) ----
  get totalPersonas(): number {
    return this.dataSource.data.length;
  }
  get totalDeudaAgua(): number {
    return this.dataSource.data.reduce((s, d) => s + d.deudaAgua, 0);
  }
  get totalDeudaMultas(): number {
    return this.dataSource.data.reduce((s, d) => s + d.deudaMultas, 0);
  }
  get totalGeneral(): number {
    return this.dataSource.data.reduce((s, d) => s + d.totalDeuda, 0);
  }

  private money(n: number): string {
    return `$${(Number(n) || 0).toFixed(2)}`;
  }

  private tipoLabel(): string {
    const labels: Record<TipoDeuda, string> = {
      deudores: 'Deudores (agua o multas)',
      agua: 'Deuda de agua',
      multas: 'Multas pendientes',
      ambos: 'Agua y multas',
      aldia: 'Clientes al día',
      todos: 'Todos los clientes',
    };
    return labels[this.tipoDeuda];
  }

  // ---------------------------- Exportar PDF ----------------------------
  downloadPDF(): void {
    const rows = this.dataSource.data;
    if (!rows.length) return;

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 8;
    const fecha = new Date().toLocaleString('es-EC');

    // — Encabezado —
    doc.setFillColor(30, 64, 175);
    doc.rect(margin, 6, pageW - margin * 2, 14, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE DEUDORES', margin + 4, 14);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `${this.tipoLabel()}  •  ${rows.length} registros`,
      margin + 4,
      18
    );
    doc.text(`Generado: ${fecha}`, pageW - margin - 4, 14, { align: 'right' });

    const body: any[][] = rows.map((d, i) => [
      i + 1,
      d.Nombre?.trim() || '',
      (d.Manzana || '').trim(),
      (d.Lote || '').trim(),
      (d.Ruc || '').trim(),
      (d.Email || '').trim(),
      this.money(d.deudaAgua),
      d.cantidadMultas || 0,
      this.money(d.deudaMultas),
      this.money(d.totalDeuda),
    ]);

    autoTable(doc, {
      head: [
        [
          '#',
          'Apellido y Nombre',
          'Mz.',
          'Lote',
          'Cédula / RUC',
          'Correo Electrónico',
          'Deuda Agua',
          'N° Mult.',
          'Deuda Mult.',
          'Total',
        ],
      ],
      body,
      foot: [
        [
          { content: 'TOTALES', colSpan: 6, styles: { halign: 'right' } },
          this.money(this.totalDeudaAgua),
          '',
          this.money(this.totalDeudaMultas),
          this.money(this.totalGeneral),
        ],
      ],
      startY: 23,
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: {
        fontSize: 6.5,
        cellPadding: 1.6,
        overflow: 'linebreak',
        valign: 'middle',
        textColor: [30, 30, 30],
      },
      headStyles: {
        fillColor: [30, 64, 175],
        textColor: 255,
        fontSize: 6.8,
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 2,
      },
      footStyles: {
        fillColor: [219, 234, 254],
        textColor: [30, 64, 175],
        fontStyle: 'bold',
        halign: 'right',
      },
      alternateRowStyles: { fillColor: [245, 247, 255] },
      columnStyles: {
        0: { halign: 'center', cellWidth: 8 },
        1: { cellWidth: 42 },
        2: { halign: 'center', cellWidth: 10 },
        3: { halign: 'center', cellWidth: 10 },
        4: { halign: 'center', cellWidth: 22 },
        5: { cellWidth: 38 },
        6: { halign: 'right', cellWidth: 17 },
        7: { halign: 'center', cellWidth: 12 },
        8: { halign: 'right', cellWidth: 17 },
        9: { halign: 'right', cellWidth: 18 },
      },
      didDrawPage: (data) => {
        const total = (doc as any).getNumberOfPages();
        doc.setFontSize(6);
        doc.setTextColor(150);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Página ${data.pageNumber} de ${total}`,
          pageW / 2,
          pageH - 4,
          { align: 'center' }
        );
      },
    });

    doc.save(
      `deudores_${new Date()
        .toLocaleDateString('es-EC')
        .replace(/\//g, '-')}.pdf`
    );
  }

  // ---------------------------- Exportar Excel ----------------------------
  downloadExcel(): void {
    const rows = this.dataSource.data;
    if (!rows.length) return;

    const wsData = [
      [
        '#',
        'Apellido y Nombre',
        'Manzana',
        'Lote',
        'Cédula / RUC',
        'Correo Electrónico',
        'Deuda Agua',
        'Meses Atraso',
        'N° Multas',
        'Deuda Multas',
        'Total Deuda',
      ],
      ...rows.map((d, i) => [
        i + 1,
        d.Nombre?.trim() || '',
        (d.Manzana || '').trim(),
        (d.Lote || '').trim(),
        (d.Ruc || '').trim(),
        (d.Email || '').trim(),
        Number(d.deudaAgua.toFixed(2)),
        d.mesesAgua || 0,
        d.cantidadMultas || 0,
        Number(d.deudaMultas.toFixed(2)),
        Number(d.totalDeuda.toFixed(2)),
      ]),
      [
        '',
        'TOTALES',
        '',
        '',
        '',
        '',
        Number(this.totalDeudaAgua.toFixed(2)),
        '',
        '',
        Number(this.totalDeudaMultas.toFixed(2)),
        Number(this.totalGeneral.toFixed(2)),
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [
      { wch: 5 },
      { wch: 40 },
      { wch: 10 },
      { wch: 8 },
      { wch: 15 },
      { wch: 32 },
      { wch: 12 },
      { wch: 12 },
      { wch: 10 },
      { wch: 12 },
      { wch: 12 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Deudores');
    const fecha = new Date().toLocaleDateString('es-EC').replace(/\//g, '-');
    XLSX.writeFile(wb, `deudores_${fecha}.xlsx`);
  }
}
