import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    selector: 'nav-top',
    styleUrls: ['./nav-top.component.scss'],
    templateUrl: './nav-top.component.html'
})
export class NavTopComponent implements OnInit{
    constructor(private router: Router){}

    ngOnInit(): void {
        const url = localStorage.getItem('url');
        if (url != null) {
            localStorage.removeItem('url');
            this.router.navigateByUrl(url);
        }
   }
}
