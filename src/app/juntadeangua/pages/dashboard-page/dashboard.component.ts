import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public clients: number = 0;

  public count_clients: number = 0;
  public count_meters: number = 0;
  public count_repair_meters: number = 0;
  public count_users: number = 0;

  constructor(
    private customerService: CustomerService,
    private dashboardService: DashboardService
  ) {
    this.clients = this.customerService.countCustomersAll;
  }

  public activeSection: string = 'clients';

  ngOnInit() {
    // Inicializa los datos y realiza otras acciones al inicializar el componente
    this.getContClients();
    this.getContMeter();
    this.getContReportMeter();
    this.getContUsers();
  }

  // Función para cambiar la sección visible
  changeSection(section: string) {
    this.activeSection = section;
  }

  // Obtener numero de datos
  getContClients() {
    this.dashboardService.getContClients().subscribe((resp: any) => {
      if (resp && resp.data && resp.data.total && resp.data.total.length > 0) {
        this.count_clients = resp.data.total[0].cont;
      } else {
        console.error('Unexpected response format:', resp);
      }
    });
  }

  getContMeter() {
    this.dashboardService.getContMeter().subscribe((resp: any) => {
      if (resp && resp.data && resp.data.total && resp.data.total.length > 0) {
        this.count_meters = resp.data.total[0].cont;
      } else {
        console.error('Unexpected response format:', resp);
      }
    });
  }

  getContReportMeter() {
    this.dashboardService.getContReportMeter().subscribe((resp: any) => {
      if (resp && resp.data && resp.data.total && resp.data.total.length > 0) {
        this.count_repair_meters = resp.data.total[0].cont;
      } else {
        console.error('Unexpected response format:', resp);
      }
    });
  }

  getContUsers() {
    this.dashboardService.getContUsers().subscribe((resp: any) => {
      if (resp && resp.data && resp.data.total && resp.data.total.length > 0) {
        this.count_users = resp.data.total[0].cont;
      } else {
        console.error('Unexpected response format:', resp);
      }
    });
  }
}
