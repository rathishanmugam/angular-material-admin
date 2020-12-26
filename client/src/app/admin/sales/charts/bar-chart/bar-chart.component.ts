import {Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';

export interface IChart {
  _id: string;
  customerName: string;
  salesDate: Date;
  product: string;
  productType: string;
  qty: number;
  rate: number;
}

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})

export class BarChartComponent implements OnInit {
  product = [];
  data = [];
  res = [];
  res1 = [];
  label = null;
  full = null;
  month = [];
  // barChartData = [];
  constructor(private dataService: DataService) {
  }

  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  // barChartLabels: string[] = [
  //   '2006',
  //   '2007',
  //   '2008',
  //   '2009',
  //   '2010',
  //   '2011',
  //   '2012'
  // ];
  barChartLabels: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  barChartType = 'bar';
  barChartLegend = true;
  // barChartData: any[] = [
  //   { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  //   { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  // ];
  // barChartData: any[] = this.barChartData;

    barChartData: any[] = [
    {data: [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0], label: 'Sony'},
    {data: [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0], label: 'Samsung'},
    {data: [0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Viedocon'},
    {data: [0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0], label: 'sddsd'},
    {data: [0, 0, 0, 1 , 0, 0, 0, 0, 0, 0, 0, 0], label: 'sddsd'},
    {data: [0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0], label: 'sddsd'},
    {data: [[0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]], label: 'sddsd'},
    {data: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], label: 'sddsd'},
  ];

  ngOnInit() {
    this.dataService.getProduct().subscribe(
      product => {
        this.product = product;
        console.log('TAN BAR CHART PRODUCT ===>', this.product);
           const date = this.product.map(prod => prod.salesDate);
        const dd = date.map(dat => dat.slice(5, 7));
        console.log('THE MONTH =====>', dd);

        const start = this.product.map(prod => prod._id.month);
        const qty = this.product.map(prod => prod.qty);
        const name = this.product.map(prod => prod.product);
        const result = name.map((nam, i) => ({ label: nam }));
        const total = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        // total.forEach(month => {
        //   const item = dd.find(dat => dat === month);
        //    item ? this.data.push(item) : this.data.push(0);
        // })

        // let k = 0;
        //    while (name[k]) {
             for(let k = 0; k < name.length; k++) {
             for (let i = 0; i < total.length; i++) {
               // console.log('the name is===>', dd[k], total[i] );
               if (dd[k] === total[i]) {
                 this.data.push(qty[k]);
               } else {
                 this.data.push(0);
               }
             }
             // console.log('THE MONTH =====>', this.data);
             this.res.push({data: this.data, label: name[k]});
             this.data = [];
             // console.log('THE final loop =====>', this.res);
        }
        console.log('THE final =====>', this.res);
         this.barChartData = this.res;
      });
  }

  chartClicked(e: any): void {
    console.log(e.active);
    console.log(e.event);
  }

  chartHovered(e: any): void {
    console.log(e);
  }
}



