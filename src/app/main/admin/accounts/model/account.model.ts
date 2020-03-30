export interface AccountDetail
{
    id?: number;
    name?: string;
    address?: string;
    email?: string;
    phonenumber?: string;
    contactname?: string;
    billingstatusid?: number;
    billingfrequency?: number;
    isactive?: boolean;
    created?: Date;
    createdby?: number;
    deletedwhen?: Date;
    deletedby?: number;
    lastmodifieddate?: Date;
    lastmodifiedby?: number;
}
