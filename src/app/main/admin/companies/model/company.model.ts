export interface CompanyDetail
{
    id?: number;
    name?: string;
    orgno?: string;
    accountid?: number;
    companytypeid?: number;
    userprofileid?: number;
    isactive?: boolean;
    created?: Date;
    createdby?: number;
    deletedwhen?: Date;
    deletedby?: number;
    lastmodifieddate?: Date;
    lastmodifiedby?: number;
}
