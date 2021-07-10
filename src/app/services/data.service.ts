import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class DataService {
    // Keeping the BehaviorSubject private makes the pointer to the object read only
    //     They still can however modify any propertis the object contains without calling .next() but that should be avoided
    private magicItems = new BehaviorSubject<any>([]);
    magicItems$ = this.magicItems.asObservable();
    private monsters = new BehaviorSubject<any>([]);
    monsters$ = this.monsters.asObservable();
    private spells = new BehaviorSubject<any>([]);
    spells$ = this.spells.asObservable();

    constructor(private http: HttpClient) {}

    getMagicItems(): Observable<any[]> {
        if (this.magicItems.getValue().length===0) {
            return this.http.get('./data/magic-items.json').pipe(
                tap(data => {
                    console.log('Get - magic items');
                    this.magicItems.next(data);
                }),
                map(data => this.magicItems.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.magicItems$;
        }
    }

    getMonsters(): Observable<any[]> {
        if (this.monsters.getValue().length===0) {
            return this.http.get('./data/monsters.json').pipe(
                tap(data => {
                    console.log('Get - monsters');
                    this.monsters.next(data);
                }),
                map(data => this.monsters.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.monsters$;
        }
    }

    getSpells(): Observable<any[]> {
        if (this.spells.getValue().length===0) {
            return this.http.get('./data/spells.json').pipe(
                tap(data => {
                    console.log('Get - spells');
                    this.spells.next(data);
                }),
                map(data => this.spells.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.spells$;
        }
    }

	private handleError(error: Response) {
		// In the future, we may send the server to some remote logging infrastructure
		console.error(error);
		return observableThrowError(error || 'Server error');
	}

}
