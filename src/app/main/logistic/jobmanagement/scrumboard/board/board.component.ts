import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { List } from 'app/main/logistic/jobmanagement/scrumboard/list.model';
import { ScrumboardService } from 'app/main/logistic/jobmanagement/scrumboard/scrumboard.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as reportEnglish } from 'app/main/logistic/jobmanagement/scrumboard/i18n/en';
import { locale as reportFrench } from 'app/main/logistic/jobmanagement/scrumboard/i18n/fr';
import { locale as reportPortuguese } from 'app/main/logistic/jobmanagement/scrumboard/i18n/pt';
import { locale as reportSpanish } from 'app/main/logistic/jobmanagement/scrumboard/i18n/sp';

@Component({
    selector: 'scrumboard-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ScrumboardBoardComponent implements OnInit, OnDestroy {
    board: any;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _location: Location,
        private _scrumboardService: ScrumboardService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(reportEnglish, reportSpanish, reportFrench, reportPortuguese);
    }

    ngOnInit(): void {
        this._scrumboardService.onBoardChanged
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(board => {
                this.board = board;
                this._scrumboardService.getBoardMembers().then((res: any) => {
                    console.log(res);
                    this.board.members = res.TrackingXLAPI.DATA;
                });
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On list add
     *
     * @param newListName
     */
    onListAdd(newListName): void {
        if (newListName === '') { return; }
        this._scrumboardService.addList(new List({ name: newListName }), this.board.id);
    }

    /**
     * On board name changed
     *
     * @param newName
     */
    onBoardNameChanged(newName): void {
        this._scrumboardService.updateBoard(this.board);
        this._location.go('logistic/scrumboard/boards/' + this.board.id + '/' + this.board.uri);
    }

    /**
     * On drop
     *
     * @param ev
     */
    onDrop(ev): void {
    }
}