'use strict';

/* =========================================================
   2. 언어팩
      형식: { meta:{ code, name, dir, tts, font?:{family,url} },
              strings:{ 키: 문자열 | [문자열 배열] },
              audio?:{ base:'https://…/', files:{ 'say.ul':'ul.mp3', … } } }
      · 내장: ko, en
      · 받는 팩: PACK_CATALOG (지금은 샘플을 파일 안에 넣어 둠 → 나중엔 url에서 내려받기)
      의도: 세계 출시 대비. 한국어 · 영어는 내장, 다른 언어는 내려받는 팩 (일본어 샘플 = SAMPLE_JA)
            SAMPLE_JA 를 고치면 meta.version 을 올려야 이미 받은 기기도 새 글로 바뀜
      주의: 숫자 {n} 문구는 한국어 · 일본어도 키_other 로 (영어 _one/_other 와 짝) — 개발 안내 [9]
            아이템 이름은 ITEM_NAMES, 펫 이름은 펫 목록(SPECIES)에서 자동으로 넣음 (injectPetNames)
   ========================================================= */
const ITEM_NAMES = {
  ko: { hero_space_head:'우주 헬멧', hero_space_eyes:'우주 고글', hero_space_neck:'별 배지 목깃', hero_space_back:'로켓 부스터', hero_space_hand:'꼬마 비행접시',
        hero_knight_head:'기사 투구', hero_knight_eyes:'용사 가면', hero_knight_neck:'방패 메달', hero_knight_back:'왕실 망토', hero_knight_hand:'반짝 방패',
        hero_fairy_head:'꽃 화관', hero_fairy_eyes:'나비 가면', hero_fairy_neck:'꽃잎 목깃', hero_fairy_back:'요정 날개', hero_fairy_hand:'꽃 요술봉',
        hero_mermaid_head:'조개 왕관', hero_mermaid_eyes:'불가사리 안경', hero_mermaid_neck:'조개 목걸이', hero_mermaid_back:'인어 꼬리', hero_mermaid_hand:'진주 조개',
        hero_unicorn_head:'유니콘 뿔', hero_unicorn_eyes:'무지개 안경', hero_unicorn_neck:'구름 목도리', hero_unicorn_back:'무지개 망토', hero_unicorn_hand:'구름 솜사탕',
        hero_dino_head:'공룡 모자', hero_dino_eyes:'발자국 안경', hero_dino_neck:'나뭇잎 목걸이', hero_dino_back:'공룡 꼬리', hero_dino_hand:'공룡 알',
        head_cap:'빨간 캡모자', head_party:'고깔모자', head_crown:'반짝 왕관', head_pirate:'해적 모자', head_bunny:'토끼 귀',
        eyes_round:'동그란 안경', eyes_sun:'선글라스', eyes_star:'별 안경',
        neck_bowtie:'나비넥타이', neck_scarf:'파란 목도리', neck_medal:'금메달',
        back_cape:'빨간 망토', back_jetpack:'제트팩', back_wings:'천사 날개',
        hand_flower:'꽃 한 송이', hand_flag:'초록 깃발', hand_balloon:'하트 풍선', hand_wand:'요술봉',
        head_santa:'산타 모자', hand_present:'선물 상자', head_witch:'마녀 모자', hand_pumpkin:'호박 등불',
        hand_pinwheel:'바람개비', hand_bok:'복주머니', hand_cake:'생일 케이크',
        brush_basic:'분홍 칫솔', brush_mint:'민트 물방울 칫솔', brush_ocean:'바다 칫솔', brush_star:'별빛 칫솔', brush_candy:'사탕 줄무늬 칫솔', brush_galaxy:'우주 칫솔', brush_rainbow:'무지개 칫솔',
        brush_dino:'공룡 칫솔', brush_car:'자동차 칫솔', brush_rocket:'로켓 칫솔', brush_princess:'공주님 칫솔', brush_bunny:'토끼 칫솔', brush_cat:'고양이 칫솔', brush_bear:'곰돌이 칫솔', brush_unicorn:'유니콘 칫솔' },
  en: { hero_space_head:'Space Helmet', hero_space_eyes:'Space Visor', hero_space_neck:'Star Badge Collar', hero_space_back:'Rocket Boosters', hero_space_hand:'Mini UFO',
        hero_knight_head:'Knight Helmet', hero_knight_eyes:'Hero Mask', hero_knight_neck:'Shield Medal', hero_knight_back:'Royal Cape', hero_knight_hand:'Sparkle Shield',
        hero_fairy_head:'Flower Crown', hero_fairy_eyes:'Butterfly Mask', hero_fairy_neck:'Petal Collar', hero_fairy_back:'Fairy Wings', hero_fairy_hand:'Flower Wand',
        hero_mermaid_head:'Shell Tiara', hero_mermaid_eyes:'Starfish Glasses', hero_mermaid_neck:'Shell Necklace', hero_mermaid_back:'Mermaid Tail', hero_mermaid_hand:'Pearl Clam',
        hero_unicorn_head:'Unicorn Horn', hero_unicorn_eyes:'Rainbow Glasses', hero_unicorn_neck:'Cloud Collar', hero_unicorn_back:'Rainbow Cape', hero_unicorn_hand:'Cotton Candy',
        hero_dino_head:'Dino Hood', hero_dino_eyes:'Footprint Glasses', hero_dino_neck:'Leaf Necklace', hero_dino_back:'Dino Tail', hero_dino_hand:'Dino Egg',
        head_cap:'Red Cap', head_party:'Party Hat', head_crown:'Sparkle Crown', head_pirate:'Pirate Hat', head_bunny:'Bunny Ears',
        eyes_round:'Round Glasses', eyes_sun:'Sunglasses', eyes_star:'Star Glasses',
        neck_bowtie:'Bow Tie', neck_scarf:'Blue Scarf', neck_medal:'Gold Medal',
        back_cape:'Red Cape', back_jetpack:'Jetpack', back_wings:'Angel Wings',
        hand_flower:'Flower', hand_flag:'Green Flag', hand_balloon:'Heart Balloon', hand_wand:'Magic Wand',
        head_santa:'Santa Hat', hand_present:'Gift Box', head_witch:'Witch Hat', hand_pumpkin:'Pumpkin Lantern',
        hand_pinwheel:'Pinwheel', hand_bok:'Lucky Pouch', hand_cake:'Birthday Cake',
        brush_basic:'Pink Brush', brush_mint:'Mint Bubble Brush', brush_ocean:'Ocean Brush', brush_star:'Starlight Brush', brush_candy:'Candy Stripe Brush', brush_galaxy:'Galaxy Brush', brush_rainbow:'Rainbow Brush',
        brush_dino:'Dino Brush', brush_car:'Race Car Brush', brush_rocket:'Rocket Brush', brush_princess:'Princess Brush', brush_bunny:'Bunny Brush', brush_cat:'Kitty Brush', brush_bear:'Teddy Bear Brush', brush_unicorn:'Unicorn Brush' },
  ja: { hero_space_head:'うちゅうの ヘルメット', hero_space_eyes:'うちゅうの ゴーグル', hero_space_neck:'ほしの バッジ', hero_space_back:'ロケット', hero_space_hand:'ちびユーフォー',
        hero_knight_head:'きしの かぶと', hero_knight_eyes:'ヒーローの マスク', hero_knight_neck:'たての メダル', hero_knight_back:'おうさまの マント', hero_knight_hand:'キラキラの たて',
        hero_fairy_head:'はなの かんむり', hero_fairy_eyes:'ちょうちょ マスク', hero_fairy_neck:'はなびらの えり', hero_fairy_back:'ようせいの はね', hero_fairy_hand:'はなの ステッキ',
        hero_mermaid_head:'かいがらの ティアラ', hero_mermaid_eyes:'ひとでの めがね', hero_mermaid_neck:'かいがらの ネックレス', hero_mermaid_back:'にんぎょの しっぽ', hero_mermaid_hand:'しんじゅの かい',
        hero_unicorn_head:'ユニコーンの つの', hero_unicorn_eyes:'にじいろ めがね', hero_unicorn_neck:'くもの えりまき', hero_unicorn_back:'にじいろ マント', hero_unicorn_hand:'わたあめ',
        hero_dino_head:'きょうりゅう ぼうし', hero_dino_eyes:'あしあと めがね', hero_dino_neck:'はっぱの ネックレス', hero_dino_back:'きょうりゅうの しっぽ', hero_dino_hand:'きょうりゅうの たまご',
        head_cap:'あかいキャップ', head_party:'パーティーぼうし', head_crown:'キラキラおうかん', head_pirate:'かいぞくぼうし', head_bunny:'うさみみ',
        eyes_round:'まるめがね', eyes_sun:'サングラス', eyes_star:'ほしめがね',
        neck_bowtie:'ちょうネクタイ', neck_scarf:'あおいマフラー', neck_medal:'きんメダル',
        back_cape:'あかいマント', back_jetpack:'ジェットパック', back_wings:'てんしのはね',
        hand_flower:'おはな', hand_flag:'みどりのはた', hand_balloon:'ハートのふうせん', hand_wand:'まほうのステッキ',
        head_santa:'サンタぼうし', hand_present:'プレゼント', head_witch:'まじょのぼうし', hand_pumpkin:'かぼちゃランタン',
        hand_pinwheel:'かざぐるま', hand_bok:'ふくぶくろ', hand_cake:'バースデーケーキ',
        brush_basic:'ピンクの はぶらし', brush_mint:'ミントの みずたま', brush_ocean:'うみの はぶらし', brush_star:'ほしの はぶらし', brush_candy:'キャンディ しましま', brush_galaxy:'うちゅうの はぶらし', brush_rainbow:'にじいろ はぶらし',
        brush_dino:'きょうりゅう はぶらし', brush_car:'くるま はぶらし', brush_rocket:'ロケット はぶらし', brush_princess:'おひめさま はぶらし', brush_bunny:'うさぎ はぶらし', brush_cat:'ねこ はぶらし', brush_bear:'くま はぶらし', brush_unicorn:'ユニコーン はぶらし' }
};
const withItems = (code, strings) => {
  Object.entries(ITEM_NAMES[code]).forEach(([id, n]) => { strings['item.' + id] = n; });
  return strings;
};

const PACK_KO = { meta:{ code:'ko', name:'한국어', dir:'ltr', tts:'ko-KR' }, strings: withItems('ko', {
  'app.title':"Let's Brush",
  'home.title':'반짝이랑\n치카치카!',
  'home.todayNone':'오늘 아직 안 닦았어요',
  'home.todayCount_other':'오늘 {n}번 닦았어요 ✨',
  'home.min':'{n}분',
  'home.start':'양치 시작!',
  'home.closet':'👕 반짝이 꾸미기',
  'closet.title':'반짝이 꾸미기',
  'closet.none':'안 하기', 'closet.selected':'선택됨', 'closet.wearing':'입는 중', 'closet.owned':'갖고 있음',
  'closet.eventTag':'{icon} 이벤트',
  'closet.buyQ':'별 {cost}개로 {item}{item|을/를} 살까요?',
  'closet.buyOk':'살래요!', 'closet.buyCancel':'다음에',
  'closet.needMore':'별이 {n}개 더 필요해요! 양치하고 모아요',
  'closet.got':'{item} 획득!',
  'closet.eventBanner':'{icon} {event} 옷을 입고 있어요',
  'slot.head':'모자', 'slot.eyes':'안경', 'slot.neck':'목', 'slot.back':'등', 'slot.hand':'손',
  'brush.back':'처음으로',
  'zone.ul':'윗니 왼쪽', 'zone.ur':'윗니 오른쪽', 'zone.lr':'아랫니 오른쪽', 'zone.ll':'아랫니 왼쪽',
  'audio.title':'소리 설정', 'audio.voice':'🗣 목소리 응원', 'audio.music':'🎵 배경음악', 'audio.sfx':'🔔 효과음', 'audio.track':'음악 고르기', 'audio.close':'닫기', 'audio.preview':'🎵 음악 미리 듣기', 'audio.load':'📂 내 휴대폰에서 음악 불러오기', 'audio.loaded':'불러온 음악: {name}', 'audio.loadOk':'음악을 불러왔어요!', 'audio.loadTemp':'이 브라우저에 저장하지 못했어요. 앱을 다시 열면 한 번 더 불러와 주세요', 'audio.tooBig':'파일이 너무 커요 (30MB 이하로 골라 주세요)', 'audio.notAudio':'음악 파일을 골라 주세요', 'audio.noCustom':'먼저 내 음악을 불러와 주세요', 'bgm.sunny':'반짝 햇살', 'bgm.march':'씩씩한 행진', 'bgm.calm':'포근한 멜로디', 'bgm.bubbly':'보글보글 거품', 'bgm.space':'우주 여행', 'bgm.custom':'📂 내 음악', 'slot.brush':'칫솔', 'closet.using':'쓰는 중', 'settings.voicePick':'목소리 고르기', 'settings.voiceAuto':'자동', 'settings.voiceTone':'말투', 'tone.kind':'상냥하게', 'tone.normal':'보통', 'tone.bright':'신나게', 'settings.voiceTry':'🔊 미리 듣기', 'rec.title':'🎙 내 목소리로 바꾸기', 'rec.note':'● 눌러 녹음, ■ 눌러 끝내요 (최대 15초). 다시 녹음하면 이전 녹음은 지워지고, 지우면 기기 목소리로 돌아가요.', 'rec.mine':'내 목소리', 'rec.device':'기기 목소리', 'rec.saved':'녹음했어요!', 'rec.cleared':'녹음을 지웠어요', 'rec.noMic':'마이크를 쓸 수 없어요. 마이크 권한을 허용해 주세요 (앱 주소가 https일 때만 되는 폰도 있어요)', 'rec.l.prep':'치약 짜기 안내', 'rec.l.say.cheers':'중간 응원', 'rec.l.done':'다 닦았어요', 'rec.bossAny':'대장 세균',  'say.start':'자, 같이 닦아 볼까요?',
  'say.ul':'윗니 왼쪽부터 닦아 볼까요?', 'say.ur':'이번엔 윗니 오른쪽이에요.', 'say.lr':'아랫니 오른쪽도 치카치카 해 줘요.', 'say.ll':'마지막으로 아랫니 왼쪽이에요.',
  'say.cheers':['정말 잘하고 있어요.', '구석구석 꼼꼼하게, 좋아요.', '거품이 보글보글 나요.', '이가 웃고 있어요.', '최고예요, 조금만 더요.'],
  'say.hurry':'거의 다 했어요. 10초만 더 힘내요.', 'say.pause':'잠깐 쉬는 중…', 'say.resume':'다시 같이 닦아 볼까요?',
  'settings.dur':'양치 시간', 'dur.60':'1분', 'dur.120':'2분', 'dur.180':'3분', 'dur.rec':'{t} (권장)',
  'pet.waitNew':'새 친구들이 곧 더 와요! 그동안은 양치할 때 별을 더 줄게요 ⭐', 'rw.petWait':'🐾 새 친구 기다림 별', 'settings.medNote':'🦷 이 앱은 양치 습관을 돕는 놀이예요. 치과 진료를 대신하지 않아요. 정기 검진은 치과에서 받아 주세요.', 'bk.remind':'⚠️ 한 달 넘게 백업하지 않았어요. 폰을 바꾸거나 브라우저 기록을 지우면 별 · 펫이 사라질 수 있어요. 아래에서 백업 파일을 저장해 두세요.', 'home.tipIOS':'👨‍👩‍👧 부모님께: 기록을 안전하게 지키려면 홈 화면에 추가해 주세요. 사파리 아래쪽 공유 단추(□↑)를 누르고 "홈 화면에 추가"를 고르면 돼요. 사파리로만 쓰면 오래 안 열었을 때 별 · 펫 기록이 지워질 수 있어요.', 'home.tipAnd':'👨‍👩‍👧 부모님께: 기록을 안전하게 지키려면 홈 화면에 추가해 주세요. 크롬 오른쪽 위 메뉴(⋮)에서 "홈 화면에 추가" 또는 "앱 설치"를 누르면 돼요.', 'home.tipInstall':'지금 추가하기', 'home.tipLater':'나중에',
  'sub.title':'⭐ 반짝이 클럽', 'sub.parent':'👨‍👩‍👧 부모님께', 'sub.introH':'반짝이 클럽 {d}일 무료 체험', 'sub.p1':'펫 {pets}종 전부 (기본은 {fp}종)', 'sub.p2':'지도 섬 {isl}개와 영웅 변신 세트', 'sub.p3':'반짝이 스페셜 영상', 'sub.p4':'매달 새 친구와 새 옷', 'sub.free':'체험하지 않아도 양치 · 퀴즈 · 별 모으기 · 기본 펫 {fp}종은 계속 무료예요.', 'sub.consent':'체험이 끝나면 매달 {price}씩 자동 결제돼요. 끝나기 24시간 전까지 스토어에서 해지하면 돈이 나가지 않아요. 이 내용을 확인했고 동의해요.', 'sub.start':'{d}일 무료로 시작하기', 'sub.later':'기본으로 쓸게요', 'sub.started':'반짝이 클럽 체험 시작! {d}일 동안 전부 열려요 ⭐', 'sub.stTrial':'무료 체험 중 · {d}일 남음', 'sub.stActive':'구독 중이에요. 고마워요! 💛', 'sub.stFree':'기본으로 쓰는 중이에요', 'sub.stNone':'아직 체험 전이에요', 'sub.goTrial':'{d}일 무료 체험 알아보기', 'sub.goSub':'구독하기 (매달 {price})', 'sub.restore':'구매 복원', 'sub.manage':'구독 관리 · 해지', 'sub.manageHow':'구독 관리와 해지는 앱스토어 · 구글플레이의 구독 메뉴에서 할 수 있어요', 'sub.restoreNone':'복원할 구독을 찾지 못했어요', 'sub.restoreOk':'구독을 다시 불러왔어요', 'sub.storeOnly':'구독은 스토어 앱에서 할 수 있어요', 'sub.remind':'👨‍👩‍👧 부모님께: 반짝이 클럽 무료 체험이 {d}일 뒤 끝나요. 계속 쓰지 않으려면 스토어에서 해지해 주세요. 그대로 두면 매달 {price}씩 결제돼요.', 'sub.ok':'알겠어요', 'sub.mapLock':'🔒 다음 섬은 아직 잠겨 있어요', 'sub.keep':'체험 · 구독 중에 받은 펫과 옷은 끝나도 그대로 남아요.', 'sub.terms':'이용약관', 'sub.contact':'문의 (이메일)', 'sub.privacy':'개인정보처리방침', 'sub.needAgree':'먼저 동의 칸을 눌러 주세요', 'sub.devSim':'💳 구독 흉내: {s}', 'sub.devEnd':'💳 체험 끝내기 (오늘로)', 'sub.devAct':'💳 구독 중으로', 'sub.devReset':'💳 구독 처음 상태로', 'sub.on':'켜짐', 'sub.off':'꺼짐',
  'kids.title':'👧 아이', 'kids.add':'＋ 아이 추가', 'kids.max':'아이는 세 명까지 만들 수 있어요', 'kids.who':'누가 닦을까요?', 'kids.now':'지금', 'kids.del':'지우기', 'kids.delQ':'{name}의 별 · 펫 · 기록을 모두 지울까요? 되돌릴 수 없어요.', 'kids.delOk':'지우기', 'kids.cancel':'취소', 'kids.note':'아이마다 별 · 펫 · 퀴즈 · 생년월일 · 양치 손이 따로 저장돼요. 소리 · 언어 · 양치 시간은 함께 써요. 아이를 누르면 그 아이로 바뀌어요.', 'kids.added':'새 아이를 만들었어요. 이름과 생년월일을 적어 주세요', 'kids.n1':'첫째', 'kids.n2':'둘째', 'kids.n3':'셋째', 'kids.switched':'지금은 {name} 차례예요',
  'quiz.title':'🧮 오늘의 퀴즈', 'quiz.btn':'🧮 오늘의 퀴즈', 'quiz.close':'다음에 할래요', 'quiz.okBtn':'좋아요!', 'quiz.ok':'딩동댕! 정답이에요!', 'quiz.no':'다시 골라 볼까요?', 'quiz.reward':'별 {n}개와 도장을 받았어요!', 'quiz.petWon':'도장을 다 모았어요! 새 친구가 와요!', 'quiz.allPets':'도장을 다 모았어요! 별 5개를 더 받았어요!',
  'quiz.count':'{item}{item|이/가} 몇 개일까요?', 'quiz.add':'{a} 더하기 {b}, 얼마일까요?', 'quiz.sub':'{a} 빼기 {b}, 얼마일까요?', 'quiz.mul':'{a} 곱하기 {b}, 얼마일까요?', 'quiz.item.apple':'사과', 'quiz.item.star':'별', 'quiz.item.fish':'물고기', 'quiz.item.strawberry':'딸기', 'quiz.item.balloon':'풍선', 'quiz.item.duck':'병아리',
  'settings.quiz':'양치 뒤 오늘의 퀴즈 (하루 한 문제)', 'settings.bdayYear':'연도', 'settings.year':'{n}년', 'settings.ageIs':'만 {n}살 · 퀴즈와 치약 양이 나이에 맞게 나와요', 'settings.ageHint':'태어난 해까지 넣으면 나이에 맞는 퀴즈가 나와요',
  'gate.title':'👨‍👩‍👧 어른 확인', 'gate.note':'설정은 어른이 열어 주세요. 답을 눌러 주세요', 'gate.q':'{a} × {b} = ?', 'gate.wrong':'답이 달라요. 새 문제예요', 'gate.cancel':'닫기',
  'stop.q':'양치를 그만할까요?', 'stop.keep':'계속 닦기', 'stop.quit':'그만하기',
  'done.title':'다 닦았어요!',
  'done.msgs':['충치균이 도망갔어요!', '이가 반짝반짝 빛나요!', '양치 왕이 됐어요!', '입안이 상쾌해졌어요!'],
  'done.canBuy':'별로 새 꾸미기를 살 수 있어요!',
  'done.gain':'⭐ +1 · 가진 별 {n}개',
  'done.home':'처음으로', 'done.closet':'👕 꾸미러 가기',
  'toast.firstGift':'처음 선물로 별 3개를 받았어요! ⭐', 'toast.testStars':'테스트용 별 10개 추가', 'toast.testGift':'테스트용 별 {n}개를 받았어요! ⭐',
  'toast.packInstalled':'{lang} 언어팩을 받았어요!', 'toast.packFail':'언어팩을 받지 못했어요. 인터넷 연결을 확인해 주세요',
  'settings.title':'설정', 'settings.language':'언어', 'settings.packs':'언어팩 더 받기',
  'settings.get':'받기', 'settings.getting':'받는 중…', 'settings.installed':'설치됨',
  'settings.country':'사는 나라', 'settings.eventsHere':'이 나라에서 챙기는 날: {list}', 'settings.eventsNone':'이 나라에 등록된 이벤트가 아직 없어요',
  'settings.voice':'목소리 응원', 'settings.voiceNote':'기기에 이 언어 목소리가 없으면 소리가 나지 않아요',
  'settings.eventLook':'이벤트 날 특별 옷 자동으로 입기',
  'settings.devTitle':'🔧 개발자 테스트 (출시 전 삭제)', 'settings.eventPreview':'이벤트 미리보기', 'settings.auto':'자동 (오늘 날짜)', 'tech.short':'짧게 앞뒤로 (기본)', 'tech.circle':'작은 원 그리기 (폰즈법)', 'tech.roll':'쓸어내리기 (회전법)', 'tech.shortNote':'칫솔을 잇몸 쪽으로 비스듬히 대고 짧고 부드럽게 앞뒤로 닦아요. 어금니 씹는 면은 앞뒤로 문질러요.', 'tech.circleNote':'작은 원을 그리듯 닦아요. 어린아이가 따라 하기 쉬워요. 어금니 씹는 면은 앞뒤로 문질러요.', 'tech.rollNote':'잇몸에서 이 끝 쪽으로 쓸어요. 윗니는 위에서 아래로, 아랫니는 아래에서 위로. 어금니 씹는 면은 앞뒤로 문질러요.', 'hint.short.outer':'↔ 잇몸 쪽에 비스듬히, 짧게 앞뒤로', 'hint.short.inner':'↔ 짧게 앞뒤로', 'hint.circle':'⭕ 작은 원을 그리며', 'hint.roll.u':'⬇ 위에서 아래로 쓸어내리기', 'hint.roll.l':'⬆ 아래에서 위로 쓸어올리기', 'hint.chew':'↔ 앞뒤로 쓱쓱', 'settings.parentTitle':'👨‍👩‍👧 부모님 설정', 'settings.technique':'양치 방법', 'settings.hand':'양치하는 손', 'hand.right':'오른손', 'hand.left':'왼손', 'settings.kidName':'아이 이름', 'settings.kidNamePh':'예: 지우', 'settings.bday':'생년월일', 'settings.bdayNone':'안 정함', 'settings.month':'{n}월', 'settings.day':'{n}일', 'event.birthday.name':'생일', 'event.birthday.greet':'생일 축하해요!', 'event.birthday.greetName':'우리 {name}, 생일 축하해요!', 'event.birthday.cheer':'생일엔 이도 반짝반짝 닦아요.', 'done.gift':'🎁 상자를 눌러서 열어 봐요!', 'gift.say':'선물 상자가 왔어요. 눌러서 열어 볼까요?', 'gift.got':'별 {n}개를 받았어요!', 'rw.base':'양치 완료', 'rw.noPause':'멈추지 않고 끝까지', 'rw.streak':'{n}일 연속 양치', 'rw.twice':'오늘 두 번 닦았어요', 'rw.event':'{event} 선물', 'rw.bday':'🎂 생일 선물', 'rw.lucky':'🍀 행운의 별!', 'rw.total':'모두', 'bgm.birthday':'생일 축하 노래', 'settings.age':'아이 나이', 'age.u3':'만 3세 미만', 'age.3p':'만 3세 이상', 'settings.prep':'양치 전 치약 짜기 안내', 'prep.step':'양치 준비', 'prep.go':'준비 됐어요!', 'prep.title.rice':'치약을 쌀알만큼\n살짝 묻혀요', 'prep.title.pea':'치약을 완두콩만큼\n짜요', 'prep.sayWater':'칫솔에 물은 안 묻혀도 괜찮아요.', 'prep.saySpit':'다 닦으면 치약은 꿀꺽 삼키지 말고, 퉤 뱉어 줘요.', 'prep.tip.paste':'치약은 이만큼', 'prep.tip.water':'물은 안 묻혀도 돼요', 'prep.tip.spit':'삼키지 말고 퉤!', 'tongue.title':'보너스! 혀도 쓱쓱', 'tongue.say':'혀를 쭉 내밀어 볼까요? 안쪽에서 바깥쪽으로 살살 쓸어 줘요.', 'tongue.done':'혀도 깨끗해졌어요!', 'tongue.skip':'건너뛰기', 'tongue.tip':'안쪽 끝까지 넣지 않아도 괜찮아요. 살살만 쓸어 줘요', 'settings.tongue':'양치 끝에 혀 닦기', 'prep.listen':'🔊 다시 듣기', 'done.spit':'치약은 퉤 뱉어 줘요.', 'prep.cmp.rice':'쌀알 크기', 'prep.cmp.pea':'완두콩 크기', 'prep.say.rice':'치약은 쌀알만큼만 살짝 묻혀 볼까요?', 'prep.say.pea':'치약은 완두콩만큼만 짜 볼까요?', 'prep.note':'👨‍👩‍👧 불소 치약을 쓰고, 치약은 부모님이 짜 주세요. 다 닦으면 삼키지 말고 퉤 뱉어요. 칫솔에 물은 따로 묻히지 않아도 돼요.',  'settings.parentTip':'만 9세 전후까지는 아이 혼자서 구석구석 닦기 어려워요. 마무리 양치는 부모님이 도와주세요.', 'done.parentTip':'👨‍👩‍👧 마무리 양치는 부모님이 도와주세요', 'surface.outer':'바깥쪽', 'surface.chew':'어금니 씹는 면', 'surface.inner':'어금니 안쪽', 'surface.front':'앞니 안쪽', 'say.front':'앞니 뒤는 칫솔을 세워서 위아래로 살살 닦아요.', 'hint.front':'↕ 칫솔을 세워서 위아래로', 'say.chew':'어금니 씹는 면도 꼼꼼히 닦아 줘요.', 'say.bossTease':'앗, {boss}{boss|이/가} 나타났어요! 어금니에 세균을 숨겨 놓는대요!', 'say.raid':'{boss}{boss|이/가} 어금니에 세균을 숨겼어요! 한 번 더 쓱쓱!', 'rw.raid':'숨은 세균 {n}마리 찾기', 'say.inner':'이번엔 어금니 안쪽을 닦아요.', 'say.sparkle':'와, 반짝반짝 깨끗해졌어요.',
  'say.boss':'{boss}{boss|이/가} 나타났어요! 10초만 더 힘내요!', 'say.bossDown':'{boss}{boss|을/를} 물리쳤어요! 반짝반짝!', 'done.germs_other':'세균 {n}마리를 물리쳤어요!',
  'pet.egg':'신비한 알', 'pet.penguin':'아기 펭귄', 'pet.whale':'아기 고래', 'pet.fox':'아기 여우', 'pet.panda':'아기 판다',
  'pet.penguin.def':'펭펭', 'pet.whale.def':'고래미', 'pet.fox.def':'여우비', 'pet.panda.def':'판판',
  'pet.eggLeft_other':'알이 따뜻해졌어요! {n}번 더 닦으면 태어나요.', 'pet.growLeft_other':'{name}{name|이/가} 자라고 있어요! {n}번 더 닦으면 쑥 커요.', 'pet.seeTomorrow':'내일 또 만나요!',
  'pet.restEgg':'알은 오늘 쿨쿨 자요. 내일 또 닦으면 따뜻해져요!', 'pet.restPet':'{name}{name|이/가} 오늘은 쿨쿨 자요. 내일 또 같이 닦아요!',
  'pet.hatched':'짜잔! {sp}{sp|이/가} 태어났어요!', 'pet.nameAsk':'이름을 지어 줄까요?', 'pet.ok':'좋아요!',
  'pet.grew':'{name}{name|이/가} 쑥 컸어요!', 'pet.adult':'{name}{name|이/가} 다 컸어요!', 'pet.newSpecialEgg':'반짝반짝 특별한 알이 왔어요!', 'book.legend':'전설 펫', 'pet.giftRow':'🐾 오늘 두 번 닦아서 펫 선물!', 'pet.giftTitle':'선물 상자에서 {sp}{sp|이/가} 나왔어요!', 'pet.palChange':'바꾸기', 'pet.allDone':'모든 펫을 다 모았어요! 정말 대단해요!', 'home.twiceHint':'한 번 더 닦으면 펫 선물이 와요! 🎁',
  'pet.eggSay_other':'무엇이 태어날까? {n}번 더 닦으면 만나요!', 'pet.says':['같이 이 닦아요!', '오늘도 반짝반짝!', '세균 물리치러 가요!', '같이 닦는 게 제일 좋아요!'],
  'settings.petTest':'🥚 알·펫 키우기 +1 (테스트)', 'settings.eggTest':'🌈 특별한 알 받기 (테스트)', 'settings.star100':'⭐ 별 100개 받기 (테스트)', 'settings.bookAll':'📖 도감 모두 열기 (테스트)', 'settings.petAll':'🐾 모든 펫 받기 (테스트)', 'toast.petAll_other':'펫 {n}마리를 받았어요!', 'settings.reset':'🔄 처음부터 다시 (초기화)',
  'reset.q':'별, 펫, 도감, 지도, 꾸미기, 양치 기록이 모두 지워지고 처음 상태로 돌아가요. 이름·소리·언어 같은 설정은 그대로예요. 초기화할까요?', 'reset.ok':'초기화', 'reset.cancel':'취소', 'toast.star100':'별 100개를 받았어요!', 'toast.bookAll':'도감을 모두 열었어요!',
  'slot.weekly':'🆕 이번 주', 'slot.hero':'🦸 변신', 'closet.mapTag':'🗺 섬 선물', 'closet.mapSay':'모험 지도에서 성에 도착하면 하나씩 받아요!',
  'closet.weekLeft_other':'이번 주 물건이에요. {n}일 뒤에 새 물건이 와요! (산 물건은 계속 내 거예요)',
  'hero.set.space':'우주 대원', 'hero.set.knight':'용감한 기사', 'hero.set.dino':'공룡 대장', 'hero.set.fairy':'꽃 요정', 'hero.set.mermaid':'인어 탐험대', 'hero.set.unicorn':'무지개 유니콘', 'hero.need_other':'{n}개 더 모으면 변신!', 'hero.wear':'눌러서 변신!', 'hero.wearing':'✨ 변신 중',
  'hero.go':'변신! {set} 반짝이!', 'hero.how':'모험 지도의 성에 도착할 때마다 변신 옷이 하나씩 와요. 다섯 개를 다 입으면 변신!', 'map.gotHero':'모험 선물: {item}! 꾸미기 → 변신에서 볼 수 있어요', 'map.heroDone':'변신 세트를 다 모았어요! 변신!',
  'pet.heroAdult':'변신! {name}{name|이/가} 다 컸어요!', 'pet.treat':'🍪 간식 ⭐1', 'pet.trickBtn':'재주 보기', 'pet.fedToday':'💤 간식은 내일 또 줘요', 'pet.yum':['냠냠!', '맛있다!', '냠냠, 고마워!'],
  'pet.loveUp':'{name}{name|이/가} 좋아해요! 하트 {h}개', 'pet.loveHint':'간식을 다섯 번 주면 재주를 배워요 (하루 한 번)', 'pet.trickLearn':'{name}{name|이/가} 재주를 배웠어요: {trick}!', 'pet.trickShow':'{name}의 재주: {trick}!',
  'trick.spin':'빙글빙글', 'trick.jump':'높이 점프', 'trick.dance':'신나는 춤', 'trick.flip':'공중제비',
  'pet.eggFeat_other':'이달의 친구 알이에요! {n}번 더 닦으면 만나요!', 'pet.hatchedFeat':'🌟 이달의 친구 {sp}{sp|이/가} 태어났어요!', 'pet.featEgg':'🌟 이달의 친구 알', 'book.feat':'🌟 이달의 친구',
  'book.team':'팀', 'team.done':'합체 완료!', 'team.go':'{team} 합체!', 'team.say':'{team} 합체! {names} 모두 한 팀이에요!', 'team.star_other':'별 {n}개 선물!', 'rw.team':'🤝 {team} 합체', 'team.need':'{names}{names|을/를} 모두 모으면 합체해요!',
  'team.jungle':'정글 팀', 'team.ice':'얼음 나라 팀', 'team.ocean':'바다 팀', 'team.sky':'하늘 팀', 'team.farm':'농장 팀', 'team.safari':'사파리 팀', 'team.dino':'공룡 팀', 'team.bug':'곤충 팀', 'team.dog':'멍멍 팀', 'team.cat':'야옹 팀', 'team.forest':'숲속 팀', 'team.legend':'전설 팀',
  'hab.home':'내 방', 'hab.safari':'사파리', 'hab.bug':'곤충 정원', 'hab.bird':'새 숲', 'hab.sea':'수족관', 'hab.swamp':'파충류 늪', 'hab.castle':'전설의 성',
  'hab.who.safari':'땅에 사는 동물 친구들의 집이에요', 'hab.who.bug':'곤충 친구들의 집이에요', 'hab.who.bird':'새 친구들의 집이에요', 'hab.who.sea':'물속 친구들의 집이에요', 'hab.who.swamp':'개구리 · 거북 · 공룡 친구들의 집이에요', 'hab.who.castle':'전설 펫들의 집이에요',
  'hab.build':'{cost}개로 짓기', 'hab.buildOk':'지을래요', 'hab.built':'{name}{name|을/를} 지었어요! 친구들이 이사 왔어요!', 'hab.noPets':'아직 여기 살 친구가 없어요. 알에서 만나요!', 'hab.buildFirst':'먼저 집을 지어요!',
  'hab.goalBtn':'🎯 목표로 정하기', 'hab.goalOn':'🎯 지금 목표예요', 'hab.count_other':'친구 {n}마리',
  'hab.d.hd_pond':'물웅덩이', 'hab.d.hd_rock':'사자 바위', 'hab.d.hd_balloon':'열기구', 'hab.d.hd_honey':'꿀단지', 'hab.d.hd_mushhouse':'버섯 집', 'hab.d.hd_sunflower':'해바라기', 'hab.d.hd_birdhouse':'새집', 'hab.d.hd_swing':'그네', 'hab.d.hd_rainbow':'무지개',
  'hab.d.hd_chest':'보물 상자', 'hab.d.hd_coral':'산호', 'hab.d.hd_sub':'꼬마 잠수함', 'hab.d.hd_lotus':'연꽃', 'hab.d.hd_log':'통나무 다리', 'hab.d.hd_fireflies':'반딧불이', 'hab.d.hd_moon':'달님', 'hab.d.hd_rbridge':'무지개 다리', 'hab.d.hd_treasure':'보물 더미',
  'goal.left_other':'🎯 {name}까지 별 {n}개 남았어요!', 'goal.ready':'🎯 {name}{name|을/를} 지을 수 있어요! 펫 화면에서 지어요!', 'goal.set':'🎯 목표: {name}',
  'settings.heroAll':'🦸 변신 세트 모두 받기 (테스트)', 'toast.heroAll':'변신 세트를 모두 받았어요!',
  'wk.name':'{color} {shape}', 'wk.c.red':'빨간', 'wk.c.orange':'주황', 'wk.c.yellow':'노란', 'wk.c.green':'초록', 'wk.c.blue':'파란', 'wk.c.purple':'보라', 'wk.c.pink':'분홍',
  'wk.s.beanie':'비니', 'wk.s.beret':'베레모', 'wk.s.tophat':'실크햇', 'wk.s.catband':'고양이 귀', 'wk.s.bearband':'곰돌이 귀', 'wk.s.hearteyes':'하트 안경', 'wk.s.squareeyes':'네모 안경', 'wk.s.goggles':'물안경',
  'wk.s.stripescarf':'줄무늬 목도리', 'wk.s.tie':'넥타이', 'wk.s.pearls':'구슬 목걸이', 'wk.s.starcape':'별무늬 망토', 'wk.s.bflywings':'나비 날개', 'wk.s.lolli':'막대사탕', 'wk.s.icecream':'아이스크림', 'wk.s.starballoon':'별 풍선',
  'ptab.friends':'친구들', 'ptab.dress':'펫 꾸미기', 'ptab.room':'방 꾸미기', 'pet.stage1':'아기', 'pet.stage2':'어린이', 'pet.stage3':'다 컸어요', 'pet.look':'모습', 'look.1':'아기', 'look.2':'어린이', 'look.3':'어른', 'pet.lookSet':'{name}{name|이/가} {look} 모습이 됐어요!',
  'pet.palNow':'데리고 다니는 중', 'pet.palBtn':'데리고 다니기', 'pet.palSet':'{name}{name|과/와} 함께 다녀요!', 'pet.namePh':'이름', 'pet.noPet':'알이 태어나면 펫을 꾸밀 수 있어요!',
  'pet.eggCard':'알', 'pet.specialEgg':'특별한 알', 'pet.eggSpecial_other':'반짝반짝 특별한 알이에요! {n}번 더 닦으면 만나요!', 'pet.adultSpecial':'{name}{name|이/가} 다 컸어요! 반짝반짝 특별한 알이 왔어요!',
  'pet.unicorn':'아기 유니콘', 'pet.dragon':'아기 용', 'pet.unicorn.def':'별사탕', 'pet.dragon.def':'용용',
  'pcol.base':'기본', 'pcol.mint':'민트', 'pcol.pink':'분홍', 'pcol.lav':'보라', 'pcol.sky':'하늘색', 'pcol.gold':'황금', 'pcol.rainbow':'무지개', 'pcol.galaxy':'은하수',
  'book.colorsFound':'모은 색: {list}', 'book.special':'반짝반짝 특별한 알에서만 태어나요!',
  'pitem.head_bow':'리본', 'pitem.head_crown':'작은 왕관', 'pitem.head_flower':'꽃 핀', 'pitem.head_party':'고깔모자', 'pitem.neck_scarf':'목도리', 'pitem.neck_bowtie':'나비넥타이',
  'pitem.neck_bell':'방울 목걸이', 'pitem.face_glasses':'동그란 안경', 'pitem.face_sun':'선글라스', 'pitem.face_heart':'하트 볼', 'settings.mapTest':'🗺 지도 +1칸 (테스트)',
  'boss.candy':'끈적이 사탕 대장', 'boss.choco':'초코 대장', 'boss.soda':'콜라 거품 대장', 'boss.jelly':'젤리 대장', 'boss.cookie':'과자 부스러기 대장', 'boss.juice':'주스 대장', 'boss.king':'충치 왕',
  'boss.candy.tip':'사탕은 이에 오래 붙어 있어요. 먹고 나면 물로 헹궈요.', 'boss.choco.tip':'초콜릿을 먹은 날은 더 꼼꼼히 닦아요.', 'boss.soda.tip':'탄산음료보다 물이 이에 좋아요.',
  'boss.jelly.tip':'젤리는 이 사이에 잘 껴요. 이 사이를 꼼꼼히!', 'boss.cookie.tip':'과자 부스러기는 어금니 홈에 숨어요.', 'boss.juice.tip':'주스는 빨대로 마시면 이에 덜 닿아요.', 'boss.king.tip':'단것을 자주 먹으면 충치 왕이 와요. 하루 두 번 양치!',
  'say.call':'우리 {name},', 'say.cheersName':['우리 {name}, 정말 잘하고 있어요!', '우리 {name}, 세균들이 도망가요!', '{name}{name|이/}의 이가 반짝반짝해져요!'],
  'combo':'{n}연속!', 'rw.gold':'✨ 황금 세균을 잡았어요',
  'germ.0':'초록 세균', 'germ.1':'보라 세균', 'germ.2':'주황 세균', 'germ.3':'파랑 세균', 'germ.gold':'황금 세균',
  'germ.0.tip':'잇몸 가까이에 붙어 있어요.', 'germ.1.tip':'어금니 홈 속에 숨어요.', 'germ.2.tip':'이 사이에 끼어 있어요.', 'germ.3.tip':'앞니 뒤에 숨어요.', 'germ.gold.tip':'아주 가끔 나타나는 귀한 세균이에요!',
  'pet.hatchedShiny':'우와! 전설의 {sp}{sp|이/가} 태어났어요! 아주 귀한 친구예요!', 'pet.shiny':'반짝 {sp}',
  'streak.info':'{n}일 연속 양치 중이에요! 지킴이 방석이 {s}개 있어요. 하루 깜빡해도 방석이 연속 기록을 지켜줘요.', 'streak.buy':'별 {cost}개로 방석 사기', 'streak.close':'닫기',
  'streak.bought':'지킴이 방석을 샀어요!', 'streak.saved':'지킴이 방석이 연속 기록을 지켜줬어요!', 'rw.mile':'🔥 {n}일 연속 달성!', 'rw.mileShield':'🔥 {n}일 연속! 방석도 받았어요',
  'greet.am':'좋은 아침이에요!', 'greet.pm':'자기 전에 반짝반짝 닦아요!', 'greet.we':'주말엔 이빨 요정이 놀러 왔어요!', 'rw.fairy':'🧚 이빨 요정의 주말 선물',
  'next.am':'내일 아침엔 누가 올까?', 'next.pm':'오늘 저녁엔 누가 올까?', 'next.say.am':'내일 아침엔 어떤 대장 세균이 올까요? 또 만나요!', 'next.say.pm':'오늘 저녁엔 어떤 대장 세균이 올까요? 자기 전에 또 만나요!',
  'menu.closet':'꾸미기', 'menu.room':'펫', 'menu.book':'도감', 'menu.map':'지도',
  'book.title':'도감', 'book.boss':'대장 세균', 'book.germ':'세균', 'book.pet':'펫', 'book.notYet':'아직 못 만났어요. 양치하면 만날 수 있어요!', 'book.count':'{n}번 만남',
  'room.title':'펫', 'room.empty':'알이 태어나면 펫이 이 방에서 살아요!', 'room.placed':'놓음',
  'room.wall_sky':'하늘 벽지', 'room.wall_stars':'별 벽지', 'room.wall_hearts':'하트 벽지', 'room.wall_stripes':'줄무늬 벽지', 'room.win_round':'동그란 창문', 'room.poster':'무지개 그림',
  'room.lamp_star':'별 전등', 'room.rug_round':'동그란 깔개', 'room.rug_rainbow':'무지개 깔개', 'room.bed_basket':'바구니 침대', 'room.bed_cloud':'구름 침대',
  'room.toy_ball':'공', 'room.toy_blocks':'블록', 'room.toy_duck':'오리 인형', 'room.plant_pot':'꽃 화분', 'room.plant_cactus':'선인장',
  'map.title':'모험 지도', 'map.left_other':'성까지 {n}칸 남았어요!', 'map.isl.candy':'사탕 섬', 'map.isl.choco':'초코 숲', 'map.isl.bubble':'거품 바다', 'map.isl.star':'별빛 우주', 'map.isl.rainbow':'무지개 성',
  'map.arrive':'{isl}에 도착했어요! 다음 섬이 열렸어요!', 'rw.castle':'🏰 {isl} 도착', 'map.giftRoom':'펫 방 선물로 {item}{item|을/를} 받았어요!', 'map.rest':'오늘은 지도에서 쉬어요. 내일 또 나아가요!', 'map.locked':'아직 잠겨 있어요', 'map.reward':'성에 도착하면 받는 선물', 'map.got':'받은 선물', 'map.cleared':'도착 완료! 이 섬은 다 돌았어요.', 'map.lockedSay':'앞의 섬을 지나면 열려요!', 'map.eggGift':'특별한 알 (전설 펫)', 'map.lap':'{n}바퀴째', 'map.how':'양치 한 번에 한 칸씩 가요 (하루 3칸까지). 섬마다 7칸! 성에 가면 변신 옷이 하나씩!', 'map.specialEgg':'무지개 성 선물! 반짝반짝 특별한 알이에요!', 'map.specialEggNext':'무지개 성 선물! 지금 알이 태어나면, 다음 알은 반짝반짝 특별한 알이에요!', 'bk.title':'💾 기록 백업', 'bk.note':'별 · 펫 · 연속 기록을 파일 하나로 저장해요. 폰을 바꾸거나 앱 주소가 바뀌어도 이 파일을 불러오면 그대로 이어져요. (넣은 영상 · 내 음악 · 녹음은 안 들어가요)', 'bk.save':'💾 지금 기록 파일로 저장', 'bk.load':'📂 기록 파일 불러오기', 'bk.last':'마지막 백업: {d}', 'bk.never':'아직 백업 안 함', 'bk.saved':'저장했어요: {name} (다운로드 폴더)', 'bk.bad':'반짝이 기록 파일이 아니에요', 'bk.fail':'불러오지 못했어요 (저장 공간을 확인해 주세요)', 'bk.q':'{at} 에 저장한 기록으로 바꿀까요? 지금 이 폰의 기록은 그 파일 내용으로 바뀌어요.', 'bk.ok':'불러오기',
  'stamp.hold':'마무리 양치 뒤 꾹 눌러 칭찬 도장 👍', 'stamp.text':'참 잘했어요', 'stamp.say':'칭찬 도장을 받았어요! 정말 멋져요!', 'rw.stamp':'👍 칭찬 도장',
  'week.title':'📅 이번 주 양치 기록', 'week.am':'아침', 'week.pm':'저녁', 'week.sum':'7일 동안 {n}번 · 연속 {k}일 · 칭찬 도장 {m}개', 'week.days':['일', '월', '화', '수', '목', '금', '토'],
  'event.newyear.name':'새해', 'event.newyear.greet':'새해 복 많이 받아요!', 'event.newyear.cheer':'새해에도 반짝반짝!',
  'event.seollal.name':'설날', 'event.seollal.greet':'설날이에요! 복 많이 받아요!', 'event.seollal.cheer':'떡국 먹고 이도 깨끗하게 닦아요!',
  'event.childrensday.name':'어린이날', 'event.childrensday.greet':'어린이날 축하해요!', 'event.childrensday.cheer':'오늘의 주인공은 바로 너!',
  'event.chuseok.name':'추석', 'event.chuseok.greet':'즐거운 추석 보내요!', 'event.chuseok.cheer':'송편 먹고 쓱쓱!',
  'event.halloween.name':'핼러윈', 'event.halloween.greet':'해피 핼러윈!', 'event.halloween.cheer':'충치 유령도 무서워서 도망가요!',
  'event.xmas.name':'크리스마스', 'event.xmas.greet':'메리 크리스마스!', 'event.xmas.cheer':'산타 할아버지도 보고 있어요!',
  'th.candy.t':"사탕 먹는 세균", 'th.candy.1':"반짝이가 아껴 둔 사탕이 있었어요.", 'th.candy.2':"냠냠! 사탕 먹고 쑥쑥 커진다!", 'th.candy.3':"앗, 세균이 점점 커져요!", 'th.candy.4':"내가 칫솔 가져올게!", 'th.candy.5':"단 걸 먹은 뒤엔 치카치카!", 'th.candy.6':"단 걸 먹으면 꼭 이를 닦아요.", 'th.lostbrush.t':"사라진 칫솔", 'th.lostbrush.1':"어? 내 칫솔이 어디 갔지?", 'th.lostbrush.2':"범인은 꼬마 세균이었어요!", 'th.lostbrush.3':"거기 서! 내 칫솔 돌려줘!", 'th.lostbrush.4':"{pet}{pet|이/가} 앞을 딱 막았어요!", 'th.lostbrush.5':"찾았다! 이제 깨끗하게 닦아 줄게.", 'th.lostbrush.6':"으악, 간지러워!", 'th.lostbrush.7':"칫솔은 늘 제자리에 둬요.", 'th.treasure.t':"바닷가 보물 상자", 'th.treasure.1':"바닷가에서 커다란 상자를 찾았어요.", 'th.treasure.2':"영차, 영차! 왜 안 열리지?", 'th.treasure.3':"{boss}의 끈적끈적 자물쇠다! 못 열걸?", 'th.treasure.4':"반짝이, 칫솔로 닦아 봐!", 'th.treasure.5':"상자 안에는 반짝이는 별이 가득!", 'th.treasure.6':"{pet}, 우리 반씩 나눠 가지자!", 'th.sleepy.t':"졸린 밤", 'th.sleepy.1':"하암… 오늘은 그냥 잘래.", 'th.sleepy.2':"안 돼, 이 닦고 자자!", 'th.sleepy.3':"{pet}의 꿈속에 세균들이 나타났어요!", 'th.sleepy.4':"파티다! 이 사이에서 놀자!", 'th.sleepy.5':"으악! 일어날래! 이 닦을래!", 'th.sleepy.6':"치카치카, 다 같이 닦자!", 'th.sleepy.7':"이제 좋은 꿈만 꿀 거예요.", 'th.race.t':"세균과 달리기 시합", 'th.race.1':"내가 더 빠르지! 시합하자!", 'th.race.2':"준비… 땅!", 'th.race.3':"헉헉, 너무 빨라!", 'th.race.4':"{pet}의 비밀 작전!", 'th.race.5':"반짝이가 1등!", 'th.race.6':"세균아, 다음엔 같이 양치하자!", 'th.hiccup.t':"딸꾹질 멈추기", 'th.hiccup.1':"딸꾹! 딸꾹!", 'th.hiccup.2':"내가 놀래 줄게. 왁!", 'th.hiccup.3':"딸꾹!", 'th.hiccup.4':"물을 마셔 볼까?", 'th.hiccup.5':"짜잔! 나 {boss}다!", 'th.hiccup.6':"어? 딸꾹질이 멈췄어!", 'th.hiccup.7':"고마워! 상으로 깨끗하게 닦아 줄게.", 'th.hiccup.8':"세균도 반짝반짝 친구가 됐어요.", 'th.king.t':"이가 아픈 임금님", 'th.king.1':"성에 사는 {pet} 임금님이 울고 있었어요.", 'th.king.2':"이가 아파요… 사탕만 먹었거든요.", 'th.king.3':"제가 이 닦는 법을 알려 드릴게요!", 'th.king.4':"위아래로 쓱쓱!", 'th.king.5':"어금니는 앞뒤로 싹싹!", 'th.king.6':"와, 하나도 안 아파요!", 'th.king.7':"임금님이 반짝이에게 별 메달을 주었어요.", 'th.swamp.t':"늪의 세균 떼", 'th.swamp.1':"늪에 세균이 하나 살고 있었어요.", 'th.swamp.2':"친구들 다 불러올래!", 'th.swamp.3':"너무 많아! 혼자서는 힘들어.", 'th.swamp.4':"{pet}도 도와줄게!", 'th.swamp.5':"둘이 함께 거품을 크게 만들었어요.", 'th.swamp.6':"함께 하니까 금방 끝났다!", 'th.song.t':"노래 도둑 세균", 'th.song.1':"숲속의 노래가 모두 사라졌어요.", 'th.song.2':"노래는 다 내 거야! 헤헤.", 'th.song.3':"노래를 돌려줘!", 'th.song.4':"우리가 더 신나게 부르자!", 'th.song.5':"치카치카 쓱쓱, 반짝반짝!", 'th.song.6':"앗, 나도 모르게 춤을…!", 'th.song.7':"숲속에 다시 노래가 퍼졌어요.", 'th.moon.t':"달님 닦아 주기", 'th.moon.1':"오늘 밤 달님 얼굴에 세균이 붙었어요.", 'th.moon.2':"로켓 타고 달님을 닦으러 가자!", 'th.moon.3':"잘 다녀와!", 'th.moon.4':"달님이 다시 환하게 웃었어요!", 'th.moon.5':"그래서 오늘 밤 달이 밝은 거야.", 'th.next':"내일은 「{title}」 이야기!", 'th.eggName':"알 친구", 'th.name':'반짝이 극장', 'th.ep':'{n}화', 'th.skip':'건너뛰기 ▶', 'th.open':'반짝이 극장! {n}화, {title}', 'settings.theater':'양치 끝나고 반짝이 극장 보기', 'settings.theaterTest':'🎬 반짝이 극장 미리 보기 (테스트)', 'sp.today':'오늘은 스페셜!', 'sp.new':'새 영상이 왔어요!', 'sp.say':'오늘은 스페셜 영상! {title}', 'sp.sound':'🔊 소리 켜기', 'sp.check':'영상 파일 확인 중…', 'sp.checkOk':'영상 {n}편 모두 잘 찾았어요', 'sp.checkBad':'영상 {n}편 중 {ok}편 OK · 못 찾은 것: {list}', 'sp.checkNone':'영상을 하나도 못 찾았어요. 부모님 설정의 "📥 스페셜 영상 넣기"로 영상을 한 번에 골라 넣어 주세요', 'sp.load':'📥 스페셜 영상 넣기 (여러 개 한 번에)', 'sp.clear':'넣은 영상 모두 지우기', 'sp.stored':'이 휴대폰에 넣은 영상: {n}편', 'sp.part2':'2부', 'sp.checkSum':'에피소드 {ep}편 · 단편 {sh}편을 틀 수 있어요', 'sp.epN':'스페셜 {n}화', 'sp.storedNone':'넣은 영상 없음 (specials 폴더에서 찾음)', 'sp.saving':'영상을 넣는 중… 잠깐만요', 'sp.saved':'영상 파일 {n}개를 넣었어요!', 'sp.savedSome':'영상 파일 {ok}개를 넣었어요 ({fail}개는 저장 못 함: 너무 크거나 저장 공간 부족)', 'sp.cleared':'넣은 영상을 지웠어요', 'sp.notVideo':'영상 파일(mp4)을 골라 주세요', 'sp.fail':'영상을 못 틀었어요: {file}', 'settings.special':'스페셜 영상 (특별한 날 · 일주일에 한 번)', 'settings.specialTest':'🎞 스페셜 영상 미리 보기 (테스트)',
  'th.end':['오늘도 반짝반짝, 끝!', '내일 또 만나요!', '다음 이야기도 기대해요!', '또 같이 닦자, 안녕!'], 'th.endName':'우리 {name}, 오늘도 최고예요! 또 만나요!',
})};

const PACK_EN = { meta:{ code:'en', name:'English', dir:'ltr', tts:'en-US' }, strings: withItems('en', {
  'app.title':"Let's Brush",
  'home.title':'Brush with\nSparkle!',
  'home.todayNone':'No brushing yet today',
  'home.todayCount_one':'Brushed once today ✨',
  'home.todayCount_other':'Brushed {n} times today ✨',
  'home.min':'{n} min',
  'home.start':"Let's brush!",
  'home.closet':'👕 Dress up Sparkle',
  'closet.title':'Dress up Sparkle',
  'closet.none':'None', 'closet.selected':'Selected', 'closet.wearing':'Wearing', 'closet.owned':'Owned',
  'closet.eventTag':'{icon} Event',
  'closet.buyQ':'Buy the {item} for {cost} ⭐?',
  'closet.buyOk':'Yes!', 'closet.buyCancel':'Not now',
  'closet.needMore':'{n} more ⭐ needed! Brush to collect',
  'closet.got':'You got the {item}!',
  'closet.eventBanner':'{icon} Wearing a {event} outfit',
  'slot.head':'Hats', 'slot.eyes':'Glasses', 'slot.neck':'Neck', 'slot.back':'Back', 'slot.hand':'Hand',
  'brush.back':'Home',
  'zone.ul':'Top left', 'zone.ur':'Top right', 'zone.lr':'Bottom right', 'zone.ll':'Bottom left',
  'audio.title':'Sound', 'audio.voice':'🗣 Voice', 'audio.music':'🎵 Music', 'audio.sfx':'🔔 Sound effects', 'audio.track':'Song', 'audio.close':'Close', 'audio.preview':'🎵 Play a sample', 'audio.load':'📂 Use music from my phone', 'audio.loaded':'Your music: {name}', 'audio.loadOk':'Music loaded!', 'audio.loadTemp':"Couldn't save it in this browser. Load it again next time", 'audio.tooBig':'File too big (30MB max)', 'audio.notAudio':'Please choose a music file', 'audio.noCustom':'Load your music first', 'bgm.sunny':'Sunny Day', 'bgm.march':'Brave March', 'bgm.calm':'Cozy Tune', 'bgm.bubbly':'Bubble Pop', 'bgm.space':'Space Trip', 'bgm.custom':'📂 My music', 'slot.brush':'Brush', 'closet.using':'Using', 'settings.voicePick':'Voice', 'settings.voiceAuto':'Auto', 'settings.voiceTone':'Tone', 'tone.kind':'Gentle', 'tone.normal':'Normal', 'tone.bright':'Cheerful', 'settings.voiceTry':'🔊 Try it', 'rec.title':'🎙 Use my own voice', 'rec.note':'Tap ● to record, ■ to stop (15s max). Recording again replaces the old one; delete to go back to the device voice.', 'rec.mine':'My voice', 'rec.device':'Device voice', 'rec.saved':'Recorded!', 'rec.cleared':'Recording deleted', 'rec.noMic':"Can't use the microphone. Please allow it (some phones need the app on https)", 'rec.l.prep':'Toothpaste step', 'rec.l.say.cheers':'Cheering', 'rec.l.done':'All done', 'rec.bossAny':'the boss germ',  'say.start':"Ready? Let's brush together.",
  'say.ul':"Let's start with the top left.", 'say.ur':'Now the top right!', 'say.lr':'Bottom right, swish swish!', 'say.ll':'Last one! Bottom left!',
  'say.cheers':['Great job!', 'Get every corner!', 'Bubbles everywhere!', 'Your teeth are smiling!', 'Awesome! Keep going!'],
  'say.hurry':'Almost there. Just 10 more seconds.', 'say.pause':'Taking a little break…', 'say.resume':'Back to brushing!',
  'settings.dur':'Brushing time', 'dur.60':'1 min', 'dur.120':'2 min', 'dur.180':'3 min', 'dur.rec':'{t} (recommended)',
  'pet.waitNew':'More new friends are coming soon! Until then, you get extra stars for brushing ⭐', 'rw.petWait':'🐾 Waiting-for-friends stars', 'settings.medNote':'🦷 This app is a game that helps build a brushing habit. It does not replace dental care. Please see a dentist for regular checkups.', 'bk.remind':"⚠️ No backup for over a month. Changing phones or clearing browser data can erase stars and pets. Save a backup file below.", 'home.tipIOS':'👨‍👩‍👧 For parents: add this app to your Home Screen to keep its records safe. Tap the Share button (□↑) at the bottom of Safari and choose "Add to Home Screen". In Safari alone, records can be erased if the app is not opened for a while.', 'home.tipAnd':'👨‍👩‍👧 For parents: add this app to your home screen to keep its records safe. In Chrome, open the menu (⋮) at the top right and tap "Add to Home screen" or "Install app".', 'home.tipInstall':'Add now', 'home.tipLater':'Later',
  'sub.title':'⭐ Sparkle Club', 'sub.parent':'👨‍👩‍👧 For parents', 'sub.introH':'Try Sparkle Club free for {d} days', 'sub.p1':'All {pets} pets (free: {fp})', 'sub.p2':'All {isl} map islands and hero outfits', 'sub.p3':'Sparkle special videos', 'sub.p4':'A new friend and outfit every month', 'sub.free':'Without the trial, brushing, the quiz, stars and {fp} basic pets stay free.', 'sub.consent':'After the trial, {price} is charged every month automatically. Cancel in the store at least 24 hours before it ends and you will not be charged. I have read and agree.', 'sub.start':'Start {d}-day free trial', 'sub.later':'Keep the free version', 'sub.started':'Sparkle Club trial started! Everything is open for {d} days ⭐', 'sub.stTrial':'Free trial · {d} days left', 'sub.stActive':'Subscribed. Thank you! 💛', 'sub.stFree':'Using the free version', 'sub.stNone':'Trial not started yet', 'sub.goTrial':'About the {d}-day free trial', 'sub.goSub':'Subscribe ({price}/month)', 'sub.restore':'Restore purchase', 'sub.manage':'Manage · cancel', 'sub.manageHow':'You can manage or cancel in the App Store or Google Play subscriptions menu', 'sub.restoreNone':'No subscription found to restore', 'sub.restoreOk':'Subscription restored', 'sub.storeOnly':'Subscriptions are available in the store app', 'sub.remind':'👨‍👩‍👧 For parents: the Sparkle Club free trial ends in {d} days. To stop, cancel in the store. Otherwise {price} will be charged every month.', 'sub.ok':'OK', 'sub.mapLock':'🔒 The next island is still locked', 'sub.keep':'Pets and outfits received during the trial or subscription stay after it ends.', 'sub.terms':'Terms', 'sub.contact':'Contact (email)', 'sub.privacy':'Privacy policy', 'sub.needAgree':'Please tick the box first', 'sub.devSim':'💳 Simulate subscription: {s}', 'sub.devEnd':'💳 End trial (today)', 'sub.devAct':'💳 Set subscribed', 'sub.devReset':'💳 Reset subscription', 'sub.on':'on', 'sub.off':'off',
  'kids.title':'👧 Kids', 'kids.add':'+ Add a child', 'kids.max':'You can add up to 3 children', 'kids.who':"Who's brushing?", 'kids.now':'now', 'kids.del':'Delete', 'kids.delQ':"Delete all stars, pets and records for {name}? This can't be undone.", 'kids.delOk':'Delete', 'kids.cancel':'Cancel', 'kids.note':'Each child has their own stars, pets, quiz, date of birth and brushing hand. Sound, language and brushing time are shared. Tap a child to switch.', 'kids.added':'New child added. Please enter a name and date of birth.', 'kids.n1':'Child 1', 'kids.n2':'Child 2', 'kids.n3':'Child 3', 'kids.switched':"It's {name}'s turn",
  'quiz.title':'🧮 Daily quiz', 'quiz.btn':'🧮 Daily quiz', 'quiz.close':'Maybe later', 'quiz.okBtn':'Yay!', 'quiz.ok':'Ding-dong! You got it!', 'quiz.no':'Try again!', 'quiz.reward':'You got {n} star and a stamp!', 'quiz.petWon':'All stamps collected! A new friend is coming!', 'quiz.allPets':'All stamps collected! Here are 5 more stars!',
  'quiz.count':'How many {item} are there?', 'quiz.add':'What is {a} plus {b}?', 'quiz.sub':'What is {a} minus {b}?', 'quiz.mul':'What is {a} times {b}?', 'quiz.item.apple':'apples', 'quiz.item.star':'stars', 'quiz.item.fish':'fish', 'quiz.item.strawberry':'strawberries', 'quiz.item.balloon':'balloons', 'quiz.item.duck':'chicks',
  'settings.quiz':'Daily quiz after brushing (one question)', 'settings.bdayYear':'Year', 'settings.year':'{n}', 'settings.ageIs':'Age {n} · quiz and toothpaste amount match the age', 'settings.ageHint':'Add the birth year for age-matched quizzes',
  'gate.title':'👨‍👩‍👧 Grown-ups only', 'gate.note':'Settings are for grown-ups. Tap in the answer.', 'gate.q':'{a} × {b} = ?', 'gate.wrong':'Not quite. Here is a new one.', 'gate.cancel':'Close',
  'stop.q':'Stop brushing?', 'stop.keep':'Keep brushing', 'stop.quit':'Stop',
  'done.title':'All clean!',
  'done.msgs':['The cavity bugs ran away!', 'Your teeth are sparkling!', 'You are a brushing champion!', 'Fresh and clean!'],
  'done.canBuy':'You can buy something new with your stars!',
  'done.gain':'⭐ +1 · You have {n}',
  'done.home':'Home', 'done.closet':'👕 Go dress up',
  'toast.firstGift':'Welcome gift: 3 stars! ⭐', 'toast.testStars':'Test: +10 stars', 'toast.testGift':'Test mode: {n} stars! ⭐',
  'toast.packInstalled':'{lang} pack installed!', 'toast.packFail':"Couldn't get the pack. Check your connection",
  'settings.title':'Settings', 'settings.language':'Language', 'settings.packs':'More language packs',
  'settings.get':'Get', 'settings.getting':'Getting…', 'settings.installed':'Installed',
  'settings.country':'Country', 'settings.eventsHere':'Special days here: {list}', 'settings.eventsNone':'No special days set up for this country yet',
  'settings.voice':'Voice cheering', 'settings.voiceNote':'If your device has no voice for this language, it stays silent',
  'settings.eventLook':'Wear special outfits on holidays',
  'settings.devTitle':'🔧 Developer test (remove before launch)', 'settings.eventPreview':'Preview event', 'settings.auto':'Auto (today)', 'tech.short':'Short strokes (default)', 'tech.circle':'Small circles (Fones)', 'tech.roll':'Sweep (roll)', 'tech.shortNote':'Angle the brush toward the gums and use short, gentle back-and-forth strokes. Scrub the chewing surfaces back and forth.', 'tech.circleNote':'Brush in small circles. Easy for little kids to copy. Scrub the chewing surfaces back and forth.', 'tech.rollNote':'Sweep from the gums toward the tooth edge: top teeth downward, bottom teeth upward. Scrub the chewing surfaces back and forth.', 'hint.short.outer':'↔ Angle to the gums, short strokes', 'hint.short.inner':'↔ Short strokes', 'hint.circle':'⭕ Small circles', 'hint.roll.u':'⬇ Sweep down', 'hint.roll.l':'⬆ Sweep up', 'hint.chew':'↔ Scrub back and forth', 'settings.parentTitle':'👨‍👩‍👧 For parents', 'settings.technique':'Brushing method', 'settings.hand':'Brushing hand', 'hand.right':'Right hand', 'hand.left':'Left hand', 'settings.kidName':"Child's name", 'settings.kidNamePh':'e.g. Mia', 'settings.bday':'Date of birth', 'settings.bdayNone':'Not set', 'settings.month':'{n}', 'settings.day':'{n}', 'event.birthday.name':'Birthday', 'event.birthday.greet':'Happy birthday!', 'event.birthday.greetName':'Happy birthday, {name}!', 'event.birthday.cheer':'Sparkly teeth for your birthday!', 'done.gift':'🎁 Tap the box to open it!', 'gift.say':'A present is here. Shall we open it?', 'gift.got':'You got {n} stars!', 'rw.base':'Brushing done', 'rw.noPause':'No stopping', 'rw.streak':'{n} days in a row', 'rw.twice':'Brushed twice today', 'rw.event':'{event} gift', 'rw.bday':'🎂 Birthday gift', 'rw.lucky':'🍀 Lucky star!', 'rw.total':'Total', 'bgm.birthday':'Happy Birthday', 'settings.age':"Child's age", 'age.u3':'Under 3', 'age.3p':'3 and up', 'settings.prep':'Toothpaste step before brushing', 'prep.step':'Get ready', 'prep.go':"I'm ready!", 'prep.title.rice':'Just a smear of toothpaste,\nthe size of a grain of rice', 'prep.title.pea':'A pea-sized blob\nof toothpaste', 'prep.sayWater':'No need to wet your brush.', 'prep.saySpit':"When you're done, don't swallow the toothpaste. Spit it out!", 'prep.tip.paste':'This much', 'prep.tip.water':'No water needed', 'prep.tip.spit':"Don't swallow, spit!", 'tongue.title':'Bonus! Brush your tongue', 'tongue.say':'Stick out your tongue and gently sweep from back to front.', 'tongue.done':'Your tongue is clean too!', 'tongue.skip':'Skip', 'tongue.tip':'Gently, and not too far back', 'settings.tongue':'Tongue brushing at the end', 'prep.listen':'🔊 Listen again', 'done.spit':"Don't swallow, spit it out!", 'prep.cmp.rice':'Grain of rice', 'prep.cmp.pea':'Pea', 'prep.say.rice':'Just a tiny smear of toothpaste, like a grain of rice', 'prep.say.pea':'Squeeze a pea-sized blob of toothpaste', 'prep.note':'👨‍👩‍👧 Use fluoride toothpaste and let a grown-up squeeze it. Spit it out when done, don\'t swallow. No need to wet the brush first.',  'settings.parentTip':"Until about age 9, kids can't reach every spot on their own. Please finish the brushing for them.", 'done.parentTip':'👨‍👩‍👧 A grown-up should finish the brushing', 'surface.outer':'outside', 'surface.chew':'back teeth tops', 'surface.inner':'back teeth inside', 'surface.front':'front teeth inside', 'say.front':'Stand the brush up behind your front teeth. Up and down!', 'hint.front':'↕ Brush upright, up and down', 'say.chew':'Scrub the tops of your back teeth!', 'say.bossTease':'Uh-oh, {boss} is here! It wants to hide germs in your back teeth!', 'say.raid':'{boss} hid germs in your back teeth! Scrub again!', 'rw.raid':'Found {n} hidden germs', 'say.inner':'Now the inside of your back teeth!', 'say.sparkle':'Wow, sparkly clean.',
  'say.boss':'The {boss} is here! 10 more seconds!', 'say.bossDown':'You beat the {boss}! Sparkly clean!', 'done.germs_one':'You beat {n} germ!', 'done.germs_other':'You beat {n} germs!',
  'pet.egg':'Mystery Egg', 'pet.penguin':'Baby Penguin', 'pet.whale':'Baby Whale', 'pet.fox':'Baby Fox', 'pet.panda':'Baby Panda',
  'pet.penguin.def':'Pip', 'pet.whale.def':'Splash', 'pet.fox.def':'Ginger', 'pet.panda.def':'Bao',
  'pet.eggLeft_one':'The egg got warmer! {n} more brush to hatch.', 'pet.eggLeft_other':'The egg got warmer! {n} more brushes to hatch.',
  'pet.growLeft_one':'{name} is growing! {n} more brush to grow.', 'pet.growLeft_other':'{name} is growing! {n} more brushes to grow.', 'pet.seeTomorrow':'See you tomorrow!',
  'pet.restEgg':'The egg is sleeping today. Brush again tomorrow to warm it up!', 'pet.restPet':'{name} is sleeping today. Brush together again tomorrow!',
  'pet.hatched':'Ta-da! A baby {sp} hatched!', 'pet.nameAsk':'Give it a name?', 'pet.ok':'OK!',
  'pet.grew':'{name} grew bigger!', 'pet.adult':'{name} is all grown up!', 'pet.newSpecialEgg':'A sparkly special egg arrived!', 'book.legend':'Legend Pets', 'pet.giftRow':'🐾 Brushed twice today: a pet gift!', 'pet.giftTitle':'A {sp} popped out of the gift box!', 'pet.palChange':'Change', 'pet.allDone':"You've collected every pet! Amazing!", 'home.twiceHint':'Brush once more today for a pet gift! 🎁',
  'pet.eggSay_one':'What will hatch? {n} more brush!', 'pet.eggSay_other':'What will hatch? {n} more brushes!', 'pet.says':["Let's brush together!", 'Sparkly teeth today!', "Let's beat the germs!", 'Brushing with you is the best!'],
  'settings.petTest':'🥚 Grow egg/pet +1 (test)', 'settings.eggTest':'🌈 Get a special egg (test)', 'settings.star100':'⭐ Get 100 stars (test)', 'settings.bookAll':'📖 Unlock the whole collection (test)', 'settings.petAll':'🐾 Get every pet (test)', 'toast.petAll_one':'You got {n} pet!', 'toast.petAll_other':'You got {n} pets!', 'settings.reset':'🔄 Start over (reset)',
  'reset.q':'Stars, pets, collection, map, outfits and brushing records will all be erased. Settings like name, sound and language stay. Reset?', 'reset.ok':'Reset', 'reset.cancel':'Cancel', 'toast.star100':'You got 100 stars!', 'toast.bookAll':'Collection fully unlocked!',
  'slot.weekly':'🆕 This Week', 'slot.hero':'🦸 Hero', 'closet.mapTag':'🗺 Map prize', 'closet.mapSay':'Reach a castle on the Adventure Map to get one!',
  'closet.weekLeft_one':"This week's picks. New ones in {n} day! (What you buy stays yours)", 'closet.weekLeft_other':"This week's picks. New ones in {n} days! (What you buy stays yours)",
  'hero.set.space':'Space Ranger', 'hero.set.knight':'Brave Knight', 'hero.set.dino':'Dino Chief', 'hero.set.fairy':'Flower Fairy', 'hero.set.mermaid':'Mermaid Explorer', 'hero.set.unicorn':'Rainbow Unicorn', 'hero.need_one':'{n} more piece to transform!', 'hero.need_other':'{n} more pieces to transform!', 'hero.wear':'Tap to transform!', 'hero.wearing':'✨ Transformed',
  'hero.go':'Transform! {set} Sparkle!', 'hero.how':'Every castle on the Adventure Map gives one hero piece. Wear all five to transform!', 'map.gotHero':'Adventure prize: {item}! Find it in Dress up → Hero', 'map.heroDone':'Hero set complete! Transform!',
  'pet.heroAdult':'Transform! {name} is all grown up!', 'pet.treat':'🍪 Treat ⭐1', 'pet.trickBtn':'Show trick', 'pet.fedToday':'💤 More treats tomorrow', 'pet.yum':['Yum!', 'Tasty!', 'Yum, thank you!'],
  'pet.loveUp':'{name} loves it! Hearts: {h}', 'pet.loveHint':'Give 5 treats to learn a trick (one a day)', 'pet.trickLearn':'{name} learned a trick: {trick}!', 'pet.trickShow':"{name}'s trick: {trick}!",
  'trick.spin':'Spin', 'trick.jump':'Big Jump', 'trick.dance':'Happy Dance', 'trick.flip':'Flip',
  'pet.eggFeat_one':'Friend of the Month egg! {n} more brush!', 'pet.eggFeat_other':'Friend of the Month egg! {n} more brushes!', 'pet.hatchedFeat':'🌟 Friend of the Month: {sp} hatched!', 'pet.featEgg':'🌟 Friend of the Month egg', 'book.feat':'🌟 Friend of the Month',
  'book.team':'Teams', 'team.done':'Teamed up!', 'team.go':'{team}, team up!', 'team.say':'{team}, team up! {names}: one team!', 'team.star_one':'{n} star gift!', 'team.star_other':'{n} stars gift!', 'rw.team':'🤝 {team} teamed up', 'team.need':'Collect {names} to team up!',
  'team.jungle':'Jungle Team', 'team.ice':'Ice Land Team', 'team.ocean':'Ocean Team', 'team.sky':'Sky Team', 'team.farm':'Farm Team', 'team.safari':'Safari Team', 'team.dino':'Dino Team', 'team.bug':'Bug Team', 'team.dog':'Puppy Team', 'team.cat':'Kitty Team', 'team.forest':'Forest Team', 'team.legend':'Legend Team',
  'hab.home':'My Room', 'hab.safari':'Safari', 'hab.bug':'Bug Garden', 'hab.bird':'Bird Forest', 'hab.sea':'Aquarium', 'hab.swamp':'Reptile Swamp', 'hab.castle':'Legend Castle',
  'hab.who.safari':'Home for land animal friends', 'hab.who.bug':'Home for bug friends', 'hab.who.bird':'Home for bird friends', 'hab.who.sea':'Home for water friends', 'hab.who.swamp':'Home for frogs, turtles and dinos', 'hab.who.castle':'Home for legend pets',
  'hab.build':'Build for {cost}', 'hab.buildOk':'Build it', 'hab.built':'You built the {name}! Friends moved in!', 'hab.noPets':'No friends live here yet. Meet them from eggs!', 'hab.buildFirst':'Build the home first!',
  'hab.goalBtn':'🎯 Make it my goal', 'hab.goalOn':'🎯 My goal now', 'hab.count_one':'{n} friend', 'hab.count_other':'{n} friends',
  'hab.d.hd_pond':'Water Hole', 'hab.d.hd_rock':'Lion Rock', 'hab.d.hd_balloon':'Hot Air Balloon', 'hab.d.hd_honey':'Honey Pot', 'hab.d.hd_mushhouse':'Mushroom House', 'hab.d.hd_sunflower':'Sunflower', 'hab.d.hd_birdhouse':'Birdhouse', 'hab.d.hd_swing':'Swing', 'hab.d.hd_rainbow':'Rainbow',
  'hab.d.hd_chest':'Treasure Chest', 'hab.d.hd_coral':'Coral', 'hab.d.hd_sub':'Little Submarine', 'hab.d.hd_lotus':'Lotus', 'hab.d.hd_log':'Log Bridge', 'hab.d.hd_fireflies':'Fireflies', 'hab.d.hd_moon':'Moon', 'hab.d.hd_rbridge':'Rainbow Bridge', 'hab.d.hd_treasure':'Treasure Pile',
  'goal.left_one':'🎯 {n} more star for the {name}!', 'goal.left_other':'🎯 {n} more stars for the {name}!', 'goal.ready':'🎯 You can build the {name}! Build it in Pets!', 'goal.set':'🎯 Goal: {name}',
  'settings.heroAll':'🦸 Get all hero sets (test)', 'toast.heroAll':'You got all the hero sets!',
  'wk.name':'{color} {shape}', 'wk.c.red':'Red', 'wk.c.orange':'Orange', 'wk.c.yellow':'Yellow', 'wk.c.green':'Green', 'wk.c.blue':'Blue', 'wk.c.purple':'Purple', 'wk.c.pink':'Pink',
  'wk.s.beanie':'Beanie', 'wk.s.beret':'Beret', 'wk.s.tophat':'Top Hat', 'wk.s.catband':'Cat Ears', 'wk.s.bearband':'Bear Ears', 'wk.s.hearteyes':'Heart Glasses', 'wk.s.squareeyes':'Square Glasses', 'wk.s.goggles':'Goggles',
  'wk.s.stripescarf':'Striped Scarf', 'wk.s.tie':'Tie', 'wk.s.pearls':'Bead Necklace', 'wk.s.starcape':'Star Cape', 'wk.s.bflywings':'Butterfly Wings', 'wk.s.lolli':'Lollipop', 'wk.s.icecream':'Ice Cream', 'wk.s.starballoon':'Star Balloon',
  'ptab.friends':'Friends', 'ptab.dress':'Dress up', 'ptab.room':'Room', 'pet.stage1':'Baby', 'pet.stage2':'Kid', 'pet.stage3':'Grown-up', 'pet.look':'Look', 'look.1':'Baby', 'look.2':'Kid', 'look.3':'Grown-up', 'pet.lookSet':'{name} switched to the {look} look!',
  'pet.palNow':'Coming along', 'pet.palBtn':'Take along', 'pet.palSet':'{name} is coming along!', 'pet.namePh':'Name', 'pet.noPet':'Hatch an egg to dress up a pet!',
  'pet.eggCard':'Egg', 'pet.specialEgg':'Special Egg', 'pet.eggSpecial_one':'A sparkly special egg! {n} more brush to meet it!', 'pet.eggSpecial_other':'A sparkly special egg! {n} more brushes to meet it!',
  'pet.adultSpecial':'{name} is all grown up! A sparkly special egg arrived!',
  'pet.unicorn':'Baby Unicorn', 'pet.dragon':'Baby Dragon', 'pet.unicorn.def':'Sprinkles', 'pet.dragon.def':'Puff',
  'pcol.base':'Classic', 'pcol.mint':'Mint', 'pcol.pink':'Pink', 'pcol.lav':'Lavender', 'pcol.sky':'Sky', 'pcol.gold':'Golden', 'pcol.rainbow':'Rainbow', 'pcol.galaxy':'Galaxy',
  'book.colorsFound':'Colors found: {list}', 'book.special':'Only from special eggs!',
  'pitem.head_bow':'Bow', 'pitem.head_crown':'Little Crown', 'pitem.head_flower':'Flower Pin', 'pitem.head_party':'Party Hat', 'pitem.neck_scarf':'Scarf', 'pitem.neck_bowtie':'Bow Tie',
  'pitem.neck_bell':'Bell Collar', 'pitem.face_glasses':'Round Glasses', 'pitem.face_sun':'Sunglasses', 'pitem.face_heart':'Heart Cheeks', 'settings.mapTest':'🗺 Map +1 step (test)',
  'boss.candy':'Sticky Candy Boss', 'boss.choco':'Choco Boss', 'boss.soda':'Soda Fizz Boss', 'boss.jelly':'Jelly Boss', 'boss.cookie':'Cookie Crumb Boss', 'boss.juice':'Juice Boss', 'boss.king':'Cavity King',
  'boss.candy.tip':'Candy sticks to teeth for a long time. Rinse with water after.', 'boss.choco.tip':'Brush extra well on chocolate days.', 'boss.soda.tip':'Water is better for teeth than soda.',
  'boss.jelly.tip':'Jelly gets stuck between teeth. Brush in between!', 'boss.cookie.tip':'Cookie crumbs hide in back-tooth grooves.', 'boss.juice.tip':'A straw keeps juice off your teeth.', 'boss.king.tip':'Lots of sweets bring the Cavity King. Brush twice a day!',
  'say.call':'{name}!', 'say.cheersName':['Great job, {name}!', '{name}, the germs are running away!', "{name}'s teeth are getting sparkly!"],
  'combo':'{n} in a row!', 'rw.gold':'✨ Golden germ!',
  'germ.0':'Green Germ', 'germ.1':'Purple Germ', 'germ.2':'Orange Germ', 'germ.3':'Blue Germ', 'germ.gold':'Golden Germ',
  'germ.0.tip':'Sticks near the gums.', 'germ.1.tip':'Hides in back-tooth grooves.', 'germ.2.tip':'Gets stuck between teeth.', 'germ.3.tip':'Hides behind front teeth.', 'germ.gold.tip':'A rare germ that shows up only sometimes!',
  'pet.hatchedShiny':'Wow! A legendary {sp} hatched! A super rare friend!', 'pet.shiny':'Sparkly {sp}',
  'streak.info':'{n}-day brushing streak! You have {s} streak cushion(s). Miss a day and a cushion keeps your streak.', 'streak.buy':'Buy a cushion ({cost} stars)', 'streak.close':'Close',
  'streak.bought':'Got a streak cushion!', 'streak.saved':'A cushion saved your streak!', 'rw.mile':'🔥 {n}-day streak!', 'rw.mileShield':'🔥 {n}-day streak! Plus a cushion',
  'greet.am':'Good morning!', 'greet.pm':"Let's sparkle before bed!", 'greet.we':'The Tooth Fairy is visiting this weekend!', 'rw.fairy':"🧚 Tooth Fairy's weekend gift",
  'next.am':'Who comes tomorrow morning?', 'next.pm':'Who comes tonight?', 'next.say.am':'Which germ boss will come tomorrow morning? See you then!', 'next.say.pm':'Which germ boss will come tonight? See you before bed!',
  'menu.closet':'Dress up', 'menu.room':'Pets', 'menu.book':'Collection', 'menu.map':'Map',
  'book.title':'Collection', 'book.boss':'Bosses', 'book.germ':'Germs', 'book.pet':'Pets', 'book.notYet':'Not met yet. Keep brushing to find it!', 'book.count':'Met {n}×',
  'room.title':'Pets', 'room.empty':'When your egg hatches, your pet will live here!', 'room.placed':'Placed',
  'room.wall_sky':'Sky Wallpaper', 'room.wall_stars':'Star Wallpaper', 'room.wall_hearts':'Heart Wallpaper', 'room.wall_stripes':'Striped Wallpaper', 'room.win_round':'Round Window', 'room.poster':'Rainbow Picture',
  'room.lamp_star':'Star Lamp', 'room.rug_round':'Round Rug', 'room.rug_rainbow':'Rainbow Rug', 'room.bed_basket':'Basket Bed', 'room.bed_cloud':'Cloud Bed',
  'room.toy_ball':'Ball', 'room.toy_blocks':'Blocks', 'room.toy_duck':'Rubber Duck', 'room.plant_pot':'Flower Pot', 'room.plant_cactus':'Cactus',
  'map.title':'Adventure Map', 'map.left_one':'{n} step to the castle!', 'map.left_other':'{n} steps to the castle!', 'map.isl.candy':'Candy Island', 'map.isl.choco':'Choco Forest', 'map.isl.bubble':'Bubble Sea', 'map.isl.star':'Starlight Space', 'map.isl.rainbow':'Rainbow Castle',
  'map.arrive':'You reached {isl}! A new island opened!', 'rw.castle':'🏰 Reached {isl}', 'map.giftRoom':'Pet room gift: {item}!', 'map.rest':'Resting on the map today. Move on tomorrow!', 'map.locked':'Locked', 'map.reward':'Castle prize', 'map.got':'Prize you got', 'map.cleared':'Cleared! You finished this island.', 'map.lockedSay':'Clear the island before it to open this one!', 'map.eggGift':'Special egg (legend pet)', 'map.lap':'Lap {n}', 'map.how':'Each brush moves you 1 step (up to 3 a day). 7 steps per island! Each castle gives a hero piece!', 'map.specialEgg':'Rainbow Castle prize! A sparkly special egg!', 'map.specialEggNext':'Rainbow Castle prize! After this egg hatches, the next one is a sparkly special egg!', 'bk.title':'💾 Backup', 'bk.note':'Save stars, pets and streaks in one file. Load it on a new phone or a new app address to keep going. (Added videos, music and recordings are not included)', 'bk.save':'💾 Save progress to a file', 'bk.load':'📂 Load a progress file', 'bk.last':'Last backup: {d}', 'bk.never':'No backup yet', 'bk.saved':'Saved: {name} (Downloads)', 'bk.bad':'This is not a Sparkle progress file', 'bk.fail':'Could not load it (check storage space)', 'bk.q':'Replace progress with the backup from {at}? Progress on this phone will be replaced.', 'bk.ok':'Load',
  'stamp.hold':'Grown-up: hold after the final brush for a stamp 👍', 'stamp.text':'Great job', 'stamp.say':'You got a praise stamp! Amazing!', 'rw.stamp':'👍 Praise stamp',
  'week.title':'📅 This week', 'week.am':'AM', 'week.pm':'PM', 'week.sum':'{n} times in 7 days · {k}-day streak · {m} stamps', 'week.days':['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  'event.newyear.name':'New Year', 'event.newyear.greet':'Happy New Year!', 'event.newyear.cheer':'Sparkle into the new year!',
  'event.seollal.name':'Lunar New Year', 'event.seollal.greet':'Happy Lunar New Year!', 'event.seollal.cheer':'Clean teeth for a lucky year!',
  'event.childrensday.name':"Children's Day", 'event.childrensday.greet':"Happy Children's Day!", 'event.childrensday.cheer':'Today is all about you!',
  'event.chuseok.name':'Chuseok', 'event.chuseok.greet':'Happy Chuseok!', 'event.chuseok.cheer':'Brush after the rice cakes!',
  'event.halloween.name':'Halloween', 'event.halloween.greet':'Happy Halloween!', 'event.halloween.cheer':'Even cavity ghosts are scared of you!',
  'event.xmas.name':'Christmas', 'event.xmas.greet':'Merry Christmas!', 'event.xmas.cheer':'Santa is watching you brush!',
  'th.candy.t':"The Candy-Eating Germ", 'th.candy.1':"Sparkle was saving a special candy.", 'th.candy.2':"Yum! Candy makes me grow!", 'th.candy.3':"Oh no, the germ is getting bigger!", 'th.candy.4':"I'll get the toothbrush!", 'th.candy.5':"After sweets, brush brush!", 'th.candy.6':"After sweets, always brush your teeth.", 'th.lostbrush.t':"The Missing Toothbrush", 'th.lostbrush.1':"Huh? Where did my toothbrush go?", 'th.lostbrush.2':"A little germ took it!", 'th.lostbrush.3':"Stop! Give it back!", 'th.lostbrush.4':"{pet} blocked the way!", 'th.lostbrush.5':"Found it! Now let's get you clean.", 'th.lostbrush.6':"Eek, that tickles!", 'th.lostbrush.7':"Keep your toothbrush in its place.", 'th.treasure.t':"The Beach Treasure", 'th.treasure.1':"They found a big chest on the beach.", 'th.treasure.2':"Heave-ho! Why won't it open?", 'th.treasure.3':"{boss}'s sticky lock! You can't open it!", 'th.treasure.4':"Sparkle, brush it clean!", 'th.treasure.5':"The chest was full of shiny stars!", 'th.treasure.6':"{pet}, let's share them!", 'th.sleepy.t':"The Sleepy Night", 'th.sleepy.1':"Yawn… I just want to sleep.", 'th.sleepy.2':"Wait! Brush first, then bed!", 'th.sleepy.3':"Germs appeared in {pet}'s dream!", 'th.sleepy.4':"Party time! Let's play between the teeth!", 'th.sleepy.5':"Eek! I'm up! I'll brush!", 'th.sleepy.6':"Brush brush, all together!", 'th.sleepy.7':"Now only sweet dreams.", 'th.race.t':"The Big Race", 'th.race.1':"I'm faster! Let's race!", 'th.race.2':"Ready… go!", 'th.race.3':"Huff, puff, so fast!", 'th.race.4':"{pet}'s secret plan!", 'th.race.5':"Sparkle wins!", 'th.race.6':"Germ, let's brush together next time!", 'th.hiccup.t':"Stop the Hiccups", 'th.hiccup.1':"Hic! Hic!", 'th.hiccup.2':"I'll scare them away. Boo!", 'th.hiccup.3':"Hic!", 'th.hiccup.4':"How about some water?", 'th.hiccup.5':"Ta-da! I'm {boss}!", 'th.hiccup.6':"Oh? My hiccups stopped!", 'th.hiccup.7':"Thank you! Let me make you sparkly clean.", 'th.hiccup.8':"The germ became a sparkly friend.", 'th.king.t':"The King with a Toothache", 'th.king.1':"King {pet} of the castle was crying.", 'th.king.2':"My tooth hurts… I only ate candy.", 'th.king.3':"I'll show you how to brush!", 'th.king.4':"Up and down, brush brush!", 'th.king.5':"Back teeth, back and forth!", 'th.king.6':"Wow, it doesn't hurt anymore!", 'th.king.7':"The king gave Sparkle a star medal.", 'th.swamp.t':"The Swamp Germ Gang", 'th.swamp.1':"One germ lived in the swamp.", 'th.swamp.2':"I'll call all my friends!", 'th.swamp.3':"Too many! I can't do it alone.", 'th.swamp.4':"{pet} will help too!", 'th.swamp.5':"Together they made a giant bubble.", 'th.swamp.6':"Together, we finished in no time!", 'th.song.t':"The Song Thief", 'th.song.1':"All the songs in the forest were gone.", 'th.song.2':"All the songs are mine! Hee hee.", 'th.song.3':"Give the songs back!", 'th.song.4':"Let's sing an even happier song!", 'th.song.5':"Brush brush, swish swish, sparkle sparkle!", 'th.song.6':"Oops, I can't stop dancing…!", 'th.song.7':"Songs filled the forest again.", 'th.moon.t':"Cleaning the Moon", 'th.moon.1':"Tonight germs got stuck on the Moon's face.", 'th.moon.2':"Let's fly up and clean the Moon!", 'th.moon.3':"Have a good trip!", 'th.moon.4':"The Moon smiled bright again!", 'th.moon.5':"That's why the Moon is so bright tonight.", 'th.next':"Tomorrow: \"{title}\"!", 'th.eggName':"Egg buddy", 'th.name':'Sparkle Theater', 'th.ep':'Episode {n}', 'th.skip':'Skip ▶', 'th.open':'Sparkle Theater! Episode {n}: {title}', 'settings.theater':'Sparkle Theater after brushing', 'settings.theaterTest':'🎬 Preview Sparkle Theater (test)', 'sp.today':'Special day!', 'sp.new':'A new video is here!', 'sp.say':'Special video today! {title}', 'sp.sound':'🔊 Sound on', 'sp.check':'Checking video files…', 'sp.checkOk':'All {n} videos found', 'sp.checkBad':'{ok} of {n} videos OK · missing: {list}', 'sp.checkNone':'No videos found. Use "📥 Add special videos" in Parent settings to add them', 'sp.load':'📥 Add special videos (pick several)', 'sp.clear':'Remove added videos', 'sp.stored':'Videos on this phone: {n}', 'sp.part2':'Part 2', 'sp.checkSum':'Ready: {ep} episodes · {sh} shorts', 'sp.epN':'Special Episode {n}', 'sp.storedNone':'No videos added (looking in the specials folder)', 'sp.saving':'Adding videos… one moment', 'sp.saved':'Added {n} video files!', 'sp.savedSome':'Added {ok} video files ({fail} could not be saved: too big or not enough space)', 'sp.cleared':'Added videos removed', 'sp.notVideo':'Please choose video files (mp4)', 'sp.fail':'Could not play: {file}', 'settings.special':'Special videos (special days, once a week)', 'settings.specialTest':'🎞 Preview special video (test)',
  'th.end':['Sparkly clean, the end!', 'See you tomorrow!', 'Another story next time!', "Let's brush again, bye!"], 'th.endName':'{name}, you were the best! See you soon!',
})};

// ▼ 받는 언어팩 샘플 (출시 때는 서버에 JSON 파일로 올리고 url만 적으면 됨)
const SAMPLE_JA = { meta:{ code:'ja', name:'日本語', dir:'ltr', tts:'ja-JP', version:45,
    font:{ family:"'Kosugi Maru'", url:'fonts/kosugi-maru.css' } },
  strings: withItems('ja', {
  'app.title':"Let's Brush",
  'home.title':'キラリと\nシャカシャカ!',
  'home.todayNone':'きょうは まだ みがいてないよ',
  'home.todayCount_other':'きょう {n}かい みがいたよ ✨',
  'home.min':'{n}分',
  'home.start':'はみがきスタート!',
  'home.closet':'👕 キラリのきせかえ',
  'closet.title':'キラリのきせかえ',
  'closet.none':'なし', 'closet.selected':'えらんだよ', 'closet.wearing':'きてるよ', 'closet.owned':'もってるよ',
  'closet.eventTag':'{icon} イベント',
  'closet.buyQ':'ほし{cost}こで {item}を かう?',
  'closet.buyOk':'かう!', 'closet.buyCancel':'またこんど',
  'closet.needMore':'ほしが あと{n}こ ひつようだよ! はみがきして あつめよう',
  'closet.got':'{item}を ゲット!',
  'closet.eventBanner':'{icon} {event}の ふくを きてるよ',
  'slot.head':'ぼうし', 'slot.eyes':'めがね', 'slot.neck':'くび', 'slot.back':'せなか', 'slot.hand':'て',
  'brush.back':'ホームへ',
  'zone.ul':'うえの ひだり', 'zone.ur':'うえの みぎ', 'zone.lr':'したの みぎ', 'zone.ll':'したの ひだり',
  'audio.title':'おと', 'audio.voice':'🗣 こえ', 'audio.music':'🎵 おんがく', 'audio.sfx':'🔔 こうかおん', 'audio.track':'きょく', 'audio.close':'とじる', 'audio.preview':'🎵 きいてみる', 'audio.load':'📂 スマホの おんがくを つかう', 'audio.loaded':'よみこんだ きょく: {name}', 'audio.loadOk':'おんがくを よみこんだよ!', 'audio.loadTemp':'このブラウザに ほぞん できませんでした。つぎは もういちど よみこんでね', 'audio.tooBig':'ファイルが おおきすぎます (30MBまで)', 'audio.notAudio':'おんがくの ファイルを えらんでね', 'audio.noCustom':'さきに おんがくを よみこんでね', 'bgm.sunny':'きらきら おひさま', 'bgm.march':'げんきな こうしん', 'bgm.calm':'ふんわり メロディ', 'bgm.bubbly':'ぶくぶく あわ', 'bgm.space':'うちゅう りょこう', 'bgm.custom':'📂 わたしの おんがく', 'slot.brush':'はぶらし', 'closet.using':'つかってる', 'settings.voicePick':'こえを えらぶ', 'settings.voiceAuto':'じどう', 'settings.voiceTone':'はなしかた', 'tone.kind':'やさしく', 'tone.normal':'ふつう', 'tone.bright':'げんきに', 'settings.voiceTry':'🔊 きいてみる', 'rec.title':'🎙 じぶんの こえに かえる', 'rec.note':'● で ろくおん、■ で おわり (さいだい15びょう)。もういちど ろくおんすると まえの ろくおんは きえます。', 'rec.mine':'じぶんの こえ', 'rec.device':'きかいの こえ', 'rec.saved':'ろくおん できたよ!', 'rec.cleared':'ろくおんを けしたよ', 'rec.noMic':'マイクが つかえません。マイクを きょかしてください', 'rec.l.prep':'はみがきこの あんない', 'rec.l.say.cheers':'おうえん', 'rec.l.done':'みがけたよ', 'rec.bossAny':'ボスばいきん',  'say.start':'スタート!',
  'say.ul':'うえの ひだりを ゴシゴシ!', 'say.ur':'こんどは うえの みぎ!', 'say.lr':'したの みぎを シャカシャカ!', 'say.ll':'さいご! したの ひだり!',
  'say.cheers':['じょうずだね!', 'すみずみまで ゴシゴシ!', 'あわが ブクブク!', 'はが わらってるよ!', 'さいこう! そのちょうし!'],
  'say.hurry':'もうすこし! あと10びょう!', 'say.pause':'ちょっと おやすみ…', 'say.resume':'また シャカシャカ!',
  'settings.dur':'はみがきの じかん', 'dur.60':'1分', 'dur.120':'2分', 'dur.180':'3分', 'dur.rec':'{t}(おすすめ)',
  'pet.waitNew':'あたらしい ともだちが もうすぐ もっと くるよ! それまで はみがきで ほしを おおめに あげるね ⭐', 'rw.petWait':'🐾 ともだちを まつ ほし', 'settings.medNote':'🦷 このアプリは はみがきの しゅうかんを たすける あそびです。しかの しんりょうの かわりには なりません。ていきけんしんは はいしゃさんで うけてください。', 'bk.remind':'⚠️ 1かげつ いじょう バックアップして いません。スマホを かえたり ブラウザの きろくを けすと ほし・ペットが きえることが あります。したで バックアップを ほぞんしてください。', 'home.tipIOS':'👨‍👩‍👧 おうちの方へ: きろくを まもるため ホーム画面に ついかしてください。Safari の したの きょうゆう ボタン(□↑)から「ホーム画面に追加」を えらびます。Safari だけで つかうと、しばらく ひらかないと きろくが きえることが あります。', 'home.tipAnd':'👨‍👩‍👧 おうちの方へ: きろくを まもるため ホーム画面に ついかしてください。Chrome の みぎうえの メニュー(⋮)から「ホーム画面に追加」か「アプリを インストール」を おします。', 'home.tipInstall':'いま ついか', 'home.tipLater':'あとで',
  'sub.title':'⭐ ピカピカ クラブ', 'sub.parent':'👨‍👩‍👧 おうちの方へ', 'sub.introH':'ピカピカ クラブ {d}日間 むりょう たいけん', 'sub.p1':'ペット {pets}しゅるい ぜんぶ (きほんは {fp})', 'sub.p2':'ちずの しま {isl}こと ヒーローの へんしん', 'sub.p3':'ピカピカ スペシャル どうが', 'sub.p4':'まいつき あたらしい ともだちと ふく', 'sub.free':'たいけんしなくても はみがき・クイズ・ほし・きほんの ペット {fp}しゅるいは ずっと むりょうです。', 'sub.consent':'たいけんが おわると まいつき {price}が じどうで けっさいされます。おわる 24じかん まえまでに ストアで かいやくすれば おかねは かかりません。ないようを かくにんし、どういします。', 'sub.start':'{d}日間 むりょうで はじめる', 'sub.later':'きほんばんで つかう', 'sub.started':'ピカピカ クラブ たいけん スタート! {d}日間 ぜんぶ ひらきます ⭐', 'sub.stTrial':'むりょう たいけんちゅう · のこり {d}日', 'sub.stActive':'かにゅうちゅう。ありがとう! 💛', 'sub.stFree':'きほんばんを つかっています', 'sub.stNone':'まだ たいけんまえです', 'sub.goTrial':'{d}日間 むりょう たいけんについて', 'sub.goSub':'かにゅうする (まいつき {price})', 'sub.restore':'こうにゅうを ふっきゅう', 'sub.manage':'かんり · かいやく', 'sub.manageHow':'かんりと かいやくは App Store · Google Play の サブスクリプション メニューから できます', 'sub.restoreNone':'ふっきゅうできる かにゅうが ありません', 'sub.restoreOk':'かにゅうを ふっきゅうしました', 'sub.storeOnly':'かにゅうは ストアの アプリで できます', 'sub.remind':'👨‍👩‍👧 おうちの方へ: ピカピカ クラブの むりょう たいけんは {d}日後に おわります。つづけない ばあいは ストアで かいやくしてください。そのままだと まいつき {price}が けっさいされます。', 'sub.ok':'わかりました', 'sub.mapLock':'🔒 つぎの しまは まだ ひらいていません', 'sub.keep':'たいけん・かにゅうちゅうに もらった ペットと ふくは おわっても のこります。', 'sub.terms':'りようきやく', 'sub.contact':'おといあわせ (メール)', 'sub.privacy':'プライバシー ポリシー', 'sub.needAgree':'さきに どういの らんを おしてください', 'sub.devSim':'💳 Simulate subscription: {s}', 'sub.devEnd':'💳 End trial (today)', 'sub.devAct':'💳 Set subscribed', 'sub.devReset':'💳 Reset subscription', 'sub.on':'on', 'sub.off':'off',
  'kids.title':'👧 こども', 'kids.add':'＋ こどもを ふやす', 'kids.max':'こどもは 3にんまで です', 'kids.who':'だれが みがく?', 'kids.now':'いま', 'kids.del':'けす', 'kids.delQ':'{name}の ほし・ペット・きろくを ぜんぶ けしますか? もとに もどせません。', 'kids.delOk':'けす', 'kids.cancel':'やめる', 'kids.note':'こどもごとに ほし・ペット・クイズ・たんじょうび・みがく てを べつに ほぞんします。おと・ことば・じかんは いっしょです。こどもを おすと きりかわります。', 'kids.added':'あたらしい こどもを つくりました。なまえと たんじょうびを いれてください', 'kids.n1':'ひとりめ', 'kids.n2':'ふたりめ', 'kids.n3':'さんにんめ', 'kids.switched':'{name}の ばんだよ',
  'quiz.title':'🧮 きょうの クイズ', 'quiz.btn':'🧮 きょうの クイズ', 'quiz.close':'また こんど', 'quiz.okBtn':'やったー!', 'quiz.ok':'ピンポーン! せいかい!', 'quiz.no':'もう いちど えらんでみよう!', 'quiz.reward':'ほし {n}こと スタンプを もらったよ!', 'quiz.petWon':'スタンプが ぜんぶ たまったよ! あたらしい ともだちが くるよ!', 'quiz.allPets':'スタンプが ぜんぶ たまったよ! ほしを 5こ もらったよ!',
  'quiz.count':'{item}は いくつ かな?', 'quiz.add':'{a} たす {b} は いくつ かな?', 'quiz.sub':'{a} ひく {b} は いくつ かな?', 'quiz.mul':'{a} かける {b} は いくつ かな?', 'quiz.item.apple':'りんご', 'quiz.item.star':'ほし', 'quiz.item.fish':'さかな', 'quiz.item.strawberry':'いちご', 'quiz.item.balloon':'ふうせん', 'quiz.item.duck':'ひよこ',
  'settings.quiz':'はみがきの あとに きょうの クイズ(1もん)', 'settings.bdayYear':'ねん', 'settings.year':'{n}年', 'settings.ageIs':'{n}さい · クイズと はみがきこの りょうが ねんれいに あうよ', 'settings.ageHint':'うまれた としを いれると ねんれいに あった クイズに なるよ',
  'gate.title':'👨‍👩‍👧 おとなの かくにん', 'gate.note':'せっていは おとなが ひらいてね。こたえを おしてね', 'gate.q':'{a} × {b} = ?', 'gate.wrong':'こたえが ちがうよ。あたらしい もんだいだよ', 'gate.cancel':'とじる',
  'stop.q':'はみがきを やめる?', 'stop.keep':'つづける', 'stop.quit':'やめる',
  'done.title':'ピカピカに なった!',
  'done.msgs':['むしばきんが にげていったよ!', 'はが キラキラ ひかってるよ!', 'はみがき チャンピオンだ!', 'おくちが さっぱり!'],
  'done.canBuy':'ほしで あたらしい きせかえが かえるよ!',
  'done.gain':'⭐ +1 · ほし {n}こ',
  'done.home':'ホームへ', 'done.closet':'👕 きせかえする',
  'toast.firstGift':'はじめての プレゼント! ほし3こ ⭐', 'toast.testStars':'テスト: ほし+10', 'toast.testGift':'テスト: ほし{n}こ ⭐',
  'toast.packInstalled':'{lang}パックを ダウンロードしたよ!', 'toast.packFail':'ダウンロードできなかったよ',
  'settings.title':'せってい', 'settings.language':'ことば', 'settings.packs':'ほかの ことばパック',
  'settings.get':'ダウンロード', 'settings.getting':'ダウンロードちゅう…', 'settings.installed':'インストールずみ',
  'settings.country':'すんでいる くに', 'settings.eventsHere':'このくにの イベント: {list}', 'settings.eventsNone':'このくにの イベントは まだないよ',
  'settings.voice':'こえで おうえん', 'settings.voiceNote':'このことばの こえが ないと おとが でないよ',
  'settings.eventLook':'イベントの日は とくべつな ふくを きる',
  'settings.devTitle':'🔧 開発テスト(リリース前に削除)', 'settings.eventPreview':'イベントの プレビュー', 'settings.auto':'じどう(きょうの ひづけ)', 'tech.short':'こきざみに まえうしろ(きほん)', 'tech.circle':'ちいさな まる(フォーンズ法)', 'tech.roll':'はらう(ローリング法)', 'tech.shortNote':'はぶらしを はぐきに ななめに あてて、こきざみに やさしく まえうしろに みがきます。かむところは まえうしろに こすります。', 'tech.circleNote':'ちいさな まるを かくように みがきます。ちいさな こどもでも まねしやすいです。かむところは まえうしろに こすります。', 'tech.rollNote':'はぐきから はの さきへ はらいます。うえの はは うえから したへ、したの はは したから うえへ。かむところは まえうしろに こすります。', 'hint.short.outer':'↔ はぐきに ななめに、こきざみに', 'hint.short.inner':'↔ こきざみに', 'hint.circle':'⭕ ちいさな まるを かいて', 'hint.roll.u':'⬇ うえから したへ はらう', 'hint.roll.l':'⬆ したから うえへ はらう', 'hint.chew':'↔ まえうしろに ゴシゴシ', 'settings.parentTitle':'👨‍👩‍👧 おうちの方へ', 'settings.technique':'みがきかた', 'settings.hand':'はみがきする て', 'hand.right':'みぎて', 'hand.left':'ひだりて', 'settings.kidName':'こどもの なまえ', 'settings.kidNamePh':'れい: ゆい', 'settings.bday':'たんじょうび', 'settings.bdayNone':'なし', 'settings.month':'{n}がつ', 'settings.day':'{n}にち', 'event.birthday.name':'たんじょうび', 'event.birthday.greet':'おたんじょうび おめでとう!', 'event.birthday.greetName':'{name}、おたんじょうび おめでとう!', 'event.birthday.cheer':'たんじょうびは はも ピカピカに!', 'done.gift':'🎁 はこを おして あけてね!', 'gift.say':'プレゼントが とどいたよ。あけてみる?', 'gift.got':'ほしを {n}こ もらったよ!', 'rw.base':'はみがき できた', 'rw.noPause':'さいごまで とまらずに', 'rw.streak':'{n}にち れんぞく', 'rw.twice':'きょう 2かい みがいた', 'rw.event':'{event}の プレゼント', 'rw.bday':'🎂 たんじょうび プレゼント', 'rw.lucky':'🍀 ラッキー スター!', 'rw.total':'ぜんぶで', 'bgm.birthday':'ハッピー バースデー', 'settings.age':'こどもの ねんれい', 'age.u3':'3さい みまん', 'age.3p':'3さい いじょう', 'settings.prep':'はみがきまえの はみがきこ あんない', 'prep.step':'じゅんび', 'prep.go':'じゅんび できた!', 'prep.title.rice':'はみがきこは\nおこめ ひとつぶ', 'prep.title.pea':'はみがきこは\nグリンピース ひとつぶ', 'prep.sayWater':'はぶらしは ぬらさなくて いいよ。', 'prep.saySpit':'おわったら はみがきこは のみこまずに、ぺっと だそうね。', 'prep.tip.paste':'これくらい', 'prep.tip.water':'みずは いらないよ', 'prep.tip.spit':'のみこまずに ぺっ!', 'tongue.title':'ボーナス! したも ゴシゴシ', 'tongue.say':'したを ぺろっと だして、おくから まえに やさしく なでてね。', 'tongue.done':'したも きれいに なったよ!', 'tongue.skip':'スキップ', 'tongue.tip':'おくまで いれすぎないで やさしくね', 'settings.tongue':'さいごに したみがき', 'prep.listen':'🔊 もういちど きく', 'done.spit':'はみがきこは のみこまずに ぺっ!', 'prep.cmp.rice':'おこめ ひとつぶ', 'prep.cmp.pea':'グリンピース ひとつぶ', 'prep.say.rice':'はみがきこは おこめ ひとつぶ ぶん', 'prep.say.pea':'はみがきこは グリンピース ひとつぶ ぶん', 'prep.note':'👨‍👩‍👧 フッ素いりの はみがきこを つかい、おうちの人が つけてあげてください。おわったら のみこまずに ぺっと だそう。はぶらしは ぬらさなくても だいじょうぶ。',  'settings.parentTip':'9さいごろまでは ひとりで すみずみまで みがくのは むずかしいです。しあげみがきを してあげてください。', 'done.parentTip':'👨‍👩‍👧 しあげみがきは おうちの人と', 'surface.outer':'そとがわ', 'surface.chew':'おくばの かむところ', 'surface.inner':'おくばの うちがわ', 'surface.front':'まえばの うちがわ', 'say.front':'まえばの うらは はぶらしを たてて うえしたに!', 'hint.front':'↕ はぶらしを たてて うえしたに', 'say.chew':'おくばの かむところを しっかり!', 'say.bossTease':'あっ、{boss}が きた! おくばに ばいきんを かくすって!', 'say.raid':'{boss}が おくばに ばいきんを かくしたよ! もういちど ゴシゴシ!', 'rw.raid':'かくれ ばいきん {n}ひき みつけた', 'say.inner':'こんどは おくばの うちがわ!', 'say.sparkle':'ピカピカ!',
  'say.boss':'{boss}が でた! あと10びょう!', 'say.bossDown':'{boss}を やっつけた! ピカピカ!', 'done.germs_other':'ばいきんを {n}ひき やっつけた!',
  'pet.egg':'ふしぎな たまご', 'pet.penguin':'あかちゃんペンギン', 'pet.whale':'あかちゃんクジラ', 'pet.fox':'あかちゃんキツネ', 'pet.panda':'あかちゃんパンダ',
  'pet.penguin.def':'ペンペン', 'pet.whale.def':'チャプ', 'pet.fox.def':'コン', 'pet.panda.def':'パンパン',
  'pet.eggLeft_other':'たまごが あったかく なった! あと{n}かい みがくと うまれるよ。', 'pet.growLeft_other':'{name}が そだってるよ! あと{n}かいで ぐんと おおきく なるよ。', 'pet.seeTomorrow':'また あしたね!',
  'pet.restEgg':'たまごは きょうは すやすや。あした また みがいてね!', 'pet.restPet':'{name}は きょうは すやすや。あした また いっしょに みがこう!',
  'pet.hatched':'じゃーん! {sp}が うまれたよ!', 'pet.nameAsk':'なまえを つける?', 'pet.ok':'いいよ!',
  'pet.grew':'{name}が ぐんと そだったよ!', 'pet.adult':'{name}が おとなに なったよ!', 'pet.newSpecialEgg':'キラキラの とくべつな たまごが きたよ!', 'book.legend':'でんせつの ペット', 'pet.giftRow':'🐾 きょう 2かい みがいたので ペットの プレゼント!', 'pet.giftTitle':'プレゼントから {sp}が でてきたよ!', 'pet.palChange':'かえる', 'pet.allDone':'ぜんぶの ペットを あつめたよ! すごい!', 'home.twiceHint':'もう1かい みがくと ペットの プレゼント! 🎁',
  'pet.eggSay_other':'なにが うまれるかな? あと{n}かい!', 'pet.says':['いっしょに みがこう!', 'きょうも ピカピカ!', 'ばいきん たいじに いこう!', 'いっしょだと たのしいね!'],
  'settings.petTest':'🥚 たまご・ペット +1 (テスト)', 'settings.eggTest':'🌈 とくべつな たまご (テスト)', 'settings.star100':'⭐ ほし 100こ (テスト)', 'settings.bookAll':'📖 ずかんを ぜんぶ ひらく (テスト)', 'settings.petAll':'🐾 ペットを ぜんぶ もらう (テスト)', 'toast.petAll_other':'ペットを {n}ひき もらったよ!', 'settings.reset':'🔄 さいしょから (リセット)',
  'reset.q':'ほし・ペット・ずかん・ちず・きせかえ・はみがきの きろくが ぜんぶ きえます。なまえ・おと・ことばの せっていは そのままです。リセットしますか?', 'reset.ok':'リセット', 'reset.cancel':'やめる', 'toast.star100':'ほしを 100こ もらったよ!', 'toast.bookAll':'ずかんを ぜんぶ ひらいたよ!',
  'slot.weekly':'🆕 こんしゅう', 'slot.hero':'🦸 へんしん', 'closet.mapTag':'🗺 しまの プレゼント', 'closet.mapSay':'ぼうけんの ちずで おしろに つくと ひとつずつ もらえるよ!',
  'closet.weekLeft_other':'こんしゅうの しなものだよ。あと{n}にちで あたらしく なるよ! (かったものは ずっと きみの もの)',
  'hero.set.space':'うちゅう たいいん', 'hero.set.knight':'ゆうかんな きし', 'hero.set.dino':'きょうりゅう たいちょう', 'hero.set.fairy':'はなの ようせい', 'hero.set.mermaid':'にんぎょ たんけんたい', 'hero.set.unicorn':'にじいろ ユニコーン', 'hero.need_other':'あと{n}こで へんしん!', 'hero.wear':'おして へんしん!', 'hero.wearing':'✨ へんしんちゅう',
  'hero.go':'へんしん! {set} キラリ!', 'hero.how':'ぼうけんの ちずの おしろに つくたびに へんしんの ふくが ひとつ とどくよ。5つ ぜんぶ きると へんしん!', 'map.gotHero':'ぼうけんの プレゼント: {item}! きせかえ → へんしん で みてね', 'map.heroDone':'へんしん セットが そろったよ! へんしん!',
  'pet.heroAdult':'へんしん! {name}が おとなに なったよ!', 'pet.treat':'🍪 おやつ ⭐1', 'pet.trickBtn':'げいを みる', 'pet.fedToday':'💤 おやつは また あした', 'pet.yum':['もぐもぐ!', 'おいしい!', 'もぐもぐ、ありがとう!'],
  'pet.loveUp':'{name}が よろこんでるよ! ハート {h}こ', 'pet.loveHint':'おやつを 5かい あげると げいを おぼえるよ (1にち 1かい)', 'pet.trickLearn':'{name}が げいを おぼえたよ: {trick}!', 'pet.trickShow':'{name}の げい: {trick}!',
  'trick.spin':'くるくる', 'trick.jump':'ジャンプ', 'trick.dance':'ダンス', 'trick.flip':'ちゅうがえり',
  'pet.eggFeat_other':'こんげつの ともだちの たまごだよ! あと{n}かい!', 'pet.hatchedFeat':'🌟 こんげつの ともだち {sp}が うまれたよ!', 'pet.featEgg':'🌟 こんげつの ともだちの たまご', 'book.feat':'🌟 こんげつの ともだち',
  'book.team':'チーム', 'team.done':'がったい!', 'team.go':'{team} がったい!', 'team.say':'{team} がったい! {names} みんなで ひとつの チーム!', 'team.star_other':'ほし {n}こ プレゼント!', 'rw.team':'🤝 {team} がったい', 'team.need':'{names}を ぜんぶ あつめると がったい!',
  'team.jungle':'ジャングル チーム', 'team.ice':'こおりの くに チーム', 'team.ocean':'うみ チーム', 'team.sky':'そら チーム', 'team.farm':'まきば チーム', 'team.safari':'サファリ チーム', 'team.dino':'きょうりゅう チーム', 'team.bug':'むし チーム', 'team.dog':'わんわん チーム', 'team.cat':'にゃんにゃん チーム', 'team.forest':'もり チーム', 'team.legend':'でんせつ チーム',
  'hab.home':'わたしの へや', 'hab.safari':'サファリ', 'hab.bug':'むしの にわ', 'hab.bird':'とりの もり', 'hab.sea':'すいぞくかん', 'hab.swamp':'はちゅうるいの ぬま', 'hab.castle':'でんせつの しろ',
  'hab.who.safari':'りくの どうぶつの いえだよ', 'hab.who.bug':'むしの ともだちの いえだよ', 'hab.who.bird':'とりの ともだちの いえだよ', 'hab.who.sea':'みずの なかの ともだちの いえだよ', 'hab.who.swamp':'カエル・カメ・きょうりゅうの いえだよ', 'hab.who.castle':'でんせつの ペットの いえだよ',
  'hab.build':'{cost}こで たてる', 'hab.buildOk':'たてる', 'hab.built':'{name}を たてたよ! ともだちが ひっこしてきたよ!', 'hab.noPets':'まだ ここに すむ ともだちが いないよ。たまごで あおうね!', 'hab.buildFirst':'さきに いえを たてよう!',
  'hab.goalBtn':'🎯 もくひょうに する', 'hab.goalOn':'🎯 いまの もくひょう', 'hab.count_other':'ともだち {n}ひき',
  'hab.d.hd_pond':'みずたまり', 'hab.d.hd_rock':'ライオンいわ', 'hab.d.hd_balloon':'ききゅう', 'hab.d.hd_honey':'はちみつの つぼ', 'hab.d.hd_mushhouse':'きのこの いえ', 'hab.d.hd_sunflower':'ひまわり', 'hab.d.hd_birdhouse':'とりの いえ', 'hab.d.hd_swing':'ブランコ', 'hab.d.hd_rainbow':'にじ',
  'hab.d.hd_chest':'たからばこ', 'hab.d.hd_coral':'さんご', 'hab.d.hd_sub':'ちびせんすいかん', 'hab.d.hd_lotus':'はす', 'hab.d.hd_log':'まるたの はし', 'hab.d.hd_fireflies':'ほたる', 'hab.d.hd_moon':'おつきさま', 'hab.d.hd_rbridge':'にじの はし', 'hab.d.hd_treasure':'たからの やま',
  'goal.left_other':'🎯 {name}まで ほし あと{n}こ!', 'goal.ready':'🎯 {name}を たてられるよ! ペットの がめんで たててね!', 'goal.set':'🎯 もくひょう: {name}',
  'settings.heroAll':'🦸 へんしん セット ぜんぶ (テスト)', 'toast.heroAll':'へんしん セットを ぜんぶ もらったよ!',
  'wk.name':'{color} {shape}', 'wk.c.red':'あかい', 'wk.c.orange':'オレンジの', 'wk.c.yellow':'きいろい', 'wk.c.green':'みどりの', 'wk.c.blue':'あおい', 'wk.c.purple':'むらさきの', 'wk.c.pink':'ピンクの',
  'wk.s.beanie':'ニットぼう', 'wk.s.beret':'ベレーぼう', 'wk.s.tophat':'シルクハット', 'wk.s.catband':'ねこみみ', 'wk.s.bearband':'くまみみ', 'wk.s.hearteyes':'ハートめがね', 'wk.s.squareeyes':'しかくめがね', 'wk.s.goggles':'ゴーグル',
  'wk.s.stripescarf':'しましまマフラー', 'wk.s.tie':'ネクタイ', 'wk.s.pearls':'ビーズの ネックレス', 'wk.s.starcape':'ほしの マント', 'wk.s.bflywings':'ちょうちょの はね', 'wk.s.lolli':'ペロペロキャンディ', 'wk.s.icecream':'アイスクリーム', 'wk.s.starballoon':'ほしの ふうせん',
  'ptab.friends':'ともだち', 'ptab.dress':'ペットの きせかえ', 'ptab.room':'へやの もようがえ', 'pet.stage1':'あかちゃん', 'pet.stage2':'こども', 'pet.stage3':'おとな', 'pet.look':'すがた', 'look.1':'あかちゃん', 'look.2':'こども', 'look.3':'おとな', 'pet.lookSet':'{name}が {look}の すがたに なったよ!',
  'pet.palNow':'いっしょに いるよ', 'pet.palBtn':'つれていく', 'pet.palSet':'{name}と いっしょだよ!', 'pet.namePh':'なまえ', 'pet.noPet':'たまごが かえったら ペットを きせかえ できるよ!',
  'pet.eggCard':'たまご', 'pet.specialEgg':'とくべつな たまご', 'pet.eggSpecial_other':'キラキラの とくべつな たまご! あと{n}かいで あえるよ!', 'pet.adultSpecial':'{name}が おとなに なったよ! とくべつな たまごが きたよ!',
  'pet.unicorn':'あかちゃんユニコーン', 'pet.dragon':'あかちゃんドラゴン', 'pet.unicorn.def':'ほしこ', 'pet.dragon.def':'ドラドラ',
  'pcol.base':'ふつう', 'pcol.mint':'ミント', 'pcol.pink':'ピンク', 'pcol.lav':'ラベンダー', 'pcol.sky':'そらいろ', 'pcol.gold':'きんいろ', 'pcol.rainbow':'にじいろ', 'pcol.galaxy':'ぎんが',
  'book.colorsFound':'あつめた いろ: {list}', 'book.special':'とくべつな たまごからだけ うまれるよ!',
  'pitem.head_bow':'リボン', 'pitem.head_crown':'ちいさな おうかん', 'pitem.head_flower':'はなの ピン', 'pitem.head_party':'パーティーぼうし', 'pitem.neck_scarf':'マフラー', 'pitem.neck_bowtie':'ちょうネクタイ',
  'pitem.neck_bell':'すずの くびわ', 'pitem.face_glasses':'まるい めがね', 'pitem.face_sun':'サングラス', 'pitem.face_heart':'ハートの ほっぺ', 'settings.mapTest':'🗺 ちず +1 (テスト)',
  'boss.candy':'ベタベタ キャンディ ボス', 'boss.choco':'チョコ ボス', 'boss.soda':'シュワシュワ ソーダ ボス', 'boss.jelly':'グミ ボス', 'boss.cookie':'クッキー ボス', 'boss.juice':'ジュース ボス', 'boss.king':'むしば キング',
  'boss.candy.tip':'キャンディは はに ながく くっつくよ。たべたら みずで ゆすごう。', 'boss.choco.tip':'チョコを たべた ひは もっと ていねいに みがこう。', 'boss.soda.tip':'ソーダより おみずが はに やさしいよ。',
  'boss.jelly.tip':'グミは はの あいだに はさまるよ。あいだも しっかり!', 'boss.cookie.tip':'クッキーの かけらは おくばの みぞに かくれるよ。', 'boss.juice.tip':'ジュースは ストローで のむと はに つきにくいよ。', 'boss.king.tip':'あまいものを たくさん たべると むしば キングが くるよ。1にち 2かい はみがき!',
  'say.call':'{name}!', 'say.cheersName':['{name}、じょうずだね!', '{name}、ばいきんが にげていくよ!', '{name}の はが ピカピカに なってきた!'],
  'combo':'{n}れんぞく!', 'rw.gold':'✨ きんの ばいきん!',
  'germ.0':'みどり ばいきん', 'germ.1':'むらさき ばいきん', 'germ.2':'オレンジ ばいきん', 'germ.3':'あお ばいきん', 'germ.gold':'きんの ばいきん',
  'germ.0.tip':'はぐきの ちかくに くっつくよ。', 'germ.1.tip':'おくばの みぞに かくれるよ。', 'germ.2.tip':'はの あいだに はさまるよ。', 'germ.3.tip':'まえばの うらに かくれるよ。', 'germ.gold.tip':'たまにしか でない めずらしい ばいきん!',
  'pet.hatchedShiny':'わあ! でんせつの {sp}が うまれたよ! とっても めずらしい ともだち!', 'pet.shiny':'キラキラ {sp}',
  'streak.info':'{n}にち れんぞく はみがき ちゅう! おまもり クッションが {s}こ あるよ。1にち わすれても きろくを まもってくれるよ。', 'streak.buy':'ほし {cost}こで クッションを かう', 'streak.close':'とじる',
  'streak.bought':'おまもり クッションを かったよ!', 'streak.saved':'クッションが れんぞく きろくを まもったよ!', 'rw.mile':'🔥 {n}にち れんぞく たっせい!', 'rw.mileShield':'🔥 {n}にち れんぞく! クッションも もらったよ',
  'greet.am':'おはよう!', 'greet.pm':'ねる まえに ピカピカに しよう!', 'greet.we':'しゅうまつは はの ようせいが あそびに きたよ!', 'rw.fairy':'🧚 はの ようせいの プレゼント',
  'next.am':'あしたの あさは だれが くるかな?', 'next.pm':'こんやは だれが くるかな?', 'next.say.am':'あしたの あさは どの ボスが くるかな? また あおうね!', 'next.say.pm':'こんやは どの ボスが くるかな? ねる まえに また あおうね!',
  'menu.closet':'きせかえ', 'menu.room':'ペット', 'menu.book':'ずかん', 'menu.map':'ちず',
  'book.title':'ずかん', 'book.boss':'ボス', 'book.germ':'ばいきん', 'book.pet':'ペット', 'book.notYet':'まだ あってないよ。はみがきすると あえるよ!', 'book.count':'{n}かい',
  'room.title':'ペット', 'room.empty':'たまごが かえったら ペットが ここに すむよ!', 'room.placed':'おいてる',
  'room.wall_sky':'そらの かべがみ', 'room.wall_stars':'ほしの かべがみ', 'room.wall_hearts':'ハートの かべがみ', 'room.wall_stripes':'しましまの かべがみ', 'room.win_round':'まるい まど', 'room.poster':'にじの え',
  'room.lamp_star':'ほしの ランプ', 'room.rug_round':'まるい ラグ', 'room.rug_rainbow':'にじの ラグ', 'room.bed_basket':'かごの ベッド', 'room.bed_cloud':'くもの ベッド',
  'room.toy_ball':'ボール', 'room.toy_blocks':'つみき', 'room.toy_duck':'アヒル', 'room.plant_pot':'はなの うえきばち', 'room.plant_cactus':'サボテン',
  'map.title':'ぼうけんの ちず', 'map.left_other':'おしろまで あと {n}マス!', 'map.isl.candy':'キャンディ じま', 'map.isl.choco':'チョコの もり', 'map.isl.bubble':'あわの うみ', 'map.isl.star':'ほしぞら うちゅう', 'map.isl.rainbow':'にじの おしろ',
  'map.arrive':'{isl}に ついたよ! つぎの しまが ひらいたよ!', 'rw.castle':'🏰 {isl} とうちゃく', 'map.giftRoom':'へやの プレゼント: {item}!', 'map.rest':'きょうは ちずで おやすみ。あした また すすもう!', 'map.locked':'まだ ひらいてないよ', 'map.reward':'おしろの プレゼント', 'map.got':'もらった プレゼント', 'map.cleared':'とうちゃく! この しまは クリア!', 'map.lockedSay':'まえの しまを クリアすると ひらくよ!', 'map.eggGift':'とくべつな たまご (でんせつの ペット)', 'map.lap':'{n}しゅうめ', 'map.how':'はみがき 1かいで 1マス (1にち 3マスまで)。しまは 7マス! おしろで へんしんの ふくが もらえるよ!', 'map.specialEgg':'にじの おしろの プレゼント! とくべつな たまごだよ!', 'map.specialEggNext':'にじの おしろの プレゼント! いまの たまごが うまれたら、つぎは とくべつな たまご!', 'bk.title':'💾 きろくの バックアップ', 'bk.note':'ほし・ペット・れんぞく きろくを ファイルに ほぞんします。あたらしい スマホで よみこむと つづきから あそべます。(どうが・おんがく・ろくおんは はいりません)', 'bk.save':'💾 きろくを ファイルに ほぞん', 'bk.load':'📂 きろくの ファイルを よみこむ', 'bk.last':'さいごの バックアップ: {d}', 'bk.never':'まだ バックアップ していません', 'bk.saved':'ほぞん しました: {name}', 'bk.bad':'キラリの きろく ファイルでは ありません', 'bk.fail':'よみこめませんでした', 'bk.q':'{at} の きろくに かえますか? いまの きろくは おきかわります。', 'bk.ok':'よみこむ',
  'stamp.hold':'しあげみがきの あと ながおしで ほめスタンプ 👍', 'stamp.text':'よくできました', 'stamp.say':'ほめスタンプを もらったよ! すごいね!', 'rw.stamp':'👍 ほめスタンプ',
  'week.title':'📅 こんしゅうの きろく', 'week.am':'あさ', 'week.pm':'よる', 'week.sum':'7にちで {n}かい · れんぞく {k}にち · スタンプ {m}こ', 'week.days':['にち', 'げつ', 'か', 'すい', 'もく', 'きん', 'ど'],
  'event.newyear.name':'お正月', 'event.newyear.greet':'あけまして おめでとう!', 'event.newyear.cheer':'ことしも ピカピカ!',
  'event.seollal.name':'ソルラル', 'event.seollal.greet':'ソルラル おめでとう!', 'event.seollal.cheer':'ピカピカの はで いいとしに!',
  'event.childrensday.name':'こどもの日', 'event.childrensday.greet':'こどもの日 おめでとう!', 'event.childrensday.cheer':'きょうの しゅやくは きみだよ!',
  'event.chuseok.name':'チュソク', 'event.chuseok.greet':'たのしい チュソクを!', 'event.chuseok.cheer':'おもちの あとは ゴシゴシ!',
  'event.halloween.name':'ハロウィン', 'event.halloween.greet':'ハッピー ハロウィン!', 'event.halloween.cheer':'むしばの おばけも にげちゃうよ!',
  'event.xmas.name':'クリスマス', 'event.xmas.greet':'メリー クリスマス!', 'event.xmas.cheer':'サンタさんも みてるよ!',
  'th.candy.t':"あめを たべる ばいきん", 'th.candy.1':"キラリは だいじな あめを とっておいたよ。", 'th.candy.2':"もぐもぐ! あめで ぐんぐん おおきく なるぞ!", 'th.candy.3':"たいへん、ばいきんが おおきく なってる!", 'th.candy.4':"はぶらし もってくるね!", 'th.candy.5':"あまいものの あとは ゴシゴシ!", 'th.candy.6':"あまいものを たべたら かならず はみがき。", 'th.lostbrush.t':"きえた はぶらし", 'th.lostbrush.1':"あれ? ぼくの はぶらし どこ?", 'th.lostbrush.2':"はんにんは ちびばいきんだった!", 'th.lostbrush.3':"まてー! かえして!", 'th.lostbrush.4':"{pet}が まえを ふさいだよ!", 'th.lostbrush.5':"みつけた! きれいに してあげる。", 'th.lostbrush.6':"わあ、くすぐったい!", 'th.lostbrush.7':"はぶらしは いつもの ばしょに おこうね。", 'th.treasure.t':"うみの たからばこ", 'th.treasure.1':"うみべで おおきな はこを みつけたよ。", 'th.treasure.2':"よいしょ、よいしょ! あかないなあ。", 'th.treasure.3':"{boss}の ねばねば かぎだ! あかないぞ!", 'th.treasure.4':"キラリ、はぶらしで みがいて!", 'th.treasure.5':"はこの なかは ピカピカの ほしで いっぱい!", 'th.treasure.6':"{pet}、はんぶんこ しよう!", 'th.sleepy.t':"ねむい よる", 'th.sleepy.1':"ふあぁ… もう ねる…", 'th.sleepy.2':"だめだめ、はみがき してから!", 'th.sleepy.3':"{pet}の ゆめに ばいきんが でてきた!", 'th.sleepy.4':"パーティーだ! はの すきまで あそぼう!", 'th.sleepy.5':"わあ! おきる! はみがき する!", 'th.sleepy.6':"ゴシゴシ、みんなで みがこう!", 'th.sleepy.7':"これで いい ゆめが みられるね。", 'th.race.t':"ばいきんと かけっこ", 'th.race.1':"おれの ほうが はやいぞ! しょうぶだ!", 'th.race.2':"よーい… どん!", 'th.race.3':"はあはあ、はやすぎる!", 'th.race.4':"{pet}の ひみつ さくせん!", 'th.race.5':"キラリが 1とう!", 'th.race.6':"ばいきんくん、こんどは いっしょに はみがき しよう!", 'th.hiccup.t':"しゃっくり とまれ", 'th.hiccup.1':"ひっく! ひっく!", 'th.hiccup.2':"おどかして あげる。わっ!", 'th.hiccup.3':"ひっく!", 'th.hiccup.4':"おみず のんで みる?", 'th.hiccup.5':"じゃーん! {boss}だぞ!", 'th.hiccup.6':"あれ? しゃっくりが とまった!", 'th.hiccup.7':"ありがとう! おれいに きれいに してあげる。", 'th.hiccup.8':"ばいきんも ピカピカの ともだちに なったよ。", 'th.king.t':"はが いたい おうさま", 'th.king.1':"おしろの {pet}おうさまが ないていたよ。", 'th.king.2':"はが いたいの… あめばかり たべたから。", 'th.king.3':"はみがきの しかたを おしえます!", 'th.king.4':"うえ したに ゴシゴシ!", 'th.king.5':"おくばは まえうしろに シャカシャカ!", 'th.king.6':"わあ、ぜんぜん いたくない!", 'th.king.7':"おうさまは キラリに ほしの メダルを くれたよ。", 'th.swamp.t':"ぬまの ばいきん だん", 'th.swamp.1':"ぬまに ばいきんが ひとり すんでいたよ。", 'th.swamp.2':"ともだち みんな よんでくる!", 'th.swamp.3':"おおすぎる! ひとりじゃ むり。", 'th.swamp.4':"{pet}も てつだう!", 'th.swamp.5':"ふたりで おおきな あわを つくったよ。", 'th.swamp.6':"いっしょだと すぐ おわったね!", 'th.song.t':"うたどろぼう ばいきん", 'th.song.1':"もりの うたが ぜんぶ きえちゃった。", 'th.song.2':"うたは ぜんぶ おれの もの! へへ。", 'th.song.3':"うたを かえして!", 'th.song.4':"もっと たのしく うたおう!", 'th.song.5':"シャカシャカ ゴシゴシ、ピカピカ!", 'th.song.6':"あれ、おどりが とまらない…!", 'th.song.7':"もりに また うたが ひろがったよ。", 'th.moon.t':"おつきさまを みがこう", 'th.moon.1':"こんやは おつきさまの かおに ばいきんが ついたよ。", 'th.moon.2':"ロケットで おつきさまを みがきに いこう!", 'th.moon.3':"いってらっしゃい!", 'th.moon.4':"おつきさまが また にっこり!", 'th.moon.5':"だから こんやの つきは あかるいんだね。", 'th.next':"あしたは「{title}」の おはなし!", 'th.eggName':"たまごの ともだち", 'th.name':'キラリ げきじょう', 'th.ep':'{n}わ', 'th.skip':'スキップ ▶', 'th.open':'キラリ げきじょう! {n}わ、{title}', 'settings.theater':'はみがきの あとに キラリ げきじょう', 'settings.theaterTest':'🎬 キラリ げきじょう (テスト)', 'sp.today':'きょうは スペシャル!', 'sp.new':'あたらしい どうがが きたよ!', 'sp.say':'きょうは スペシャル どうが! {title}', 'sp.sound':'🔊 おとを だす', 'sp.check':'どうがを しらべて います…', 'sp.checkOk':'どうが {n}こ ぜんぶ OK', 'sp.checkBad':'どうが {n}こ のうち {ok}こ OK · みつからない: {list}', 'sp.checkNone':'どうがが みつかりません。おうちの ひと せっていの「📥 スペシャル どうがを いれる」で いれてください', 'sp.load':'📥 スペシャル どうがを いれる (まとめて)', 'sp.clear':'いれた どうがを ぜんぶ けす', 'sp.stored':'この スマホの どうが: {n}こ', 'sp.part2':'こうへん', 'sp.checkSum':'エピソード {ep}こ · みじかい どうが {sh}こ', 'sp.epN':'スペシャル {n}わ', 'sp.storedNone':'いれた どうがは ありません (specials フォルダを さがします)', 'sp.saving':'どうがを いれて います…', 'sp.saved':'どうが {n}こ いれたよ!', 'sp.savedSome':'どうが {ok}こ いれたよ ({fail}こは ほぞん できません)', 'sp.cleared':'いれた どうがを けしたよ', 'sp.notVideo':'どうが ファイル(mp4)を えらんでね', 'sp.fail':'どうがを さいせい できません: {file}', 'settings.special':'スペシャル どうが (とくべつな ひ・しゅうに 1かい)', 'settings.specialTest':'🎞 スペシャル どうが (テスト)',
  'th.end':['きょうも ピカピカ、おしまい!', 'また あしたね!', 'つぎの おはなしも おたのしみに!', 'また いっしょに みがこうね、バイバイ!'], 'th.endName':'{name}、きょうも さいこう! またね!',
})};

const PACK_CATALOG = [
  { code:'ja', name:'日本語', url:null, sample:SAMPLE_JA }   // url: 'https://내서버/packs/ja.json'
];

const packs = { ko:PACK_KO, en:PACK_EN };
store.get('packs', []).forEach(code => {
  const p = store.get('pack_' + code, null);
  if (p && p.meta && p.strings) packs[code] = p;
});
// 받은 언어팩보다 새 버전이 있으면 갱신 (샘플은 바로 교체, 서버 팩은 나중에 다시 내려받기)
PACK_CATALOG.forEach(e => {
  const p = packs[e.code];
  if (p && e.sample && !e.url && (p.meta.version || 1) < (e.sample.meta.version || 1)){
    packs[e.code] = JSON.parse(JSON.stringify(e.sample));
    store.set('pack_' + e.code, packs[e.code]);
  }
});

const detectLang = () => {
  const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return packs[nav] ? nav : 'en';
};
let lang = store.get('lang', null);
if (!packs[lang]) lang = detectLang();

function lookup(key){
  for (const code of [lang, 'en', 'ko']){
    const p = packs[code];
    if (p && p.strings[key] !== undefined) return p.strings[key];
  }
  return null;
}
function hasBatchim(word){
  const s = String(word || ''), c = s.charCodeAt(s.length - 1) - 0xAC00;
  return c >= 0 && c <= 11171 && c % 28 !== 0;
}
function format(str, params){
  return String(str).replace(/\{(\w+)(?:\|([^}]*))?\}/g, (m, k, opt) => {
    if (opt){ const [a, b] = opt.split('/'); return hasBatchim(params[k]) ? a : b; }
    return params[k] !== undefined ? params[k] : m;
  });
}
// t('키', {n:3, item:'왕관'})
function t(key, params = {}){
  let v = null;
  if (typeof params.n === 'number'){
    try{ v = lookup(key + '_' + new Intl.PluralRules(lang).select(params.n)); }catch(e){}
    if (v === null) v = lookup(key + '_other');
  }
  if (v === null) v = lookup(key);
  if (v === null) return key;
  if (Array.isArray(v)) v = pick(v);
  return format(v, params);
}
const tList = (key) => { const v = lookup(key); return Array.isArray(v) ? v : (v ? [v] : []); };

async function installPack(entry){
  let pack;
  if (entry.url){
    const res = await fetch(entry.url);
    if (!res.ok) throw new Error('download failed');
    pack = await res.json();
  } else {
    await new Promise(r => setTimeout(r, 700));   // 샘플: 받는 흉내
    pack = JSON.parse(JSON.stringify(entry.sample));
  }
  if (!pack.meta || !pack.strings) throw new Error('bad pack');
  packs[pack.meta.code] = pack;
  store.set('pack_' + pack.meta.code, pack);
  const list = store.get('packs', []);
  if (!list.includes(pack.meta.code)) store.set('packs', list.concat(pack.meta.code));
  return pack;
}

const loadedFonts = new Set();
function applyFont(){
  const f = packs[lang].meta.font;
  if (f && f.url && !loadedFonts.has(f.url)){
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = f.url;
    document.head.appendChild(l); loadedFonts.add(f.url);
  }
  document.documentElement.style.setProperty('--font', f ? f.family : "'Jua'");
}
