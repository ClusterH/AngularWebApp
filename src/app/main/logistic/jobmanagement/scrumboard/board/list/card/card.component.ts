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
        
        this.board = this._activatedRoute.snapshot.data.board;
        
        this.card = this.board.cards[0].filter((card) => {
            // 
            return this.cardId === card.id;
        })[0];

        console.log(this.card);

        // this.card.due = this.dateFormat(new Date(this.card.due));


        // this._scrumboardService.onBoardChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(board => {
        //         
        //         this.board = board;
        //         
        //         this.card = this.board.cards[0].filter((card) => {
        //             
        //             return this.cardId === card.id;
        //         })[0];
        //     });
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
          }
    
        return str;
      }

    isOverdue(cardDate): boolean
    {
        return moment() > moment(new Date(cardDate));
    }
}
