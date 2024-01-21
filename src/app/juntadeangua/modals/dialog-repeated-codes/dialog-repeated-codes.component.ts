import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatTableDataSource,
  MatTableDataSourcePaginator,
} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MeasureServiceTsService } from '../../services/measure.service.ts.service';

@Component({
  selector: 'app-dialog-repeated-codes',
  templateUrl: './dialog-repeated-codes.component.html',
  styleUrls: ['./dialog-repeated-codes.component.css'],
})
export class DialogRepeatedCodesComponent implements OnInit {
  dataSource!: MatTableDataSource<any, MatTableDataSourcePaginator>;
  @ViewChild(MatPaginator) paginatior!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    public dialogView: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogRepeatedCodesComponent>,
    private measureServiceTsService: MeasureServiceTsService
  ) {}

  ngOnInit(): void {}

  getCodigosRepetidos() {
    this.measureServiceTsService.getCodigosRepetidos().subscribe((resp) => {
      this.dataSource = new MatTableDataSource(resp.data);
      this.dataSource.paginator = this.paginatior;
      this.dataSource.sort = this.sort;
    });
  }

  deleteRepeatedCode(id: any) {
  }
}
