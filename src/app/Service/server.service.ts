import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscriber, throwError } from 'rxjs';
import { catchError,tap } from 'rxjs/operators';
import { Status } from '../enum/status.enum';
import { CustomResponse } from '../Interface/custom-response';
import { Server } from '../Interface/Server';

@Injectable({
  providedIn: 'root'
})

export class ServerService {

  constructor( private http: HttpClient) { }
  private readonly apiUrl= 'http://localhost:8080';

  // procedural approach
  getServers():Observable<CustomResponse>{
    return this.http.get<CustomResponse>(`${this.apiUrl}/server/list`)
  }

  //practical approach
  servers$=<Observable<CustomResponse>> 
  this.http.get<CustomResponse>(`${this.apiUrl}/server/list`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
    );

  save$=(server:Server)=><Observable<CustomResponse>> 
  this.http.post<CustomResponse>(`${this.apiUrl}/server/save`,server)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
    );

  ping$=(ipAddress : string)=><Observable<CustomResponse>> 
  this.http.get<CustomResponse>(`${this.apiUrl}/server/ping/${ipAddress}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
    );

  serverbyid$=(serverid : number)=><Observable<CustomResponse>> 
  this.http.get<CustomResponse>(`${this.apiUrl}/server/${serverid}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
    );

  delete$=(serverId : number)=><Observable<CustomResponse>> 
  this.http.delete<CustomResponse>(`${this.apiUrl}/server/delete/${serverId}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
    );

  private handleError(error: HttpErrorResponse): Observable<never>{
    console.log(error)
    return throwError(() => new Error(`an error occured - Error code : ${error.status}`));
  }

}
