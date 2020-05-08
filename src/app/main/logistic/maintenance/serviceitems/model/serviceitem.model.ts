export interface ServiceitemDetail
{
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    serviceitemprofileid?: number;
    timezoneid?: number
    lengthunitid?: number;
    fuelunitid?: number;
    weightunitid?: number;
    tempunitid?: number;
    isactive?: boolean;
    companyid?: number;
    groupid?: number;
    subgroup?: number;
    created?: Date;
    createdby?: number;
    deletedwhen?: Date;
    deletedby?: number;
    lastmodifieddate?: Date;
    lastmodifiedby?: number;
    languageid?: number;
}
