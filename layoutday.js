/**
 * Facebook Calendar Puzzle Submission
 *
 * Copyright (c) 2013 Ryan Parman.
 * All rights reserved. You are not allowed to re-use this code.
 * Use it to learn, but solve the problem on your own, with your own code.
 */

(function() {
    /*jshint maxerr:false, smarttabs:true */

    "use strict";
    var d = document;

    // Globally-accessible function, as defined by the conundrum.
    window.layOutDay = function(events) {

        // Clear any contents
        d.getElementById('calendar-inner').innerHTML = '';

        // Sort the events by their start time
        events.sort(function (a, b) {
            if (a.start > b.start) {
                return 1;
            }
            else if (a.start < b.start) {
                return -1;
            }
            return 0;
        });

        // Init, etc.
        var f, evt, key, i, j, k, max, mode,
            replace = 0,
            id = 1,
            lastReset = 1,
            maxWidth = 600,
            width = maxWidth,
            out = [],
            slots = [],
            tracker = [];

        // Loop through the events...
        for (key in events) {
            if (events.hasOwnProperty(key)) {
                evt = events[key];

                evt.id = id;
                tracker[evt.id] = evt; // by reference
                id++;

                if (slots.length > 0) {

                    // Let's go through all previous slots one-by-one and compare them to the current evt.
                    for (i = 0, max = slots.length; i < max; i++) {

                        // If the slot we're looking at is NOT blocking the new evt, we'll plan to replace the
                        // current slot with the new evt.
                        if (slots[i] < evt.start) {
                            mode = 'r';
                            replace = i;
                            break;
                        }

                        // If we go through ALL of the slots, and they're ALL blocking the evt, we'll add a new
                        // slot for the evt.
                        mode = 'a';
                    }

                    // After all comparisons are done, are we still supposed to add a new slot?
                    if (mode === 'a') {
                        slots.push(evt.end);
                        evt.slot = (slots.length - 1);
                    }

                    // After all comparisons are done, are we replacing an existing slot?
                    else if (mode === 'r') {

                        if (evt.start > slots[slots.length - 1]) {

                            /*
                             * Since we're resetting, we're finished with the previous slot column sizes.
                             * Let's calculate what we have so far and apply the proper widths/positions to
                             * the last group of events.
                             */

                            // Calculate width
                            width = maxWidth/slots.length;

                            // Apply width/position settings
                            for (j = lastReset; j < evt.id; j++) {
                                tracker[j].width = width;
                                lastReset = j + 1;
                            }

                            // And now we'll start all over with a new set of slots.
                            slots.length = replace;
                            slots.push(evt.end);
                            tracker[evt.id].width = (maxWidth - (width * replace)); // Doesn't seem to update the property. Hmmm...
                            tracker[evt.id].slot = replace;
                        }

                        // We're NOT resetting, so let's just replace the open slot with the current evt.
                        else {
                            slots[replace] = evt.end;
                            tracker[evt.id].width = width;
                            tracker[evt.id].slot = replace;
                        }
                    }
                }

                // There are no previous slots, so this is the first one.
                else {
                    slots.push(evt.end);
                    tracker[evt.id] = events[0];
                    tracker[evt.id].slot = 0;
                }
            }
        }

        // We're done comparing events so let's do the final calculations for the last batch that we looped
        // through (i.e., force a reset).
        width = maxWidth/slots.length;
        for (j = lastReset; j <= evt.id; j++) {
            tracker[j].width = width;
        }

        // We're done comparing events so let's do the final calculations for the last batch that we looped
        // through (i.e., force a reset).
        for (i = 0, max = events.length; i < max; i++) {

            evt = events[i];

            out.push({
                id: evt.id,
                start: evt.start,
                end: evt.end,
                height: evt.end - evt.start,
                width: evt.width,
                top: evt.start,
                left: evt.width * evt.slot
            });
        }

        // Render using a document fragment
        f = d.createDocumentFragment();

        for (k in out) {
            if (out.hasOwnProperty(k)) {
                evt = out[k];
                f.appendChild(window.renderEvent(evt));
            }
        }

        d.getElementById('calendar-inner').appendChild(f);
    };
})();
