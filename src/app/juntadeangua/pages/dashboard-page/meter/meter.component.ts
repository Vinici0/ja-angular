import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/juntadeangua/services/dashboard.service';

@Component({
  selector: 'app-meter',
  templateUrl: './meter.component.html',
  styleUrls: ['./meter.component.css']
})
export class MeterComponent implements OnInit {
  estados: any[] = [];
  cantidades: any[] = [];
  lotes: any[] = [];
  manzanas: any[] = [];
  selectedDefault1: string = 'TODOS';
  selectedDefault2: string = 'TODOS';
  selectedDefault3: string = 'TODOS';
  selectedDefault4: string = 'TODOS';

  chartData: any[] = [];

  // Dimensionar grafica
  view1024: [number, number] = [750, 500];
  view768: [number, number] = [600, 500];
  view600: [number, number] = [500, 400];
  view535: [number, number] = [400, 400];
  viewSmall: [number, number] = [300, 400];

  view: [number, number] = this.view1024;
  gradient: boolean = false;
  showLegend: boolean = true;
  axisX: boolean = true;
  axisY: boolean = true;
  showLabelsX: boolean = true;
  showLabelsY: boolean = true;
  yAxisLabel: string = 'N° MEDIDORES';
  xAxisLabel: string = 'CLIENTES';

  // Propiedades de paginación
  itemsPerPage: number = 15;
  currentPage: number = 1;
  totalItems: number = 0;

  updateView(): void {
    // Actualiza la vista basada en el tamaño de la pantalla
    if (window.innerWidth >= 1024) {
      this.view = this.view1024;
    } else if (window.innerWidth >= 768) {
      this.view = this.view768;
    } else if (window.innerWidth >= 600) {
      this.view = this.view600;
    } else if (window.innerWidth >= 535) {
      this.view = this.view535;
    } else {
      this.view = this.viewSmall;
    }
  }

  constructor(private dashboardService: DashboardService, private zone: NgZone) {
    this.selectedDefault1 = 'TODOS';
    this.selectedDefault2 = 'TODOS';
    this.selectedDefault3 = 'TODOS';
    this.selectedDefault4 = 'TODOS';
  }

  ngOnInit() {
    this.updateView();
    this.getListEstados();
    this.getListCantidades();
    this.getListLotes();
    this.getListManzanas();
    this.updateChartData();
  }

  // Agrega un nuevo campo para almacenar los filtros anteriores
  private previousFilters: { selectedDefault1: string, selectedDefault2: string, selectedDefault3: string, selectedDefault4: string } = {
    selectedDefault1: 'TODOS',
    selectedDefault2: 'TODOS',
    selectedDefault3: 'TODOS',
    selectedDefault4: 'TODOS'
  };

  updateChartData() {
    // Compara los filtros actuales con los anteriores
    const filtersChanged =
      this.selectedDefault1 !== this.previousFilters.selectedDefault1 ||
      this.selectedDefault2 !== this.previousFilters.selectedDefault2 ||
      this.selectedDefault3 !== this.previousFilters.selectedDefault3 ||
      this.selectedDefault4 !== this.previousFilters.selectedDefault4;

    if (filtersChanged) {
      // Si los filtros han cambiado, reinicia la página a 1
      this.currentPage = 1;

      // Actualiza los filtros anteriores
      this.previousFilters = {
        selectedDefault1: this.selectedDefault1,
        selectedDefault2: this.selectedDefault2,
        selectedDefault3: this.selectedDefault3,
        selectedDefault4: this.selectedDefault4
      };
    }

    this.dashboardService.getDataFiltradaMeter(this.selectedDefault1, this.selectedDefault2, this.selectedDefault3, this.selectedDefault4)
      .subscribe((response: any) => {
        console.log("Datos recibidos:", response);

        if (response.success && Array.isArray(response.data)) {
          // Proporciona un tipo específico para item
          this.totalItems = response.data.length;
          const startIndex = (this.currentPage - 1) * this.itemsPerPage;
          const endIndex = startIndex + this.itemsPerPage;

          // Filtra y mapea los datos según la página actual
          this.chartData = response.data.slice(startIndex, endIndex).map((item: { Nombre: string; Total: number; Codigos: string }) => ({
            name: item.Nombre,
            value: item.Total,
          }));

          console.log(this.chartData)
        } else {
          console.error("Los datos recibidos no tienen el formato esperado.");
        }
      });
  }

  getListEstados() {
    this.dashboardService.getListEstados().subscribe((resp: any) => {
      this.estados = resp.data.total;
    });
  }

  getListCantidades() {
    this.dashboardService.getListCantidades().subscribe((resp: any) => {
      this.cantidades = resp.data.total.map((item: any) => item.Total);
    });
  }

  getListLotes() {
    this.dashboardService.getListLotes().subscribe((resp: any) => {
      this.lotes = resp.data.total.map((item: any) => item.Lote);
    });
  }

  getListManzanas() {
    this.dashboardService.getListManzanas().subscribe((resp: any) => {
      this.manzanas = resp.data.total.map((item: any) => item.Manzana);
    });
  }

  // Métodos para manejar la paginación
  goToPage(page: number) {
    this.currentPage = page;
    this.updateChartData();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateChartData();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateChartData();
    }
  }

  firstPage() {
    this.currentPage = 1;
    this.updateChartData();
  }

  lastPage() {
    this.currentPage = this.totalPages;
    this.updateChartData();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateView();
  }
}
