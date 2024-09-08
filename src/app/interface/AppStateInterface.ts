export type modeType = 'full-map' | 'min-map'

export interface AppState {
  uid:string|null,
  mode: modeType,
  isRoomActive:boolean
}