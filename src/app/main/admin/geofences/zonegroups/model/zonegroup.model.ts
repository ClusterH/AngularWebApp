export interface ZonegroupDetail
{
    id?: number;
    name?: string;
    companyid?: number;
    groupid?: number;
    subgroup?: number;
    zoneid?: number;
    zonetypeid?: number;
    radius?: number;
    address?: string;
    latitude?: number;
    longitude?: number;
    isactive?: boolean;
    created?: Date;
    createdby?: number;
    deletedwhen?: Date;
    deletedby?: number;
    lastmodifieddate?: Date;
    lastmodifiedby?: number;
}
