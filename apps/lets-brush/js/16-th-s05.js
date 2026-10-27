'use strict';

/* =========================================================
   반짝이 극장 이야기 묶음 5 (v0.51.0): 6시즌 「바다」 53 ~ 60 + 7시즌 「구름 나라」 61 ~ 62
     53 물방울 경주 · 54 해초 숲 미로 · 55 조개 합창단 · 56 문어의 여덟 칫솔 · 57 고래의 큰 하품
     58 반짝 해파리 등불 · 59 잃어버린 조개 왕관 · 60 바닷속 불꽃놀이 · 61 구름 솜사탕 가게 · 62 무지개 미끄럼틀
   ========================================================= */
addText({
  ko:{
    'th.race2.t':'물방울 경주', 'th.race2.1':'바닷속 물방울 경주가 시작됐어요!', 'th.race2.2':'빨리빨리! 대충대충 해도 내가 1등!', 'th.race2.3':'천천히 꼼꼼하게 가도 괜찮아!',
    'th.race2.4':'대충 닦으면 세균이 남아. 꼼꼼하게가 진짜 1등!', 'th.race2.5':'양치는 빨리보다 꼼꼼하게!',
    'th.maze.t':'해초 숲 미로', 'th.maze.1':'해초 숲은 꼬불꼬불 미로예요.', 'th.maze.2':'어느 길로 가지?', 'th.maze.3':'순서대로 하나씩 가 보자!',
    'th.maze.4':'칫, 들켰다!', 'th.maze.5':'양치도 순서대로 하나씩 하면 빠뜨리지 않아요.',
    'th.choir.t':'조개 합창단', 'th.choir.1':'바닷속 조개들이 합창을 해요.', 'th.choir.2':'치카치카 쓱쓱~ 반짝반짝~', 'th.choir.3':'끈적끈적 노래로 망쳐 주지!',
    'th.choir.4':'다 같이 더 크게 불러요!', 'th.choir.5':'양치 노래를 부르면 양치 시간이 즐거워요.',
    'th.octo.t':'문어의 여덟 칫솔', 'th.octo.1':'문어가 칫솔을 여덟 개나 들고 왔어요.', 'th.octo.2':'팔이 여덟 개니까 칫솔도 여덟 개!', 'th.octo.3':'칫솔을 같이 쓰면 나는 이사 가기 딱 좋지!',
    'th.octo.4':'칫솔은 한 사람이 하나씩만 써요!', 'th.octo.5':'칫솔은 나만의 것! 친구와 바꿔 쓰지 않아요.',
    'th.whale.t':'고래의 큰 하품', 'th.whale.1':'커다란 고래가 하아암 하품을 했어요.', 'th.whale.2':'와, 입이 정말 커!', 'th.whale.3':'이렇게 큰 입은 내 놀이터!',
    'th.whale.4':'큰 입도 구석구석 닦으면 돼!', 'th.whale.5':'고마워! 개운해서 노래가 절로 나와!', 'th.whale.6':'입이 크든 작든 구석구석 닦아요.',
    'th.jelly.t':'반짝 해파리 등불', 'th.jelly.1':'깊은 바닷속은 깜깜해요.', 'th.jelly.2':'내가 반짝 불을 켜 줄게!', 'th.jelly.3':'불 끄고 숨어 있었는데!',
    'th.jelly.4':'어금니 안쪽까지 환하게 보여!', 'th.jelly.5':'밝은 곳에서 거울로 보면 숨은 곳도 잘 닦을 수 있어요.',
    'th.crown.t':'잃어버린 조개 왕관', 'th.crown.1':'내 조개 왕관이 없어졌어!', 'th.crown.2':'어디로 갔을까?', 'th.crown.3':'이 왕관은 이제 내 거!',
    'th.crown.4':'왕관은 맨 위에! 이도 위쪽까지 닦자!', 'th.crown.5':'아래쪽 이만큼 위쪽 이도 꼼꼼히 닦아요.',
    'th.seafire.t':'바닷속 불꽃놀이', 'th.seafire.1':'바다 친구들이 불꽃놀이 축제를 열었어요.', 'th.seafire.2':'오늘은 반짝반짝 축제야!', 'th.seafire.3':'축제 간식 먹고 양치는 깜빡~',
    'th.seafire.4':'축제의 마지막은 양치!', 'th.seafire.5':'즐거운 날일수록 양치로 마무리해요.',
    'th.cotton.t':'구름 솜사탕 가게', 'th.cotton.1':'구름 나라에 솜사탕 가게가 열렸어요.', 'th.cotton.2':'구름처럼 폭신한 솜사탕 드세요!', 'th.cotton.3':'솜사탕 열 개 주세요! 히히!',
    'th.cotton.4':'하나만 먹고 양치하자!', 'th.cotton.5':'달콤한 간식은 조금만, 먹은 뒤엔 양치!',
    'th.slide.t':'무지개 미끄럼틀', 'th.slide.1':'구름 나라에 무지개 미끄럼틀이 생겼어요!', 'th.slide.2':'와! 슝 타 보자!', 'th.slide.3':'끈적끈적 미끄럼틀로 만들어 주지!',
    'th.slide.4':'양치 거품으로 미끌미끌하게!', 'th.slide.5':'깨끗하면 뭐든지 더 신나요!'
  },
  en:{
    'th.race2.t':'The Water-Drop Race', 'th.race2.1':'The underwater water-drop race has begun!', 'th.race2.2':'Hurry hurry! Sloppy is fine, I\'m number one!', 'th.race2.3':"It's okay to go slow and careful!",
    'th.race2.4':'Sloppy brushing leaves germs behind. Careful is the real winner!', 'th.race2.5':'When brushing, careful beats quick!',
    'th.maze.t':'The Seaweed Maze', 'th.maze.1':'The seaweed forest is a twisty maze.', 'th.maze.2':'Which way do I go?', 'th.maze.3':"Let's go one by one, in order!",
    'th.maze.4':'Rats, you found me!', 'th.maze.5':'Brush in order, one by one, and you never miss a spot.',
    'th.choir.t':'The Shell Choir', 'th.choir.1':'The shells under the sea are singing together.', 'th.choir.2':'Brush brush, swish swish~ sparkle sparkle~', 'th.choir.3':"I'll ruin it with a sticky song!",
    'th.choir.4':"Everyone, sing louder!", 'th.choir.5':'Sing a brushing song, and brushing time is fun.',
    'th.octo.t':"Octopus's Eight Toothbrushes", 'th.octo.1':'An octopus came holding eight toothbrushes.', 'th.octo.2':'Eight arms, so eight toothbrushes!', 'th.octo.3':'Share a toothbrush? Perfect for me to move in!',
    'th.octo.4':'One toothbrush per person!', 'th.octo.5':'Your toothbrush is just for you. Never swap with friends.',
    'th.whale.t':"The Whale's Big Yawn", 'th.whale.1':'A huge whale gave a big yaaawn.', 'th.whale.2':'Wow, what a big mouth!', 'th.whale.3':'Such a big mouth is my playground!',
    'th.whale.4':'Big mouths just need every corner brushed!', 'th.whale.5':'Thank you! I feel so fresh I want to sing!', 'th.whale.6':'Big mouth or small, brush every corner.',
    'th.jelly.t':'The Jellyfish Lantern', 'th.jelly.1':"It's dark deep in the sea.", 'th.jelly.2':"I'll light it up for you!", 'th.jelly.3':'I was hiding in the dark!',
    'th.jelly.4':'Now I can see all the way to the back teeth!', 'th.jelly.5':'With good light and a mirror, you can brush even the hidden spots.',
    'th.crown.t':'The Lost Shell Crown', 'th.crown.1':'My shell crown is gone!', 'th.crown.2':'Where could it be?', 'th.crown.3':'This crown is mine now!',
    'th.crown.4':"A crown goes on top! Let's brush the top teeth too!", 'th.crown.5':'Brush your top teeth as carefully as the bottom ones.',
    'th.seafire.t':'Undersea Fireworks', 'th.seafire.1':'The sea friends held a fireworks festival.', 'th.seafire.2':"Today is a sparkly festival!", 'th.seafire.3':'Festival snacks, then forget to brush~',
    'th.seafire.4':'The festival ends with brushing!', 'th.seafire.5':'The happier the day, the more we finish it with brushing.',
    'th.cotton.t':'The Cloud Cotton Candy Shop', 'th.cotton.1':'A cotton candy shop opened in Cloud Land.', 'th.cotton.2':'Cotton candy as fluffy as a cloud!', 'th.cotton.3':'Ten cotton candies, please! Hee hee!',
    'th.cotton.4':"Just one, then let's brush!", 'th.cotton.5':'Sweet treats just a little, then brush.',
    'th.slide.t':'The Rainbow Slide', 'th.slide.1':'A rainbow slide appeared in Cloud Land!', 'th.slide.2':"Wow! Let's slide, whee!", 'th.slide.3':"I'll make it a sticky slide!",
    'th.slide.4':"Let's make it slippery with brushing foam!", 'th.slide.5':'When things are clean, everything is more fun!'
  }
});
(window.TH_EPS = window.TH_EPS || []).push(
  { id:'race2', ep:53, bg:'sea', setup(c){ c.place(c.hero, 20, 5); c.place(c.pet, 6, 5); }, run: async (c) => {
    const mg = c.cast('mongi', 12, 40, 14), b = c.boss(12, 62, 12);
    await Promise.all([c.line(null, 'th.race2.1'), c.pose(mg, P_TINY, 400, 3), c.pose(b, P_TINY, 400, 3)]);
    c.snd('whoosh');
    await Promise.all([c.line(b, 'th.race2.2'), c.go(b, 70, 62, 1200), c.pose(b, P_WALK, 250, 4)]);
    await Promise.all([c.line(mg, 'th.race2.3'), c.go(mg, 40, 40, 1600)]);
    c.snd('slip'); c.face(c.hero, 'surprised');
    await Promise.all([c.pose(b, P_SPIN, 500, 2), c.go(b, 64, 44, 900), c.cam(64, 44, 1.6, 700)]);
    await c.cam(50, 50, 1, 400);
    c.face(c.hero, 'determined');
    await c.line(c.hero, 'th.race2.4');
    await c.defeat(b);
    await Promise.all([c.go(mg, 88, 40, 1000), c.pose(mg, P_HOP, 330, 3)]);
    c.burst(mg, 8); c.snd('fanfare');
    await c.line(null, 'th.race2.5');
  } },
  { id:'maze', ep:54, bg:'sea', setup(c){ c.place(c.hero, 10, 5); c.place(c.pet, -6, 5); }, run: async (c) => {
    const sw = [30, 48, 66, 84].map(x => c.prop(TH_P.seaweed, 12, x, 5, 4, 2.3));
    await Promise.all([c.line(null, 'th.maze.1'), ...sw.map((s, i) => c.pose(s, P_WIG, 600 + i * 100, 2))]);
    c.face(c.hero, 'sad');
    await Promise.all([c.line(c.hero, 'th.maze.2'), c.cam(14, 24, 1.6, 600)]);
    await c.cam(50, 50, 1, 400);
    c.face(c.hero, 'determined');
    await c.line(c.pet, 'th.maze.3');
    const b = c.boss(78, 10, 12); b.style.zIndex = '1';
    for (const x of [38, 56, 72]){ c.snd('ding'); await Promise.all([c.go(c.hero, x, 5, 500), c.pose(c.hero, P_WALK, 250, 2)]); }
    c.snd('boing'); b.style.zIndex = '6'; await c.go(b, 84, 30, 400, 'ease-out');
    await Promise.all([c.line(b, 'th.maze.4'), c.cam(80, 26, 1.6, 600)]);
    await c.cam(50, 50, 1, 400);
    await c.defeat(b);
    await c.line(null, 'th.maze.5');
  } },
  { id:'choir', ep:55, bg:'sea', setup(c){ c.place(c.hero, 22, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const sh = [48, 62, 76].map(x => c.prop(TH_P.shell, 9, x, 5, 3, .75));
    c.snd('music');
    [0, 1, 2].forEach(i => setTimeout(() => c.floatProp(TH_P.note, 5, 48 + i * 14, 14), i * 400));
    await Promise.all([c.line(null, 'th.choir.1'), ...sh.map((s, i) => c.pose(s, P_TINY, 380 + i * 50, 4))]);
    await Promise.all([c.line(sh[1], 'th.choir.2'), c.cam(62, 16, 1.7, 700)]);
    await c.cam(50, 50, 1, 400);
    const b = c.boss(112, 5, 14); await c.enter(b, 88, 700);
    await Promise.all([c.line(b, 'th.choir.3'), c.quake(400), c.pose(b, P_SHAKE, 220, 4)]);
    c.face(c.hero, 'happy');
    await c.line(c.hero, 'th.choir.4');
    await c.defeat(b, 'song');
    await Promise.all([c.line(null, 'th.choir.5'), ...sh.map(s => c.pose(s, P_HOP, 400, 2))]);
  } },
  { id:'octo', ep:56, bg:'sea', setup(c){ c.place(c.hero, 22, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const oc = c.prop(TH_P.octopus, 22, 66, 5, 2, .82);
    const bs = [0, 1, 2, 3].map(i => c.prop(TH_P.brushNew, 10, 54 + i * 8, 24 + (i % 2) * 6, 3, .45));
    await Promise.all([c.line(null, 'th.octo.1'), c.pose(oc, P_WIG, 400, 2)]);
    await Promise.all([c.line(oc, 'th.octo.2'), c.cam(66, 20, 1.5, 700), ...bs.map(x => c.pose(x, P_TINY, 300, 3))]);
    await c.cam(50, 50, 1, 400);
    const b = c.boss(46, 40, 12); c.snd('boing'); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(b, 'th.octo.3'), c.pose(b, P_HOP, 320, 3)]);
    c.face(c.hero, 'determined');
    await c.line(c.hero, 'th.octo.4');
    bs.slice(1).forEach(x => x.remove());
    await c.defeat(b);
    await Promise.all([c.line(null, 'th.octo.5'), c.pose(oc, P_HOP, 420, 2)]);
  } },
  { id:'whale', ep:57, bg:'sea', setup(c){ c.place(c.hero, 20, 5); c.place(c.pet, 6, 5); }, run: async (c) => {
    const wh = c.prop(TH_P.whale, 54, 64, 22, 2, .45);
    c.snd('blow');
    await Promise.all([c.line(null, 'th.whale.1'), c.pose(wh, P_YAWN, 900, 2)]);
    c.face(c.hero, 'surprised');
    await Promise.all([c.line(c.hero, 'th.whale.2'), c.pose(c.hero, P_BIG, 600)]);
    c.face(c.hero, null);
    const b = c.boss(50, 30, 12); c.snd('boing'); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(b, 'th.whale.3'), c.cam(52, 30, 1.7, 600), c.pose(b, P_WIG, 320, 3)]);
    await c.cam(50, 50, 1, 400);
    await c.line(c.pet, 'th.whale.4');
    await c.defeat(b, 'brush');
    await Promise.all([c.line(wh, 'th.whale.5'), c.pose(wh, P_TINY, 500, 3)]);
    await c.line(null, 'th.whale.6');
  } },
  { id:'jelly', ep:58, bg:'sea', night:true, setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const dark = document.createElement('div'); dark.className = 'th-night'; dark.style.background = '#0b1a4acc'; c.world.appendChild(dark);
    await c.line(null, 'th.jelly.1');
    const gl = c.prop(TH_P.jellyGlow, 34, 56, 34, 8), jl = c.prop(TH_P.jelly, 12, 56, 50, 9, 1.1);
    c.snd('magic'); dark.style.transition = 'opacity .8s'; dark.style.opacity = '.35';
    await Promise.all([c.line(jl, 'th.jelly.2'), c.pose(jl, P_TINY, 400, 4)]);
    const b = c.boss(70, 5, 14); c.face(c.hero, 'surprised');
    await Promise.all([c.line(b, 'th.jelly.3'), c.cam(70, 18, 1.6, 600), c.pose(b, P_SHAKE, 220, 3)]);
    await c.cam(50, 50, 1, 400);
    c.face(c.hero, 'determined');
    await c.line(c.hero, 'th.jelly.4');
    await c.defeat(b);
    dark.style.opacity = '0'; gl.remove();
    await Promise.all([c.line(null, 'th.jelly.5'), c.pose(jl, P_HOP, 400, 2)]);
  } },
  { id:'crown', ep:59, bg:'sea', setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const mg = c.cast('mongi', 50, 10, 18);
    c.face(c.hero, 'sad');
    await Promise.all([c.line(mg, 'th.crown.1'), c.pose(mg, P_SHAKE, 260, 3), c.cam(50, 22, 1.5, 700)]);
    await c.cam(50, 50, 1, 400);
    await Promise.all([c.line(c.hero, 'th.crown.2'), c.pose(c.hero, P_LOOK, 1200)]);
    const b = c.boss(112, 5, 16), cw = c.prop(TH_P.crown, 9, 112, 22, 6, .62);
    await Promise.all([c.enter(b, 80, 900), c.go(cw, 80, 22, 900)]);
    await Promise.all([c.line(b, 'th.crown.3'), c.pose(b, P_HOP, 330, 3), c.pose(cw, P_HOP, 330, 3)]);
    c.face(c.hero, 'determined');
    await c.line(c.pet, 'th.crown.4');
    await c.go(cw, 50, 34, 600, 'ease-out');
    await c.defeat(b);
    c.snd('magic'); c.burst(mg, 8);
    await Promise.all([c.go(cw, 50, 28, 500), c.pose(mg, P_HOP, 380, 3)]);
    await c.line(null, 'th.crown.5');
  } },
  { id:'seafire', ep:60, bg:'sea', night:true, setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 12, 5); }, run: async (c) => {
    const mg = c.cast('mongi', 70, 10, 18);
    c.snd('fanfare');
    const fw = [[24, 70], [52, 80], [80, 66]].map(([x, y]) => c.prop(TH_P.firework, 16, x, y, 1));
    await Promise.all([c.line(null, 'th.seafire.1'), ...fw.map((f, i) => c.pose(f, P_GROW, 500 + i * 200))]);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(mg, 'th.seafire.2'), c.pose(mg, P_HOP, 380, 3)]);
    const b = c.boss(50, 40, 12), cd = c.prop(TH_P.candy, 8, 56, 36, 6, .53);
    c.snd('boing'); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(b, 'th.seafire.3'), c.cam(52, 40, 1.6, 600)]);
    await c.cam(50, 50, 1, 400);
    cd.remove(); c.face(c.hero, 'determined');
    await c.line(c.hero, 'th.seafire.4');
    await c.defeat(b);
    fw.forEach((f, i) => c.pose(f, P_GROW, 400 + i * 150).catch(() => {}));
    await c.line(null, 'th.seafire.5');
  } },
  { id:'cotton', ep:61, bg:'sky', setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const cc = c.cast('coco', 72, 5, 18), cs = [56, 62, 88].map(x => c.prop(TH_P.candyCotton, 9, x, 22, 3, 1.3));
    await Promise.all([c.line(null, 'th.cotton.1'), ...cs.map(s => c.pose(s, P_TINY, 400, 3))]);
    await Promise.all([c.line(cc, 'th.cotton.2'), c.cam(72, 20, 1.5, 700), c.pose(cc, P_HOP, 380, 2)]);
    await c.cam(50, 50, 1, 400);
    const b = c.boss(-12, 5, 14); await c.enter(b, 40, 900);
    await Promise.all([c.line(b, 'th.cotton.3'), c.pose(b, P_HOP, 320, 3)]);
    c.face(c.hero, 'determined');
    await c.line(c.hero, 'th.cotton.4');
    cs.slice(1).forEach(s => s.remove());
    await c.defeat(b);
    await Promise.all([c.line(null, 'th.cotton.5'), c.pose(cc, P_HOP, 420, 2)]);
  } },
  { id:'slide', ep:62, bg:'sky', setup(c){ c.place(c.hero, 24, 40); c.place(c.pet, 8, 5); }, run: async (c) => {
    const sl = c.prop(TH_P.slide, 50, 46, 5, 1, .7);
    await Promise.all([c.line(null, 'th.slide.1'), c.cam(46, 24, 1.3, 800)]);
    c.face(c.hero, 'happy');
    await c.line(c.hero, 'th.slide.2');
    const b = c.boss(54, 22, 12); c.snd('boing'); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(b, 'th.slide.3'), c.pose(b, P_SQ, 400, 2)]);
    c.snd('slip'); c.face(c.hero, 'surprised');
    await Promise.all([c.go(c.hero, 40, 26, 900), c.pose(c.hero, P_SHAKE, 300, 3)]);
    await c.cam(50, 50, 1, 400);
    c.face(c.hero, 'determined');
    await c.line(c.pet, 'th.slide.4');
    await c.defeat(b, 'foam');
    c.place(c.hero, 24, 40); c.face(c.hero, 'happy'); c.snd('whoosh');
    await Promise.all([c.go(c.hero, 70, 5, 1100, 'ease-in'), c.pose(c.hero, P_SPIN, 1100)]);
    c.burst(c.hero, 8);
    await c.line(null, 'th.slide.5');
  } }
);
