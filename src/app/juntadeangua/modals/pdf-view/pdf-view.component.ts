import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.css'],
})
export class PdfViewComponent {
  public pdfurl = '';

  constructor(
    public dialogRef: MatDialogRef<PdfViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {}

  ngOnInit(): void {
    this.pdfurl = this.data.pdfurl;
  }
}
