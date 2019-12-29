import { Component, OnInit } from '@angular/core';
import * as _ from 'underscore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  NO_OF_ROWS=20;
  NO_OF_COLS=50;

  gridRows:Array<Number> = null;
  gridCols:Array<Number> = null;
  

  constructor() { 
    // create a range array of rows and cols
    this.gridRows = _.range(this.NO_OF_ROWS);
    this.gridCols = _.range(this.NO_OF_COLS);
  }

  ngOnInit() {
  }

}
