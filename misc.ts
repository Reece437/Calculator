import Maths from './maths.tsx';
let maths = new Maths();
export default class Misc {
	constructor() {
		this.map = {
			'--': '+',
			'++': '+',
			'sin(': '( sInN(',
			'cos(': '( cosN(',
			'tan(': '( tanN(',
			'sin⁻¹(': '( sInInv(',
			'cos⁻¹(': '( cosInv(',
			'tan⁻¹(': '( tanInv(',
			'sinh(': '( sInh(',
			'RandInt(': '( maths.RandInt(',
			'RandFloat(': '( maths.RandFloat(',
			'cosh(': '( cosh(',
			'tanh(': '( tanh(',
			'sinh⁻¹(': '( asInh(',
			'cosh⁻¹(': '( acosh(',
			'tanh⁻¹(': '( atanh(',
			'÷': '/',
			'log(': '( logTEN(',
			'ln': '( ln',
			'√': '( sqrt',
			'×': '(',
			'e': '( E )',
			'π': '( PI )',
			"'": '',
			'%': '/100 *',
			//'ANS': '( this.state.ANS )'	
		}
		this.opers = [
			'+','×', 
			'÷','MOD'
		]
	}
	reverseString(eq: string) {
		let New: string = '';
		let len: number = eq.length - 1;
		for (let i = len; i >= 0; i--) {
			New += eq[i];
		}
		return New;
	}
	bigReplace(eq: string) {
		let New: string = eq;
		for (let value in this.map) {
			if (!this.map.hasOwnProperty(value)) continue;
			var re = new RegExp(this.escapeRegExp(value), 'g');
			New = New.replace(re, this.map[value]);
		}
		New = New.replace(/i/g, '( i )');
		return New;
	}
	escapeRegExp(stringToGoIntoTheRegex) {
    	return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	}
	comNums(eq: string) : string {
		eq = eq.replace(/'/g, '');
		let num = '';
		let len: number = eq.length;
		for (let i: number = 0; i < len; i++) {
			if (!isNaN(parseFloat(eq[i]))) {
				num += eq[i];
				for (let j: number = 1; j < len; j++) {
					if (!isNaN(parseInt(eq[i + j])) ||
						eq[i + j] == '.') {
						num += eq[i + j];
					} else break;
				}
				eq = eq.replace(num, this.com(num));
				if (num.includes('.')) {
					i += num.length + Math.floor(num.split('.').length / 4);
				}
				else {
					i += num.length + Math.floor(num.length / 4);
				}
				num = '';
			}
		}
		return eq;
	}
	com(num: string) : string {
		if (isNaN(num) ||
			num == '' ||
			(num.includes('e+') ||
			num.includes('e-'))) {
			return num;
		}
		if (num.includes('.')) {
			let firstHalf = (num.split('.')[0])
			.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'"); // Can't use localeString because of android
			let secondHalf = num.split('.')[1];
			return `${firstHalf}.${secondHalf}`;
		} else {
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
		}
	}
	change(eq: string) : string {
		eq = this.bigReplace(eq)
		.replace(/\* \*/g, '*')
		.replace(/MOD/g, '%');
		if ((eq.split('|').length - 1) % 2 != 0) eq += '|';
		eq = this.fixMultiplicationErrors(eq);
		let nums: string;
		const allow = [
			'e','.','E',
		];
		//eq = eq.replace(/!/g, '["factorial"]()')
		if (eq.includes('|')) {eq = this.fixAbsolute(eq)}
		if (eq.slice(-1) == '*') eq = eq.slice(0, -1);
		//alert(eq); //For debugging 
		return eq;
	}
	fixAbsolute(eq: string) : string {
		let len: number = eq.length;
		for (let i = 0; i < len; i++) {
			if (eq[i] == '|') {
				let New:string = '';
				for (let j = 1; j < len; j++) {
					if (eq[i + j] != '|') {
						New += eq[i + j]
					} else break
				}
				eq = eq.replace(`|${New}|`, `abs(${New})`);
				len = eq.length;
			}
		}
		return eq;
	}
	fixMultiplicationErrors(eq: string) : string {
		console.log('rlly before ' + eq)
		//eq = eq.replace(/\^/g, '**');
		/*for (let i = 0; i < eq.length; i++) {
			if (eq[i] == '(' && !isNaN(eq[i -1]) && i != 0) {
				eq = eq.slice(0, i) + '*' + eq.slice(i )
			}
		}*/
		console.log('after: ' + eq);
		if (eq.slice(-1) == '*') eq = eq.slice(0, -1)
		if (eq.slice(-2) == '* ') eq = eq.slice(0, -2)
		const toReplace = {
			'* ^': '^',
			'**': '*',
			') ** (': ') * (',
			'(*': '(',
			'* /*': '/',
			') * * (': ') * (',
			'* +': '+',
			'* -(': '-(',
			'* /': '/',
			'* )': ')',
			'*^': '^',
			'^*': '^',
			')* * (': ') * (',
			'* * (': '* (',
			' * * ': '*',
			'* -': '-',
			'*)': ')',
			'-*': '-'
		};
		for (let value in toReplace) {
			if (!toReplace.hasOwnProperty(value)) continue;
			var re = new RegExp(this.escapeRegExp(value), 'g');
			eq = eq.replace(re, toReplace[value]);
		}
		if (eq[0] == '*') {
			eq = eq.slice(1)
		}
		return eq;
	}
	fixDecimal(eq: (string | object)) : string {
		if (typeof(eq) == 'object') {
			eq.im = this.truncateDecimal((eq.im).toFixed(13));
			eq.re = this.truncateDecimal((eq.re).toFixed(13));
			console.log(eq);
			return eq;
		}
		eq = eq.toString()
		if (eq.includes('e')) {
			let firstHalf: any = eq.split('e')[0];
			let secondHalf: string = eq.split('e')[1];
			firstHalf = parseFloat(firstHalf).toFixed(13);
			firstHalf = this.truncateDecimal(firstHalf);
			return `${firstHalf}E${secondHalf}`
		} else {
			eq = parseFloat(eq).toFixed(13);
			eq = this.truncateDecimal(eq);
			return eq;
		}
	}
	truncateDecimal(eq: (string | number)) : number {
		eq = eq.toString();
		while (eq.slice(-1) == '.' ||
		(eq.slice(-1) == '0' && eq.includes('.'))) {
			eq = eq.slice(0, -1);
		}
		return parseFloat(eq);
	}
}