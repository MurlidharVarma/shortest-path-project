import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit {

  @Input("row")
  row: Number;

  @Input("col")
  col: Number;

  isSelected:boolean = false;
  
  constructor() { }

  ngOnInit() {
  }

  toggleSelect(){
    this.isSelected=true;
  }
}
