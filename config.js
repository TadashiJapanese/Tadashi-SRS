"use strict";

const MINUTES = 60000;
const HOURS = MINUTES*60;
const DAYS = HOURS*24;

const Config = {

    MAX_LEVEL: 30,

    buckets : {

        MAX_BUCKET: 10,

        STALENESS_THRESHOLDS: {
            0: 1 * DAYS,
            1: 2 * DAYS,
            2: 3 * DAYS,
            3: 6 * DAYS,
            4: 7 * DAYS,
            5: 14 * DAYS,
            6: 30 * DAYS,
            7: 60 * DAYS,
            8: 120 * DAYS,
            9: 240 * DAYS,
            10: 365 * DAYS
        }

    }

};

module.exports = Config;
