export interface CommandDetail
{
    id?: number;
    name?: string;
    isactive?: boolean;
    createdby?: number;
    createdwhen?: Date;
    lastmodifiedby?: number;
    lastmodifieddate?: Date;

    // lastmodifiedbyname: string
}
