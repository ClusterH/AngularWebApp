import { FuseUtils } from '@fuse/utils';

export class Card
{
    id: string;
    name: string;
    description: string;
    attachmentcoverid: string;
    idmembers: string[];
    idlabels: string[];
    attachments: any[];
    subscribed: boolean;
    checklists: any[];
    checkitems: number;
    checkitemchecked: number;
    comments: any[];
    activities: any[];
    due: string;

    /**
     * Constructor
     *
     * @param card
     */
    constructor(card)
    {
        this.id = card.id || '';
        this.name = card.name || '';
        this.description = card.description || '';
        this.attachmentcoverid = card.attachmentcoverid || '';
        this.idmembers = card.idmembers || [];
        this.idlabels = card.idlabels || [];
        this.attachments = card.attachments || [];
        this.subscribed = card.subscribed || true;
        this.checklists = card.checklists || [];
        this.checkitems = card.checkitems || 0;
        this.checkitemchecked = card.checkitemchecked || 0;
        this.comments = card.comments || [];
        this.activities = card.activities || [];
        this.due = card.due || '';
    }
}
