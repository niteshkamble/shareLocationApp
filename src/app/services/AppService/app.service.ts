import { Injectable } from '@angular/core';
import { BehaviorSubject,Observable } from 'rxjs';
import { AppState, modeType } from 'src/app/interface/AppStateInterface';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  
  private initialState: AppState = {
    uid:null,
    mode: 'min-map',
    isRoomActive:false
  }

  private appStateSubject = new BehaviorSubject<AppState>(this.initialState);

  appState$: Observable<AppState> = this.appStateSubject.asObservable();

  constructor() { }

  updateAppState(updatedState: Partial<AppState>) {
    const currentState = this.appStateSubject.value;
    this.appStateSubject.next({ ...currentState, ...updatedState });
  }

  toggleMapMode(newMode: modeType): void {
    const currentState = this.appStateSubject.value;
    const updatedState: AppState = {
      ...currentState,
      mode: newMode
    };

    this.appStateSubject.next(updatedState);
  }

  updateRoomStatus(isRoomActive: boolean){
    const currentState = this.appStateSubject.value;
    const updatedState: AppState = {
      ...currentState,
      isRoomActive
    };

    this.appStateSubject.next(updatedState);
  }

  updateUserUid(uid:string){
    const currentState = this.appStateSubject.value;
    const updatedState: AppState = {
      ...currentState,
      uid
    };

    this.appStateSubject.next(updatedState);
  }

  
}
