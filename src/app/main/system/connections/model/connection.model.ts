export interface ConnectionDetail
{
    id?: number;
    name?: string;
    conntype?: string;
    localport?: number;
    protocolid?: number;
    isactive?: boolean;
    timezoneid?: number
    created?: Date;
    createdby?: number;
    deletedwhen?: Date;
    deletedby?: number;
    lastmodifieddate?: Date;
    lastmodifiedby?: number;
}
