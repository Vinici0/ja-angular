import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/juntadeangua/services/dashboard.service';

interface MultaData {
  Nombre: string;
  TotalCost: number;
}

@Component({
  selector: 'app-meditions',
  templateUrl: './meditions.component.html',
  styleUrls: ['./meditions.component.css']
})
export class MeditionsComponent implements OnInit {

  multas: any[] = [];
  pagados: any[] = [];

  selectedDefault1: string = 'TODOS';
  selectedDefault2: string = 'TODOS';

  chartData: any[] = [];

  // Dimensionar grafica
  view1024: [number, number] = [800, 400];
  view768: [number, number] = [700, 400];
  view600: [number, number] = [600, 400];
  view535: [number, number] = [500, 400];
  viewSmall: [number, number] = [400, 400];

  view: [number, number] = this.view1024;
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

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

  //PAginacion
  pageSize: number = 10; // Número de elementos por página
  currentPage: number = 1;
  totalPages: number;

  constructor(private dashboardService: DashboardService, private zone: NgZone) {
    this.selectedDefault1 = 'TODOS';
    this.selectedDefault2 = 'TODOS';
  }

  ngOnInit() {
    this.updateView();
    this.getListMultas();
    this.getListPagado();
    this.updateChartData();
  }

  updateChartData() {
    const multa = this.selectedDefault1;
    const estado = this.selectedDefault2;

    this.dashboardService.getDataFiltradaMultas(multa, estado).subscribe(
      (resp: any) => {
        const data = resp.data.map((item: MultaData) => ({
          name: item.Nombre,
          value: item.TotalCost
        }));

        this.totalPages = Math.ceil(data.length / this.pageSize);

        // Obtén solo los elementos de la página actual
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.chartData = data.slice(startIndex, endIndex);
      },
      (error) => {
        console.error('Error en getDataFiltradaMultas:', error);
      }
    );
  }

  getListMultas() {
    this.dashboardService.getListMultas().subscribe(
      (resp: any) => {
        this.multas = resp.data && resp.data.total ? resp.data.total : [];
      },
      (error) => {
        console.error('Error en getListMultas:', error);
      }
    );
  }

  getListPagado() {
    this.dashboardService.getListPagado().subscribe(
      (resp: any) => {
        this.pagados = resp.data && resp.data.total ? resp.data.total : [];
      },
      (error) => {
        console.error('Error en getListPagado:', error);
      }
    );
  }

  getTotal(): number {
    return this.chartData.reduce((total, item) => total + item.value, 0);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateView();
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }




  firstPage() {
    this.currentPage = 1;
    this.updateChartData();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateChartData();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateChartData();
    }
  }

  lastPage() {
    this.currentPage = this.totalPages;
    this.updateChartData();
  }

}
