import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as assetsEnglish } from 'app/main/admin/assets/i18n/en';
import { locale as assetsFrench } from 'app/main/admin/assets/i18n/fr';
import { locale as assetsPortuguese } from 'app/main/admin/assets/i18n/pt';
import { locale as assetsSpanish } from 'app/main/admin/assets/i18n/sp';
import { AssetsService } from 'app/main/admin/assets/services/assets.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'asset-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    asset: any;
    flag: any;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private assetsService: AssetsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { asset, flag }
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(assetsEnglish, assetsSpanish, assetsFrench, assetsPortuguese);
        this.asset = asset;
        this.flag = flag;
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.asset.id = 0;
            this.asset.name = '';
            this.asset.created = '';
            this.asset.createdbyname = '';
            this.asset.deletedwhen = '';
            this.asset.deletedbyname = '';
            this.asset.lastmodifieddate = '';
            this.asset.lastmodifiedbyname = '';
            this.dialogRef.close(this.asset);
        } else if (this.flag == "delete") {
            this.assetsService.deleteAsset(this.asset.id).pipe(takeUntil(this._unsubscribeAll))
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