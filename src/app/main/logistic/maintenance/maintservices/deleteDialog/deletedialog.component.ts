import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MaintservicesService } from 'app/main/logistic/maintenance/maintservices/services/maintservices.service';
import { MaintservicesDataSource } from "app/main/logistic/maintenance/maintservices/services/maintservices.datasource"
import { MaintserviceDetail } from "app/main/logistic/maintenance/maintservices/model/maintservice.model"

import { locale as maintservicesEnglish } from 'app/main/logistic/maintenance/maintservices/i18n/en';
import { locale as maintservicesSpanish } from 'app/main/logistic/maintenance/maintservices/i18n/sp';
import { locale as maintservicesFrench } from 'app/main/logistic/maintenance/maintservices/i18n/fr';
import { locale as maintservicesPortuguese } from 'app/main/logistic/maintenance/maintservices/i18n/pt';

@Component({
    selector: 'delete-dialog',
    templateUrl: './deletedialog.component.html',
    styleUrls: ['./deletedialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DeleteDialogComponent {

    maintservice: MaintserviceDetail;
    flag: any;

    userConncode: string;
    userID: number;

    dataSource: MaintservicesDataSource;
    private flagForDeleting = new BehaviorSubject<boolean>(false);


    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private maintservicesService: MaintservicesService,
        private dialogRef: MatDialogRef<DeleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any, 
    ) {
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

        this._fuseTranslationLoaderService.loadTranslations(maintservicesEnglish, maintservicesSpanish, maintservicesFrench, maintservicesPortuguese);

        this.maintservice = _data.serviceDetail;
        this.flag = _data.flag;
    }

    deleteList(): boolean {
        let deletedMaintservice = this.maintservicesService.maintserviceList.findIndex((index: any) => index.id == this.maintservice.id);
      
        if (deletedMaintservice > -1) {
            this.maintservicesService.maintserviceList.splice(deletedMaintservice, 1);

            return true;
        }
    }
    
    delete() {
        let result = this.deleteList();

        if (result) {
            this.maintservicesService.deleteMaintservice(this.maintservice.id)
            .subscribe((result: any) => {
                console.log(result);
                
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    this.dataSource = new MaintservicesDataSource(this.maintservicesService);
                    this.dataSource.maintservicesSubject.next(this.maintservicesService.maintserviceList);
                }
            });
            this.flagForDeleting.next(false);
            this.dialogRef.close(this.maintservicesService.maintserviceList);
        }
    }

    close() {
        // localStorage.removeItem("maintservice_detail");
        this.dialogRef.close();
    }
}
