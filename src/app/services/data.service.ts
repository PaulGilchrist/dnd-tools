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
    private magicItems = new BehaviorSubject<any>([]);
    magicItems$ = this.magicItems.asObservable();
    private monsters = new BehaviorSubject<any>([]);
    monsters$ = this.monsters.asObservable();
    private playerClasses = new BehaviorSubject<any>([]);
    playerClasses$ = this.playerClasses.asObservable();
    private races = new BehaviorSubject<any>([]);
    races$ = this.races.asObservable();
    private rules = new BehaviorSubject<any>([]);
    rules$ = this.rules.asObservable();
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

    getPlayerClasses(): Observable<any[]> {
        if (this.playerClasses.getValue().length===0) {
            return combineLatest([
                this.http.get('./data/classes.json'),
                this.http.get('./data/features.json'),
                this.http.get('./data/levels.json')
              ]).pipe(
                tap(data => {
                    // @ts-ignore
                    let playerClasses: any[] = data[0];
                    // @ts-ignore
                    let features: any[] = data[1];
                    // @ts-ignore
                    let levels: any[] = data[2];
                    console.log('Get - Player Classes');
                    this.sort(playerClasses, 'name');
                    // Append levels to each class
                    playerClasses.forEach(playerClass => {
                        // Append feature that don't have a level
                        playerClass.features = features.filter(feature => feature.class.index == playerClass.index && !feature.level);
                        playerClass.class_levels = levels.filter(level => level.class.index == playerClass.index && level.ability_score_bonuses != null);
                        // Add features to each level
                        playerClass.class_levels.forEach((level: any) => {
                            level.feature_choices = features.filter(feature => feature.class.index == playerClass.index && feature.level == level.level && level.feature_choices.find((f: any) => f.index == feature.index));
                            this.sort(level.feature_choices, 'name');
                            level.features = features.filter(feature => feature.class.index == playerClass.index && feature.level == level.level && level.features.find((f: any) => f.index == feature.index));
                            this.sort(level.features, 'name');
                        });
                    });
                    this.playerClasses.next(playerClasses);
                }),
                map(data => this.playerClasses.getValue()),
                catchError(this.handleError)
            );
        } else {
            return this.playerClasses$;
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

    getRules(): Observable<any[]> {
        let converter = new Showdown.Converter();
        if (this.rules.getValue().length===0) {
            return combineLatest([
                this.http.get('./data/rules.json'),
                this.http.get('./data/rule-sections.json')
              ]).pipe(
                tap(data => {
                    // @ts-ignore
                    let rules: any[] = data[0];
                    // @ts-ignore
                    let ruleSections: any[] = data[1];
                    console.log('Get - rules');
                    // Append on each section
                    rules.forEach(rule => {
                        rule.desc = converter.makeHtml(rule.desc);
                        // Add subsection descriptions to rule.subsection
                        // @ts-ignore
                        rule.subsections.forEach(subsection => {
                            let foundSubSection = ruleSections.find(rs => rs.index == subsection.index);
                            if(foundSubSection) {
                                // Remove the first line as it just duplicates the name
                                let index = foundSubSection.desc.indexOf("\n\n");
                                subsection.desc = converter.makeHtml(foundSubSection.desc.substr(index+1,Number.MAX_SAFE_INTEGER));
                            }
                        });
                    });
                    this.rules.next(rules);
                }),
                map(data => this.rules.getValue()),
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
