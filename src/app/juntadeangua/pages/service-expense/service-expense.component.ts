import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Measure } from '../../interfaces/measure';
import { MeasureServiceTsService } from '../../services/measure.service.ts.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PdfViewComponent } from '../../modals/pdf-view/pdf-view.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-service-expense',
  templateUrl: './service-expense.component.html',
  styles: [],
})
export class ServiceExpenseComponent implements OnInit {
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginatior!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  startDate = new Date();
  endDate = new Date();
  formGroup: FormGroup;
  filterAnio: any;
  columnFilters: { [key: string]: string } = {};
  pdfurl: string = '';

  constructor(
    private measureServiceTsService: MeasureServiceTsService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public dialogView: MatDialog
  ) {
    this.formGroup = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });
  }

  displayedColumns: string[] = [
    'Nombre',
    'Manzana',
    'Lote',
    'Codigo',
    'Meses',
    'Saldo',
  ];

  ngOnInit(): void {
    this.execCorte();
  }

  execCorte() {
    this.measureServiceTsService.execCorte().subscribe((resp) => {
      console.log(resp);
      this.dataSource = new MatTableDataSource(resp.data.measure);
      this.dataSource.paginator = this.paginatior;
      this.dataSource.sort = this.sort;
    });
  }

  sortData(event: any) {
    console.log(event);
  }

  editcustomer(id: number) {}

  detailcustomer(id: number) {}

  addcustomer() {}

  Filterchange(event: any) {
    console.log(event);
  }

  onSubmitForm() {
    console.log(this.formGroup.value);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog() {
    if (this.dataSource.sort) {
      const sortedData = this.dataSource.sortData(
        this.dataSource.filteredData.slice(),
        this.dataSource.sort
      );
      this.measureServiceTsService
        .imprimirCorte(sortedData)
        .subscribe((resp) => {
          const blobUrl = window.URL.createObjectURL(resp);
          this.pdfurl = blobUrl;

          this.dialogView.open(PdfViewComponent, {
            width: '750px',
            height: '700px',
            data: {
              pdfurl: this.pdfurl,
            },
          });
        });
    }
  }
}
