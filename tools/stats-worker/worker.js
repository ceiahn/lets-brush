/* 토끼유 스튜디오 익명 숫자 받는 곳 (v0.52.0) — Cloudflare Workers + D1
   앱(core/js/24-stats.js)이 하루 한 번 보내는 { app, v, lang, c:{ 'th:owl':[본, 끝까지, 건너뜀, 좋아요] } } 를 날짜별로 더해 둠
   저장하는 것: 날짜(UTC) · 앱 이름 · 언어 · 종류 · 이야기 id · 네 숫자. IP · 기기 · 시각 · 앱 버전은 저장하지 않음
   설치 · 보는 법: apps/lets-brush/docs/익명_숫자.md */
const CORS = { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'content-type', 'Access-Control-Max-Age':'86400' };
const ok = (txt, status = 200) => new Response(txt, { status, headers:CORS });

export default {
  async fetch(req, env){
    if (req.method === 'OPTIONS') return ok(null, 204);
    if (req.method !== 'POST') return ok('tokkiyou stats');
    const raw = await req.text();
    if (raw.length > 40000) return ok('too big', 413);
    let b; try{ b = JSON.parse(raw); }catch(e){ return ok('bad json', 400); }
    const app = String(b.app || ''), lang = String(b.lang || '');
    if (!/^[a-z0-9-]{1,30}$/.test(app) || !/^[a-z]{2}(-[a-z]{2})?$/i.test(lang) || !b.c || typeof b.c !== 'object') return ok('bad', 400);
    const rows = Object.entries(b.c).slice(0, 400).filter(([k, a]) => /^[a-z]{1,8}:[a-z0-9]{1,30}$/.test(k) && Array.isArray(a) && a.length === 4 && a.every(n => Number.isInteger(n) && n >= 0 && n <= 999));
    if (!rows.length) return ok('empty');
    const day = new Date().toISOString().slice(0, 10);
    const sql = `INSERT INTO counts (day, app, lang, kind, id, views, done, skips, likes) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
      ON CONFLICT(day, app, lang, kind, id) DO UPDATE SET views = views + ?6, done = done + ?7, skips = skips + ?8, likes = likes + ?9`;
    await env.DB.batch(rows.map(([k, a]) => { const [kind, id] = k.split(':'); return env.DB.prepare(sql).bind(day, app, lang.toLowerCase(), kind, id, a[0], a[1], a[2], a[3]); }));
    return ok('ok');
  }
};
