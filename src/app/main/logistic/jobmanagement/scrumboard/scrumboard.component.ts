import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { ScrumboardService } from 'app/main/logistic/jobmanagement/scrumboard/scrumboard.service';
import { Board } from 'app/main/logistic/jobmanagement/scrumboard/board.model';

@Component({
    selector     : 'scrumboard',
    templateUrl  : './scrumboard.component.html',
    styleUrls    : ['./scrumboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ScrumboardComponent implements OnInit, OnDestroy
{
    boards: any[];
    userObject: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {Router} _router
     * @param {ScrumboardService} _scrumboardService
     */
    constructor(
        private  _router: Router,
        private _scrumboardService: ScrumboardService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.userObject = JSON.parse(localStorage.getItem('userObjectList'));
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._scrumboardService.onBoardsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(boards => {
                this.boards =boards;
                

            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * New board
     */
    newBoard(): void
    {
        const newBoard = new Board({});
        this._scrumboardService.createNewBoard(newBoard).then(() => {
            this._router.navigate(['logistic/scrumboard/boards/' + this._scrumboardService.newBoardID + '/' + 'untitled-board']);
        });
    }

    currentBoard(board) {
        this._router.navigate(['logistic/scrumboard/boards/' + board.id + '/' + board.uri])
    }
}
