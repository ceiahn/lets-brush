/* v0.48.0 모듈화: 앱이 apps/lets-brush/ 로 옮겨서, 예전 주소에 등록된 저장 도우미(sw.js)를 정리하는 파일
   예전 저장본(banjjak-…)을 지우고 스스로 등록을 풂 → 새 앱 폴더의 apps/lets-brush/sw.js 가 대신 일함. 폰 기록(localStorage · IndexedDB)은 건드리지 않음 */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('banjjak-')) await caches.delete(k);
    await self.registration.unregister();
  })());
});
