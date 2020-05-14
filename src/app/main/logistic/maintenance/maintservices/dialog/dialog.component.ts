import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MaintservicesService } from 'app/main/logistic/maintenance/maintservices/services/maintservices.service';
import { MaintservicesDataSource } from "app/main/logistic/maintenance/maintservices/services/maintservices.datasource"
import { MaintserviceDetail } from "app/main/logistic/maintenance/maintservices/model/maintservice.model"

import { locale as maintservicesEnglish } from 'app/main/logistic/maintenance/maintservices/i18n/en';
import { locale as maintservicesSpanish } from 'app/main/logistic/maintenance/maintservices/i18n/sp';
import { locale as maintservicesFrench } from 'app/main/logistic/maintenance/maintservices/i18n/fr';
import { locale as maintservicesPortuguese } from 'app/main/logistic/maintenance/maintservices/i18n/pt';

@Component({
    selector: 'maintservice-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MaintserviceDialogComponent implements OnInit {

    maintservice: MaintserviceDetail = {};
    flag: any;
    maintserviceForm: FormGroup;
    serviceDetail: MaintserviceDetail = {};

    newserviceid: string = '';

    userConncode: string;
    userID: number;

    private flagForSaving = new BehaviorSubject<boolean>(false);

    dataSource: MaintservicesDataSource;
    dataSourceCompany: MaintservicesDataSource;
    dataSourceGroup: MaintservicesDataSource;
    dataSourceIncluded: MaintservicesDataSource;
    dataSourceExcluded: MaintservicesDataSource;

    filter_string: string = '';
    method_string: string = '';

    displayedColumns: string[] = ['name'];
    itemsColumns: string[] = ['id', 'name'];

    includedSelection = new SelectionModel<Element>(true, []);
    excludedSelection = new SelectionModel<Element>(true, []);

    @ViewChild(MatPaginator, {static: true})
        paginatorCompany: MatPaginator;
    @ViewChild('paginatorGroup', {read: MatPaginator})
        paginatorGroup: MatPaginator;
    @ViewChild('paginatorIncluded', {read: MatPaginator, static: true})
        paginatorIncluded: MatPaginator;
    @ViewChild('paginatorExcluded', {read: MatPaginator, static: true})
        paginatorExcluded: MatPaginator;
      

    constructor(
        private router: Router,
        private _formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private maintservicesService: MaintservicesService,
        private dialogRef: MatDialogRef<MaintserviceDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any, 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(maintservicesEnglish, maintservicesSpanish, maintservicesFrench, maintservicesPortuguese);

        this.flag = _data.flag;
        this.maintservice = (_data.flag == 'edit')? _data.serviceDetail : this.serviceDetail;

        
        if (this.flag == 'edit') {
            // this.maintservice = _data.serviceDetail;
            this.maintservicesService.pageType = 'edit';
            this.maintservicesService.current_serviceID = this.maintservice.id;
            console.log(this.maintservice);
        } else {
            console.log(this.maintservice);
            this.maintservicesService.pageType = 'new';

            this.maintservicesService.current_serviceID = '0';

        }

        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

        this.filter_string = '';
    }

    ngOnInit() {
        this.dataSourceCompany = new MaintservicesDataSource(this.maintservicesService);
        this.dataSourceGroup   = new MaintservicesDataSource(this.maintservicesService);
        this.dataSourceIncluded = new MaintservicesDataSource(this.maintservicesService);
        this.dataSourceExcluded = new MaintservicesDataSource(this.maintservicesService);

        if (this.flag == 'edit') {
            this.dataSourceGroup.loadGroupDetail(this.userConncode, this.userID, 0, 10, this.maintservice.group, this.maintservice.companyid, "group_clist");

            this.dataSourceIncluded.loadMaintenancegroupDetail(this.userConncode, this.userID, 0, 10, this.maintservice.id, '', "GetServiceIncludedItems");
            this.dataSourceExcluded.loadMaintenancegroupDetail(this.userConncode, this.userID, 0, 10, this.maintservice.id, '', "GetServiceExcludedItems");
        } else {
            this.dataSourceCompany.loadCompanyDetail(this.userConncode, this.userID, 0, 10, this.maintservice.company, "company_clist");
            // this.dataSourceExcluded.loadMaintenancegroupDetail(this.userConncode, this.userID, 0, 10, '0', '', "GetServiceExcludedItems");
        }

        this.maintserviceForm = this._formBuilder.group({
            name: [null, Validators.required],
            company: [null, Validators.required],
            companyInput: [{value: '', disabled: true}],
            group: [null],
            excludedItems: [null],
            includedItems: [null],
            filterstring: [null],
        });

        this.setValues();
    }

    ngAfterViewInit() {
        console.log("ngAfterViewInit:");
        
        merge(this.paginatorCompany.page)
        .pipe(
          tap(() => {
            this.loadServiceDetail("company")
          })
        )
        .subscribe( (res: any) => {
            console.log(res);
        });
    
        merge(this.paginatorGroup.page)
        .pipe(
          tap(() => {
            this.loadServiceDetail("group")
          })
        )
        .subscribe( (res: any) => {
            console.log(res);
        });

        merge(this.paginatorIncluded.page)
        .pipe(
          tap(() => {
            this.loadServiceDetail("included")
          })
        )
        .subscribe( (res: any) => {
            console.log(res);
        });
    
        merge(this.paginatorExcluded.page)
        .pipe(
          tap(() => {
            this.loadServiceDetail("excluded");
          })
        )
        .subscribe( (res: any) => {
          console.log(res);
        })
    }

    setValues() {
        this.maintserviceForm.get('name').setValue(this.maintservice.name);
        this.maintserviceForm.get('company').setValue(this.maintservice.companyid);
        this.maintserviceForm.get('companyInput').setValue(this.maintservice.company);
        this.maintserviceForm.get('group').setValue(this.maintservice.groupid);
        this.maintserviceForm.get('excludedItems').setValue('');
        this.maintserviceForm.get('includedItems').setValue('');
        this.maintserviceForm.get('filterstring').setValue(this.filter_string);
    }

    getValue() {
        console.log(this.maintservice.id);
        this.serviceDetail.id = this.maintservice.id;

        this.serviceDetail.name = this.maintserviceForm.get('name').value;
        this.serviceDetail.companyid = this.maintserviceForm.get('company').value;
        this.serviceDetail.groupid = this.maintserviceForm.get('group').value? this.maintserviceForm.get('group').value : '';
        this.serviceDetail.isactive = this.maintservice.isactive? this.maintservice.isactive : 'true';

        let currentMaintservice =  this.maintservicesService.maintserviceList.findIndex((service: any) => service.id == this.maintservice.id);
        console.log(currentMaintservice);

        this.maintservicesService.maintserviceList[currentMaintservice].id = this.serviceDetail.id;
        this.maintservicesService.maintserviceList[currentMaintservice].name = this.serviceDetail.name;
        this.maintservicesService.maintserviceList[currentMaintservice].companyid = this.serviceDetail.companyid;
        this.maintservicesService.maintserviceList[currentMaintservice].groupid = this.serviceDetail.groupid;
        this.maintservicesService.maintserviceList[currentMaintservice].isactive = this.serviceDetail.isactive;

        let clist = this.maintservicesService.unit_clist_item['company_clist'];
        
        for (let i = 0; i< clist.length; i++) {
            if ( clist[i].id == this.serviceDetail.companyid ) {
            this.maintservicesService.maintserviceList[currentMaintservice].company = clist[i].name;
            }
        }

        let glist = this.maintservicesService.unit_clist_item['group_clist'];
        
        for (let i = 0; i< glist.length; i++) {
            if ( glist[i].id == this.serviceDetail.groupid ) {
            this.maintservicesService.maintserviceList[currentMaintservice].group = glist[i].name;
            }
        }

        this.flagForSaving.next(true);
    }
  

    loadServiceDetail(method_string: string) {
        if (method_string == 'company') {
            this.dataSourceCompany.loadCompanyDetail(this.userConncode, this.userID, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
        
        } else if (method_string == 'group') {
            if (this.flag == 'new') {
                let companyid = this.maintserviceForm.get('companyInput').value;
                this.dataSourceGroup.loadGroupDetail(this.userConncode, this.userID, this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, companyid, `${method_string}_clist`)

            } else {
                let companyid = this.maintserviceForm.get('company').value;
                this.dataSourceGroup.loadGroupDetail(this.userConncode, this.userID, this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, companyid, `${method_string}_clist`)

            }
        } else if (method_string == 'included') {
            if (this.flag == 'new') {
                let companyid = this.maintserviceForm.get('company').value;
                this.dataSourceIncluded.loadMaintenancegroupDetail(this.userConncode, this.userID, this.paginatorIncluded.pageIndex, this.paginatorIncluded.pageSize, companyid, this.filter_string, "GetServiceIncludedItems")
            } else {
                this.dataSourceIncluded.loadMaintenancegroupDetail(this.userConncode, this.userID, this.paginatorIncluded.pageIndex, this.paginatorIncluded.pageSize, this.maintservice.id, this.filter_string, "GetServiceIncludedItems")
            }
            console.log(this.includedSelection.selected);
        
        } else if (method_string == 'excluded') {
            if (this.flag == 'new') {
                let companyid = this.maintserviceForm.get('company').value;
                this.dataSourceExcluded.loadMaintenancegroupDetail(this.userConncode, this.userID, this.paginatorExcluded.pageIndex, this.paginatorExcluded.pageSize, companyid, this.filter_string, "GetServiceExcludedItems")
            } else {
                this.dataSourceExcluded.loadMaintenancegroupDetail(this.userConncode, this.userID, this.paginatorExcluded.pageIndex, this.paginatorExcluded.pageSize, this.maintservice.id, this.filter_string, "GetServiceExcludedItems")
            }
            
            console.log(this.excludedSelection.selected.length);
        }
    }

    managePageIndex(method_string: string) {
        switch(method_string) {
            case 'company':
                this.paginatorCompany.pageIndex = 0;
            break;

            case 'group':
                this.paginatorGroup.pageIndex = 0;
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

        console.log(this.maintserviceForm.get('company').value);
        if (this.flag == 'new') {
            if(this.method_string == 'group' && (this.maintserviceForm.get('company').value == '' || this.maintserviceForm.get('company').value == undefined) ) {
                alert('Please choose company first');
            } else {
                let selected_element_id = this.maintserviceForm.get(`${this.method_string}`).value;
            
                console.log(methodString, this.maintservicesService.unit_clist_item[methodString], selected_element_id );
             
                let clist = this.maintservicesService.unit_clist_item[methodString];
             
                for (let i = 0; i< clist.length; i++) {
                    if ( clist[i].id == selected_element_id ) {
                        this.maintserviceForm.get('filterstring').setValue(clist[i].name);
                        this.filter_string = clist[i].name;
                    }
                }
                 
                this.managePageIndex(this.method_string);
                this.loadServiceDetail(this.method_string);
            } 
        } else if (this.flag == 'edit') {
            
            let selected_element_id = this.maintserviceForm.get(`${this.method_string}`).value;
    
            console.log(methodString, this.maintservicesService.unit_clist_item[methodString], selected_element_id );
        
            let clist = this.maintservicesService.unit_clist_item[methodString];
        
            for (let i = 0; i< clist.length; i++) {
                if ( clist[i].id == selected_element_id ) {
                    this.maintserviceForm.get('filterstring').setValue(clist[i].name);
                    this.filter_string = clist[i].name;
                }
            }
            
            this.managePageIndex(this.method_string);
            this.loadServiceDetail(this.method_string);
        }
       
    }

    onCompanyChange(event: any) {
        console.log(event);
        let current_companyID = this.maintserviceForm.get('company').value;
        this.dataSourceGroup.loadGroupDetail(this.userConncode, this.userID, 0, 10, "", current_companyID, "group_clist");

        if (this.flag == 'new') {
            this.dataSourceIncluded.loadMaintenancegroupDetail(this.userConncode, this.userID, 0, 10, current_companyID, '', "GetServiceIncludedItems");
            this.dataSourceExcluded.loadMaintenancegroupDetail(this.userConncode, this.userID, 0, 10, current_companyID, '', "GetServiceExcludedItems");
        }
    }

    clearFilter() {
        console.log(this.filter_string);
        this.filter_string = '';
        this.maintserviceForm.get('filterstring').setValue(this.filter_string);
    
        this.managePageIndex(this.method_string);
        this.loadServiceDetail(this.method_string);
    }
    
    onKey(event: any) {
        this.filter_string = event.target.value;

        if(this.filter_string.length >= 3 || this.filter_string == '') {
            
            this.managePageIndex(this.method_string);
            this.loadServiceDetail(this.method_string);
        }

        console.log(this.filter_string);
    }

    onIncludedFilter(event: any) {
        this.method_string = 'included';
        this.filter_string = event.target.value;
    
        console.log(this.filter_string, this.method_string)
    
        if(this.filter_string.length >= 3 || this.filter_string == '') {
         
          this.managePageIndex(this.method_string);
          this.loadServiceDetail(this.method_string);
        }
    
        console.log(this.filter_string);
    }
    
    onExcludedFilter(event: any) {
        this.method_string = 'excluded';
        this.filter_string = event.target.value;
    
        if(this.filter_string.length >= 3 || this.filter_string == '') {
         
          this.managePageIndex(this.method_string);
          this.loadServiceDetail(this.method_string);
        }
    
        console.log(this.filter_string);
    }

    comapnyPagenation(paginator) {
        this.dataSourceCompany.loadCompanyDetail(this.userConncode, this.userID, paginator.pageIndex, paginator.pageSize, this.filter_string, "company_clist");
    }

    groupPagenation(paginator) {
        let companyid = this.maintserviceForm.get('company').value;
        this.dataSourceGroup.loadGroupDetail(this.userConncode, this.userID, paginator.pageIndex, paginator.pageSize, this.filter_string, companyid, "group_clist");
    }

    addItems() {
        if (this.excludedSelection.selected.length == 0) {
            alert('Please choose Items first!');
        } else {
            if (this.flag == 'new') {
                if (this.newserviceid != '') {
                    let addData = [];
                    for (let i = 0; i < this.excludedSelection.selected.length; i ++ ){
                        addData[i] = {
                            maintserviceid: Number(this.newserviceid),
                            maintserviceitemid: Number(this.excludedSelection.selected[i])
                        }
                    }

                    this.maintservicesService.addMaintServiceToGroup(this.userConncode, this.userID, addData)
                    .subscribe((res: any) => {
                        if (res.TrackingXLAPI.DATA) {
                            console.log(res);
                            alert("MaintService added successfully!");
                            this.dataSourceIncluded.loadMaintenancegroupDetail(this.userConncode, this.userID, 0, 10, this.newserviceid, '', "GetServiceIncludedItems");
                            this.dataSourceExcluded.loadMaintenancegroupDetail(this.userConncode, this.userID, 0, 10, this.newserviceid, '', "GetServiceExcludedItems");
                        }
                    });
                } else if (this,this.newserviceid == '') {
                    this.getNewvalue();
            
                    this.maintservicesService.saveMaintservice(this.userConncode, this.userID, this.serviceDetail)
                    .subscribe((result: any) => {
                        console.log(result);
                        if (result.responseCode == 100) {
                            console.log(result.TrackingXLAPI.DATA[0].id);
                            this.newserviceid = result.TrackingXLAPI.DATA[0].id;
                            this.maintservicesService.new_serviceID = result.TrackingXLAPI.DATA[0].id;
                    
                            let addData = [];
                            for (let i = 0; i < this.excludedSelection.selected.length; i ++ ){
                                addData[i] = {
                                maintserviceid: Number(result.TrackingXLAPI.DATA[0].id),
                                maintserviceitemid: Number(this.excludedSelection.selected[i])
                                }
                            }
                            
                            console.log(addData);
                            this.maintservicesService.addMaintServiceToGroup(this.userConncode, this.userID, addData)
                            .subscribe((res: any) => {
                                if (res.TrackingXLAPI.DATA) {
                                    console.log(res);
                                    alert("MaintService added successfully!");
                                    this.dataSourceIncluded.loadMaintenancegroupDetail(this.userConncode, this.userID, 0, 10, this.newserviceid, '', "GetServiceIncludedItems");
                                    this.dataSourceExcluded.loadMaintenancegroupDetail(this.userConncode, this.userID, 0, 10, this.newserviceid, '', "GetServiceExcludedItems");
                                }
                            });
                        }
                    });
                }
               
            } else {
                console.log(this.excludedSelection.selected, this.maintservice.id);
                let addData = [];
                for (let i = 0; i < this.excludedSelection.selected.length; i ++ ){
                    addData[i] = {
                        maintserviceid: Number(this.maintservice.id),
                        maintserviceitemid: Number(this.excludedSelection.selected[i])
                    }
                }
                
                console.log(addData);
                this.maintservicesService.addMaintServiceToGroup(this.userConncode, this.userID, addData)
                .subscribe((res: any) => {
                    if (res.TrackingXLAPI.DATA) {
                        console.log(res);
                        alert("Items added successfully!");
                        this.dataSourceIncluded.loadMaintenancegroupDetail(this.userConncode, this.userID, 0, 10, this.maintservice.id, '', "GetServiceIncludedItems");
                        this.dataSourceExcluded.loadMaintenancegroupDetail(this.userConncode, this.userID, 0, 10, this.maintservice.id, '', "GetServiceExcludedItems");
                    }
                });
            }
        }
        
    }
    
    deleteItems() {
        if (this.includedSelection.selected.length == 0) {
            alert('Please choose items first!');
        } else {
            console.log(this.includedSelection.selected, this.maintservice.id);
            let deleteData = [];
            for (let i = 0; i < this.includedSelection.selected.length; i ++ ){
                if (this.flag == 'new') {
                    deleteData[i] = {
                        maintserviceid: Number(this.newserviceid),
                        maintserviceitemid: Number(this.includedSelection.selected[i])
                    }
                } else if (this.flag == 'edit') {
                    deleteData[i] = {
                        maintserviceid: Number(this.maintservice.id),
                        maintserviceitemid: Number(this.includedSelection.selected[i])
                    }
                }
            }
            
            console.log(deleteData);
            this.maintservicesService.deleteMaintServiceToGroup(this.userConncode, this.userID, deleteData)
            .subscribe((res: any) => {
                if (res.TrackingXLAPI.DATA) {
                    alert("Items deleted successfully!");
                    if (this.flag == 'new') {
                        this.dataSourceIncluded.loadMaintenancegroupDetail(this.userConncode, this.userID, 0, 10, this.newserviceid, '', "GetServiceIncludedItems");
                        this.dataSourceExcluded.loadMaintenancegroupDetail(this.userConncode, this.userID, 0, 10, this.newserviceid, '', "GetServiceExcludedItems");
                    
                    } else {
                        this.dataSourceIncluded.loadMaintenancegroupDetail(this.userConncode, this.userID, 0, 10, this.maintservice.id, '', "GetServiceIncludedItems");
                        this.dataSourceExcluded.loadMaintenancegroupDetail(this.userConncode, this.userID, 0, 10, this.maintservice.id, '', "GetServiceExcludedItems");
                    }
                }
            });
        }
    }

    save() {
        this.getValue();

        if (this.serviceDetail.name == '') {
            alert('Please enter Service Name')
        } else {

            if (this.flagForSaving) {
                this.maintservicesService.saveMaintservice(this.userConncode, this.userID, this.serviceDetail)
                .subscribe((result: any) => {
                    console.log(result);
                    if ((result.responseCode == 200)||(result.responseCode == 100)) {
                        alert("Success!");

                        this.flagForSaving.next(false);
                        this.dialogRef.close(this.maintservicesService.maintserviceList);
                    } else {
                        alert('Failed saving!');
                    }
                });
            };
        }   
    }

    add() {
        this.getNewvalue();

        if (this.serviceDetail.name == '') {
            alert('Please enter Service Name')
        } else {
            if (this.flagForSaving) {
                this.maintservicesService.saveMaintservice(this.userConncode, this.userID, this.serviceDetail)
                .subscribe((res: any) => {
                    if ((res.responseCode == 200)||(res.responseCode == 100)) {
                        alert("Success!");

                        this.flagForSaving.next(false);
                        this.dialogRef.close(this.maintservicesService.maintserviceList);
    
                    } else {
                        alert('Failed adding!');
                    }
                });
            } else {
                console.log("ERROE");
            }
        }
    }

    getNewvalue() {
        console.log(this.serviceDetail);
        this.serviceDetail.id = (this.newserviceid == '')? '0' : this.newserviceid;
        this.serviceDetail.name = this.maintserviceForm.get('name').value;
        this.serviceDetail.companyid = this.maintserviceForm.get('company').value;
        this.serviceDetail.groupid = this.maintserviceForm.get('group').value? this.maintserviceForm.get('group').value : '';
        this.serviceDetail.isactive = this.maintservice.isactive? this.maintservice.isactive : 'true';

        let clist = this.maintservicesService.unit_clist_item['company_clist'];
        
        for (let i = 0; i< clist.length; i++) {
            if ( clist[i].id == this.serviceDetail.companyid ) {
                this.serviceDetail.company = clist[i].name;
            }
        }

        let glist = this.maintservicesService.unit_clist_item['group_clist'];
        
        for (let i = 0; i< glist.length; i++) {
            if ( glist[i].id == this.serviceDetail.groupid ) {
                this.serviceDetail.group = glist[i].name;
            }
        }

        if (this.newserviceid != '') {
            this.maintservicesService.maintserviceList.pop();
        }
        
        this.maintservicesService.maintserviceList = this.maintservicesService.maintserviceList.concat(this.serviceDetail);
        console.log("Concat");

        this.flagForSaving.next(true);
    }

    close() {
        this.dialogRef.close(this.maintservicesService.maintserviceList);
    }
}
