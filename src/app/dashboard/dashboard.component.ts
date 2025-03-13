import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [CommonModule],
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Observables para los datos de Firebase
  proyectos$!: Observable<any[]>;
  tecnologias$!: Observable<any[]>;
  facturasEmitidas$!: Observable<any[]>;
  facturasRecibidas$!: Observable<any[]>;

  // Array local para almacenar los proyectos
  proyectos: any[] = [];
  // Referencia al gráfico actual para poder destruirlo y recrearlo
  currentChart: Chart | null = null;

  constructor(
    private firestore: Firestore,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Inicialización de las colecciones de Firebase
    const proyectosCollection = collection(this.firestore, 'proyectos');
    // Usamos map para añadir un campo 'id' basado en el nombre del proyecto
    this.proyectos$ = collectionData(proyectosCollection).pipe(
      map(proyectos => proyectos.map(proyecto => ({
        ...proyecto,
        id: proyecto['nombre'] // Usamos el nombre como ID
      })))
    );

    const tecnologiasCollection = collection(this.firestore, 'tecnologias');
    this.tecnologias$ = collectionData(tecnologiasCollection);

    const facturasEmitidasCollection = collection(this.firestore, 'facturasEmitidas');
    this.facturasEmitidas$ = collectionData(facturasEmitidasCollection);

    const facturasRecibidasCollection = collection(this.firestore, 'facturasRecibidas');
    this.facturasRecibidas$ = collectionData(facturasRecibidasCollection);

    // Inicialización de las gráficas
    this.initCharts();
  }

  initCharts(): void {
    // Suscripción a los proyectos para inicializar las gráficas
    this.proyectos$.subscribe(proyectos => {
      console.log('Proyectos cargados:', proyectos);
      this.proyectos = proyectos;
      this.createTechDistributionChart(proyectos);
      this.createProjectStatusChart(proyectos);
      this.createProjectTimelineChart(proyectos);
      this.cdr.detectChanges(); // Forzamos la detección de cambios
    });

    // Combinamos los observables de facturas para crear el gráfico de comparación
    combineLatest([this.facturasEmitidas$, this.facturasRecibidas$]).subscribe(
      ([facturasEmitidas, facturasRecibidas]) => {
        this.createInvoiceComparisonChart(facturasEmitidas, facturasRecibidas);
      }
    );
  }

  onProjectSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    console.log('Proyecto seleccionado:', selectedValue);

    if (selectedValue === 'all') {
      this.createTechDistributionChart(this.proyectos);
    } else {
      const selectedProject = this.proyectos.find(p => p.nombre === selectedValue);
      if (selectedProject) {
        console.log('Proyecto encontrado:', selectedProject);
        this.createTechDistributionChart([selectedProject]);
      } else {
        console.log('Proyecto no encontrado');
      }
    }
  }

  createTechDistributionChart(proyectos: any[]): void {
    // Contamos las ocurrencias de cada tecnología
    const techCounts: {[key: string]: number} = {};
    proyectos.forEach(proyecto => {
      if (proyecto.tecnologias && Array.isArray(proyecto.tecnologias)) {
        proyecto.tecnologias.forEach((tech: string) => {
          techCounts[tech] = (techCounts[tech] || 0) + 1;
        });
      }
    });

    console.log('Conteo de tecnologías:', techCounts);

    const ctx = document.getElementById('techDistributionChart') as HTMLCanvasElement;

    // Destruimos el gráfico anterior si existe
    if (this.currentChart) {
      this.currentChart.destroy();
    }

    // Creamos el nuevo gráfico de distribución de tecnologías
    this.currentChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(techCounts),
        datasets: [{
          data: Object.values(techCounts),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: proyectos.length > 1 ? 'Distribución de Tecnologías (Todos los proyectos)' :
              proyectos.length === 1 ? `Distribución de Tecnologías (${proyectos[0].nombre})` :
                'Distribución de Tecnologías (Sin proyectos)'
          }
        }
      }
    });
  }

  createProjectStatusChart(proyectos: any[]): void {
    // Contamos los proyectos por estado
    const statusCounts: {[key: string]: number} = {};
    proyectos.forEach(proyecto => {
      statusCounts[proyecto.estado] = (statusCounts[proyecto.estado] || 0) + 1;
    });

    // Creamos el gráfico de radar para el estado de los proyectos
    const ctx = document.getElementById('projectStatusChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: Object.keys(statusCounts),
        datasets: [{
          label: 'Número de Proyectos',
          data: Object.values(statusCounts),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(54, 162, 235)'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Estado de los Proyectos'
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  createInvoiceComparisonChart(facturasEmitidas: any[], facturasRecibidas: any[]): void {
    // Calculamos los totales de facturas
    const totalEmitidas = facturasEmitidas.reduce((sum, factura) => sum + factura.total, 0);
    const totalRecibidas = facturasRecibidas.reduce((sum, factura) => sum + factura.total, 0);
    const cuotaIvaRecibidas = facturasRecibidas.reduce((sum, factura) => sum + (factura.baseImponible * factura.tipoIva), 0);

    // Creamos el gráfico de donut para comparar las facturas
    const ctx = document.getElementById('invoiceComparisonChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Facturas Emitidas', 'Facturas Recibidas (Total)', 'IVA Facturas Recibidas'],
          datasets: [{
            data: [totalEmitidas, totalRecibidas, cuotaIvaRecibidas],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Comparación de Facturas'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed !== null) {
                    // Formateamos el valor como moneda
                    label += new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(context.parsed);
                  }
                  return label;
                }
              }
            }
          }
        }
      });
    }
  }

  createProjectTimelineChart(proyectos: any[]): void {
    // Procesamos las fechas de inicio de los proyectos
    const fechas = proyectos.map((p) => {
      const fechaInicio = new Date(p.fechaInicio.seconds * 1000);
      return fechaInicio.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    });

    // Contamos los proyectos por fecha
    const counts = fechas.reduce((acc: { [key: string]: number }, fecha) => {
      acc[fecha] = (acc[fecha] || 0) + 1;
      return acc;
    }, {});

    console.log('Fechas procesadas para timeline:', counts);

    // Creamos el gráfico de línea temporal
    const ctx = document.getElementById('projectTimelineChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: Object.keys(counts),
          datasets: [
            {
              label: 'Proyectos Iniciados',
              data: Object.values(counts),
              borderColor: '#4BC0C0',
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
              },
              title: {
                display: true,
                text: 'Fecha',
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cantidad de Proyectos',
              },
            },
          },
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Proyectos Iniciados por Fecha'
            }
          },
        },
      });
    } else {
      console.error('El elemento canvas para projectTimelineChart no existe.');
    }
  }
}
