export class Card {
    id: string;
    name: string;
    description: string;
    idattachmentcover: string;
    idmembers: string[];
    idlabels: string[];
    attachments: any[];
    subscribed: boolean;
    checklists: any[];
    checkitems: number;
    checkitemschecked: number;
    comments: any[];
    activities: any[];
    due: string;

    /**
     * Constructor
     *
     * @param card
     */
    constructor(card) {
        this.id = card.id || '';
        this.name = card.name || '';
        this.description = card.description || '';
        this.idattachmentcover = card.idattachmentcover || '';
        this.idmembers = card.idmembers || [];
        this.idlabels = card.idlabels || [];
        this.attachments = card.attachments || [];
        this.subscribed = card.subscribed || true;
        this.checklists = card.checklists || [];
        this.checkitems = card.checkitems || 0;
        this.checkitemschecked = card.checkitemschecked || 0;
        this.comments = card.comments || [];
        this.activities = card.activities || [];
        this.due = card.due || new Date();
    }
}