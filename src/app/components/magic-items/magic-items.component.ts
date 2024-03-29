﻿import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';

import { DataService } from '../../services/data.service';
declare const utils: any // Javascript utilities

@Component({
    selector: 'magic-items',
    styleUrls: ['./magic-items.component.scss'],
    templateUrl: './magic-items.component.html'
})
export class MagicItemsComponent implements OnInit, OnDestroy {
    filter = {
        bookmarked: 'All',
        attunement: 'All',
        name: '',
        rarity: 'All',
        type: 'All'
    }
    magicItems: any[] = [];
    shownCard = '';
    subscriptions: Subscription[] = [];

    constructor(private route: ActivatedRoute, private router: Router, public dataService: DataService) { }

    ngOnInit(): void {
        this.subscriptions.push(combineLatest([
            this.dataService.getMagicItems()
        ]).subscribe((data: any) => {
            this.magicItems = data[0];
            console.log(`${this.magicItems.length} magic items`);
            const index = this.route.snapshot.queryParamMap.get('index');
            if (index) {
                const magicItem = this.magicItems.find((magicItem) => magicItem.index === index);
                if (magicItem) {
                    this.expandCard(index, true);
                    utils.scrollIntoView(magicItem.index);
                }
            } else {
                // Set search filters
                let filter = localStorage.getItem('magicItemsFilter');
                if (filter) {
                    this.filter = JSON.parse(filter);
                } else {
                    localStorage.setItem('magicItemsFilter', JSON.stringify(this.filter));
                }
            }
            // Set bookmarked monsters
            let magicItemsBookmarkedJson = localStorage.getItem('magicItemsBookmarked');
            let magicItemsBookmarked: string[] = [];
            if (magicItemsBookmarkedJson != null) {
                magicItemsBookmarked = JSON.parse(magicItemsBookmarkedJson);
            }
            this.magicItems.forEach(magicItem => {
                magicItem.bookmarked = magicItemsBookmarked.includes(magicItem.index);
            })
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
        this.router.navigate([], {
            queryParams: { index: index },
            queryParamsHandling: 'merge',
        });
    }

    filterChanged(): void {
        localStorage.setItem('magicItemsFilter', JSON.stringify(this.filter));
    }

    saveBookmark() {
        let magicItemsBookmarked: string[] = [];
        this.magicItems.forEach(magicItem => {
            if (magicItem.bookmarked == true) {
                magicItemsBookmarked.push(magicItem.index);
            }
        })
        localStorage.setItem('magicItemsBookmarked', JSON.stringify(magicItemsBookmarked));
    }

    showMagicItem(magicItem: any) {
        // Attunement filter
        if (this.filter.attunement != 'All'
            && (
                (this.filter.attunement == 'Required' && !magicItem.desc[0].includes('(requires attunement)'))
                || (this.filter.attunement == 'Not Required' && magicItem.desc[0].includes('(requires attunement)'))
            )
        ) {
            return false;
        }
        // Bookmarked filter
        if (this.filter.bookmarked != 'All' && !magicItem.bookmarked) {
            return false;
        }
        // Name filter
        if (this.filter.name != '' && !magicItem.name.toLowerCase().includes(this.filter.name.toLowerCase())) {
            return false;
        }
        // Rarity filter
        if (this.filter.rarity != 'All' && !magicItem.desc[0].includes(this.filter.rarity)) {
            return false;
        }
        // Type filter
        if (this.filter.type != 'All' && !magicItem.desc[0].startsWith(this.filter.type)) {
            return false;
        }
        return true;
    }

}
