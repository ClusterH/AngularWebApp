export interface VehicleModel {
  id: number,
  name: string,
  label: string,
  lat: number,
  lng: number,
  draggable: string,
  ignition: boolean,
  Speed: number,
  ValidGPS: boolean,
  LastReport: string,
  unittypeid: number,
  producttypeid: number,
  isSelected?: boolean,
}

export interface POIModel {
  id: number,
  name: string,
  label: string,
  latitude: number,
  lngitude: number,
  draggable: string,
  ignition: boolean,
  Speed: number,
  ValidGPS: boolean,
  LastReport: string,
  unittypeid: number,
  producttypeid: number,
  isSelected?: boolean,
}

export interface NewPOIModel {
  id?: number,
  name?: string,
  address?: string,
  latitude?: number,
  longitude?: number,
  created?: string,
  createdby?: string
}