export interface PrivilegeDetail
{
    id?: number;
    name?: string;
    typeid?: number;
    objectid?: number
    isactive?: boolean;
    created?: Date;
    createdby?: number;
    deletedwhen?: Date;
    deletedby?: number;
    lastmodifieddate?: Date;
    lastmodifiedby?: number;
}
