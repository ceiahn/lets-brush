'use strict';

/* =========================================================
   3. 이벤트 (Let's Brush): 명절 · 기념일에 반짝이가 입는 옷 · 화면 효과 · 보너스 별
      날짜 · 나라 엔진과 명절 목록(HOLIDAYS)은 core/js/03-dates.js (v0.49.0 모듈화 2단계)
      look: 이벤트 기간 기본 옷 / effect: 화면 효과 / bonus: 생일 등 보너스 별
      의도: 사는 나라에 맞는 명절 · 기념일에 깜짝 옷 · 화면 효과 · 보너스 별 → "오늘은 뭔가 다르다" 느낌
            아이가 꾸미기에서 바꾼 옷이 이벤트 옷보다 우선 (evOverrides)
   ========================================================= */
const EVENT_LOOK = {
  birthday: { look:{ head:'head_party', hand:'hand_cake' }, effect:'balloon', bonus:5 },
  seollal: { look:{ hand:'hand_bok' }, effect:'star' },
  chuseok: { look:{ head:'head_bunny' }, effect:'star' },
  childrensday: { look:{ head:'head_party', hand:'hand_pinwheel' }, effect:'petal' },
  halloween: { look:{ head:'head_witch', hand:'hand_pumpkin' }, effect:'bat' },
  xmas: { look:{ head:'head_santa', hand:'hand_present' }, effect:'snow' },
  lunarny: { look:{ hand:'hand_bok' }, effect:'star' },
  easter: { look:{ head:'head_bunny', hand:'hand_flower' }, effect:'petal' },
  thanksgiving: { look:{ head:'head_party' }, effect:'petal' },
  thanksgivingca: { look:{ head:'head_party' }, effect:'petal' },
  july4: { look:{ head:'head_party' }, effect:'star' },
  bonfire: { look:{}, effect:'star' },
  setsubun: { look:{}, effect:'star' },
  hinamatsuri: { look:{ hand:'hand_flower' }, effect:'petal' },
  tanabata: { look:{}, effect:'star' },
  shichigosan: { look:{ head:'head_crown' }, effect:'star' },
  kidsday_mx: { look:{ head:'head_party', hand:'hand_pinwheel' }, effect:'petal' },
  kidsday_tw: { look:{ head:'head_party', hand:'hand_pinwheel' }, effect:'petal' },
  kidsday_cn: { look:{ head:'head_party', hand:'hand_pinwheel' }, effect:'petal' },
  kidsday_id: { look:{ head:'head_party', hand:'hand_pinwheel' }, effect:'petal' },
  kidsday_br: { look:{ head:'head_party', hand:'hand_pinwheel' }, effect:'petal' },
  kidsday_in: { look:{ head:'head_party', hand:'hand_pinwheel' }, effect:'petal' },
  kidsday_th: { look:{ head:'head_party', hand:'hand_pinwheel' }, effect:'petal' },
  newyear: { look:{ head:'head_party' }, effect:'star' }
};
const EVENTS = HOLIDAYS.map(h => Object.assign({ look:{}, effect:'star' }, h, EVENT_LOOK[h.id] || {}));
// 외부 리소스: 이벤트 추가·교체 (같은 id면 바꿈). texts:{ ko:{ name, greet, cheer } }
(RES.events || []).forEach(e => {
  if (!e || !e.id || !e.when) return;
  const i = EVENTS.findIndex(x => x.id === e.id);
  const ev = Object.assign({ icon:'⭐', countries:'*', look:{}, effect:'star' }, e);
  if (i >= 0) EVENTS[i] = ev; else EVENTS.push(ev);
  Object.entries(e.texts || {}).forEach(([code, tx]) => {
    if (!packs[code]) return;
    Object.entries(tx).forEach(([k, v]) => { packs[code].strings[`event.${e.id}.${k}`] = v; });
  });
});
