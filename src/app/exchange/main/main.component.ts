import { Component, ViewChild, OnInit } from '@angular/core';
import { PickerComponent } from '../picker/picker.component';
import { ExchangeRatesService } from 'src/app/services/exchange-rates.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public lineChartLabels; // = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartData;

  public dataLoaded: Observable<boolean>;

  public constructor(private exchangeRates: ExchangeRatesService) {
    this.dataLoaded = of(false);
    this.displayChart();
  }
  @ViewChild(PickerComponent) picker;

  currencyCode = 'EUR';
  dateFrom: Date;
  dateTo: Date;
  title = 'angular-charts';

  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { // grey
      borderColor: '#c00',
      backgroundColor: 'transparent',
      pointBorderColor: '#000',
      pointBackgroundColor: '#000',
      pointHoverBackgroundColor: '#000',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartType = 'line';

  displayChart() {
    this.exchangeRates.getExchangeRates(this.currencyCode, 'PLN', '2018-01-01', '2019-03-01').subscribe(
      data => {
        const values = [];
        const labels = [];
        const days = Object.keys(data.rates).sort();
        for (const day of days) {
          labels.push(day);
          values.push(data.rates[day]['PLN']);
        }
        this.lineChartLabels = labels;
        this.lineChartData = [
          { data: values, label: this.currencyCode },
        ];

        this.dataLoaded = of(true);
      }
    );
  }

  onCurrencyChanged($selectedCurrency) {
    this.currencyCode = $selectedCurrency;
    this.displayChart();
  }

  ngOnInit() {
  }

}
