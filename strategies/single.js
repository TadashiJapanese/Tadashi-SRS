
"use strict";

const MINUTES = 60000;
const HOURS = MINUTES*60;
const DAYS = HOURS*24;

class SingleLevelPickStrategy {

    // The Strategy determines the order to present questions to the user.

    constructor(queue) {

        if(queue == undefined){
            throw new Error("Undefined queue");
        };        

        // duplicate the queue
        this.original = queue;
        this.queue = queue.map((i)=>i);
        
        this.dateFactory = Date;
        this.abunai = [
            { chance: 0.5, items: new Set()},
            { chance: 0.25, items: new Set()},
            { chance: 0.1, items: new Set()}
        ];

        
    }

    right(item) {
        // some strategies might change behavior depending on
        // how the user is doing in real-time, so we need to
        // expose callbacks for when the user gets items right

        for(let i in this.abunai){
            var next = +i+1;
            if(this.abunai[i].items.has(item)){
                
                this.abunai[i].items.delete(item);

                if(next < this.abunai.length){
                    this.abunai[next].items.add(item);
                }
                
                return;
                
            }
        }
        
    }

    wrong(item) {
        // some strategies might change behavior depending on
        // how the user is doing in real-time, so we need to
        // expose callbacks for when the user gets items wrong

        for(let abunai of this.abunai){
            abunai.items.delete(item);
        }

        this.abunai[0].items.add(item);
        
    }

    pick() {

        // start over again if we exhaust the queue
        
        if(this.queue.length == 0){
            console.log("exhausted queue. Rebuilding");
            this.queue = this.original.map((i)=>i);
        }

        var now = this.dateFactory.now();
        
        var randomItem = function(lst) {
            return lst[Math.floor(Math.random()*lst.length)];
        }

        // show abunai items as a priority

        for(let i in this.abunai){
            if(this.abunai[i].items.size != 0){
                if(Math.random() < this.abunai[i].chance){
                    console.log("Picking random Abunai " + i + " item");        
                    return randomItem(Array.from(this.abunai[i].items));
                } else {
                    break;
                }
            }
        }

        // If we didn't land on an abunai item, show one from the
        // input queue

        return this.queue.pop()

    }

    isFinished() {
        return false;
    }    

    amountLeft() {
        return this.queue.length;
    }

}

module.exports = SingleLevelPickStrategy;

