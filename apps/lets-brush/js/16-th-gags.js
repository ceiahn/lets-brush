'use strict';

/* =========================================================
   아침 한 컷 극장 (v0.51.0): 아침(오후 3시 전) 양치 뒤에 트는 10초 안팎 짧은 웃음 30개
     window.TH_GAGS 에 넣음. 차례대로 돌고 (bj_theater.gk), 30개를 다 보면 처음부터
     글: thg.<id>.t (제목) · thg.<id>.1 ~ (말풍선). 이야기와 달리 세균 물리치기(defeat)는 가끔만
     만들 때: 말풍선 2 ~ 3개, 움직임 한두 개, 마지막에 웃음 한 방
   ========================================================= */
addText({
  ko:{
    'thg.yawn.t':'하품 한 번', 'thg.yawn.1':'하아아아암~', 'thg.yawn.2':'입 벌린 김에 치카치카!',
    'thg.bedhair.t':'까치집 머리', 'thg.bedhair.1':'거울아 거울아, 내 머리 왜 이래?', 'thg.bedhair.2':'머리는 까치집, 이는 반짝반짝!',
    'thg.sneeze.t':'에취!', 'thg.sneeze.1':'코가 간질간질…', 'thg.sneeze.2':'에취! 거품이 퐁퐁퐁!',
    'thg.twins.t':'거울 속 친구', 'thg.twins.1':'따라 하지 마!', 'thg.twins.2':'네가 따라 한 거야!', 'thg.twins.3':'…우리 둘 다 반짝반짝하네.',
    'thg.paste.t':'치약 폭발', 'thg.paste.1':'치약을 꾸욱~', 'thg.paste.2':'으앗, 너무 많이 나왔다!', 'thg.paste.3':'치약은 콩알만큼!',
    'thg.sock.t':'이건 칫솔이 아니야', 'thg.sock.1':'{pet}, 칫솔 좀 가져다줘!', 'thg.sock.2':'여기!', 'thg.sock.3':'이건 양말이잖아!',
    'thg.beard.t':'거품 수염', 'thg.beard.1':'보글보글 거품이 잔뜩!', 'thg.beard.2':'호호호, 거품 할아버지다!',
    'thg.gargle.t':'가글가글', 'thg.gargle.1':'물 한 모금 머금고…', 'thg.gargle.2':'가글가글가글~', 'thg.gargle.3':'퉤! 상쾌하다!',
    'thg.sleepygerm.t':'늦잠 자는 세균', 'thg.sleepygerm.1':'쿨쿨… 아직 밤이지?', 'thg.sleepygerm.2':'좋은 아침! 치카치카 시간이야!', 'thg.sleepygerm.3':'아침부터?!',
    'thg.tonguebrush.t':'혀도 쓱쓱', 'thg.tonguebrush.1':'이만 닦으면 끝일까?', 'thg.tonguebrush.2':'혀도 살살 쓱쓱!', 'thg.tonguebrush.3':'메롱~ 깨끗해졌지?',
    'thg.smile.t':'반짝 미소', 'thg.smile.1':'다 닦았으면 거울 보고…', 'thg.smile.2':'씨익!', 'thg.smile.3':'눈부셔!',
    'thg.banana.t':'미끌!', 'thg.banana.1':'욕실로 출발!', 'thg.banana.2':'미끌!', 'thg.banana.3':'착지 성공! 칫솔도 안 놓쳤어!',
    'thg.stretch.t':'아침 기지개', 'thg.stretch.1':'으쌰, 쭈욱~', 'thg.stretch.2':'나도 쭈욱~', 'thg.stretch.3':'어? 넌 언제 왔어?',
    'thg.weather.t':'오늘의 날씨', 'thg.weather.1':'오늘의 날씨를 알려 드립니다.', 'thg.weather.2':'입안은 세균 구름 조금…', 'thg.weather.3':'양치하고 나면 반짝 맑음!',
    'thg.foamball.t':'거품 풍선', 'thg.foamball.1':'후우~ 거품 풍선!', 'thg.foamball.2':'점점 커진다…', 'thg.foamball.3':'펑!',
    'thg.petbrush.t':'나도 양치', 'thg.petbrush.1':'나도 닦을래!', 'thg.petbrush.2':'칫솔을 거꾸로 잡았어~', 'thg.petbrush.3':'헤헤, 다시!',
    'thg.alarm.t':'따르릉', 'thg.alarm.1':'따르릉! 따르릉!', 'thg.alarm.2':'5분만 더…', 'thg.alarm.3':'양치하면 잠이 확 깨!',
    'thg.milkbeard.t':'우유 수염', 'thg.milkbeard.1':'꿀꺽꿀꺽, 우유 맛있다!', 'thg.milkbeard.2':'푸핫, 하얀 수염이 생겼네!', 'thg.milkbeard.3':'입도 닦고 이도 닦자!',
    'thg.crunch.t':'아삭 사과', 'thg.crunch.1':'아삭!', 'thg.crunch.2':'사과는 이 청소를 도와주는 친구야.', 'thg.crunch.3':'그래도 양치는 칫솔로!',
    'thg.dance.t':'양치 춤', 'thg.dance.1':'위로 쓱쓱!', 'thg.dance.2':'아래로 쓱쓱!', 'thg.dance.3':'빙글빙글 동글동글!',
    'thg.peek.t':'숨바꼭질', 'thg.peek.1':'어디 숨었지?', 'thg.peek.2':'히히, 여기 없지롱!', 'thg.peek.3':'찾았다! 뒤에 있었구나!',
    'thg.counting.t':'열까지 세기', 'thg.counting.1':'하나, 둘, 셋…', 'thg.counting.2':'일곱, 다섯, 열둘?', 'thg.counting.3':'{pet}, 숫자가 엉망이야!',
    'thg.fast.t':'번개 양치', 'thg.fast.1':'번개처럼 슝슝슝!', 'thg.fast.2':'너무 빨라! 천천히 꼼꼼히!', 'thg.fast.3':'헉헉… 알았어.',
    'thg.greet.t':'좋은 아침', 'thg.greet.1':'좋은 아침!', 'thg.greet.2':'좋은 아침!', 'thg.greet.3':'나쁜 아침…',
    'thg.wrongbrush.t':'누구 칫솔?', 'thg.wrongbrush.1':'이거 내 칫솔인가?', 'thg.wrongbrush.2':'그건 아빠 칫솔이야!', 'thg.wrongbrush.3':'칫솔은 꼭 내 것으로!',
    'thg.hat.t':'칫솔 찾기', 'thg.hat.1':'내 칫솔 어디 갔지?', 'thg.hat.2':'네 손에 있잖아!', 'thg.hat.3':'헤헤, 깜빡했다!',
    'thg.skybrush.t':'구름 칫솔', 'thg.skybrush.1':'저 구름 좀 봐!', 'thg.skybrush.2':'칫솔 모양이야!', 'thg.skybrush.3':'하늘도 양치하나 봐!',
    'thg.cat.t':'졸린 친구', 'thg.cat.1':'{pet}, 일어나!', 'thg.cat.2':'쿨…', 'thg.cat.3':'치카치카 소리에 번쩍!',
    'thg.drop.t':'물방울 톡', 'thg.drop.1':'톡, 톡, 톡…', 'thg.drop.2':'수도꼭지는 꼭 잠가요!', 'thg.drop.3':'물도 아껴서 반짝!',
    'thg.highfive.t':'하이파이브', 'thg.highfive.1':'다 닦았다!', 'thg.highfive.2':'하이파이브!', 'thg.highfive.3':'오늘도 멋진 하루 시작!'
  },
  en:{
    'thg.yawn.t':'One Big Yawn', 'thg.yawn.1':'Yaaaawn~', 'thg.yawn.2':"Mouth's open, time to brush!",
    'thg.bedhair.t':'Bed Head', 'thg.bedhair.1':'Mirror, mirror, what happened to my hair?', 'thg.bedhair.2':'Messy hair, sparkly teeth!',
    'thg.sneeze.t':'Achoo!', 'thg.sneeze.1':'My nose is tickly…', 'thg.sneeze.2':'Achoo! Bubbles everywhere!',
    'thg.twins.t':'Mirror Buddy', 'thg.twins.1':'Stop copying me!', 'thg.twins.2':"You're copying ME!", 'thg.twins.3':'…We both sparkle, though.',
    'thg.paste.t':'Toothpaste Explosion', 'thg.paste.1':'Squeeeeze~', 'thg.paste.2':'Whoa, way too much!', 'thg.paste.3':'Just a pea-sized dab!',
    'thg.sock.t':"That's Not a Toothbrush", 'thg.sock.1':'{pet}, can you bring my toothbrush?', 'thg.sock.2':'Here!', 'thg.sock.3':"That's a sock!",
    'thg.beard.t':'Foam Beard', 'thg.beard.1':'So much bubbly foam!', 'thg.beard.2':"Ho ho ho! I'm Grandpa Foam!",
    'thg.gargle.t':'Gargle Gargle', 'thg.gargle.1':'A sip of water…', 'thg.gargle.2':'Gargle gargle gargle~', 'thg.gargle.3':'Ptoo! So fresh!',
    'thg.sleepygerm.t':'The Sleepyhead Germ', 'thg.sleepygerm.1':"Zzz… it's still night, right?", 'thg.sleepygerm.2':'Good morning! Brushing time!', 'thg.sleepygerm.3':'This early?!',
    'thg.tonguebrush.t':'Tongue Too', 'thg.tonguebrush.1':'Are teeth all I need to brush?', 'thg.tonguebrush.2':'Gently brush your tongue too!', 'thg.tonguebrush.3':'Bleh~ all clean!',
    'thg.smile.t':'Sparkle Smile', 'thg.smile.1':'All brushed? Look in the mirror and…', 'thg.smile.2':'Grin!', 'thg.smile.3':'So bright!',
    'thg.banana.t':'Slip!', 'thg.banana.1':'Off to the bathroom!', 'thg.banana.2':'Whoops!', 'thg.banana.3':'Nailed the landing! Still holding my toothbrush!',
    'thg.stretch.t':'Morning Stretch', 'thg.stretch.1':'Stretch~', 'thg.stretch.2':'Me too, stretch~', 'thg.stretch.3':'Huh? When did you get here?',
    'thg.weather.t':"Today's Weather", 'thg.weather.1':"Here's today's weather.", 'thg.weather.2':'A few germ clouds in your mouth…', 'thg.weather.3':'After brushing: sparkly and clear!',
    'thg.foamball.t':'Foam Balloon', 'thg.foamball.1':'Whoo~ a foam balloon!', 'thg.foamball.2':'Bigger and bigger…', 'thg.foamball.3':'POP!',
    'thg.petbrush.t':'Me Too!', 'thg.petbrush.1':'I want to brush too!', 'thg.petbrush.2':'Holding it upside down~', 'thg.petbrush.3':'Hehe, try again!',
    'thg.alarm.t':'Ring Ring', 'thg.alarm.1':'Ring ring! Ring ring!', 'thg.alarm.2':'Five more minutes…', 'thg.alarm.3':'Brushing wakes you right up!',
    'thg.milkbeard.t':'Milk Mustache', 'thg.milkbeard.1':'Gulp gulp, yummy milk!', 'thg.milkbeard.2':'Pfft, a white mustache!', 'thg.milkbeard.3':'Wipe your mouth and brush your teeth!',
    'thg.crunch.t':'Crunchy Apple', 'thg.crunch.1':'Crunch!', 'thg.crunch.2':'Apples help clean your teeth.', 'thg.crunch.3':'But you still need your toothbrush!',
    'thg.dance.t':'Brushing Dance', 'thg.dance.1':'Brush up!', 'thg.dance.2':'Brush down!', 'thg.dance.3':'Round and round!',
    'thg.peek.t':'Hide and Seek', 'thg.peek.1':'Where did it hide?', 'thg.peek.2':"Hee hee, I'm not here!", 'thg.peek.3':'Found you! Right behind me!',
    'thg.counting.t':'Counting to Ten', 'thg.counting.1':'One, two, three…', 'thg.counting.2':'Seven, five, twelve?', 'thg.counting.3':'{pet}, the numbers are all mixed up!',
    'thg.fast.t':'Lightning Brushing', 'thg.fast.1':'Zoom zoom, fast as lightning!', 'thg.fast.2':'Too fast! Slow and careful!', 'thg.fast.3':'Huff… okay.',
    'thg.greet.t':'Good Morning', 'thg.greet.1':'Good morning!', 'thg.greet.2':'Good morning!', 'thg.greet.3':'Bad morning…',
    'thg.wrongbrush.t':"Whose Toothbrush?", 'thg.wrongbrush.1':'Is this my toothbrush?', 'thg.wrongbrush.2':"That's Dad's toothbrush!", 'thg.wrongbrush.3':'Always use your own!',
    'thg.hat.t':'Where Is My Toothbrush?', 'thg.hat.1':'Where did my toothbrush go?', 'thg.hat.2':"It's in your hand!", 'thg.hat.3':'Hehe, I forgot!',
    'thg.skybrush.t':'Toothbrush Cloud', 'thg.skybrush.1':'Look at that cloud!', 'thg.skybrush.2':"It's shaped like a toothbrush!", 'thg.skybrush.3':'Even the sky brushes!',
    'thg.cat.t':'Sleepy Buddy', 'thg.cat.1':'{pet}, wake up!', 'thg.cat.2':'Zzz…', 'thg.cat.3':'The brushing sound woke them right up!',
    'thg.drop.t':'Drip Drop', 'thg.drop.1':'Drip, drip, drip…', 'thg.drop.2':'Always turn off the tap!', 'thg.drop.3':'Save water and sparkle!',
    'thg.highfive.t':'High Five', 'thg.highfive.1':'All brushed!', 'thg.highfive.2':'High five!', 'thg.highfive.3':"Let's start a great day!"
  }
});
(function(){
  const S = (c) => { c.place(c.hero, 34, 5); c.place(c.pet, 14, 5); };
  const twin = (c, x) => { const m = c.prop(c.hero.querySelector('.th-in').innerHTML, 32, x, 5, 3, 250 / 220); c.flip(m, true); return m; };
  window.TH_GAGS = (window.TH_GAGS || []).concat([
    { id:'yawn', bg:'bath', setup:S, run: async (c) => {
      await Promise.all([c.line(c.hero, 'thg.yawn.1'), c.pose(c.hero, P_YAWN, 900), c.cam(34, 22, 1.5, 700)]);
      const br = c.prop(TH_P.brushNew, 12, 14, 20, 5, .45); c.snd('whoosh');
      await c.go(br, 34, 22, 500, 'ease-in'); br.remove(); c.cam(50, 50, 1, 300).catch(() => {});
      c.face(c.hero, 'surprised'); c.brush(c.hero, true);
      await Promise.all([c.line(c.pet, 'thg.yawn.2'), c.pose(c.hero, P_SHAKE, 240, 4)]);
      c.brush(c.hero, false); c.face(c.hero, 'happy');
    } },
    { id:'bedhair', bg:'bath', setup:S, run: async (c) => {
      const zz = c.prop(TH_P.zzz, 14, 34, 46, 5);
      await Promise.all([c.line(c.hero, 'thg.bedhair.1'), c.pose(zz, P_WIG, 300, 3)]);
      zz.remove(); c.face(c.hero, 'happy'); c.snd('ding', 5); c.burst({ x:34, y:30 }, 6);
      await c.line(c.hero, 'thg.bedhair.2');
    } },
    { id:'sneeze', bg:'bath', setup:S, run: async (c) => {
      c.face(c.pet, 'shy');
      await Promise.all([c.line(c.pet, 'thg.sneeze.1'), c.pose(c.pet, P_YAWN, 800)]);
      c.snd('sneeze'); c.face(c.hero, 'surprised');
      [0, 1, 2, 3, 4].forEach(i => setTimeout(() => c.floatProp(TH_P.bubble, 5, 10 + i * 9, 18), i * 120));
      await Promise.all([c.line(c.pet, 'thg.sneeze.2'), c.pose(c.pet, P_SQ, 300, 2)]);
      c.face(c.hero, 'happy');
    } },
    { id:'twins', bg:'bath', setup(c){ c.place(c.hero, 32, 5); c.place(c.pet, 10, 5); }, run: async (c) => {
      const m = twin(c, 68);
      c.face(c.hero, 'angry');
      await Promise.all([c.line(c.hero, 'thg.twins.1'), c.pose(c.hero, P_HOP, 340, 2), c.pose(m, P_HOP, 340, 2)]);
      await Promise.all([c.line(m, 'thg.twins.2'), c.pose(c.hero, P_SHAKE, 240, 3), c.pose(m, P_SHAKE, 240, 3)]);
      c.face(c.hero, 'happy'); c.snd('ding', 5);
      await c.line(c.hero, 'thg.twins.3');
    } },
    { id:'paste', bg:'bath', setup:S, run: async (c) => {
      const tb = c.prop(TH_P.tube, 20, 56, 20, 4, .4);
      await Promise.all([c.line(c.hero, 'thg.paste.1'), c.pose(tb, P_SQ, 300, 2)]);
      const bl = c.prop(TH_P.blob, 10, 66, 18, 5, .5); c.snd('slip'); c.face(c.hero, 'surprised');
      await Promise.all([c.line(c.hero, 'thg.paste.2'), c.morph(bl, 'scale(3)', 800)]);
      bl.remove(); const pe = c.prop(TH_P.pea, 6, 66, 22, 5, .75);
      await Promise.all([c.line(c.pet, 'thg.paste.3'), c.pose(pe, P_TINY, 300, 3)]);
      c.face(c.hero, 'happy');
    } },
    { id:'sock', bg:'room', setup:S, run: async (c) => {
      await c.line(c.hero, 'thg.sock.1');
      const sk = c.prop(TH_P.sock, 9, 14, 22, 5, 1.2);
      await Promise.all([c.go(c.pet, 22, 5, 500), c.go(sk, 26, 22, 500), c.pose(c.pet, P_HOP, 300, 2)]);
      await c.line(c.pet, 'thg.sock.2');
      c.face(c.hero, 'surprised'); c.snd('boing');
      await Promise.all([c.line(c.hero, 'thg.sock.3'), c.pose(c.hero, P_BIG, 600)]);
      c.face(c.hero, 'happy');
    } },
    { id:'beard', bg:'bath', setup:S, run: async (c) => {
      c.brush(c.hero, true);
      [0, 1, 2].forEach(i => setTimeout(() => c.floatProp(TH_P.bubble, 4, 30 + i * 4, 30), i * 200));
      await Promise.all([c.line(null, 'thg.beard.1'), c.pose(c.hero, P_SHAKE, 240, 4)]);
      c.brush(c.hero, false);
      const bd = c.prop(TH_P.pillow, 14, 34, 24, 5, .45); c.face(c.hero, 'happy'); c.snd('fanfare');
      await Promise.all([c.line(c.hero, 'thg.beard.2'), c.pose(c.hero, P_HOP, 380, 2), c.pose(bd, P_HOP, 380, 2)]);
    } },
    { id:'gargle', bg:'bath', setup:S, run: async (c) => {
      const cp = c.prop(TH_P.cup, 8, 46, 20, 5);
      await c.line(c.hero, 'thg.gargle.1'); cp.remove();
      c.snd('blow');
      [0, 1, 2].forEach(i => setTimeout(() => c.floatProp(TH_P.bubble, 3, 33 + i * 2, 34), i * 250));
      await Promise.all([c.line(c.hero, 'thg.gargle.2'), c.pose(c.hero, P_SHAKE, 200, 6)]);
      c.face(c.hero, 'happy'); c.snd('pop');
      await c.line(c.hero, 'thg.gargle.3');
    } },
    { id:'sleepygerm', bg:'cave', setup:S, run: async (c) => {
      const b = c.boss(70, 5, 12), zz = c.prop(TH_P.zzz, 8, 76, 26, 4);
      await Promise.all([c.line(b, 'thg.sleepygerm.1'), c.pose(zz, P_WIG, 300, 3), c.pose(b, P_YAWN, 900)]);
      zz.remove(); c.face(c.hero, 'happy');
      await c.line(c.hero, 'thg.sleepygerm.2');
      c.snd('boing');
      await Promise.all([c.line(b, 'thg.sleepygerm.3'), c.go(b, 76, 30, 300, 'ease-out')]);
      await c.go(b, 125, 5, 700, 'ease-in');
    } },
    { id:'tonguebrush', bg:'bath', setup:S, run: async (c) => {
      await c.line(c.hero, 'thg.tonguebrush.1');
      const tg = c.prop(TH_P.tongue, 8, 34, 18, 5, .7); c.brush(c.hero, true);
      await Promise.all([c.line(c.pet, 'thg.tonguebrush.2'), c.pose(tg, P_TINY, 300, 3)]);
      c.brush(c.hero, false); c.face(c.hero, 'wink'); c.snd('ding', 5);
      await c.line(c.hero, 'thg.tonguebrush.3'); tg.remove();
    } },
    { id:'smile', bg:'bath', setup:S, run: async (c) => {
      await Promise.all([c.line(null, 'thg.smile.1'), c.cam(34, 22, 1.6, 700)]);
      c.face(c.hero, 'happy'); c.snd('magic'); c.burst({ x:34, y:28 }, 10);
      await c.line(c.hero, 'thg.smile.2');
      c.face(c.pet, 'surprised');
      await Promise.all([c.cam(50, 50, 1, 400), c.line(c.pet, 'thg.smile.3'), c.pose(c.pet, P_SHAKE, 220, 3)]);
    } },
    { id:'banana', bg:'room', setup(c){ c.place(c.hero, 16, 5); c.place(c.pet, 4, 5); }, run: async (c) => {
      const bn = c.prop(TH_P.banana, 8, 46, 5, 4, .6);
      await Promise.all([c.line(c.hero, 'thg.banana.1'), c.go(c.hero, 46, 5, 900), c.pose(c.hero, P_WALK, 300, 3)]);
      c.snd('slip'); c.face(c.hero, 'surprised');
      await Promise.all([c.line(null, 'thg.banana.2'), c.pose(c.hero, P_SPIN, 600), c.go(bn, 80, 5, 600)]);
      c.face(c.hero, 'happy'); c.snd('fanfare');
      await Promise.all([c.line(c.hero, 'thg.banana.3'), c.pose(c.hero, P_BIG, 600)]);
    } },
    { id:'stretch', bg:'room', setup:S, run: async (c) => {
      await Promise.all([c.line(c.hero, 'thg.stretch.1'), c.pose(c.hero, P_YAWN, 900)]);
      const b = c.boss(66, 5, 12);
      await Promise.all([c.line(b, 'thg.stretch.2'), c.pose(b, P_YAWN, 900)]);
      c.face(c.hero, 'surprised'); c.snd('boing');
      await Promise.all([c.line(c.hero, 'thg.stretch.3'), c.pose(c.hero, P_BIG, 600)]);
      await c.go(b, 125, 5, 600, 'ease-in');
      c.face(c.hero, 'happy');
    } },
    { id:'weather', bg:'sky', setup:S, run: async (c) => {
      await c.line(c.pet, 'thg.weather.1');
      const cl = c.prop(TH_P.cloudGray, 18, 68, 50, 3, .6);
      await Promise.all([c.line(c.pet, 'thg.weather.2'), c.pose(cl, P_SHAKE, 260, 3)]);
      c.restyle(cl, TH_P.sun); c.snd('magic'); c.face(c.hero, 'happy');
      await Promise.all([c.line(c.pet, 'thg.weather.3'), c.pose(cl, P_BIG, 700)]);
    } },
    { id:'foamball', bg:'bath', setup:S, run: async (c) => {
      const bb = c.prop(TH_P.bubble, 6, 42, 30, 5);
      c.snd('blow');
      await Promise.all([c.line(c.hero, 'thg.foamball.1'), c.go(bb, 48, 32, 800)]);
      await Promise.all([c.line(c.pet, 'thg.foamball.2'), c.morph(bb, 'scale(3.4)', 1200)]);
      c.snd('pop'); c.burst(bb, 9); bb.remove(); c.face(c.hero, 'surprised');
      await Promise.all([c.line(null, 'thg.foamball.3'), c.quake(300)]);
      c.face(c.hero, 'happy');
    } },
    { id:'petbrush', bg:'bath', setup:S, run: async (c) => {
      const br = c.prop(TH_P.brushNew, 10, 18, 18, 5, .45);
      await Promise.all([c.line(c.pet, 'thg.petbrush.1'), c.pose(c.pet, P_HOP, 360, 2)]);
      c.flip(br, true); c.snd('boing');
      await Promise.all([c.line(c.hero, 'thg.petbrush.2'), c.pose(br, P_SHAKE, 240, 3)]);
      c.flip(br, false); c.snd('ding', 5);
      await Promise.all([c.line(c.pet, 'thg.petbrush.3'), c.pose(br, P_SHAKE, 240, 4)]);
    } },
    { id:'alarm', bg:'room', setup:S, run: async (c) => {
      const ck = c.prop(TH_P.clock, 10, 66, 20, 4);
      c.face(c.hero, 'sleep');
      [0, 1, 2].forEach(i => c.snd('ding', i % 2 * 5));
      await Promise.all([c.line(ck, 'thg.alarm.1'), c.pose(ck, P_SHAKE, 160, 8)]);
      await c.line(c.hero, 'thg.alarm.2');
      c.face(c.hero, 'surprised'); c.brush(c.hero, true);
      await Promise.all([c.line(c.pet, 'thg.alarm.3'), c.pose(c.hero, P_SHAKE, 240, 4)]);
      c.brush(c.hero, false); c.face(c.hero, 'happy');
    } },
    { id:'milkbeard', bg:'room', setup:S, run: async (c) => {
      const mk = c.prop(TH_P.milk, 8, 46, 22, 5, 1.4);
      await Promise.all([c.line(c.hero, 'thg.milkbeard.1'), c.pose(mk, P_TINY, 300, 3)]);
      mk.remove(); const ms = c.prop(TH_P.pea, 8, 34, 25, 5, .75); c.face(c.hero, 'surprised');
      await c.line(c.pet, 'thg.milkbeard.2');
      ms.remove(); c.face(c.hero, 'happy'); c.brush(c.hero, true);
      await Promise.all([c.line(c.hero, 'thg.milkbeard.3'), c.pose(c.hero, P_SHAKE, 240, 3)]);
      c.brush(c.hero, false);
    } },
    { id:'crunch', bg:'room', setup:S, run: async (c) => {
      const ap = c.prop(TH_P.apple, 9, 46, 22, 5);
      c.snd('pop');
      await Promise.all([c.line(c.hero, 'thg.crunch.1'), c.pose(ap, P_SHAKE, 200, 2)]);
      await c.line(c.pet, 'thg.crunch.2');
      ap.remove(); c.face(c.hero, 'happy'); c.brush(c.hero, true);
      await Promise.all([c.line(c.hero, 'thg.crunch.3'), c.pose(c.hero, P_SHAKE, 240, 3)]);
      c.brush(c.hero, false);
    } },
    { id:'dance', bg:'bath', setup:S, run: async (c) => {
      c.snd('music'); c.face(c.hero, 'happy'); c.brush(c.hero, true);
      await Promise.all([c.line(c.hero, 'thg.dance.1'), c.pose(c.hero, P_HOP, 380, 2), c.pose(c.pet, P_HOP, 380, 2)]);
      await Promise.all([c.line(c.hero, 'thg.dance.2'), c.pose(c.hero, P_SQ, 380, 2), c.pose(c.pet, P_SQ, 380, 2)]);
      await Promise.all([c.line(c.hero, 'thg.dance.3'), c.pose(c.hero, P_SPIN, 700), c.pose(c.pet, P_SPIN, 700)]);
      c.brush(c.hero, false);
    } },
    { id:'peek', bg:'room', setup:S, run: async (c) => {
      const b = c.boss(22, 5, 9);
      await Promise.all([c.line(c.hero, 'thg.peek.1'), c.pose(c.hero, P_LOOK, 800)]);
      await Promise.all([c.line(b, 'thg.peek.2'), c.pose(b, P_HOP, 300, 2)]);
      c.flip(c.hero, true); c.face(c.hero, 'surprised'); c.snd('boing');
      await c.line(c.hero, 'thg.peek.3');
      c.flip(c.hero, false); c.face(c.hero, 'happy');
      await c.go(b, -20, 5, 600, 'ease-in');
    } },
    { id:'counting', bg:'bath', setup:S, run: async (c) => {
      c.brush(c.hero, true);
      for (let i = 0; i < 3; i++) c.snd('ding', i * 2);
      await Promise.all([c.line(c.pet, 'thg.counting.1'), c.pose(c.hero, P_SHAKE, 240, 4)]);
      c.face(c.pet, 'shy');
      await Promise.all([c.line(c.pet, 'thg.counting.2'), c.pose(c.pet, P_LOOK, 700)]);
      c.brush(c.hero, false); c.face(c.hero, 'happy');
      await c.line(c.hero, 'thg.counting.3');
    } },
    { id:'fast', bg:'bath', setup:S, run: async (c) => {
      c.brush(c.hero, true); c.snd('swish');
      await Promise.all([c.line(c.hero, 'thg.fast.1'), c.pose(c.hero, P_SHAKE, 90, 14)]);
      c.face(c.pet, 'surprised');
      await Promise.all([c.line(c.pet, 'thg.fast.2'), c.pose(c.pet, P_BIG, 600)]);
      c.face(c.hero, 'shy');
      await Promise.all([c.line(c.hero, 'thg.fast.3'), c.pose(c.hero, P_SHAKE, 400, 3)]);
      c.brush(c.hero, false);
    } },
    { id:'greet', bg:'sky', setup:S, run: async (c) => {
      const sn = c.prop(TH_P.sun, 16, 80, 64, 2);
      c.face(c.hero, 'happy');
      await Promise.all([c.line(c.hero, 'thg.greet.1'), c.pose(c.hero, P_HOP, 380, 2)]);
      await Promise.all([c.line(sn, 'thg.greet.2'), c.pose(sn, P_BIG, 600)]);
      const b = c.boss(70, 5, 11);
      c.snd('thud');
      await Promise.all([c.line(b, 'thg.greet.3'), c.pose(b, P_SQ, 400, 2)]);
      await c.go(b, 125, 5, 700, 'ease-in');
    } },
    { id:'wrongbrush', bg:'bath', setup:S, run: async (c) => {
      const br = c.prop(TH_P.brushTired, 12, 48, 22, 5, .45);
      await Promise.all([c.line(c.hero, 'thg.wrongbrush.1'), c.pose(br, P_TINY, 300, 2)]);
      c.face(c.hero, 'surprised'); c.snd('beep');
      await Promise.all([c.line(c.pet, 'thg.wrongbrush.2'), c.pose(c.pet, P_HOP, 340, 2)]);
      c.restyle(br, TH_P.brushNew); c.snd('magic'); c.face(c.hero, 'happy');
      await c.line(c.hero, 'thg.wrongbrush.3');
    } },
    { id:'hat', bg:'room', setup:S, run: async (c) => {
      await Promise.all([c.line(c.hero, 'thg.hat.1'), c.pose(c.hero, P_LOOK, 800)]);
      c.snd('boing');
      await Promise.all([c.line(c.pet, 'thg.hat.2'), c.pose(c.pet, P_HOP, 340, 2)]);
      c.face(c.hero, 'shy'); c.brush(c.hero, true);
      await c.line(c.hero, 'thg.hat.3');
      c.brush(c.hero, false); c.face(c.hero, 'happy');
    } },
    { id:'skybrush', bg:'sky', setup:S, run: async (c) => {
      const cl = c.prop(TH_P.cloudWhite, 24, 66, 58, 2, .6);
      await Promise.all([c.line(c.hero, 'thg.skybrush.1'), c.cam(66, 62, 1.4, 700)]);
      c.restyle(cl, TH_P.brushNew); c.snd('magic');
      await c.line(c.pet, 'thg.skybrush.2');
      c.face(c.hero, 'happy');
      await Promise.all([c.cam(50, 50, 1, 400), c.line(c.hero, 'thg.skybrush.3'), c.pose(cl, P_SHAKE, 260, 4)]);
    } },
    { id:'cat', bg:'room', setup:S, run: async (c) => {
      c.face(c.pet, 'sleep');
      await c.line(c.hero, 'thg.cat.1');
      await c.line(c.pet, 'thg.cat.2');
      c.brush(c.hero, true); c.snd('swish');
      await c.pose(c.hero, P_SHAKE, 220, 4);
      c.face(c.pet, 'surprised'); c.brush(c.hero, false);
      await Promise.all([c.line(null, 'thg.cat.3'), c.pose(c.pet, P_BIG, 600)]);
      c.face(c.pet, null);
    } },
    { id:'drop', bg:'bath', setup:S, run: async (c) => {
      const dp = c.prop(TH_P.drop, 3, 62, 46, 5, 1.2);
      for (let i = 0; i < 3; i++){ c.snd('ding', 7); await c.go(dp, 62, 30, 300, 'ease-in'); c.place(dp, 62, 46); }
      await c.line(null, 'thg.drop.1');
      c.face(c.hero, 'determined');
      await Promise.all([c.line(c.pet, 'thg.drop.2'), c.go(c.hero, 56, 5, 600)]);
      dp.remove(); c.face(c.hero, 'happy'); c.snd('magic');
      await c.line(c.hero, 'thg.drop.3');
    } },
    { id:'highfive', bg:'room', setup:S, run: async (c) => {
      c.face(c.hero, 'happy');
      await Promise.all([c.line(c.hero, 'thg.highfive.1'), c.pose(c.hero, P_HOP, 380, 2)]);
      await Promise.all([c.go(c.pet, 24, 5, 400), c.line(c.pet, 'thg.highfive.2')]);
      c.snd('pop'); c.burst({ x:28, y:30 }, 8);
      await Promise.all([c.line(null, 'thg.highfive.3'), c.pose(c.pet, P_HOP, 380, 2), c.pose(c.hero, P_HOP, 380, 2)]);
    } }
  ]);
})();
