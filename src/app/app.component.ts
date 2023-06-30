import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from './enum/data-state.enum';
import { Status } from './enum/status.enum';
import { AppState } from './Interface/app-state';
import { CustomResponse } from './Interface/custom-response';
import { ServerService } from './Service/server.service';
import { Server } from './Interface/Server';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  appState$ :Observable<AppState<CustomResponse>>;
  readonly dataState= DataState;
  readonly Status = Status;
  private filterSubject = new BehaviorSubject<string>('');
  filterStatus$ = this.filterSubject.asObservable();
  private dataSubject = new BehaviorSubject<CustomResponse>(null);

  constructor(private serverService: ServerService){}

  ngOnInit():void {
      this.appState$ = this.serverService.servers$
      .pipe(
        map( response => {
          this.dataSubject.next(response);
          return {dataState: DataState.LOADED_STATE, appData: {...response, data:{servers:response.data.servers}} }
        }),
        startWith({dataState: DataState.LOADING_STATE}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error})
        })
      )
  }

  pingServer(ipAddress : string):void {
    this.filterSubject.next(ipAddress);
    this.appState$ = this.serverService.ping$(ipAddress)
    .pipe(
      map( response => {
        const index = this.dataSubject.value.data.servers.findIndex(server =>server.serverId === response.data.server.serverId);
        this.dataSubject.value.data.servers[index] = response.data.server;
          this.filterSubject.next('');
        return {dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
      }),
      startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),
      catchError((error: string) => {
        this.filterSubject.next('');
        return of({dataState: DataState.ERROR_STATE, error})
      })
    )
  }

  saveServer(serverForm : NgForm):void {
    this.appState$ = this.serverService.save$(serverForm.value as Server)
    .pipe(
      map( response => {
        this.dataSubject.next(
          {...response, data:{servers:[response.data.server, ...this.dataSubject.value.data.servers]}});
          serverForm.resetForm({status: this.Status.SERVER_DOWN})
        return {dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
      }),
      startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),
      catchError((error: string) => {
        return of({dataState: DataState.ERROR_STATE, error})
      })
    )
  }

  deleteServer(id : number):void {
    this.appState$ = this.serverService.delete$(id)
    .pipe(
      map( response => {
        this.dataSubject.next(
          {...response, data:{servers: this.dataSubject.value.data.servers.filter(s => s.serverId !== id)}}
        );
        return {dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
      }),
      startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),
      catchError((error: string) => {
        return of({dataState: DataState.ERROR_STATE, error})
      })
    )
  }
}
