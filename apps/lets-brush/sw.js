/*
  Let's Brush – 홈 화면 앱(PWA) 저장 도우미 (sw.js)
  버전: v0.50.0  |  2026-10-27   (index.html v0.50.0 와 짝)
  ------------------------------------------------------------
  의도: 웹 주소(https)로 연 앱을 폰에 저장해 두고, 인터넷이 없어도 열리게 함
   · index.html (화면) · css/ · js/ (v0.36.0 부터 나눈 앱 코드): 인터넷 먼저 → 새 버전을 올리면 바로 반영. 인터넷이 없으면 저장해 둔 것으로 엶
     v0.36.0: 서버에 "바뀌었나요?"만 물어보고(no-cache) 안 바뀐 파일은 다시 받지 않음 → 고친 파일만 새로 받음
   · 아이콘 · resources.js · manifest.json: 저장해 둔 것 먼저 (빠름), 없으면 받아서 저장
   · 영상(specials/*.mp4 · webm)은 건드리지 않음 → 영상은 부분씩 받는 방식이라 여기서 저장하면 재생이 꼬일 수 있음
     (v0.43.0 부터 앱이 다음 영상 2편을 폰 안(IndexedDB)에 미리 받아 둠 → 인터넷 없이도 그 2편은 나옴)
   · 글꼴(fonts/)은 v0.35.0 부터 같은 주소 → 저장해 둔 것 먼저 (한 번 쓴 글자 조각만 받아서 저장)
   · 다른 주소는 건드리지 않음
  ★ index.html 을 새 버전으로 올릴 때 아래 CACHE 이름의 버전도 같이 바꿀 것 (예전 저장본이 정리됨)
  ★ js/ 에 파일을 더하거나 이름을 바꾸면 아래 APP 목록도 index.html 의 <script> 줄과 똑같이 맞출 것
*/
const CACHE = 'lets-brush-v0.50.0';   // v0.48.0 이름 앞부분을 앱 이름으로 (예전 banjjak- 저장본은 지움)
const APP = ['./index.html', './css/app.css',
  '../../core/js/00-base.js',
  '../../core/js/00-club.js',
  './js/00-config.js',
  '../../core/js/01-store.js',
  './js/02-lang.js',
  '../../core/js/02-strings.js',
  '../../core/js/02-text.js',
  '../../core/js/03-dates.js',
  './js/03-events.js',
  '../../core/js/04-habit.js',
  './js/04-state.js',
  './js/05-items.js',
  '../../characters/sparkle/js/06-character.js',
  '../../core/js/07-helpers.js',
  '../../core/js/08-sound.js',
  '../../core/js/09-effects.js',
  './js/10-closet.js',
  '../../core/js/11-gate.js',
  './js/11-settings.js',
  './js/12-brush.js',
  '../../core/js/13-pet-art.js',
  '../../core/js/14-eggs.js',
  './js/14-pets.js',
  './js/15-game.js',
  './js/16-th-art.js',
  './js/16-th-s01.js',
  './js/16-th-s02.js',
  './js/16-th-s03.js',
  './js/16-th-s04.js',
  './js/16-th-s05.js',
  './js/16-theater.js',
  './js/17-special.js',
  '../../core/js/18-backup.js',
  './js/19-map.js',
  '../../core/js/20-club.js',
  './js/20-dev.js',
  '../../core/js/20-kids.js',
  '../../core/js/20-webgate.js',
  './js/21-home.js',
  '../../core/js/22-play.js',
  '../../core/js/23-share.js'];
const CORE = ['./', ...APP, './manifest.json', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png'];
const OPTIONAL = ['./resources.js', '../../core/fonts/jua.css', './privacy.html', './terms.html'];   // 없어도 됨

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(CORE);
    await Promise.all(OPTIONAL.map(u => c.add(u).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => (k.startsWith('lets-brush-') || k.startsWith('banjjak-')) && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;                         // 다른 주소는 그대로
  if (req.headers.has('range') || /\.(mp4|webm|mov|m4v)$/i.test(url.pathname)) return;   // 영상은 그대로
  if (/\/specials\/[^/]*\.txt$/i.test(url.pathname)) return;                   // v0.35.0 영상 제목 목록은 늘 새로 (저장본 안 씀)
  const isPage = req.mode === 'navigate' || /\/(index\.html)?$/.test(url.pathname);
  const isCode = /\/(js|css)\/[^/]+\.(js|css)$/.test(url.pathname);            // v0.36.0 나눈 앱 코드 (fonts/ 는 아님)
  if (isPage || isCode){                                                   // 화면 · 앱 코드: 인터넷 먼저
    const key = isPage ? './index.html' : req;
    e.respondWith((async () => {
      try{
        const res = await fetch(req, { cache:'no-cache' });                // 안 바뀌었으면 서버가 "그대로"(304)라고만 답함
        if (res && res.ok){ const c = await caches.open(CACHE); c.put(key, res.clone()); }
        return res;
      }catch(err){
        return (await caches.match(key, { ignoreSearch:isCode })) || (isPage && await caches.match('./')) || Response.error();
      }
    })());
    return;
  }
  e.respondWith((async () => {                                             // 나머지: 저장본 먼저
    const hit = await caches.match(req);
    if (hit) return hit;
    try{
      const res = await fetch(req);
      if (res && res.ok){ const c = await caches.open(CACHE); c.put(req, res.clone()); }
      return res;
    }catch(err){ return Response.error(); }
  })());
});
