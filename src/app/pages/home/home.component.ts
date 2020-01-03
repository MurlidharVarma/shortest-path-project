import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Node } from 'src/app/models/Node';
import * as _ from 'underscore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  MAX_ROWS = 14;
  MAX_COLS = 30;
  
  // initializing number of rows and columns
  NO_OF_ROWS=this.MAX_ROWS;
  NO_OF_COLS=this.MAX_COLS;

  gridRows:Array<Number> = null;
  gridCols:Array<Number> = null;
  
  // store the Nodes as 2D array
  gridArr: Array<Array<Node>> = null

  // to pass actions to Box from Parent page
  boxAction: string = null;

  // Form that holds metadata 
  toolForm: FormGroup = null;

  // Store nodes who need to be evaluated
  evalNodeList = [];

  constructor(private fb: FormBuilder) { 
    this.toolForm = this.fb.group({
      "rows" : [this.MAX_ROWS, Validators.compose([Validators.required, Validators.min(3), Validators.max(this.MAX_ROWS)])],
      "cols" : [this.MAX_COLS, Validators.compose([Validators.required, Validators.min(3), Validators.max(this.MAX_COLS)])],
      "startNode": [null, Validators.required],
      "destNode": [null, Validators.required],
      "isVisualizeOn": [false],
      "visualDelay":[30]
    });

    // subscribe to any changes to Metadata and modify grid accordingly
    this.toolForm.valueChanges.subscribe(formData => {
      if(formData.rows && formData.cols && this.toolForm.get("rows").valid && this.toolForm.get("cols").valid){
        if(this.NO_OF_ROWS != formData.rows || this.NO_OF_COLS != formData.cols){
          this.NO_OF_ROWS = formData.rows;
          this.NO_OF_COLS = formData.cols;
          this.generateGrid();
        }
      }
    });
  }

  ngOnInit() {
    // create a range array of rows and cols
    this.generateGrid();
  }

  //Initialize Node values and generate Node Grids
  generateGrid(){
    this.gridRows = _.range(this.NO_OF_ROWS);
    this.gridCols = _.range(this.NO_OF_COLS);

    // Creating a 2D matrix of Node objects.
    this.gridArr = _.chain(this.gridRows)
                    .map(y => {
                      return _.chain(this.gridCols)
                              .map(x =>{
                                let n = new Node();
                                n.setPosition(y,x);
                                return n;
                              })
                              .value();
                    })
                    .value();
  }

  // Based on button clicks setting the respective boxes with appropriate designation like start node,
  // destination node, blocker nodes
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

  // reset box action
  clearBoxAction(){
    this.boxAction = null;
  }

  // initiate actions on page based on events propagated from individual boxes
  pageAction(event){
    let {action, data} = event;
    
    if(action == "CLEAR_BOX_ACTION"){
      this.clearBoxAction();
    }else if(action == "SET_START_NODE"){
      this.toolForm.get("startNode").setValue(data);
    }else if(action == "SET_DEST_NODE"){
      this.toolForm.get("destNode").setValue(data);
    }
  }

  // Util method to entire grid's Node's specific property to a specific value
  resetGridProperty(propertName, value){
    for(let row of this.gridArr){
      for (let node of row){
        node[propertName]=value;
      }
    }
  }

  resetPage(){
    this.gridArr = null;
    this.toolForm.reset({
      rows: this.MAX_ROWS,
      cols: this.MAX_COLS,
      startNode: null,
      destNode: null,
      isVisualizeOn: false,
      visualDelay: 30
    });
    this.boxAction = null;
    this.evalNodeList = [];
    this.generateGrid();
  }


  async findShortestPath(){
    //if the metadata has error then do not proceed
    if(this.toolForm.invalid){
      return;
    }

    let startNode = this.toolForm.get("startNode").value;
    let destNode = this.toolForm.get("destNode").value;
    let destNeighbours = this.findNeighbours(destNode);

    // including start node as first evaluating node
    this.evalNodeList.push(startNode);
    
    // loop through nodes in evaluation node list
    for(let node of this.evalNodeList){
      //for visualization - turn on node to green
      this.toggleNodeInProcess(node);

      //if the node is not visited then check neighbours
      if(!node.isVisited){
        this.updateNeighborsDistance(node);
      }
      //for visualization - include delay for visualize green flow
      if(this.toolForm.get("isVisualizeOn").value){
        await this.delay(this.toolForm.get('visualDelay').value);
      }
      //for visualization - turn off node from green
      this.toggleNodeInProcess(node);

      // loop should break if all the neighbours of destination node is visited
      if(this.checkIfDestReached(destNeighbours)){
        break;
      }
    }

    // Plotting the shortest distance path.
    // this is backtracking from destination node all the way to start node via distance and distanceFrom node
    // distanceFrom attribute store the previous visted node in shortest path
    let currNode =destNode
    for(let idx=0; idx<destNode.distance-1; idx++){
      let prevNodeInShortestPath = currNode.distanceFrom;
      this.gridArr[prevNodeInShortestPath.y][prevNodeInShortestPath.x].isInShortestPath = true;
      currNode = prevNodeInShortestPath;
    }
  }

  // For visualization. To toggle between if the node being passed is currently being evaluated.
  // Green color is given to box if the isInProgress is set to true.
  toggleNodeInProcess(node:Node){
    node.isInProgress = !node.isInProgress;
  }

  // Check if all the destination node neighbours are visited / blocked.
  // if they all are visited then algorithm is complete
  checkIfDestReached(neighbours){
    let isAllNeighbourVisited = true;

    for(let pos of neighbours){
      let node = this.gridArr[pos.y][pos.x];
      isAllNeighbourVisited = isAllNeighbourVisited && (node.isVisited || node.isBlocked);
    }

    if(isAllNeighbourVisited){
      return true;
    }else{
      return false;
    }
  }
  
  // Evaluating the neighbours distance of visiting node being passed.
  // The neighbours will then be added to evaulation list for being evaulated down in flow.
  updateNeighborsDistance = (node:Node) => {
    let neighbours = this.findNeighbours(node);

    if(neighbours){
      for (let pos of neighbours){

        let n = this.gridArr[pos.y][pos.x]; 
        this.gridArr[pos.y][pos.x] = n.updateDistanceFrom(node);

        if(!n.isDestination && !n.isStart && !n.isBlocked && !n.isVisited){
          // adding to evaluation list
          this.evalNodeList.push(n);
        }
      }
    }
    // Mark the visiting node as Visited once the neighbour's distance are calculated 
    // and added to evaluation list
    node.setAsVisited();
  }

  //Find neighbours based on grid boundary restrictions
  findNeighbours({x, y}){
    
    let validNeighors = [];

    //if left is restricted
    if(x == 0){
      validNeighors.push({"x": x+1,y});
    }
    //if right is restricted
    else if (x == this.NO_OF_COLS-1){
      validNeighors.push({"x": x-1,y});
    }
    //if no x direction restriction
    else{
      validNeighors.push({"x": x+1,y});
      validNeighors.push({"x":x-1,y});
    }

    //if up is restricted
    if(y == 0){
      validNeighors.push({x,"y":y+1});
    }
    //if down is restricted
    else if (y == this.NO_OF_ROWS-1){
      validNeighors.push({x,"y":y-1});
    }
    //if no y direction restriction
    else{
      validNeighors.push({x,"y":y+1});
      validNeighors.push({x,"y":y-1});
    }

    return validNeighors;
  }

  //to introduce pause during visualization
  delay(ms: number){
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
