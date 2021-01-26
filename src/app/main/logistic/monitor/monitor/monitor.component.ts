import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { SplitComponent, SplitAreaDirective } from 'angular-split';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as monitorEnglish } from 'app/main/logistic/monitor/i18n/en';
import { locale as monitorFrench } from 'app/main/logistic/monitor/i18n/fr';
import { locale as monitorPortuguese } from 'app/main/logistic/monitor/i18n/pt';
import { locale as monitorSpanish } from 'app/main/logistic/monitor/i18n/sp';
import { MonitorService } from 'app/main/logistic/monitor/services/monitor.service';
import { isEmpty } from 'lodash';
import { PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
    selector: 'logistic-monitor',
    templateUrl: './monitor.component.html',
    styleUrls: ['./monitor.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitorComponent implements OnInit, OnDestroy {
    sizes = {
        percent: {
            tableListArea: 50,
            mapArea: 50
        }
    }

    currentUser: any;
    restrictValue: any;

    resizedWidthPercent: number = 50;
    isDrag: boolean = false;
    isRoute: boolean = false;
    isVehicleTrack: boolean = false;
    isUnAuthorized: boolean = false;
    isOffRoute: boolean = false;
    unPlannedStopsList: Array<any> = [];
    dialogRef: any;

    private _unsubscribeAll: Subject<any>;

    constructor(
        public monitorService: MonitorService,
        private primengConfig: PrimeNGConfig,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _fuseConfigService: FuseConfigService,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(monitorEnglish, monitorSpanish, monitorFrench, monitorPortuguese);

        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    folded: true
                }
            }
        };


    }

    ngOnInit(): void {

        // window.addEventListener('click', (event) => {
        //     this.menuContentManage(event);
        // });
    }

    ngAfterViewInit() {
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    dragEnd({ sizes }) {
        this.sizes.percent.tableListArea = sizes[0];
        this.sizes.percent.mapArea = sizes[1];
    }



    // menuContentManage(event): void {
    //     if (!event.target.matches('.menu_content') && !event.target.matches('.show_commandBtn')) {
    //

    //         this.dataSource.map(item => {
    //             item.isShowCommand = false;
    //             return item
    //         });

    //
    //         setTimeout(() => {
    //             this.monitor$ = of(this.dataSource);
    //         }, 1000)
    //     }
    // }


    // isCheckRoute() {
    //     if (isEmpty(this.selectedMonitor)) {
    //         this.isRoute = false;
    //         this.isOffRoute = false;
    //         this.isVehicleTrack = false;
    //         this.isUnAuthorized = false;

    //         this.lat = 25.7959;
    //         this.lng = -80.2871;
    //         this.zoom = 12;

    //         this.boundControl(this.zoom, this.lat, this.lng);

    //         return;
    //     } else {
    //         this.isRoute = true;
    //     }
    // }

    // onDateSelect(value) {

    //     this.isRoute = false;
    //     this.getTrips();
    // }

    formatDate(date) {
        return date.toString().slice(4, 15);
    }



}