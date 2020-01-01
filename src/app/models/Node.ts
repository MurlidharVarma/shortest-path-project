export class Node {
    x: number;
    y: number;

    distance: number | null;
    distanceFrom: Node;

    isVisited: boolean;
    isBlocked: boolean;
    isStart: boolean;
    isDestination: boolean;
    isInShortestPath: boolean;
    isInProgress: boolean;

    constructor(){
        this.x=0;
        this.y=0;
        this.distance=null;
        this.distanceFrom=null;
        this.isVisited=false;
        this.isBlocked=false;
        this.isStart=false;
        this.isDestination=false;
        this.isInShortestPath=false;
        this.isInProgress=false;
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
    }

    setAsDestination(){
        this.isDestination = true;
    }

    setPosition(row:number, col: number){
        this.x = col;
        this.y = row;
    }

    updateDistanceFrom(visitingNode:Node){
        let newDistance = visitingNode.distance?visitingNode.distance+1:1;
        if (!this.isBlocked && !this.isVisited && (this.distance == null || this.distance > newDistance)){
            this.distance = newDistance;
            this.distanceFrom = visitingNode;
        }
        return this;
    }
}