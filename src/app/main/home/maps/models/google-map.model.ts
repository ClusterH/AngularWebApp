export interface LanguageModel {
    id: string, title: string, flag: string
}

export interface ZoneRouteModel {
    name: string, lat: number, lng: number, isSelected?: boolean
}