import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';

@Component({
  selector: 'app-polar-chart',
  templateUrl: './polar-chart.component.html',
  styleUrls: ['./polar-chart.component.scss']
})
export class PolarChartComponent implements OnInit {
  product = [];
  polarAreaChartLabel: string[] = [];
  polarAreaChartDatas: number[] = [];
  polarAreaChartLabels: string[] = this.polarAreaChartLabel;
  //   [
  //   'Download Sales',
  //   'In-Store Sales',
  //   'Mail Sales',
  //   'Telesales',
  //   'Corporate Sales',
  //   'Corporate Sales',
  //   'Corporate Sales',
  //   'Corporate Sales',
  //   'Corporate Sales',
  //   'Corporate Sales',
  //   'Corporate Sales',
  //   'Corporate Sales',
  //   'Corporate Sales',
  //   'Corporate Sales',
  //   'Corporate Sales'
  // ];
  polarAreaChartData: number[] = this.polarAreaChartDatas;
    // [300, 500, 100, 40, 120, 12, 23, 34, 45, 56, 66, 77, 88, 99, 66];
  polarAreaLegend = true;

  polarAreaChartType = 'polarArea';
  constructor(private dataService: DataService){}


  ngOnInit() {
    this.dataService.getProducts().subscribe(
      product => {
        this.product = product;
        // this.serials = this.productts.map(prod => prod.serialNo);
        this.polarAreaChartLabel = this.product.map(prod => prod.product);

        this.polarAreaChartDatas = this.product.map(prod => prod.qty);
        console.log('the product ===>', this.product);
        console.log('the product serial no ===>', this.polarAreaChartLabel);

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
