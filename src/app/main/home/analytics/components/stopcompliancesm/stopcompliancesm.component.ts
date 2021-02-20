import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ClipsService } from 'app/main/home/analytics/services/clips.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
        this.clipsservice.clip_mileage('clip_RouteComplianceSM').then(res => {
            this.clipsservice.clip_stopcomplianceSMChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
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
                                backgroundColor: '#42A5F5',
                            }, {
                                type: 'bar',
                                label: 'planned',
                                data: this.barchart_widget.map(bar => bar.planned),
                                backgroundColor: '#D81B60',
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
            });
        });
    }

    ngOnInit() { }
}