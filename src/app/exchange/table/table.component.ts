import { Component, OnInit, Input, SimpleChange, OnChanges, ViewChild, AfterViewInit } from '@angular/core';
import { of } from 'rxjs';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { HistoryDataItem } from '../main/main.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnChanges {

  @Input() exchangeData;
  @Input() baseCurrency;
  tableDataPrepared;
  currencyCode;

  @ViewChild(MatPaginator) pagintator: MatPaginator;

  public tableDataSource: MatTableDataSource<HistoryDataItem>;
  public readonly tableColumns = ['position', 'date', 'value'];

  constructor() {
  }
  prepareTableData(data) {
    const days = Object.keys(data.rates).sort();
    let index = 0;
    const tableRows = [];
    for (const day of days) {
      tableRows.push(
        {
          position: ++index, date: day, value: data.rates[day][this.baseCurrency]
        }
      );
    }
    this.tableDataSource = new MatTableDataSource<HistoryDataItem>(tableRows);
    if (this.pagintator) {
      this.tableDataSource.paginator = this.pagintator;

    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (let propName in changes) {
      let changedProp = changes[propName];

      if (changedProp.isFirstChange()) {
        // do nothing
      } else {
        if (propName === 'exchangeData') {
          this.prepareTableData(changedProp.currentValue);
        } else {
          this[propName] = changedProp.currentValue;
        }
      }
    }
  }
}
