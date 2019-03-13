import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange
} from "@angular/core";
import { of } from "rxjs";

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"]
})
export class ChartComponent implements OnChanges {
  @Input() exchangeData;
  // @Input() dataLoaded;
  @Input() baseCurrency;
  chartDataPrepared;
  currencyCode;

  public lineChartData;

  public lineChartOptions: any = {
    responsive: true,
    elements: {
      line: {
        tension: 0 // disables bezier curves
      }
    }
  };

  public lineChartColors: Array<any> = [
    {
      borderColor: "#05668D",
      backgroundColor: "#EBF2FA",
      pointBorderColor: "#A5BE00",
      pointBackgroundColor: "#A5BE00",
      pointHoverBackgroundColor: "rgba(7,91,130)",
      pointHoverBorderColor: "rgba(148,159,177,0.8)"
    }
  ];

  public lineChartType = "line";
  public lineChartLegend = true;
  public lineChartLabels;

  constructor() {
    this.chartDataPrepared = of(false);
  }

  prepareChartData(data) {
    this.currencyCode = data.base;
    const values = [];
    const labels = [];
    this.lineChartLabels = [];
    const days = Object.keys(data.rates).sort();
    for (const day of days) {
      labels.push(day);
      values.push(data.rates[day][this.baseCurrency]);
    }
    this.lineChartLabels = labels;
    this.lineChartData = [{ data: values, label: this.currencyCode }];
    this.chartDataPrepared = of(true);
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (let propName in changes) {
      let changedProp = changes[propName];

      if (changedProp.isFirstChange()) {
        // do nothing
      } else {
        if (propName === "exchangeData") {
          this.prepareChartData(changedProp.currentValue);
        } else {
          this[propName] = changedProp.currentValue;
        }
      }
    }
  }
}
