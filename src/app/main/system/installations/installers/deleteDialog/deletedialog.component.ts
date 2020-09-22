import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { InstallersService } from 'app/main/system/installations/installers/services/installers.service';
import { InstallersDataSource } from "app/main/system/installations/installers/services/installers.datasource"
import { InstallerDetail } from "app/main/system/installations/installers/model/installer.model"

import { locale as installersEnglish } from 'app/main/system/installations/installers/i18n/en';
import { locale as installersSpanish } from 'app/main/system/installations/installers/i18n/sp';
import { locale as installersFrench } from 'app/main/system/installations/installers/i18n/fr';
import { locale as installersPortuguese } from 'app/main/system/installations/installers/i18n/pt';

@Component({
    selector: 'delete-dialog',
    templateUrl: './deletedialog.component.html',
    styleUrls: ['./deletedialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DeleteDialogComponent {

    installer: InstallerDetail;
    flag: any;



    dataSource: InstallersDataSource;
    private flagForDeleting = new BehaviorSubject<boolean>(false);


    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private installersService: InstallersService,
        private dialogRef: MatDialogRef<DeleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
    ) {


        this._fuseTranslationLoaderService.loadTranslations(installersEnglish, installersSpanish, installersFrench, installersPortuguese);

        this.installer = _data.serviceDetail;
        this.flag = _data.flag;
    }

    deleteList(): boolean {
        let deletedInstaller = this.installersService.installerList.findIndex((index: any) => index.id == this.installer.id);

        if (deletedInstaller > -1) {
            this.installersService.installerList.splice(deletedInstaller, 1);

            return true;
        }
    }

    delete() {
        let result = this.deleteList();

        if (result) {
            this.installersService.deleteInstaller(this.installer.id)
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        this.dataSource = new InstallersDataSource(this.installersService);
                        this.dataSource.installersSubject.next(this.installersService.installerList);
                    }
                });
            this.flagForDeleting.next(false);
            this.dialogRef.close(this.installersService.installerList);
        }
    }

    close() {
        // localStorage.removeItem("installer_detail");
        this.dialogRef.close();
    }
}
