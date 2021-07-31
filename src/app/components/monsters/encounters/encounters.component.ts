import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'monster-encounters',
  styleUrls: ['./encounters.component.scss'],
  templateUrl: './encounters.component.html'
})
export class EncountersComponent implements OnInit {
  filter = {
    difficulty: 2, //Easy=0, Medium=1, Hard=2, Deadly=3
    playerLevels: [1],
    // environment: 'All',
    // mixedTypes: true, // Allow different rbut elated monsters to be used
    // minMonsters: 1,
    // maxMonsters: 15
  }

  encounterThresholds = [0, 0, 0, 0, 0, 0]; // Recommended total monster XP for 1, 2, 3-6, 7-10, 11-14, and 15+ monsters
  xpThresholds = [
    [  15,   25,   40,    50], // level 0 - For commoners
    [  25,   50,   75,   100], // level 1 - Easy, Medium, Hard, Deadly
    [  50,  100,  150,   200],
    [  75,  150,  225,   400],
    [ 125,  250,  375,   500],
    [ 250,  500,  750,  1100],
    [ 300,  600,  900,  1400],
    [ 350,  750, 1100,  1700],
    [ 450,  900, 1400,  2100],
    [ 550, 1100, 1600,  2400],
    [ 600, 1200, 1900,  2800],
    [ 800, 1600, 2400,  3600],
    [1000, 2000, 3000,  4500],
    [1100, 2200, 3400,  5100],
    [1250, 2500, 3800,  5700],
    [1400, 2800, 4300,  6400],
    [1600, 3200, 4800,  7200],
    [2000, 3900, 5900,  8800],
    [2100, 4200, 6300,  9500],
    [2400, 4900, 7300, 10900],
    [2800, 5700, 8500, 12700]  // level 20 - Easy, Medium, Hard, Deadly
  ];

  ngOnInit(): void {
    // Set search filters
    let filter = localStorage.getItem('encounterFilter');
    if(filter) {
      this.filter = JSON.parse(filter);
    } else {
      localStorage.setItem('encounterFilter', JSON.stringify(this.filter));
    }
    this.calculate();
  }

  addPlayer() {
    this.filter.playerLevels.push(1);
    this.filterChanged();    
  }

  calculate() {
    let xpThreshold = 0;
    this.filter.playerLevels.forEach(pl => xpThreshold += this.xpThresholds[pl][this.filter.difficulty])
    // Calculate recommended total monster XP for the 1, 2, 3-6, 7-10, 11-14, and 15+ monsters
    this.encounterThresholds = [ xpThreshold, Math.round(xpThreshold/1.5), Math.round(xpThreshold/2), Math.round(xpThreshold/2.5), Math.round(xpThreshold/3), Math.round(xpThreshold/4) ];
    this.encounterThresholds[0] = xpThreshold;
  }

  filterChanged() {
    localStorage.setItem('encounterFilter', JSON.stringify(this.filter));
    this.calculate(); 
  }

  onPlayerLevelChange(playerLevelIndex: number, event: any) {
    this.filter.playerLevels[playerLevelIndex] = event.target.value;
    this.filterChanged();   
  }

  removePlayer() {
    this.filter.playerLevels.pop();
    this.filterChanged();    
  }

}
