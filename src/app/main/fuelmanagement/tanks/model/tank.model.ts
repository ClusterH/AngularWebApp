export interface TankDetail {
    id?: number;
    name?: string;
    isactive?: boolean;
    capacity?: number;
    company?: string;
    companyid?: string;
    group?: string;
    groupid?: string;
    hassensor?: boolean;
    lastreport?: string;
    level?: number;
    levelunit?: string;
    levelunitid?: number;
    temp?: number;
    tempunit?: string;
    tempunitid?: number;
    volume?: number;
    volumeunit?: string;
    volumeunitid?: number;
    createdby?: number;
    createdwhen?: Date;
    lastmodifiedby?: number;
    lastmodifieddate?: Date;

    // lastmodifiedbyname: string
}
