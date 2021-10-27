import { Injectable } from '@angular/core';
import { Hero } from '../heroes/models/hero';
import { HEROES } from '../heroes/models/mock-heroes';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';  // URL to web api
/** GET heroes from the server */
getHeroes(): Observable<Hero[]> {
  return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this._log('fetched heroes')),
      catchError(this._handleError<Hero[]>('getHeroes', []))
    );
}

  private _handleError<T>(operation = 'operation', result?: T){
    return (error: any): Observable<T> =>{
      this._log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }

  private _log(message: string):void{
    this.messageService.add(`HeroService: ${message}`);
  }
  constructor(private messageService: MessageService, private http: HttpClient) { }



  // With observables
  // getHeroes(): Observable<Hero[]> {
  //   const heroes = of(HEROES);
  //   this.messageService.add('HeroService: fetched heroes');
  //   return heroes;
  // }


  // special url with id, single hero from server at Obervable
  getHero(id: number): Observable<Hero>{
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_=> this._log(`fetched hero id=${id}`)),
      catchError(this._handleError<Hero>(`getHero id=${id}`))
    )
  }

  update(hero:Hero): Observable<any>{
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
    tap(_=> this._log(`updated hero id=${hero.id}`)),
    catchError(this._handleError<any>('updateHero'))
    )
  }

  add(hero: Hero): Observable<Hero>{
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero)=> this._log(`added hero w/ id=${newHero.id}`)),
      catchError(this._handleError<Hero>('addHero'))
    )
  }

  deleteHero( id: number): Observable<Hero>{
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_=>this._log(`deleted hero id=${id}`)),
      catchError(this._handleError<Hero>('deleteHero'))
    );
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type':'application/json'})
  };



}
