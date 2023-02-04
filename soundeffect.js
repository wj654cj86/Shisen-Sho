let 音效檔名 = ['select', 'deselect', 'connect', 'error', 'change', 'clear_stage'];
export default Object.fromEntries(await Promise.all(音效檔名.map(v => loadsound(`音效/${v}.mp3`).then(a => [v, a]))));
