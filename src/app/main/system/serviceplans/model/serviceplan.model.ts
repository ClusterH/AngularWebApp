export interface ServiceplanDetail
{
    id?: number;
    name?: string;
    isactive?: boolean;
    carrierplanid?: number;
    eventtypes?: number;
    daysinhistory?: number;
    includeignition?: number;
    locatecommand?: string;
    hastrips?: number;
    hasdistance?: boolean;
    distance?: string;
    created?: Date;
    createdby?: number;
    deletedwhen?: Date;
    deletedby?: number;
    lastmodifieddate?: Date;
    lastmodifiedby?: number;
}
