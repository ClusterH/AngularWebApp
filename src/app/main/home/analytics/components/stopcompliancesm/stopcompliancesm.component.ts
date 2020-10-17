import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { ClipsService } from 'app/main/home/analytics/services/clips.service';
import { merge, Subject, BehaviorSubject, Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

// const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
    selector: 'app-stopcompliancesm',
    templateUrl: './stopcompliancesm.component.html',
    styleUrls: ['./stopcompliancesm.component.scss'],
    animations: fuseAnimations,
})

export class StopcomplianceSMComponent implements OnInit {
    barchart_widget: any = [];
    barchart: any;
    percentage_widget: any = [];
    table_widget: any = [];
    private _unsubscribeAll: Subject<any>;
    constructor(
        private clipsservice: ClipsService
    ) {
        this._unsubscribeAll = new Subject();
        this.clipsservice.clip_RouteCompliance().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            if (res.responseCode == 100) {
                this.barchart_widget = res.TrackingXLAPI.DATA2;
                this.percentage_widget = res.TrackingXLAPI.DATA[0];
                this.barchart = {
                    type: 'bar',
                    data: {
                        labels: this.barchart_widget.map(bar => bar.label),
                        datasets: [{
                            type: 'bar',
                            label: 'visited',
                            data: this.barchart_widget.map(bar => bar.visited),
                            backgroundColor: 'blue',
                        }, {
                            type: 'bar',
                            label: 'planned',
                            data: this.barchart_widget.map(bar => bar.planned),
                            backgroundColor: 'red',
                        }]
                    },
                    options: {
                        spanGaps: false,
                        legend: {
                            display: false
                        },
                        maintainAspectRatio: false,
                        scales: {
                            xAxes: [{ display: false, stacked: true }],
                            yAxes: [{ display: false, stacked: true, ticks: { min: 0, max: 10000 } }]
                        }
                    }
                }
            }
        })
    }

    ngOnInit() { }
}