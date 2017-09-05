"use strict";

export class Stats {

    constructor() {
        this.daily = {};
    }

    initDay(date) {
        if( !(date in this.daily) ){
            this.daily[date] = {
                correct: 0, wrong: 0, learned: 0
            };
        }
    }

    today() {
        const today = new Date().toJSON().slice(0, 10);
        this.initDay(today);        
        return this.daily[today];
    }

    increment(stat, val=1) {
        const today = new Date().toJSON().slice(0, 10);
        this.initDay(today);
        this.daily[today][stat] += val;
    }

}

module.exports = Stats;
