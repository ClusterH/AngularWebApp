import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge, BehaviorSubject, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { InstallersService } from 'app/main/system/installations/installers/services/installers.service';
import { InstallersDataSource } from "app/main/system/installations/installers/services/installers.datasource"
import { InstallerDetail } from "app/main/system/installations/installers/model/installer.model"
import { locale as installersEnglish } from 'app/main/system/installations/installers/i18n/en';
import { locale as installersSpanish } from 'app/main/system/installations/installers/i18n/sp';
import { locale as installersFrench } from 'app/main/system/installations/installers/i18n/fr';
import { locale as installersPortuguese } from 'app/main/system/installations/installers/i18n/pt';

@Component({
    selector: 'installer-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InstallerDialogComponent implements OnInit {
    installer: InstallerDetail = {};
    flag: any;
    installerForm: FormGroup;
    installerDetail: InstallerDetail = {};
    private flagForSaving = new BehaviorSubject<boolean>(false);

    dataSource: InstallersDataSource;
    dataSourceInstallContractor: InstallersDataSource;
    dataSourceCarrier: InstallersDataSource;

    filter_string: string = '';
    method_string: string = '';

    displayedColumns: string[] = ['name'];
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true })
    paginatorInstallContractor: MatPaginator;
    @ViewChild('paginatorCarrier', { read: MatPaginator })
    paginatorCarrier: MatPaginator;

    constructor(
        private router: Router,
        private _formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private installersService: InstallersService,
        private dialogRef: MatDialogRef<InstallerDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(installersEnglish, installersSpanish, installersFrench, installersPortuguese);
        this.flag = _data.flag;

        if (this.flag == 'edit') {
            this.installer = _data.installerDetail;


        } else {

        }
        this.filter_string = '';
    }

    ngOnInit() {
        this.dataSourceInstallContractor = new InstallersDataSource(this.installersService);
        this.dataSourceCarrier = new InstallersDataSource(this.installersService);

        this.dataSourceInstallContractor.loadInstallContractorDetail(0, 10, this.installer.installcontractor, "installcontractor_clist");
        this.dataSourceCarrier.loadCarrierDetail(0, 10, this.installer.carrier, "carrier_clist");

        this.installerForm = this._formBuilder.group({
            name: [null, Validators.required],
            installcontractor: [null],
            username: [null],
            password: [null],
            email: [null],
            cellphone: [null],
            carrier: [null],
            filterstring: [null],
        });
        this.setValues();
    }

    ngAfterViewInit() {
        merge(this.paginatorInstallContractor.page)
            .pipe(tap(() => { this.loadInstallerDetail("installcontractor") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        merge(this.paginatorCarrier.page)
            .pipe(tap(() => { this.loadInstallerDetail("carrier") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
    }

    setValues() {
        this.installerForm.get('name').setValue(this.installer.name);
        this.installerForm.get('username').setValue(this.installer.username);
        this.installerForm.get('password').setValue(this.installer.password);
        this.installerForm.get('email').setValue(this.installer.email);
        this.installerForm.get('cellphone').setValue(this.installer.cellphone);
        this.installerForm.get('installcontractor').setValue(Number(this.installer.installcontractorid));
        this.installerForm.get('carrier').setValue(Number(this.installer.carrierid));
        this.installerForm.get('filterstring').setValue(this.filter_string);
    }

    getValue() {
        this.installerDetail.id = this.installer.id;
        this.installerDetail.name = this.installerForm.get('name').value;
        this.installerDetail.username = this.installerForm.get('username').value;
        this.installerDetail.password = this.installerForm.get('password').value;
        this.installerDetail.cellphone = this.installerForm.get('cellphone').value;
        this.installerDetail.email = this.installerForm.get('email').value;
        this.installerDetail.installcontractorid = this.installerForm.get('installcontractor').value;
        this.installerDetail.carrierid = this.installerForm.get('carrier').value;
        this.installerDetail.isactive = this.installer.isactive;
        this.installerDetail.deletedby = this.installer.deletedby;
        this.installerDetail.deletedwhen = this.installer.deletedwhen;
        this.installerDetail.isactive = this.installer.isactive;
        let currentInstaller = this.installersService.installerList.findIndex((service: any) => service.id == this.installer.id);
        this.installersService.installerList[currentInstaller].id = this.installerDetail.id;
        this.installersService.installerList[currentInstaller].name = this.installerDetail.name;
        this.installersService.installerList[currentInstaller].username = this.installerDetail.username;
        this.installersService.installerList[currentInstaller].password = this.installerDetail.password;
        this.installersService.installerList[currentInstaller].cellphone = this.installerDetail.cellphone;
        this.installersService.installerList[currentInstaller].email = this.installerDetail.email;
        this.installersService.installerList[currentInstaller].installcontractorid = this.installerDetail.installcontractorid;
        this.installersService.installerList[currentInstaller].carrierid = this.installerDetail.carrierid;
        this.installersService.installerList[currentInstaller].isactive = this.installerDetail.isactive;
        this.installersService.installerList[currentInstaller].deletedby = this.installerDetail.deletedby;
        this.installersService.installerList[currentInstaller].deletedhen = this.installerDetail.deletedwhen;

        let clist = this.installersService.unit_clist_item['installcontractor_clist'];
        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id == this.installerDetail.installcontractorid) {
                this.installersService.installerList[currentInstaller].installcontractor = clist[i].name;
            }
        }

        let glist = this.installersService.unit_clist_item['carrier_clist'];
        for (let i = 0; i < glist.length; i++) {
            if (glist[i].id == this.installerDetail.carrierid) {
                this.installersService.installerList[currentInstaller].carrier = glist[i].name;
            }
        }
        this.flagForSaving.next(true);
    }

    loadInstallerDetail(method_string: string) {
        if (method_string == 'installcontractor') {
            this.dataSourceInstallContractor.loadInstallContractorDetail(this.paginatorInstallContractor.pageIndex, this.paginatorInstallContractor.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'carrier') {
            this.dataSourceCarrier.loadCarrierDetail(this.paginatorCarrier.pageIndex, this.paginatorCarrier.pageSize, this.filter_string, `${method_string}_clist`)
        }
    }

    managePageIndex(method_string: string) {
        switch (method_string) {
            case 'installcontractor':
                this.paginatorInstallContractor.pageIndex = 0;
                break;

            case 'carrier':
                this.paginatorCarrier.pageIndex = 0;
                break;
        }
    }

    showInstallContractorList(item: string) {
        let methodString = item;
        this.method_string = item.split('_')[0];

        if (this.method_string == 'carrier' && this.installerForm.get('installcontractor').value == '') {
            alert('Please choose installcontractor first');
        } else {
            let selected_element_id = this.installerForm.get(`${this.method_string}`).value;
            let clist = this.installersService.unit_clist_item[methodString];

            for (let i = 0; i < clist.length; i++) {
                if (clist[i].id == selected_element_id) {
                    this.installerForm.get('filterstring').setValue(clist[i].name);
                    this.filter_string = clist[i].name;
                }
            }

            this.managePageIndex(this.method_string);
            this.loadInstallerDetail(this.method_string);
        }
    }

    clearFilter() {
        this.filter_string = '';
        this.installerForm.get('filterstring').setValue(this.filter_string);
        this.managePageIndex(this.method_string);
        this.loadInstallerDetail(this.method_string);
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadInstallerDetail(this.method_string);
        }
    }

    installcontractorPagenation(paginator) {
        this.dataSourceInstallContractor.loadInstallContractorDetail(paginator.pageIndex, paginator.pageSize, this.filter_string, "installcontractor_clist");
    }

    carrierPagenation(paginator) {
        this.dataSourceCarrier.loadCarrierDetail(paginator.pageIndex, paginator.pageSize, this.filter_string, "carrier_clist");
    }

    save() {
        this.getValue();
        if (this.installerDetail.name == '') {
            alert('Please enter Service Name')
        } else {
            if (this.flagForSaving) {
                this.installersService.saveInstaller(this.installerDetail).pipe(takeUntil(this._unsubscribeAll)).subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.flagForSaving.next(false);
                        this.dialogRef.close(this.installersService.installerList);
                    } else {
                        alert('Failed saving!');
                    }
                });
            };
        }
    }

    add() {
        this.getNewvalue();

        if (this.installerDetail.name == '') {
            alert('Please enter Service Name')
        } else {
            if (this.flagForSaving) {
                this.installersService.saveInstaller(this.installerDetail).pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
                    if ((res.responseCode == 200) || (res.responseCode == 100)) {
                        alert("Success!");

                        this.flagForSaving.next(false);
                        this.dialogRef.close(this.installersService.installerList);
                    } else {
                        alert('Failed adding!');
                    }
                });
            }
        }
    }

    getNewvalue() {
        this.installerDetail.id = '0';
        this.installerDetail.name = this.installerForm.get('name').value;
        this.installerDetail.name = this.installerForm.get('username').value;
        this.installerDetail.name = this.installerForm.get('password').value;
        this.installerDetail.name = this.installerForm.get('email').value;
        this.installerDetail.name = this.installerForm.get('cellphone').value;
        this.installerDetail.installcontractorid = this.installerForm.get('installcontractor').value;
        this.installerDetail.carrierid = this.installerForm.get('carrier').value;

        let clist = this.installersService.unit_clist_item['installcontractor_clist'];
        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id == this.installerDetail.installcontractorid) {
                this.installerDetail.installcontractor = clist[i].name;
            }
        }

        let glist = this.installersService.unit_clist_item['carrier_clist'];
        for (let i = 0; i < glist.length; i++) {
            if (glist[i].id == this.installerDetail.carrierid) {
                this.installerDetail.carrier = glist[i].name;
            }
        }

        this.installersService.installerList = this.installersService.installerList.concat(this.installerDetail);

        this.flagForSaving.next(true);
    }

    close() {
        this.dialogRef.close(this.installersService.installerList);
    }
}
