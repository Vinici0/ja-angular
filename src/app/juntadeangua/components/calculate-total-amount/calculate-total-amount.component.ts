import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { switchMap } from 'rxjs';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { DialogUsuarioComponent } from '../../modals/dialog-usuario/dialog-usuario.component';
import { SearchClientComponent } from '../../modals/search-client/search-client.component';
import { FineService } from '../../services/fines.service';
import { Fine } from '../../interfaces/fine.interface';
import { FineServiceDetails } from '../../services/finesDetails.service';
import { MatSort } from '@angular/material/sort';
import { FineDetail } from '../../interfaces/fineDetails.interface';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-calculate-total-amount',
  templateUrl: './calculate-total-amount.component.html',
  styleUrls: ['./calculate-total-amount.component.css'],
})
export class CalculateTotalAmountComponent {
  id: string = '';
  fines: Fine[] = [];
  displayedColumns: string[] = [
    'typeFine',
    'valor_pagar',
    'valor_abonado',
    'date_fine',
    'pagado',
    'acciones',
  ];

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  fineDetails: FineDetail[] = [];
  constructor(
    private fineService: FineServiceDetails,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  public myForm: FormGroup = this.fb.group({
    lastNameAndName: ['', [Validators.required]],
    ruc: ['', [Validators.required]],
    phone: [''],
    typeFine: ['', [Validators.required]],
    descripcion: [''],
    cost: ['', [Validators.required]],
    date_fine: ['', [Validators.required]],
    id_cliente: [''],
    id_multa: [''],
    valor_pagar: [''],
  });

  ngOnInit(): void {
    this.disableFormControls();
    this.loadFineDetails();
  }

  disableFormControls(): void {
    this.myForm.controls['cost'].disable();
    this.myForm.controls['phone'].disable();
    this.myForm.controls['ruc'].disable();
    this.myForm.controls['lastNameAndName'].disable();
  }

  loadFineDetails(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.fineService.getFineDetailsByIdClient(id))
      )
      .subscribe((fines) => {
        this.fineDetails = fines;
        this.dataSource.data = this.fineDetails;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // Cargar datos del cliente en la posción 0 de fines
        this.loadClientData(fines);
      });
  }

  loadClientData(fines: any[]): void {
    this.myForm.setValue({
      lastNameAndName: fines[0].nombre,
      ruc: fines[0].ruc,
      phone: fines[0].telefono,
      typeFine: '',
      descripcion: '',
      cost: '',
      date_fine: new Date().toISOString().substring(0, 10), // Usa el formato UTC
      id_cliente: fines[0].id_cliente,
      id_multa: '',
      valor_pagar: '',
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {}

  searchClient() {
    this.dialog
      .open(SearchClientComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        this.myForm.setValue({
          lastNameAndName: result.Nombre,
          ruc: result.Ruc,
          phone: result.Telefono,
          typeFine: this.myForm.value.typeFine || '',
          descripcion: '',
          cost: this.myForm.value.cost || '',
          date_fine: new Date().toISOString().substring(0, 10), // Usa el formato UTC
          id_cliente: result.idCliente,
          id_multa: this.myForm.value.id_multa || '',
          valor_pagar: this.myForm.value.valor_pagar || '',
        });
      });
  }

  loadFinesbyIdClient(id: any) {
    this.fineService.getFineDetailsByIdClient(id).subscribe((fines) => {
      console.log('fines', fines);

      this.fineDetails = fines;
      this.dataSource.data = this.fineDetails;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onSelectionChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.fines.forEach((fine) => {
      if (fine.typeFine === value) {
        this.myForm.controls['cost'].setValue(fine.cost);
        this.myForm.controls['id_multa'].setValue(fine.idMulta);
        this.myForm.controls['valor_pagar'].setValue(fine.cost);
      }
    });
  }

  updateFineDetail() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('id', id, 'data', this.myForm.value);

    this.fineService.updateFineDetail(id, this.myForm.value).subscribe(
      (resp) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          width: 450,
          timer: 2000,
          title: 'Se ha actualizado correctamente',
          icon: 'success',
        });

        this.router.navigate(['/junta-de-angua/pages/fine']);
      },
      (err) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          width: 450,
          timer: 2000,
          title: 'Error al actualizar',
          icon: 'success',
        });
      }
    );
  }

  togglePagado(element: any) {
    this.fineService.togglePaymentStatus(element.idMultaDetalle, element)
      .subscribe(
        (resp) => {
          element.pagado = !element.pagado;
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            width: 450,
            timer: 2000,
            icon: 'success',
            title: 'Se ha actualizado correctamente',
          });

          // Vuelve a cargar los detalles de la multa después de la actualización
          this.loadFineDetails();
        },
        (error) => {
          console.log(error);
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            width: 450,
            timer: 2000,
            icon: 'error',
            title: 'Error al actualizar',
          });
        }
      );
  }


  adjustDateToLocale(dateString: string) {
    const date = new Date(dateString);
    const adjustedDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    );
    return adjustedDate.toISOString().split('T')[0];
  }

  deleteFineDetail(id: string) {
    Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: 'Esta acción no se puede revertir',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteFineDetailById(id);
        this.loadFineDetails();
      }
    });
  }

  deleteFineDetailById(id: string) {
    this.fineService.deleteFineDetail(id).subscribe(
      (resp) => {
        // this.loadFines();
      },
      (error) => {
        console.log(error);
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          width: 450,
          timer: 2000,
          title: 'Error al eliminar',
          icon: 'error',
        });
      }
    );
  }


  getCustomerInformation() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') || '';

    this.fineService.getCustomerInformation(id).subscribe((resp) => {
      // Crear un nuevo documento PDF
      const doc = new jsPDF();

         // Configurar estilos y variables
    const headerStyles = {
      fontSize: 12,
      fontColor: '#2c3e50',
      fontStyle: 'bold',
    };

    const subheaderStyles = {
      fontSize: 12,
      fontColor: '#7f8c8d',
    };

    const textStyles = {
      fontSize: 12,
      fontColor: '#000000',
      fontStyle: 'normal',
    };

    // Texto del encabezado
    const headerTextLine1 = 'JUNTA ADMINISTRATIVA DE AGUA POTABLE';
    const headerTextLine2 = 'DE LA URBANIZACIÓN EL PORTÓN';
    const headerTextLine3 = 'NOTIFICACIÓN DE CORTE';

    // Calcular el ancho del texto del encabezado
    const headerTextWidth = Math.max(
      doc.getTextWidth(headerTextLine1),
      doc.getTextWidth(headerTextLine2),
      doc.getTextWidth(headerTextLine3)
    );

    // Calcular posiciones del encabezado
    const headerYPosition = 20;
    const middlePoint = doc.internal.pageSize.height / 2;
    const middleHeaderYPosition = middlePoint - 30;

    // Función para centrar el texto
    const centerText = (text: string, y: number) => {
      const textWidth = doc.getTextWidth(text);
      const x = (doc.internal.pageSize.width - textWidth) / 2;
      doc.text(text, x, y);
    };

    // Agregar el encabezado en la parte superior
    doc.setFont(headerStyles.fontStyle);
    doc.setFontSize(headerStyles.fontSize);
    doc.setTextColor(headerStyles.fontColor);
    centerText(headerTextLine1, headerYPosition);
    centerText(headerTextLine2, headerYPosition + 5);
    centerText(headerTextLine3, headerYPosition + 10);

    // Agregar la imagen al lado izquierdo
    const logoWidthP = 23; // Ancho de la imagen (ajusta según sea necesario)
    const logoHeightP = 18; // Altura de la imagen (ajusta según sea necesario)
    const logoXP = 10; // Alineado al lado izquierdo con un margen de 10 unidades
    const logoYP = headerYPosition - 5; // Alineado a la misma altura del encabezado
    doc.addImage('assets/img/logos/logo.png', 'PNG', logoXP, logoYP, logoWidthP, logoHeightP);

      // Configurar estilos del subtítulo
      const subtitleStyles = {
        fontSize: 12,
        textColor: '#555555',
      };

      // Configurar estilos de la tabla
      const tableStyles = {
        headStyles: {
          fillColor: '#007bff', // Color de fondo de la cabecera
          textColor: '#ffffff', // Color del texto de la cabecera
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        alternateRowStyles: {
          fillColor: '#f5f5f5',
        },
      };

      // Inicializar variables para calcular el total general
      let totalGeneral = 0;

      // Agregar el subtítulo con la fecha actual
      const currentDate = new Date().toLocaleDateString('es-ES');
      doc.setFontSize(subtitleStyles.fontSize);
      doc.setTextColor(subtitleStyles.textColor);
      doc.text(`Fecha: ${currentDate}`, 10, 40);

      doc.setLineWidth(0.2);
      // doc.line(10, 32+30, 200, 32+30);

      const ybase = 30;

      // Agregar los datos del cliente al PDF
      doc.setFontSize(10);
      doc.setTextColor('#000000'); // Restaurar color de texto predeterminado
      doc.text(`Nombre: ${resp[0].Nombre}`, 10, 35 + ybase);
      doc.text(`RUC/C.I: ${resp[0].Ruc}`, 10, 45 + ybase);
      doc.text(`Teléfono: ${resp[0].Telefono || 'N/A'}`, 10, 55 + ybase);
      doc.text(`Email: ${resp[0].Email || 'N/A'}`, 10, 65 + ybase);
      // Agregar una línea separadora
      // doc.line(10, 75, 200, 75);

      // Agregar la lista de multas al PDF
      const columns = ['Fecha', 'Descripción', 'Valor a Pagar', 'Pagado'];
      const rows: any[][] = resp.map((multa: any) => {
        const totalRegistro = multa.valor_pagar ? multa.valor_pagar : 0;
        totalGeneral += totalRegistro;

        return [
          multa.Fecha ? multa.Fecha : 'N/A',
          multa.typeFine ? multa.typeFine : 'N/A',
          multa.valor_pagar ? multa.valor_pagar.toString() : 'N/A',
          multa.pagado ? 'Sí' : 'No',
        ];
      });

      autoTable(doc, {
        startY: 85,
        head: [columns],
        body: rows,
        theme: 'grid',
        ...tableStyles,
      });

      // Agregar el total general al PDF
      doc.setFontSize(10);
      doc.setTextColor('#000000'); // Restaurar color de texto predeterminado
      doc.text(`Total General: ${totalGeneral.toFixed(2)}`, 10, doc.internal.pageSize.height - 10);

      // Guardar o abrir el PDF
      doc.save('informacion_cliente.pdf');
    });
  }

  generateNotificationPDF() {
    // Crear un nuevo documento PDF
    const doc = new jsPDF();

    const customers = [
      {
        nombre: "María Rodríguez Pérez",
        dia: 18,
        mes: "noviembre",
        anio: 2023,
        meses: 2,
        codigoMedidor: 230424823,
        manzana: 4,
        solar: 46,
        monto: 130.00
      },
      {
        nombre: "Carlos Gómez Torres",
        dia: 20,
        mes: "octubre",
        anio: 2023,
        meses: 3,
        codigoMedidor: 123456789,
        manzana: 2,
        solar: 12,
        monto: 75.50
      },
      {
        nombre: "Laura Martínez Sánchez",
        dia: 20,
        mes: "octubre",
        anio: 2023,
        meses: 3,
        codigoMedidor: 123456788,
        manzana: 2,
        solar: 12,
        monto: 75.50
      },
      {
        nombre: "Alejandro Pérez Ruiz",
        dia: 20,
        mes: "octubre",
        anio: 2023,
        meses: 3,
        codigoMedidor: 123456784,
        manzana: 2,
        solar: 12,
        monto: 75.50
      }
    ];


    // Configurar estilos y variables
    const headerStyles = {
      fontSize: 12,
      fontColor: '#2c3e50',
      fontStyle: 'bold',
    };

    const subheaderStyles = {
      fontSize: 12,
      fontColor: '#7f8c8d',
    };

    const textStyles = {
      fontSize: 12,
      fontColor: '#000000',
      fontStyle: 'normal',
    };

    // Texto del encabezado
    const headerTextLine1 = 'JUNTA ADMINISTRATIVA DE AGUA POTABLE';
    const headerTextLine2 = 'DE LA URBANIZACIÓN EL PORTÓN';
    const headerTextLine3 = 'NOTIFICACIÓN DE CORTE';

    // Calcular el ancho del texto del encabezado
    const headerTextWidth = Math.max(
      doc.getTextWidth(headerTextLine1),
      doc.getTextWidth(headerTextLine2),
      doc.getTextWidth(headerTextLine3)
    );

    // Calcular posiciones del encabezado
    const headerYPosition = 20;
    const middlePoint = doc.internal.pageSize.height / 2;
    const middleHeaderYPosition = middlePoint - 30;

    // Función para centrar el texto
    const centerText = (text: string, y: number) => {
      const textWidth = doc.getTextWidth(text);
      const x = (doc.internal.pageSize.width - textWidth) / 2;
      doc.text(text, x, y);
    };

    // Agregar el encabezado en la parte superior
    doc.setFont(headerStyles.fontStyle);
    doc.setFontSize(headerStyles.fontSize);
    doc.setTextColor(headerStyles.fontColor);
    centerText(headerTextLine1, headerYPosition);
    centerText(headerTextLine2, headerYPosition + 5);
    centerText(headerTextLine3, headerYPosition + 10);

    // Agregar la imagen al lado izquierdo
    const logoWidthP = 23; // Ancho de la imagen (ajusta según sea necesario)
    const logoHeightP = 18; // Altura de la imagen (ajusta según sea necesario)
    const logoXP = 10; // Alineado al lado izquierdo con un margen de 10 unidades
    const logoYP = headerYPosition - 5; // Alineado a la misma altura del encabezado
    doc.addImage('assets/img/logos/logo.png', 'PNG', logoXP, logoYP, logoWidthP, logoHeightP);

    // Sutitulo de multas de asamblea
    const subheaderTextLine1 = 'MULTAS DE ASAMBLEA';
    // doc.setFont(subheaderStyles.);
    doc.setFontSize(subheaderStyles.fontSize);

    // Calcular posiciones del subtitulo
    const subheaderYPosition = 50;
    const subheaderTextWidth = doc.getTextWidth(subheaderTextLine1);
    const subheaderXPosition = (doc.internal.pageSize.width - subheaderTextWidth) / 2;

    // Agregar el subtitulo
    doc.setTextColor(subheaderStyles.fontColor);
    doc.text(subheaderTextLine1, subheaderXPosition, subheaderYPosition);



    // Guardar o abrir el PDF
    doc.save('notificacion.pdf');
  }








}
