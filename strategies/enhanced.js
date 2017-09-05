
"use strict";

const MINUTES = 60000;
const HOURS = MINUTES*60;
const DAYS = HOURS*24;

class EnhancedPickStrategy {

    // The Strategy determines the order to present questions to the user.

    constructor(queue, horizon = 2*DAYS) {

        this.queue = queue;
        this.horizon = horizon;
        this.dateFactory = Date;
        this.abunai = new Set();
        this.wrongtracker = [];

        if(queue == undefined){
            throw new Error("Undefined queue");
        }

        var now = this.dateFactory.now();

        var lowestBucketWithItems = Math.min.apply(
            Math, this.queue.map((i2)=>i2.bucket)
        );

        var recentItems = this.queue.filter(
            (i) => (now - i.firstSeen) <= this.horizon && i.eligibleForPromotion()
        );

        var lowBucketItems = this.queue.filter(
            (i) => i.bucket === lowestBucketWithItems && i.eligibleForPromotion()
        );

        this.abunai = new Set(
            recentItems.concat(lowBucketItems)
        );

    }

    right(item) {
        // some strategies might change behavior depending on
        // how the user is doing in real-time, so we need to
        // expose callbacks for when the user gets items right

        // if it was in the wrongtracker, move it to the next step
        // of the wrongtracker

        this.wrongtracker.filter((i)=>i.item == item).forEach((i)=> {
            i.step += 1;
            i.left = 1 + Math.pow(i.step, 2);
        });

        // we don't want any that that got over step 3
        this.wrongtracker = this.wrongtracker.filter((i)=>i.step <= 3);
        
    }

    wrong(item) {

        // some strategies might change behavior depending on
        // how the user is doing in real-time, so we need to
        // expose callbacks for when the user gets items wrong

        this.wrongtracker = this.wrongtracker.filter((i)=>i.item != item);
        this.wrongtracker.push({"step":1, "left": 3, "item": item});
        
    }

    pick() {        
        
        if(this.queue.length == 0){
            return undefined;
        }

        var randomItem = function(lst) {
            return lst[Math.floor(Math.random()*lst.length)];
        }

        // decrement all the wrongtracker things

        this.wrongtracker.forEach((i)=>{ i.left -= 1 });
        
        // priority 1: wrong items that reached 0 in the wrongtracker countdown

        const wrongoes = this.wrongtracker.filter((i) => i.left <= 0);

        if(wrongoes.length > 0){
            const item = wrongoes[0];
            console.log("Picking wrongo with character " + item.item.character);
            delete this.wrongtracker[item];
            return item.item;
        }

        // priority 2: abunai items

        if(this.abunai.size != 0){
            console.log("Picking random Abunai item");            
            const item = randomItem(Array.from(this.abunai));
            this.abunai.delete(item);
            return item
        }
        
        // If we didn't land on an abunai item, show a stale one
        // (or just a random item if we've run out of stales)

        var staleItems = this.queue.filter(
            (i) => i.eligibleForPromotion()
        );

        var newestFirst = function(a, b) {
            return a.firstSeen - b.firstSeen;
        }

        staleItems.sort(newestFirst);

        if(staleItems.length > 0){
            console.log("Picking last stale item");
            return staleItems[0];
        } else {
            console.log("Picking random item");
            return randomItem(this.queue)
        }

    }

    isFinished() {
        return this.queue.length == 0;
    }    

    amountLeft() {
        return this.queue.filter(
            (i) => i.eligibleForPromotion()
        ).length;
    }


}

module.exports = EnhancedPickStrategy;
