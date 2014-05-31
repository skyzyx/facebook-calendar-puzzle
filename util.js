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

	// Init
	var i, max, time, fmt,
	d = document,
	f = d.createDocumentFragment(),

	// Render calendar events
	renderEvent = function(evt) {

		var de = d.createElement('div'),
		    dei = d.createElement('div'),
		    h4 = d.createElement('h4'),
		    p = d.createElement('p');

		de.appendChild(dei);
		dei.appendChild(h4);
		dei.appendChild(p);
		h4.appendChild(d.createTextNode('Sample Event #' + evt.id));
		p.appendChild(d.createTextNode('Sample Location'));

		de.className = 'event';
		dei.className = 'event-inner';

		de.style.width = evt.width + 'px';
		de.style.height = evt.height + 'px';
		de.style.top = evt.top + 'px';
		de.style.left = evt.left + 'px';

		return de;
	},

	// Define range function with stepping
	range = function(start, stop, step) {
		var a = [start], b = start;
		step = step || 1;

		while (b < stop) {
			b += step;
			a.push(b);
		}

		return a;
	},

	// Format time into human
	fmtTime = function(seconds) {
		var hour, mod, hh, md, mm;

		hh = (Math.floor(seconds / 60) + 9);
		md = ((hh > 11) ? 'PM' : 'AM');
		hh = ((hour = hh % 12) ? hour : 12);
		mm = ((mod = seconds % 60) < 10 ? '0' + mod : mod);

		return [hh, mm, md];
	},

	// Render time markers
	fmtClock = function(fmt, offset, oclock) {
		oclock = oclock || false;

		var di = d.createElement('div'),
		    st = d.createElement('span'),
		    sm = d.createElement('span');

		di.className = oclock ? 'oclock' : 'thirty';
		di.style.top = offset + 'px';
		st.className = 'time';
		sm.className = 'meridian';

		di.appendChild(st);
		st.appendChild(d.createTextNode(fmt[0] + ':' + fmt[1]));

		if (oclock) {
			di.appendChild(d.createTextNode(' '));
			di.appendChild(sm);
			sm.appendChild(d.createTextNode(fmt[2]));
		}

		return di;
	},

	// Cache
	steps = range(0, 720, 30);

	// Render the times
	for (i = 0, max = steps.length; i < max; i++) {
		time = steps[i];
		fmt = fmtTime(time);

		if (i % 2) {
			f.appendChild(fmtClock(fmt, time, false));
		}
		else {
			f.appendChild(fmtClock(fmt, time, true));
		}
	}

	d.getElementById('time').appendChild(f);
	window.renderEvent = renderEvent;
})();
