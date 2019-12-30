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

  @Output("pageAction")
  pageAction:EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  toggleBlocked(){
    if(this.boxAction == "BLOCKER" && !this.node.isStart && !this.node.isDestination){
      this.node.setAsBlocked();
    }else if (this.boxAction == "START" && !this.node.isBlocked && !this.node.isDestination){
      this.node.setAsStart();
      this.pageAction.emit("CLEAR_BOX_ACTION");
    }else if (this.boxAction == "DESTINATION" && !this.node.isStart && !this.node.isBlocked){
      this.node.setAsDestination();
      this.pageAction.emit("CLEAR_BOX_ACTION");
    }
  }
}
