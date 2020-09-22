export interface VehicleDetail {
    id?: string;
    name?: string;
    companyid?: string;
    groupid?: string;
    subgroup?: string;
    accountid?: string;
    operatorid?: string;
    unittypeid?: string;
    serviceplanid?: string;
    producttypeid?: string;
    makeid?: string;
    modelid?: string;
    isactive?: boolean;
    timezoneid?: string
    created?: Date;
    createdby?: string;
    deletedwhen?: Date;
    deletedby?: string;
    lastmodifieddate?: Date;
    lastmodifiedby?: string;
}