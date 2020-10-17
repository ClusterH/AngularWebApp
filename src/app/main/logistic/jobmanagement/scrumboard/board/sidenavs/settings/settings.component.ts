import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { ScrumboardService } from 'app/main/logistic/jobmanagement/scrumboard/scrumboard.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as reportEnglish } from 'app/main/logistic/jobmanagement/scrumboard/i18n/en';
import { locale as reportFrench } from 'app/main/logistic/jobmanagement/scrumboard/i18n/fr';
import { locale as reportPortuguese } from 'app/main/logistic/jobmanagement/scrumboard/i18n/pt';
import { locale as reportSpanish } from 'app/main/logistic/jobmanagement/scrumboard/i18n/sp';

@Component({
    selector: 'scrumboard-board-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ScrumboardBoardSettingsSidenavComponent implements OnInit, OnDestroy {
    board: any;
    view: string;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private scrumboardService: ScrumboardService,
        private _router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this.view = 'main';
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(reportEnglish, reportSpanish, reportFrench, reportPortuguese);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.scrumboardService.onBoardChanged
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(board => {
                this.board = board;
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
     * Toggle card cover
     */
    toggleCardCover(): void {
        this.board.settings.cardcoverimages = !this.board.settings.cardcoverimages;
    }

    /**
     * Toggle subscription
     */
    toggleSubscription(): void {
        this.board.settings.subscribed = !this.board.settings.subscribed;
    }

    deleteBoard(): void {
        this.scrumboardService.deleteBoard(this.board.id).then((res: any) => {
            this._router.navigate(['logistic/scrumboard/boards']);
        })
    }

    setting_save() {
        console.log(this.board.settings);
        this.scrumboardService.saveBoardSetting(this.board.settings.color, this.board.settings.subscribed, this.board.settings.cardcoverimages)
            .then(res => {
                console.log(res);
            })
    }
}