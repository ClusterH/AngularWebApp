export interface SimcardDetail {
    id?: number;
    name?: string;
    phonenumber?: string;
    carrierid?: number;
    isactive?: boolean;
    timezoneid?: number
    created?: Date;
    createdby?: string;
    deletedwhen?: Date;
    deletedby?: number;
    lastmodifieddate?: Date;
    lastmodifiedby?: string;
}
