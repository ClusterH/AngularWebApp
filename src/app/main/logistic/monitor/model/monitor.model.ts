export interface Monitor {
    id?: number;
    unit?: string;
    driver?: string;
    route?: string;
    start?: string;
    fromto?: string;
    progress?: string;
    delay?: string;
    stops?: [];
}

export interface RouteDetail {
    id?: number;
    stop_client?: string;
    time?: string;
    arrived?: string;
    eta?: string;
    leave?: string;
    duration?: string;
    delay_detail?: string;
}
