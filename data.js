let 數據 = {};
function 道具(名稱, 格式 = n => n) {
	let 數量 = 0;
	let 數量text = document.querySelector(`#${名稱}svg>text`);
	let 圖示 = document.querySelector(`#${名稱}圖示`);
	Object.defineProperty(數據, 名稱, {
		get: () => 數量,
		set: _數量 => {
			數量 = _數量;
			數量text.innerHTML = 格式(數量);
			if (數量 <= 0) {
				數量text.setAttribute('opacity', 0);
				圖示.setAttribute('opacity', 0);
			} else {
				數量text.removeAttribute('opacity');
				圖示.removeAttribute('opacity');
			}
		}
	});
}
function 數值(名稱, 格式 = n => n) {
	let 數量 = 0;
	let 數量text = document.querySelector(`#${名稱}svg>text`);
	Object.defineProperty(數據, 名稱, {
		get: () => 數量,
		set: _數量 => {
			數量 = _數量;
			數量text.innerHTML = 格式(數量);
		}
	});
}

道具('全變');
道具('提示');
數值('分數');
數值('關卡', n => 'Level - ' + n);

export default 數據;
