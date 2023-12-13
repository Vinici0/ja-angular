import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  roles: any[] = [];
  selectedDefault: string = 'TODOS';

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

  constructor(private dashboardService: DashboardService, private zone: NgZone) {
    this.selectedDefault = 'TODOS';
  }

  ngOnInit() {
    this.updateView();
    this.getListRoles();
    this.updateChartData();
  }

  getListRoles() {
    this.dashboardService.getListRoles().subscribe((resp: any) => {
      this.roles = resp.data.total.map((item: any) => item.role);
    });
  }


  updateChartData() {
    // Llamar al servicio con las fechas sin formatear
    this.zone.run(() => {
      if (this.selectedDefault === 'TODOS') {
        this.dashboardService.graficaUsers_todos().subscribe(
          (resp: any) => {
            console.log('Response from graficaUsers_todos:', resp);
            this.chartData = Array.isArray(resp?.data?.total) ? resp.data.total.map((item: any) => ({
              name: item.role,
              value: item.Total,
            })) : [];
          },
          (error) => {
            console.error('Error in graficaUsers_todos request:', error);
          }
        );
      } else {
        this.dashboardService.graficaUser(this.selectedDefault).subscribe(
          (resp: any) => {
            console.log('Response from graficaUser:', resp);
            this.chartData = Array.isArray(resp?.data?.total) ? resp.data.total.map((item: any) => ({
              name: this.formatDate(new Date(item.fechaIni)),
              value: item.Total,
            })) : [];
          },
          (error) => {
            console.error('Error in graficaUser request:', error);
          }
        );
      }
    });
  }

  getTotal(): number {
    if (this.selectedDefault === 'TODOS') {
      // Si el filtro es 'all', devuelve la suma de todos los valores
      return this.chartData.reduce((total, item) => total + item.value, 0);
    } else {
      // Si el filtro no es 'all', encuentra el total del rol específico
      return  this.chartData.reduce((total, item) => total + item.value, 0);
    }
  }


  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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


}
