import { FuseUtils } from '@fuse/utils';

export class List
{
    id: string;
    name: string;
    idcards: string[];

    /**
     * Constructor
     *
     * @param list
     */
    constructor(list)
    {
        this.id = list.id || '';
        this.name = list.name || '';
        this.idcards = [];
    }
}
