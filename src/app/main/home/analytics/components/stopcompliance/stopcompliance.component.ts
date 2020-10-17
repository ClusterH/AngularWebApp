import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { ClipsService } from 'app/main/home/analytics/services/clips.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface PeriodicElement {
    unit: string;
    driver: string;
    planed: number;
    visited: number;
    percentage: number;
    unauth: number;
    outofroute: number;
}

// const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
    selector: 'app-stopcompliance',
    templateUrl: './stopcompliance.component.html',
    styleUrls: ['./stopcompliance.component.scss'],
    animations: fuseAnimations,
})

export class StopcomplianceComponent implements OnInit, OnDestroy {
    barchart_widget: any = [];
    barchart: any;
    percentage_widget: any = [];
    table_widget: any = [];

    displayedColumns = ['unit', 'driver', 'planed', 'visited', 'percentage', 'unauth', 'outofroute'];
    dataSource = new MatTableDataSource<PeriodicElement>([]);
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private clipsservice: ClipsService
    ) {
        this._unsubscribeAll = new Subject();
        this.clipsservice.clip_RouteCompliance().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            if (res.responseCode == 100) {
                this.barchart_widget = res.TrackingXLAPI.DATA2;
                this.percentage_widget = res.TrackingXLAPI.DATA[0];
                this.table_widget = res.TrackingXLAPI.DATA1;
                this.dataSource = new MatTableDataSource<PeriodicElement>(this.table_widget);
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
                            display: true
                        },
                        maintainAspectRatio: false,
                        scales: {
                            xAxes: [{ stacked: true }],
                            yAxes: [{ stacked: true, ticks: { min: 0, max: 10000 } }]
                        }
                    }
                }
            }
        })
    }

    ngOnInit() {
        this.dataSource.sort = this.sort;
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}