import { Component, OnInit, ViewEncapsulation, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, Observable } from 'rxjs';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

import { TankDetail } from 'app/main/fuelmanagement/tanks/model/tank.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { TankDetailService } from 'app/main/fuelmanagement/tanks/services/tank_detail.service';

import { locale as tanksEnglish } from 'app/main/fuelmanagement/tanks/i18n/en';
import { locale as tanksSpanish } from 'app/main/fuelmanagement/tanks/i18n/sp';
import { locale as tanksFrench } from 'app/main/fuelmanagement/tanks/i18n/fr';
import { locale as tanksPortuguese } from 'app/main/fuelmanagement/tanks/i18n/pt';

@Component({
    selector: 'fuelmanagement-tank-detail',
    templateUrl: './tank_detail.component.html',
    styleUrls: ['./tank_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})

export class TankDetailComponent implements OnInit
{
    tank_detail: any;
    public tank: any;
    pageType: string;
    userConncode: string;
    userID: number;

    tankForm: FormGroup;
    tankDetail: TankDetail = {};

    displayedColumns: string[] = ['name'];
 
    filter_string: string = '';
    method_string: string = '';

    chart_data: any = [];

    dateOption = 'today';
    noData: boolean = true;

    fromDate: string = '';
    toDate: string = '';
    
    constructor(
        public tankDetailService: TankDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private zone: NgZone,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
    ) {
        this._fuseTranslationLoaderService.loadTranslations(tanksEnglish, tanksSpanish, tanksFrench, tanksPortuguese);

        this.tank = localStorage.getItem("tank_detail")? JSON.parse(localStorage.getItem("tank_detail")) : '';

        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

        if ( this.tank != '' )
        {
            this.pageType = 'edit';
            this.getTankHistory('today');
        }
        else
        {
            console.log(this.tank);
            this.pageType = 'new';
        }

        this.filter_string = '';
    }

    ngOnInit(): void {
        console.log(this.tank);
        this.tankForm = this._formBuilder.group({
            date: [null],
        });
    }

    generateChartData(chart_data: any) {
        console.log("generateChartData: ", chart_data);
        let chartData = [];
        
        for (let i in chart_data) {
            // let truetime = new Date(chart_data[i].truetime);
            // console.log((truetime.getDate() - 11));

            chartData.push({
                date:  new Date(chart_data[i].truetime),
                level: chart_data[i].volume
            });
        }
        console.log(chartData);

        am4core.ready(() => {

            am4core.disposeAllCharts();

            let chart = am4core.create("chartdiv", am4charts.XYChart);
      
            // Add data
            chart.data = chartData;
    
            // Create axes
            let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.minGridDistance = 50;
            // dateAxis.renderer.grid.template.disabled = true;
            // dateAxis.renderer.fullWidthTooltip = true;
    
            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            // valueAxis.renderer.minGridDistance = 0.01;
            // dateAxis.renderer.grid.template.disabled = true;
            // dateAxis.renderer.fullWidthTooltip = true;
            // valueAxis.adjustMinMax(0, 10000, 100, 100, true);
            // valueAxis.strictMinMax = true;
            
            // Create series
            let series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "level";
            series.dataFields.dateX = "date";
            series.strokeWidth = 2;
            series.minBulletDistance = 1;
            series.tooltipText = "{valueY}";
            series.tooltip.pointerOrientation = "vertical";
            series.tooltip.background.cornerRadius = 20;
            series.tooltip.background.fillOpacity = 0.5;
            series.tooltip.label.padding(12,12,12,12);
    
            // Add scrollbar
            let scrollbarX = new am4charts.XYChartScrollbar();
            scrollbarX.series.push(series);
            chart.scrollbarX = scrollbarX;
            // chart.scrollbarY = scrollbarX;
            // Add cursor
            chart.cursor = new am4charts.XYCursor();
            chart.cursor.xAxis = dateAxis;
            chart.cursor.snapToSeries = series;
            // return chartData;
        });
    }

    getValues(dateTime: any, mode: string) {
        this.tankDetail.name             = this.tankForm.get('name').value || '',
        this.tankDetail.isactive         = this.tank.isactive || true;
        // this.tankDetail.deletedwhen      = this.tank.deletedwhen || '';
        // this.tankDetail.deletedby        = this.tank.deletedby || 0;

        if( mode  == "save" ) {
            this.tankDetail.id               = this.tank.id;
            this.tankDetail.createdwhen      = this.tank.createdwhen;
            this.tankDetail.createdby        = this.tank.createdby;
            this.tankDetail.lastmodifieddate = dateTime;
            this.tankDetail.lastmodifiedby   = this.userID;
        } else if ( mode == "add" ) {
            this.tankDetail.id               = 0;
            this.tankDetail.createdwhen      = dateTime;
            this.tankDetail.createdby        = this.userID;
            this.tankDetail.lastmodifieddate = dateTime;
            this.tankDetail.lastmodifiedby   = this.userID;
        }
        
    }

    dateFormat(date: any) {
        console.log(date);

        let str = '';

        console.log(date.getHours())

        if (date != '') {
            str = 
                ("00" + (date.getMonth() + 1)).slice(-2) 
                + "/" + ("00" + date.getDate()).slice(-2) 
                + "/" + date.getFullYear();

                if (date.getHours() < 12) {
                    str = str  + " " 
                    + ("00" + date.getHours()).slice(-2) + ":" 
                    + ("00" + date.getMinutes()).slice(-2) 
                    + ":" + ("00" + date.getSeconds()).slice(-2) + " " + 'AM'; 
                } else {
                    str = str + " "
                    + (date.getHours() - 12) + ":" 
                    + ("00" + date.getMinutes()).slice(-2) 
                    + ":" + ("00" + date.getSeconds()).slice(-2) + " " + 'PM'; 
                }
               
        }

        return str;
    }
    
    saveTank(): void {
        console.log("saveTank");
        let today = new Date().toISOString();
        this.getValues(today, "save");
        console.log(this.tankDetail);

        if (this.tankDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.tankDetailService.saveTankDetail(this.userConncode, this.userID, this.tankDetail)
            .subscribe((result: any) => {
                console.log(result);
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    alert("Success!");
                    this.router.navigate(['admin/tanks/tanks']);
                }
            });
        }
    }

    addTank(): void {
        console.log("addTank");
        let today = new Date().toISOString();
        this.getValues(today, "add");
        console.log(this.tankDetail);

        if (this.tankDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.tankDetailService.saveTankDetail(this.userConncode, this.userID, this.tankDetail)
            .subscribe((result: any) => {
                console.log(result);
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    alert("Success!");
                    this.router.navigate(['admin/tanks/tanks']);
                }
            });
        }
    }

    goBackUnit() {
        const dialogConfig = new MatDialogConfig();
        let flag = 'goback';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            tank: "", flag: flag
        };

        dialogConfig.disableClose = false;

        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if ( result )
            { 
                    console.log(result);

            } else {
                    console.log("FAIL:", result);
            }
        });
    }

    private _registerCustomChartJSPlugin(): void
    {
        (window as any).Chart.plugins.register({
            afterDatasetsDraw: function(chart, easing): any {
                // Only activate the plugin if it's made available
                // in the options
                if (
                    !chart.options.plugins.xLabelsOnTop ||
                    (chart.options.plugins.xLabelsOnTop && chart.options.plugins.xLabelsOnTop.active === false)
                )
                {
                    return;
                }

                // To only draw at the end of animation, check for easing === 1
                const ctx = chart.ctx;

                chart.data.datasets.forEach(function(dataset, i): any {
                    const meta = chart.getDatasetMeta(i);
                    if ( !meta.hidden )
                    {
                        meta.data.forEach(function(element, index): any {

                            // Draw the text in black, with the specified font
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                            const fontSize = 13;
                            const fontStyle = 'normal';
                            const fontFamily = 'Roboto, Helvetica Neue, Arial';
                            ctx.font = (window as any).Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                            // Just naively convert to string for now
                            const dataString = dataset.data[index].toString();

                            // Make sure alignment settings are correct
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            const padding = 15;
                            const startY = 24;
                            const position = element.tooltipPosition();
                            ctx.fillText(dataString, position.x, startY);

                            ctx.save();

                            ctx.beginPath();
                            ctx.setLineDash([5, 3]);
                            ctx.moveTo(position.x, startY + padding);
                            ctx.lineTo(position.x, position.y - padding);
                            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
                            ctx.stroke();

                            ctx.restore();
                        });
                    }
                });
            }
        });
    }

    getTankHistory(date: any) {
        let fromdate: string;
        let todate: string;

        let data: [];
        // let subject = new Subject<any>();

        if (date == 'today') {
            let todayDate = new Date();
            todayDate.setDate(todayDate.getDate() - 10);

            todate = this.dateFormat(todayDate);
            // todate = this.dateFormat(todayDate).substr(0, 10) + " " + '00:10:00 AM'
            fromdate = todate.substr(0, 10) + " " + '00:00:00 AM';

            this.dateOption = 'today';

            this.getHistoryData(date, fromdate, todate)
            .subscribe((res: any) => {
                this.generateChartData(res);
            });

            console.log(data);
        } else if (date == 'yesterday') {
            let yesterdayDate = new Date();

            yesterdayDate.setDate(yesterdayDate.getDate() - 8);

            todate = this.dateFormat(yesterdayDate);
            fromdate = todate.substr(0, 10) + " " + '00:00:00 AM';

            this.dateOption = 'yesterday';

            this.getHistoryData(date, fromdate, todate)
            .subscribe((res: any) => {
                this.generateChartData(res);
            });

        } else if (date == 'this_week') {
            let curr = new Date; // get current date
            let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
            let last = first + 6; // last day is the first day + 6

            fromdate = this.dateFormat(new Date(curr.setDate(first)));
            todate = this.dateFormat(new Date(curr.setDate(last)));

            this.dateOption = 'this_week';

            this.getHistoryData(date, fromdate, todate)
            .subscribe((res: any) => {
                this.generateChartData(res);
            });

        } else if (date == 'last_week') {
            let curr = new Date; // get current date
            let first = curr.getDate() - curr.getDay() - 7; // First day is the day of the month - the day of the week
            let last = first + 6; // last day is the first day + 6

            fromdate = this.dateFormat(new Date(curr.setDate(first)));
            todate = this.dateFormat(new Date(curr.setDate(last)));

            this.dateOption = 'last_week';

             this.getHistoryData(date, fromdate, todate)
            .subscribe((res: any) => {
                this.generateChartData(res);
            });

        } else if (date == 'date_range') {
            this.dateOption = 'date_range';

            this.getHistoryData(date, this.fromDate, this.toDate)
            .subscribe((res: any) => {
                this.generateChartData(res);
            });
        }

    }

    getHistoryData(dateOption: string, fromdate: string, todate: string): Observable<any> {
        let volume_data: [];
        let subject = new Subject<any>();
        
        this.tankDetailService.getTankHistory(this.userConncode, this.userID, this.tank.id, fromdate, todate)
        .subscribe((res: any) => {
            console.log(res);
            if (res.responseCode == 100) {
                this.noData = true;

                volume_data = res.TrackingXLAPI.DATA;
                console.log(volume_data);
                subject.next(volume_data);
               
            } else {
                this.noData = false;
            }
        });

        return subject.asObservable();
    }

    rangeChange($event) {
        this.fromDate = $event.value.begin.toISOString();
        this.toDate = $event.value.end.toISOString();

        this.getTankHistory('date_range');

    }
}
