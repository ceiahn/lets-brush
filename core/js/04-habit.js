'use strict';

/* =========================================================
   4-1. 습관 엔진 (v0.49.0 모듈화 3단계: "습관 1번 = 보상")
      양치 · 손 씻기 · 일과처럼 앱마다 습관은 달라도 기록하는 법은 같음
        · Habit.done()  습관 1번 마침 → 양치한 날 목록(log) · 주간 기록(log2: 날짜 · 아침/저녁 · 도장) · 지킴이 방석 자동 사용
                         돌려주는 값 { today:오늘 몇 번째, streak:연속 며칠, shielded:방석으로 메운 날 수 }
        · Habit.stamp() 마지막 기록에 부모님 칭찬 도장 · Habit.today() 오늘 몇 번
        · streakDays() 연속 기록 (오늘 아직이면 어제부터) · autoShield() 빠진 날을 방석으로 메움
      보상(별 · 알 · 펫 · 지도)은 앱이 Habit.done() 뒤에 정함. 알 · 펫 엔진은 14-eggs.js
      저장 (아이별): stars · log · log2 · covered · shields. 이름(log …)은 예전 그대로 (기존 기록이 그대로 읽힘)
   ========================================================= */
const firstRun = store.get('stars', null) === null;
let stars       = store.get('stars', CONFIG.firstGiftStars);
let log         = store.get('log', []);
// 연속 기록: 오늘 아직 안 닦았으면 어제부터 셈. 지킴이 방석으로 메운 날도 이어진 걸로
function streakDays(){
  const set = new Set(log.concat(store.get('covered', [])));
  const d = new Date(); if (!set.has(dkey(d))) d.setDate(d.getDate() - 1);
  let n = 0; while (set.has(dkey(d))){ n++; d.setDate(d.getDate() - 1); }
  return n;
}
// 어제(까지) 빠진 날이 있으면 방석으로 자동으로 메움 (최대 3일, 방석 수만큼)
function autoShield(){
  const sh = store.get('shields', 1); if (sh <= 0) return 0;
  const cov = store.get('covered', []), set = new Set(log.concat(cov));
  const d = new Date(); d.setDate(d.getDate() - 1);
  const miss = [];
  while (!set.has(dkey(d)) && miss.length < 3){ miss.push(dkey(d)); d.setDate(d.getDate() - 1); }
  if (!miss.length || miss.length > sh || !set.has(dkey(d))) return 0;
  store.set('covered', cov.concat(miss).slice(-60)); store.set('shields', sh - miss.length);
  return miss.length;
}
const Habit = {
  done(){
    log.push(todayKey()); if (log.length > 400) log = log.slice(-400); store.set('log', log);
    const L2 = store.get('log2', []); L2.push({ d:todayKey(), s:slotOf(), st:0 }); store.set('log2', L2.slice(-240));   // 주간 기록용
    const shielded = autoShield();
    return { today:Habit.today(), streak:streakDays(), shielded };
  },
  stamp(){ const L = store.get('log2', []); if (L.length){ L[L.length - 1].st = 1; store.set('log2', L); } },
  today(){ const k = todayKey(); return log.filter(x => x === k).length; }
};
