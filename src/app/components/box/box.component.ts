import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Node } from 'src/app/models/Node';

@Component({
  selector: 'box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit {

  @Input("node")
  node: Node;

  @Input("boxAction")
  boxAction: string = null;

  @Input("visited")
  visited;

  @Output("pageAction")
  pageAction:EventEmitter<{action: string, data: any}> = new EventEmitter();
  
  constructor() { }

  ngOnInit() { }

  createPageActionPayload(action: string, data: any){
    return {
      "action": action,
      "data": data
    }
  }
  
  // On clicking on box emitting the respective data payload to parent page for appropriate actions
  onBoxClicked(){
    if(this.boxAction == "BLOCKER" && !this.node.isStart && !this.node.isDestination){
      this.node.setAsBlocked();
    }else if (this.boxAction == "START" && !this.node.isBlocked && !this.node.isDestination){
      this.node.setAsStart();
      this.pageAction.emit(this.createPageActionPayload("CLEAR_BOX_ACTION", null));
      this.pageAction.emit(this.createPageActionPayload("SET_START_NODE", this.node));

    }else if (this.boxAction == "DESTINATION" && !this.node.isStart && !this.node.isBlocked){
      this.node.setAsDestination();
      this.pageAction.emit(this.createPageActionPayload("CLEAR_BOX_ACTION", null));
      this.pageAction.emit(this.createPageActionPayload("SET_DEST_NODE", this.node));

    }
  }


}
