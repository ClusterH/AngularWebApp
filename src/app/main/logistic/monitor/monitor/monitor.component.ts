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
    resizedWidthPercent: number = 50;
    tripWatchData: any[] = [];

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

    showInMapEmitter(event): void {
        this.tripWatchData = event;
    }

    formatDate(date) {
        return date.toString().slice(4, 15);
    }
}