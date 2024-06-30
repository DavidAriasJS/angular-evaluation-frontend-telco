import { Component, OnDestroy, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { BookService } from '../../services/book.service';
import { AuthorService } from '../../services/author.service';
import { Book } from '../../interfaces/book.interface';
import { Author } from '../../interfaces/author.model';
import { Subscription, interval, switchMap } from 'rxjs';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public barChartOptions: EChartsOption = {};
  public pieChartOptionsPublished: EChartsOption = {};
  public pieChartOptionsGender: EChartsOption = {};
  
  public lineChartOptions: EChartsOption = {};
  private dataSubscription: Subscription | null = null;
  private data: { time: string, value: number }[] = [];
  private simulationSubscription: Subscription | null = null;

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.loadCharts();
    this.initializeChart();
    this.loadData();
    this.startSimulation();
  }


  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  loadData(): void {
    const savedData = this.dataService.getData('chartData');
      if (savedData) {
        this.data = savedData;
        this.updateChart({ time: '', value: 0 });
      }
  }

  initializeChart(): void {
    this.lineChartOptions = {
      title: {
        text: 'Control de registro de Libros',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [],
        type: 'line',
        smooth: true,
        areaStyle: {}
      }],
      dataZoom: [
        {
          type: 'slider',
          start: 0,
          end: 100
        },
        {
          type: 'inside',
          start: 0,
          end: 100
        }
      ],
      animation: true
    };
  }

  updateChart(data: { time: string, value: number }): void {
    this.data.push(data);
    this.dataService.saveData('chartData', this.data);

    // Eliminar datos más antiguos que 2 horas
    const now = new Date();
    this.data = this.data.filter(d => (new Date(d.time)).getTime() > now.getTime() - 2 * 60 * 60 * 1000);

    const updatedXAxisData = this.data.map(d => d.time);
    const updatedSeriesData = this.data.map(d => d.value);

    console.log('updatedXAxisData:', updatedXAxisData);
    console.log('updatedSeriesData:', updatedSeriesData);

    if (this.lineChartOptions.xAxis && !Array.isArray(this.lineChartOptions.xAxis)) {
      (this.lineChartOptions.xAxis as any).data = updatedXAxisData;
    }

    if (this.lineChartOptions.series && Array.isArray(this.lineChartOptions.series)) {
      (this.lineChartOptions.series[0] as any).data = updatedSeriesData;
    }

    this.lineChartOptions = { ...this.lineChartOptions };
  }

  loadCharts(): void {
    this.bookService.getBooks().subscribe(books => {
      this.setBarChartOptions(books);
      this.setPieChartOptionsPublished(books);      
    });
    this.authorService.getAuthors().subscribe(authors => {
      this.setPieChartOptionsGender(authors);
    });
  }

  setBarChartOptions(books: Book[]): void {
    const years = [...new Set(books.map(book => book.year))];
    const counts = years.map(year => books.filter(book => book.year === year).length);

    this.barChartOptions = {
      title: {
        text: 'Libros por Año',
        left: 'center',
        top: '10px'
      },
      grid: {
        top: '60px',
        bottom: '30px'
      },
      xAxis: {
        type: 'category',
        data: years
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: counts,
        type: 'bar'
      }]
    };
  }

  setPieChartOptionsPublished(books: Book[]): void {
    const publishedBooks = books.filter(book => book.published).length;
    const unpublishedBooks = books.length - publishedBooks;

    this.pieChartOptionsPublished = {
      title: {
        text: 'Libros Publicados',
        left: 'center',
        top: '2px'
      },
      legend: {
        top: '28px'
      },
      series: [{
        type: 'pie',
        data: [
          { value: publishedBooks, name: 'Publicados' },
          { value: unpublishedBooks, name: 'No publicados' }
        ]
      }]
    };
  }

  setPieChartOptionsGender(authors: Author[]): void {
    const maleAuthors = authors.filter(author => author.gender === 'male').length;
    const femaleAuthors = authors.filter(author => author.gender === 'female').length;

    this.pieChartOptionsGender = {
      title: {
        text: 'Género de Autores',
        left: 'center',
        top: '2px'
      },
      legend: {
        top: '28px'
      },
      series: [{
        type: 'pie',
        data: [
          { value: maleAuthors, name: 'Masculino' },
          { value: femaleAuthors, name: 'Femenino' }
        ]
      }]
    };
  }

  startSimulation(): void {
    this.simulationSubscription = interval(5000).pipe(
      switchMap( async () => this.generateRandomData())
    ).subscribe(data => {
      this.updateChart(data);
    });
  }

  generateRandomData(): { time: string, value: number } {
    const now = new Date();
    const time = now.toISOString();
    const value = Math.floor(Math.random() * (12000 - 4000 + 1)) + 4000;

    return { time, value };
  }

}
