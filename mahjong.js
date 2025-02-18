import 數據 from "./data.js";
import 音效 from "./soundeffect.js";

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

let 模式掃描 = cb => Object.forEach(模式, (群, 色) => Object.forEach(群, (模, 數) => cb(色, 數, 模)));
let 位置掃描 = cb => Object.forEach(位置, (群, 色) => Object.forEach(群, (位, 數) => cb(色, 數, 位)));
let 節點掃描 = cb => range_nl(0, 高度).forEach(i => range_nl(0, 寬度).forEach(j => cb(i, j)));

function 建立節點(i, j) {
	let id = '無';
	let mod = -1;
	let img = text2svg(`<use transform="scale(0.2)"/>`);
	let rect = text2svg(`<use href="#框線" class="rect"/>`);
	let svg = text2svg(`<g style="--x:${j};--y:${i};" data-x="${j}" data-y="${i}" opacity="0"></g>`);
	let lock = b => rect.classList[b ? 'add' : 'remove']('lock');
	let see = b => rect.classList[b ? 'add' : 'remove']('see');
	svg.append(text2svg(`<use href="#框線" fill="#f5f5f5"/>`), img, rect, text2svg(`<use href="#框線" class="move"/>`));
	牌區.append(svg);
	return {
		svg, lock, see,
		get mod() { return mod; },
		set id(_id) {
			id = _id;
			see(false);
			lock(false);
			img.setAttribute('href', `#${id}`);
			if (id == '無') {
				mod = -1;
				svg.setAttribute('opacity', 0);
			} else {
				let [數, 色] = id.split('');
				mod = 模式[色][數];
				svg.removeAttribute('opacity');
			}
		},
		get id() { return id; }
	};
}

let 位置相同 = (a, b) => a.x == b.x && a.y == b.y;
let 一樣 = (a, b) => 座標(a).mod == 0 ? 座標(a).id == 座標(b).id : 座標(a).mod == 座標(b).mod;

function 能否連線(a, b) {
	let 有麻將 = ({ x, y }) => 節點[y][x].id != '無';
	let 結果 = { 成功: false };

	for (let i = 0; i < 2; i++) {
		let p = ['x', 'y'][i];
		let q = ['y', 'x'][i];
		range(a[p], b[p]).forEach(_p => {
			if (range_nfl(a[p], _p).some(M_p => 有麻將({ [p]: M_p, [q]: a[q] }))) return;
			if (_p != a[p] && 有麻將({ [p]: _p, [q]: a[q] })) return;
			if (range_nfl(a[q], b[q]).some(M_q => 有麻將({ [p]: _p, [q]: M_q }))) return;
			if (_p != b[p] && 有麻將({ [p]: _p, [q]: b[q] })) return;
			if (range_nfl(_p, b[p]).some(M_p => 有麻將({ [p]: M_p, [q]: b[q] }))) return;
			if (_p == a[p] && _p == b[p]) { 結果 = { 成功: true, 轉角: [] }; }
			else if (_p == a[p]) { 結果 = { 成功: true, 轉角: [{ [p]: _p, [q]: b[q] }] }; }
			else if (_p == b[p]) { 結果 = { 成功: true, 轉角: [{ [p]: _p, [q]: a[q] }] }; }
			else if (!結果.成功) { 結果 = { 成功: true, 轉角: [{ [p]: _p, [q]: a[q] }, { [p]: _p, [q]: b[q] }] }; }
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
			let N_p = -2;
			if (range_nl(_p, a[p]).some(M_p => 有麻將({ [p]: M_p, [q]: a[q] }))) continue;
			if (range_nl(_p, b[p]).some(M_p => 有麻將({ [p]: M_p, [q]: b[q] }))) continue;
			if (!range_nfl(_p, L_p).some(M_p => {
				if (有麻將({ [p]: M_p, [q]: a[q] })) return true;
				if (有麻將({ [p]: M_p, [q]: b[q] })) return true;
				if (range_nfl(a[q], b[q]).some(M_q => 有麻將({ [p]: M_p, [q]: M_q }))) return false;
				N_p = M_p;
				return true;
			})) N_p = L_p;
			if (N_p == -2) continue;
			let 步數 = Math.abs(N_p - a[p]) + Math.abs(N_p - b[p]) + Math.abs(a[q] - b[q]);
			if (!結果.成功 || 步數 < 結果.步數)
				結果 = { 成功: true, 轉角: [{ [p]: N_p, [q]: a[q] }, { [p]: N_p, [q]: b[q] }], 步數 };
		}
	}
	return 結果;
}
async function 連線(...args) {
	連線path.setAttribute('d', 'M' + args.map(({ x, y }) => (x * 60 + 30) + ',' + (y * 80 + 40)).join('L'));
	await sleep(100);
	連線path.removeAttribute('d');
}
function 位置轉陣列() {
	let 陣列 = [];
	位置掃描((色, 數, 位) => 位.forEach(v => 陣列.push({ id: `${數}${色}`, 位: v })));
	return 陣列;
}
let 位置清空 = () => 位置掃描((色, 數, 位) => 位置[色][數] = []);
function 找相同麻將(m, cb) {
	let [數, 色] = m.id.split('');
	let 位 = 位置[色][數];
	if (模式[色][數] == 0) {
		return 位.some((v, k) => !位置相同(v, m.位) && cb(位, k));
	} else {
		return Object.some(位置[色], (位2, 數2) => {
			if (數 == 數2) return false;
			if (位2.length < 1) return false;
			if (模式[色][數] != 模式[色][數2]) return false;
			return cb(位2, 0);
		});
	}
}
function 檢查有解() {
	let 陣列 = 位置轉陣列();
	while (陣列.length > 0) {
		let m1 = 陣列.shift();
		if (找相同麻將(m1, (位2, p2) => 能否連線(m1.位, 位2[p2]).成功)) return true;
	}
	return false;
}
function 排除無解狀況() {
	if (檢查有解()) return;
	let 陣列 = 位置轉陣列();
	let m1 = 陣列.draw();
	while (陣列.length > 0) {
		let m2 = 陣列.draw();
		if (!能否連線(m1.位, m2.位).成功) continue;
		找相同麻將(m1, (位1, p1) => {
			let [數2, 色2] = m2.id.split('');
			let 位2 = 位置[色2][數2];
			let p2 = 位2.findIndex(v => 位置相同(v, m2.位));
			let [a, b] = [位1[p1], 位2[p2]] = [位2[p2], 位1[p1]];
			[座標(a).id, 座標(b).id] = [座標(b).id, 座標(a).id];
			return true;
		});
		break;
	}
}
let 打亂 = {
	開始() {
		張數 = 144;
		let 陣列 = [];
		模式掃描((色, 數, 模) => {
			if (模 == 0) {
				range_nl(0, 4).forEach(i => 陣列.push(`${數}${色}`));
			} else {
				陣列.push(`${數}${色}`);
			}
		});
		位置清空();
		節點掃描((i, j) => {
			節點[i][j].id = 陣列.draw();
			let [數, 色] = 節點[i][j].id.split('');
			位置[色][數].push({ x: j, y: i });
		});
		排除無解狀況();
	},
	全變() {
		音效.change.replay();
		let 陣列 = 位置轉陣列();
		位置清空();
		節點掃描((i, j) => {
			if (節點[i][j].id == '無') return;
			節點[i][j].id = 陣列.draw().id;
			let [數, 色] = 節點[i][j].id.split('');
			位置[色][數].push({ x: j, y: i });
		});
		排除無解狀況();
	},
	測試() {
		if (張數 == 2) return;
		張數 = 4;
		let 陣列 = [];
		陣列.push(`春花`);
		陣列.push(`夏花`);
		陣列.push(`梅花`);
		陣列.push(`蘭花`);
		節點掃描((i, j) => 節點[i][j].id = '無');
		節點[5][7].id = `春花`;
		節點[5][8].id = `春花`;
		節點[6][7].id = `春花`;
		節點[6][8].id = `春花`;
		位置清空();
		節點掃描((i, j) => {
			if (節點[i][j].id == '無') return;
			節點[i][j].id = 陣列.draw();
			let [數, 色] = 節點[i][j].id.split('');
			位置[色][數].push({ x: j, y: i });
		});
		排除無解狀況();
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
		let 陣列 = 位置轉陣列();
		while (陣列.length > 0) {
			let m1 = 陣列.draw();
			if (找相同麻將(m1, (位2, p2) => {
				let a = m1.位, b = 位2[p2];
				if (!能否連線(a, b).成功) return false;
				提示.位置 = [a, b];
				座標(a).see(true);
				座標(b).see(true);
				return true;
			})) break;
		}
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
	位置清空();
	節點掃描((i, j) => {
		if (節點[i][j].id == '無') return;
		let [數, 色] = 節點[i][j].id.split('');
		位置[色][數].push({ x: j, y: i });
	});
}
function 位移x(y, 開始, 結束) {
	range(開始, 結束).forEach(x => {
		if (節點[y][x].id != '無') return;
		range_nf(x, 結束).some(_x => {
			if (節點[y][_x].id == '無') return false;
			節點[y][x].id = 節點[y][_x].id;
			節點[y][_x].id = '無';
			return true;
		});
	});
}
function 位移y(x, 開始, 結束) {
	range(開始, 結束).forEach(y => {
		if (節點[y][x].id != '無') return;
		range_nf(y, 結束).some(_y => {
			if (節點[_y][x].id == '無') return false;
			節點[y][x].id = 節點[_y][x].id;
			節點[_y][x].id = '無';
			return true;
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

function 測試() {
	// 提示.顯示();
	// 打亂.測試();
	// 數據.關卡 = 1;
	// 數據.全變 = 1000;
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
				數據.分數 += 20;
				await 連線(a, ...結果.轉角, b);
				座標(a).id = '無';
				座標(b).id = '無';
				if (張數) {
					移動(數據.關卡);
					if (!檢查有解()) {
						if (數據.全變 > 0) {
							數據.全變--;
							打亂.全變();
						} else {
							return '沒有全變';
						}
					}
					測試();
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

預設.append(text2svg(await loadfile('text', '麻將.svg')));
range_nl(0, 高度).forEach(i => { 節點[i] = []; range_nl(0, 寬度).forEach(j => 節點[i][j] = 建立節點(i, j)) });

export default {
	節點,
	打亂,
	提示,
	選擇,
	測試
};
