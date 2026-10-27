'use strict';

/* =========================================================
   24. 익명 숫자 (v0.52.0) — 토끼유 스튜디오 공통
      의도: 아이들이 어떤 이야기를 좋아하는지 알고 싶음 → 이야기마다 "본 수 · 끝까지 본 수 · 건너뛴 수 · 좋아요 수" 숫자만
      지킬 것 (키즈앱):
        · 부모님이 설정에서 켠 경우만 (기본 꺼짐, 설정은 부모 확인 뒤). 꺼져 있으면 폰 안에도 안 셈
        · 보내는 것: 앱 이름 · 앱 버전 · 화면 언어 · { 'th:owl':[본, 끝까지, 건너뜀, 좋아요] … } 뿐
          아이 이름 · 생일 · 기기 번호 · 광고 ID · 시각 · 아이별 구분 없음. 쿠키 · 보낸 곳 주소(referrer)도 안 보냄
        · 하루에 한 번 모아서 보내고, 보낸 숫자는 폰에서 지움
      받는 곳: CONFIG.statsUrl (비우면 아무것도 안 함). 서버 예시: tools/stats-worker (Cloudflare Workers + D1, 받는 쪽도 IP 를 저장 안 함)
      앱과의 약속: CONFIG.statsUrl · CONFIG.statsApp(앱 이름) · 설정 칸 #statsRow · #statsTgl (없으면 건너뜀)
      쓰기: Stats.add('th', 'owl', 'view'|'done'|'skip'|'like') · Stats.flush()
   ========================================================= */
const Stats = (() => {
  const IDX = { view:0, done:1, skip:2, like:3 }, MAX_KEYS = 400, GAP = 20 * 3600 * 1000;
  const enabled = () => !!CONFIG.statsUrl && store.get('statsOn', false) === true;
  const read = () => store.get('stats', {});
  function add(kind, id, what){
    if (!enabled() || !(what in IDX) || !/^[a-z]{1,8}$/.test(kind) || !/^[a-z0-9]{1,30}$/.test(id)) return;
    const s = read(), key = kind + ':' + id;
    if (!s[key] && Object.keys(s).length >= MAX_KEYS) return;
    const row = s[key] || (s[key] = [0, 0, 0, 0]);
    row[IDX[what]] = Math.min(999, row[IDX[what]] + 1);
    store.set('stats', s);
  }
  async function flush(force){
    if (!enabled()) return false;
    const s = read();
    if (!Object.keys(s).length || (!force && Date.now() - store.get('statsSent', 0) < GAP)) return false;
    const body = JSON.stringify({ app:CONFIG.statsApp || 'app', v:typeof appVer === 'function' ? appVer() : '', lang:typeof lang === 'string' ? lang : '', c:s });
    try{
      const r = await fetch(CONFIG.statsUrl, { method:'POST', body, headers:{ 'content-type':'text/plain' }, credentials:'omit', referrerPolicy:'no-referrer', keepalive:true, cache:'no-store' });
      if (!r.ok) return false;
      const now = read();                                                // 보내는 동안 더한 숫자는 남김
      Object.keys(s).forEach(k => { if (now[k]){ now[k] = now[k].map((v, i) => v - s[k][i]); if (now[k].every(v => v <= 0)) delete now[k]; } });
      store.set('stats', now); store.set('statsSent', Date.now());
      return true;
    }catch(e){ return false; }
  }
  function setOn(on){ store.set('statsOn', !!on); if (!on) store.del('stats'); }
  function syncUI(){
    const row = typeof $ === 'function' && $('#statsRow'); if (!row) return;
    row.hidden = !CONFIG.statsUrl; const note = $('#statsNote'); if (note) note.hidden = !CONFIG.statsUrl;
    $('#statsTgl').checked = enabled();
  }
  if (typeof $ === 'function' && $('#statsTgl')) $('#statsTgl').addEventListener('change', (e) => setOn(e.target.checked));
  setTimeout(() => { syncUI(); flush(); }, 6000);
  return { add, flush, setOn, syncUI, enabled };
})();
