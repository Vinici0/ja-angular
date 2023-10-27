import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  public clients: number = 0;

  constructor(private customerService: CustomerService) {
    this.clients = this.customerService.countCustomersAll;
  }
}
