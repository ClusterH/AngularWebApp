export interface VehicleDetail
{
    id?: number;
    name?: string;
    companyid?: number;
    groupid?: number;
    subgroup?: number;
    accountid?: number;
    operatorid?: number;
    unittypeid?: number;
    serviceplanid?: number;
    producttypeid?: number;
    makeid?: number;
    modelid?: number;
    isactive?: boolean;
    timezoneid?: number
    created?: Date;
    createdby?: number;
    deletedwhen?: Date;
    deletedby?: number;
    lastmodifieddate?: Date;
    lastmodifiedby?: number;
}
