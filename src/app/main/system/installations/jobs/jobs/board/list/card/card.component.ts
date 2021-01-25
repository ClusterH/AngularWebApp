import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InstallationService } from '../../../../services'
import * as moment from 'moment';
import { Subject } from 'rxjs';

@Component({
    selector: 'installation-board-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InstallationBoardCardComponent implements OnInit {
    @Input() cardId;
    card: any;
    board: any;
    /**
     * Constructor
     *
     * @param {ActivatedRoute} _activatedRoute
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _installationService: InstallationService,
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.board = this._activatedRoute.snapshot.data.board;

        this.card = this.board.cards[0].filter((card) => {
            return this.cardId === card.id;
        })[0];


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

    isOverdue(cardDate): boolean {
        return moment() > moment(new Date(cardDate));
    }
}