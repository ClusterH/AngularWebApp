export interface UserProfileDetail
{
    id?: number;
    name?: string;
    isactive?: boolean;
    companyid?: number;
    createdby?: number;
    createdwhen?: Date;
    lastmodifiedby?: number;
    lastmodifieddate?: Date;

    // lastmodifiedbyname: string
}
