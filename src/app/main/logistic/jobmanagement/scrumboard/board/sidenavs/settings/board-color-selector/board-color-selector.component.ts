import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatColors } from '@fuse/mat-colors';
import { ScrumboardService } from 'app/main/logistic/jobmanagement/scrumboard/scrumboard.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'scrumboard-board-color-selector',
    templateUrl: './board-color-selector.component.html',
    styleUrls: ['./board-color-selector.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ScrumboardBoardColorSelectorComponent implements OnInit, OnDestroy {
    colors: any;
    board: any;
    private _unsubscribeAll: Subject<any>;
    /**
     * Constructor
     *
     * @param {ScrumboardService} _scrumboardService
     */
    constructor(private _scrumboardService: ScrumboardService) {
        this.colors = MatColors.all;
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._scrumboardService.onBoardChanged
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(board => {
                this.board = board;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set the color
     *
     * @param color
     */
    setColor(color): void {
        this.board.settings.color = color;
    }
}