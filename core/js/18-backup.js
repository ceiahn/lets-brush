'use strict';

/* =========================================================
   14-6. 기록 백업 · 옮기기 (v0.24.0)
     의도: 별 · 펫 · 연속 기록이 이 폰 브라우저 안에만 있어서, 폰을 바꾸거나 데이터를 지우거나
           여는 주소가 바뀌면(파일로 열기 → 웹 주소) 다 사라짐 → 파일 하나로 내보내고 불러오기
     담는 것: localStorage 의 bj_ 로 시작하는 값 전부 (진행 · 설정 · 언어팩)
     안 담는 것: IndexedDB 의 큰 파일 (내 음악 · 내 목소리 녹음 · 넣은 스페셜 영상) → 새 기기에서 다시 넣기
     파일 모양: { app:'banjjak', v:1, ver:'v0.24.0', at:'날짜', data:{ 'bj_키':'저장된 글자 그대로' } }
     부모님 설정 "💾 기록 백업" 카드. 마지막 백업 날짜는 bj_backupAt (설정 취급, 처음부터 다시에도 남음)
   ========================================================= */
const BK_APP = 'banjjak';
function bkInfo(){
  const at = store.get('backupAt', null);
  $('#bkInfo').textContent = at ? t('bk.last', { d:at }) : t('bk.never');
  const old = !at || (Date.now() - new Date(String(at).replace(/-/g, '/')).getTime()) > 30 * 86400000;   // v0.33.0 한 달 넘게 백업 안 했으면 알림
  $('#bkWarn').hidden = !(old && new Set(log).size >= 7); $('#bkWarn').textContent = t('bk.remind');
}
const BK_SKIP = 'bj_testMode';                       // v0.28.1 테스트 모드 기억은 기기마다 따로 (백업 · 불러오기에서 뺌)
function bkSave(){
  const data = {};
  try{ for (let i = 0; i < localStorage.length; i++){ const k = localStorage.key(i); if (k && k.indexOf('bj_') === 0 && k !== BK_SKIP) data[k] = localStorage.getItem(k); } }catch(e){}
  const d = new Date(), pad = (n) => String(n).padStart(2, '0');
  const day = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const out = { app:BK_APP, v:1, ver:$('#ver').textContent, at:day + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()), data };
  const blob = new Blob([JSON.stringify(out)], { type:'application/json' });
  const name = 'letsbrush_backup_' + day + '.json';            // 파일 안의 app:'banjjak' 표시는 예전 백업과 맞추려고 그대로
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  store.set('backupAt', day); bkInfo(); toast(t('bk.saved', { name }), 4000);
}
function bkLoad(file){
  if (!file) return;
  const r = new FileReader();
  r.onload = () => {
    let obj = null;
    try{ obj = JSON.parse(r.result); }catch(e){}
    if (!obj || obj.app !== BK_APP || !obj.data || typeof obj.data !== 'object'){ toast(t('bk.bad'), 4000); return; }
    const keys = Object.keys(obj.data).filter(k => k.indexOf('bj_') === 0 && k !== BK_SKIP && typeof obj.data[k] === 'string');
    if (!keys.length){ toast(t('bk.bad'), 4000); return; }
    dialog({ text:t('bk.q', { at:obj.at || '?' }), ok:t('bk.ok'), cancel:t('reset.cancel'), onOk(){
      try{
        const old = []; for (let i = 0; i < localStorage.length; i++){ const k = localStorage.key(i); if (k && k.indexOf('bj_') === 0 && k !== BK_SKIP) old.push(k); }
        old.forEach(k => localStorage.removeItem(k));
        keys.forEach(k => localStorage.setItem(k, obj.data[k]));
        localStorage.setItem('bj_backupAt', JSON.stringify(String(obj.at || '').slice(0, 10)));
      }catch(e){ toast(t('bk.fail'), 4000); return; }
      location.reload();
    } });
  };
  r.onerror = () => toast(t('bk.bad'), 4000);
  r.readAsText(file);
}
$('#bkSave').addEventListener('click', () => { sfx.tap(); bkSave(); });
$('#bkLoad').addEventListener('click', () => { sfx.tap(); $('#bkFile').click(); });
$('#bkFile').addEventListener('change', (e) => { bkLoad(e.target.files && e.target.files[0]); e.target.value = ''; });
bkInfo();

// 홈 화면 앱(PWA): 웹 주소(http/https)로 열었을 때만 sw.js 를 등록 → 인터넷 없이도 열림
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)){
  window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
}
