import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Measure } from '../../interfaces/measure';
import { MeasureServiceTsService } from '../../services/measure.service.ts.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PdfViewComponent } from '../../modals/pdf-view/pdf-view.component';

@Component({
  selector: 'app-service-expense',
  templateUrl: './service-expense.component.html',
  styles: [],
})
export class ServiceExpenseComponent implements OnInit {
  months: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  // measurelist!: Measure[];

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginatior!: MatPaginator;

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

  applyFilter(event: Event, columnName: string) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.columnFilters[columnName] = filterValue;
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const transformedData = (data[columnName] || '').trim().toLowerCase();
      return transformedData.includes(filter);
    };

    this.dataSource.filter = this.columnFilters[columnName];
  }

  openDialog() {
    this.measureServiceTsService
      .imprimirCorte(this.dataSource.filteredData)
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

  // imprimirCorte() {
  //   this.measureServiceTsService.imprimirCorte(this.dataSource.filteredData).subscribe((resp) => {
  //     const blobUrl = window.URL.createObjectURL(resp);
  //     this.pdfurl = blobUrl;

  //     this.dialogView.open(PdfViewComponent, {
  //       width: '750px',
  //       height: '700px',
  //       data: {
  //         pdfurl: this.pdfurl,
  //       },
  //     });
  //   });
  // }
}
