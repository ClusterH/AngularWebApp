export interface CompanyDetail
{
    id?: number;
    name?: string;
    orgno?: string;
    accountid?: number;
    companytypeid?: number;
    userprofileid?: number;
    isactive?: boolean;
    created?: Date;
    createdby?: number;
    deletedwhen?: Date;
    deletedby?: number;
    lastmodifieddate?: Date;
    lastmodifiedby?: number;
    logofile?: string;
    address?: string;
    country?: string;
    contactname?: string;
    phone?: string;
    email?: string;
    comments?: string;
    billingnote?: string;
    emailserver?: string;
    emailsender?: string;
    emailuser?: string;
    emailpassword?: string;
    webstartlat?: number;
    webstartlong?: number;
    hasprivatelabel?: boolean;
}
