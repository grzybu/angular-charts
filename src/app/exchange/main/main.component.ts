import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { PickerComponent } from '../picker/picker.component';
import { ExchangeRatesService } from 'src/app/services/exchange-rates.service';
import { Observable, of } from 'rxjs';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ChartComponent } from '../chart/chart.component';


export interface HistoryDataItem {
  position: number;
  date: string;
  value: number;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements AfterViewInit, OnInit {

  public readonly baseCurrency = 'PLN';

  public dataLoaded: Observable<boolean>;
  @ViewChild(PickerComponent) private picker: PickerComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(ChartComponent) private chart: ChartComponent;

  public constructor(private exchangeRates: ExchangeRatesService) {
    this.dataLoaded = of(false);
  }

  public currencyCode: string;
  private dateFrom;
  private dateTo;
  title = 'angular-charts';

  exchangeData;

 
  public tableDataSource: MatTableDataSource<HistoryDataItem>;
  public readonly tableColumns = ['position', 'date', 'value'];

  prepareData() {
    this.exchangeRates.getExchangeRates(this.currencyCode, this.baseCurrency, this.dateFrom, this.dateTo).subscribe(
      data => {
        this.exchangeData = data;
        const values = [];
        const labels = [];
        const days = Object.keys(data.rates).sort();
        let index = 0;
        const tableRows = [];
        for (const day of days) {
          labels.push(day);
          values.push(data.rates[day][this.baseCurrency]);
          tableRows.push(
            {
              position: ++index, date: day, value: data.rates[day][this.baseCurrency]
            }
          );
        }
        this.tableDataSource = new MatTableDataSource<HistoryDataItem>(tableRows);
        this.tableDataSource.paginator = this.paginator;
        this.dataLoaded = of(true);
      }
    );
  }
  onCurrencyChanged($selectedCurrency) {
    this.currencyCode = $selectedCurrency;
    this.dataLoaded = of(false);
    this.prepareData();
  }

  onDateFromChanged(dateFrom) {
    dateFrom = dateFrom.format('YYYY-MM-DD');
    if (this.dateFrom === dateFrom) {
      return;
    }
    this.dataLoaded = of(false);

    this.dateFrom = dateFrom;
    this.prepareData();
  }

  onDateToChanged(dateTo) {
    dateTo = dateTo.format('YYYY-MM-DD');
    if (this.dateTo === dateTo) {
      return;
    }
    this.dataLoaded = of(false);
    this.dateTo = dateTo;
    this.prepareData();
  }

  ngAfterViewInit() {
     this.dateFrom = this.picker.getDateFrom('YYYY-MM-DD');
     this.dateTo = this.picker.getDateTo('YYYY-MM-DD');
     this.currencyCode = this.picker.currency;
     this.prepareData();
  }

  ngOnInit() {
  }
}
