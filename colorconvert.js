let hex = {
	hex12: h => h.length == 7 ? ['#', h[1], h[3], h[5]].join('') : h,
	hex: h => h.length == 4 ? ['#', h[1], h[1], h[2], h[2], h[3], h[3]].join('') : h,
	rgb: h => {
		let f = h.length == 4 ? c => 0x11 * ('0x' + h[c + 1]) : c => 1 * ('0x' + h[c * 2 + 1] + h[c * 2 + 2]);
		return [f(0), f(1), f(2)];
	},
	cmy: h => rgb.cmy(...hex.rgb(h)),
	cmyk: h => rgb.cmyk(...hex.rgb(h)),
	hsl: h => rgb.hsl(...hex.rgb(h)),
	hsv: h => rgb.hsv(...hex.rgb(h)),
	hwb: h => rgb.hwb(...hex.rgb(h))
};
let hex12 = hex;
let rgb = {
	hex12: (r, g, b) => hex.hex12(rgb.hex(r, g, b)),
	hex: (r, g, b) => {
		let f = c => Math.floor(c * 1).toString(16).padStart(2, '0');
		return '#' + f(r) + f(g) + f(b);
	},
	rgb: (r, g, b) => [r, g, b],
	cmy: (r, g, b) => [255 - r, 255 - g, 255 - b],
	cmyk: (r, g, b) => cmy.cmyk(...rgb.cmy(r, g, b)),
	hsl: (r, g, b) => hsv.hsl(...rgb.hsv(r, g, b)),
	hsv: (r, g, b) => {
		let h, s, v;
		let p = Math.max(r, g, b);
		let q = Math.min(r, g, b);
		let f = (x, y) => 60 * (x - y) / (p - q);
		if (p == q) {
			h = 0;
		} else if (p == r) {
			h = f(g, b) + 360;
			h %= 360;
		} else if (p == g) {
			h = f(b, r) + 120;
		} else {
			h = f(r, g) + 240;
		}
		s = p == 0 ? 0 : (1 - q / p);
		v = p / 255;
		return [h, s, v];
	},
	hwb: (r, g, b) => hsv.hwb(...rgb.hsv(r, g, b))
};
let cmy = {
	hex12: (c, m, y) => rgb.hex12(...cmy.rgb(c, m, y)),
	hex: (c, m, y) => rgb.hex(...cmy.rgb(c, m, y)),
	rgb: (c, m, y) => [255 - c, 255 - m, 255 - y],
	cmy: (c, m, y) => [c, m, y],
	cmyk: (c, m, y) => {
		let k = Math.min(c, m, y);
		let f = c => (c - k) / (255 - k) * 255;
		return k == 255 ? [0, 0, 0, 255] : [f(c), f(m), f(y), k];
	},
	hsl: (c, m, y) => rgb.hsl(...cmy.rgb(c, m, y)),
	hsv: (c, m, y) => rgb.hsv(...cmy.rgb(c, m, y)),
	hwb: (c, m, y) => rgb.hwb(...cmy.rgb(c, m, y))
};
let cmyk = {
	hex12: (c, m, y, k) => cmy.hex12(...cmyk.cmy(c, m, y, k)),
	hex: (c, m, y, k) => cmy.hex(...cmyk.cmy(c, m, y, k)),
	rgb: (c, m, y, k) => cmy.rgb(...cmyk.cmy(c, m, y, k)),
	cmy: (c, m, y, k) => {
		let f = c => c * (255 - k) / 255 + k;
		return [f(c), f(m), f(y)];
	},
	cmyk: (c, m, y, k) => [c, m, y, k],
	hsl: (c, m, y, k) => cmy.hsl(...cmyk.cmy(c, m, y, k)),
	hsv: (c, m, y, k) => cmy.hsv(...cmyk.cmy(c, m, y, k)),
	hwb: (c, m, y, k) => cmy.hwb(...cmyk.cmy(c, m, y, k))
};
let hsl = {
	hex12: (h, s, l) => hsv.hex12(...hsl.hsv(h, s, l)),
	hex: (h, s, l) => hsv.hex(...hsl.hsv(h, s, l)),
	rgb: (h, s, l) => hsv.rgb(...hsl.hsv(h, s, l)),
	cmy: (h, s, l) => hsv.cmy(...hsl.hsv(h, s, l)),
	cmyk: (h, s, l) => hsv.cmyk(...hsl.hsv(h, s, l)),
	hsl: (h, s, l) => [h, s, l],
	hsv: (h, s, l) => {
		let v = l + s * Math.min(l, 1 - l);
		let sv = v == 0 ? 0 : 2 * (1 - l / v);
		return [h, sv, v];
	},
	hwb: (h, s, l) => hsv.hwb(...hsl.hsv(h, s, l))
};
let hsv = {
	hex12: (h, s, v) => rgb.hex12(...hsv.rgb(h, s, v)),
	hex: (h, s, v) => rgb.hex(...hsv.rgb(h, s, v)),
	rgb: (h, s, v) => {
		let hi = Math.floor(h / 60);
		let f = h / 60 - hi;
		let p = v * (1 - s);
		let q = v * (1 - f * s);
		let t = v * (1 - (1 - f) * s);
		let ff = (r, g, b) => [r * 255, g * 255, b * 255];
		switch (hi) {
			case 0: return ff(v, t, p);
			case 1: return ff(q, v, p);
			case 2: return ff(p, v, t);
			case 3: return ff(p, q, v);
			case 4: return ff(t, p, v);
			default: return ff(v, p, q);
		}
	},
	cmy: (h, s, v) => rgb.cmy(...hsv.rgb(h, s, v)),
	cmyk: (h, s, v) => rgb.cmyk(...hsv.rgb(h, s, v)),
	hsl: (h, s, v) => {
		let l = v * (1 - s / 2);
		let sl = (l == 0 || l == 1) ? 0 : (v - l) / Math.min(l, 1 - l);
		return [h, sl, l];
	},
	hsv: (h, s, v) => [h, s, v],
	hwb: (h, s, v) => [h, (1 - s) * v, 1 - v]
};
let hwb = {
	hex12: (h, w, b) => hsv.hex12(...hwb.hsv(h, w, b)),
	hex: (h, w, b) => hsv.hex(...hwb.hsv(h, w, b)),
	rgb: (h, w, b) => hsv.rgb(...hwb.hsv(h, w, b)),
	cmy: (h, w, b) => hsv.cmy(...hwb.hsv(h, w, b)),
	cmyk: (h, w, b) => hsv.cmyk(...hwb.hsv(h, w, b)),
	hsl: (h, w, b) => hsv.hsl(...hwb.hsv(h, w, b)),
	hsv: (h, w, b) => [h, b == 1 ? 0 : (1 - w / (1 - b)), 1 - b],
	hwb: (h, w, b) => [h, w, b]
};
export default { hex12, hex, rgb, cmy, cmyk, hsl, hsv, hwb };