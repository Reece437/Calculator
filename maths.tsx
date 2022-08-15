import { sqrt, create, all, log, evaluate } from 'mathjs';
const math = create(all);
math.import({
	trigMode: 'Deg',
	logTEN: function(x) {
		return log(x, 10);
	},
	ln: function(x) {
		return log(x, Math.E);
	},
	sInN: function(x) {
		let ans: any;
		if (math.trigMode == 'Deg' && typeof(x) != 'object') {
			ans = evaluate(`sin(${x} deg)`);
		} else ans = evaluate(`sin(${x})`);	
		try {
			return ans.toFixed(12)
		} catch(err) {
			return ans;
		}
	},
	cosN: function(x) {
		let ans: any;
		if (math.trigMode == 'Deg' && typeof(x) != 'object') {
			ans = evaluate(`cos(${x} deg)`);
		} else ans = evaluate(`cos(${x})`);	
		try {
			return ans.toFixed(12)
		} catch(err) {
			return ans;
		}
	},
	tanN: function(x) {
		let ans: any;
		ans = math.sInN(x) / math.cosN(x);
		try {
			return ans.toFixed(12)
		} catch(err) {
			return ans;
		}
	},
	sInInv: function(x) {
		let ans: any; // Have to do this for complex numbers
		if (math.trigMode == 'Deg' && typeof(x) != 'object') {
			ans = Math.asin(x) * 360 / (2 * Math.PI);
		} else ans = evaluate(`asin(${x})`);
		try {
			return ans.toFixed(12);
		} catch(err) {
			return ans;
		}
	},
	cosInv: function(x) {
		let ans: any; // Have to do this for complex numbers
		if (math.trigMode == 'Deg' && typeof(x) != 'object') {
			ans = Math.acos(x) * 360 / (2 * Math.PI);
		} else ans = evaluate(`acos(${x})`);
		try {
			return ans.toFixed(12);
		} catch(err) {
			return ans;
		}
	},
	tanInv: function(x) {
		let ans: any; // Have to do this for complex numbers
		if (math.trigMode == 'Deg' && typeof(x) != 'object') {
			ans = Math.atan(x) * 360 / (2 * Math.PI);
		} else ans = evaluate(`atan(${x})`);
		try {
			return ans.toFixed(12);
		} catch(err) {
			return ans;
		}
	},
	sInh: function(x) {
		return evaluate(`sinh(${x})`)
	},
	asInh: function(x) {
		return evaluate(`asinh(${x})`)
	},
	RandInt: function(x) {
		
	},
	RandFloat: function(x) {
		
	}
})


export default class Maths {
	constructor(trigMode = 'Deg') {
		this.trigMode = trigMode;
	}
	RandInt(min, max) {
		return Math.round(Math.random() * (max - min) + min);
	}
	RandFloat(min, max) {
		return Math.random() * (max - min) + min;
	}
}
export { math }