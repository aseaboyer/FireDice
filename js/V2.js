function V2() {
    return {
		x: 0,
		y: 0,
		w: 1,
		width: 1,
		h: 1,
		height: 1,
		r: 0,
		rot: function() {
			return r;
		},
		rotation: function() {
			return r;
		},
		rotate: function(newRot) {
			r += newRot;
			return r;
		},
		rotation: function() {
			return r;
		},
    };
}