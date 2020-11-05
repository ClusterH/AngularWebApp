import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';
import { locale as vehiclesEnglish } from 'app/main/home/analytics/i18n/en';
import { locale as vehiclesFrench } from 'app/main/home/analytics/i18n/fr';
import { locale as vehiclesPortuguese } from 'app/main/home/analytics/i18n/pt';
import { locale as vehiclesSpanish } from 'app/main/home/analytics/i18n/sp';

import { ClipsService } from 'app/main/home/analytics/services/clips.service';
import { Subject } from 'rxjs';

export interface PeriodicElement {
    name: string;
    distance: number;
    distanceunits: string;
    from: string;
    to: string;
}
@Component({
    selector: 'clip-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class CourseDialogComponent implements OnInit, OnDestroy {
    detail: any; flag: any;
    displayedColumns = ['name', 'distance', 'distanceunits', 'from', 'to'];
    dataSource = new MatTableDataSource<PeriodicElement>([]);
    private _unsubscribeAll: Subject<any>;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private clipService: ClipsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { detail, flag }
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(vehiclesEnglish, vehiclesSpanish, vehiclesFrench, vehiclesPortuguese);
        this.dataSource = new MatTableDataSource<PeriodicElement>(detail);
        this.flag = flag;
    }
    ngOnInit(): void {
        setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }, 1000)
    }

    ngAfterViewInit() {

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    close() { this.dialogRef.close('save'); }
    goback() { this.dialogRef.close('cancel'); }
}