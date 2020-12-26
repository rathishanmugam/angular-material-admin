import { Component, OnInit } from '@angular/core';
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
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit {
  product = [];
  // doughnutChartLabel:string[] = [];
  // doughnutChartData:number[] = [];
  doughnutChartLabels: string[] = [
    'Download Sales',
    'In-Store Sales',
    'Mail-Order Sales',
    'Mail-Order Sales',
    'Mail-Order Sales',
    'Mail-Order Sales',
    'Mail-Order Sales',
    'Mail-Order Sales',
    'Mail-Order Sales',
    'Download Sales',
    'Download Sales',
    'Download Sales',
    'Download Sales',
    'Download Sales',
    'Download Sales',
    'Download Sales',

  ];
   doughnutChartData: number[] = [350, 450, 100, 23 , 45, 67, 89, 23, 34, 56, 78,90,87,65,44];

  doughnutChartType = 'doughnut';

  constructor(private dataService: DataService) {}


  ngOnInit() {
    this.dataService.getProducts().subscribe(
      product => {
        this.product = product;
        console.log('the products for chart ====>', this.product);
        // this.serials = this.productts.map(prod => prod.serialNo);
        this.doughnutChartLabels = this.product.map(prod => prod.product);

        this.doughnutChartData = this.product.map(prod => prod.qty);
        console.log('the product ===>', this.product);
        console.log('the product serial no ===>', this.doughnutChartLabels);

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
