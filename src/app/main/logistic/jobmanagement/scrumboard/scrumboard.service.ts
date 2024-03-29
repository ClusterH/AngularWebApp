import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class ScrumboardService implements Resolve<any> {
    boards: any[];
    routeParams: any;
    board: any;
    newBoardID: number;
    newCardID: string;

    onBoardsChanged: BehaviorSubject<any>;
    onBoardChanged: BehaviorSubject<any>;
    draggedCardId: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onBoardsChanged = new BehaviorSubject([]);
        this.onBoardChanged = new BehaviorSubject([]);
        this.draggedCardId = new BehaviorSubject('');
        this.newBoardID = 0;
        this.newCardID = '';
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        this.routeParams = route.params;
        return new Promise<void>((resolve, reject) => {
            Promise.all([
                this.getBoards()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get boards
     *
     * @returns {Promise<any>}
     */
    getBoards(): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = new HttpParams()
                .set('method', "GetBoards");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            })
                .subscribe((response: any) => {
                    if (response.responseCode == 100) {
                        this.boards = JSON.parse(response.TrackingXLAPI.DATA[0].Column1).boards;

                        this.onBoardsChanged.next(this.boards);
                        resolve(this.boards);
                    }
                }, reject);
        });
    }

    /**
     * Get board
     *
     * @param boardId
     * @returns {Promise<any>}
     */
    getBoard(boardId): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = new HttpParams()
                .set('method', "GetBoards");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            })
                .subscribe((response: any) => {
                    if (response.responseCode == 100) {
                        this.boards = JSON.parse(response.TrackingXLAPI.DATA[0].Column1).boards;
                        if (this.newBoardID == 0) {
                            this.board = this.boards.find(i => i.id == boardId);
                        }

                        this.onBoardChanged.next(this.board);
                        resolve(this.board);
                    }
                }, reject);
        });
    }

    /**
     * Add card
     *
     * @param listId
     * @param newCard
     * @returns {Promise<any>}
     */
    addCard(boardId, listId, newCard): Promise<any> {
        return new Promise((resolve, reject) => {
            this.board.lists.map((list) => {
                if (list.id === listId) {
                    let id = 0;
                    const params = new HttpParams()
                        .set('id', id.toString())
                        .set('name', newCard.name)
                        .set('description', newCard.description)
                        .set('idattachmentcover', newCard.idattachmentcover)
                        .set('subscribed', newCard.subscribed.toString())
                        .set('checkitems', newCard.checkitems.toString())
                        .set('checkitemschecked', newCard.checkitemschecked.toString())
                        .set('due', newCard.due.toString())
                        .set('listid', listId.toString())
                        .set('boardid', boardId.toString())
                        .set('method', "boardcard_save");
                    this._httpClient.get('trackingxlapi.ashx', {
                        params: params
                    })
                        .subscribe((response: any) => {
                            this.newCardID = response.TrackingXLAPI.DATA[0].id;
                            newCard.id = this.newCardID;
                            list.idcards.push(this.newCardID);
                            if (this.board.cards.length == 0) {
                                let card_array = [];
                                card_array.push(newCard);
                                this.board.cards.push(card_array);
                            } else {
                                this.board.cards[0].push(newCard);
                            }
                            this.onBoardChanged.next(this.board);
                            resolve(this.board);
                        }, reject);
                }
            });
        });
    }

    /**
     * Add list
     *
     * @param newList
     * @returns {Promise<any>}
     */
    addList(newList, boardid): Promise<any> {
        return new Promise((resolve, reject) => {
            let id = 0;
            const params = new HttpParams()
                .set('id', id.toString())
                .set('name', newList.name)
                .set('boardid', boardid.toString())
                .set('method', "boardlist_save");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            })
                .subscribe((response: any) => {
                    newList.id = response.TrackingXLAPI.DATA[0].id;
                    this.board.lists.push(newList);
                    this.onBoardChanged.next(this.board);
                    resolve(this.board);
                }, reject);
        });
    }

    updateList(list, boardid): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = new HttpParams()
                .set('id', list.id.toString())
                .set('name', list.name)
                .set('boardid', boardid.toString())
                .set('method', "boardlist_save");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            })
                .subscribe((response: any) => {
                    this.onBoardChanged.next(this.board);
                    resolve(this.board);
                }, reject);
        });
    }

    /**
     * Remove list
     *
     * @param listId
     * @returns {Promise<any>}
     */
    removeList(listId): Promise<any> {
        const list = this.board.lists.find((_list) => {
            return _list.id === listId;
        });

        for (const cardId of list.idcards) {
            this.removeCard(cardId);
        }

        const index = this.board.lists.indexOf(list);
        this.board.lists.splice(index, 1);
        const params = new HttpParams()
            .set('id', listId.toString())
            .set('method', "boardlist_delete");
        this._httpClient.get('trackingxlapi.ashx', {
            params: params
        })
            .subscribe((response: any) => {
                // resolve(this.board);
            });

        return this.updateBoard(this.board);
    }

    /**
     * Remove card
     *
     * @param cardId
     * @param listId
     */
    removeCard(cardId, listId?): void {
        const card = this.board.cards.find((_card) => {
            return _card.id === cardId;
        });
        if (listId) {
            const list = this.board.lists.find((_list) => {
                return listId === _list.id;
            });
            list.idcards.splice(list.idcards.indexOf(cardId), 1);
        }

        this.board.cards.splice(this.board.cards.indexOf(card), 1);
        const params = new HttpParams()
            .set('id', cardId.toString())
            .set('method', "boardcard_delete");
        this._httpClient.get('trackingxlapi.ashx', {
            params: params
        }).subscribe((response: any) => { });

        this.updateBoard(this.board);
    }

    /**
     * Update card
     *
     * @param newCard
     */
    updateCard(card, listId, boardId): Promise<any> {
        this.board.cards.map((_card) => {
            if (_card.id === card.id) {
                return card;
            }
        });

        return new Promise((resolve, reject) => {
            this.board.lists.map((list) => {
                if (list.id === listId) {
                    const params = new HttpParams()
                        .set('id', card.id.toString())
                        .set('name', card.name.toString())
                        .set('description', card.description.toString())
                        .set('attachmentcoverid', card.idattachmentcover.toString())
                        .set('subscribed', card.subscribed.toString())
                        .set('checkitems', card.checkitems.toString())
                        .set('checkitemschecked', card.checkitemschecked.toString())
                        .set('due', card.due.toString())
                        .set('listid', listId.toString())
                        .set('boardid', boardId.toString())
                        .set('method', "boardcard_save");
                    this._httpClient.get('trackingxlapi.ashx', {
                        params: params
                    })
                        .subscribe((response: any) => {
                            this.newCardID = response.TrackingXLAPI.DATA[0].id;
                            card.id = this.newCardID;
                            this.onBoardChanged.next(this.board);
                            resolve(this.board);
                        }, reject);
                }
            });
        });
    }

    /**
     * Create new board
     *
     * @param board
     * @returns {Promise<any>}
     */
    createNewBoard(board): Promise<any> {
        return new Promise((resolve, reject) => {
            const id = 0;
            const company_id = 115;
            const params = new HttpParams()
                .set('id', id.toString())
                .set('name', "UndefinedName")
                .set('uri', "untitled-board")
                .set('companyid', company_id.toString())
                .set('method', "board_save");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            }).subscribe((response: any) => {
                this.newBoardID = Number(response.TrackingXLAPI.DATA[0].id);
                board.id = this.newBoardID;
                this.board = board;
                resolve(this.board);
            }, reject);
        });
    }

    updateBoard(board: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const company_id = 115;
            const params = new HttpParams()
                .set('id', board.id.toString())
                .set('name', board.name)
                .set('uri', board.uri)
                .set('companyid', company_id.toString())
                .set('method', "board_save");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            }).subscribe((response: any) => {
                this.board = board;
                resolve(this.board);
            }, reject);
        });
    }

    deleteBoard(boardId): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = new HttpParams()
                .set('id', boardId.toString())
                .set('method', "board_delete");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            }).subscribe((response: any) => {
                resolve(response);
            }, reject);
        });
    }

    saveBoardSetting(color, subscribed, cardcoverimages): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = new HttpParams()
                .set('boardid', this.board.id.toString())
                .set('color', color.toString())
                .set('subscribed', subscribed.toString())
                .set('cardcoverimages', cardcoverimages.toString())
                .set('method', "board_settings_save");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            })
                .subscribe((response: any) => {
                    this.board.settings.color = color;
                    this.board.settings.subscribed = subscribed;
                    this.board.settings.cardcoverimages = cardcoverimages;
                    resolve(this.board);
                }, reject);
        });
    }

    cardMove(cardId, listId): void {
        const params = new HttpParams()
            .set('cardid', cardId)
            .set('listid', listId)
            .set('method', "boardcard_move");
        this._httpClient.get('trackingxlapi.ashx', {
            params: params
        }).subscribe((res: any) => {

        });
    }

    saveBoardLabel(label, boardId): Promise<any> {
        return new Promise((resolve, reject) => {
            if (label.id == '') {
                label.id = '0';
            }
            const params = new HttpParams()
                .set('id', label.id.toString())
                .set('name', label.name)
                .set('color', label.color)
                .set('boardid', boardId.toString())
                .set('method', "boardlabel_save");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            }).subscribe((res: any) => {

                resolve(res);
            }, reject);
        });
    }

    deleteBoardLabel(labelId): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = new HttpParams()
                .set('id', labelId)
                .set('method', "boardlabel_delete");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            }).subscribe((res: any) => {

                resolve(res);
            }, reject);
        });
    }

    assignLabelToCard(labelId, cardId): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = new HttpParams()
                .set('labelid', labelId)
                .set('cardid', cardId)
                .set('method', "Assign_Label_To_Card");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            }).subscribe((res: any) => {
                resolve(res);
            }, reject);
        });
    }

    removeCardLabel(labelId, cardId): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = new HttpParams()
                .set('labelid', labelId)
                .set('cardid', cardId)
                .set('method', "Remove_card_label");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            }).subscribe((res: any) => {
                resolve(res);
            }, reject);
        });
    }

    addNewComment(id, comment, cardId): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = new HttpParams()
                .set('id', id)
                .set('message', comment.message)
                .set('comtime', comment.time)
                .set('cardid', cardId)
                .set('method', "boardcardcomment_Save");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            }).subscribe((res: any) => {
                resolve(res);
            }, reject);
        });
    }

    saveBoardCardChecklist(checklist): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = new HttpParams()
                .set('id', checklist.id.toString())
                .set('name', checklist.name.toString())
                .set('checkitemschecked', checklist.checkitemschecked.toString())
                .set('cardid', checklist.cardid.toString())
                .set('method', "boardcardchecklist_Save");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            }).subscribe((res: any) => {

                resolve(res);
            }, reject);
        });
    }

    deleteBoardCardChecklist(id, cardId): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = new HttpParams()
                .set('id', id.toString())
                .set('cardid', cardId.toString())
                .set('method', "boardcardchecklist_delete");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            }).subscribe((res: any) => {

                resolve(res);
            }, reject);
        });
    }

    saveBoardCardCheckItem(checkitem): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = new HttpParams()
                .set('id', checkitem.id.toString())
                .set('name', checkitem.name.toString())
                .set('checked', checkitem.checked.toString())
                .set('checklistid', checkitem.checklistid.toString())
                .set('method', "boardcardcheckitem_Save");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            }).subscribe((res: any) => {

                resolve(res);
            }, reject);
        });
    }

    deleteBoardCardCheckItem(id, checklistId, cardId): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = new HttpParams()
                .set('id', id.toString())
                .set('checklistid', checklistId.toString())
                .set('cardid', cardId.toString())
                .set('method', "boardcardcheckitem_delete");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            }).subscribe((res: any) => {
                resolve(res);
            }, reject);
        });
    }

    getBoardMembers(): Promise<any> {
        return new Promise((resolve, reject) => {
            const companyid = 115;
            const params = new HttpParams()
                .set('pageindex', '1'.toString())
                .set('pagesize', '1000'.toString())
                .set('companyid', companyid.toString())
                .set('method', "user_cList");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            }).subscribe((res: any) => {
                resolve(res);
            }, reject);
        });
    }

    insertCardUser(carduserId, cardId): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = new HttpParams()
                .set('userid', carduserId.toString())
                .set('cardid', cardId.toString())
                .set('method', "Insert_card_User");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            }).subscribe((res: any) => {
                resolve(res);
            }, reject);
        });
    }

    deleteCardUser(carduserId, cardId): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = new HttpParams()
                .set('userid', carduserId.toString())
                .set('cardid', cardId.toString())
                .set('method', "delete_card_User");
            this._httpClient.get('trackingxlapi.ashx', {
                params: params
            }).subscribe((res: any) => {
                resolve(res);
            }, reject);
        });
    }
}

@Injectable()
export class BoardResolve implements Resolve<any>
{
    /**
     * Constructor
     *
     * @param {ScrumboardService} _scrumboardService
     */
    constructor(
        private _scrumboardService: ScrumboardService
    ) {
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @returns {Promise<any>}
     */
    resolve(route: ActivatedRouteSnapshot): Promise<any> {
        return this._scrumboardService.getBoard(route.paramMap.get('boardId'));
    }
}