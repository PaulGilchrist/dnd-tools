import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { DataService } from '../../../services/data.service';
declare const utils: any // Javascript utilities

@Component({
    selector: 'monster-lore',
    styleUrls: ['./monster-lore.component.scss'],
    templateUrl: './monster-lore.component.html'
})
export class MonsterLoreComponent implements OnInit, OnDestroy {
    monsters: any[] = [];
    monsterSubtypes: any[] = [];
    subscriptions: Subscription[] = [];
    shownCard = '';
    shownSubtype = '';

    constructor(private route: ActivatedRoute, private router: Router, public domSanitizer: DomSanitizer, public dataService: DataService) { }

    ngOnInit(): void {
        window.history.forward();
        this.subscriptions.push(combineLatest([
            this.dataService.getMonsters(),
            this.dataService.getMonsterSubtypes()
        ]).subscribe((data: any) => {
            this.monsters = data[0];
            this.monsterSubtypes = data[1];
            const index = this.route.snapshot.queryParamMap.get('index');
            if (index) {
                const monsterSubtype = this.monsterSubtypes.find((monsterSubtype) => monsterSubtype.index === index);
                if (monsterSubtype) {
                    this.showSubtype(index);
                    utils.scrollIntoView(monsterSubtype.index);
                }
            }
        }));
    }

    ngOnDestroy(): void {
        // Unsubscribe all subscriptions to avoid memory leak
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    expandCard(index: string, expanded: boolean) {
        if (expanded) {
            this.shownCard = index;
            utils.scrollIntoView(index);
        }
    }

    showSubtype(index: string) {
        console.log(index);
        if (this.shownSubtype == index) {
            this.shownSubtype = '';
        } else {
            this.shownSubtype = index;
            utils.scrollIntoView(index);
        }
        this.router.navigate([], {
            queryParams: { index: index },
            queryParamsHandling: 'merge',
        });
    }

}
