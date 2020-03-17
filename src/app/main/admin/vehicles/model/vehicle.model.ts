export interface VehicleDetail
{
    id?: number;
    name?: string;
    companyid?: number;
    // company: string;
    groupid?: number;
    // group: string;
    subgroup?: number;
    accountid?: number;
    // account: string;
    operatorid?: number;
    // operator: string;
    unittypeid?: number;
    // unittype: string;
    serviceplanid?: number;
    // serviceplan: string;
    producttypeid?: number;
    // producttype: string;
    makeid?: number;
    // make: string;
    modelid?: number;
    // model: string;
    isactive?: boolean;
    timezoneid?: number
    // timezone: string;
    created?: Date;
    createdby?: number;
    // createdbyname: string;
    deletedwhen?: Date;
    deletedby?: number;
    // deletedbyname: string;
    lastmodifieddate?: Date;
    lastmodifiedby?: number;
    // lastmodifiedbyname: string
}
