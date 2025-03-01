let 音效檔名 = ['select', 'deselect', 'connect', 'error', 'change', 'clear_stage'];
let 音效 = Object.fromEntries(await Promise.all(音效檔名.map(v => loadsound(`音效/${v}.mp3`).then(a => [v, a]))));

let 音效值 = (v => v == '' ? 0.5 : Number(v))(getCookie('音效值'));
function 設定音效svg(newX) {
	if (newX < 25) newX = 25;
	if (newX > 475) newX = 475;
	音效拉桿.cx.baseVal.value = newX;
	音效值 = (newX - 25) / 450;
	音效數值.innerHTML = Math.round(音效值 * 100) + '%';
}
function 調整音效() {
	setCookie('音效值', 音效值);
	Object.values(音效).forEach(v => v.volume = 音效值);
}
設定音效svg(音效值 * 450 + 25);
調整音效();
function 拉動音效拉桿(offset) {
	window.onmousemove = e => 設定音效svg(e.clientX + offset);
	window.onmouseup = () => {
		調整音效();
		window.onmousemove = () => { };
		window.onmouseup = () => { };
	};
}
音效拉桿.onmousedown = e => {
	拉動音效拉桿(音效拉桿.cx.baseVal.value - e.clientX);
};

音效拉條.onmousedown = e => {
	設定音效svg(e.clientX - 音效拉條.getBoundingClientRect().left);
	拉動音效拉桿(音效拉桿.cx.baseVal.value - e.clientX);
};

export default 音效;