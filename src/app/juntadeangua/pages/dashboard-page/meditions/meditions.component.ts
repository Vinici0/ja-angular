import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-meditions',
  templateUrl: './meditions.component.html',
  styleUrls: ['./meditions.component.css']
})
export class MeditionsComponent implements OnInit {

  filtro1: any[] = []

  selectedDefault1: string = 'TODOS';
  selectedDefault2: string = 'TODOS';
  selectedDefault3: string = 'TODOS';
  selectedDefault4: string = 'TODOS';

  ngOnInit() {
    this.updateChartData();
  }

  updateChartData() {

  }
}
