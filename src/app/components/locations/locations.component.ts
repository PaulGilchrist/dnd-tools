import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { DataService } from '../../services/data.service';
declare const utils: any // Javascript utilities

@Component({
    selector: 'locations-lore',
    styleUrls: ['./locations.component.scss'],
    templateUrl: './locations.component.html'
})
export class LocationsComponent implements OnInit, OnDestroy {
    image = '';
    locations: any[] = [];
    subscriptions: Subscription[] = [];
    shownCard = '';

    constructor(private route: ActivatedRoute, private router: Router, public domSanitizer: DomSanitizer, public dataService: DataService) { }

    ngOnInit(): void {
        window.history.forward();
        this.subscriptions.push(combineLatest([
            this.dataService.getLocations()
        ]).subscribe((data: any) => {
            this.locations = data[0];
            const index = this.route.snapshot.queryParamMap.get('index');
            if (index) {
                const location = this.locations.find((location) => location.index === index);
                if (location) {
                    this.expandCard(index);
                    utils.scrollIntoView(location.index);
                }
            }
        }));
    }

    ngOnDestroy(): void {
        // Unsubscribe all subscriptions to avoid memory leak
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    expandCard(index: string) {
        if (this.shownCard == index) {
            this.shownCard = '';
        } else {
            this.shownCard = index;
            utils.scrollIntoView(index);
        }
        this.router.navigate([], {
            queryParams: { index: index },
            queryParamsHandling: 'merge',
        });
    }

}
