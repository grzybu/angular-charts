import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { MainComponent } from './exchange/main/main.component';
import { PickerComponent } from './exchange/picker/picker.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyMaterialModule } from './my-material.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { ChartComponent } from './exchange/chart/chart.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    PickerComponent,
    HomeComponent,
    ChartComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ChartsModule,
    BrowserAnimationsModule,
    MyMaterialModule,
    CommonModule,
    AppRoutingModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
