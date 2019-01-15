"use strict";

const Config = require('./config');

class Oracle {

    levenshteinDistance(a, b){

        // credit to google

        if(a.length == 0) return b.length;
        if(b.length == 0) return a.length;

        var matrix = [];

        var i;

        for(i = 0; i <= b.length; i++){
            matrix[i] = [i];
        }

        var j;

        for(j = 0; j <= a.length; j++){
            matrix[0][j] = j;
        }

        for(i = 1; i <= b.length; i++){
            for(j = 1; j <= a.length; j++){
                if(b.charAt(i-1) == a.charAt(j-1)){
                    matrix[i][j] = matrix[i-1][j-1];
                } else {
                    matrix[i][j] = Math.min(matrix[i-1][j-1] + 1,
                                            Math.min(matrix[i][j-1] + 1,
                                                     matrix[i-1][j] + 1));
                }
            }
        }

        return matrix[b.length][a.length];

    };

    checkAnswer(answers, answer, useIme) {

        var normed = function(e) {
            return e.replace(/[-' ]/g, "")
        }

        if(useIme) {

            // don't use levenshtein for Kanji answers

            return answers.filter(
                (possible) => normed(possible) === normed(answer)
            ).length > 0

        } else {

            // use levenshtein for english answers

            return answers.filter(
                (possible) => this.levenshteinDistance(
                    normed(possible), normed(answer)
                ) <= 2
            ).length > 0

        }

    }

}

class Card {

    constructor(data) {

        this.useIme = false;
        this.question = "";
        this.answers = [];

        Object.assign(this, data);

        this.oracle = new Oracle();

    }

    checkAnswer(ans) {
        return this.oracle.checkAnswer(this.answers, ans, this.useIme)
    }

}

class Item {

    constructor(data) {

        this.dateFactory = Date;

        this.category = "";
        this.character = "";
        this.questions = [];
        this.description = "";
        this.background = "";
        this.bucket = 0;
        this.firstSeen = this.dateFactory.now();
        this.lastAnswered = this.dateFactory.now();
        this.lastPromoted = this.dateFactory.now();
        this.mnemonic = "";
        this.level = undefined;

        Object.assign(this, data);

        this.questions = this.questions.map((c) => new Card(c));

    }

    getCards() {
        return this.questions;
    }

    eligibleForPromotion() {
        return (
            this.dateFactory.now() - this.lastPromoted
        ) >= Config.buckets.STALENESS_THRESHOLDS[this.bucket]
    }

    eligibleForPromotionAt(when){
        return (
            when - this.lastPromoted
        ) >= Config.buckets.STALENESS_THRESHOLDS[this.bucket]
    }

    promote() {
        if(this.bucket < Config.buckets.MAX_BUCKET) {
            this.bucket += 1;
        }
        this.lastPromoted = this.dateFactory.now();
    }

    demote() {

        if(this.bucket <= 4){
            this.bucket = 0;
        } else if(this.bucket <= 6){
            this.bucket = 4;
        } else {
            this.bucket = 5;
        }

        this.lastPromoted = this.dateFactory.now();

    }

}

module.exports = Item;
