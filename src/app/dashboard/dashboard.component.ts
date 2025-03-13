import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import Chart from 'chart.js/auto';
//adaptador de fechas para Chart.js
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Observables para los datos de Firebase. 
  // El operador '!' asegura que estas propiedades se inicializarán antes de su uso.
  proyectos$!: Observable<any[]>;
  tecnologias$!: Observable<any[]>;
  facturasEmitidas$!: Observable<any[]>;
  facturasRecibidas$!: Observable<any[]>;

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    // Inicializamos las colecciones de Firebase
    // 'collection' crea una referencia a la colección en Firestore
    // 'collectionData' convierte esa referencia en un Observable
    const proyectosCollection = collection(this.firestore, 'proyectos');
    this.proyectos$ = collectionData(proyectosCollection);

    const tecnologiasCollection = collection(this.firestore, 'tecnologias');
    this.tecnologias$ = collectionData(tecnologiasCollection);

    const facturasEmitidasCollection = collection(this.firestore, 'facturasEmitidas');
    this.facturasEmitidas$ = collectionData(facturasEmitidasCollection);

    const facturasRecibidasCollection = collection(this.firestore, 'facturasRecibidas');
    this.facturasRecibidas$ = collectionData(facturasRecibidasCollection);

    // Inicializamos las gráficas
    this.initCharts();
  }

  initCharts(): void {
    // Nos suscribimos al Observable de proyectos
    // Cada vez que los datos cambien, se actualizarán las gráficas
    this.proyectos$.subscribe(proyectos => {
      this.createTechDistributionChart(proyectos);
      this.createProjectStatusChart(proyectos);
      this.createProjectTimelineChart(proyectos);
    });

    // combineLatest: Espera a que ambos Observables emitan un valor
    // Útil cuando necesitamos datos de múltiples fuentes para una sola gráfica
    combineLatest([this.facturasEmitidas$, this.facturasRecibidas$]).subscribe(
      ([facturasEmitidas, facturasRecibidas]) => {
        this.createInvoiceComparisonChart(facturasEmitidas, facturasRecibidas);
      }
    );
  }

  createTechDistributionChart(proyectos: any[]): void {
    // Contamos las ocurrencias de cada tecnología en todos los proyectos
    const techCounts: {[key: string]: number} = {};
    proyectos.forEach(proyecto => {
      proyecto.tecnologias.forEach((tech: string) => {
        techCounts[tech] = (techCounts[tech] || 0) + 1;
      });
    });

    // Creamos un gráfico de tipo 'pie' (circular) para mostrar la distribución
    const ctx = document.getElementById('techDistributionChart') as HTMLCanvasElement;
    new Chart(ctx, {
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
            text: 'Distribución de Tecnologías'
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

    // Creamos un gráfico de tipo 'radar' para visualizar el estado de los proyectos
    // Este tipo de gráfico es útil para mostrar múltiples variables en un solo gráfico
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
    // Calculamos los totales usando el método reduce
    const totalEmitidas = facturasEmitidas.reduce((sum, factura) => sum + factura.total, 0);
    const totalRecibidas = facturasRecibidas.reduce((sum, factura) => sum + factura.total, 0);
    const cuotaIvaRecibidas = facturasRecibidas.reduce((sum, factura) => sum + (factura.baseImponible * factura.tipoIva), 0);

    // Creamos un gráfico de tipo donut para comparar las facturas
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
    // Convertimos los timestamps de Firestore a objetos Date de JavaScript
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
  
    // Creamos un gráfico de línea temporal para mostrar los proyectos iniciados por fecha
    const ctx = document.getElementById('projectTimelineChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: Object.keys(counts), // Fechas únicas
          datasets: [
            {
              label: 'Proyectos Iniciados',
              data: Object.values(counts), // Cantidad de proyectos por fecha
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
