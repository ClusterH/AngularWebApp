import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class ScrumboardService implements Resolve<any>
{
    boards: any[];
    routeParams: any;
    board: any;
    newBoardID: number;
    newCardID: string;


    onBoardsChanged: BehaviorSubject<any>;
    onBoardChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onBoardsChanged = new BehaviorSubject([]);
        this.onBoardChanged = new BehaviorSubject([]);
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {
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
    getBoards(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            let conncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
            let userid = 345;
            // let userid = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

            let headers = new HttpHeaders();
            headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
            let params = new HttpParams()
                    .set('conncode', conncode.toString())
                    .set('userid', userid.toString())
                    .set('method', "GetBoards");
                   
                console.log('params', params);
    
                this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
                    headers: headers,   
                    params: params
                })
                .subscribe((response: any) => {
                    if (response.responseCode == 100) {
                        this.boards = JSON.parse(response.TrackingXLAPI.DATA[0].Column1).boards;
                       
                        console.log(this.boards);
    
                        this.onBoardsChanged.next(this.boards);
                        resolve(this.boards);
                    }
                    
                }, reject);

            // this._httpClient.get('api/scrumboard-boards')
            // .subscribe((response: any) => {
            //     console.log(response);
            //     this.boards = response;
            //     this.onBoardsChanged.next(this.boards);
            //     resolve(this.boards);
            // }, reject);
        });
    }

    /**
     * Get board
     *
     * @param boardId
     * @returns {Promise<any>}
     */
    getBoard(boardId): Promise<any>
    {
        return new Promise((resolve, reject) => {
            let conncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
            let userid = 345;
            // let userid = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

            let headers = new HttpHeaders();
            headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
            let params = new HttpParams()
                    .set('conncode', conncode.toString())
                    .set('userid', userid.toString())
                    .set('method', "GetBoards");
                   
            console.log('params', params);

            this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
                headers: headers,   
                params: params
            })
            .subscribe((response: any) => {
                if (response.responseCode == 100) {
                    this.boards = JSON.parse(response.TrackingXLAPI.DATA[0].Column1).boards;
                    if (this.newBoardID == 0) {
                        console.log("new board click", this.board);
                        this.board = this.boards.find(i => i.id == boardId);
                    }

                    console.log(this.board);

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
    addCard(boardId, listId, newCard): Promise<any>
    {
        return new Promise((resolve, reject) => {

            this.board.lists.map((list) => {
                console.log(list);
                if ( list.id === listId )
                {
                    let conncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
                    let userid = 345;
                    let id = 0;

                    let headers = new HttpHeaders();
                    headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
                    let params = new HttpParams()
                        .set('conncode', conncode.toString())
                        .set('userid', userid.toString())
                        .set('id', id.toString())
                        .set('name', newCard.name)
                        .set('description', newCard.description)
                        .set('attachmentcoverid', newCard.attachmentcoverid)
                        .set('subscribed', newCard.subscribed.toString())
                        .set('checkitems', newCard.checkitems.toString())
                        .set('checkitemchecked', newCard.checkitemchecked.toString())
                        .set('due', newCard.due.toString())
                        .set('listid', listId.toString())
                        .set('boardid', boardId.toString())
                        .set('method', "boardcard_save");
                        
                    console.log('params', params);
                    
                    this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                        headers: headers,   
                        params: params
                    })
                    .subscribe((response: any) => {
                        console.log(response);
                        this.newCardID = response.TrackingXLAPI.DATA[0].id;
                        newCard.id = this.newCardID;

                        list.idcards.push(this.newCardID);

                        if (this.board.cards.length == 0) {
                            let card_array = [];
                            console.log(newCard);
                
                            card_array.push(newCard);
                            console.log(card_array);
                            this.board.cards.push(card_array);
                            console.log(this.board.cards);
                        } else {
                            this.board.cards[0].push(newCard);
                        }

                        console.log(this.board);

                        this.onBoardChanged.next(this.board);
                        resolve(this.board);
                    }, reject);
                }
            });
        });
        // return this.getBoard(this.board.id);
    }

    /**
     * Add list
     *
     * @param newList
     * @returns {Promise<any>}
     */
    addList(newList, boardid): Promise<any>
    {
        return new Promise((resolve, reject) => {
            let conncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
            let userid = 345;
            let id = 0;

            let headers = new HttpHeaders();
            headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
            let params = new HttpParams()
                .set('conncode', conncode.toString())
                .set('userid', userid.toString())
                .set('id', id.toString())
                .set('name', newList.name)
                .set('boardid', boardid.toString())
                .set('method', "boardlist_save");
                
            console.log('params', params);
            
            this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: headers,   
                params: params
            })
            .subscribe((response: any) => {
                console.log(response);
                newList.id = response.TrackingXLAPI.DATA[0].id;
                this.board.lists.push(newList);
                this.onBoardChanged.next(this.board);
                resolve(this.board);
            }, reject);
        });
        // return this.updateBoard();
    }

    updateList(list, boardid): Promise<any>
    {
        return new Promise((resolve, reject) => {
            let conncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
            let userid = 345;

            let headers = new HttpHeaders();
            headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
            let params = new HttpParams()
                .set('conncode', conncode.toString())
                .set('userid', userid.toString())
                .set('id', list.id.toString())
                .set('name', list.name)
                .set('boardid', boardid.toString())
                .set('method', "boardlist_save");
                
            console.log('params', params);
            
            this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: headers,   
                params: params
            })
            .subscribe((response: any) => {
                console.log(response);
                this.board.lists.push(list);
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
    removeList(listId): Promise<any>
    {
        const list = this.board.lists.find((_list) => {
            return _list.id === listId;
        });

        for ( const cardId of list.idcards )
        {
            this.removeCard(cardId);
        }

        const index = this.board.lists.indexOf(list);

        this.board.lists.splice(index, 1);

        let conncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        let userid = 345;
        let company_id = 115;
        // let userid = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('id', listId.toString())
            .set('method', "boardlist_delete");
            
        console.log('params', params);

        this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: headers,   
            params: params
        })
        .subscribe((response: any) => {
            console.log(response);
            console.log(this.board);
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
    removeCard(cardId, listId?): void
    {
        const card = this.board.cards.find((_card) => {
            return _card.id === cardId;
        });

        if ( listId )
        {
            const list = this.board.lists.find((_list) => {
                return listId === _list.id;
            });
            list.idcards.splice(list.idcards.indexOf(cardId), 1);
        }

        this.board.cards.splice(this.board.cards.indexOf(card), 1);

        let conncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        let userid = 345;

        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let params = new HttpParams()
            .set('conncode', conncode.toString())
            .set('userid', userid.toString())
            .set('id', cardId.toString())
            .set('method', "boardcard_delete");
            
        console.log('params', params);

        this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: headers,   
            params: params
        })
        .subscribe((response: any) => {
            console.log(response);
            console.log(this.board);
            // resolve(this.board);
        });

        this.updateBoard(this.board);
    }

    /**
     * Update card
     *
     * @param newCard
     */
    updateCard(card, listId, boardId): Promise<any>
    {
        this.board.cards.map((_card) => {
            if ( _card.id === card.id )
            {
                return card;
            }
        });

        return new Promise((resolve, reject) => {

            this.board.lists.map((list) => {
                console.log(list);
                if ( list.id === listId )
                {
                    let conncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
                    let userid = 345;
                    let id = 0;

                    let headers = new HttpHeaders();
                    headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
                    let params = new HttpParams()
                        .set('conncode', conncode.toString())
                        .set('userid', userid.toString())
                        .set('id', id.toString())
                        .set('name', card.name)
                        .set('description', card.description)
                        .set('attachmentcoverid', card.attachmentcoverid)
                        .set('subscribed', card.subscribed.toString())
                        .set('checkitems', card.checkitems.toString())
                        .set('checkitemchecked', card.checkitemchecked.toString())
                        .set('due', card.due.toString())
                        .set('listid', listId.toString())
                        .set('boardid', boardId.toString())
                        .set('method', "boardcard_save");
                        
                    console.log('params', params);
                    
                    this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                        headers: headers,   
                        params: params
                    })
                    .subscribe((response: any) => {
                        console.log(response);
                        this.newCardID = response.TrackingXLAPI.DATA[0].id;
                        card.id = this.newCardID;

                        list.idcards.push(this.newCardID);

                        if (this.board.cards.length == 0) {
                            let card_array = [];
                            console.log(card);
                
                            card_array.push(card);
                            console.log(card_array);
                            this.board.cards.push(card_array);
                            console.log(this.board.cards);
                        } else {
                            this.board.cards[0].push(card);
                        }

                        console.log(this.board);

                        this.onBoardChanged.next(this.board);
                        resolve(this.board);
                    }, reject);
                }
            });
        });

        // this.updateBoard(this.board);
    }

    /**
     * Create new board
     *
     * @param board
     * @returns {Promise<any>}
     */
    createNewBoard(board): Promise<any>
    {
        console.log(board);
        return new Promise((resolve, reject) => {
            let conncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
            let userid = 345;
            let id = 0;
            let company_id = 115;
            // let userid = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

            let headers = new HttpHeaders();
            headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
            let params = new HttpParams()
                .set('conncode', conncode.toString())
                .set('userid', userid.toString())
                .set('id', id.toString())
                .set('name', "UndefinedName")
                .set('uri', "untitled-board")
                .set('companyid', company_id.toString())
                .set('method', "board_save");
                
            console.log('params', params);

            // let param_post = {
            //     conncode: conncode.toString(),
            //     userid: userid.toString(),
            //     id: id.toString(),
            //     name: 'UndefinedName',
            //     uri: 'untitled-board',
            //     companyid: company_id.toString(),
            //     method: 'board_save'
            // }

            // let options = {
            //     headers: headers
            // };  

            this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: headers,   
                params: params
            })
            // this._httpClient.post('api/scrumboard-boards/' + board.id, board)
                .subscribe((response: any) => {
                    console.log(response);
                    this.newBoardID = Number(response.TrackingXLAPI.DATA[0].id);
                    board.id = this.newBoardID;
                    this.board = board;
                    console.log(this.board);
                    resolve(this.board);
                }, reject);
        });
    }

    updateBoard(board: any): Promise<any> {
        console.log(board);
        return new Promise((resolve, reject) => {
            let conncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
            let userid = 345;
            let company_id = 115;
            // let userid = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

            let headers = new HttpHeaders();
            headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
            let params = new HttpParams()
                .set('conncode', conncode.toString())
                .set('userid', userid.toString())
                .set('id', board.id.toString())
                .set('name', board.name)
                .set('uri', board.uri)
                .set('companyid', company_id.toString())
                .set('method', "board_save");
                
            console.log('params', params);

            this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: headers,   
                params: params
            })
            .subscribe((response: any) => {
                console.log(response);
                this.board = board;
                console.log(this.board);
                resolve(this.board);
            }, reject);
        });
    }

    deleteBoard(boardId): Promise<any> {
        return new Promise((resolve, reject) => {
            let conncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
            let userid = 345;

            let headers = new HttpHeaders();
            headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
            let params = new HttpParams()
                .set('conncode', conncode.toString())
                .set('userid', userid.toString())
                .set('id', boardId.toString())
                .set('method', "board_delete");
                
            console.log('params', params);
           
            this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
                headers: headers,   
                params: params
            })
            .subscribe((response: any) => {
                console.log(response);
                resolve(response);
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
    )
    {
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @returns {Promise<any>}
     */
    resolve(route: ActivatedRouteSnapshot): Promise<any>
    {
        return this._scrumboardService.getBoard(route.paramMap.get('boardId'));
    }
}
