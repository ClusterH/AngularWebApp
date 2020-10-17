import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { Board } from 'app/main/logistic/jobmanagement/scrumboard/board.model';
import { ScrumboardService } from 'app/main/logistic/jobmanagement/scrumboard/scrumboard.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as reportEnglish } from 'app/main/logistic/jobmanagement/scrumboard/i18n/en';
import { locale as reportFrench } from 'app/main/logistic/jobmanagement/scrumboard/i18n/fr';
import { locale as reportPortuguese } from 'app/main/logistic/jobmanagement/scrumboard/i18n/pt';
import { locale as reportSpanish } from 'app/main/logistic/jobmanagement/scrumboard/i18n/sp';

@Component({
    selector: 'scrumboard',
    templateUrl: './scrumboard.component.html',
    styleUrls: ['./scrumboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ScrumboardComponent implements OnInit, OnDestroy {
    boards: any[];
    userObject: any;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {Router} _router
     * @param {ScrumboardService} _scrumboardService
     */
    constructor(
        private _router: Router,
        private _scrumboardService: ScrumboardService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(reportEnglish, reportSpanish, reportFrench, reportPortuguese);
        this.userObject = JSON.parse(localStorage.getItem('userObjectList'));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    ngOnInit(): void {
        this._scrumboardService.onBoardsChanged
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(boards => { this.boards = boards; });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * New board
     */
    newBoard(): void {
        const newBoard = new Board({});
        this._scrumboardService.createNewBoard(newBoard).then(() => {
            this._router.navigate(['logistic/scrumboard/boards/' + this._scrumboardService.newBoardID + '/' + 'untitled-board']);
        });
    }

    currentBoard(board) {
        this._router.navigate(['logistic/scrumboard/boards/' + board.id + '/' + board.uri])
    }
}