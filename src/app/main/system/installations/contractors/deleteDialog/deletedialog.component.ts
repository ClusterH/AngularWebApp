import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as contractorsEnglish } from 'app/main/system/installations/contractors/i18n/en';
import { locale as contractorsFrench } from 'app/main/system/installations/contractors/i18n/fr';
import { locale as contractorsPortuguese } from 'app/main/system/installations/contractors/i18n/pt';
import { locale as contractorsSpanish } from 'app/main/system/installations/contractors/i18n/sp';
import { ContractorDetail } from "app/main/system/installations/contractors/model/contractor.model";
import { ContractorsDataSource } from "app/main/system/installations/contractors/services/contractors.datasource";
import { ContractorsService } from 'app/main/system/installations/contractors/services/contractors.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'delete-dialog',
    templateUrl: './deletedialog.component.html',
    styleUrls: ['./deletedialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DeleteDialogComponent {
    contractor: ContractorDetail;
    flag: any;
    dataSource: ContractorsDataSource;
    private flagForDeleting = new BehaviorSubject<boolean>(false);
    private _unsubscribeAll: Subject<any>;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private contractorsService: ContractorsService,
        private dialogRef: MatDialogRef<DeleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(contractorsEnglish, contractorsSpanish, contractorsFrench, contractorsPortuguese);
        this.contractor = _data.serviceDetail;
        this.flag = _data.flag;
    }

    deleteList(): boolean {
        let deletedContractor = this.contractorsService.contractorList.findIndex((index: any) => index.id == this.contractor.id);
        if (deletedContractor > -1) {
            this.contractorsService.contractorList.splice(deletedContractor, 1);
            return true;
        }
    }

    delete() {
        let result = this.deleteList();
        if (result) {
            this.contractorsService.deleteContractor(this.contractor.id).pipe(takeUntil(this._unsubscribeAll)).subscribe((result: any) => {
                if ((result.responseCode == 200) || (result.responseCode == 100)) {
                    this.dataSource = new ContractorsDataSource(this.contractorsService);
                    this.dataSource.contractorsSubject.next(this.contractorsService.contractorList);
                }
            });
            this.flagForDeleting.next(false);
            this.dialogRef.close(this.contractorsService.contractorList);
        }
    }

    close() {
        this.dialogRef.close();
    }
}