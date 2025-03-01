import hueRotateFilter from "./hueRotateFilter.js";
import 數據 from "./data.js";
import 時間 from "./timer.js";
import 音效 from "./soundeffect.js";
import 麻將 from "./mahjong.js";

Object.defineProperty(Node.prototype, 'show', { set: function (s) { this.style.display = s == 1 ? 'inline' : 'none'; } });

async function 載入圖示() {
	parent.document.querySelector('[rel="icon"]').href = svgtext2url(
		`<svg viewBox="-50 0 400 400" width="400" height="400" xmlns="http://www.w3.org/2000/svg">
		<rect x="5" y="5" rx="15" ry="15" fill="#f5f5f5" width="290" height="390" />
		${xml2text(document.querySelector('#中'))}
		</svg>`
	);
}

let 載入封面 = async () => 封面反向.setAttribute('href', await hueRotateFilter('封面.jpg', 180));

async function 顯示信息(str) {
	let arr = str.split('\n');
	信息.querySelectorAll('tspan').forEach((tspan, key) => tspan.innerHTML = arr[key] ?? '');
	遊戲.append(小窗);
	await new Promise(r => 確定.onmousedown = r);
	預設.append(小窗);
}

async function 遊戲開始() {
	麻將.選擇.取消();
	數據.分數 = 0;
	主頁.show = 0;
	遊戲.show = 1;
	設定.show = 0;
	數據.關卡 = 0;
	數據.全變 = 19;
	let 遊戲進行 = true;
	while (遊戲進行) {
		數據.關卡++;
		數據.全變++;
		數據.提示 = 5;
		麻將.打亂.開始();
		時間.開始();
		麻將.測試();
		let 中斷訊息 = '';
		while (中斷訊息 == '') {
			let 物件 = await Promise.any([
				...麻將.節點.flatMap(_v => _v.map(v => new Promise(r => v.svg.onmousedown = function (e) { if (e.button === 0) r(this); }))),
				new Promise(r => 遊戲.onmousedown = function (e) { if (e.button === 2) r(this); }),
				new Promise(r => 提示圖示.onmousedown = function (e) { if (e.button === 0) r(this); }),
				new Promise(r => 全變圖示.onmousedown = function (e) { if (e.button === 0) r(this); }),
				new Promise(r => 時間.到了 = () => r({ id: '時間' }))
			]);
			switch (物件.id) {
				case '時間':
					中斷訊息 = '沒有時間';
					break;
				case '遊戲':
					麻將.選擇.取消();
					break;
				case '提示圖示':
					if (麻將.提示.存在()) break;
					if (數據.提示 <= 0) break;
					數據.提示--;
					時間.扣時();
					麻將.提示.顯示();
					break;
				case '全變圖示':
					if (數據.全變 <= 0) break;
					麻將.選擇.取消();
					麻將.提示.清理();
					數據.全變--;
					時間.扣時();
					麻將.打亂.全變();
					break;
				default:
					if (物件.parentNode.id != '牌區') break;
					let { x, y } = 物件.dataset;
					中斷訊息 = await 麻將.選擇.記錄(Number(x), Number(y)) ?? '';
					break;
			}
		}
		let 增加分數;
		switch (中斷訊息) {
			case '沒有麻將':
				時間.暫停();
				音效.clear_stage.replay();
				增加分數 = Math.floor(時間.剩餘 / 1e3);
				數據.分數 += 增加分數;
				if (數據.關卡 < 11) {
					await 顯示信息(`恭喜過關！\n剩餘時間：${增加分數}秒\n目前分數：${數據.分數}分`);
				} else {
					數據.分數 += 10000;
					await 顯示信息(`恭喜過關！\n剩餘時間：${增加分數}秒\n全破再增加10000分\n最終分數：${數據.分數}分`);
					遊戲進行 = false;
				}
				時間.結束();
				break;
			case '沒有時間':
				時間.結束();
				音效.error.replay();
				增加分數 = (數據.全變 + 數據.提示) * 50;
				數據.分數 += 增加分數;
				await 顯示信息(`時間用完！\n道具分數：${增加分數}分\n總結分數：${數據.分數}分`);
				遊戲進行 = false;
				break;
			case '沒有全變':
				時間.結束();
				音效.error.replay();
				await 顯示信息(`全變用完！\n總結分數：${數據.分數}分`);
				遊戲進行 = false;
				break;
			default:
				break;
		}
	}
	遊戲.show = 0;
	主頁.show = 1;
	設定.show = 0;
}

document.body.oncontextmenu = () => false;
主頁.show = 1;
遊戲.show = 0;
設定.show = 0;
載入圖示();
載入封面();
玩.onmousedown = 遊戲開始;
改.onmousedown = function () {
	主頁.show = 0;
	遊戲.show = 0;
	設定.show = 1;
};
設定確定.onmousedown = function () {
	主頁.show = 1;
	遊戲.show = 0;
	設定.show = 0;
};
parent.document.body.style.opacity = 1;
document.body.style.opacity = 1;
