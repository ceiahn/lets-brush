'use strict';

/* =========================================================
   20-3. 웹 막기 (v0.49.0 모듈화 2단계: 앱 21-home.js 에서 나눔)
      CONFIG.webBlock 이면 브라우저로 연 사람에게 "스토어에서 받아 주세요" 화면(#webGate). 앱을 여는 코드(21-home)가 webBlocked() 를 먼저 봄
   ========================================================= */
/* v0.47.0 웹 막기 (CONFIG.webBlock): 브라우저로 연 사람에게는 앱 대신 "스토어에서 받아 주세요" 화면
   스토어 앱(TWA) 안 · 테스트 모드는 그대로. 막힌 화면 뒤에서 영상 미리 받기 · 안내 창도 안 함 */
const webBlocked = () => !!CONFIG.webBlock && !inTWA() && !TEST_MODE;
function webGateShow(){
  const g = $('#webGate'), u = CONFIG.storeUrl, c = subCfg();
  $('#wgStore').hidden = !u; if (u) $('#wgStore').href = u;
  $('#wgSoon').hidden = !!u;
  $('#wgLinks').innerHTML = [c.privacy && `<a href="${esc(c.privacy + '#' + lang)}" target="_blank" rel="noopener">${t('sub.privacy')}</a>`,
    c.terms && `<a href="${esc(c.terms + '#' + lang)}" target="_blank" rel="noopener">${t('sub.terms')}</a>`,
    CONFIG.contact && `<a href="mailto:${esc(CONFIG.contact)}">${t('sub.contact')}</a>`].filter(Boolean).join(' · ');
  g.hidden = false; specialOn = false;
}
