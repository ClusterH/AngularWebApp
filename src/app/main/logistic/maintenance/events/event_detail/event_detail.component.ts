import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as eventsEnglish } from 'app/main/logistic/maintenance/events/i18n/en';
import { locale as eventsFrench } from 'app/main/logistic/maintenance/events/i18n/fr';
import { locale as eventsPortuguese } from 'app/main/logistic/maintenance/events/i18n/pt';
import { locale as eventsSpanish } from 'app/main/logistic/maintenance/events/i18n/sp';
import { EventDetailDataSource } from "app/main/logistic/maintenance/events/services/event_detail.datasource";
import { EventDetailService } from 'app/main/logistic/maintenance/events/services/event_detail.service';
import { isEmpty, isEqual } from 'lodash';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'app-event-detail',
    templateUrl: './event_detail.component.html',
    styleUrls: ['./event_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class EventDetailComponent implements OnInit, OnDestroy {
    public event: any;
    event_temp: any;
    event_detail: any = {};
    pageType: string;
    userConncode: string;
    userID: number;
    userObjectList: any;
    eventForm: FormGroup;
    eventConditionList: string[];
    neweventid: string = '';
    odomultiple: string = '';
    odounit: string = '';
    hourmultiple: string = '';
    dayunit: string = "1";
    displayedColumns: string[] = ['name'];
    displayedUnitColumns: string[] = ['id', 'name'];
    dataSource: EventDetailDataSource;
    dataSourceCompany: EventDetailDataSource;
    dataSourceGroup: EventDetailDataSource;
    dataSourceUnit: EventDetailDataSource;
    dataSourceMaintService: EventDetailDataSource;
    dataSourceIncluded: EventDetailDataSource;
    dataSourceExcluded: EventDetailDataSource;
    filter_string: string = '';
    method_string: string = '';
    loadUnitList_flag: boolean = false;
    unitSelection = new SelectionModel<Element>(false, []);
    includedSelection = new SelectionModel<Element>(true, []);
    excludedSelection = new SelectionModel<Element>(true, []);
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginatorCompany: MatPaginator;
    @ViewChild('paginatorGroup', { read: MatPaginator }) paginatorGroup: MatPaginator;
    @ViewChild('paginatorUnit', { read: MatPaginator }) paginatorUnit: MatPaginator;
    @ViewChild('paginatorMaintService', { read: MatPaginator }) paginatorMaintService: MatPaginator;
    @ViewChild('paginatorIncluded', { read: MatPaginator, static: true }) paginatorIncluded: MatPaginator;
    @ViewChild('paginatorExcluded', { read: MatPaginator, static: true }) paginatorExcluded: MatPaginator;

    constructor(
        public eventDetailService: EventDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(eventsEnglish, eventsSpanish, eventsFrench, eventsPortuguese);
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {

            this.event = data;
        });
        this.userObjectList = JSON.parse(localStorage.getItem('userObjectList'));
        if (isEmpty(this.event)) {
            this.pageType = 'new';
            this.eventDetailService.pageType = 'new';
            this.eventDetailService.current_eventID = '0';
        } else {
            this.pageType = 'edit';
            this.eventDetailService.pageType = 'edit';
            this.eventDetailService.current_eventID = this.event.id;
        }

        this.filter_string = '';
    }

    ngOnInit(): void {
        this.eventForm = this._formBuilder.group({
            name: [null, Validators.required],
            company: [null],
            companyInput: [{ value: '', disabled: true }],
            group: [null],
            unit: [null],
            maintservice: [null],
            odointervalinput: [null],
            dayintervalinput: [null],
            daymultiple: [{ value: 'Every', disabled: true }],
            hourofuseunit: [{ value: 'Hour of use', disabled: true }],
            checkodo: [null],
            checkhour: [null],
            checkday: [null],
            hourofuseintervalinput: [null],
            filterstring: [null],
            wholeCompany: [null],
        });

        this.dataSourceCompany = new EventDetailDataSource(this.eventDetailService);
        this.dataSourceGroup = new EventDetailDataSource(this.eventDetailService);
        this.dataSourceUnit = new EventDetailDataSource(this.eventDetailService);
        this.dataSourceMaintService = new EventDetailDataSource(this.eventDetailService);
        this.dataSourceIncluded = new EventDetailDataSource(this.eventDetailService);
        this.dataSourceExcluded = new EventDetailDataSource(this.eventDetailService);
        if (this.pageType == 'edit') {
            this.dataSourceGroup.loadGroupDetail(0, 10, this.event.group, this.event.companyid, "group_clist");
            if ((this.event.isfullcompany == 'false') && (this.event.isfullgroup == 'false')) {
                this.loadUnitList_flag = false;
                this.dataSourceIncluded.loadMaintEventUnits(0, 10, this.eventDetailService.current_eventID, '', '', "GetMaintEventIncludedUnits");
                this.dataSourceExcluded.loadMaintEventUnits(0, 10, this.eventDetailService.current_eventID, '', '', "GetMaintEventExcludedUnits");
            }
        } else {
            this.dataSourceCompany.loadCompanyDetail(0, 10, this.event.company, "company_clist");
        }

        this.dataSourceMaintService.loadCompanyDetail(0, 10, this.event.maintservice, "maintservice_clist");
        this.setValues();
        this.event_temp = this.eventForm.value;
    }

    ngAfterViewInit() {
        merge(this.paginatorCompany.page)
            .pipe(tap(() => { this.loadEventDetail("company") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        merge(this.paginatorGroup.page)
            .pipe(tap(() => { this.loadEventDetail("group") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        merge(this.paginatorIncluded.page)
            .pipe(tap(() => { this.loadEventDetail("included") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        merge(this.paginatorExcluded.page)
            .pipe(tap(() => { this.loadEventDetail("excluded") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadEventDetail(method_string: string) {
        if (method_string == 'company') {
            this.dataSourceCompany.loadCompanyDetail(this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'group') {
            if (this.pageType == 'new') {
                let companyid = this.eventForm.get('company').value;
                this.dataSourceGroup.loadGroupDetail(this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, companyid, `${method_string}_clist`)
            } else {
                this.dataSourceGroup.loadGroupDetail(this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, this.event.companyid, `${method_string}_clist`)
            }
        } else if (method_string == 'unit') {
            if (this.eventForm.get('wholeCompany').value == false) {
                this.loadUnitList_flag = false;
                this.dataSourceUnit.loadUnitDetail(this.paginatorUnit.pageIndex, this.paginatorUnit.pageSize, this.event.companyid, this.event.groupid, this.event.id);
            }
        } else if (method_string == 'maintservice') {
            this.dataSourceMaintService.loadCompanyDetail(this.paginatorMaintService.pageIndex, this.paginatorMaintService.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'included' && this.eventForm.get('wholeCompany').value == false) {
            this.loadUnitList_flag = false;
            if (this.pageType == 'new') {
                let companyid = this.eventForm.get('company').value;
                let groupid = this.eventForm.get('group').value;
                this.dataSourceIncluded.loadMaintEventUnits(this.paginatorIncluded.pageIndex, this.paginatorIncluded.pageSize, companyid, groupid, this.filter_string, "GetMaintEventIncludedUnits")
            } else {
                this.dataSourceIncluded.loadMaintEventUnits(this.paginatorIncluded.pageIndex, this.paginatorIncluded.pageSize, this.event.id, '', this.filter_string, "GetMaintEventIncludedUnits")
            }
        } else if (method_string == 'excluded' && this.eventForm.get('wholeCompany').value == false) {
            this.loadUnitList_flag = false;
            if (this.pageType == 'new') {
                let companyid = this.eventForm.get('company').value;
                let groupid = this.eventForm.get('group').value;
                this.dataSourceExcluded.loadMaintEventUnits(this.paginatorExcluded.pageIndex, this.paginatorExcluded.pageSize, companyid, groupid, this.filter_string, "GetMaintEventExcludedUnits")
            } else {
                this.dataSourceExcluded.loadMaintEventUnits(this.paginatorExcluded.pageIndex, this.paginatorExcluded.pageSize, this.event.id, '', this.filter_string, "GetMaintEventExcludedUnits")
            }
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
            case 'unit':
                this.paginatorUnit.pageIndex = 0;
                break;
            case 'maintservice':
                this.paginatorMaintService.pageIndex = 0;
                break;
            case 'included':
                this.paginatorIncluded.pageIndex = 0;
                break;
            case 'excluded':
                this.paginatorExcluded.pageIndex = 0;
                break;
        }
    }

    showCompanyList(item: string) {
        let methodString = item;
        this.method_string = item.split('_')[0];
        if (this.pageType == 'new') {
            if (this.method_string == 'group' && (this.eventForm.get('company').value == '' || this.eventForm.get('company').value == undefined)) {
                alert('Please choose company first');
            } else {
                let selected_element_id = this.eventForm.get(`${this.method_string}`).value;
                let clist = this.eventDetailService.unit_clist_item[methodString];
                for (let i = 0; i < clist.length; i++) {
                    if (clist[i].id == selected_element_id) {
                        this.eventForm.get('filterstring').setValue(clist[i].name);
                        this.filter_string = clist[i].name;
                    }
                }
                this.managePageIndex(this.method_string);
                this.loadEventDetail(this.method_string);
            }
        } else if (this.pageType == 'edit') {
            let selected_element_id = this.eventForm.get(`${this.method_string}`).value;
            let clist = this.event.unit_clist_item[methodString];
            for (let i = 0; i < clist.length; i++) {
                if (clist[i].id == selected_element_id) {
                    this.eventForm.get('filterstring').setValue(clist[i].name);
                    this.filter_string = clist[i].name;
                }
            }

            this.managePageIndex(this.method_string);
            this.loadEventDetail(this.method_string);
        }
    }

    onCompanyChange(event: any) {
        let current_companyID = this.eventForm.get('company').value;
        this.dataSourceGroup.loadGroupDetail(0, 10, "", current_companyID, "group_clist");
    }

    onGroupChange(event: any) {
        let current_companyID = this.eventForm.get('company').value;
        let current_groupID = this.eventForm.get('group').value;
        if (current_groupID == 'none' && this.eventForm.get('wholeCompany').value == true) { }
        if (this.eventForm.get('wholeCompany').value == false) {
            this.loadUnitList_flag = false;
            if (this.pageType == 'new') {
                this.dataSourceIncluded.loadMaintEventUnits(0, 10, current_companyID, current_groupID, '', "GetMaintEventIncludedUnits");
                this.dataSourceExcluded.loadMaintEventUnits(0, 10, current_companyID, current_groupID, '', "GetMaintEventExcludedUnits");
            }
            this.dataSourceUnit.loadUnitDetail(0, 20, current_companyID, current_groupID, this.eventDetailService.current_eventID);
        }
    }

    selectWholeCompany(event: any) {
        let current_companyID = this.eventForm.get('company').value;
        let current_groupID = this.eventForm.get('group').value;
        if (event.checked == false) {
            this.loadUnitList_flag = false;
            this.dataSourceIncluded = new EventDetailDataSource(this.eventDetailService);
            this.dataSourceExcluded = new EventDetailDataSource(this.eventDetailService);
            if (this.pageType == 'edit') {
                this.dataSourceIncluded.loadMaintEventUnits(0, 10, this.event.id, '', '', "GetMaintEventIncludedUnits");
                this.dataSourceExcluded.loadMaintEventUnits(0, 10, this.event.id, '', '', "GetMaintEventExcludedUnits");
            } else {
                if (this.neweventid != '') {
                    this.dataSourceIncluded.loadMaintEventUnits(0, 10, this.event.id, '', '', "GetMaintEventIncludedUnits");
                    this.dataSourceExcluded.loadMaintEventUnits(0, 10, this.event.id, '', '', "GetMaintEventExcludedUnits");
                } else if (this.neweventid == '') {
                    this.dataSourceIncluded.loadMaintEventUnits(0, 10, current_companyID, current_groupID, '', "GetMaintEventIncludedUnits");
                    this.dataSourceExcluded.loadMaintEventUnits(0, 10, current_companyID, current_groupID, '', "GetMaintEventExcludedUnits");
                }
            }
        } else {
            this.loadUnitList_flag = true;
            if (current_groupID > 0) {
                this.event.isfullcompany = 'false';
                this.event.isfullgroup = 'true';
            } else {
                this.event.isfullcompany = 'true';
                this.event.isfullgroup = 'false';
            }
        }
    }

    selectOdo(event: any) {
        if (event.checked == false) {
            if (this.eventForm.get('checkhour').value == false && this.eventForm.get('checkday').value == false) {
                alert('At least one should be checked.');
                this.eventForm.get('checkodo').setValue(true);
            } else {
                this.eventForm.get('odointervalinput').setValue(0);
            }
        } else {
            this.eventForm.get('odointervalinput').setValue(this.event.odointerval);
        }
    }

    selectDay(event: any) {
        if (event.checked == false) {
            if (this.eventForm.get('checkhour').value == false && this.eventForm.get('checkodo').value == false) {
                alert('At least one should be checked.');
                this.eventForm.get('checkday').setValue(true);
            } else {
                this.eventForm.get('dayintervalinput').setValue(0);
            }
        } else {
            this.eventForm.get('dayintervalinput').setValue(this.event.odointerval);
        }
    }

    selectHour(event: any) {
        if (event.checked == false) {
            if (this.eventForm.get('checkday').value == false && this.eventForm.get('checkodo').value == false) {
                alert('At least one should be checked.');
                this.eventForm.get('checkhour').setValue(true);
            } else {
                this.eventForm.get('hourofuseintervalinput').setValue(0);
            }
        } else {
            this.eventForm.get('hourofuseintervalinput').setValue(this.event.odointerval);
        }
    }

    clearFilter() {
        this.filter_string = '';
        this.eventForm.get('filterstring').setValue(this.filter_string);
        this.managePageIndex(this.method_string);
        this.loadEventDetail(this.method_string);
    }

    onIncludedFilter(event: any) {
        this.method_string = 'included';
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadEventDetail(this.method_string);
        }
    }

    onExcludedFilter(event: any) {
        this.method_string = 'excluded';
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadEventDetail(this.method_string);
        }
    }

    onKey(event: any) {
        this.filter_string = event.target.value;

        if (this.filter_string.length >= 3 || this.filter_string == '') {

            this.managePageIndex(this.method_string);
            this.loadEventDetail(this.method_string);
        }
    }

    setValues() {
        this.eventForm.get('name').setValue(this.event.name);
        this.eventForm.get('company').setValue(Number(this.event.companyid));
        this.eventForm.get('companyInput').setValue(this.event.company);
        this.eventForm.get('group').setValue(Number(this.event.groupid));
        this.eventForm.get('maintservice').setValue(Number(this.event.maintserviceid));
        this.eventForm.get('odointervalinput').setValue(this.event.odointerval);
        this.eventForm.get('dayintervalinput').setValue(this.event.dayinterval);
        this.eventForm.get('hourofuseintervalinput').setValue(this.event.hourofuseinterval);

        if (this.pageType == 'new') {
            this.eventForm.get('checkodo').setValue(true);
            this.eventForm.get('checkhour').setValue(false);
            this.eventForm.get('checkday').setValue(false);
        } else {
            if (this.event.odointerval != '0') { this.eventForm.get('checkodo').setValue(true); }
            if (this.event.dayinterval != '0') { this.eventForm.get('checkday').setValue(true); }
            if (this.event.hourofuseinterval != '0') { this.eventForm.get('checkhour').setValue(true); }
        }

        this.odomultiple = this.event.odomultiple;
        this.odounit = this.event.odounitid;
        this.hourmultiple = this.event.hourmultiple;

        let wholeCompany: string;
        if (this.event.isfullcompany == 'true') {
            wholeCompany = this.event.isfullcompany;
        } else {
            wholeCompany = this.event.isfullgroup;
        }

        if (wholeCompany == 'true') {
            this.eventForm.get('wholeCompany').setValue(true);
            this.loadUnitList_flag = true;
        } else {
            this.eventForm.get('wholeCompany').setValue(false);
            this.loadUnitList_flag = false;
        }
    }

    getValues(mode: string) {
        this.event_detail.name = this.eventForm.get('name').value || '';
        this.event_detail.odomultiple = this.odomultiple || '';
        this.event_detail.odounitid = this.odounit || '';
        this.event_detail.odointerval = this.eventForm.get('odointervalinput').value ? this.eventForm.get('odointervalinput').value.toString() : '';
        this.event_detail.hourmultiple = this.hourmultiple || '';
        this.event_detail.hourofuseinterval = this.eventForm.get('hourofuseintervalinput').value ? this.eventForm.get('hourofuseintervalinput').value.toString() : '';
        this.event_detail.dayinterval = this.eventForm.get('dayintervalinput').value ? this.eventForm.get('dayintervalinput').value.toString() : '';
        this.event_detail.companyid = this.eventForm.get('company').value ? this.eventForm.get('company').value : '';
        this.event_detail.groupid = this.eventForm.get('group').value ? this.eventForm.get('group').value : '';
        this.event_detail.maintserviceid = this.eventForm.get('maintservice') ? this.eventForm.get('maintservice').value : '';
        this.event_detail.isactive = 'true';
        this.event_detail.description = '';

        if (this.loadUnitList_flag && this.eventForm.get('group').value && this.eventForm.get('group').value != 'none') {
            this.event_detail.isfullgroup = 'true';
            this.event_detail.isfullcompany = 'false';
        } else if (this.loadUnitList_flag && (this.eventForm.get('group').value == 'none' || this.eventForm.get('group').value == undefined)) {
            this.event_detail.isfullgroup = 'false';
            this.event_detail.isfullcompany = 'true';
        } else if (!this.loadUnitList_flag) {
            this.event_detail.isfullgroup = 'false';
            this.event_detail.isfullcompany = 'false';
        }

        if (this.eventForm.get('group').value == 'none' || this.eventForm.get('group').value == undefined) {
            this.event_detail.groupid = '';
        }

        if (mode == "save") {
            this.event_detail.id = this.event.id;
        } else if (mode == "add") {
            this.event_detail.id = (this.neweventid == '') ? '0' : this.neweventid;
        }
    }

    saveEvent(): void {
        this.getValues("save");
        if (this.event_detail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.event_detail.conncode = this.userConncode;
            this.event_detail.userid = this.userID;
            // this.event_detail.method = 'maintevent_save';
            this.eventDetailService.saveEventDetail(this.event_detail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['logistic/events/events']);
                    }
                });
        }
    }

    addEvent(): void {
        this.getValues("add");
        if (this.event_detail.name == '') {
            alert('Please enter Detail Name')
        } else {
            // this.event_detail.conncode = this.userConncode;
            // this.event_detail.userid = this.userID;
            // this.event_detail.method = 'maintevent_save';
            this.eventDetailService.saveEventDetail(this.event_detail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['logistic/events/events']);
                    }
                });
        }
    }

    addItems() {
        if (this.excludedSelection.selected.length == 0) {
            alert('Please choose Items first!');
        } else {
            if (this.pageType == 'new') {
                if (this.neweventid != '') {
                    let addData = [];
                    for (let i = 0; i < this.excludedSelection.selected.length; i++) {
                        addData[i] = {
                            maintserviceid: Number(this.neweventid),
                            maintserviceitemid: Number(this.excludedSelection.selected[i])
                        }
                    }
                    this.eventDetailService.addMaintServiceToGroup(addData).pipe(takeUntil(this._unsubscribeAll))
                        .subscribe((res: any) => {
                            if (res.TrackingXLAPI.DATA) {
                                alert("MaintService added successfully!");
                                this.dataSourceIncluded.loadMaintEventUnits(0, 10, this.neweventid, '', '', "GetMaintEventIncludedUnits");
                                this.dataSourceExcluded.loadMaintEventUnits(0, 10, this.neweventid, '', '', "GetMaintEventExcludedUnits");
                            }
                        });
                } else if (this.neweventid == '') {
                    this.getNewvalue();
                    this.eventDetailService.saveEventDetail(this.event_detail).pipe(takeUntil(this._unsubscribeAll))
                        .subscribe((result: any) => {
                            if (result.responseCode == 100) {
                                this.neweventid = result.TrackingXLAPI.DATA[0].id;
                                this.eventDetailService.new_eventID = result.TrackingXLAPI.DATA[0].id;
                                let addData = [];
                                for (let i = 0; i < this.excludedSelection.selected.length; i++) {
                                    addData[i] = {
                                        mainteventid: Number(result.TrackingXLAPI.DATA[0].id),
                                        unitid: Number(this.excludedSelection.selected[i])
                                    }
                                }
                                this.eventDetailService.addMaintServiceToGroup(addData).pipe(takeUntil(this._unsubscribeAll))
                                    .subscribe((res: any) => {
                                        if (res.TrackingXLAPI.DATA) {
                                            alert("MaintService added successfully!");
                                            this.dataSourceIncluded.loadMaintEventUnits(0, 10, this.neweventid, '', '', "GetMaintEventIncludedUnits");
                                            this.dataSourceExcluded.loadMaintEventUnits(0, 10, this.neweventid, '', '', "GetMaintEventExcludedUnits");
                                        }
                                    });
                            }
                        });
                }
            } else {
                let addData = [];
                for (let i = 0; i < this.excludedSelection.selected.length; i++) {
                    addData[i] = {
                        mainteventid: Number(this.event.id),
                        unitid: Number(this.excludedSelection.selected[i])
                    }
                }
                this.eventDetailService.addMaintServiceToGroup(addData).pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((res: any) => {
                        if (res.TrackingXLAPI.DATA) {
                            alert("Items added successfully!");
                            this.dataSourceIncluded.loadMaintEventUnits(0, 10, this.event.id, '', '', "GetMaintEventIncludedUnits");
                            this.dataSourceExcluded.loadMaintEventUnits(0, 10, this.event.id, '', '', "GetMaintEventExcludedUnits");
                        }
                    });
            }
        }
    }

    deleteItems() {
        if (this.includedSelection.selected.length == 0) {
            alert('Please choose items first!');
        } else {
            let deleteData = [];
            for (let i = 0; i < this.includedSelection.selected.length; i++) {
                if (this.pageType == 'new') {
                    deleteData[i] = {
                        mainteventid: Number(this.neweventid),
                        unitid: Number(this.includedSelection.selected[i])
                    }
                } else if (this.pageType == 'edit') {
                    deleteData[i] = {
                        mainteventid: Number(this.event.id),
                        unitid: Number(this.includedSelection.selected[i])
                    }
                }
            }

            this.eventDetailService.deleteMaintServiceToGroup(deleteData).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((res: any) => {
                    if (res.TrackingXLAPI.DATA) {
                        alert("Items deleted successfully!");
                        if (this.pageType == 'new') {
                            this.dataSourceIncluded.loadMaintEventUnits(0, 10, this.neweventid, '', '', "GetMaintEventIncludedUnits");
                            this.dataSourceExcluded.loadMaintEventUnits(0, 10, this.neweventid, '', '', "GetMaintEventExcludedUnits");
                        } else {
                            this.dataSourceIncluded.loadMaintEventUnits(0, 10, this.event.id, '', '', "GetMaintEventIncludedUnits");
                            this.dataSourceExcluded.loadMaintEventUnits(0, 10, this.event.id, '', '', "GetMaintEventExcludedUnits");
                        }
                    }
                });
        }
    }

    getNewvalue() {
        this.event_detail.id = (this.neweventid == '') ? '0' : this.neweventid;
        this.event_detail.name = this.eventForm.get('name').value || '';
        this.event_detail.odomultiple = this.odomultiple || '';
        this.event_detail.odounitid = this.odounit || '';
        this.event_detail.odointerval = this.eventForm.get('odointervalinput').value ? this.eventForm.get('odointervalinput').value.toString() : '';
        this.event_detail.hourmultiple = this.hourmultiple || '';
        this.event_detail.hourofuseinterval = this.eventForm.get('hourofuseintervalinput').value ? this.eventForm.get('hourofuseintervalinput').value.toString() : '';
        this.event_detail.dayinterval = this.eventForm.get('dayintervalinput').value ? this.eventForm.get('dayintervalinput').value.toString() : '';
        this.event_detail.companyid = this.eventForm.get('company').value ? this.eventForm.get('company').value : '';
        this.event_detail.groupid = this.eventForm.get('group').value ? this.eventForm.get('group').value : '';
        this.event_detail.maintserviceid = this.eventForm.get('maintservice') ? this.eventForm.get('maintservice').value : '';
        this.event_detail.isactive = 'true';
        this.event_detail.description = '';

        if (this.loadUnitList_flag && this.eventForm.get('group').value && this.eventForm.get('group').value != 'none') {
            this.event_detail.isfullgroup = 'true';
            this.event_detail.isfullcompany = 'false';
        } else if (this.loadUnitList_flag && (this.eventForm.get('group').value == 'none' || this.eventForm.get('group').value == undefined)) {
            this.event_detail.isfullgroup = 'false';
            this.event_detail.isfullcompany = 'true';
        } else if (!this.loadUnitList_flag) {
            this.event_detail.isfullgroup = 'false';
            this.event_detail.isfullcompany = 'false';
        }

        if (this.eventForm.get('group').value == 'none' || this.eventForm.get('group').value == undefined) {
            this.event_detail.groupid = '';
        }

        // this.event_detail.conncode = this.userConncode;
        // this.event_detail.userid = this.userID;
        // this.event_detail.method = 'maintevent_save';
        let clist = this.eventDetailService.unit_clist_item['company_clist'];
        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id == this.event_detail.companyid) {
                this.event_detail.company = clist[i].name;
            }
        }
        let glist = this.eventDetailService.unit_clist_item['group_clist'];
        for (let i = 0; i < glist.length; i++) {
            if (glist[i].id == this.event_detail.groupid) {
                this.event_detail.group = glist[i].name;
            }
        }
    }

    goBackUnit() {
        const currentState = this.eventForm.value;

        if (isEqual(this.event_temp, currentState)) {
            this.router.navigate(['logistic/events/events']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = { event: "", flag: flag };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result == 'goback') {
                    this.router.navigate(['logistic/events/events']);
                }
            });
        }
    }
}