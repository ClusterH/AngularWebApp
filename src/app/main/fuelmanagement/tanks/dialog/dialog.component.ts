import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as tanksEnglish } from 'app/main/fuelmanagement/tanks/i18n/en';
import { locale as tanksFrench } from 'app/main/fuelmanagement/tanks/i18n/fr';
import { locale as tanksPortuguese } from 'app/main/fuelmanagement/tanks/i18n/pt';
import { locale as tanksSpanish } from 'app/main/fuelmanagement/tanks/i18n/sp';
import { TanksService } from 'app/main/fuelmanagement/tanks/services/tanks.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'tank-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    private _unsubscribeAll: Subject<any>;
    tank: any;
    flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private tanksService: TanksService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { tank, flag }
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(tanksEnglish, tanksSpanish, tanksFrench, tanksPortuguese);
        this.tank = tank;
        this.flag = flag;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.tank.id = 0;
            this.tank.name = '';
            this.tank.createdwhen = '';
            this.tank.createdbyname = '';
            this.tank.lastmodifieddate = '';
            this.tank.lastmodifiedbyname = '';
            this.dialogRef.close(this.tank);
        } else if (this.flag == "delete") {
            this.tanksService.deleteTank(this.tank.id).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        this.dialogRef.close(result);
                    }
                });
        }
    }

    close() { this.dialogRef.close(); }
    goback() { this.dialogRef.close('goback'); }
}