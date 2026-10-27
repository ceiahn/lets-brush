'use strict';

/* =========================================================
   반짝이 극장 이야기 묶음 9 (v0.51.0): 10시즌 「친구들」 94 ~ 97 + 마지막 「대축제」 98 ~ 100
     94 두리의 키가 컸어요 · 95 몽이의 비밀 노래 · 96 코코의 소원 · 97 반짝이의 일기
     98 거품 퍼레이드 준비 · 99 이 마을 대축제 · 100 100번째 반짝
   ========================================================= */
addText({
  ko:{
    'th.tall.t':'두리의 키가 컸어요', 'th.tall.1':'두리가 키를 재 보았어요.', 'th.tall.2':'와! 지난번보다 쑥 컸어!', 'th.tall.3':'꼭꼭 씹어 먹고, 이도 잘 닦았거든!',
    'th.tall.4':'흥, 그래 봤자 내가 더 크지!', 'th.tall.5':'튼튼한 이로 꼭꼭 씹으면 몸도 쑥쑥 자라요.',
    'th.msong.t':'몽이의 비밀 노래', 'th.msong.1':'바닷가에서 몽이가 조용히 노래해요.', 'th.msong.2':'이건 아무한테도 안 알려 준 비밀 노래야.', 'th.msong.3':'보글보글 거품, 헹굼 물 쏴아~ 이가 웃어요, 반짝반짝~',
    'th.msong.4':'으으, 그 노래만 들으면 힘이 빠져~', 'th.msong.5':'이제 우리 모두의 노래가 됐어!', 'th.msong.6':'좋아하는 노래와 함께 양치해요.',
    'th.wish.t':'코코의 소원', 'th.wish.1':'밤하늘에 별똥별이 지나가요!', 'th.wish.2':'빨리 소원을 빌자!', 'th.wish.3':'모든 친구들 이가 반짝반짝하게 해 주세요!',
    'th.wish.4':'그 소원은 내가 막아 주지!', 'th.wish.5':'소원은 우리가 매일 닦으면 이뤄져!', 'th.wish.6':'매일 하는 양치가 소원을 이뤄 줘요.',
    'th.diary.t':'반짝이의 일기', 'th.diary.1':'반짝이가 일기를 써요.', 'th.diary.2':'오늘은 아침에 한 번, 밤에 한 번 닦았다.', 'th.diary.3':'일기에 내 이야기도 써 줘!',
    'th.diary.4':'오늘 세균이 찾아왔지만, 쓱쓱 닦아서 이겼다!', 'th.diary.5':'오늘 닦은 것을 기록하면 내일도 하고 싶어져요.',
    'th.paradeprep.t':'거품 퍼레이드 준비', 'th.paradeprep.1':'내일은 거품 퍼레이드 날이에요!', 'th.paradeprep.2':'풍선을 불고 깃발을 달자!', 'th.paradeprep.3':'풍선 다 터뜨려 버려야지!',
    'th.paradeprep.4':'친구들, 같이 막자!', 'th.paradeprep.5':'준비 끝! 내일이 기다려져요.', 'th.paradeprep.6':'함께 준비하면 무엇이든 즐거워요.',
    'th.festival.t':'이 마을 대축제', 'th.festival.1':'이 마을에 대축제가 열렸어요!', 'th.festival.2':'친구들이 모두 모였어!', 'th.festival.3':'축제에 나도 끼워 줘! 이번엔 칫솔도 가져왔어!',
    'th.festival.4':'좋아! 다 같이 치카치카 춤을 추자!', 'th.festival.5':'이 마을 모두가 반짝반짝 웃었어요.', 'th.festival.6':'다 함께 닦으면 마을 전체가 반짝여요.',
    'th.hundred.t':'100번째 반짝', 'th.hundred.1':'오늘은 반짝이 극장 100번째 이야기!', 'th.hundred.2':'와아! 여기까지 함께 와 줘서 고마워!', 'th.hundred.3':'우리도 축하해!',
    'th.hundred.4':'매일매일 닦은 네가 진짜 주인공이야!', 'th.hundred.5':'반짝이 메달을 너에게 줄게!', 'th.hundred.6':'내일도, 그다음 날도 반짝반짝 함께해요!'
  },
  en:{
    'th.tall.t':'Duri Grew Taller', 'th.tall.1':'Time to measure Duri!', 'th.tall.2':'Wow! Taller than last time!', 'th.tall.3':'I chew well and brush my teeth, too!',
    'th.tall.4':"Hmph, I'm still bigger!", 'th.tall.5':'Strong teeth chew well, and your body grows big.',
    'th.msong.t':"Mongi's Secret Song", 'th.msong.1':'On the beach, Mongi sings softly.', 'th.msong.2':"It's a secret song I've never shared.", 'th.msong.3':'Bubble bubble foam, rinse with a whoosh~ teeth are smiling, sparkle sparkle~',
    'th.msong.4':'Ugh, that song makes me so weak~', 'th.msong.5':"Now it's everyone's song!", 'th.msong.6':'Brush along to your favorite song.',
    'th.wish.t':"Coco's Wish", 'th.wish.1':'A shooting star crosses the night sky!', 'th.wish.2':'Quick, make a wish!', 'th.wish.3':"I wish all my friends' teeth would sparkle!",
    'th.wish.4':"I'll stop that wish!", 'th.wish.5':'If we brush every day, the wish comes true!', 'th.wish.6':'Brushing every day makes wishes come true.',
    'th.diary.t':"Sparkle's Diary", 'th.diary.1':'Sparkle is writing a diary.', 'th.diary.2':'Today I brushed once in the morning and once at night.', 'th.diary.3':'Write about me too!',
    'th.diary.4':'A germ came today, but I brushed it away and won!', 'th.diary.5':"Write down your brushing, and you'll want to do it again tomorrow.",
    'th.paradeprep.t':'Getting Ready for the Foam Parade', 'th.paradeprep.1':'Tomorrow is the Foam Parade!', 'th.paradeprep.2':"Let's blow up balloons and hang flags!", 'th.paradeprep.3':"I'll pop every balloon!",
    'th.paradeprep.4':"Friends, let's stop that germ together!", 'th.paradeprep.5':"All ready! Can't wait for tomorrow.", 'th.paradeprep.6':'Getting ready together makes everything fun.',
    'th.festival.t':'The Tooth Town Festival', 'th.festival.1':'A big festival came to Tooth Town!', 'th.festival.2':'All our friends are here!', 'th.festival.3':'Let me join! I brought my toothbrush this time!',
    'th.festival.4':"Great! Let's all do the brushing dance!", 'th.festival.5':'All of Tooth Town smiled bright.', 'th.festival.6':'When everyone brushes, the whole town sparkles.',
    'th.hundred.t':'The 100th Sparkle', 'th.hundred.1':"Today is Sparkle Theater's 100th story!", 'th.hundred.2':'Hooray! Thank you for coming all this way with us!', 'th.hundred.3':'We are celebrating too!',
    'th.hundred.4':'You brushed every day, so YOU are the real star!', 'th.hundred.5':'Here is a Sparkle medal for you!', 'th.hundred.6':"Tomorrow and the day after, let's sparkle together!"
  }
});
(window.TH_EPS = window.TH_EPS || []).push(
  { id:'tall', ep:94, bg:'garden', setup(c){ c.place(c.hero, 22, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const rl = c.prop(TH_P.ruler, 6, 62, 5, 2, 3.5), du = c.cast('duri', 70, 5, 14);
    await Promise.all([c.line(null, 'th.tall.1'), c.cam(66, 24, 1.5, 900)]);
    c.snd('magic');
    await Promise.all([c.line(du, 'th.tall.2'), c.morph(du, 'scale(1.25)', 700), c.pose(rl, P_TINY, 400, 2)]);
    await Promise.all([c.line(du, 'th.tall.3'), c.pose(du, P_HOP, 380, 2)]);
    await c.cam(50, 50, 1, 400);
    const b = c.boss(112, 5, 12); await c.enter(b, 88, 700);
    c.snd('boing'); await Promise.all([c.line(b, 'th.tall.4'), c.pose(b, P_GROW, 500)]);
    c.face(c.hero, 'determined');
    await c.defeat(b);
    c.face(c.hero, 'happy');
    await c.line(null, 'th.tall.5');
  } },
  { id:'msong', ep:95, bg:'sea', setup(c){ c.place(c.hero, 22, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const mg = c.cast('mongi', 66, 8, 16);
    await Promise.all([c.line(null, 'th.msong.1'), c.cam(64, 24, 1.5, 900)]);
    await c.line(mg, 'th.msong.2');
    c.snd('music');
    [0, 1, 2].forEach(i => setTimeout(() => c.floatProp(TH_P.note, 5, 56 + i * 10, 34), i * 400));
    await Promise.all([c.line(mg, 'th.msong.3'), c.pose(mg, P_HOP, 420, 3)]);
    await c.cam(50, 50, 1, 400);
    const b = c.boss(90, 5, 12); c.snd('boing'); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(b, 'th.msong.4'), c.pose(b, P_WIG, 330, 4)]);
    await c.defeat(b, 'song');
    c.face(c.hero, 'happy');
    await Promise.all([c.line(c.hero, 'th.msong.5'), c.pose(c.hero, P_HOP, 400, 2), c.pose(mg, P_HOP, 400, 2)]);
    await c.line(null, 'th.msong.6');
  } },
  { id:'wish', ep:96, bg:'nightsky', setup(c){ c.place(c.hero, 22, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const cc = c.cast('coco', 58, 5, 15), ws = c.prop(TH_P.wishStar, 14, -10, 86, 2, .55);
    c.snd('whoosh');
    await Promise.all([c.line(null, 'th.wish.1'), c.go(ws, 110, 58, 2400, 'ease-in')]);
    c.face(c.hero, 'surprised');
    await Promise.all([c.line(c.hero, 'th.wish.2'), c.pose(c.hero, P_HOP, 380, 2)]);
    c.face(c.hero, null);
    await Promise.all([c.line(cc, 'th.wish.3'), c.cam(58, 22, 1.6, 700)]);
    await c.cam(50, 50, 1, 400);
    const b = c.boss(112, 5, 13); await c.enter(b, 84, 700);
    await Promise.all([c.line(b, 'th.wish.4'), c.pose(b, P_HOP, 300, 3)]);
    c.face(c.hero, 'determined');
    await c.defeat(b);
    c.shower(TH_P.star, 8, 1600, 4).catch(() => {});
    await Promise.all([c.line(cc, 'th.wish.5'), c.pose(cc, P_HOP, 400, 2)]);
    await c.line(null, 'th.wish.6');
  } },
  { id:'diary', ep:97, bg:'room', night:true, setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 12, 5); }, run: async (c) => {
    const bk = c.prop(TH_P.book, 18, 56, 5, 4, .67), pc = c.prop(TH_P.pencil, 12, 60, 14, 5, .33);
    await Promise.all([c.line(null, 'th.diary.1'), c.cam(52, 20, 1.6, 800), c.pose(pc, P_SHAKE, 240, 4)]);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(c.hero, 'th.diary.2'), c.pose(pc, P_SHAKE, 240, 6)]);
    await c.cam(50, 50, 1, 400);
    await Promise.all([c.line(c.pet, 'th.diary.3'), c.pose(c.pet, P_HOP, 380, 3)]);
    const b = c.boss(80, 40, 6); c.snd('boing'); await c.go(b, 76, 5, 500, 'ease-in');
    c.face(c.hero, 'surprised'); await c.pose(b, P_HOP, 300, 2);
    await c.defeat(b);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(c.hero, 'th.diary.4'), c.pose(pc, P_SHAKE, 240, 6)]);
    c.floatProp(TH_P.star, 5, 56, 30);
    await c.line(null, 'th.diary.5');
  } },
  { id:'paradeprep', ep:98, bg:'town', setup(c){ c.place(c.hero, 22, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const pp = c.cast('pipi', 50, 5, 13), du = c.cast('duri', 64, 5, 13);
    await c.line(null, 'th.paradeprep.1');
    const bl = c.many(TH_P.balloon, 4, 52, 6, 2);
    c.snd('pop');
    await Promise.all([c.line(pp, 'th.paradeprep.2'), ...bl.map((x, i) => c.pose(x, P_GROW, 400 + i * 80))]);
    const b = c.boss(112, 5, 12); await c.enter(b, 86, 700);
    await Promise.all([c.line(b, 'th.paradeprep.3'), c.cam(80, 30, 1.5, 600)]);
    c.snd('pop'); bl[3].remove();
    await c.cam(50, 50, 1, 400);
    c.face(c.hero, 'determined');
    await Promise.all([c.line(c.hero, 'th.paradeprep.4'), c.pose(pp, P_HOP, 380, 2), c.pose(du, P_HOP, 380, 2)]);
    await c.defeat(b);
    c.face(c.hero, 'happy');
    await c.line(null, 'th.paradeprep.5');
    await c.line(null, 'th.paradeprep.6');
  } },
  { id:'festival', ep:99, bg:'town', setup(c){ c.place(c.hero, 20, 5); c.place(c.pet, 6, 5); }, run: async (c) => {
    c.snd('fanfare');
    [0, 1, 2].forEach(i => setTimeout(() => c.floatProp(TH_P.firework, 10, 25 + i * 25, 62), i * 380));
    await c.line(null, 'th.festival.1');
    const cast = ['pipi', 'mongi', 'coco', 'duri'].map((n, i) => c.cast(n, 40 + i * 13, 5, 12));
    c.face(c.hero, 'happy');
    await Promise.all([c.line(c.hero, 'th.festival.2'), ...cast.map((a, i) => c.pose(a, P_HOP, 380 + i * 30, 2))]);
    const b = c.boss(112, 5, 12), bm = c.prop(TH_P.brushNew, 12, 112, 18, 4, .45);
    await Promise.all([c.enter(b, 90, 800), c.go(bm, 90, 18, 800)]);
    c.face(c.hero, 'surprised');
    await Promise.all([c.line(b, 'th.festival.3'), c.pose(bm, P_TINY, 300, 3), c.cam(86, 20, 1.6, 600)]);
    await c.cam(50, 50, 1, 400);
    c.face(c.hero, 'happy'); c.brush(c.hero, true); c.snd('music');
    await Promise.all([c.line(c.hero, 'th.festival.4'), c.pose(c.hero, P_SHAKE, 260, 5), c.pose(b, P_WIG, 320, 4), c.pose(bm, P_SHAKE, 260, 5), ...cast.map(a => c.pose(a, P_HOP, 420, 3))]);
    c.brush(c.hero, false);
    c.snd('magic'); c.burst(b, 8);
    c.shower(TH_P.candyStar, 10, 1600, 3).catch(() => {});
    await c.line(null, 'th.festival.5');
    await c.line(null, 'th.festival.6');
  } },
  { id:'hundred', ep:100, bg:'sky', setup(c){ c.place(c.hero, 50, 5); c.place(c.pet, 32, 5); }, run: async (c) => {
    c.snd('fanfare');
    [0, 1, 2, 3].forEach(i => setTimeout(() => c.floatProp(TH_P.firework, 10, 18 + i * 22, 64), i * 350));
    await Promise.all([c.line(null, 'th.hundred.1'), c.cam(50, 60, 1.3, 1000)]);
    await c.cam(50, 50, 1, 400);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(c.hero, 'th.hundred.2'), c.pose(c.hero, P_HOP, 400, 3)]);
    const cast = [['pipi', 8], ['mongi', 18], ['coco', 72], ['duri', 86]].map(([n, x]) => c.cast(n, x, 5, 13));
    c.snd('pop');
    await Promise.all([c.line(null, 'th.hundred.3'), ...cast.map(a => c.pose(a, P_HOP, 380, 3))]);
    await Promise.all([c.line(c.pet, 'th.hundred.4'), c.pose(c.pet, P_BIG, 600)]);
    const md = c.prop(TH_P.medal, 12, 50, 60, 6, 1.4);
    c.snd('magic'); c.burst(md, 10);
    await Promise.all([c.line(c.hero, 'th.hundred.5'), c.cam(50, 60, 1.8, 700), c.pose(md, P_BIG, 700)]);
    await c.cam(50, 50, 1, 400);
    c.shower(TH_P.star, 14, 2000, 4).catch(() => {});
    await Promise.all([c.line(null, 'th.hundred.6'), c.pose(c.hero, P_HOP, 420, 3), ...cast.map(a => c.pose(a, P_HOP, 420, 3))]);
  } }
);
