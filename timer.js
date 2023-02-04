let 總時間 = 450e3;
let 開始點 = 0;
let 剩餘 = 0;
let 計時器指標 = null;
let 模式 = '結束';
let 設定時間條 = t => 時間條.setAttribute('width', Math.floor(t / 1e3));
let 到了 = () => { };
function 計時器函數() {
	let t = 總時間 - (Date.now() - 開始點);
	if (t <= 0) {
		設定時間條(0);
		到了();
	} else {
		設定時間條(t);
	}
}
function 開始() {
	switch (模式) {
		case '結束':
			模式 = '開始';
			設定時間條(總時間);
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
	if (模式 == '結束') return;
	模式 = '暫停';
	剩餘 = 總時間 - (Date.now() - 開始點);
	if (計時器指標 !== null) clearInterval(計時器指標);
}
function 扣時() {
	開始點 -= 15e3;
	計時器函數();
}

export default {
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
