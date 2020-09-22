import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, BehaviorSubject, Subject } from 'rxjs';
import { tap, takeUntil, map } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { JobsService } from 'app/main/system/installations/jobs/services/jobs.service';
import { JobsDataSource } from "app/main/system/installations/jobs/services/jobs.datasource"
import { JobDetail } from "app/main/system/installations/jobs/model/job.model"
import { locale as jobsEnglish } from 'app/main/system/installations/jobs/i18n/en';
import { locale as jobsSpanish } from 'app/main/system/installations/jobs/i18n/sp';
import { locale as jobsFrench } from 'app/main/system/installations/jobs/i18n/fr';
import { locale as jobsPortuguese } from 'app/main/system/installations/jobs/i18n/pt';
import * as _ from 'lodash';

@Component({
    selector: 'job-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class JobDialogComponent implements OnInit {
    job: JobDetail = {};
    flag: any;
    jobForm: FormGroup;
    serviceDetail: JobDetail = {};
    private flagForSaving = new BehaviorSubject<boolean>(false);

    dataSource: JobsDataSource;
    dataSourceDeviceType: JobsDataSource;
    dataSourceJobType: JobsDataSource;
    dataSourceInstallContractor: JobsDataSource;
    dataSourceInstaller: JobsDataSource;

    filter_string: string = '';
    method_string: string = '';

    displayedColumns: string[] = ['name'];
    installationImageList: any = [];
    activatedTabIndex: number;
    imageError: string;
    isImageSaved: boolean;
    cardImageBase64: any;
    imageSelection = new SelectionModel<Element>(true, []);
    isShowDeleteButton: boolean = false;

    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true })
    paginatorDeviceType: MatPaginator;
    @ViewChild('paginatorJobType', { read: MatPaginator })
    paginatorJobType: MatPaginator;
    @ViewChild('paginatorInstallContractor', { read: MatPaginator })
    paginatorInstallContractor: MatPaginator;
    @ViewChild('paginatorInstaller', { read: MatPaginator })
    paginatorInstaller: MatPaginator;

    constructor(
        private router: Router,
        private _formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private jobsService: JobsService,
        private dialogRef: MatDialogRef<JobDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(jobsEnglish, jobsSpanish, jobsFrench, jobsPortuguese);
        this.flag = _data.flag;

        if (this.flag == 'edit') {
            this.job = _data.serviceDetail;
            console.log(this.job);

        } else {

        }
        this.filter_string = '';
    }

    ngOnInit() {
        this.dataSourceDeviceType = new JobsDataSource(this.jobsService);
        this.dataSourceJobType = new JobsDataSource(this.jobsService);
        this.dataSourceInstallContractor = new JobsDataSource(this.jobsService);
        this.dataSourceInstaller = new JobsDataSource(this.jobsService);

        this.dataSourceDeviceType.loadCompanyDetail(0, 10, this.job.devicetype, "devicetype_clist");
        this.dataSourceJobType.loadCompanyDetail(0, 10, this.job.installationjobtype, "installationjobtype_clist");
        this.dataSourceInstallContractor.loadCompanyDetail(0, 10, this.job.installcontractor, "installcontractor_clist");
        this.dataSourceInstaller.loadCompanyDetail(0, 10, this.job.installer, "installer_clist");
        // if (this.job.companyid != undefined) {
        //     this.dataSourceGroup.loadGroupDetail(0, 10, this.job.group, this.job.companyid, "group_clist");
        // }

        this.jobForm = this._formBuilder.group({
            customer: [null, Validators.required],
            customerphonenumber: [null],
            plate: [null],
            vin: [null],
            startdate: [null],
            duration: [null],
            address: [null],
            status: [null],
            notes: [null],
            description: [null],
            devicetype: [null],
            installationjobtype: [null],
            installcontractor: [null],
            installer: [null],
            created: [{ value: '', disabled: true }],
            createdby: [{ value: '', disabled: true }],
            group: [null],
            company: [null],
            filterstring: [null],
        });

        this.setValues();
    }

    ngAfterViewInit() {
        merge(this.paginatorDeviceType.page).pipe(tap(() => { this.loadServiceDetail("devicetype") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        merge(this.paginatorJobType.page).pipe(tap(() => { this.loadServiceDetail("installationjobtype") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        merge(this.paginatorInstallContractor.page).pipe(tap(() => { this.loadServiceDetail("installcontractor") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        merge(this.paginatorInstaller.page).pipe(tap(() => { this.loadServiceDetail("installer") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
    }

    setValues() {
        let startdate = this.job.startdate ? new Date(`${this.job.startdate}`) : '';
        let created = this.job.startdate ? new Date(`${this.job.created}`) : '';
        console.log(startdate);

        this.jobForm.get('customer').setValue(this.job.customername);
        this.jobForm.get('customerphonenumber').setValue(this.job.customerphonenumber);
        this.jobForm.get('plate').setValue(this.job.plate);
        this.jobForm.get('vin').setValue(this.job.vin);
        this.jobForm.get('startdate').setValue((startdate != '') ? this.job.startdate.slice(0, 16) : new Date('2020-01-01T00:00:00').toISOString().slice(0, 16));
        this.jobForm.get('duration').setValue(this.job.duration);
        this.jobForm.get('address').setValue(this.job.address);
        this.jobForm.get('status').setValue(this.job.status);
        this.jobForm.get('notes').setValue(this.job.notes);
        this.jobForm.get('description').setValue(this.job.description);
        this.jobForm.get('devicetype').setValue(this.job.devicetypeid);
        this.jobForm.get('installationjobtype').setValue(this.job.installationjobtypeid);
        this.jobForm.get('installcontractor').setValue(this.job.installcontractorid);
        this.jobForm.get('installer').setValue(this.job.installerid);
        this.jobForm.get('created').setValue(this.dateFormat(created));
        this.jobForm.get('createdby').setValue(this.job.createdbyname);
        this.jobForm.get('filterstring').setValue(this.filter_string);
    }

    getValue() {
        console.log(this.jobForm.get('startdate').value);
        this.serviceDetail.id = this.job.id || '0';
        this.serviceDetail.imei = this.job.imei;
        this.serviceDetail.enddate = this.job.enddate;
        this.serviceDetail.isactive = this.job.isactive;
        this.serviceDetail.deletedby = this.job.deletedby;
        this.serviceDetail.deletedwhen = this.job.deletedwhen;
        this.serviceDetail.longitude = this.job.longitude;
        this.serviceDetail.latitude = this.job.latitude;
        this.serviceDetail.scheduledate = this.job.scheduledate;
        this.serviceDetail.created = this.job.created;
        this.serviceDetail.createdby = this.job.createdby;
        this.serviceDetail.customername = this.jobForm.get('customer').value;
        this.serviceDetail.customerphonenumber = this.jobForm.get('customerphonenumber').value;
        this.serviceDetail.plate = this.jobForm.get('plate').value;
        this.serviceDetail.vin = this.jobForm.get('vin').value;
        // this.serviceDetail.startdate = this.dateFormat(new Date(this.jobForm.get('startdate').value)) || '0';
        this.serviceDetail.startdate = new Date(this.jobForm.get('startdate').value).toISOString();
        this.serviceDetail.duration = this.jobForm.get('duration').value;
        this.serviceDetail.address = this.jobForm.get('address').value;
        this.serviceDetail.status = this.jobForm.get('status').value;
        this.serviceDetail.notes = this.jobForm.get('notes').value;
        this.serviceDetail.description = this.jobForm.get('description').value;
        this.serviceDetail.devicetypeid = this.jobForm.get('devicetype').value;
        this.serviceDetail.installationjobtypeid = this.jobForm.get('installationjobtype').value;
        this.serviceDetail.installcontractorid = this.jobForm.get('installcontractor').value;
        this.serviceDetail.installerid = this.jobForm.get('installer').value;
        // this.serviceDetail.created = this.jobForm.get('created').value;
        // this.serviceDetail.createdby = this.jobForm.get('createdby').value;
        let currentJob = this.jobsService.jobList.findIndex((service: any) => service.id == this.job.id);
        this.jobsService.jobList[currentJob].id = this.serviceDetail.id;
        this.jobsService.jobList[currentJob].customername = this.serviceDetail.customername;
        this.jobsService.jobList[currentJob].customerphonenumber = this.serviceDetail.customerphonenumber;
        this.jobsService.jobList[currentJob].plate = this.serviceDetail.plate;
        this.jobsService.jobList[currentJob].vin = this.serviceDetail.vin;
        this.jobsService.jobList[currentJob].startdate = this.serviceDetail.startdate;
        this.jobsService.jobList[currentJob].duration = this.serviceDetail.duration;
        this.jobsService.jobList[currentJob].address = this.serviceDetail.address;
        this.jobsService.jobList[currentJob].status = this.serviceDetail.status;
        this.jobsService.jobList[currentJob].notes = this.serviceDetail.notes;
        this.jobsService.jobList[currentJob].description = this.serviceDetail.description;
        this.jobsService.jobList[currentJob].devicetypeid = this.serviceDetail.devicetypeid;
        this.jobsService.jobList[currentJob].installationjobtypeid = this.serviceDetail.installationjobtypeid;
        this.jobsService.jobList[currentJob].installcontractorid = this.serviceDetail.installcontractorid;
        this.jobsService.jobList[currentJob].installerid = this.serviceDetail.installerid;
        this.jobsService.jobList[currentJob].created = this.serviceDetail.created;
        this.jobsService.jobList[currentJob].createdby = this.serviceDetail.createdby;
        this.jobsService.jobList[currentJob].deletedby = this.serviceDetail.deletedby;
        this.jobsService.jobList[currentJob].deletedwhen = this.serviceDetail.deletedwhen;
        this.jobsService.jobList[currentJob].longitude = this.serviceDetail.longitude;
        this.jobsService.jobList[currentJob].latitude = this.serviceDetail.latitude;
        this.jobsService.jobList[currentJob].enddate = this.serviceDetail.enddate;

        let devicetype_clist = this.jobsService.unit_clist_item['devicetype_clist'];

        for (let i = 0; i < devicetype_clist.length; i++) {
            if (devicetype_clist[i].id == this.serviceDetail.devicetypeid) {
                this.jobsService.jobList[currentJob].devicetype = devicetype_clist[i].name;
            }
        }

        let jobtype_clist = this.jobsService.unit_clist_item['installationjobtype_clist'];
        for (let i = 0; i < jobtype_clist.length; i++) {
            if (jobtype_clist[i].id == this.serviceDetail.installationjobtypeid) {
                this.jobsService.jobList[currentJob].installationjobtype = jobtype_clist[i].name;
            }
        }

        let installcontractor_clist = this.jobsService.unit_clist_item['installcontractor_clist'];
        for (let i = 0; i < installcontractor_clist.length; i++) {
            if (installcontractor_clist[i].id == this.serviceDetail.installcontractorid) {
                this.jobsService.jobList[currentJob].installcontractor = installcontractor_clist[i].name;
            }
        }

        let installer_clist = this.jobsService.unit_clist_item['installer_clist'];
        for (let i = 0; i < installer_clist.length; i++) {
            if (installer_clist[i].id == this.serviceDetail.installerid) {
                this.jobsService.jobList[currentJob].installer = installer_clist[i].name;
            }
        }
        this.flagForSaving.next(true);
    }

    loadServiceDetail(method_string: string) {
        if (method_string == 'devicetype') {
            this.dataSourceDeviceType.loadCompanyDetail(this.paginatorDeviceType.pageIndex, this.paginatorDeviceType.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'installationjobtype') {
            this.dataSourceJobType.loadCompanyDetail(this.paginatorJobType.pageIndex, this.paginatorJobType.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'installcontractor') {
            this.dataSourceInstallContractor.loadCompanyDetail(this.paginatorInstallContractor.pageIndex, this.paginatorInstallContractor.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'installer') {
            this.dataSourceInstaller.loadCompanyDetail(this.paginatorInstaller.pageIndex, this.paginatorInstaller.pageSize, this.filter_string, `${method_string}_clist`)
        }
    }

    managePageIndex(method_string: string) {
        switch (method_string) {
            case 'devicetype':
                this.paginatorDeviceType.pageIndex = 0;
                break;

            case 'installationjobtype':
                this.paginatorJobType.pageIndex = 0;
                break;
            case 'installcontractor':
                this.paginatorInstallContractor.pageIndex = 0;
                break;
            case 'installer':
                this.paginatorInstaller.pageIndex = 0;
                break;
        }
    }

    showCompanyList(item: string) {
        let methodString = item;
        this.method_string = item.split('_')[0];
        let selected_element_id = this.jobForm.get(`${this.method_string}`).value;
        let clist = this.jobsService.unit_clist_item[methodString];

        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id == selected_element_id) {
                this.jobForm.get('filterstring').setValue(clist[i].name);
                this.filter_string = clist[i].name;
            }
        }

        this.managePageIndex(this.method_string);
        this.loadServiceDetail(this.method_string);
    }

    clearFilter() {

        this.filter_string = '';
        this.jobForm.get('filterstring').setValue(this.filter_string);

        this.managePageIndex(this.method_string);
        this.loadServiceDetail(this.method_string);
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadServiceDetail(this.method_string);
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

    devicetypePagenation(paginator) {
        this.dataSourceDeviceType.loadCompanyDetail(paginator.pageIndex, paginator.pageSize, this.filter_string, "devicetype_clist");
    }

    jobtypePagenation(paginator) {
        this.dataSourceJobType.loadCompanyDetail(paginator.pageIndex, paginator.pageSize, this.filter_string, "installationjobtype_clist");
    }

    installcontractorPagenation(paginator) {
        this.dataSourceInstallContractor.loadCompanyDetail(paginator.pageIndex, paginator.pageSize, this.filter_string, "installcontractor_clist");
    }

    installerPagenation(paginator) {
        this.dataSourceInstaller.loadCompanyDetail(paginator.pageIndex, paginator.pageSize, this.filter_string, "installer_clist");
    }

    getActivatedTab(event: any) {
        console.log(event);
        this.activatedTabIndex = event;
        if (event == 2 && this._data.flag == 'edit') {
            this.jobsService.Installationimages_TList(this.job.id).pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
                console.log(res);
                if (res.responseCode == 100) {
                    this.installationImageList = res.TrackingXLAPI.DATA;
                    console.log(this.installationImageList);

                }
            });
        }
    }

    fileChangeEvent(fileInput: any) {
        console.log(fileInput.target.files);
        this.imageError = null;
        let saveImageList: any = [];

        if (fileInput.target.files && fileInput.target.files[0]) {
            // Size Filter Bytes
            const max_size = 20971520;
            const allowed_types = ['image/png', 'image/jpeg'];
            const max_height = 15200;
            const max_width = 25600;

            for (let i = 0; i < fileInput.target.files.length; i++) {
                console.log(fileInput.target.files[i]);
                if (fileInput.target.files[i].size > max_size) {
                    this.imageError =
                        `${fileInput.target.files[i].name}'s Maximum size allowed is ` + max_size / 1000 + 'Mb';

                    return false;
                }

                if (!_.includes(allowed_types, fileInput.target.files[i].type)) {
                    this.imageError = 'Only Images are allowed ( JPG | PNG )';
                    return false;
                }
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    console.log(e);
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
                            this.installationImageList.push({ id: 0, image: imgBase64Path });
                            saveImageList.push({ id: 0, image: imgBase64Path });

                            console.log('insideFor===>>>', saveImageList);

                            this.isImageSaved = true;
                            // this.previewImagePath = imgBase64Path;
                        }
                    };
                };

                reader.readAsDataURL(fileInput.target.files[i]);

                if (i == fileInput.target.files.length - 1) {
                    setTimeout(() => {
                        console.log(saveImageList);
                        this.jobsService.saveInstallationImages(this.job.id, saveImageList).pipe(takeUntil(this._unsubscribeAll)).subscribe((result: any) => {
                            console.log(result);
                            if ((result.responseCode == 200) || (result.responseCode == 100)) {
                                alert("Success!");

                                // this.flagForSaving.next(false);
                                // this.dialogRef.close(this.jobsService.jobList);
                            } else {
                                alert('Failed saving!');
                            }
                        });
                    }, 500)
                }
            }
        } else {
            return;
        }
    }

    onDeleteImage(event: any) {
        console.log(this.imageSelection.selected);
        if (this.imageSelection.selected) {
            this.isShowDeleteButton = true;
        } else {
            this.isShowDeleteButton = false;
        }
    }

    deleteImage() {
        let selectedImage = JSON.parse(JSON.stringify(this.imageSelection.selected));
        if (selectedImage.length == 0) {
            alert('Please choose at least one image to delete it');
            return;
        }
        console.log(selectedImage);
        let tempImageList: any = [];
        tempImageList = this.installationImageList.filter(item => selectedImage.includes(item.id));
        tempImageList.forEach(element => {
            delete element['image'];
        });
        console.log(tempImageList);
        this.jobsService.deleteInstallationImages(this.job.id, tempImageList).pipe(takeUntil(this._unsubscribeAll)).subscribe((res => {
            console.log(res);
            let remainImageList = this.installationImageList.filter(item => !selectedImage.includes(item.id));
            this.installationImageList = remainImageList;
            console.log(this.installationImageList);
        }));

        // this.installationImageList = tempImageList;
    }

    save() {
        this.getValue();

        if (this.serviceDetail.customername == '') {
            alert('Please enter Service Name')
        } else {
            console.log(this.serviceDetail);

            if (this.flagForSaving) {
                this.jobsService.saveJob(this.serviceDetail).pipe(takeUntil(this._unsubscribeAll)).subscribe((result: any) => {
                    console.log(result);
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");

                        this.flagForSaving.next(false);
                        this.dialogRef.close(this.jobsService.jobList);
                    } else {
                        alert('Failed saving!');
                    }
                });
            };
        }
    }

    add() {
        this.getNewvalue();
        console.log(this.serviceDetail);
        if (this.serviceDetail.customername == '') {
            alert('Please enter Service Name')
        } else {
            if (this.flagForSaving) {
                this.jobsService.saveJob(this.serviceDetail).pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
                    if ((res.responseCode == 200) || (res.responseCode == 100)) {
                        alert("Success!");

                        this.flagForSaving.next(false);
                        this.dialogRef.close(this.jobsService.jobList);
                    } else {
                        alert('Failed adding!');
                    }
                });
            } else {
            }
        }
    }

    getNewvalue() {
        this.serviceDetail.id = this.job.id || '0';
        this.serviceDetail.imei = this.job.imei || '';
        this.serviceDetail.enddate = this.job.enddate || '';
        this.serviceDetail.isactive = this.job.isactive || 'true';
        this.serviceDetail.deletedby = this.job.deletedby || '';
        this.serviceDetail.deletedwhen = this.job.deletedwhen || '';
        this.serviceDetail.longitude = this.job.longitude || '';
        this.serviceDetail.latitude = this.job.latitude || '';
        this.serviceDetail.scheduledate = this.job.scheduledate || '';
        this.serviceDetail.created = this.job.created || '';
        this.serviceDetail.createdby = this.job.createdby || '';
        this.serviceDetail.customername = this.jobForm.get('customer').value;
        this.serviceDetail.customerphonenumber = this.jobForm.get('customerphonenumber').value;
        this.serviceDetail.plate = this.jobForm.get('plate').value;
        this.serviceDetail.vin = this.jobForm.get('vin').value;
        // this.serviceDetail.startdate = this.dateFormat(new Date(this.jobForm.get('startdate').value)) || '0';
        this.serviceDetail.startdate = this.jobForm.get('startdate').value;
        this.serviceDetail.duration = this.jobForm.get('duration').value;
        this.serviceDetail.address = this.jobForm.get('address').value;
        this.serviceDetail.status = this.jobForm.get('status').value;
        this.serviceDetail.notes = this.jobForm.get('notes').value;
        this.serviceDetail.description = this.jobForm.get('description').value;
        this.serviceDetail.devicetypeid = this.jobForm.get('devicetype').value;
        this.serviceDetail.installationjobtypeid = this.jobForm.get('installationjobtype').value;
        this.serviceDetail.installcontractorid = this.jobForm.get('installcontractor').value;
        this.serviceDetail.installerid = this.jobForm.get('installer').value;

        let devicetype_clist = this.jobsService.unit_clist_item['devicetype_clist'];

        for (let i = 0; i < devicetype_clist.length; i++) {
            if (devicetype_clist[i].id == this.serviceDetail.devicetypeid) {
                this.serviceDetail.devicetype = devicetype_clist[i].name;
            }
        }

        let jobtype_clist = this.jobsService.unit_clist_item['installationjobtype_clist'];
        for (let i = 0; i < jobtype_clist.length; i++) {
            if (jobtype_clist[i].id == this.serviceDetail.installationjobtypeid) {
                this.serviceDetail.installationjobtype = jobtype_clist[i].name;
            }
        }

        let installcontractor_clist = this.jobsService.unit_clist_item['installcontractor_clist'];
        for (let i = 0; i < installcontractor_clist.length; i++) {
            if (installcontractor_clist[i].id == this.serviceDetail.installcontractorid) {
                this.serviceDetail.installcontractor = installcontractor_clist[i].name;
            }
        }

        let installer_clist = this.jobsService.unit_clist_item['installer_clist'];
        for (let i = 0; i < installer_clist.length; i++) {
            if (installer_clist[i].id == this.serviceDetail.installerid) {
                this.serviceDetail.installer = installer_clist[i].name;
            }
        }

        this.jobsService.jobList = this.jobsService.jobList.concat(this.serviceDetail);

        this.flagForSaving.next(true);
    }

    close() {
        this.dialogRef.close(this.jobsService.jobList);
    }
}
