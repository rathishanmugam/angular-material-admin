import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';

@Component({
  selector: 'app-polar-chart',
  templateUrl: './polar-chart.component.html',
  styleUrls: ['./polar-chart.component.scss']
})
export class PolarChartComponent implements OnInit {
  product = [];
  // polarAreaChartLabels: string[] = [];
  // polarAreaChartData: number[] = [];
  polarAreaChartLabels: string[] = [
    'Download Sales',
    'In-Store Sales',
    'Mail Sales',
    'Telesales',
    'Corporate Sales',
    'Corporate Sales',
    'Corporate Sales',
    'Corporate Sales',
    'Corporate Sales',
    'Corporate Sales',
    'Corporate Sales',
    'Corporate Sales',
    'Corporate Sales',
    'Corporate Sales',
    'Corporate Sales'
  ];
  polarAreaChartData: number[] = [300, 500, 100, 40, 120, 12, 23, 34, 45, 56, 66, 77, 88, 99, 66];
  polarAreaLegend = true;

  polarAreaChartType = 'polarArea';
  constructor(private dataService: DataService){}


  ngOnInit() {
    this.dataService.getProducts().subscribe(
      product => {
        this.product = product;
        // this.serials = this.productts.map(prod => prod.serialNo);
        this.polarAreaChartLabels = this.product.map(prod => prod.product);

        this.polarAreaChartData = this.product.map(prod => prod.qty);
        console.log('the product ===>', this.product);
        console.log('the product serial no ===>', this.polarAreaChartLabels);

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
