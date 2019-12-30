import { Component, OnInit } from '@angular/core';
import { Node } from 'src/app/models/Node';
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
  
  gridArr: Array<Array<Node>> = null

  boxAction: string = null;

  constructor() { 
    // create a range array of rows and cols
    this.gridRows = _.range(this.NO_OF_ROWS);
    this.gridCols = _.range(this.NO_OF_COLS);

    // Creating a 2D matrix of Node objects.
    this.gridArr = _.chain(this.gridRows)
                    .map(y => {
                      return _.chain(this.gridCols)
                              .map(x =>{
                                let n = new Node();
                                n.setPosition(x,y);
                                return n;
                              })
                              .value();
                    })
                    .value();

    console.log(this.gridArr);

  }

  ngOnInit() { }

  setBoxAction(boxAction){
    if(boxAction === 'START'){
      this.resetGridProperty('isStart',false);
      this.boxAction = boxAction;
    }else if (boxAction == 'DESTINATION'){
      this.resetGridProperty('isDestination',false);
      this.boxAction = boxAction;
    }else if (boxAction ==='BLOCKER')
      if(this.boxAction ==='BLOCKER'){
        this.clearBoxAction();
      }else{
        this.boxAction = boxAction;
      }
  }

  clearBoxAction(){
    this.boxAction = null;
  }

  pageAction(event){
    console.log(event);
    if(event == "CLEAR_BOX_ACTION"){
      this.clearBoxAction();
    }
  }

  resetGridProperty(propertName, value){
    for(let row of this.gridArr){
      for (let node of row){
        node[propertName]=value;
      }
    }
  }
}
