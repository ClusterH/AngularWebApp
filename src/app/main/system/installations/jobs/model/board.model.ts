import { List } from './list.model';
import { Card } from './card.model';

export class Board {
    name: string;
    uri: string;
    id: string;
    settings: {
        color: string,
        subscribed: boolean,
        cardcoverimages: boolean
    };
    lists: List[];
    cards: Card[];
    members: {
        id: string,
        name: string,
        avatar: string
    }[];
    labels: {
        id: string,
        name: string,
        color: string
    }[];

    /**
     * Constructor
     *
     * @param board
     */
    constructor(board) {
        this.name = board.name || 'Untitled Board';
        this.uri = board.uri || 'untitled-board';
        this.id = board.id || 0;
        // this.settings = board.settings || {
        //     color: '',
        //     subscribed: true,
        //     cardcoverimages: true
        // };
        this.lists = [];
        this.cards = [];
        this.members = board.members || [];
        this.labels = board.labels || [];
    }
}