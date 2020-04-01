export interface DeviceDetail
{
    id?: number;
    name?: string;
    simcardid?: number;
    devicetypeid?: number;
    conninid?: number;
    connoutid?: number;
    connsmsid?: number;
    imei?: string;
    serialnumber?: string;
    activationcode?: string;
    created?: Date;
    createdby?: number;
    deletedwhen?: Date;
    deletedby?: number;
    lastmodifieddate?: Date;
    lastmodifiedby?: number;
}
