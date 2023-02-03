import cc from "./colorconvert.js";
Object.prototype.entries = function () { return Object.entries(this); };
Object.prototype.forEach = function (cb = () => { }) { this.entries().forEach(([k, v]) => cb(v, k)); };
Object.defineProperty(Node.prototype, 'show', {
	set: function (s) {
		this.style.opacity = s;
		this.style.zIndex = s;
	}
});
Array.prototype.draw = function () { return this.length <= 0 ? null : this.splice(Math.floor(Math.random() * this.length), 1)[0]; };

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
		筒: { 一: 0, 二: 0, 三: 0, 四: 0, 五: 0, 六: 0, 七: 0, 八: 0, 九: 0 },
		條: { 一: 0, 二: 0, 三: 0, 四: 0, 五: 0, 六: 0, 七: 0, 八: 0, 九: 0 },
		萬: { 一: 0, 二: 0, 三: 0, 四: 0, 五: 0, 六: 0, 七: 0, 八: 0, 九: 0 },
		風: { 東: 0, 南: 0, 西: 0, 北: 0 },
		元: { 中: 0, 發: 0, 白: 0 },
		花: { 春: 1, 夏: 1, 秋: 1, 冬: 1, 梅: 2, 蘭: 2, 菊: 2, 竹: 2 }
	};
	let 位置 = {
		筒: { 一: [], 二: [], 三: [], 四: [], 五: [], 六: [], 七: [], 八: [], 九: [] },
		條: { 一: [], 二: [], 三: [], 四: [], 五: [], 六: [], 七: [], 八: [], 九: [] },
		萬: { 一: [], 二: [], 三: [], 四: [], 五: [], 六: [], 七: [], 八: [], 九: [] },
		風: { 東: [], 南: [], 西: [], 北: [] },
		元: { 中: [], 發: [], 白: [] },
		花: { 春: [], 夏: [], 秋: [], 冬: [], 梅: [], 蘭: [], 菊: [], 竹: [] }
	};
	let 節點 = [];
	let 座標 = ({ x, y }) => 節點[y][x];
	let 張數 = 0;

	let 模式掃描 = cb => 模式.forEach((群, 色) => 群.forEach((模, 數) => cb(色, 數, 模)));
	let 位置掃描 = cb => 位置.forEach((群, 色) => 群.forEach((位, 數) => cb(色, 數, 位)));
	let 版面掃描 = cb => range_nl(0, 高度).forEach(i => range_nl(0, 寬度).forEach(j => cb(i, j)));
	let 位掃描 = (位, cb) => range_nl(0, 位.length).forEach(i => range_nl(i + 1, 位.length).forEach(j => cb(i, j)));

	async function 初始化() {
		模式掃描((色, 數, 模) => 預設.append(text2svg(`<image id="${數}${色}" width="60" height="80" href="麻將/${色}/${數}.svg"/>`)));
		range_nl(0, 高度).forEach(i => { 節點[i] = []; range_nl(0, 寬度).forEach(j => 節點[i][j] = 建立節點(i, j)) });
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

	let 位置相同 = (a, b) => a.x == b.x && a.y == b.y;

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
	async function 連線(...args) {
		連線path.setAttribute('d', 'M' + args.map(({ x, y }) => (x * 60 + 30) + ',' + (y * 80 + 40)).join('L'));
		await sleep(100);
		連線path.removeAttribute('d');
	}

	function 檢查有解() {
		try {
			let 檢測確認 = (a, b) => { if (能否連線(a, b).成功) throw true; };
			位置.forEach((群, 色) => {
				if (模式[色][Object.entries(群)[0][0]] == 0) {
					群.forEach((位, 數) => 位掃描(位, (i, j) => 檢測確認(位[i], 位[j])));
				} else {
					群.forEach((位1, 數1) => {
						if (位1.length < 1) return;
						群.forEach((位2, 數2) => {
							if (數1 == 數2) return;
							if (位2.length < 1) return;
							if (模式[色][數1] != 模式[色][數2]) return;
							檢測確認(位1[0], 位2[0]);
						});
					});
				}
			});
			return false;
		} catch (e) { return true; }
	}
	function 排除無解狀況() {
		let 亂數 = [];
		位置掃描((色, 數, 位) => 位.forEach(v => 亂數.push({ id: `${數}${色}`, 位: v })));
		let m1 = 亂數.draw();
		while (亂數.length > 0) {
			let m2 = 亂數.draw();
			if (能否連線(m1.位, m2.位).成功) {
				let [數1, 色1] = m1.id.split('');
				let 位1 = 位置[色1][數1];
				let p1 = 位1.findIndex(v => !位置相同(v, m1.位));
				let [數2, 色2] = m2.id.split('');
				let 位2 = 位置[色2][數2];
				let p2 = 位2.findIndex(v => !位置相同(v, m2.位));
				let [a, b] = [位1[p1], 位2[p2]] = [位2[p2], 位1[p1]];
				[座標(a).id, 座標(b).id] = [座標(b).id, 座標(a).id];
				return;
			}
		}
	}
	let 打亂 = {
		開始() {
			let 亂數 = [];
			模式掃描((色, 數, 模) => {
				位置[色][數] = [];
				if (模 == 0) {
					range_nl(0, 4).forEach(i => 亂數.push(`${數}${色}`));
				} else {
					亂數.push(`${數}${色}`);
				}
			});
			版面掃描((i, j) => {
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
			位置掃描((色, 數, 位) => {
				位.forEach(v => 亂數.push(`${數}${色}`));
				位置[色][數] = [];
			});
			版面掃描((i, j) => {
				if (節點[i][j].id != '無') {
					節點[i][j].id = 亂數.draw();
					let [數, 色] = 節點[i][j].id.split('');
					位置[色][數].push({ x: j, y: i });
				}
			});
			if (!檢查有解()) 排除無解狀況();
		}
	};
	let 提示 = {
		位置: [],
		顯示() {
			if (提示.位置.length == 2) {
				let [a, b] = 提示.位置;
				if (座標(a).id != '無' && 座標(b).id != '無') return;
			}
			音效.select.replay();
			let 亂數 = [];
			位置掃描((色, 數, 位) => 位.forEach(v => 亂數.push({ id: `${數}${色}`, 位: v })));
			try {
				do {
					let 檢測確認 = (a, b) => {
						if (!能否連線(a, b).成功) return;
						提示.位置 = [a, b];
						座標(a).see(true);
						座標(b).see(true);
						throw 'ok';
					};
					let m1 = 亂數.draw();
					let [數, 色] = m1.id.split('');
					if (模式[色][數] == 0) {
						let 位 = 位置[色][數];
						位掃描(位, (i, j) => 檢測確認(位[i], 位[j]));
					} else {
						位置[色].forEach((位1, 數1) => {
							if (位1.length < 1) return;
							位置[色].forEach((位2, 數2) => {
								if (數1 == 數2) return;
								if (位2.length < 1) return;
								if (模式[色][數1] != 模式[色][數2]) return;
								檢測確認(位1[0], 位2[0]);
							});
						});
					}
				} while (亂數.length > 0);
			} catch (e) { }
		},
		清理() {
			if (提示.位置.length == 2) {
				let [a, b] = 提示.位置;
				座標(a).see(false);
				座標(b).see(false);
			}
			提示.位置 = [];
		},
		存在() {
			if (提示.位置.length == 2) {
				let [a, b] = 提示.位置;
				if (座標(a).id != '無' && 座標(b).id != '無') return true;
			}
			return false;
		}
	};
	function 節點轉位置() {
		位置掃描((色, 數, 位) => 位置[色][數] = []);
		版面掃描((i, j) => {
			if (節點[i][j].id != '無') {
				let [數, 色] = 節點[i][j].id.split('');
				位置[色][數].push({ x: j, y: i });
			}
		});
	}

	function 位移x(y, 開始, 結束) {
		range(開始, 結束).forEach(x => {
			if (節點[y][x].id != '無') return;
			range_nf(x, 結束).find(_x => {
				if (節點[y][_x].id != '無') {
					節點[y][x].id = 節點[y][_x].id;
					節點[y][_x].id = '無';
					return true;
				}
			});
		});
	}
	function 位移y(x, 開始, 結束) {
		range(開始, 結束).forEach(y => {
			if (節點[y][x].id != '無') return;
			range_nf(y, 結束).find(_y => {
				if (節點[_y][x].id != '無') {
					節點[y][x].id = 節點[_y][x].id;
					節點[_y][x].id = '無';
					return true;
				}
			});
		});
	}

	let 移動函數 = [
		() => { },
		() => { },
		() => range_nl(0, 寬度).forEach(x => 位移y(x, 高度 - 1, 0)),
		() => range_nl(0, 高度).forEach(y => 位移x(y, 0, 寬度 - 1)),
		() => range_nl(0, 寬度).forEach(x => { 位移y(x, 0, 4 - 1); 位移y(x, 高度 - 1, 4); }),
		() => range_nl(0, 高度).forEach(y => { 位移x(y, 0, 8 - 1); 位移x(y, 寬度 - 1, 8); }),
		() => range_nl(0, 寬度).forEach(x => { 位移y(x, 4, 高度 - 1); 位移y(x, 4 - 1, 0); }),
		() => range_nl(0, 高度).forEach(y => { 位移x(y, 8, 寬度 - 1); 位移x(y, 8 - 1, 0); }),
		() => range_nl(0, 高度).forEach(y => y < 4 ? 位移x(y, 0, 寬度 - 1) : 位移x(y, 寬度 - 1, 0)),
		() => range_nl(0, 寬度).forEach(x => x < 8 ? 位移y(x, 高度 - 1, 0) : 位移y(x, 0, 高度 - 1)),
		() => { 移動函數[5](); 移動函數[4](); },
		() => { 移動函數[7](); 移動函數[6](); }
	];

	function 移動(關卡) {
		移動函數[關卡]();
		節點轉位置();
	}
	let 選擇 = {
		位置: null,
		async 記錄(x, y) {
			if (節點[y][x].id == '無') return;
			if (選擇.位置 === null) {
				音效.select.replay();
				節點[y][x].lock(true);
				選擇.位置 = { x, y };
			} else {
				let a = 選擇.位置;
				let b = { x, y };
				if (位置相同(a, b)) return;
				選擇.位置 = null;
				try {
					if (!一樣(a, b)) throw 'no';
					let 結果 = 能否連線(a, b);
					if (!結果.成功) throw 'no';
					音效.connect.replay();
					提示.清理();
					座標(b).lock(true);
					張數 -= 2;
					分數.num += 20;
					await 連線(a, ...結果.轉角, b);
					座標(a).id = '無';
					座標(b).id = '無';
					if (張數) {
						移動(關卡.num);
						if (!檢查有解()) {
							if (全變.num > 0) {
								全變.num--;
								打亂.全變();
							} else {
								return '沒有全變';
							}
						}
						// 提示.顯示();
					} else {
						return '沒有麻將';
					}
				} catch (e) {
					音效.error.replay();
					座標(a).lock(false);
				}
				選擇.位置 = null;
			}
		},
		取消() {
			if (選擇.位置 === null) return;
			音效.deselect.replay();
			let a = 選擇.位置;
			座標(a).lock(false);
			選擇.位置 = null;
		}
	};
	return {
		節點,
		get 張數() { return 張數; },
		set 張數(n) { 張數 = n; },
		初始化,
		打亂,
		提示,
		選擇
	}
})();

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
	let 總時間 = 450e3;
	let 開始點 = 0;
	let 剩餘 = 0;
	let 計時器指標 = null;
	let 模式 = '結束';
	let 到了 = () => { };
	function 計時器函數() {
		let t = 總時間 - (Date.now() - 開始點);
		if (t <= 0) {
			時間條.setAttribute('width', 0);
			到了();
		} else {
			時間條.setAttribute('width', Math.floor(t / 1e3));
		}
	}
	function 開始() {
		switch (模式) {
			case '結束':
				模式 = '開始';
				時間條.setAttribute('width', Math.floor(總時間 / 1e3));
				開始點 = Date.now();
				計時器指標 = setInterval(計時器函數, 500);
				break;
			case '暫停':
				模式 = '開始';
				開始點 = Date.now() - (總時間 - 剩餘);
				計時器指標 = setInterval(計時器函數, 500);
				break;
			default:
				break;
		}
	}
	function 結束() {
		模式 = '結束';
		if (計時器指標 !== null) clearInterval(計時器指標);
	}
	function 暫停() {
		模式 = '暫停';
		剩餘 = 總時間 - (Date.now() - 開始點);
		if (計時器指標 !== null) clearInterval(計時器指標);
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
	信息.querySelectorAll('tspan').forEach((tspan, key) => tspan.innerHTML = arr[key] ?? '');
	遊戲.append(小窗);
	await new Promise(r => 確定.onmousedown = r);
	預設.append(小窗);
}

async function 遊戲開始() {
	麻將.選擇.位置 = null;
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
			// 麻將.提示.顯示();
			try {
				while (true) {
					let 物件 = await Promise.any([
						...麻將.節點.flatMap(_v => _v.map(v => new Promise(r => v.svg.onmousedown = function (e) { if (e.button === 0) r(this); }))),
						new Promise(r => 遊戲.onmousedown = function (e) { if (e.button === 2) r(this); }),
						new Promise(r => 提示圖示.onmousedown = function (e) { if (e.button === 0) r(this); }),
						new Promise(r => 全變圖示.onmousedown = function (e) { if (e.button === 0) r(this); }),
						new Promise(r => 時間.到了 = () => r({ id: '時間' }))
					]);
					switch (物件.id) {
						case '時間':
							throw '沒有時間';
							break;
						case '遊戲':
							麻將.選擇.取消();
							break;
						case '提示圖示':
							if (麻將.提示.存在()) break;
							if (提示.num > 0) {
								提示.num--;
								時間.扣時();
								麻將.提示.顯示();
							}
							break;
						case '全變圖示':
							麻將.選擇.取消();
							麻將.提示.清理();
							if (全變.num > 0) {
								全變.num--;
								時間.扣時();
								麻將.打亂.全變();
							}
							break;
						default:
							if (物件.dataset.麻將) {
								let { x, y } = 物件.dataset;
								let 回傳值 = await 麻將.選擇.記錄(Number(x), Number(y));
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
	} catch (e) { }
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
