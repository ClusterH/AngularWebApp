import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ServiceitemsService } from 'app/main/logistic/maintenance/serviceitems/services/serviceitems.service';
import { ServiceitemsDataSource } from "app/main/logistic/maintenance/serviceitems/services/serviceitems.datasource"
import { ServiceitemDetail } from "app/main/logistic/maintenance/serviceitems/model/serviceitem.model"

import { locale as serviceitemsEnglish } from 'app/main/logistic/maintenance/serviceitems/i18n/en';
import { locale as serviceitemsSpanish } from 'app/main/logistic/maintenance/serviceitems/i18n/sp';
import { locale as serviceitemsFrench } from 'app/main/logistic/maintenance/serviceitems/i18n/fr';
import { locale as serviceitemsPortuguese } from 'app/main/logistic/maintenance/serviceitems/i18n/pt';

@Component({
    selector: 'delete-dialog',
    templateUrl: './deletedialog.component.html',
    styleUrls: ['./deletedialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DeleteDialogComponent {

    serviceitem: ServiceitemDetail;
    flag: any;



    dataSource: ServiceitemsDataSource;
    private flagForDeleting = new BehaviorSubject<boolean>(false);


    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private serviceitemsService: ServiceitemsService,
        private dialogRef: MatDialogRef<DeleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
    ) {


        this._fuseTranslationLoaderService.loadTranslations(serviceitemsEnglish, serviceitemsSpanish, serviceitemsFrench, serviceitemsPortuguese);

        this.serviceitem = _data.serviceDetail;
        this.flag = _data.flag;
    }

    deleteList(): boolean {
        let deletedServiceItem = this.serviceitemsService.serviceitemList.findIndex((index: any) => index.id == this.serviceitem.id);

        if (deletedServiceItem > -1) {
            this.serviceitemsService.serviceitemList.splice(deletedServiceItem, 1);

            return true;
        }
    }

    delete() {
        let result = this.deleteList();

        if (result) {
            this.serviceitemsService.deleteServiceitem(this.serviceitem.id)
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        this.dataSource = new ServiceitemsDataSource(this.serviceitemsService);
                        this.dataSource.serviceitemsSubject.next(this.serviceitemsService.serviceitemList);
                    }
                });
            this.flagForDeleting.next(false);
            this.dialogRef.close(this.serviceitemsService.serviceitemList);
        }
    }

    close() {
        // localStorage.removeItem("serviceitem_detail");
        this.dialogRef.close();
    }
}
