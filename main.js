import cc from "./colorconvert.js";
Object.defineProperty(Node.prototype, 'show', {
	set: function (s) {
		this.style.opacity = s;
		this.style.zIndex = s;
	}
});
Array.prototype.draw = function () {
	if (this.length <= 0) return null;
	let j = Math.floor(Math.random() * this.length);
	let d = this[j];
	this.splice(j, 1);
	return d;
};

Audio.prototype.replay = function () {
	this.currentTime = 0;
	this.play();
};

function range(f, l) {
	let a = [];
	if (f < l) { for (let i = f; i <= l; i++) { a.push(i); } }
	else { for (let i = f; i >= l; i--) { a.push(i); } }
	return a;
}
function range_nf(f, l) {
	let a = [];
	if (f < l) { for (let i = f + 1; i <= l; i++) { a.push(i); } }
	else { for (let i = f - 1; i >= l; i--) { a.push(i); } }
	return a;
}
function range_nl(f, l) {
	let a = [];
	if (f < l) { for (let i = f; i < l; i++) { a.push(i); } }
	else { for (let i = f; i > l; i--) { a.push(i); } }
	return a;
}
function range_nfl(f, l) {
	let a = [];
	if (f < l) { for (let i = f + 1; i < l; i++) { a.push(i); } }
	else { for (let i = f - 1; i > l; i--) { a.push(i); } }
	return a;
}

async function 載入圖示() {
	let img = await loadimg('麻將/元/中.svg');
	let canvas = text2html(`<canvas width="400" height="400"/>`);
	let ctx = canvas.getContext("2d");
	ctx.rect(50, 0, 300, 400);
	ctx.fillStyle = '#f5f5f5';
	ctx.fill();
	ctx.drawImage(img, 50, 0);
	window.parent.document.querySelector('[rel="icon"]').href = canvas.toDataURL();
}

let 麻將 = (() => {
	let 寬度 = 16, 高度 = 9;
	let 模式 = {
		筒: {
			一: 0,
			二: 0,
			三: 0,
			四: 0,
			五: 0,
			六: 0,
			七: 0,
			八: 0,
			九: 0
		},
		條: {
			一: 0,
			二: 0,
			三: 0,
			四: 0,
			五: 0,
			六: 0,
			七: 0,
			八: 0,
			九: 0
		},
		萬: {
			一: 0,
			二: 0,
			三: 0,
			四: 0,
			五: 0,
			六: 0,
			七: 0,
			八: 0,
			九: 0
		},
		風: {
			東: 0,
			南: 0,
			西: 0,
			北: 0
		},
		元: {
			中: 0,
			發: 0,
			白: 0
		},
		花: {
			春: 1,
			夏: 1,
			秋: 1,
			冬: 1,
			梅: 2,
			蘭: 2,
			菊: 2,
			竹: 2
		}
	};
	let 位置 = {
		筒: {
			一: [],
			二: [],
			三: [],
			四: [],
			五: [],
			六: [],
			七: [],
			八: [],
			九: []
		},
		條: {
			一: [],
			二: [],
			三: [],
			四: [],
			五: [],
			六: [],
			七: [],
			八: [],
			九: []
		},
		萬: {
			一: [],
			二: [],
			三: [],
			四: [],
			五: [],
			六: [],
			七: [],
			八: [],
			九: []
		},
		風: {
			東: [],
			南: [],
			西: [],
			北: []
		},
		元: {
			中: [],
			發: [],
			白: []
		},
		花: {
			春: [],
			夏: [],
			秋: [],
			冬: [],
			梅: [],
			蘭: [],
			菊: [],
			竹: []
		}
	};
	let 節點 = [];
	let 座標 = ({ x, y }) => 節點[y][x];
	let 張數 = 0;

	function 麻將版掃描(cb = () => { }) {
		for (let i = 0; i < 高度; i++) {
			for (let j = 0; j < 寬度; j++) {
				cb(i, j);
			}
		}
	}

	async function 初始化() {
		for (let [色, 群] of Object.entries(模式)) {
			for (let [數, 模] of Object.entries(群)) {
				預設.append(text2svg(`<image id="${數}${色}" width="60" height="80" href="麻將/${色}/${數}.svg"/>`));
			}
		}
		for (let i = 0; i < 高度; i++) {
			節點[i] = [];
			for (let j = 0; j < 寬度; j++) {
				節點[i][j] = 建立節點(i, j);
			}
		}
	}
	function 建立節點(i, j) {
		let mn = {
			_id: '無',
			mod: -1,
			img: text2svg(`<use/>`),
			seerect: text2svg(`<use href="#框線" fill="none"/>`),
			rect: text2svg(`<use href="#框線" fill="none"/>`),
			move: text2svg(`<use href="#框線" fill="none"/>`),
			svg: text2svg(`<g data-麻將="true" style="--x:${j};--y:${i};" data-x="${j}" data-y="${i}" opacity="0"></g>`),
			lock(b) {
				if (b) {
					this.rect.setAttribute('fill', '#7f00ff55');
					this.seerect.setAttribute('opacity', 0);
				} else {
					this.rect.setAttribute('fill', 'none');
					this.seerect.removeAttribute('opacity');
				}
			},
			see(b) {
				if (b) {
					this.seerect.setAttribute('fill', '#ff7f0055');
				} else {
					this.seerect.setAttribute('fill', 'none');
				}
			},
			set id(_id) {
				this._id = _id;
				this.see(false);
				this.lock(false);
				if (_id == '無') {
					this.mod = -1;
					this.img.removeAttribute('href');
					this.svg.setAttribute('opacity', 0);
				} else {
					let [數, 色] = _id.split('');
					this.mod = 模式[色][數];
					this.img.setAttribute('href', `#${_id}`);
					this.svg.removeAttribute('opacity');
				}
			},
			get id() {
				return this._id;
			}
		};
		mn.svg.onmousemove = () => mn.move.setAttribute('fill', '#00bf0055');
		mn.svg.onmouseleave = () => mn.move.setAttribute('fill', 'none');
		mn.svg.append(text2svg(`<use href="#框線" fill="#f5f5f5"/>`), mn.img, mn.seerect, mn.rect, mn.move);
		牌區.append(mn.svg);
		return mn;
	}
	function 一樣(a, b) {
		switch (座標(a).mod) {
			case 0:
				return 座標(a).id == 座標(b).id;
			case 1:
			case 2:
				return 座標(a).mod == 座標(b).mod;
			default:
				return false;
		}
	}
	function 位置相同(a, b) {
		return a.x == b.x && a.y == b.y;
	}

	function 能否連線(a, b) {
		let 有麻將 = ({ x, y }) => { if (節點[y][x].id != '無') throw 'no'; };
		let 結果 = { 成功: false };

		for (let i = 0; i < 2; i++) {
			let p = ['x', 'y'][i];
			let q = ['y', 'x'][i];
			range(a[p], b[p]).forEach(_p => {
				try {
					range_nfl(a[p], _p).forEach(M_p => 有麻將({ [p]: M_p, [q]: a[q] }));
					if (_p != a[p]) 有麻將({ [p]: _p, [q]: a[q] });
					range_nfl(a[q], b[q]).forEach(M_q => 有麻將({ [p]: _p, [q]: M_q }));
					if (_p != b[p]) 有麻將({ [p]: _p, [q]: b[q] });
					range_nfl(_p, b[p]).forEach(M_p => 有麻將({ [p]: M_p, [q]: b[q] }));

					if (_p == a[p] && _p == b[p]) { 結果 = { 成功: true, 轉角: [] }; }
					else if (_p == a[p]) { 結果 = { 成功: true, 轉角: [{ [p]: _p, [q]: b[q] }] }; }
					else if (_p == b[p]) { 結果 = { 成功: true, 轉角: [{ [p]: _p, [q]: a[q] }] }; }
					else if (!結果.成功) { 結果 = { 成功: true, 轉角: [{ [p]: _p, [q]: a[q] }, { [p]: _p, [q]: b[q] }] }; }
				} catch (e) { }
			});
			if (結果.成功 && 結果.轉角.length <= 1) return 結果;
		}
		if (結果.成功) return 結果;

		for (let i = 0; i < 2; i++) {
			let p = ['x', 'y'][i];
			let q = ['y', 'x'][i];
			let S_p = [寬度, 高度][i];
			let R_p = a[p] < b[p] ? [a[p], b[p]] : [b[p], a[p]];
			for (let j = 0; j < 2; j++) {
				let _p = R_p[j];
				let L_p = [-1, S_p][j];
				try {
					range_nl(_p, a[p]).forEach(M_p => 有麻將({ [p]: M_p, [q]: a[q] }));
					range_nl(_p, b[p]).forEach(M_p => 有麻將({ [p]: M_p, [q]: b[q] }));
					range_nfl(_p, L_p).forEach(M_p => {
						有麻將({ [p]: M_p, [q]: a[q] });
						有麻將({ [p]: M_p, [q]: b[q] });
						try {
							range_nfl(a[q], b[q]).forEach(M_q => 有麻將({ [p]: M_p, [q]: M_q }));
							throw M_p;
						} catch (e) { if (e != 'no') throw e; }
					});
					throw L_p;
				} catch (e) {
					if (e != 'no') {
						let M_p = e;
						let 步數 = Math.abs(M_p - a[p]) + Math.abs(M_p - b[p]) + Math.abs(a[q] - b[q]);
						if (!結果.成功 || 步數 < 結果.步數)
							結果 = { 成功: true, 轉角: [{ [p]: M_p, [q]: a[q] }, { [p]: M_p, [q]: b[q] }], 步數 };
					}
				}
			}
		}
		return 結果;
	}
	function 檢查有解() {
		for (let [色, 群] of Object.entries(位置)) {
			if (模式[色][Object.entries(群)[0][0]] == 0) {
				for (let [數, 位] of Object.entries(群)) {
					for (let i = 0; i < 位.length; i++) {
						for (let j = i + 1; j < 位.length; j++) {
							if (能否連線(位[i], 位[j]).成功) return true;
						}
					}
				}
			} else {
				for (let [數1, 位1] of Object.entries(群)) {
					if (位1.length < 1) continue;
					for (let [數2, 位2] of Object.entries(群)) {
						if (數1 == 數2) continue;
						if (位2.length < 1) continue;
						if (模式[色][數1] != 模式[色][數2]) continue;
						if (能否連線(位1[0], 位2[0]).成功) return true;
					}
				}
			}
		}
		return false;
	}
	function 排除無解狀況() {
		let 亂數 = [];
		for (let [色, 群] of Object.entries(位置)) {
			for (let [數, 位] of Object.entries(群)) {
				for (let i = 0; i < 位.length; i++) {
					亂數.push({ id: `${數}${色}`, 位: 位[i] });
				}
			}
		}
		let m1 = 亂數.draw();
		while (亂數.length > 0) {
			let m2 = 亂數.draw();
			if (能否連線(m1.位, m2.位).成功) {
				let [數1, 色1] = m1.id.split('');
				let 位1 = 位置[色1][數1];
				let p1;
				for (let i = 0; i < 位1.length; i++) {
					if (!位置相同(位1[i], m1.位)) {
						p1 = i;
						break;
					}
				}
				let [數2, 色2] = m2.id.split('');
				let 位2 = 位置[色2][數2];
				let p2;
				for (let i = 0; i < 位2.length; i++) {
					if (位置相同(位2[i], m2.位)) {
						p2 = i;
						break;
					}
				}
				let [a, b] = [位1[p1], 位2[p2]] = [位2[p2], 位1[p1]];
				[座標(a).id, 座標(b).id] = [座標(b).id, 座標(a).id];
				return;
			}
		}
	}
	let 打亂 = {
		開始() {
			let 亂數 = [];
			for (let [色, 群] of Object.entries(模式)) {
				for (let [數, 模] of Object.entries(群)) {
					位置[色][數] = [];
					if (模 == 0) {
						for (let i = 0; i < 4; i++) {
							亂數.push(`${數}${色}`);
						}
					} else {
						亂數.push(`${數}${色}`);
					}
				}
			}
			麻將版掃描((i, j) => {
				節點[i][j].id = 亂數.draw();
				節點[i][j].move.setAttribute('fill', 'none');
				let [數, 色] = 節點[i][j].id.split('');
				位置[色][數].push({ x: j, y: i });
			});
			if (!檢查有解()) 排除無解狀況();
		},
		全變() {
			音效.change.replay();
			let 亂數 = [];
			for (let [色, 群] of Object.entries(位置)) {
				for (let [數, 位] of Object.entries(群)) {
					for (let i = 0; i < 位.length; i++) {
						亂數.push(`${數}${色}`);
					}
					位置[色][數] = [];
				}
			}
			麻將版掃描((i, j) => {
				if (節點[i][j].id != '無') {
					節點[i][j].id = 亂數.draw();
					let [數, 色] = 節點[i][j].id.split('');
					位置[色][數].push({ x: j, y: i });
				}
			});
			if (!檢查有解()) 排除無解狀況();
		}
	};
	function 節點轉位置() {
		for (let [色, 群] of Object.entries(位置)) {
			for (let [數, 位] of Object.entries(群)) {
				位置[色][數] = [];
			}
		}
		麻將版掃描((i, j) => {
			if (節點[i][j].id != '無') {
				let [數, 色] = 節點[i][j].id.split('');
				位置[色][數].push({ x: j, y: i });
			}
		});
	}

	function 位移x(y, 開始, 結束) {
		for (let x of range(開始, 結束)) {
			if (節點[y][x].id != '無') continue;
			for (let _x of range_nf(x, 結束)) {
				if (節點[y][_x].id != '無') {
					節點[y][x].id = 節點[y][_x].id;
					節點[y][_x].id = '無';
					break;
				}
			}
		}
	}
	function 位移y(x, 開始, 結束) {
		for (let y of range(開始, 結束)) {
			if (節點[y][x].id != '無') continue;
			for (let _y of range_nf(y, 結束)) {
				if (節點[_y][x].id != '無') {
					節點[y][x].id = 節點[_y][x].id;
					節點[_y][x].id = '無';
					break;
				}
			}
		}
	}

	let 移動函數 = [
		() => { },
		() => { },
		() => {
			for (let x = 0; x < 寬度; x++) {
				位移y(x, 高度 - 1, 0);
			}
		},
		() => {
			for (let y = 0; y < 高度; y++) {
				位移x(y, 0, 寬度 - 1);
			}
		},
		() => {
			for (let x = 0; x < 寬度; x++) {
				位移y(x, 0, 4 - 1);
				位移y(x, 高度 - 1, 4);
			}
		},
		() => {
			for (let y = 0; y < 高度; y++) {
				位移x(y, 0, 8 - 1);
				位移x(y, 寬度 - 1, 8);
			}
		},
		() => {
			for (let x = 0; x < 寬度; x++) {
				位移y(x, 4, 高度 - 1);
				位移y(x, 4 - 1, 0);
			}
		},
		() => {
			for (let y = 0; y < 高度; y++) {
				位移x(y, 8, 寬度 - 1);
				位移x(y, 8 - 1, 0);
			}
		},
		() => {
			for (let y = 0; y < 4; y++) {
				位移x(y, 0, 寬度 - 1);
			}
			for (let y = 4; y < 高度; y++) {
				位移x(y, 寬度 - 1, 0);
			}
		},
		() => {
			for (let x = 0; x < 8; x++) {
				位移y(x, 高度 - 1, 0);
			}
			for (let x = 8; x < 寬度; x++) {
				位移y(x, 0, 高度 - 1);
			}
		},
		() => {
			移動函數[5]();
			移動函數[4]();
		},
		() => {
			移動函數[7]();
			移動函數[6]();
		}
	];

	function 移動(關卡) {
		移動函數[關卡]();
		節點轉位置();
	}

	return {
		寬度, 高度,
		模式, 位置,
		節點, 座標,
		get 張數() { return 張數; },
		set 張數(n) { 張數 = n; },
		初始化,
		建立節點,
		一樣,
		位置相同,
		能否連線,
		檢查有解, 排除無解狀況,
		打亂,
		節點轉位置,
		移動,
	}
})();

let 提示位置 = [];
function 給提示() {
	if (提示位置.length == 2) {
		let [a, b] = 提示位置;
		if (麻將.座標(a).id != '無' && 麻將.座標(b).id != '無') return;
	}
	音效.select.replay();
	let 亂數 = [];
	for (let [色, 群] of Object.entries(麻將.位置)) {
		for (let [數, 位] of Object.entries(群)) {
			for (let i = 0; i < 位.length; i++) {
				亂數.push({ id: `${數}${色}`, 位: 位[i] });
			}
		}
	}
	do {
		let m1 = 亂數.draw();
		let [數, 色] = m1.id.split('');
		if (麻將.模式[色][數] == 0) {
			let 位 = 麻將.位置[色][數];
			for (let i = 0; i < 位.length; i++) {
				for (let j = i + 1; j < 位.length; j++) {
					if (麻將.能否連線(位[i], 位[j]).成功) {
						提示位置 = [位[i], 位[j]];
						麻將.座標(位[i]).see(true);
						麻將.座標(位[j]).see(true);
						return;
					}
				}
			}
		} else {
			for (let [數1, 位1] of Object.entries(麻將.位置[色])) {
				if (位1.length < 1) continue;
				for (let [數2, 位2] of Object.entries(麻將.位置[色])) {
					if (數1 == 數2) continue;
					if (位2.length < 1) continue;
					if (麻將.模式[色][數1] != 麻將.模式[色][數2]) continue;
					if (麻將.能否連線(位1[0], 位2[0]).成功) {
						提示位置 = [位1[0], 位2[0]];
						麻將.座標(位1[0]).see(true);
						麻將.座標(位2[0]).see(true);
						return;
					}
				}
			}
		}
	} while (亂數.length > 0);
}
function 清理提示() {
	if (提示位置.length == 2) {
		let [a, b] = 提示位置;
		麻將.座標(a).see(false);
		麻將.座標(b).see(false);
	}
	提示位置 = [];
}

async function 麻將連線(...args) {
	連線path.setAttribute('d', 'M' + args.map(({ x, y }) => (x * 60 + 30) + ',' + (y * 80 + 40)).join('L'));
	await sleep(100);
	連線path.removeAttribute('d');
}

let 選擇麻將 = null;
async function 記錄選擇麻將(x, y) {
	if (麻將.節點[y][x].id == '無') return;
	if (選擇麻將 === null) {
		音效.select.replay();
		麻將.節點[y][x].lock(true);
		選擇麻將 = { x, y };
	} else {
		let a = 選擇麻將;
		let b = { x, y };
		if (麻將.位置相同(a, b)) return;
		選擇麻將 = null;
		try {
			if (!麻將.一樣(a, b)) throw 'no';
			let 結果 = 麻將.能否連線(a, b);
			if (!結果.成功) throw 'no';
			音效.connect.replay();
			清理提示();
			麻將.座標(b).lock(true);
			麻將.張數 -= 2;
			分數.num += 20;
			await 麻將連線(a, ...結果.轉角, b);
			麻將.座標(a).id = '無';
			麻將.座標(b).id = '無';
			if (麻將.張數) {
				麻將.移動(關卡.num);
				if (!麻將.檢查有解()) {
					if (全變.num > 0) {
						全變.num--;
						麻將.打亂.全變();
					} else {
						return '沒有全變';
					}
				}
				// 給提示();
			} else {
				return '沒有麻將';
			}
		} catch (e) {
			音效.error.replay();
			麻將.座標(a).lock(false);
		}
		選擇麻將 = null;
	}
}

function 取消選擇麻將() {
	if (選擇麻將 === null) return;
	音效.deselect.replay();
	let a = 選擇麻將;
	麻將.座標(a).lock(false);
	選擇麻將 = null;
}

let 全變 = (() => {
	let _num = 0;
	return {
		set num(__num) {
			_num = __num;
			全變數量svg.querySelector(`text`).innerHTML = __num;
			if (_num == 0) {
				全變圖示.setAttribute('opacity', 0);
				全變數量svg.setAttribute('opacity', 0);
			} else {
				全變圖示.removeAttribute('opacity');
				全變數量svg.removeAttribute('opacity');
			}
		},
		get num() {
			return _num;
		}
	};
})();

let 提示 = (() => {
	let _num = 0;
	return {
		set num(__num) {
			_num = __num;
			提示數量svg.querySelector(`text`).innerHTML = __num;
			if (_num == 0) {
				提示圖示.setAttribute('opacity', 0);
				提示數量svg.setAttribute('opacity', 0);
			} else {
				提示圖示.removeAttribute('opacity');
				提示數量svg.removeAttribute('opacity');
			}
		},
		get num() {
			return _num;
		}
	};
})();

let 分數 = (() => {
	let _num = 0;
	return {
		set num(__num) {
			_num = __num;
			分數svg.querySelector(`text`).innerHTML = __num;
		},
		get num() {
			return _num;
		}
	};
})();

let 關卡 = (() => {
	let _num = 0;
	return {
		set num(__num) {
			_num = __num;
			關卡svg.querySelector(`text`).innerHTML = 'Level - ' + __num;
		},
		get num() {
			return _num;
		}
	};
})();

let 時間 = (() => {
	let 開始點 = 0;
	let 剩餘 = 0;
	let 計時器指標 = null;
	let 模式 = '結束';
	let 到了 = () => { };
	function 計時器函數() {
		let t = 450e3 - (Date.now() - 開始點);
		if (t <= 0) {
			時間條.setAttribute('width', 0);
			到了('時間');
		} else {
			時間條.setAttribute('width', Math.floor(t / 1e3));
		}
	}
	function 開始() {
		switch (模式) {
			case '結束':
				模式 = '開始';
				時間條.setAttribute('width', 450);
				開始點 = Date.now();
				計時器指標 = setInterval(計時器函數, 500);
				break;
			case '暫停':
				模式 = '開始';
				開始點 = Date.now() - (450e3 - 剩餘);
				計時器指標 = setInterval(計時器函數, 500);
				break;
			default:
				break;
		}
	}
	function 結束() {
		模式 = '結束';
		if (計時器指標 !== null)
			clearInterval(計時器指標);
	}
	function 暫停() {
		模式 = '暫停';
		剩餘 = 450e3 - (Date.now() - 開始點);
		if (計時器指標 !== null)
			clearInterval(計時器指標);
	}
	function 扣時() {
		開始點 -= 15e3;
		計時器函數();
	}
	return {
		開始,
		結束,
		暫停,
		扣時,
		get 剩餘() {
			if (剩餘 < 0) return 0;
			else return 剩餘;
		},
		set 到了(_到了) {
			到了 = _到了;
		}
	};
})();

let 音效檔名 = ['select', 'deselect', 'connect', 'error', 'change', 'clear_stage'];
let 音效 = Object.fromEntries(await Promise.all(音效檔名.map(v => loadsound(`音效/${v}.mp3`).then(a => [v, a]))));

async function 載入封面() {
	let img = await loadimg('封面.jpg');
	let canvas = text2html(`<canvas width="${img.naturalWidth}" height="${img.naturalHeight}"/>`);
	let ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);
	let imgdt = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
	let a = imgdt.data;
	for (let i = 0; i < a.length; i += 4) {
		let [h, s, v] = cc.rgb.hsv(a[i], a[i + 1], a[i + 2]);
		h = (h + 180) % 360;
		let [r, g, b] = cc.hsv.rgb(h, s, v);
		a[i] = r;
		a[i + 1] = g;
		a[i + 2] = b;
	}
	ctx.putImageData(imgdt, 0, 0);
	封面反向.setAttribute('href', await new Promise(r => canvas.toBlob(blob => r(URL.createObjectURL(blob)))));
}

async function 顯示信息(str) {
	let arr = str.split('\n');
	信息.querySelectorAll('tspan').forEach((tspan, key) => tspan.innerHTML = arr[key] ? arr[key] : '');
	遊戲.append(小窗);
	await new Promise(r => 確定.onmousedown = r);
	預設.append(小窗);
}

async function 遊戲開始() {
	選擇麻將 = null;
	分數.num = 0;
	主頁.show = 0;
	遊戲.show = 1;
	關卡.num = 0;
	全變.num = 19;
	try {
		while (true) {
			關卡.num++;
			全變.num++;
			提示.num = 5;
			麻將.張數 = 144;
			麻將.打亂.開始();
			時間.開始();
			// 給提示();
			try {
				while (true) {
					let 事件 = await Promise.any([
						...麻將.節點.flatMap(_v => _v.map(v => new Promise(r => v.svg.onmousedown = function (e) { if (e.button === 0) r(this); }))),
						new Promise(r => 遊戲.onmousedown = function (e) { if (e.button === 2) r(this); }),
						new Promise(r => 提示圖示.onmousedown = function (e) { if (e.button === 0) r(this); }),
						new Promise(r => 全變圖示.onmousedown = function (e) { if (e.button === 0) r(this); }),
						new Promise(r => 時間.到了 = r)
					]);
					if (事件 == '時間') throw '沒有時間';
					switch (事件.id) {
						case '遊戲':
							取消選擇麻將();
							break;
						case '提示圖示':
							try {
								if (提示位置.length == 2) {
									let [a, b] = 提示位置;
									if (麻將.座標(a).id != '無' && 麻將.座標(b).id != '無') throw 'no';
								}
								if (提示.num > 0) {
									提示.num--;
									時間.扣時();
									給提示();
								}
							} catch (e) { }
							break;
						case '全變圖示':
							清理提示();
							if (全變.num > 0) {
								全變.num--;
								時間.扣時();
								麻將.打亂.全變();
							}
							break;
						default:
							if (事件.dataset.麻將) {
								let { x, y } = 事件.dataset;
								let 回傳值 = await 記錄選擇麻將(Number(x), Number(y));
								if (回傳值) throw 回傳值;
							}
							break;
					}
				}
			} catch (e) {
				let 增加分數;
				switch (e) {
					case '沒有麻將':
						if (關卡.num < 11) {
							音效.clear_stage.replay();
							時間.暫停();
							增加分數 = Math.floor(時間.剩餘 / 1e3);
							分數.num += 增加分數;
							await 顯示信息(`恭喜過關！\n剩餘時間：${增加分數}秒\n目前分數：${分數.num}分`);
							時間.結束();
						} else {
							音效.clear_stage.replay();
							時間.暫停();
							增加分數 = Math.floor(時間.剩餘 / 1e3);
							分數.num += 增加分數 + 10000;
							await 顯示信息(`恭喜過關！\n剩餘時間：${增加分數}秒\n全破再增加10000分\n最終分數：${分數.num}分`);
							時間.結束();
							throw '遊戲全破';
						}
						break;
					case '沒有時間':
						音效.error.replay();
						時間.結束();
						增加分數 = (全變.num + 提示.num) * 50;
						分數.num += 增加分數;
						await 顯示信息(`時間用完！\n道具分數：${增加分數}分\n總結分數：${分數.num}分`);
						throw '沒有時間';
						break;
					case '沒有全變':
						音效.error.replay();
						時間.結束();
						await 顯示信息(`全變用完！\n總結分數：${分數.num}分`);
						throw '沒有全變';
						break;
					default:
						break;
				}
			}
		}
	} catch (e) {

	}
	遊戲.show = 0;
	主頁.show = 1;
}

document.body.oncontextmenu = () => false;
主頁.show = 1;
遊戲.show = 0;
載入圖示();
載入封面();
await 麻將.初始化();
玩.onmousedown = 遊戲開始;
window.parent.document.body.style.opacity = 1;
document.body.style.opacity = 1;
