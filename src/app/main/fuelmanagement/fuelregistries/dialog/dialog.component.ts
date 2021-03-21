import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as fuelregistriesEnglish } from 'app/main/fuelmanagement/fuelregistries/i18n/en';
import { locale as fuelregistriesFrench } from 'app/main/fuelmanagement/fuelregistries/i18n/fr';
import { locale as fuelregistriesPortuguese } from 'app/main/fuelmanagement/fuelregistries/i18n/pt';
import { locale as fuelregistriesSpanish } from 'app/main/fuelmanagement/fuelregistries/i18n/sp';
import { FuelregistriesService } from 'app/main/fuelmanagement/fuelregistries/services/fuelregistries.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'fuelregistry-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class FuelRegisterDialogComponent implements OnDestroy {
    private _unsubscribeAll: Subject<any>;
    fuelregistry: any;
    flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private fuelregistriesService: FuelregistriesService,
        private dialogRef: MatDialogRef<FuelRegisterDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { fuelregistry, flag }
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(fuelregistriesEnglish, fuelregistriesSpanish, fuelregistriesFrench, fuelregistriesPortuguese);
        this.fuelregistry = fuelregistry;
        this.flag = flag;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.fuelregistry.id = 0;
            this.fuelregistry.datentime = '';
            this.dialogRef.close();
        } else if (this.flag == "delete") {
            this.fuelregistriesService.deleteFuelregistry(this.fuelregistry.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                if ((res.responseCode == 200) || (res.responseCode == 100)) {
                    this.dialogRef.close(res);
                }
            })
        }
    }

    close() { this.dialogRef.close(); }
    goback() { this.dialogRef.close('goback'); }
}