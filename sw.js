/*
  Let's Brush – 홈 화면 앱(PWA) 저장 도우미 (sw.js)
  버전: v0.29.1  |  2026-10-26   (index.html v0.29.1 와 짝)
  ------------------------------------------------------------
  의도: 웹 주소(https)로 연 앱을 폰에 저장해 두고, 인터넷이 없어도 열리게 함
   · index.html (화면): 인터넷 먼저 → 새 버전을 올리면 바로 반영. 인터넷이 없으면 저장해 둔 것으로 엶
   · 아이콘 · resources.js · manifest.json: 저장해 둔 것 먼저 (빠름), 없으면 받아서 저장
   · 영상(specials/*.mp4 · webm)은 건드리지 않음 → 영상은 부분씩 받는 방식이라 여기서 저장하면 재생이 꼬일 수 있음
     (인터넷 없이 영상까지 보려면 부모님 설정 "📥 스페셜 영상 넣기"로 폰 안에 넣어 두기)
   · 다른 주소(글꼴 등)도 건드리지 않음
  ★ index.html 을 새 버전으로 올릴 때 아래 CACHE 이름의 버전도 같이 바꿀 것 (예전 저장본이 정리됨)
*/
const CACHE = 'banjjak-v0.29.1';
const CORE = ['./', './index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png'];
const OPTIONAL = ['./resources.js'];   // 없어도 됨

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
    await Promise.all(keys.filter(k => k.startsWith('banjjak-') && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;                         // 다른 주소는 그대로
  if (req.headers.has('range') || /\.(mp4|webm|mov|m4v)$/i.test(url.pathname)) return;   // 영상은 그대로
  const isPage = req.mode === 'navigate' || /\/(index\.html)?$/.test(url.pathname);
  if (isPage){                                                             // 화면: 인터넷 먼저
    e.respondWith((async () => {
      try{
        const res = await fetch(req, { cache:'no-store' });
        if (res && res.ok){ const c = await caches.open(CACHE); c.put('./index.html', res.clone()); }
        return res;
      }catch(err){
        return (await caches.match('./index.html')) || (await caches.match('./')) || Response.error();
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
