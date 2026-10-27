'use strict';


/* =========================================================
   0. 설정값 · 외부 리소스
      RES = window.BJ_RESOURCES (resources.js에서 넣음, 없으면 빈 값)
      CONFIG = 아래 기본값 + RES.config로 덮어쓰기
      의도: 숫자 조절(보상 · 확률 · 속도)은 코드 대신 여기서만. 출시 땐 resources.js 의 config 로 덮어씀
            testMode 는 개발 중 편의(별 100개, 개발자 메뉴) → 출시 전 반드시 false
            v0.28.1 부터 주소로도 정할 수 있음: index.html?test=1 · ?test=0 · ?test=auto (4. 상태값 TEST_MODE 참고)
      v0.49.0 모듈화: 이 파일은 Let's Brush 설정값만. 공통 도우미($ · pick · 날짜)는 core/js/00-base.js,
            반짝이 클럽(구독 · 가격 · 결제 흉내 · 스토어 앱 확인)은 core/js/00-club.js
   ========================================================= */
const RES = (typeof window.BJ_RESOURCES === 'object' && window.BJ_RESOURCES) || {};
const CONFIG = Object.assign({
  testMode: false,                // v0.28.4 기본 꺼짐 (웹에 올려 다른 사람이 써도 안전하게). 내 폰에서 테스트는 주소 끝 ?test=1 (별 100개 선물, 개발자 메뉴)
  quiz: { star:1, stampsForPet:7 },
  // v0.32.0 반짝이 클럽 (구독). on:false 면 전부 열림 (지금 웹 버전). 스토어 앱으로 포장할 때 true + Billing 을 진짜 결제로
  //   v0.42.0 요금제 세 가지: month(월 구독) · year(연 구독, 기본으로 골라 둠) · life(평생 이용권, 한 번 결제). 정한 이유: docs/시장_언어_가격.md
  //   price 는 안내 글에만 씀 (실제 금액은 스토어가 정함 → 포장할 때 스토어 가격을 받아 와서 바꿈). cur = 통화, 숫자는 그 통화 금액
  subs: { on:'play', trialDays:7, freePets:30, freeIslands:1, askAfter:0, terms:'terms.html', privacy:'privacy.html',
    price:{ KR:{ cur:'KRW', month:3900, year:29000, life:59000 }, JP:{ cur:'JPY', month:550, year:3900, life:7800 },
            US:{ cur:'USD', month:3.99, year:29.99, life:59.99 }, GB:{ cur:'GBP', month:3.49, year:24.99, life:49.99 },
            CA:{ cur:'CAD', month:4.99, year:39.99, life:79.99 }, AU:{ cur:'AUD', month:5.99, year:44.99, life:89.99 },
            EU:{ cur:'EUR', month:3.99, year:29.99, life:59.99 }, other:{ cur:'USD', month:3.99, year:29.99, life:59.99 } } },
  // v0.45.0 구글 Play 결제 (스토어 앱 안에서만). 상품 ID 는 Play Console 에 만들 이름과 똑같이 (docs/스토어_앱_포장.md)
  play: { pkg:'com.tokkiyou.letsbrush', skus:{ month:'club_month', year:'club_year', life:'club_life' } },
  specialBase: '',                // v0.45.0 스페셜 영상을 다른 서버(예: Cloudflare R2)에 둘 때 주소. 비우면 앱 옆 specials/ 폴더
  shareUrl: '',                   // v0.45.0 자랑 카드에 적을 주소. 비우면 storeUrl, 그것도 비우면 지금 웹 주소
  // v0.47.0 웹 막기: true 면 브라우저로 연 사람에게는 "스토어에서 받아 주세요" 화면만 (스토어 앱 안 · 테스트 모드는 그대로 열림)
  //         개발 중에는 false. 출시할 때 true + storeUrl (docs/스토어_앱_포장.md 0장). 약관 · 처리방침 페이지는 늘 열림
  webBlock: false,
  storeUrl: '',                   // v0.47.0 구글 Play 앱 주소 (출시 뒤): https://play.google.com/store/apps/details?id=com.tokkiyou.letsbrush
  contact: 'tokkiyou.studio@gmail.com',     // v0.44.2 토끼유 스튜디오 메일 (v0.33.1 문의 이메일 (설정 부모님 칸 · 약관 · 처리방침 · 스토어)  // v0.30.0 오늘의 퀴즈: 맞히면 별 · 도장 1개, 도장 stampsForPet 개면 펫 한 마리
  popularFirst: true,             // v0.29.0 새 알 · 선물 펫은 아이들이 잘 아는 동물부터 (false = 전부 무작위)
  parentGate: true,               // v0.28.5 설정을 열 때 곱셈 문제로 어른 확인 (false = 안 물음)
  testParam: false,               // v0.44.0 출시 잠금: 주소(?test=1) · 기억 값을 무시. 내 폰에서 다시 시험하려면 잠깐 true 로 (docs/출시_준비.md)
  testStars: 100,
  firstGiftStars: 3,
  surfSplit: [0, .27, .6, .73, .87, 1], // 구역 안 시간 비율: 바깥쪽 · 씹는 면 · 어금니 안쪽 · 보스 기습(씹는 면 한 번 더) · 앞니 안쪽
  raid: true,                     // v0.26 보스 기습: 구역 끝 무렵 대장 세균이 그 구역 어금니에 세균을 숨김 (false = 끔)
  reward: { base:1, noPause:1, streak3:1, streak7:2, twice:1, event:1, birthday:5, lucky:2, luckyChance:.2, raid:1 },
  giftAutoOpenMs: 3200,
  tongueMs: 6800,
  recMaxSec: 15,
  musicMaxMB: 30,
  pauseWhenHidden: true,
  goldChance: .35,                // 양치 한 번에 황금 세균이 나올 확률
  shieldCost: 5, shieldMax: 3,    // 지킴이 방석 값 / 최대 개수
  mapSteps: 7, mapPerDay: 3       // 섬 하나의 칸 수 / 하루에 나아가는 최대 칸
}, RES.config || {});
CONFIG.reward = Object.assign({ base:1, noPause:1, streak3:1, streak7:2, twice:1, event:1, birthday:5, lucky:2, luckyChance:.2,
  gold:2, fairy:2, stamp:1, castle:5, mile:{ 3:3, 7:5, 14:7, 30:10 } }, (RES.config || {}).reward || {});
