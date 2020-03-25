export interface OperatorDetail
{
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    phonenumber?: string;
    operatortypeid?: number; 
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
    filephoto?: string;
    birthdate?: string;
    sin?: string;
    hiredate?: string;
    physicaltestexpirydate?: string;
    licenseexpirationdate?: string;
    driverlicensenumber?: string
}
