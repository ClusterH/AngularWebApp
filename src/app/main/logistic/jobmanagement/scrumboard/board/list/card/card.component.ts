import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ScrumboardService } from 'app/main/logistic/jobmanagement/scrumboard/scrumboard.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
    selector     : 'scrumboard-board-card',
    templateUrl  : './card.component.html',
    styleUrls    : ['./card.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ScrumboardBoardCardComponent implements OnInit
{
    @Input()
    cardId;

    card: any;
    board: any;

    private _unsubscribeAll: Subject<any>;


    /**
     * Constructor
     *
     * @param {ActivatedRoute} _activatedRoute
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _scrumboardService: ScrumboardService,

    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        console.log(this.cardId);
        this.board = this._activatedRoute.snapshot.data.board;
        console.log(this.board);
        this.card = this.board.cards[0].filter((card) => {
            // console.log(card);
            return this.cardId === card.id;
        })[0];

        // this._scrumboardService.onBoardChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(board => {
        //         console.log(board);
        //         this.board = board;
        //         console.log(this.board);
        //         this.card = this.board.cards[0].filter((card) => {
        //             console.log(card);
        //             return this.cardId === card.id;
        //         })[0];
        //     });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Is the card overdue?
     *
     * @param cardDate
     * @returns {boolean}
     */
    isOverdue(cardDate): boolean
    {
        return moment() > moment(new Date(cardDate));
    }
}
