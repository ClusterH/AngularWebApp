import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AuthService } from 'app/authentication/services/authentication.service';
import { locale as operatorsEnglish } from 'app/main/admin/operators/i18n/en';
import { locale as operatorsFrench } from 'app/main/admin/operators/i18n/fr';
import { locale as operatorsPortuguese } from 'app/main/admin/operators/i18n/pt';
import { locale as operatorsSpanish } from 'app/main/admin/operators/i18n/sp';
import { OperatorDetail } from 'app/main/admin/operators/model/operator.model';
import { OperatorDetailDataSource } from "app/main/admin/operators/services/operator_detail.datasource";
import { OperatorDetailService } from 'app/main/admin/operators/services/operator_detail.service';
// import * as $ from 'jquery';
import * as _ from 'lodash';
import { isEmpty, isEqual } from 'lodash';
import { merge, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'app-operator-detail',
    templateUrl: './operator_detail.component.html',
    styleUrls: ['./operator_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class OperatorDetailComponent implements OnInit, OnDestroy {
    operator_detail: any;
    public operator: any;
    pageType: string;

    imageError: string;
    isImageSaved: boolean;
    cardImageBase64: any;
    cardImageBase64Temp: any;

    operatorForm: FormGroup;
    operatorDetail: OperatorDetail = {};

    displayedColumns: string[] = ['name'];
    dataSource: OperatorDetailDataSource;
    dataSourceCompany: OperatorDetailDataSource;
    dataSourceGroup: OperatorDetailDataSource;
    dataSourceOperatorType: OperatorDetailDataSource;

    filter_string: string = '';
    method_string: string = '';

    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginatorCompany: MatPaginator;
    @ViewChild('paginatorGroup', { read: MatPaginator, static: true }) paginatorGroup: MatPaginator;
    @ViewChild('paginatorOperatorType', { read: MatPaginator, static: true }) paginatorOperatorType: MatPaginator;

    constructor(
        public operatorDetailService: OperatorDetailService,
        private authService: AuthService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute,
        private sanitizer: DomSanitizer
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(operatorsEnglish, operatorsSpanish, operatorsFrench, operatorsPortuguese);

        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {

            this.operator = data;
        });

        if (isEmpty(this.operator)) {
            this.pageType = 'new';
        } else {
            this.pageType = 'edit';
        }
        this.filter_string = '';
    }

    ngOnInit(): void {
        this.dataSourceCompany = new OperatorDetailDataSource(this.operatorDetailService);
        this.dataSourceGroup = new OperatorDetailDataSource(this.operatorDetailService);
        this.dataSourceOperatorType = new OperatorDetailDataSource(this.operatorDetailService);

        this.dataSourceCompany.loadOperatorDetail(0, 10, this.operator.company, "company_clist");
        if (this.pageType == 'edit') {
            this.dataSourceGroup.loadOperatorGroupDetail(0, 10, this.operator.group, this.operator.companyid, "group_clist");
        } else {
            this.dataSourceGroup.loadOperatorGroupDetail(0, 10, this.operator.group, 0, "group_clist");
        }
        this.dataSourceOperatorType.loadOperatorDetail(0, 10, '', "operatortype_clist");
        if (this.pageType == 'edit') {
            this.operatorDetailService.GetOperatorImage(this.operator.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

                this.cardImageBase64 = this.transform(res.TrackingXLAPI.DATA[0].filephoto);
                this.cardImageBase64Temp = this.transform(res.TrackingXLAPI.DATA[0].filephoto);
            });
        } else {
            this.cardImageBase64 = '0';
            this.cardImageBase64Temp = '0';
        }

        this.operatorForm = this._formBuilder.group({
            name: [null, Validators.required],
            email: [null, Validators.required],
            password: [null, Validators.required],
            phonenumber: [null, Validators.required],
            operatortype: [null, Validators.required],
            isactive: [null, Validators.required],
            company: [null, Validators.required],
            group: [null, Validators.required],
            subgroup: [null, Validators.required],
            created: [{ value: '', disabled: true }],
            createdbyname: [{ value: '', disabled: true }],
            deletedwhen: [{ value: '', disabled: true }],
            deletedbyname: [{ value: '', disabled: true }],
            lastmodifieddate: [{ value: '', disabled: true }],
            lastmodifiedbyname: [{ value: '', disabled: true }],
            birthdate: [null, Validators.required],
            hiredate: [null, Validators.required],
            physicaltestexpirydate: [null, Validators.required],
            licenseexpirationdate: [null, Validators.required],
            driverlicensenumber: [null, Validators.required],
            filterstring: [null, Validators.required],
        });

        this.setValues();
        this.operator_detail = this.operatorForm.value;
    }

    ngAfterViewInit() {
        merge(this.paginatorCompany.page)
            .pipe(tap(() => { this.loadOperatorDetail("company") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        merge(this.paginatorGroup.page)
            .pipe(tap(() => { this.loadOperatorDetail("group") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        merge(this.paginatorCompany.page)
            .pipe(tap(() => { this.loadOperatorDetail("operatortype") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    transform(base64) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(base64);
    }

    loadOperatorDetail(method_string: string) {
        if (method_string == 'company') {
            this.dataSourceCompany.loadOperatorDetail(this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'group') {
            let companyid = this.operatorForm.get('company').value;
            if (companyid == undefined) {
                this.dataSourceGroup.loadOperatorGroupDetail(this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, 0, `${method_string}_clist`)
            } else {
                this.dataSourceGroup.loadOperatorGroupDetail(this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, companyid, `${method_string}_clist`)
            }
        } else if (method_string == 'operatortype') {
            this.dataSourceOperatorType.loadOperatorDetail(this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, '', `${method_string}_clist`)
        }
    }

    managePageIndex(method_string: string) {
        switch (method_string) {
            case 'company':
                this.paginatorCompany.pageIndex = 0;
                break;

            case 'group':
                this.paginatorGroup.pageIndex = 0;
                break;

            case 'operatortype':
                this.paginatorOperatorType.pageIndex = 0;
                break;
        }
    }

    showCompanyList(item: string) {
        let methodString = item;
        this.method_string = item.split('_')[0];
        let selected_element_id = this.operatorForm.get(`${this.method_string}`).value;
        let clist = this.operatorDetailService.unit_clist_item[methodString];

        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id == selected_element_id) {
                this.operatorForm.get('filterstring').setValue(clist[i].name);
                this.filter_string = clist[i].name;
            }
        }

        this.managePageIndex(this.method_string);
        this.loadOperatorDetail(this.method_string);
    }

    clearFilter() {

        this.filter_string = '';
        this.operatorForm.get('filterstring').setValue(this.filter_string);

        this.managePageIndex(this.method_string);
        this.loadOperatorDetail(this.method_string);
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadOperatorDetail(this.method_string);
        }
    }

    onCompanyChange(event: any) {
        let current_companyID = this.operatorForm.get('company').value;
        this.dataSourceGroup.loadOperatorGroupDetail(0, 10, "", current_companyID, "group_clist");
    }

    setValues() {
        this.operatorForm.get('name').setValue(this.operator.name);
        this.operatorForm.get('email').setValue(this.operator.email);
        this.operatorForm.get('password').setValue(this.operator.password);
        this.operatorForm.get('phonenumber').setValue(this.operator.phonenumber);
        this.operatorForm.get('operatortype').setValue(Number(this.operator.operatortypeid));
        this.operatorForm.get('company').setValue(Number(this.operator.companyid));
        this.operatorForm.get('group').setValue(Number(this.operator.groupid));

        let created = this.operator.created ? new Date(`${this.operator.created}`) : '';
        let deletedwhen = this.operator.deletedwhen ? new Date(`${this.operator.deletedwhen}`) : '';
        let lastmodifieddate = this.operator.lastmodifieddate ? new Date(`${this.operator.lastmodifieddate}`) : '';
        // let birthdate = this.operator.birthdate ? new Date(`${this.operator.birthdate}`) : new Date('2000-01-01T00:00:00');
        let birthdate = this.operator.birthdate ? this.operator.birthdate : '2000-01-01';
        let hiredate = this.operator.hiredate ? this.operator.hiredate : '2000-01-01';
        let physicaltestexpirydate = this.operator.physicaltestexpirydate ? this.operator.physicaltestexpirydate : '2000-01-01';
        let licenseexpirationdate = this.operator.licenseexpirationdate ? this.operator.licenseexpirationdate : '2000-01-01';
        this.operatorForm.get('created').setValue(this.dateFormat(created));
        this.operatorForm.get('createdbyname').setValue(this.operator.createdbyname);
        this.operatorForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
        this.operatorForm.get('deletedbyname').setValue(this.operator.deletedbyname);
        this.operatorForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
        this.operatorForm.get('lastmodifiedbyname').setValue(this.operator.lastmodifiedbyname);
        this.operatorForm.get('birthdate').setValue(birthdate, { onlyself: true });
        this.operatorForm.get('hiredate').setValue(hiredate, { onlyself: true });
        this.operatorForm.get('physicaltestexpirydate').setValue(physicaltestexpirydate, { onlyself: true });
        this.operatorForm.get('licenseexpirationdate').setValue(licenseexpirationdate, { onlyself: true });
        this.operatorForm.get('driverlicensenumber').setValue(this.operator.driverlicensenumber);

        if (this.cardImageBase64 == "0") {
            this.isImageSaved = false;
        } else {
            this.isImageSaved = true;
        }
        this.operatorForm.get('filterstring').setValue(this.filter_string);
    }

    getValues(dateTime: any, mode: string) {
        const userID: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        this.operatorDetail.name = this.operatorForm.get('name').value || '';
        this.operatorDetail.email = this.operatorForm.get('email').value || '';
        this.operatorDetail.password = this.operatorForm.get('password').value || '';
        this.operatorDetail.phonenumber = this.operatorForm.get('phonenumber').value || '';
        this.operatorDetail.operatortypeid = this.operatorForm.get('operatortype').value || 0;
        this.operatorDetail.companyid = this.operatorForm.get('company').value || 0;
        this.operatorDetail.groupid = this.operatorForm.get('group').value || 0;
        this.operatorDetail.subgroup = this.operator.subgroup || 0;
        this.operatorDetail.isactive = this.operator.isactive || true;
        this.operatorDetail.deletedwhen = this.operator.deletedwhen || '';
        this.operatorDetail.deletedby = this.operator.deletedby || 0;
        this.operatorDetail.sin = this.operator.sin || '';

        this.operatorDetail.birthdate = this.setDatePicker(new Date(this.operatorForm.get('birthdate').value)) || '';
        this.operatorDetail.hiredate = this.setDatePicker(new Date(this.operatorForm.get('hiredate').value)) || '';
        this.operatorDetail.physicaltestexpirydate = this.setDatePicker(new Date(this.operatorForm.get('physicaltestexpirydate').value)) || '';
        this.operatorDetail.licenseexpirationdate = this.setDatePicker(new Date(this.operatorForm.get('licenseexpirationdate').value)) || '';
        this.operatorDetail.driverlicensenumber = this.operatorForm.get('driverlicensenumber').value || '';

        if (mode == "save") {
            this.operatorDetail.id = this.operator.id;
            this.operatorDetail.created = this.operator.created;
            this.operatorDetail.createdby = this.operator.createdby;
            this.operatorDetail.lastmodifieddate = dateTime;
            this.operatorDetail.lastmodifiedby = userID;
        } else if (mode == "add") {
            this.operatorDetail.id = 0;
            this.operatorDetail.created = dateTime;
            this.operatorDetail.createdby = userID;
            this.operatorDetail.lastmodifieddate = dateTime;
            this.operatorDetail.lastmodifiedby = userID;
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

    setDatePicker(date) {
        let str = '';
        if (date != '') {
            str = date.getFullYear() + "-"
                + ("00" + (date.getMonth() + 1)).slice(-2)
                + "-" + ("00" + date.getDate()).slice(-2)
        }
        return str;
    }

    saveOperator(): void {
        let today = new Date().toISOString();
        this.getValues(today, "save");

        if (this.operatorDetail.name == '') {
            alert('Please enter Detail Name')
        } else {

            this.operatorDetailService.saveOperatorDetail(this.operatorDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {

                        this.operatorDetailService.saveOperatorImage(this.operatorDetail.id, this.cardImageBase64).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

                            if ((result.responseCode == 200) || (result.responseCode == 100)) {
                                alert("Success!");
                                this.router.navigate(['admin/operators/operators']);
                            }
                        })
                    }
                });
        }
    }

    addOperator(): void {
        let today = new Date().toISOString();
        this.getValues(today, "add");
        if (this.operatorDetail.name == '') {
            alert('Please enter Detail Name')
        } else {

            this.operatorDetailService.saveOperatorDetail(this.operatorDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        this.operatorDetailService.saveOperatorImage(result.TrackingXLAPI.DATA[0].id, this.cardImageBase64).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

                            if ((result.responseCode == 200) || (result.responseCode == 100)) {
                                alert("Success!");
                                this.router.navigate(['admin/operators/operators']);
                            }
                        })
                    }
                });
        }
    }

    goBackUnit() {
        this.filter_string = '';
        this.operatorForm.get('filterstring').setValue(this.filter_string);
        let currentState = this.operatorForm.value;
        currentState.birthdate = this.setDatePicker(new Date(this.operatorForm.get('birthdate').value)) + 'T00:00:00' || '';


        if (isEqual(this.operator_detail, currentState) && isEqual(this.cardImageBase64, this.cardImageBase64Temp)) {
            this.router.navigate(['admin/operators/operators']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = { operator: "", flag: flag };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result == 'goback') {
                    this.router.navigate(['admin/operators/operators']);
                }
            });
        }
    }

    fileChangeEvent(fileInput: any) {
        this.imageError = null;
        if (fileInput.target.files && fileInput.target.files[0]) {
            const max_size = 20971520;
            const allowed_types = ['image/png', 'image/jpeg'];
            const max_height = 15200;
            const max_width = 25600;
            if (fileInput.target.files[0].size > max_size) {
                this.imageError =
                    'Maximum size allowed is ' + max_size / 1000 + 'Mb';
                return false;
            }
            if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
                this.imageError = 'Only Images are allowed ( JPG | PNG )';
                return false;
            }
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const image = new Image();
                image.src = e.target.result;
                image.onload = rs => {
                    const img_height = rs.currentTarget['height'];
                    const img_width = rs.currentTarget['width'];
                    if (img_height > max_height && img_width > max_width) {
                        this.imageError =
                            'Maximum dimentions allowed ' +
                            max_height +
                            '*' +
                            max_width +
                            'px';
                        return false;
                    } else {
                        const imgBase64Path = e.target.result;
                        this.cardImageBase64 = this.transform(imgBase64Path);
                        this.isImageSaved = true;
                    }
                };
            };
            reader.readAsDataURL(fileInput.target.files[0]);
        }
    }
}