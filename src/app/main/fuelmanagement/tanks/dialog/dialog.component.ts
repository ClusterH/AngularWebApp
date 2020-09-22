import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TanksService } from 'app/main/fuelmanagement/tanks/services/tanks.service';
import { locale as tanksEnglish } from 'app/main/fuelmanagement/tanks/i18n/en';
import { locale as tanksSpanish } from 'app/main/fuelmanagement/tanks/i18n/sp';
import { locale as tanksFrench } from 'app/main/fuelmanagement/tanks/i18n/fr';
import { locale as tanksPortuguese } from 'app/main/fuelmanagement/tanks/i18n/pt';
import { Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'tank-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {
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
        this._fuseTranslationLoaderService.loadTranslations(tanksEnglish, tanksSpanish, tanksFrench, tanksPortuguese);

        this.tank = tank;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if (this.flag == "duplicate") {

            this.tank.id = 0;
            this.tank.name = '';
            this.tank.createdwhen = '';
            this.tank.createdbyname = '';
            this.tank.lastmodifieddate = '';
            this.tank.lastmodifiedbyname = '';

            localStorage.setItem("tank_detail", JSON.stringify(this.tank));



            this.router.navigate(['fuelmanagement/tanks/tanks_detail']);
        } else if (this.flag == "delete") {
            this.tanksService.deleteTank(this.tank.id).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        this.reloadComponent();
                    }
                });
        }

        this.dialogRef.close();
    }

    close() {
        localStorage.removeItem("tank_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("tank_detail");

        this.router.navigate(['fuelmanagement/tanks/tanks']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['fuelmanagement/tanks/tanks']);
    }

}
