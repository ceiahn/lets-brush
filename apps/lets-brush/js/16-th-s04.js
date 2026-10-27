'use strict';

/* =========================================================
   반짝이 극장 이야기 묶음 4 (v0.51.0): 5시즌 「잠 · 꿈」 43 ~ 50 + 6시즌 「바다」 51 ~ 52
     43 별을 세다 잠들어요 · 44 달님의 자장가 · 45 꿈속 바닷속 · 46 양 대신 칫솔 세기 · 47 잠옷 파티
     48 꿈 비누방울 · 49 조용조용 밤 산책 · 50 내일 또 만나 · 51 산호 마을 대청소 · 52 거북이 할아버지의 이
   ========================================================= */
addText({
  ko:{
    'th.stars.t':'별을 세다 잠들어요', 'th.stars.1':'반짝이가 누워서 별을 세요. 하나, 둘, 셋…', 'th.stars.2':'어? 별 하나가 끈적끈적해!', 'th.stars.3':'별도 끈적하게 만들어 주지!',
    'th.stars.4':'반짝반짝 닦아 주자!', 'th.stars.5':'깨끗하게 닦고 누우면 별처럼 반짝 잠들어요.',
    'th.lullaby.t':'달님의 자장가', 'th.lullaby.1':'달님이 자장자장 노래를 불러요.', 'th.lullaby.2':'시끌벅적! 잠은 내가 다 깨워 주지!', 'th.lullaby.3':'쉿! 양치하고 조용히 잘 시간이야.',
    'th.lullaby.4':'양치를 마치면 달님의 자장가가 들려요.',
    'th.dreamsea.t':'꿈속 바닷속', 'th.dreamsea.1':'꿈속에서 바닷속을 둥둥 헤엄쳐요.', 'th.dreamsea.2':'반짝이, 꿈속 바다에 온 걸 환영해!', 'th.dreamsea.3':'꿈속에서도 끈적끈적 장난이다!',
    'th.dreamsea.4':'꿈에서도 양치 히어로!', 'th.dreamsea.5':'자기 전에 닦으면 꿈속에서도 반짝반짝.',
    'th.count.t':'양 대신 칫솔 세기', 'th.count.1':'잠이 안 오는 밤, 양을 세어 봐요.', 'th.count.2':'양 한 마리, 양 두 마리… 그래도 잠이 안 와.', 'th.count.3':'그럼 칫솔을 세어 볼까?',
    'th.count.4':'칫솔이 너무 많잖아! 도망가자!', 'th.count.5':'쿨쿨…', 'th.count.6':'칫솔 하나, 양치 한 번. 그리고 쿨쿨.',
    'th.pajama.t':'잠옷 파티', 'th.pajama.1':'오늘은 친구들과 잠옷 파티!', 'th.pajama.2':'베개 싸움 하자!', 'th.pajama.3':'파티 끝나면 양치 안 하고 자자~',
    'th.pajama.4':'파티 마지막은 다 같이 양치!', 'th.pajama.5':'친구와 함께 닦으면 양치도 파티처럼 즐거워요.',
    'th.bubble.t':'꿈 비누방울', 'th.bubble.1':'꿈속에서 비누방울을 후 불었어요.', 'th.bubble.2':'방울마다 꿈이 하나씩 들어 있어!', 'th.bubble.3':'이 방울은 끈적끈적 악몽 방울이다!',
    'th.bubble.4':'얼른 터뜨리자!', 'th.bubble.5':'양치하고 자면 꿈 방울도 반짝반짝.',
    'th.walk.t':'조용조용 밤 산책', 'th.walk.1':'조용조용, 밤 산책을 나왔어요.', 'th.walk.2':'쉿, 다들 자고 있어.', 'th.walk.3':'살금살금… 양치 안 한 이를 찾아 볼까?',
    'th.walk.4':'우리 동네 이는 다 반짝반짝 닦았지!', 'th.walk.5':'모두가 양치하고 잠든 밤은 조용하고 평화로워요.',
    'th.tomorrow.t':'내일 또 만나', 'th.tomorrow.1':'오늘 하루도 친구들과 신나게 놀았어요.', 'th.tomorrow.2':'반짝이, 내일 또 만나!', 'th.tomorrow.3':'내일은 꼭 이길 테다!',
    'th.tomorrow.4':'내일 아침에도 쓱쓱 기다릴게!', 'th.tomorrow.5':'오늘 밤 양치하고, 내일 아침 또 만나요.',
    'th.coral.t':'산호 마을 대청소', 'th.coral.1':'바닷속 산호 마을이 끈적끈적 더러워졌어요.', 'th.coral.2':'다 같이 대청소하자!', 'th.coral.3':'청소는 귀찮아~ 그냥 두자!',
    'th.coral.4':'구석구석 닦으면 금방이야!', 'th.coral.5':'이도 구석구석 청소하면 산호처럼 예뻐요.',
    'th.turtle.t':'거북이 할아버지의 이', 'th.turtle.1':'바닷가에서 거북이 할아버지를 만났어요.', 'th.turtle.2':'나는 백 살이 넘었지만 매일 이를 닦는단다.', 'th.turtle.3':'우와, 정말요?',
    'th.turtle.4':'할아버지 이는 이제 내 거다!', 'th.turtle.5':'오래오래 튼튼한 이의 비결은 매일 양치란다.', 'th.turtle.6':'할아버지처럼 매일 닦으면 이도 오래오래 튼튼해요.'
  },
  en:{
    'th.stars.t':'Counting Stars to Sleep', 'th.stars.1':'Sparkle lay down and counted stars. One, two, three…', 'th.stars.2':'Huh? One star is all sticky!', 'th.stars.3':"I'll make the stars sticky too!",
    'th.stars.4':"Let's polish it bright!", 'th.stars.5':'Brush clean, lie down, and fall asleep sparkly as a star.',
    'th.lullaby.t':"The Moon's Lullaby", 'th.lullaby.1':'The Moon sang a soft lullaby.', 'th.lullaby.2':"Noisy time! I'll wake everyone up!", 'th.lullaby.3':"Shh! Brush, then it's quiet sleepy time.",
    'th.lullaby.4':"Finish brushing, and you'll hear the Moon's lullaby.",
    'th.dreamsea.t':'Under the Dream Sea', 'th.dreamsea.1':'In a dream, they swam under the sea.', 'th.dreamsea.2':'Sparkle, welcome to the dream sea!', 'th.dreamsea.3':'Sticky tricks, even in dreams!',
    'th.dreamsea.4':"I'm a brushing hero, even in dreams!", 'th.dreamsea.5':'Brush before bed, and your dreams sparkle too.',
    'th.count.t':'Counting Toothbrushes Instead of Sheep', 'th.count.1':"Can't sleep? Let's count sheep.", 'th.count.2':"One sheep, two sheep… still can't sleep.", 'th.count.3':"Then how about counting toothbrushes?",
    'th.count.4':'Too many toothbrushes! Run!', 'th.count.5':'Zzz…', 'th.count.6':'One toothbrush, one brushing. Then off to sleep.',
    'th.pajama.t':'The Pajama Party', 'th.pajama.1':"Tonight it's a pajama party with friends!", 'th.pajama.2':"Let's have a pillow fight!", 'th.pajama.3':"After the party, let's skip brushing~",
    'th.pajama.4':"The party ends with everyone brushing!", 'th.pajama.5':'Brushing with friends is as fun as a party.',
    'th.bubble.t':'Dream Bubbles', 'th.bubble.1':'In a dream, Sparkle blew soap bubbles.', 'th.bubble.2':'Every bubble has a dream inside!', 'th.bubble.3':"This one is a sticky nightmare bubble!",
    'th.bubble.4':'Quick, pop it!', 'th.bubble.5':'Brush before bed, and your dream bubbles sparkle.',
    'th.walk.t':'A Quiet Night Walk', 'th.walk.1':'Quietly, quietly, they went for a night walk.', 'th.walk.2':"Shh, everyone's asleep.", 'th.walk.3':"Tiptoe… let's find some unbrushed teeth.",
    'th.walk.4':'Everyone in our town brushed their teeth!', 'th.walk.5':'When everyone brushes before bed, the night is calm and peaceful.',
    'th.tomorrow.t':'See You Tomorrow', 'th.tomorrow.1':'Another fun day of playing with friends.', 'th.tomorrow.2':'Sparkle, see you tomorrow!', 'th.tomorrow.3':"I'll win tomorrow for sure!",
    'th.tomorrow.4':"I'll be waiting tomorrow morning, brush brush!", 'th.tomorrow.5':'Brush tonight, and see you tomorrow morning.',
    'th.coral.t':'Coral Town Cleanup', 'th.coral.1':'Coral Town under the sea got all sticky and messy.', 'th.coral.2':"Let's all clean up together!", 'th.coral.3':'Cleaning is boring~ Just leave it!',
    'th.coral.4':"If we clean every corner, it'll be quick!", 'th.coral.5':'Clean every corner of your teeth, and they look as pretty as coral.',
    'th.turtle.t':"Grandpa Turtle's Teeth", 'th.turtle.1':'At the beach, they met Grandpa Turtle.', 'th.turtle.2':"I'm over a hundred years old, but I brush every day.", 'th.turtle.3':'Wow, really?',
    'th.turtle.4':"Grandpa's teeth are mine now!", 'th.turtle.5':'The secret to teeth that last is brushing every day.', 'th.turtle.6':'Brush every day like Grandpa, and your teeth stay strong for a long, long time.'
  }
});
(window.TH_EPS = window.TH_EPS || []).push(
  { id:'stars', ep:43, bg:'nightsky', setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 10, 5); }, run: async (c) => {
    const st = [[22, 70], [42, 80], [62, 66]].map(([x, y]) => c.prop(TH_P.star, 6, x, y, 2));
    c.face(c.hero, 'happy');
    for (const [i, s] of st.entries()){ c.snd('ding', i * 2); await c.pose(s, P_GROW, 350); }
    await c.line(null, 'th.stars.1');
    c.face(c.hero, 'surprised');
    await Promise.all([c.line(c.hero, 'th.stars.2'), c.cam(62, 62, 1.7, 800)]);
    const b = c.boss(66, 60, 10); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(b, 'th.stars.3'), c.pose(st[2], P_SHAKE, 250, 3)]);
    await c.cam(50, 50, 1, 500);
    c.face(c.hero, 'determined');
    await c.line(c.pet, 'th.stars.4');
    await c.defeat(b, pick(['foam', 'song', 'pet']));
    c.burst(st[2], 9); c.snd('magic');
    c.face(c.hero, 'sleep');
    await Promise.all([c.line(null, 'th.stars.5'), ...st.map(s => c.pose(s, P_TINY, 500, 3))]);
    c.face(c.hero, 'happy');
  } },
  { id:'lullaby', ep:44, bg:'nightsky', setup(c){ c.place(c.hero, 28, 5); c.place(c.pet, 10, 5); }, run: async (c) => {
    [0, 1, 2].forEach(i => setTimeout(() => c.floatProp(TH_P.note, 5, 64 + i * 8, 60), i * 500));
    await Promise.all([c.line(null, 'th.lullaby.1'), c.cam(72, 64, 1.5, 1200)]);
    await c.cam(50, 50, 1, 500);
    const b = c.boss(112, 5, 16);
    c.snd('thud'); await c.enter(b, 72, 700);
    await Promise.all([c.line(b, 'th.lullaby.2'), c.quake(700), c.pose(b, P_BIG, 700)]);
    c.face(c.hero, 'determined');
    await Promise.all([c.line(c.hero, 'th.lullaby.3'), c.cam(28, 24, 1.6, 600)]);
    await c.cam(50, 50, 1, 400);
    await c.defeat(b, 'song');
    c.face(c.hero, 'sleep');
    [0, 1].forEach(i => setTimeout(() => c.floatProp(TH_P.note, 5, 60 + i * 12, 58), i * 400));
    await c.line(null, 'th.lullaby.4');
    c.face(c.hero, 'happy');
  } },
  { id:'dreamsea', ep:45, bg:'sea', night:true, setup(c){ c.place(c.hero, 28, 20); c.place(c.pet, 10, 14); }, run: async (c) => {
    await Promise.all([c.line(null, 'th.dreamsea.1'), c.pose(c.hero, P_TINY, 700, 3), c.pose(c.pet, P_TINY, 700, 3)]);
    const mg = c.cast('mongi', 72, 18, 20);
    c.snd('magic'); await c.pose(mg, P_GROW, 500);
    await Promise.all([c.line(mg, 'th.dreamsea.2'), c.cam(70, 30, 1.6, 700)]);
    await c.cam(50, 50, 1, 500);
    const b = c.boss(50, 60, 12); c.snd('boing'); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(b, 'th.dreamsea.3'), c.pose(b, P_WIG, 320, 3)]);
    c.face(c.hero, 'determined');
    await Promise.all([c.line(c.hero, 'th.dreamsea.4'), c.pose(c.hero, P_SPIN, 700)]);
    await c.defeat(b, 'foam');
    await Promise.all([c.line(null, 'th.dreamsea.5'), c.pose(mg, P_HOP, 400, 2)]);
  } },
  { id:'count', ep:46, bg:'room', night:true, setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    await c.line(null, 'th.count.1');
    for (let i = 0; i < 2; i++){ const sh = c.prop(TH_P.sheep, 12, 110, 5, 3, .77); c.snd('boing'); await Promise.all([c.go(sh, 50, 30, 600, 'ease-out')]); await c.go(sh, -20, 5, 600, 'ease-in'); sh.remove(); }
    c.face(c.hero, 'sad');
    await c.line(c.hero, 'th.count.2');
    c.face(c.hero, 'happy');
    await c.line(c.pet, 'th.count.3');
    const bs = [0, 1, 2].map(i => c.prop(TH_P.brushNew, 16, 110 + i * 22, 30, 4, .45));
    c.snd('swish');
    const b = c.boss(70, 5, 14);
    await Promise.all([...bs.map((x, i) => c.go(x, 56 + i * 12, 34 + i * 4, 900)), c.pose(b, P_SHAKE, 300, 3)]);
    await Promise.all([c.line(b, 'th.count.4'), c.cam(70, 20, 1.6, 600)]);
    await c.cam(50, 50, 1, 400);
    bs.forEach(x => x.remove());
    await c.defeat(b, 'brush');
    c.face(c.hero, 'sleep'); c.floatProp(TH_P.zzz, 6, 30, 40);
    await c.line(c.hero, 'th.count.5');
    await c.line(null, 'th.count.6');
    c.face(c.hero, 'happy');
  } },
  { id:'pajama', ep:47, bg:'room', night:true, setup(c){ c.place(c.hero, 34, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const pp = c.cast('pipi', 58, 5, 18), cc = c.cast('coco', 80, 5, 18);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.pajama.1'), c.pose(pp, P_HOP, 380, 2), c.pose(cc, P_HOP, 380, 2)]);
    const pl = c.prop(TH_P.pillow, 14, 80, 30, 5, .45);
    c.snd('whoosh');
    await Promise.all([c.line(cc, 'th.pajama.2'), c.go(pl, 34, 34, 700), c.pose(pl, P_SPIN, 700)]);
    pl.remove(); c.snd('boing'); c.burst(c.hero, 6);
    const b = c.boss(50, 40, 12); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(b, 'th.pajama.3'), c.cam(50, 38, 1.6, 600), c.pose(b, P_YAWN, 600, 2)]);
    await c.cam(50, 50, 1, 400);
    await Promise.all([c.line(pp, 'th.pajama.4'), c.pose(pp, P_HOP, 380, 2)]);
    await c.defeat(b, 'song');
    await Promise.all([c.line(null, 'th.pajama.5'), c.pose(pp, P_HOP, 420, 2), c.pose(cc, P_HOP, 420, 2), c.pose(c.hero, P_HOP, 420, 2)]);
  } },
  { id:'bubble', ep:48, bg:'sky', setup(c){ c.place(c.hero, 26, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    c.snd('blow');
    [0, 1, 2, 3].forEach(i => setTimeout(() => c.floatProp(TH_P.bubble, 9 + i * 2, 36 + i * 10, 30), i * 300));
    await c.line(null, 'th.bubble.1');
    c.face(c.hero, 'happy');
    await Promise.all([c.line(c.hero, 'th.bubble.2'), c.cam(30, 26, 1.5, 700)]);
    await c.cam(50, 50, 1, 400);
    const bb = c.prop(TH_P.bubble, 26, 66, 34, 6), b = c.boss(66, 38, 12);
    c.snd('boing'); c.face(c.hero, 'surprised'); await Promise.all([c.pose(bb, P_GROW, 500), c.pose(b, P_GROW, 500)]);
    await Promise.all([c.line(b, 'th.bubble.3'), c.pose(bb, P_WIG, 320, 3), c.pose(b, P_WIG, 320, 3)]);
    c.face(c.hero, 'determined');
    await c.line(c.pet, 'th.bubble.4');
    bb.remove(); c.snd('pop');
    await c.defeat(b, 'foam');
    [0, 1, 2].forEach(i => setTimeout(() => c.floatProp(TH_P.bubble, 10, 30 + i * 18, 26), i * 300));
    await c.line(null, 'th.bubble.5');
  } },
  { id:'walk', ep:49, bg:'town', night:true, setup(c){ c.place(c.hero, -12, 5); c.place(c.pet, -26, 5); }, run: async (c) => {
    await Promise.all([c.line(null, 'th.walk.1'), c.enter(c.hero, 34, 1800), c.enter(c.pet, 18, 1800)]);
    await Promise.all([c.line(c.hero, 'th.walk.2'), c.cam(34, 24, 1.6, 700)]);
    await c.cam(50, 50, 1, 500);
    const b = c.boss(112, 5, 14);
    await Promise.all([c.go(b, 76, 5, 1600), c.pose(b, P_TINY, 400, 4)]);
    await Promise.all([c.line(b, 'th.walk.3'), c.cam(76, 18, 1.6, 600)]);
    await c.cam(50, 50, 1, 400);
    c.face(c.hero, 'determined');
    await c.line(c.pet, 'th.walk.4');
    await c.defeat(b);
    await c.line(null, 'th.walk.5');
  } },
  { id:'tomorrow', ep:50, bg:'room', setup(c){ c.place(c.hero, 40, 5); c.place(c.pet, 22, 5); }, run: async (c) => {
    const fr = [['pipi', 6], ['mongi', 60], ['coco', 76], ['duri', 92]].map(([n, x]) => c.cast(n, x, 5, 15));
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.tomorrow.1'), ...fr.map(f => c.pose(f, P_HOP, 400, 2))]);
    await Promise.all([c.line(fr[3], 'th.tomorrow.2'), c.cam(80, 20, 1.5, 700)]);
    await c.cam(50, 50, 1, 400);
    const b = c.boss(50, 60, 12); c.snd('boing'); await c.go(b, 50, 40, 500, 'ease-out');
    await Promise.all([c.line(b, 'th.tomorrow.3'), c.pose(b, P_SQ, 400, 2)]);
    await c.line(c.hero, 'th.tomorrow.4');
    await c.defeat(b);
    await Promise.all([c.line(null, 'th.tomorrow.5'), ...fr.map(f => c.go(f, f.pos.x < 50 ? -20 : 120, 5, 1600))]);
  } },
  { id:'coral', ep:51, bg:'sea', setup(c){ c.place(c.hero, 22, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const cr = [[50, 'coral'], [66, 'seaweed'], [82, 'coral']].map(([x, k]) => c.prop(TH_P[k], 12, x, 5, 2, 1.1));
    cr.forEach(x => { x.style.filter = 'grayscale(.8) brightness(.9)'; });
    await Promise.all([c.line(null, 'th.coral.1'), c.cam(66, 20, 1.4, 900)]);
    await c.cam(50, 50, 1, 400);
    const mg = c.cast('mongi', 40, 30, 16);
    await Promise.all([c.line(mg, 'th.coral.2'), c.pose(mg, P_HOP, 380, 2)]);
    const b = c.boss(66, 30, 12); c.snd('boing'); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(b, 'th.coral.3'), c.pose(b, P_YAWN, 700, 2)]);
    c.face(c.hero, 'determined');
    await c.line(c.hero, 'th.coral.4');
    await c.defeat(b, 'brush');
    c.snd('magic');
    for (const x of cr){ x.style.filter = ''; c.burst(x, 5); await c.pose(x, P_TINY, 250); }
    await Promise.all([c.line(null, 'th.coral.5'), c.pose(mg, P_HOP, 400, 2)]);
  } },
  { id:'turtle', ep:52, bg:'sea', setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const tt = c.prop(TH_P.turtle, 30, 68, 5, 2, .55);
    await Promise.all([c.line(null, 'th.turtle.1'), c.cam(68, 16, 1.5, 900)]);
    await Promise.all([c.line(tt, 'th.turtle.2'), c.pose(tt, P_TINY, 500, 3)]);
    await c.cam(50, 50, 1, 400);
    c.face(c.hero, 'surprised');
    await Promise.all([c.line(c.hero, 'th.turtle.3'), c.pose(c.hero, P_BIG, 600)]);
    c.face(c.hero, null);
    const b = c.boss(112, 5, 14); await c.enter(b, 88, 800);
    await Promise.all([c.line(b, 'th.turtle.4'), c.pose(b, P_WIG, 320, 3)]);
    await c.defeat(b, 'pet');
    await Promise.all([c.line(tt, 'th.turtle.5'), c.pose(tt, P_TINY, 500, 3)]);
    await c.line(null, 'th.turtle.6');
  } }
);
