'use strict';

/* =========================================================
   반짝이 극장 이야기 묶음 11 (v0.51.0): 12시즌 「반짝이네 일상」 111 ~ 120 (6개월치 마지막 묶음)
     111 두리의 화석 찾기 · 112 치과 정기 검진 · 113 과자 통 지키기 · 114 친구네서 자는 날 · 115 피피의 꽃향기 치약
     116 몽이의 물 아끼기 · 117 코코의 새 칫솔 · 118 2분 모래시계 · 119 말하는 거울 · 120 반짝이 별자리
   ========================================================= */
addText({
  ko:{
    'th.fossil.t':'두리의 화석 찾기', 'th.fossil.1':'두리가 땅을 파다가 뭔가 찾았어요.', 'th.fossil.2':'커다란 공룡 뼈다! 이빨도 아직 튼튼해!', 'th.fossil.3':'공룡 할아버지도 이를 아꼈나 봐!',
    'th.fossil.4':'뼈다귀는 내가 끈적하게 숨겨 주지!', 'th.fossil.5':'튼튼한 이는 오래오래 함께해요.',
    'th.checkup.t':'치과 정기 검진', 'th.checkup.1':'오늘은 치과에 가는 날이에요.', 'th.checkup.2':'조금 떨려…', 'th.checkup.3':'아- 해 보세요. 와, 아주 반짝반짝하네요!',
    'th.checkup.4':'어금니 뒤에 숨어 있었는데 들켰다!', 'th.checkup.5':'아프지 않아도 치과에 가서 이를 살펴봐요.',
    'th.cookiejar.t':'과자 통 지키기', 'th.cookiejar.1':'부엌에 과자 통이 있어요.', 'th.cookiejar.2':'과자 통을 열면 과자를 몽땅 먹을 테다!', 'th.cookiejar.3':'과자는 정해진 때에 조금만!',
    'th.cookiejar.4':'간식 시간엔 하나만, 먹고 나면 물 한 모금!', 'th.cookiejar.5':'간식은 정해진 때에, 먹은 뒤엔 입을 헹궈요.',
    'th.sleepover.t':'친구네서 자는 날', 'th.sleepover.1':'오늘은 코코네 집에서 자는 날!', 'th.sleepover.2':'베개 싸움이다! 퐁퐁!', 'th.sleepover.3':'앗, 칫솔을 안 가져왔어!',
    'th.sleepover.4':'칫솔 없으면 오늘은 내 세상이다!', 'th.sleepover.5':'가방 속에 내 칫솔 있어! 미리 챙겼지!', 'th.sleepover.6':'놀러 가는 날엔 내 칫솔을 꼭 챙겨요.',
    'th.flowerpaste.t':'피피의 꽃향기 치약', 'th.flowerpaste.1':'피피가 꽃향기 나는 치약을 가져왔어요.', 'th.flowerpaste.2':'향긋해! 그런데 이거 먹으면 안 돼?', 'th.flowerpaste.3':'치약은 먹는 게 아니야. 다 닦으면 퉤!',
    'th.flowerpaste.4':'치약 냄새만 맡아도 어지러워~', 'th.flowerpaste.5':'치약은 삼키지 말고 뱉어요.',
    'th.tapoff.t':'몽이의 물 아끼기', 'th.tapoff.1':'양치하는 동안 물이 콸콸 흘러요.', 'th.tapoff.2':'물이 아까워! 컵에 받아서 쓰자.', 'th.tapoff.3':'물이 철철 넘치면 내 수영장이지!',
    'th.tapoff.4':'수도꼭지를 꼭 잠그자!', 'th.tapoff.5':'양치 컵에 물을 받아 쓰면 물도 아껴요.',
    'th.cocobrush.t':'코코의 새 칫솔', 'th.cocobrush.1':'코코의 칫솔 털이 사방으로 벌어졌어요.', 'th.cocobrush.2':'칫솔이 꼭 꽃처럼 활짝 폈어!', 'th.cocobrush.3':'히히, 낡은 칫솔로는 날 못 잡지!',
    'th.cocobrush.4':'짜잔! 무지개색 새 칫솔!', 'th.cocobrush.5':'칫솔 털이 벌어지면 새 칫솔로 바꿔요.',
    'th.twomin.t':'2분 모래시계', 'th.twomin.1':'모래시계를 뒤집었어요. 사르르르…', 'th.twomin.2':'모래가 다 내려올 때까지 닦는 거야!', 'th.twomin.3':'2분은 너무 길어! 금방 그만두겠지?',
    'th.twomin.4':'노래하면 2분이 금방이야!', 'th.twomin.5':'2분 동안 구석구석 닦아요.',
    'th.talkmirror.t':'말하는 거울', 'th.talkmirror.1':'욕실 거울이 말을 했어요!', 'th.talkmirror.2':'거울아 거울아, 누구 이가 제일 반짝이니?', 'th.talkmirror.3':'음… 왼쪽 어금니에 세균이 하나 남았는걸?',
    'th.talkmirror.4':'쉿! 거울은 말하지 마!', 'th.talkmirror.5':'다 닦으면 거울로 한 번 더 확인해요.',
    'th.constel.t':'반짝이 별자리', 'th.constel.1':'밤하늘의 별들이 하나씩 이어져요.', 'th.constel.2':'우와, 칫솔 모양 별자리야!', 'th.constel.3':'매일 밤 닦은 친구들이 별이 되어 반짝이는 거래.',
    'th.constel.4':'별자리라니, 너무 눈부셔~', 'th.constel.5':'오늘 밤도 닦고 자면, 너도 하늘의 별처럼 반짝여요.'
  },
  en:{
    'th.fossil.t':"Duri's Fossil Hunt", 'th.fossil.1':'Duri dug in the ground and found something.', 'th.fossil.2':'A giant dinosaur bone! The teeth are still strong!', 'th.fossil.3':'Grandpa Dino must have loved his teeth!',
    'th.fossil.4':"I'll hide that bone in goo!", 'th.fossil.5':'Strong teeth stay with you for a long, long time.',
    'th.checkup.t':'The Dental Checkup', 'th.checkup.1':'Today is dentist day.', 'th.checkup.2':"I'm a little nervous…", 'th.checkup.3':'Say "ah." Wow, so sparkly!',
    'th.checkup.4':'I was hiding behind a back tooth, and they found me!', 'th.checkup.5':"Even when nothing hurts, visit the dentist for a check.",
    'th.cookiejar.t':'Guarding the Cookie Jar', 'th.cookiejar.1':"There's a cookie jar in the kitchen.", 'th.cookiejar.2':"I'll open it and eat ALL the cookies!", 'th.cookiejar.3':'Cookies just a little, at snack time!',
    'th.cookiejar.4':'One at snack time, then a sip of water!', 'th.cookiejar.5':'Snacks at snack time, then rinse your mouth.',
    'th.sleepover.t':'The Sleepover', 'th.sleepover.1':"Tonight is a sleepover at Coco's house!", 'th.sleepover.2':'Pillow fight! Poof poof!', 'th.sleepover.3':'Oh no, I forgot my toothbrush!',
    'th.sleepover.4':'No toothbrush means tonight is MY night!', 'th.sleepover.5':"My toothbrush is in my bag! I packed it!", 'th.sleepover.6':'When you go for a sleepover, pack your own toothbrush.',
    'th.flowerpaste.t':"Pipi's Flower Toothpaste", 'th.flowerpaste.1':'Pipi brought flower-scented toothpaste.', 'th.flowerpaste.2':'It smells so nice! Can I eat it?', 'th.flowerpaste.3':"Toothpaste isn't food. When you're done, spit!",
    'th.flowerpaste.4':'Just smelling toothpaste makes me dizzy~', 'th.flowerpaste.5':"Spit out toothpaste. Don't swallow it.",
    'th.tapoff.t':'Mongi Saves Water', 'th.tapoff.1':'Water is gushing while they brush.', 'th.tapoff.2':"What a waste! Let's use a cup.", 'th.tapoff.3':'Overflowing water is my swimming pool!',
    'th.tapoff.4':"Let's turn off the tap!", 'th.tapoff.5':'Use a cup for rinsing and save water.',
    'th.cocobrush.t':"Coco's New Toothbrush", 'th.cocobrush.1':"Coco's toothbrush bristles are bent every which way.", 'th.cocobrush.2':"It's blooming like a flower!", 'th.cocobrush.3':"Hee hee, an old toothbrush can't catch me!",
    'th.cocobrush.4':'Ta-da! A new rainbow toothbrush!', 'th.cocobrush.5':'When the bristles bend out, get a new toothbrush.',
    'th.twomin.t':'The Two-Minute Hourglass', 'th.twomin.1':'They flipped the hourglass. Swish…', 'th.twomin.2':'Brush until all the sand falls!', 'th.twomin.3':"Two minutes is too long! They'll quit soon!",
    'th.twomin.4':'Sing a song and two minutes fly by!', 'th.twomin.5':'Brush every corner for two minutes.',
    'th.talkmirror.t':'The Talking Mirror', 'th.talkmirror.1':'The bathroom mirror spoke!', 'th.talkmirror.2':'Mirror, mirror, whose teeth sparkle most?', 'th.talkmirror.3':"Hmm… there's one germ left on the left back tooth!",
    'th.talkmirror.4':"Shh! Don't tell, mirror!", 'th.talkmirror.5':'After brushing, check once more in the mirror.',
    'th.constel.t':'The Sparkle Constellation', 'th.constel.1':'The stars in the night sky connect one by one.', 'th.constel.2':"Wow, it's a toothbrush constellation!", 'th.constel.3':'They say friends who brush every night become sparkling stars.',
    'th.constel.4':'A constellation? Too bright~', 'th.constel.5':'Brush tonight, and you will sparkle like a star in the sky.'
  }
});
(window.TH_EPS = window.TH_EPS || []).push(
  { id:'fossil', ep:111, bg:'safari', setup(c){ c.place(c.hero, 22, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const du = c.cast('duri', 56, 5, 14), bn = c.prop(TH_P.bone, 16, 70, 4, 2, .42);
    await Promise.all([c.line(null, 'th.fossil.1'), c.pose(du, P_SHAKE, 220, 5)]);
    c.snd('ding', 5); c.burst(bn, 6);
    await Promise.all([c.line(du, 'th.fossil.2'), c.cam(64, 16, 1.6, 700), c.pose(du, P_HOP, 380, 2)]);
    await c.cam(50, 50, 1, 400);
    c.face(c.hero, 'happy');
    await c.line(c.hero, 'th.fossil.3');
    const b = c.boss(112, 5, 12); await c.enter(b, 86, 800);
    await Promise.all([c.line(b, 'th.fossil.4'), c.pose(b, P_WIG, 300, 3)]);
    c.face(c.hero, 'determined');
    await c.defeat(b);
    await c.line(null, 'th.fossil.5');
  } },
  { id:'checkup', ep:112, bg:'clinic', setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 12, 5); }, run: async (c) => {
    await c.line(null, 'th.checkup.1');
    c.face(c.hero, 'shy');
    await Promise.all([c.line(c.hero, 'th.checkup.2'), c.pose(c.hero, P_SHAKE, 260, 3)]);
    const mr = c.prop(TH_P.mirror, 8, 50, 30, 4);
    await Promise.all([c.line(null, 'th.checkup.3'), c.cam(36, 24, 1.6, 700), c.pose(mr, P_TINY, 300, 3)]);
    c.face(c.hero, 'happy');
    const b = c.boss(46, 22, 6); c.snd('boing');
    await Promise.all([c.line(b, 'th.checkup.4'), c.pose(b, P_SHAKE, 220, 4)]);
    mr.remove(); await c.cam(50, 50, 1, 400);
    await c.go(b, 70, 5, 500, 'ease-in');
    await c.defeat(b);
    c.snd('fanfare');
    await c.line(null, 'th.checkup.5');
  } },
  { id:'cookiejar', ep:113, bg:'room', setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const jr = c.prop(TH_P.honey, 14, 62, 5, 2, 1);
    await Promise.all([c.line(null, 'th.cookiejar.1'), c.cam(62, 16, 1.5, 700)]);
    const b = c.boss(76, 5, 11); c.snd('boing'); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(b, 'th.cookiejar.2'), c.pose(jr, P_SHAKE, 220, 4)]);
    await c.cam(50, 50, 1, 400);
    c.face(c.hero, 'determined');
    await c.line(c.pet, 'th.cookiejar.3');
    await c.defeat(b);
    const ck = c.prop(TH_P.cookie, 7, 40, 24, 5), wt = c.prop(TH_P.water, 6, 50, 22, 5, 1.6);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(c.hero, 'th.cookiejar.4'), c.pose(ck, P_TINY, 300, 2), c.pose(wt, P_TINY, 300, 2)]);
    await c.line(null, 'th.cookiejar.5');
  } },
  { id:'sleepover', ep:114, bg:'room', night:true, setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const cc = c.cast('coco', 62, 5, 15);
    await Promise.all([c.line(null, 'th.sleepover.1'), c.pose(cc, P_HOP, 380, 2)]);
    const pl = c.prop(TH_P.pillow, 12, 46, 24, 5, .45); c.face(c.hero, 'happy');
    c.snd('boing');
    await Promise.all([c.line(c.hero, 'th.sleepover.2'), c.go(pl, 60, 26, 500), c.pose(cc, P_SHAKE, 220, 3)]);
    pl.remove(); c.face(c.hero, 'surprised');
    await c.line(cc, 'th.sleepover.3');
    const b = c.boss(86, 5, 11); c.snd('boing'); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(b, 'th.sleepover.4'), c.pose(b, P_HOP, 300, 3)]);
    const br = c.prop(TH_P.brushNew, 12, 24, 26, 5, .45); c.snd('magic'); c.face(c.hero, 'happy');
    await Promise.all([c.line(c.hero, 'th.sleepover.5'), c.pose(br, P_BIG, 600)]);
    br.remove();
    await c.defeat(b);
    await c.line(null, 'th.sleepover.6');
  } },
  { id:'flowerpaste', ep:115, bg:'bath', setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const pp = c.cast('pipi', 58, 8, 14), tb = c.prop(TH_P.tube, 16, 58, 32, 4, .4);
    await Promise.all([c.line(null, 'th.flowerpaste.1'), c.pose(tb, P_TINY, 300, 3)]);
    [0, 1].forEach(i => setTimeout(() => c.floatProp(TH_P.flower, 4, 52 + i * 10, 34), i * 300));
    c.face(c.hero, 'happy');
    await c.line(c.hero, 'th.flowerpaste.2');
    await Promise.all([c.line(pp, 'th.flowerpaste.3'), c.pose(pp, P_SHAKE, 260, 3)]);
    tb.remove();
    const b = c.boss(86, 5, 11); c.snd('boing'); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(b, 'th.flowerpaste.4'), c.pose(b, P_SPIN, 700)]);
    await c.defeat(b, 'rinse');
    await c.line(null, 'th.flowerpaste.5');
  } },
  { id:'tapoff', ep:116, bg:'bath', setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const mg = c.cast('mongi', 66, 8, 14);
    c.shower(TH_P.drop, 10, 1600, 3).catch(() => {});
    await c.line(null, 'th.tapoff.1');
    const cp = c.prop(TH_P.cup, 8, 56, 26, 5);
    await Promise.all([c.line(mg, 'th.tapoff.2'), c.pose(cp, P_TINY, 300, 3)]);
    const b = c.boss(86, 5, 11); c.snd('boing'); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(b, 'th.tapoff.3'), c.pose(b, P_WIG, 300, 3), c.cam(80, 20, 1.5, 600)]);
    await c.cam(50, 50, 1, 400);
    c.face(c.hero, 'determined'); c.snd('ding', 7);
    await Promise.all([c.line(c.hero, 'th.tapoff.4'), c.pose(c.hero, P_HOP, 380, 2)]);
    await c.defeat(b, 'song');
    await Promise.all([c.line(null, 'th.tapoff.5'), c.pose(mg, P_HOP, 400, 2)]);
  } },
  { id:'cocobrush', ep:117, bg:'sky', setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const cc = c.cast('coco', 56, 5, 15), br = c.prop(TH_P.brushTired, 14, 70, 26, 4, .45);
    await Promise.all([c.line(null, 'th.cocobrush.1'), c.cam(64, 26, 1.6, 700)]);
    await Promise.all([c.line(cc, 'th.cocobrush.2'), c.pose(br, P_SHAKE, 220, 3)]);
    await c.cam(50, 50, 1, 400);
    const b = c.boss(88, 5, 11); c.snd('boing'); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(b, 'th.cocobrush.3'), c.pose(b, P_HOP, 300, 3)]);
    c.restyle(br, TH_P.brushNew); c.snd('magic'); c.burst(br, 8);
    const rb = c.prop(TH_P.rainbow, 30, 56, 52, 1, .5);
    await Promise.all([c.line(cc, 'th.cocobrush.4'), c.pose(cc, P_HOP, 380, 2), c.pose(rb, P_GROW, 600)]);
    c.face(c.hero, 'determined');
    await c.defeat(b);
    await c.line(null, 'th.cocobrush.5');
  } },
  { id:'twomin', ep:118, bg:'bath', setup(c){ c.place(c.hero, 26, 5); c.place(c.pet, 10, 5); }, run: async (c) => {
    const hg = c.prop(TH_P.hourglass, 8, 56, 26, 4, 1.4);
    await Promise.all([c.line(null, 'th.twomin.1'), c.pose(hg, P_SPIN, 700)]);
    c.brush(c.hero, true);
    await Promise.all([c.line(c.hero, 'th.twomin.2'), c.pose(c.hero, P_SHAKE, 260, 4)]);
    const b = c.boss(84, 5, 11); c.snd('boing'); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(b, 'th.twomin.3'), c.pose(b, P_YAWN, 900)]);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(c.pet, 'th.twomin.4'), c.pose(c.pet, P_HOP, 380, 3)]);
    c.brush(c.hero, false);
    await c.defeat(b, 'song');
    c.snd('ding', 5); c.burst(hg, 6);
    await c.line(null, 'th.twomin.5');
  } },
  { id:'talkmirror', ep:119, bg:'bath', setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 12, 5); }, run: async (c) => {
    const mr = c.prop(TH_P.mirrorBig, 22, 68, 30, 2);
    c.snd('magic');
    await Promise.all([c.line(null, 'th.talkmirror.1'), c.pose(mr, P_SHAKE, 220, 3)]);
    c.face(c.hero, 'happy');
    await c.line(c.hero, 'th.talkmirror.2');
    await Promise.all([c.line(mr, 'th.talkmirror.3'), c.pose(mr, P_TINY, 300, 3)]);
    c.face(c.hero, 'surprised');
    const b = c.boss(40, 5, 8); c.snd('boing');
    await Promise.all([c.line(b, 'th.talkmirror.4'), c.pose(b, P_SHAKE, 220, 4), c.cam(38, 16, 1.6, 600)]);
    await c.cam(50, 50, 1, 400);
    await c.go(b, 70, 5, 500);
    c.face(c.hero, 'determined');
    await c.defeat(b);
    await c.line(null, 'th.talkmirror.5');
  } },
  { id:'constel', ep:120, bg:'nightsky', setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 14, 5); }, run: async (c) => {
    const pts = [[30, 74], [40, 70], [50, 66], [60, 62], [70, 58], [74, 66], [78, 52]];
    const st = [];
    c.cam(54, 64, 1.4, 900).catch(() => {});
    for (let i = 0; i < pts.length; i++){ c.snd('ding', i); st.push(c.prop(TH_P.star, 4, pts[i][0], pts[i][1], 2)); await c.wait(220); }
    await c.line(null, 'th.constel.1');
    c.face(c.hero, 'surprised');
    await Promise.all([c.line(c.hero, 'th.constel.2'), ...st.map(s => c.pose(s, P_TINY, 300, 2))]);
    await c.cam(50, 50, 1, 500);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(c.pet, 'th.constel.3'), c.pose(c.pet, P_HOP, 380, 2)]);
    const b = c.boss(84, 5, 11); c.snd('boing'); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(b, 'th.constel.4'), c.pose(b, P_SHAKE, 220, 4)]);
    await c.defeat(b, 'song');
    c.shower(TH_P.star, 12, 1800, 3).catch(() => {});
    c.face(c.hero, 'sleep');
    await c.line(null, 'th.constel.5');
  } }
);
