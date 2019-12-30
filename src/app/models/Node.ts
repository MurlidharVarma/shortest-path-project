export class Node {
    x: number;
    y: number;
    distance: number | null;
    isVisited: boolean;
    isBlocked: boolean;
    isStart: boolean;
    isDestination: boolean;

    constructor(){
        this.x=0;
        this.y=0;
        this.distance=null;
        this.isVisited=false;
        this.isBlocked=false;
    }

    setAsBlocked(){
        this.isBlocked = true;
    }

    setAsVisited(){
        this.isVisited = true;
    }

    setAsStart(){
        this.isStart = true;
        this.distance = 0;
        this.isVisited = true;
    }

    setAsDestination(){
        this.isDestination = true;
    }

    setPosition(row:number, col: number){
        this.x = col;
        this.y = row;
    }
}