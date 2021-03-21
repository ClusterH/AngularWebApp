import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from "@angular/material/dialog";
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as mapEnglish } from 'app/main/home/maps/i18n/en';
import { locale as mapFrench } from 'app/main/home/maps/i18n/en';
import { locale as mapPortuguese } from 'app/main/home/maps/i18n/en';
import { locale as mapSpanish } from 'app/main/home/maps/i18n/en';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RoutesService } from '../../services';

@Component({
    selector: 'attend-form-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SaveRouteDialogComponent implements OnInit, OnDestroy {
    saveRouteForm: FormGroup;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private routeService: RoutesService,
        public matDialogRef: MatDialogRef<SaveRouteDialogComponent>,
        private _formBuilder: FormBuilder
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(mapEnglish, mapSpanish, mapFrench, mapPortuguese);
    }

    ngOnInit() {
        this.saveRouteForm = this._formBuilder.group({
            name: [null, Validators.required]
        });
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        const name = this.saveRouteForm.get('name').value;
        this.routeService.saveRouteName(name).pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if ((result.responseCode == 200) || (result.responseCode == 100)) {
                    this.matDialogRef.close(result.TrackingXLAPI.DATA[0].id);
                } else {
                    alert("Failed save!");
                    this.matDialogRef.close(0);
                }
            });

    }
}