import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as connectionsEnglish } from 'app/main/system/connections/i18n/en';
import { locale as connectionsFrench } from 'app/main/system/connections/i18n/fr';
import { locale as connectionsPortuguese } from 'app/main/system/connections/i18n/pt';
import { locale as connectionsSpanish } from 'app/main/system/connections/i18n/sp';
import { ConnectionDetail } from 'app/main/system/connections/model/connection.model';
import { ConnectionDetailDataSource } from "app/main/system/connections/services/connection_detail.datasource";
import { ConnectionDetailService } from 'app/main/system/connections/services/connection_detail.service';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";
import { isEmpty, isEqual } from 'lodash';

@Component({
    selector: 'app-connection-detail',
    templateUrl: './connection_detail.component.html',
    styleUrls: ['./connection_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ConnectionDetailComponent implements OnInit, OnDestroy {
    connection_detail: any;
    public connection: any;
    pageType: string;
    userConncode: string;
    userID: number;
    connectionModel_flag: boolean;
    connectionForm: FormGroup;
    connectionDetail: ConnectionDetail = {};
    displayedColumns: string[] = ['name'];
    dataSource: ConnectionDetailDataSource;
    dataSourceProtocol: ConnectionDetailDataSource;
    filter_string: string = '';
    method_string: string = '';
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true })
    paginatorProtocol: MatPaginator;

    constructor(
        public connectionDetailService: ConnectionDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute
    ) {
        this._fuseTranslationLoaderService.loadTranslations(connectionsEnglish, connectionsSpanish, connectionsFrench, connectionsPortuguese);
        this._unsubscribeAll = new Subject();
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
            console.log(data);
            this.connection = data;
        });

        if (isEmpty(this.connection)) { this.pageType = 'new'; }
        else { this.pageType = 'edit'; }

        this.filter_string = '';
    }

    ngOnInit(): void {
        this.dataSourceProtocol = new ConnectionDetailDataSource(this.connectionDetailService);
        this.dataSourceProtocol.loadConnectionDetail(0, 10, this.connection.protocol, "protocol_clist");

        this.connectionForm = this._formBuilder.group({
            name: [null, Validators.required],
            conntype: [null, Validators.required],
            localport: [null, Validators.required],
            protocol: [null, Validators.required],

            created: [{ value: '', disabled: true }],
            createdbyname: [{ value: '', disabled: true }],
            deletedwhen: [{ value: '', disabled: true }],
            deletedbyname: [{ value: '', disabled: true }],
            lastmodifieddate: [{ value: '', disabled: true }],
            lastmodifiedbyname: [{ value: '', disabled: true }],
            filterstring: [null],
        });

        this.setValues();
        this.connection_detail = this.connectionForm.value;
    }

    ngAfterViewInit() {
        merge(this.paginatorProtocol.page)
            .pipe(tap(() => { this.loadConnectionDetail("protocol") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadConnectionDetail(method_string: string) {
        if (method_string == 'protocol') {
            this.dataSourceProtocol.loadConnectionDetail(this.paginatorProtocol.pageIndex, this.paginatorProtocol.pageSize, this.filter_string, `${method_string}_clist`)
        }
    }

    managePageIndex(method_string: string) {
        switch (method_string) {
            case 'protocol':
                this.paginatorProtocol.pageIndex = 0;
                break;
        }
    }

    showCompanyList(item: string) {
        let methodString = item;
        this.method_string = item.split('_')[0];
        let selected_element_id = this.connectionForm.get(`${this.method_string}`).value;
        let clist = this.connectionDetailService.unit_clist_item[methodString];
        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id == selected_element_id) {
                this.connectionForm.get('filterstring').setValue(clist[i].name);
                this.filter_string = clist[i].name;
            }
        }

        this.managePageIndex(this.method_string);
        this.loadConnectionDetail(this.method_string);
    }

    clearFilter() {
        this.filter_string = '';
        this.connectionForm.get('filterstring').setValue(this.filter_string);
        this.managePageIndex(this.method_string);
        this.loadConnectionDetail(this.method_string);
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadConnectionDetail(this.method_string);
        }
    }

    setValues() {
        this.connectionForm.get('name').setValue(this.connection.name);
        this.connectionForm.get('conntype').setValue(this.connection.conntype);
        this.connectionForm.get('localport').setValue(this.connection.localport);
        this.connectionForm.get('protocol').setValue(Number(this.connection.protocolid));

        let created = this.connection.created ? new Date(`${this.connection.created}`) : '';
        let deletedwhen = this.connection.deletedwhen ? new Date(`${this.connection.deletedwhen}`) : '';
        let lastmodifieddate = this.connection.lastmodifieddate ? new Date(`${this.connection.lastmodifieddate}`) : '';

        this.connectionForm.get('created').setValue(this.dateFormat(created));
        this.connectionForm.get('createdbyname').setValue(this.connection.createdbyname);
        this.connectionForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
        this.connectionForm.get('deletedbyname').setValue(this.connection.deletedbyname);
        this.connectionForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
        this.connectionForm.get('lastmodifiedbyname').setValue(this.connection.lastmodifiedbyname);
        this.connectionForm.get('filterstring').setValue(this.filter_string);
    }

    getValues(dateTime: any, mode: string) {
        const userID: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        this.connectionDetail.name = this.connectionForm.get('name').value || '';
        this.connectionDetail.conntype = this.connectionForm.get('conntype').value || '';
        this.connectionDetail.localport = this.connectionForm.get('localport').value || 0;
        this.connectionDetail.protocolid = this.connectionForm.get('protocol').value || 0;

        this.connectionDetail.isactive = this.connection.isactive || true;
        this.connectionDetail.deletedwhen = this.connection.deletedwhen || '';
        this.connectionDetail.deletedby = this.connection.deletedby || 0;

        if (mode == "save") {
            this.connectionDetail.id = this.connection.id;
            this.connectionDetail.created = this.connection.created;
            this.connectionDetail.createdby = this.connection.createdby;
            this.connectionDetail.lastmodifieddate = dateTime;
            this.connectionDetail.lastmodifiedby = userID;
        } else if (mode == "add") {
            this.connectionDetail.id = 0;
            this.connectionDetail.created = dateTime;
            this.connectionDetail.createdby = userID;
            this.connectionDetail.lastmodifieddate = dateTime;
            this.connectionDetail.lastmodifiedby = userID;
        }
    }

    dateFormat(date: any) {
        let str = '';
        if (date != '') {
            str =
                ("00" + (date.getMonth() + 1)).slice(-2)
                + "/" + ("00" + date.getDate()).slice(-2)
                + "/" + date.getFullYear() + " "
                + ("00" + date.getHours()).slice(-2) + ":"
                + ("00" + date.getMinutes()).slice(-2)
                + ":" + ("00" + date.getSeconds()).slice(-2);
        }
        return str;
    }

    saveConnection(): void {
        let today = new Date().toISOString();
        this.getValues(today, "save");
        if (this.connectionDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.connectionDetailService.saveConnectionDetail(this.connectionDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['system/connections/connections']);
                    }
                });
        }
    }

    addConnection(): void {
        let today = new Date().toISOString();
        this.getValues(today, "add");
        if (this.connectionDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.connectionDetailService.saveConnectionDetail(this.connectionDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['system/connections/connections']);
                    }
                });
        }
    }

    goBackUnit() {
        this.filter_string = '';
        this.connectionForm.get('filterstring').setValue(this.filter_string);
        const currentState = this.connectionForm.value;
        console.log(this.connection_detail, currentState);
        if (isEqual(this.connection_detail, currentState)) {
            this.router.navigate(['system/connections/connections']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = { connection: "", flag: flag };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result == 'goback') {
                    this.router.navigate(['system/connections/connections']);
                }
            });
        }
    }
}