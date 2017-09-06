"use strict";

import Config from './config'

// holds state for the current quiz session.

class Drill {

    constructor(strategy) {

        this.cache = [];
        this.strategy = strategy;

        // Obj -> [bool]
        this.answerLog = {};

        this.dateFactory = Date;

    }

    // An item can have multiple associated cards - we need to check to see
    // if we've answered all the cards for an item, and then promote/demote
    // that item

    checkLog(item) {

        // we don't know about this item yet, do nothing!

        if( !(item in this.answerLog) ) {
            throw new Error("checkLog before answerLog set");
        }

        // we haven't answered all cards yet, do nothing!

        if( this.answerLog[item].length != item.questions.length ) {
            return;
        }

        // we've answered all questions for this item, promote
        // or demote based on whether we got any of them wrong!

        var wrongAnswers = this.answerLog[item].filter((a)=>!a);
        var wasAnsweredCorrectly = wrongAnswers.length === 0

        if( wasAnsweredCorrectly && item.eligibleForPromotion()) {
            item.promote();
            this.strategy.right(item);
        } else if(wasAnsweredCorrectly) {
            this.strategy.right(item);
        } else if ( !wasAnsweredCorrectly ) {
            item.demote();
            this.strategy.wrong(item);
        }

        item.lastAnswered = this.dateFactory.now();

        // reset answers

        this.answerLog[item] = [];

    }

    // Pull an item (or perhaps several in the future) from the queue,
    // and put the cards associated with that item into the cache of cards
    // to ask

    fillCache() {

        var owner = this;

        var addItemToCache = (i) => i.questions.map((c)=>{
            return {item: i, card: c}
        }).forEach( (ci) => {
            owner.cache.push(ci);
        });

        var next = this.strategy.pick();

        console.log(next.character + " - bucket " + next.bucket)

        addItemToCache(next);

    }

    next() {

        if(this.cache.length === 0) {
            this.fillCache();
        }

        if(this.cache.length === 0) {
            throw new Error("Drill failed to fill cache, whoa!");
        }

        return this.cache.shift();

    }

    right(item) {
        if(!this.answerLog[item]){
            this.answerLog[item] = [];
        }
        this.answerLog[item].push(true);
        this.checkLog(item);
    }

    wrong(item) {
        if(!this.answerLog[item]){
            this.answerLog[item] = [];
        }
        this.answerLog[item].push(false);
        this.checkLog(item);
    }

    amountLeft() {
        return this.strategy.amountLeft();
    }

    isFinished() {
        return this.strategy.isFinished()
    }

}

module.exports = Drill;
