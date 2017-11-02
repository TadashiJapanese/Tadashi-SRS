"use strict";

const Config = require("../config");

const MINUTES = 60000;
const HOURS = MINUTES*60;
const DAYS = HOURS*24;

const THRESHOLDS = Config.buckets.STALENESS_THRESHOLDS;

export function predict(queue, days=7) {

    // prestep - get all items that could possibly be due and create proxies
    // of them that we can simulate the passage of time with

    var now = new Date();
    now.setHours(24, 0, 0, 0);
    var horizon = now.getTime() + (24*HOURS*days);
    var proxies = [];

    queue.filter(
        (i) => (horizon - i.lastPromoted) >= THRESHOLDS[i.bucket]
    ).forEach(
        (i) => proxies.push({item: i, bucket: i.bucket, lastPromoted: i.lastPromoted})
    );

    // proxies now contains copies of all the items that will be due at some
    // point in the next <today+days> time. So now we simulate the passage of
    // time, assuming the user always answers correctly!

    var log = []

    for(let day=0; day <= days; day += 1) {

        // day in the simulation
        var synthDate = (now.getTime() + 24*HOURS*day);

        // initialise the count for thie date to 0 in the log
        log[day] = 0;

        // for each item that could be due
        for(let proxy of proxies) {
            
            // if it was stale at this simulated date
            if(synthDate - proxy.lastPromoted >= THRESHOLDS[proxy.bucket]){
                
                // then increase the count of due items by 1 for thie date
                log[day] += 1;

                // and promote it
                proxy.bucket += 1;

                // and set the last promoted date on the item so it doesn't
                // come up again until it's next due in the simulation
                proxy.lastPromoted = synthDate;
                
            }
        }

    }

    return log;

}

module.exports = { predict: predict };
