import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

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
    private magicItems = new BehaviorSubject<any>([]);
    magicItems$ = this.magicItems.asObservable();
    private monsters = new BehaviorSubject<any>([]);
    monsters$ = this.monsters.asObservable();
    private races = new BehaviorSubject<any>([]);
    races$ = this.races.asObservable();
    private skills = new BehaviorSubject<any>([]);
    skills$ = this.skills.asObservable();
    private spells = new BehaviorSubject<any>([]);
    spells$ = this.spells.asObservable();
    private traits = new BehaviorSubject<any>([]);
    traits$ = this.traits.asObservable();
    private weaponProperties = new BehaviorSubject<any>([]);
    weaponProperties$ = this.weaponProperties.asObservable();

    constructor(private http: HttpClient) {}

    getAbilityScores(): Observable<any[]> {
        if (this.abilityScores.getValue().length===0) {
            return this.http.get('./data/ability-scores.json').pipe(
                tap(data => {
                    console.log('Get - ability scores');
                    this.abilityScores.next(data);
                }),
                map(data => this.abilityScores.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.abilityScores$;
        }
    }

    getConditions(): Observable<any[]> {
        if (this.conditions.getValue().length===0) {
            return this.http.get('./data/conditions.json').pipe(
                tap(data => {
                    console.log('Get - conditions');
                    this.sort(data, 'name');
                    this.conditions.next(data);
                }),
                map(data => this.conditions.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.conditions$;
        }
    }

    getEquipment(): Observable<any[]> {
        if (this.equipment.getValue().length===0) {
            return this.http.get('./data/equipment.json').pipe(
                tap(data => {
                    console.log('Get - equipment');
                    this.sort(data, 'name');
                    this.equipment.next(data);
                }),
                map(data => this.equipment.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.equipment$;
        }
    }
    
    getMagicItems(): Observable<any[]> {
        if (this.magicItems.getValue().length===0) {
            return this.http.get('./data/magic-items.json').pipe(
                tap(data => {
                    console.log('Get - magic items');
                    this.sort(data, 'name');
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
                    this.sort(data, 'name');
                    this.monsters.next(data);
                }),
                map(data => this.monsters.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.monsters$;
        }
    }

    getRaces(): Observable<any[]> {
        if (this.races.getValue().length===0) {
            return this.http.get('./data/races.json').pipe(
                tap(data => {
                    console.log('Get - races');
                    this.sort(data, 'name');
                    this.races.next(data);
                }),
                map(data => this.races.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.races$;
        }
    }

    getSkills(): Observable<any[]> {
        if (this.skills.getValue().length===0) {
            return this.http.get('./data/skills.json').pipe(
                tap(data => {
                    console.log('Get - skills');
                    this.sort(data, 'name');
                    this.skills.next(data);
                }),
                map(data => this.skills.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.skills$;
        }
    }

    getSpells(): Observable<any[]> {
        if (this.spells.getValue().length===0) {
            return this.http.get('./data/spells.json').pipe(
                tap(data => {
                    console.log('Get - spells');
                    this.sort(data, 'name');
                    this.spells.next(data);
                }),
                map(data => this.spells.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.spells$;
        }
    }

    getTraits(): Observable<any[]> {
        if (this.traits.getValue().length===0) {
            return this.http.get('./data/traits.json').pipe(
                tap(data => {
                    console.log('Get - traits');
                    this.sort(data, 'name');
                    this.traits.next(data);
                }),
                map(data => this.traits.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.traits$;
        }
    }

    getWeaponProperties(): Observable<any[]> {
        if (this.weaponProperties.getValue().length===0) {
            return this.http.get('./data/weapon-properties.json').pipe(
                tap(data => {
                    console.log('Get - weapon properties');
                    this.sort(data, 'name');
                    this.weaponProperties.next(data);
                }),
                map(data => this.weaponProperties.getValue()),
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
