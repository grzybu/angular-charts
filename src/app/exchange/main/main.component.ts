import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { PickerComponent } from '../picker/picker.component';
import { ExchangeRatesService } from 'src/app/services/exchange-rates.service';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements AfterViewInit {

  public lineChartLabels;
  public lineChartData;

  public dataLoaded: Observable<boolean>;
  @ViewChild(PickerComponent) private picker: PickerComponent;


  public constructor(private exchangeRates: ExchangeRatesService) {
    this.dataLoaded = of(false);
  }

  private currencyCode: string;
  private dateFrom;
  private dateTo;
  title = 'angular-charts';

  public lineChartOptions: any = {
    responsive: true,
    elements: {
      line: {
          tension: 0, // disables bezier curves
      }
  }
  };
  public lineChartColors: Array<any> = [
    {
      borderColor: '#05668D',
      backgroundColor: '#EBF2FA',
      pointBorderColor: '#A5BE00',
      pointBackgroundColor: '#A5BE00',
      pointHoverBackgroundColor: 'rgba(7,91,130)',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartType = 'line';
  public lineChartLegend = true;


  displayChart() {
    this.exchangeRates.getExchangeRates(this.currencyCode, 'PLN', this.dateFrom, this.dateTo).subscribe(
      data => {
        const values = [];
        const labels = [];
        this.lineChartLabels = [];
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
    this.dataLoaded = of(false);
    this.displayChart();
  }

  onDateFromChanged(dateFrom) {
    dateFrom = moment(dateFrom).format('YYYY-MM-DD');
    if (this.dateFrom === dateFrom) {
      return;
    }
    this.dataLoaded = of(false);

    this.dateFrom = dateFrom;
    this.displayChart();
  }

  onDateToChanged(dateTo) {
    dateTo = moment(dateTo).format('YYYY-MM-DD');
    if (this.dateTo === dateTo) {
      return;
    }
    this.dataLoaded = of(false);
    this.dateTo = dateTo;
    this.displayChart();
  }

  ngAfterViewInit() {
     this.dateFrom = this.picker.getDateFrom('YYYY-MM-DD');
     this.dateTo = this.picker.getDateTo('YYYY-MM-DD');
     this.currencyCode = this.picker.currency;

     this.displayChart();
  }
}
