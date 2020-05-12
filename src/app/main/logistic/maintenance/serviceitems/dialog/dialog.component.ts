import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ServiceitemsService } from 'app/main/logistic/maintenance/serviceitems/services/serviceitems.service';
import { ServiceitemsDataSource } from "app/main/logistic/maintenance/serviceitems/services/serviceitems.datasource"
import { ServiceitemDetail } from "app/main/logistic/maintenance/serviceitems/model/serviceitem.model"

import { locale as serviceitemsEnglish } from 'app/main/logistic/maintenance/serviceitems/i18n/en';
import { locale as serviceitemsSpanish } from 'app/main/logistic/maintenance/serviceitems/i18n/sp';
import { locale as serviceitemsFrench } from 'app/main/logistic/maintenance/serviceitems/i18n/fr';
import { locale as serviceitemsPortuguese } from 'app/main/logistic/maintenance/serviceitems/i18n/pt';

@Component({
    selector: 'serviceitem-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ServiceItemDialogComponent implements OnInit {

    serviceitem: ServiceitemDetail;
    flag: any;
    serviceitemForm: FormGroup;
    serviceDetail: ServiceitemDetail;

    userConncode: string;
    userID: number;

    dataSourceCompany: ServiceitemsDataSource;
    dataSourceGroup: ServiceitemsDataSource;

    filter_string: string = '';
    method_string: string = '';

    displayedColumns: string[] = ['name'];


    @ViewChild(MatPaginator, {static: true})
        paginatorCompany: MatPaginator;
    @ViewChild('paginatorGroup', {read: MatPaginator, static: true})
        paginatorGroup: MatPaginator;

    constructor(
        private router: Router,
        private _formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private serviceitemsService: ServiceitemsService,
        private dialogRef: MatDialogRef<ServiceItemDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any, 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(serviceitemsEnglish, serviceitemsSpanish, serviceitemsFrench, serviceitemsPortuguese);

        this.flag = _data.flag;

        if (this.flag == 'edit') {
            this.serviceitem = _data.serviceDetail;
        } else {
            console.log("new: ");
            this.serviceitem = new ServiceitemDetail;
        }

        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

        this.filter_string = '';
    }

    ngOnInit() {
        this.dataSourceCompany = new ServiceitemsDataSource(this.serviceitemsService);
        this.dataSourceGroup   = new ServiceitemsDataSource(this.serviceitemsService);

        this.dataSourceCompany.loadCompanyDetail(this.userConncode, this.userID, 0, 10, this.serviceitem.company, "company_clist");
        this.dataSourceGroup  .loadGroupDetail(this.userConncode, this.userID, 0, 10, this.serviceitem.group, this.serviceitem.companyid, "group_clist");

        this.serviceitemForm = this._formBuilder.group({
            name: [null, Validators.required],
            company: [null],
            group: [null],
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
    }

    setValues() {
        this.serviceitemForm.get('name').setValue(this.serviceitem.name);
        this.serviceitemForm.get('company').setValue(this.serviceitem.companyid);
        this.serviceitemForm.get('group').setValue(this.serviceitem.groupid);
        this.serviceitemForm.get('filterstring').setValue(this.filter_string);
    }

    getValue() {
        if (this.flag == 'new') {
            this.serviceDetail = new ServiceitemDetail;
            this.serviceDetail.id = 0;
        } else {
            this.serviceDetail.id = this.serviceitem.id;
        }

        this.serviceDetail.name = this.serviceitemForm.get('name').value;
        this.serviceDetail.companyid = this.serviceitemForm.get('company').value;
        this.serviceDetail.groupid = this.serviceitemForm.get('group').value? this.serviceitemForm.get('group').value : '';
        this.serviceDetail.isactive = this.serviceitem.isactive? this.serviceitem.isactive : 'true';
    }
  

    loadServiceDetail(method_string: string) {
        if (method_string == 'company') {
            this.dataSourceCompany.loadCompanyDetail(this.userConncode, this.userID, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'group') {
            let companyid = this.serviceitemForm.get('company').value;
            
            this.dataSourceGroup.loadGroupDetail(this.userConncode, this.userID, this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, companyid, `${method_string}_clist`)
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
        }
    }

    showCompanyList(item: string) {
        let methodString = item;
        this.method_string = item.split('_')[0];

        console.log(this.serviceitemForm.get('company').value);

        if(this.method_string == 'group' && this.serviceitemForm.get('company').value == '') {
           alert('Please choose company first');
        } else {
            let selected_element_id = this.serviceitemForm.get(`${this.method_string}`).value;
       
            console.log(methodString, this.serviceitemsService.unit_clist_item[methodString], selected_element_id );
        
            let clist = this.serviceitemsService.unit_clist_item[methodString];
        
            for (let i = 0; i< clist.length; i++) {
              if ( clist[i].id == selected_element_id ) {
                this.serviceitemForm.get('filterstring').setValue(clist[i].name);
                this.filter_string = clist[i].name;
              }
            }
            
            this.managePageIndex(this.method_string);
            this.loadServiceDetail(this.method_string);
        }
    }

    onCompanyChange(event: any) {
        console.log(event);
        let current_companyID = this.serviceitemForm.get('company').value;
        this.dataSourceGroup.loadGroupDetail(this.userConncode, this.userID, 0, 10, "", current_companyID, "group_clist");
    }

    clearFilter() {
        console.log(this.filter_string);
        this.filter_string = '';
        this.serviceitemForm.get('filterstring').setValue(this.filter_string);
    
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

    save() {
        this.getValue();

        if (this.serviceDetail.name == '') {
            alert('Please enter Service Name')
        } else {
            if (this.flag == 'new') {
                this.serviceDetail.id = 0;
            }
            this.serviceitemsService.saveServiceitem(this.userConncode, this.userID, this.serviceDetail)
            .subscribe((result: any) => {
                console.log(result);
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    alert("Success!");
                    this.dialogRef.close();
                }
            });
        }       
    }

    close() {
        // localStorage.removeItem("serviceitem_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("serviceitem_detail");

        this.router.navigate(['logistic/serviceitems/serviceitems']);
    }

    // reloadComponent() {
    //     this.router.routeReuseStrategy.shouldReserviceitemoute = () => false;
    //     this.router.onSameUrlNavigation = 'reload';
    //     this.router.navigate(['logistic/serviceitems/serviceitems']);
    // }

}
