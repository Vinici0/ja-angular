import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-dialog-export-excel',
  templateUrl: './dialog-export-excel.component.html',
  styleUrls: ['./dialog-export-excel.component.css'],
})
export class DialogExportExcelComponent implements OnInit {
  allClients: any[] = [];
  loading = true;

  soloConEmail = false;
  soloSinEmail = false;
  manzanaFilter = '';

  onToggleConEmail() {
    if (this.soloConEmail) this.soloSinEmail = false;
  }

  onToggleSinEmail() {
    if (this.soloSinEmail) this.soloConEmail = false;
  }

  get filteredClients(): any[] {
    return this.allClients.filter((c) => {
      const tieneEmail = !!c.Email?.trim();
      if (this.soloConEmail && !tieneEmail) return false;
      if (this.soloSinEmail && tieneEmail) return false;
      if (
        this.manzanaFilter.trim() &&
        c.Manzana?.trim().toLowerCase() !== this.manzanaFilter.trim().toLowerCase()
      )
        return false;
      return true;
    });
  }

  constructor(
    private dialogRef: MatDialogRef<DialogExportExcelComponent>,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.customerService.getClientsPrintReport().subscribe((clients: any[]) => {
      this.allClients = clients;
      this.loading = false;
    });
  }

  onExport() {
    this.dialogRef.close(this.filteredClients);
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
