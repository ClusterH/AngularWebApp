import { Component, ElementRef, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as usersEnglish } from 'app/main/admin/users/i18n/en';
import { locale as usersFrench } from 'app/main/admin/users/i18n/fr';
import { locale as usersPortuguese } from 'app/main/admin/users/i18n/pt';
import { locale as usersSpanish } from 'app/main/admin/users/i18n/sp';
import { ReportResultService, ReportResultDataSource, ExcelService, PDFService } from '../services';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
declare let pdfMake: any;

@Component({
    selector: 'report-reportresult',
    templateUrl: './reportresult.component.html',
    styleUrls: ['./reportresult.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ReportResultComponent implements OnInit, OnDestroy {
    dataSource: ReportResultDataSource;
    entered_report_params: any;
    reportName: string = '';
    @Output()
    pageEvent: PageEvent;
    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    index_number: number = 1;
    currentUser: any;
    user: any;
    flag: string = '';
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    faExel = faFileExcel;
    faPdf = faFilePdf;
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;

    constructor(
        private reportResultService: ReportResultService,
        private excelService: ExcelService,
        private pdfService: PDFService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this.entered_report_params = JSON.parse(localStorage.getItem('report_result'));
        let reportName = this.entered_report_params.reportname.split('_');
        for (let i = 1; i < reportName.length; i++) {
            this.reportName += reportName[i] + ' ';
        }
        this._fuseTranslationLoaderService.loadTranslations(usersEnglish, usersSpanish, usersFrench, usersPortuguese);
        this.pageIndex = 0;
        this.pageSize = 25;
        this.selected = '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngAfterViewInit() {
        var node = $("div.page_index");
        var node_length = node.length;
        $("div.page_index").remove();
        $("button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node[node_length - 1]);

        merge(this.paginator.page)
            .pipe(tap(() => {
                this.dataSource = new ReportResultDataSource(this.reportResultService);
                this.dataSource.loadReportResult(this.paginator.pageIndex, this.paginator.pageSize);
            }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {
        this.dataSource = new ReportResultDataSource(this.reportResultService);
        setTimeout(() => {
            this.dataSource.loadReportResult(this.pageIndex, 100000);
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadReportResult(this.paginator.pageIndex, this.paginator.pageSize);
    }

    exportAsExcel() {
        this.excelService.generateExcel(this.docFormat());
    }

    exportAsPDF() {
        const documentDefinition = this.pdfService.getDocumentDefinition(this.docFormat());
        pdfMake.createPdf(documentDefinition).open();
    }

    docFormat() {

        let data = [];
        let headers = [];
        this.dataSource.reportResult.forEach(item => {
            let row = [];
            this.dataSource.displayedColumns.map(header => {
                if (header !== 'companyid' && header !== 'groupid' && header !== 'unitid') {
                    row.push(item[header]);
                }
            })
            data.push(row);
        })

        this.dataSource.displayedColumns.map(header => {
            if (header !== 'companyid' && header !== 'groupid' && header !== 'unitid') {
                headers.push(header);
            }
        })

        return { data: data, headers: headers };
    }
}