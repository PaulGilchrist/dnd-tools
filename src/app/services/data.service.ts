import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, BehaviorSubject, throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as Showdown from 'showdown';

@Injectable()
export class DataService {
    // Keeping the BehaviorSubject private makes the pointer to the object read only
    //     They still can however modify any propertis the object contains without calling .next() but that should be avoided
    private abilityScores = new BehaviorSubject<any>([]);
    abilityScores$ = this.abilityScores.asObservable();
    private conditions = new BehaviorSubject<any>([]);
    conditions$ = this.conditions.asObservable();
    private equipment = new BehaviorSubject<any>([]);
    equipment$ = this.equipment.asObservable();
    private feats = new BehaviorSubject<any>([]);
    feats$ = this.feats.asObservable();
    private magicItems = new BehaviorSubject<any>([]);
    magicItems$ = this.magicItems.asObservable();
    private monsters = new BehaviorSubject<any>([]);
    monsters$ = this.monsters.asObservable();
    private names = new BehaviorSubject<any>([]);
    names$ = this.names.asObservable();
    private playerClasses = new BehaviorSubject<any>([]);
    playerClasses$ = this.playerClasses.asObservable();
    private races = new BehaviorSubject<any>([]);
    races$ = this.races.asObservable();
    private rules = new BehaviorSubject<any>([]);
    rules$ = this.rules.asObservable();
    private spells = new BehaviorSubject<any>([]);
    spells$ = this.spells.asObservable();
    private weaponProperties = new BehaviorSubject<any>([]);
    weaponProperties$ = this.weaponProperties.asObservable();

    constructor(private http: HttpClient) { }

    getAbilityScores(): Observable<any[]> {
        if (this.abilityScores.getValue().length === 0) {
            return this.http.get('./data/ability-scores.json').pipe(
                tap(data => {
                    console.log('Get - ability scores');
                    this.abilityScores.next(data);
                }),
                map(() => this.abilityScores.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.abilityScores$;
        }
    }

    getConditions(): Observable<any[]> {
        if (this.conditions.getValue().length === 0) {
            return this.http.get('./data/conditions.json').pipe(
                tap(data => {
                    console.log('Get - conditions');
                    this.conditions.next(data);
                }),
                map(() => this.conditions.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.conditions$;
        }
    }

    getEquipment(): Observable<any[]> {
        if (this.equipment.getValue().length === 0) {
            return this.http.get('./data/equipment.json').pipe(
                tap(data => {
                    console.log('Get - equipment');
                    this.equipment.next(data);
                }),
                map(() => this.equipment.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.equipment$;
        }
    }

    getFeats(): Observable<any[]> {
        if (this.feats.getValue().length === 0) {
            return this.http.get('./data/feats.json').pipe(
                tap(data => {
                    console.log('Get - feats');
                    this.feats.next(data);
                }),
                map(() => this.feats.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.feats$;
        }
    }
    
    getMagicItems(): Observable<any[]> {
        if (this.magicItems.getValue().length === 0) {
            return this.http.get('./data/magic-items.json').pipe(
                tap((data) => {
                    console.log('Get - magic items');
                    this.magicItems.next(data);
                }),
                map(() => this.magicItems.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.magicItems$;
        }
    }

    getMonsters(): Observable<any[]> {
        if (this.monsters.getValue().length === 0) {
            return this.http.get('./data/monsters.json').pipe(
                tap((data) => {
                    console.log('Get - monsters');
                    this.monsters.next(data);
                }),
                map(() => this.monsters.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.monsters$;
        }
    }

    getNames(): Observable<any[]> {
        if (this.names.getValue().length === 0) {
            return this.http.get('./data/names.json').pipe(
                tap(data => {
                    console.log('Get - names');
                    this.sort(data, 'name');
                    this.names.next(data);
                }),
                map(() => this.names.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.names$;
        }
    }

    getPlayerClasses(): Observable<any[]> {
        if (this.playerClasses.getValue().length === 0) {
            return this.http.get('./data/classes.json').pipe(
                tap(data => {
                    console.log('Get - player classes');
                    this.playerClasses.next(data);
                }),
                map(() => this.playerClasses.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.playerClasses$;
        }
    }

    getRaces(): Observable<any[]> {
        if (this.races.getValue().length === 0) {
            return this.http.get('./data/races.json').pipe(
                tap(data => {
                    console.log('Get - races');
                    this.races.next(data);
                }),
                map(() => this.races.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.races$;
        }
    }

    getRules(): Observable<any[]> {
        let converter = new Showdown.Converter();
        if (this.rules.getValue().length === 0) {
            return this.http.get('./data/rules.json').pipe(
                tap(data => {
                    console.log('Get - rules');
                    this.rules.next(data);
                }),
                map(() => this.rules.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.rules$;
        }
    }

    getSpells(): Observable<any[]> {
        if (this.spells.getValue().length === 0) {
            return this.http.get('./data/spells.json').pipe(
                tap(data => {
                    console.log('Get - spells');
                    this.spells.next(data);
                }),
                map(() => this.spells.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.spells$;
        }
    }

    getWeaponProperties(): Observable<any[]> {
        if (this.weaponProperties.getValue().length === 0) {
            return this.http.get('./data/weapon-properties.json').pipe(
                tap(data => {
                    console.log('Get - weapon properties');
                    this.weaponProperties.next(data);
                }),
                map(() => this.weaponProperties.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.weaponProperties$;
        }
    }

    private handleError(error: Response) {
        // In the future, we may send the server to some remote logging infrastructure
        console.error(error);
        return observableThrowError(error || 'Server error');
    }

    private sort(inputObjectArray: any, propertyName: string, descending = false) {
        // Sort an array of objects (in place) by the value of a given propertyName either ascending (default) or descending
        if (inputObjectArray && propertyName) {
            inputObjectArray.sort((a: any, b: any) => {
                let aValue = a[propertyName];
                let bValue = b[propertyName];
                if (aValue < bValue) {
                    return descending ? 1 : -1;
                }
                if (bValue < aValue) {
                    return descending ? -1 : 1;
                }
                return 0;
            });
        }
    }

}
