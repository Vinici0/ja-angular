import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { DashboardService } from '../../services/dashboard.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  // Variables del filtrado
  total_estimado: number = 0;
  total_recaudado: number = 0;
  total_pendiente: number = 0;
  total_real: number = 0;
  excedente_estimado: number = 0;
  agua_estimado: number = 0;
  alcantarillado_estimado: number = 0;

  // Obtener informacion para el filtrado general
  filtroNombre: string = '';
  filtroRuc: string = '';
  anios: any[] = [];
  meses: any[] = [
    { id: 1, nombre: 'ENERO' },
    { id: 2, nombre: 'FEBRERO' },
    { id: 3, nombre: 'MARZO' },
    { id: 4, nombre: 'ABRIL' },
    { id: 5, nombre: 'MAYO' },
    { id: 6, nombre: 'JUNIO' },
    { id: 7, nombre: 'JULIO' },
    { id: 8, nombre: 'AGOSTO' },
    { id: 9, nombre: 'SEPTIEMBRE' },
    { id: 10, nombre: 'OCTUBRE' },
    { id: 11, nombre: 'NOVIEMBRE' },
    { id: 12, nombre: 'DICIEMBRE' },
  ];
  lotes: any[] = [];
  manzanas: any[] = [];

  // Seleccion del select por defecto
  selectedDefault1: string = 'TODOS';
  selectedDefault2: string = 'TODOS';
  selectedDefault3: string = 'TODOS';
  selectedDefault4: string = 'TODOS';


  // Obtener informacion a los botones
  public count_clients: number = 0;
  public count_meters: number = 0;
  public count_fade: number = 0;
  public count_users: number = 0;

  // Cambiar seccion
  public clients: number = 0;

  filtroForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private dashboardService: DashboardService
  ) {
    this.clients = this.customerService.countCustomersAll;

    this.selectedDefault1 = 'TODOS';
    this.selectedDefault2 = 'TODOS';
    this.selectedDefault3 = 'TODOS';
    this.selectedDefault4 = 'TODOS';

    this.filtroForm = this.formBuilder.group({
      nombre: [''],
      ruc: [''],
      anio: ['TODOS'],
      mes: ['TODOS'],
      lote: ['TODOS'],
      manzana: ['TODOS'],
    });

    // Escuchar cambios en el formulario
    this.filtroForm.valueChanges.subscribe(() => {
      this.updateChartData();
    });
  }

  public activeSection: string = 'clients';

  ngOnInit() {
    this.getAnios();
    this.getLotes();
    this.getManzanas();
    this.updateChartData();

    this.getContClients();
    this.getContMeter();
    this.getContFade();
    this.getContUsers();
  }

  updateChartData() {
    let { nombre, ruc, anio, mes, lote, manzana } = this.filtroForm.value;

    // Verificar si los campos están vacíos y asignar "%20" en ese caso
    nombre = nombre.trim() === '' ? '%20' : nombre;
    ruc = ruc.trim() === '' ? '%20' : ruc;

    this.dashboardService.getDataFiltradaMedidas(nombre, ruc, anio, mes, lote, manzana)
      .subscribe(
        (response: any) => {
          console.log('Respuesta del servicio:', response);

          if (response && response.success && response.message === 'Datos filtrados obtenidos correctamente' && response.data && response.data.length > 0) {
            const datosFiltrados = response.data[0];
            console.log('Datos filtrados:', datosFiltrados);

            // Asignar valores a las variables
            this.total_estimado = datosFiltrados.TotalEstimado || 0;
            this.total_recaudado = datosFiltrados.TotalRecaudado || 0;
            this.total_pendiente = datosFiltrados.TotalPendiente || 0;
            this.total_real = datosFiltrados.TotalReal || 0;
            this.excedente_estimado = datosFiltrados.Exedente || 0;
            this.agua_estimado = datosFiltrados.AguaEstimado || 0;
            this.alcantarillado_estimado = datosFiltrados.AlcantarilladoEstimado || 0;


          } else {
            console.error('La respuesta del servicio no es válida:', response);
            // Asignar valores predeterminados en caso de que los datos no estén disponibles
            this.total_estimado = 0;
            this.total_recaudado = 0;
            this.total_pendiente = 0;
            this.total_real = 0;
            this.excedente_estimado = 0;
            this.agua_estimado = 0;
            this.alcantarillado_estimado = 0;
          }
        },
        (error) => {
          console.error('Error en la suscripción:', error);
        }
      );
  }





  getAnios() {
    this.dashboardService.getAnios().subscribe((resp: any) => {
      this.anios = resp.data.total.map((item: any) => item.Anio);
    });
  }

  getLotes() {
    this.dashboardService.getLotesG().subscribe((resp: any) => {
      this.lotes = resp.data.total.map((item: any) => item.Lote);
    });
  }

  getManzanas() {
    this.dashboardService.getManzanasG().subscribe((resp: any) => {
      this.manzanas = resp.data.total.map((item: any) => item.Manzana);
    });
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

  getContFade() {
    this.dashboardService.getContFade().subscribe((resp: any) => {
      if (resp && resp.data && resp.data.total && resp.data.total.length > 0) {
        this.count_fade = resp.data.total[0].cont;
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

  // Iconos
  money_icon: string = 'data:image/png;base64,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';
  water_icon: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFZ0lEQVR4nO2aeYhVZRiHP7eMzCmzLJpGUgutaHGEyqjQCtKgtE0jUivLFiKFhBaLFkvKP0onMTViKtBIyGjRMlooyoqWCbOisr3UNpuMypzGJ17md+qdO+eee2buXO2euc8/M/d+7z3ne7/t3b4QKlSoUKHC/w/gbGA5MDB0NYBhwB+0sAboEboKQE/gTVpzXegqADc5xdfr71bgyJB1gJFAk5ReBgwANujzh8BuIasAuwKfSNmvgT31/Rhgu76fF7IKcLOUNGVPyWlbqLa/gdqQNYA+wGYpuThP+xdqXx6yBjBBytn+r8kjc7mT6ROyBHCrlFubIDPIWYcRIaMDsD5B5nA3ALVZMXmD9f95UqwZqM4jf4VktgFVoZwBxum0/xnYH+gH/CYFHwW65cj3Bzaq/alQzgB7AN+65fxYjAf4JHCEFD/NWQCb/eGhnAGW0pYLLeCxwSA/5gNMDeUMMMkpZI7PS/rflv9QDcI1wKYc5d8BRodyBhgCbJFCL0vZauAnp2RvyfbQFhgFHBjKHaA78KoU3eKVUuIjYk7IIvznxRkXx7Q/7Ly88j7kcrFl7fb00wmW4askmbKFlhM+cnKGJchdJDnzD4aGrAA8LsWeKyDXC2iU7MyQFYB3pdSdKWRfkeyCkBVoMXmpsjnA25mzBsB9UqqhgFw/ubrGBSErAGOdCRybIHeHywDvE7IC0E1envE9cFSMzPkuG1wXsgZwmAt3/wLuByYD04BVboVY6nv3kEWAo4HvyM/rwL4hywB9gRu0JWxF/Ai8CEyxeGFn969CJ87yOTJ/zwBvAG+ZJ6hy92JzipTjO6kslz1wEHCjHBc70GqAK4FnZcbaixVBHwQmdqT+p4DrBMUd4+3QLYXSA81Hd95aEs061Cz9VacZX6iC5yqVvy0hGoedDfWWQCnQH0uanGHRo7tL4GkATi9W6b2Bq4HXXIEy4hdn2ozfgScsb5d2WZvDA5wKzNY7bOBw5nJO7uGo+wPTXPjs+VW/i7A+n1nMAHwaMztLNfK9nZu7sTNK18ABwLXAD+6d/6bJbUZdBTnCMk3To1BbK+NE4H21v1dMhz7SQz4Dzs1VUjm7Tq/WmDOkMyFihgbCz+wKK64kPGN6tFKL6chteojZ6176zg6ZR3QmdHfOzdyUz6wCjrX7AClkzUeI29vHFfidFVu+kfzKdqjcGuBQ9+Ix+i5Kbs7Q53n6/GVuRScOYLXk/1Ra/HatroP9fleazGY5YqtWQuKFKd0qaXC/KS7HCKzVw+pdTc9O9b3c54jEmZH8IpLZrFR5c46ZLFgRBg4BPnfbZEpRyhvALD2wMcrbx0R7UelqfkhfIzD3dwnwQYyFiWjSQds3xTPPcpcs7HeXpOlL2s5GjMsjc5faN3TEp5f3OEJKTJWZsxN/QMozxR+Y5l+c3N4+JCJX1liWp73WdWBU2EHIlY5WHwqyhpTiRTOdsxN7PUWxvLGo0zvQ9l3VKqZsd0vezqVdSvXCGveyCSlMZs8S9cOW+y2aiIh1wDGleF8rnPlbkZD1iZgkf8E6u0AR4N3AZXbVJXTMMbo+J35olFksyWC3AbjK2e+qAiazELZv71Uc0MayuOdZyfwexR0R22RKd2wYDeynSwrG5AImE9nxj4Hn7VqLgh0LVoiJL1ZL0VmKBerky3vz2KQocdAOVdwDvJDkXipPEDExpt0CleNlNqNDsxCbFBXu/HsCwKVuGfbPcYZGyi2OihsPpXjeYG2tep0x6xSBrpEDNL5kJ3tHoOXSUqSgDcZwzaa3xRGzQxYBVrpVkIslKeZm7ianRwUNj7m/8y0QShMNZuVe/wPao6Mr+fwKFSpUCOXLP+uNCQhkRLnvAAAAAElFTkSuQmCC';
  sewer_icon: string = 'data:image/png;base64,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';
  customer_icon: string = 'data:image/png;base64,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';
  meter_icon: string = 'data:image/png;base64,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';
  fine_icon: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEYUlEQVR4nO2ba6hVRRTHRzLzZnhVUKms6PEhLUxQoiTlgknSk8owI4pU8hpe0KiMrG/BrUiDiIqiTOpTED2oMIRUQg2LHpCVivigNJ/0EnpYv1jd/4G5u3P23sGcPXt79x8Gzp1Ze826/5m9ZmbtNc7VqFEjBIDTgPuBzcBRygOzZRNwn9nYbhKmA/vV8V/AduDTkpTtssmwD5jWLhKmAb8DfwK9wFhXMphNwGPAceA34IrQHQwTy9bB9a7kAG6Qrd8Bp4ZUfK+m3OOuIgCelM1LQir9SO/f6a4iAM4E/gY2hFR6ENiVIXMe8BywE3gVGO8iA9gNHAip8A/gs5T2bjlRHzYay11EAJ+b7YUQAczQP34AWABMBG4H9qp+rosEs7lIItbJf1yaqL9QS9jWDN13B9xUPRqFCGAQ8BPwTYvn1gCHgY4U3TcG3FTdE3NG/GpOyZUQRRPxnqblbDfAiZiirbfJPA3cDFxir01O3bbs3hKoXByNCANwjfYaPrYCl7kMnBDOssnxfDbwMPCuDDtms8OlQLNnWaAyPToRSQDzRMYHLhJKQYQB+EqnwKFuADjLd4CXW7St1azoTNF9JfB6oHJrTCI+0TnjgkT9aOBHYM+AcJbAbd4qMRU4GZikmKZhaYbu4VpCQ5RRMYkYpP2Df+ps4DUjxkVCrOVzlg5g6HW5Ke+m6oRbNYAhwMhYq0Rpl8/YqImIEI8YC3RpLxCzmA1johBB35nCdo1lgdnyUKFE0HdQsmXye2CFvi7FLCtki9k0sUgi5msUelxJACyWTfOLJGKROp3nSgLgLtm0yKuriSiKiO7kNIwNL/7RXSQRV6nT9fode/k0GzbIpplFEnGSSCgbPjTbCiPCoOP2nUoaib189sqWfifdeosdMZzfqVNnnjK4hY6OlGc6mgRzGm2dZSJix/94j7syMlyaoTch+7XXtqNMRKxWoDZPafqdA1iY8ky/ZRp4yWtbnWJXHY8w1ERUxFmODFwq6yxDo7LOcm3gUjvLLNTOsmLOckjObyRZZXjVneWcjD7vyKlnW9WdZVdGnzNz6lmVoqPeWRpqIoSaiAJDdR3AA0o2fSHrSoIS1Vcp224pcEqKrEW+eiRrvmdyhm7L+X4ReB940L+x01YigLOV9+zDks8XpKQGWUKqDzPwnCayo70cC/9T3rIWuucqhdHHt0ZOW4mgL1p8RB2+Yjd6lDr0i+qeacQNbdQVN0DP2D2rs4A3VPeDfxPPsvt1B8vwpmSvU1J7I/vm30iVRbmAp1T/swg5QzOocfVxVruIOKbRsd+LE+0X6bqh4WPdvTQjDF9aflMi1Wi5rjaYrpXAE5pVVveIn2kDnAt84emyO6cb9bf1OSFhS4/0HpfNwYn4zygmZEYAb9MfNorDWshfDRzyZG3kr025ZWi6fLxlfabcTzVbCU3E+cCzwLgcslP11WlyDlnbms9RGZFDfop0X55DdhywJSgRVYXlcgHPx7ajRg1XXfwDIQTTdzuJy6MAAAAASUVORK5CYII=';
  user_icon: string = 'data:image/png;base64,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';
  totalReal_icon: string = 'data:image/png;base64,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';
  exedente_icon: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC4klEQVR4nO2dPU8VQRSGN2hBcnsrS0NjaUdNq7FBTUystKYk4RfYWfsDaGztqOnpbA0FioYvCwg0PGbIGG6Il/2a2T1n9n0SEkKGsztzZs8579yzuVUlhBBCCCGEEEIIIYQQQowKsAJ8Ak6Ag/j7itwyrBOWgDXgK3DN/9kF1oGHck4+RzwCNoHvNOcH8BF4LMekc8Qz4DNwQXeugC/hyZJjujlhBnwA9hos9l4c23b8TM6pd8STGGKOuu74Fk/UnzjuqRzTPkm3zgktc46KgKEWjEwOL4YxQwoJQmIRAMvAu4ZJ9xuwkTPpWrufwfCwIym9CPAasymtCChlQjjdUJN45HEQcieZFLE6Xzc7puSI4D6mlpIzS0nSucm+YUd/JB2TLKSbTVpO6bWewJv4mXSdR7eB1bEn642wZnHtwhreR/DBqyqGnkXsA1shn4w9Me/EnLwV13QRZ2HgmRxixiGnYeBrhSwzIWv93z8pqSck6Xqq7DV6kiFhaPQkQ0cnhjesDhcrmyF9akUAQ84XeB+1yHGX7vEWZd2pt+50brvrw70nP8mYs/8LOARehD9e3jEeEtMO8BJ4kFj4dLY/FOGe4r3tNEjSrU8yauz/DAPOB7xgb/u5yL2hGtq/ccjbXEo99yOfgtwht4X9kDKeD5K0rBUBeJpv7rKu5FZSPCv1UpqtKU2pe30dgSkodRy8sGNVqXd55Wzm9ZU2Ms/XlVKnuX13ZbtrpU5z+6aFbXFKnXr7njeUb6XOrf3f8cdzyJVSR0pdSj0ipY4zYTvaBaXUeyClXkmpU4+UutGy0XPZLqW+CCl1KfV5pNSxE3Kl1JFSl1KPSKnjTNiOdkEp9R5IqVdS6kxNqffFUJeHr8a33BjrgzKX00bDSBGw67LxLTf6TN0oU+t+d0XJ3e+uKaX7vTi8KvVJgIPu90mCse53MYe+8sgo6EvBbIK+Ns8uJOh+F0IIIYQQQgghhBBCVJ34C2sMQbCzeJD+AAAAAElFTkSuQmCC';
}
