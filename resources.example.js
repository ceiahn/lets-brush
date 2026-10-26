/*
  Let's Brush – 리소스 교체 예시 (resources.example.js)
  버전: v0.28.0  |  2026-10-26   (index.html v0.28.0 와 짝)
  ------------------------------------------------------------
  ★ 이 파일의 의도 (다음 작업 세션 인수인계용)
    · 만드는 분이 개발자가 아니라서, "그림 · 아이템 · 음악 · 이벤트 · 숫자 조절"은 index.html 을 고치지 않고
      이 파일 하나로 바꿀 수 있게 만들어 둠. 나중에 디자이너 그림이 생기면 여기서 img 로 바꿔 끼우는 것이 목표
    · 이 파일은 "예시"라서 실제로는 쓰이지 않음. 복사해서 resources.js 로 쓰면 그때부터 적용됨
    · index.html 쪽에서 읽는 곳: 맨 위 RES = window.BJ_RESOURCES → CONFIG 는 config 로 덮어쓰고,
      나머지는 각 구역에서 같은 id 면 바꾸고 새 id 면 더함 (아래 항목마다 적어 둠)
    · 없는 항목은 그냥 건너뜀 → 필요한 것만 남겨 두면 됨. 오타가 있으면 그 항목만 무시되거나 앱이 안 열릴 수 있으니
      고친 뒤엔 앱을 한 번 열어 확인할 것
    · 새로 추가하는 기능도 "바꿀 만한 그림 · 값"이면 여기서 바꿀 수 있게 열어 두는 것이 원칙
      (예: v0.19 에서 동물 집 habitats 를 열어 둠)
    · 아직 여기서 못 바꾸는 것: 변신 세트(HERO_SETS) · 팀(TEAMS) · 이번 주 물건 모양(WK_SHAPES) · 펫 252종 부품 목록(SPECIES) ·
      반짝이 극장 이야기(THEATER, v0.21)
      → 지금은 index.html 에서 고침. 자주 바꾸게 되면 이 파일로 옮겨 열어 둘 후보
    · 글자 규칙 (index.html 과 같음): 공백을 지웠을 때 '야' 바로 뒤에 ㅎ 글자(하·해·했·합·할·한)가 붙거나,
      '아' 바로 뒤에 '다'가 붙는 말은 쓰지 않음. 예시 이름 · 문구를 새로 쓸 때도 확인할 것

  사용법
   1) 이 파일을 resources.js 로 이름을 바꿔 index.html 과 같은 폴더에 둠
   2) index.html 위쪽의  <!-- <script src="resources.js"></script> -->  줄의 주석을 풀어
      <script src="resources.js"></script> 로 만듦
   3) 필요 없는 항목은 지워도 됨. index.html 은 고치지 않아도 됨

  규칙
   · 같은 이름(id)을 쓰면 기존 것을 바꾸고, 새 이름이면 추가
   · 이름(names)은 언어별로: { ko:'…', en:'…', ja:'…' } (없는 언어는 영어 → 한국어 순서로 대신 보여 줌)
   · 그림은 SVG 코드(svg) 또는 이미지 파일(img). 이미지는 PNG(투명 배경) 권장
     - 아이템 좌표: 캐릭터 그림 기준 x -10~210, y -36~214 (머리 꼭대기 y≈20, 눈 (78,80)·(122,80), 목 y≈134, 오른손 166,124)
     - 칫솔 장식 좌표: 손잡이 끝이 (0,0), 위쪽이 -y, 손잡이 반 굵기 17 기준
   · 그림체 (v0.20): SVG 그림은 둘레에 진한 테두리(#24324a)가 자동으로 붙음 → 테두리는 직접 그리지 않아도 됨
     테두리를 빼고 싶은 아이템 · 펫은 outline: false. 이미지 파일(img)은 자동 테두리가 안 되니 그림에 직접 넣을 것
     자세한 그림 규칙은 index.html 맨 위 개발 안내 [11]
   · 음악 · 효과음 · 그림 파일은 저작권을 확인한 것만 (직접 만들었거나 상업용 사용이 허락된 것)
   · 남의 캐릭터 · 상표 그림은 넣지 않음 (반짝이는 오리지널 캐릭터)
*/
window.BJ_RESOURCES = {

  /* ---------- 설정값 (적은 것만 바뀜) ----------
     의도: 보상 · 확률 · 속도 같은 숫자를 출시 후에도 코드 없이 조절 (아이 반응을 보며 맞추는 용도)
     주의: 별을 너무 많이 주면 살 것이 금방 바닥남 → 지금 설계는 하루 약 8개 기준 (index.html 맨 위 개발 안내 [3]) */
  config: {
    // testMode: false,              // ★ 출시 때 false (테스트 별 100개 · 개발자 메뉴가 사라짐)
    // firstGiftStars: 3,            // 처음 설치했을 때 주는 별
    // surfSplit: [0, .27, .6, .73, .87, 1],  // 구역 안 시간 비율: 바깥쪽 · 씹는 면 · 어금니 안쪽 · 보스 기습(씹는 면 한 번 더) · 앞니 안쪽
    //                                          (v0.26 전의 5개 값도 받음 → 기습 구간을 자동으로 끼워 넣음)
    // raid: false,                            // 보스 기습 끄기 (v0.26)
    reward: { lucky: 3, luckyChance: .25 }   // 예: 행운의 별 3개, 확률 25%
    // reward 기본값: base:1(양치 완료) noPause:1(멈추지 않음) streak3:1 streak7:2(연속 기록) twice:1(하루 두 번)
    //               event:1 birthday:5 lucky:2 luckyChance:.2 gold:2(황금 세균) fairy:2(주말 요정) stamp:1(칭찬 도장)
    //               castle:5(지도 성) mile:{ 3:3, 7:5, 14:7, 30:10 }(연속 3·7·14·30일 달성)
    // giftAutoOpenMs: 3200, tongueMs: 6800, recMaxSec: 15, musicMaxMB: 30, pauseWhenHidden: true
    // pet: { hatch: 4, grow: [5, 7], perDay: 2, specialEggChance: .15 }   // 알 부화 횟수 / 자라는 횟수 / 하루 최대 / 특별한 알 확률
    // goldChance: .35,                 // 황금 세균이 나올 확률
    // shieldCost: 5, shieldMax: 3,     // 지킴이 방석 값 / 최대 개수
    // mapSteps: 7, mapPerDay: 3,       // 지도 섬 하나의 칸 수 / 하루에 나아가는 최대 칸 (줄이면 변신 세트가 빨리 모임)
  },

  /* ---------- 꾸미기 아이템 ----------
     의도: 반짝이 옷을 계속 늘릴 수 있게. 값(cost)은 1~8 별 정도로 낮게 (매일 작은 보상 원칙)
     slot: head(모자) | eyes(안경) | neck(목) | back(등, 몸 뒤에 그려짐) | hand(오른손)
     box = 꾸미기 칸 미리보기에서 보여 줄 범위 'x y 폭 높이' (그림 둘레를 조금 넉넉히)
     event:'이벤트id' 를 넣으면 그 이벤트 기간에만 무료로 보임 */
  items: {
    // SVG 코드로 그린 아이템
    head_flowercrown: {
      slot: 'head', cost: 3, box: '50 -8 100 50',
      names: { ko: '꽃 화관', en: 'Flower Crown', ja: 'はなかんむり' },
      svg: `
        <path d="M58 34 Q100 18 142 34" stroke="#3ccf9c" stroke-width="6" fill="none" stroke-linecap="round"/>
        <circle cx="66" cy="28" r="8" fill="#ff9ec0"/><circle cx="84" cy="22" r="8" fill="#ffd54a"/>
        <circle cx="100" cy="20" r="9" fill="#b48cff"/><circle cx="116" cy="22" r="8" fill="#8fd3ff"/>
        <circle cx="134" cy="28" r="8" fill="#ff9ec0"/>`
    },
    // 이미지 파일로 그린 아이템 (img: 파일 주소, imgBox: [x, y, 폭, 높이])
    // hand_teddy: { slot:'hand', cost:4, img:'art/teddy.png', imgBox:[148, 86, 44, 52], box:'140 80 60 64',
    //               names:{ ko:'곰 인형', en:'Teddy' } }
  },

  /* ---------- 칫솔 ----------
     의도: 칫솔은 양치 화면 전체에 보이는 것이라 아이가 가장 아끼는 꾸미기. 캐릭터 칫솔은 top(끝 장식)과 짝
     고른 칫솔 색은 CSS 변수로 모든 화면 칫솔에 한 번에 적용됨 */
  brushes: {
    brush_frog: {
      cost: 6, top: 'frog', names: { ko: '개구리 칫솔', en: 'Froggy Brush', ja: 'かえる はぶらし' },
      // 색: bh 손잡이, bs 띠, bb 칫솔모, bbd 칫솔모 테두리, bk 머리, bks 머리 테두리, dd 무늬 색
      // 무늬(0 또는 1): 'd-dots' 물방울, 'd-stars' 별, 'd-stripes' 줄무늬, 'd-rainbow' 무지개
      v: { bh: '#5ccf6a', bs: '#ffd54a', bb: '#ffffff', bbd: '#cfe8d3', bk: '#fff', bks: '#a7e0b0', dd: '#fff', 'd-dots': 1 }
    }
  },

  /* ---------- 칫솔 끝 장식 ----------
     의도: 칫솔 손잡이 끝에 앉는 작은 캐릭터 (brushes 의 top 이름과 짝) */
  toppers: {
    frog: `
      <ellipse cx="0" cy="-32" rx="24" ry="17" fill="#5ccf6a" stroke="#3fae4f" stroke-width="2"/>
      <circle cx="-11" cy="-48" r="9" fill="#5ccf6a" stroke="#3fae4f" stroke-width="2"/><circle cx="11" cy="-48" r="9" fill="#5ccf6a" stroke="#3fae4f" stroke-width="2"/>
      <circle cx="-11" cy="-48" r="4" fill="#fff"/><circle cx="11" cy="-48" r="4" fill="#fff"/>
      <circle cx="-10" cy="-48" r="2" fill="#24324a"/><circle cx="12" cy="-48" r="2" fill="#24324a"/>
      <path d="M-10 -30 Q0 -22 10 -30" stroke="#24324a" stroke-width="2" fill="none" stroke-linecap="round"/>`
    // 이미지 장식: frog2: { img:'art/frog.png', box:[-30, -70, 60, 60] }
  },

  /* ---------- 알에서 태어나는 펫 ----------
     의도: 지금 펫 252종 + 전설 11종은 부품 조립식 임시 그림. 진짜 그림이 생기면 같은 id 로 여기서 바꿔 끼움
     (예: 'lion' 을 넣으면 사자 그림만 교체). 새 id 면 새 동물 추가 → 알 · 선물 · 도감에 자동으로 들어감
     group 을 정하면 그 무리의 동물 집에 삽니다: land(사파리) | bird(새 숲) | sea(수족관) | reptile(파충류 늪) | bug(곤충 정원) | legend(전설의 성)
     (없으면 land, special:true 면 legend). 다 크면 무리에 맞는 영웅 모습(망토 · 깃털 · 물방울 · 반짝이)이 자동으로 붙음 */
  // 기본 펫 252종은 index.html 안의 SPECIES 목록에 있어요 (몸 틀 + 부품으로 그림).
  // 직접 그린 그림을 넣고 싶을 때만 여기에: 좌표는 가운데 (0,0), 바닥 y≈44, 크기 100×100
  // top=머리 꼭대기 y, eye=눈 높이, ex=눈 사이 반, neck=목 높이 (꾸미기 아이템 · 망토 자리)
  // special: true 면 특별한 알(전설)에서만 나옴. 이미지면 svg 대신 img:'art/bunny.png'
  // def = 처음 지어지는 별명 (없으면 이름 첫 글자 두 번: 토끼 → 토토)
  // pets: {
  //   bunny2: { egg: ['#fff0f6', '#ff9ec0'], top: -40, eye: -6, ex: 9, neck: 16, group: 'land',
  //             names: { ko: '솜사탕 토끼', en: 'Cotton Bunny' }, def: { ko: '솜솜', en: 'Puff' },
  //             svg: '<ellipse cx="0" cy="20" rx="24" ry="22" fill="#fff" stroke="#f3d6e2" stroke-width="2"/> …' }
  // },
  // config.pet 에 넣을 수 있는 값: hatch: 4 (알 부화), grow: [5, 7] (자라는 횟수), perDay: 2, specialEggChance: .15 (특별한 알)

  /* ---------- 대장 세균 (같은 id면 바꾸고, 새 id면 추가) ----------
     의도: 마지막 10초에 나오는 "오늘의 대장". 날짜와 아침/저녁마다 차례로 바뀌어서 다음 양치를 기대하게 함
     (완료 화면에 다음 대장 그림자 예고). 늘릴수록 같은 대장이 덜 반복됨 */
  // 세균 좌표: 가운데 (0,0), 몸 반지름 약 26. behind=몸 뒤, below=얼굴 아래, above=맨 위에 그림
  // bosses: [
  //   { id: 'icecream', col: ['#bfe6ff', '#6fb8e6'], above: '<path d="M-8 -36 L0 -52 L8 -36Z" fill="#f5c27a"/>' }
  // ],
  // 이름·상식은 언어팩 문구로: 'boss.icecream', 'boss.icecream.tip'

  /* ---------- 펫 방 물건 (내 방) ----------
     의도: 펫 화면 → 방 꾸미기 → 🏠 내 방. 자리(slot)마다 하나씩 놓임. 지도 섬 선물로도 쓰임 (변신 세트를 다 모은 뒤) */
  // 방 좌표: 가로 400 × 세로 260 (벽 0~176, 바닥 176~260). slot: wall | win | poster | lamp | rug | bed | plant | toy
  // 테두리 (v0.20.2): 물건은 둘레에 자동 테두리. 빼려면 outline: false. 벽지(slot:'wall')는 물건마다 테두리가 붙으니
  //                   벽지 무늬처럼 잔잔한 것은 <g data-noink="1"> … </g> 로 감싸면 테두리 없이 그려짐
  // roomItems: {
  //   toy_robot: { slot: 'toy', cost: 5, box: '280 190 60 60', names: { ko: '로봇', en: 'Robot' },
  //                svg: '<rect x="290" y="200" width="40" height="44" rx="8" fill="#9fb3c8"/>' }
  // },

  /* ---------- 동물 집 (v0.19) ----------
     의도: 모은 펫이 무리별로 모여 사는 곳 + 큰 저금 목표 (첫 화면 별 옆 목표 막대와 연결)
     기본 값: 사파리 30 · 곤충 정원 30 · 새 숲 40 · 수족관 50 · 파충류 늪 50 · 전설의 성 150 (별)
     집마다 꾸미기 3개(6~15 별). 값을 올리면 오래 모으고, 내리면 빨리 지음 */
  // 집: safari(땅 동물) · bug(곤충) · bird(새) · sea(물속) · swamp(양서·파충류·공룡) · castle(전설)
  // cost = 짓는 값, bg = 배경 그림(가로 400 × 세로 260, 펫은 아래쪽 1/3에 서 있음),
  // deco = 꾸미기 목록 (바꾸면 그 집 꾸미기 전체가 바뀜). 꾸미기 하나 = { id, cost, box, svg, names }
  // 꾸미기 이름은 names 로 (또는 언어팩 문구 'hab.d.아이디')
  // 테두리 (v0.20.2): 꾸미기는 자동 테두리 (빛 · 반딧불이처럼 빛나는 것은 outline: false)
  //   배경 bg 는 맨 위 단계 그림마다 테두리가 붙음. 화면 전체 바탕 사각형은 자동으로 빠지고, 잔무늬는 data-noink="1"
  // habitats: {
  //   safari: { cost: 40 },
  //   sea: { deco: [ { id: 'hd_ship', cost: 9, box: '150 40 100 80', names: { ko: '해적선', en: 'Pirate Ship' },
  //                    svg: '<path d="M160 100 H240 L226 116 H174Z" fill="#a8703c"/>' } ] }
  // },

  /* ---------- 배경음악 ----------
     의도: 2~3분 동안 리듬을 타며 닦게. 코드 곡은 파일이 없어도 되고, 파일 곡은 부모가 고를 수 있음 */
  tracks: {
    // 코드로 만든 곡: step 한 박(ms), wave 'sine'|'triangle'|'square', mel 음(Hz, 0=쉼표), bass 4박마다
    lullaby: {
      step: 450, wave: 'sine', vol: .05, bass: [131, 98, 110, 87],
      mel: [392, 330, 392, 0, 440, 392, 330, 0, 349, 294, 349, 0, 392, 0, 0, 0],
      names: { ko: '자장자장', en: 'Lullaby', ja: 'こもりうた' }
    }
    // 음악 파일 곡 (저작권 확인한 파일만!): happy: { file:'music/happy.mp3', names:{ ko:'신나는 곡' } }
  },

  /* ---------- 이벤트 ----------
     의도: 사는 나라의 기념일에 깜짝 옷 · 화면 효과 · 보너스 별 → "오늘은 특별해" 느낌 (출시 후 계속 추가할 운영 거리)
     when.type: 'fixed' (양력 MM-DD ~ MM-DD) | 'lunar' (음력, 매년 자동 계산)
     look 에 넣은 옷은 이벤트 동안 자동으로 입혀짐 (아이가 꾸미기에서 바꾸면 그게 우선) */
  events: [
    {
      id: 'dentistday', icon: '🦷', countries: ['KR'],
      when: { type: 'fixed', from: '06-09', to: '06-09' },       // 6월 9일 구강보건의 날
      look: { head: 'head_flowercrown' }, effect: 'star',          // effect: snow | star | petal | bat | balloon
      bonus: 2,
      texts: {
        ko: { name: '구강보건의 날', greet: '오늘은 구강보건의 날이에요!', cheer: '이를 아끼는 날이에요.' },
        en: { name: 'Oral Health Day', greet: 'Happy Oral Health Day!', cheer: 'Take care of your teeth today!' }
      }
    }
  ],

  /* ---------- 스페셜 영상 (v0.22) ----------
     의도: 특별한 날 · 일주일에 한 번 양치가 끝나면 보여 주는 10초 세로(9:16) 영상. 직접 만든 영상만 넣을 것
     · 이 목록을 쓰면 index.html 의 기본 10편 목록을 "통째로" 바꿈 (더하기가 아님) → 기본 10편도 남기려면 같이 적을 것
     · file 을 안 적으면 'specials/<id>.mp4' 를 찾음. 파일이 없으면 그날은 반짝이 극장이 대신 나옴
     · 기본 목록 (v0.28): 시리즈 에피소드 ep001 ~ ep999 + 단편 sp01 ~ sp10. 파일만 넣으면 되니 보통은 여기서 바꿀 필요 없음
     · 여러 파일을 이어서 틀려면: parts:2 → 'specials/<id>_1.mp4' 다음 '<id>_2.mp4', 또는 files:['…', '…']
     · 부모님 설정 "📥 스페셜 영상 넣기"로 휴대폰에 넣은 영상이 있으면 그것을 먼저 씀 (v0.23)
     · 영상은 mp4(H.264) · 세로 9:16 · 720p 권장. 한 편 2~4MB 정도면 충분 */
  // specials: [
  //   { id:'sp01', names:{ ko:'거품 서핑', en:'Foam Surfing', ja:'あわの サーフィン' } },
  //   { id:'sp11', file:'specials/sp11_halloween.mp4', names:{ ko:'호박 세균 소동', en:'Pumpkin Germ', ja:'かぼちゃ ばいきん' } },
  //   { id:'ep11', parts:2, names:{ ko:'눈사람 친구', en:'Snow Friend', ja:'ゆきだるまの ともだち' } }
  // ],

  /* ---------- 효과음 파일 ----------
     의도: 지금 효과음은 코드로 만든 소리. 녹음 · 구입한 소리 파일이 생기면 여기서 바꿈 (없는 것은 코드 소리 그대로) */
  // sfx: { start:'sfx/start.mp3', zone:'sfx/zone.mp3', done:'sfx/done.mp3', tap:'sfx/tap.mp3',
  //        equip:'sfx/equip.mp3', buy:'sfx/buy.mp3', nope:'sfx/nope.mp3' }
};
