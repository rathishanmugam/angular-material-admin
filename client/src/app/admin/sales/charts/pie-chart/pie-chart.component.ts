import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  product = [];

  pieChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales','Mail Sales','Mail Sales','Mail Sales','Mail Sales','Mail Sales','Mail Sales','Mail Sales','Mail Sales','Mail Sales','Mail Sales'];
  pieChartData: number[] = [300, 500, 100,12,23,34,45,45,56,56,67,78,89];
  pieChartType = 'pie';
  constructor(private dataService: DataService){}


  ngOnInit() {
    this.dataService.getProducts().subscribe(
      product => {
        this.product = product;
        // this.serials = this.productts.map(prod => prod.serialNo);
        this.pieChartLabels = this.product.map(prod => prod.product);

        this.pieChartData = this.product.map(prod => prod.qty);
        console.log('the product ===>', this.product);
        console.log('the product serial no ===>', this.pieChartLabels);

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
