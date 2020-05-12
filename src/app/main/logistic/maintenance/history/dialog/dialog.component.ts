import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { HistoryService } from 'app/main/logistic/maintenance/history/services/history.service';

import { locale as historyEnglish } from 'app/main/logistic/maintenance/history/i18n/en';
import { locale as historySpanish } from 'app/main/logistic/maintenance/history/i18n/sp';
import { locale as historyFrench } from 'app/main/logistic/maintenance/history/i18n/fr';
import { locale as historyPortuguese } from 'app/main/logistic/maintenance/history/i18n/pt';

@Component({
    selector: 'history-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   history: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private historyService: HistoryService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {history, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(historyEnglish, historySpanish, historyFrench, historyPortuguese);

        this.history = history;
        this.flag = flag;
    }

    ngOnInit() {
    }

    // save() {
    //     if(this.flag == "duplicate") {
        
    //         this.history.id = 0;
    //         this.history.name = '';
    //         this.history.email = '';
    //         this.history.password = '';
    //         this.history.created = '';
    //         this.history.createdbyname = '';
    //         this.history.deletedwhen = '';
    //         this.history.deletedbyname = '';
    //         this.history.lastmodifieddate = '';
    //         this.history.lastmodifiedbyname = '';
    
    //         localStorage.setItem("history_detail", JSON.stringify(this.history));
    
    //         console.log("localstorage:", JSON.parse(localStorage.getItem("history_detail")));
    
    //         this.router.navigate(['logistic/history/history_detail']);
    //     } else if( this.flag == "delete") {
    //         this.historyService.deleteHistory(this.history.id)
    //         .subscribe((result: any) => {
    //             if ((result.responseCode == 200)||(result.responseCode == 100)) {
    //                 // this.reloadComponent();
    //             }
    //           });
    //     }


    //     this.dialogRef.close();
    // }

    close() {
        localStorage.removeItem("history_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("history_detail");

        this.router.navigate(['logistic/history/history']);
    }

    // reloadComponent() {
    //     this.router.routeReuseStrategy.shouldRehistoryoute = () => false;
    //     this.router.onSameUrlNavigation = 'reload';
    //     this.router.navigate(['logistic/history/history']);
    // }

}
