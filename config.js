"use strict";

const MINUTES = 60000;
const HOURS = MINUTES*60;
const DAYS = HOURS*24;

const Config = {

    MAX_LEVEL: 30,

    buckets : {

        MAX_BUCKET: 9,

        // 4h - 8h -24h - 3d -Guru- 1w - 2w -Master- 1m -Enlightened- 4m -Burned-

        STALENESS_THRESHOLDS: {
            0: 4 * HOURS,
            1: 8 * HOURS,
            2: 1 * DAYS,
            3: 3 * DAYS,
            4: 7 * DAYS,
            5: 14 * DAYS,
            6: 30 * DAYS,
            7: 60 * DAYS,
            8: 120 * DAYS,
            9: 240 * DAYS
        }

    }

};

module.exports = Config;
