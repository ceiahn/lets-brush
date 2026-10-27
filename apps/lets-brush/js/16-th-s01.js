'use strict';

/* =========================================================
   반짝이 극장 이야기 묶음 1 (v0.51.0): 1시즌 「만남」 남은 편 + 2시즌 「양치 기술」 남은 편
     2 피피의 꽃 정원 · 3 몽이의 진주 · 4 코코와 무지개 다리 · 5 두리가 태어났어요 · 10 반짝이 대변신
     14 완두콩만큼 치약 · 15 모래시계와 함께 · 16 퉤! 하고 뱉어요 · 17 혀도 살살 · 18 칫솔이 지쳤어요
   번호(ep)는 영상 바이블 100편 계획 번호. 글은 addText 로 이 파일 안에 (한 · 영 · 일)
   새 이야기 쓰는 법: 16-theater.js 머리말 (c.line · c.cam · c.face · c.defeat · c.cast …)
   ========================================================= */
addText({
  ko:{
    'th.pipi.t':'피피의 꽃 정원', 'th.pipi.1':'창가 꽃 정원에 꽃 요정 피피가 살아요.', 'th.pipi.2':'꽃들이 고개를 숙였어. 힘이 하나도 없나 봐…', 'th.pipi.3':'히히, 꽃에 끈적끈적 시럽을 뿌렸지!',
    'th.pipi.4':'{pet}, 꽃도 이도 깨끗하게 지켜 주자!', 'th.pipi.5':'와, 꽃들이 다시 활짝 웃어!', 'th.pipi.6':'꽃은 매일 물을, 이는 매일 양치를 좋아해요.',
    'th.mongi.t':'몽이의 진주', 'th.mongi.1':'바닷속에서 물방울 인어 몽이를 만났어요.', 'th.mongi.2':'내 보물 진주가 빛을 잃었어…', 'th.mongi.3':'진주는 내 끈적끈적 놀이터야!',
    'th.mongi.4':'동글동글 살살 닦으면 돼!', 'th.mongi.5':'반짝반짝! 고마워, 반짝이!', 'th.mongi.6':'이도 동글동글 살살 닦으면 진주처럼 빛나요.',
    'th.coco.t':'코코와 무지개 다리', 'th.coco.1':'구름 나라에는 아기 유니콘 코코가 살아요.', 'th.coco.2':'무지개 다리가 회색이 됐어. 건널 수가 없어!', 'th.coco.3':'색깔은 내가 다 먹었지롱!',
    'th.coco.4':'아침에 한 번, 저녁에 한 번! 색을 돌려줘!', 'th.coco.5':'무지개 다리를 건넜어! 신난다!', 'th.coco.6':'하루 두 번 양치하면 웃음도 무지개처럼 환해요.',
    'th.duri.t':'두리가 태어났어요', 'th.duri.1':'풀숲에서 커다란 알을 찾았어요.', 'th.duri.2':'어? 알이 움직여!', 'th.duri.3':'안녕! 나는 두리야. 이것 봐, 이가 하나 났어!',
    'th.duri.4':'새 이는 내가 찜!', 'th.duri.5':'첫 이는 작은 칫솔로 살살 닦아 주자.', 'th.duri.6':'이가 하나 나면, 그날부터 양치를 시작해요.',
    'th.hero.t':'반짝이 대변신', 'th.hero.1':'대장 세균이 세균 친구들을 잔뜩 불렀어요!', 'th.hero.2':'오늘은 우리가 이긴다!', 'th.hero.3':'양치 히어로, 변신!',
    'th.hero.4':'반짝반짝 히어로 등장!', 'th.hero.5':'세균들이 모두 도망갔어요!', 'th.hero.6':'매일 양치하는 너도 이를 지키는 히어로예요!',
    'th.pea.t':'완두콩만큼 치약', 'th.pea.1':'치약을 듬뿍 짜면 더 깨끗해질까?', 'th.pea.2':'으악, 거품이 넘쳐!', 'th.pea.3':'{pet}{pet|이/가} 거품에 퐁당 빠졌어요!',
    'th.pea.4':'세 살이 넘으면 치약은 완두콩만큼이면 충분해요.', 'th.pea.5':'거품이 적으면 날 못 잡지?', 'th.pea.6':'완두콩만큼으로도 반짝반짝!',
    'th.sand.t':'모래시계와 함께', 'th.sand.1':'반짝이가 너무 빨리 닦고 끝내려고 해요.', 'th.sand.2':'벌써 끝? 세균이 아직 남았어!', 'th.sand.3':'그럼 모래시계랑 같이 닦아 볼까?',
    'th.sand.4':'모래가 다 내려갈 때까지 쓱쓱.', 'th.sand.5':'충분히 오래 닦으면 구석구석 깨끗해요.',
    'th.spit.t':'퉤! 하고 뱉어요', 'th.spit.1':'다 닦았다! 거품을 꿀꺽 삼켜도 될까?', 'th.spit.2':'안 돼! 거품은 퉤 하고 뱉어!', 'th.spit.3':'거품 속에 숨어 있었지롱!',
    'th.spit.4':'퉤!', 'th.spit.5':'양치 거품은 퉤 뱉고, 물로 살짝 헹궈요.',
    'th.tongue.t':'혀도 살살', 'th.tongue.1':'이는 다 닦았다! 이제 끝!', 'th.tongue.2':'혀 위는 아무도 안 닦지롱!', 'th.tongue.3':'혀에도 세균이 숨어 있어!',
    'th.tongue.4':'혀도 앞으로 살살 쓸어 주자.', 'th.tongue.5':'혀도 살살 닦으면 입 냄새도 안녕!',
    'th.oldbrush.t':'칫솔이 지쳤어요', 'th.oldbrush.1':'반짝이의 칫솔이 축 늘어져 있어요.', 'th.oldbrush.2':'털이 다 벌어졌어… 나 너무 지쳤어.', 'th.oldbrush.3':'벌어진 칫솔은 나를 못 잡지!',
    'th.oldbrush.4':'그동안 고마웠어, 칫솔아.', 'th.oldbrush.5':'새 칫솔 출동! 털이 반듯반듯!', 'th.oldbrush.6':'칫솔 털이 벌어지면 새 칫솔로 바꿔요. 석 달쯤마다!'
  },
  en:{
    'th.pipi.t':"Pipi's Flower Garden", 'th.pipi.1':'Pipi the flower sprite lives in a windowsill garden.', 'th.pipi.2':'The flowers are drooping. They look so tired…', 'th.pipi.3':'Hee hee, I poured sticky syrup on the flowers!',
    'th.pipi.4':"{pet}, let's keep flowers and teeth clean!", 'th.pipi.5':'Wow, the flowers are smiling again!', 'th.pipi.6':'Flowers love water every day, and teeth love brushing every day.',
    'th.mongi.t':"Mongi's Pearl", 'th.mongi.1':'Under the sea, they met Mongi the water-drop mermaid.', 'th.mongi.2':'My treasure pearl lost its shine…', 'th.mongi.3':'The pearl is my sticky playground!',
    'th.mongi.4':'Little gentle circles will do it!', 'th.mongi.5':'Sparkly! Thank you, Sparkle!', 'th.mongi.6':'Gentle little circles make teeth shine like pearls.',
    'th.coco.t':'Coco and the Rainbow Bridge', 'th.coco.1':'Coco the baby unicorn lives in Cloud Land.', 'th.coco.2':"The rainbow bridge turned gray. I can't cross!", 'th.coco.3':'I ate up all the colors!',
    'th.coco.4':'Once in the morning, once at night! Give the colors back!', 'th.coco.5':'We crossed the rainbow bridge! Hooray!', 'th.coco.6':'Brush twice a day, and your smile shines like a rainbow.',
    'th.duri.t':'Duri Is Born', 'th.duri.1':'They found a big egg in the grass.', 'th.duri.2':'Huh? The egg is moving!', 'th.duri.3':"Hi! I'm Duri. Look, I have a tooth!",
    'th.duri.4':"That new tooth is mine!", 'th.duri.5':"Let's brush a first tooth gently with a tiny brush.", 'th.duri.6':'When the first tooth comes in, start brushing that very day.',
    'th.hero.t':"Sparkle's Big Transformation", 'th.hero.1':'The Boss Germ called lots of germ friends!', 'th.hero.2':'Today we win!', 'th.hero.3':'Brushing hero, transform!',
    'th.hero.4':'Here comes the sparkly hero!', 'th.hero.5':'All the germs ran away!', 'th.hero.6':'You brush every day, so you are a tooth hero too!',
    'th.pea.t':'A Pea-Sized Dab', 'th.pea.1':'Will lots of toothpaste make it cleaner?', 'th.pea.2':'Whoa, the foam is overflowing!', 'th.pea.3':'{pet} fell into the foam, splash!',
    'th.pea.4':'From age three, a pea-sized dab of toothpaste is enough.', 'th.pea.5':"Less foam means you can't catch me, right?", 'th.pea.6':'Just a pea-sized dab, and still sparkly!',
    'th.sand.t':'Brushing with the Sand Timer', 'th.sand.1':'Sparkle is trying to finish way too fast.', 'th.sand.2':'Done already? There are still germs!', 'th.sand.3':"Then let's brush along with the sand timer!",
    'th.sand.4':'Brush, brush, until all the sand runs down.', 'th.sand.5':'Brush long enough and every corner gets clean.',
    'th.spit.t':'Spit It Out!', 'th.spit.1':'All done! Can I swallow the foam?', 'th.spit.2':'No! Spit out the foam!', 'th.spit.3':'I was hiding in the foam!',
    'th.spit.4':'Ptoo!', 'th.spit.5':'Spit out the foam, then rinse with just a little water.',
    'th.tongue.t':'Brush Your Tongue Too', 'th.tongue.1':'My teeth are all clean! All done!', 'th.tongue.2':'Nobody ever brushes the tongue!', 'th.tongue.3':'Germs hide on the tongue too!',
    'th.tongue.4':"Let's gently sweep the tongue forward.", 'th.tongue.5':'Brush your tongue gently, and bye-bye bad breath!',
    'th.oldbrush.t':'The Tired Toothbrush', 'th.oldbrush.1':"Sparkle's toothbrush looks all droopy.", 'th.oldbrush.2':"My bristles are all splayed… I'm so tired.", 'th.oldbrush.3':"A splayed brush can't catch me!",
    'th.oldbrush.4':'Thank you for everything, toothbrush.', 'th.oldbrush.5':'New toothbrush to the rescue! Nice straight bristles!', 'th.oldbrush.6':'When the bristles splay, get a new brush. About every three months!'
  }
});
(window.TH_EPS = window.TH_EPS || []).push(
  { id:'pipi', ep:2, bg:'garden', setup(c){ c.place(c.hero, 20, 5); c.place(c.pet, 6, 5); }, run: async (c) => {
    const pp = c.cast('pipi', 76, 20, 22);
    const dr = [44, 56].map(x => c.prop(TH_P.flowerDroop, 9, x, 5, 2, 1.6));
    await Promise.all([c.line(null, 'th.pipi.1'), c.cam(72, 26, 1.7, 1200)]);
    await Promise.all([c.line(pp, 'th.pipi.2'), c.pose(pp, P_TINY, 500, 3)]);
    const b = c.boss(112, 5, 18);
    await Promise.all([c.cam(50, 50, 1, 700), c.enter(b, 70, 900)]);
    await Promise.all([c.line(b, 'th.pipi.3'), c.pose(b, P_WIG, 330, 4)]);
    c.face(c.hero, 'determined');
    await Promise.all([c.line(c.hero, 'th.pipi.4'), c.pose(c.pet, P_HOP, 350, 2)]);
    await c.defeat(b);
    const can = c.prop(TH_P.can, 14, 50, 40, 6, .65);
    c.snd('magic');
    await Promise.all([c.pose(can, P_WIG, 300, 3), c.shower(TH_P.drop, 8, 1300, 3)]);
    can.remove(); dr.forEach(d => d.remove());
    const up = [[44, TH_P.flower], [56, TH_P.flowerY]].map(([x, a]) => c.prop(a, 9, x, 5, 2, 1.6));
    up.forEach(u => c.pose(u, P_GROW, 600).catch(() => {}));
    c.burst({ x:50, y:20 }, 8);
    await Promise.all([c.line(pp, 'th.pipi.5'), c.pose(pp, P_HOP, 400, 3), c.pose(c.hero, P_HOP, 400, 2)]);
    await c.line(null, 'th.pipi.6');
  } },
  { id:'mongi', ep:3, bg:'sea', setup(c){ c.place(c.hero, 22, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const mg = c.cast('mongi', 74, 12, 22);
    await Promise.all([c.line(null, 'th.mongi.1'), c.pose(mg, P_TINY, 500, 3)]);
    const pr = c.prop(TH_P.pearlDull, 11, 54, 6, 2);
    await Promise.all([c.cam(62, 20, 1.8, 900)]);
    await Promise.all([c.line(mg, 'th.mongi.2'), c.pose(mg, P_SHAKE, 300, 2)]);
    const b = c.boss(54, 6, 14);
    c.snd('boing'); await c.go(b, 58, 20, 500, 'ease-out');
    await Promise.all([c.line(b, 'th.mongi.3'), c.pose(b, P_WIG, 320, 4)]);
    await c.cam(50, 50, 1, 600);
    c.face(c.hero, 'determined');
    await c.line(c.hero, 'th.mongi.4');
    await c.defeat(b);
    c.brush(c.hero, true); c.snd('swish');
    await Promise.all([c.go(c.hero, 38, 5, 500), c.pose(c.hero, P_WALK, 250, 2)]);
    await c.pose(c.hero, P_SHAKE, 260, 3);
    c.brush(c.hero, false); c.restyle(pr, TH_P.pearl); c.snd('magic'); c.burst(pr, 9);
    await c.pose(pr, P_GROW, 600);
    await Promise.all([c.line(mg, 'th.mongi.5'), c.pose(mg, P_HOP, 400, 3), c.cam(60, 22, 1.5, 700)]);
    await c.cam(50, 50, 1, 500);
    await c.line(null, 'th.mongi.6');
  } },
  { id:'coco', ep:4, bg:'sky', setup(c){ c.place(c.hero, 18, 5); c.place(c.pet, 6, 5); }, run: async (c) => {
    const br = c.prop(TH_P.bridgeGray, 56, 60, 6, 1, .5);
    const cc = c.cast('coco', 36, 5, 20);
    await Promise.all([c.line(null, 'th.coco.1'), c.pose(cc, P_HOP, 400, 2)]);
    c.face(c.hero, 'sad');
    await Promise.all([c.line(cc, 'th.coco.2'), c.cam(56, 22, 1.4, 900)]);
    const b = c.boss(60, 40, 16);
    c.snd('boing'); await c.pose(b, P_GROW, 500);
    await Promise.all([c.line(b, 'th.coco.3'), c.pose(b, P_SQ, 400, 3)]);
    await c.cam(50, 50, 1, 600);
    c.face(c.hero, 'determined');
    await c.line(c.hero, 'th.coco.4');
    await c.defeat(b);
    c.snd('magic'); await c.iris(true, 450);
    c.restyle(br, TH_P.bridge);
    await c.iris(false, 550); c.burst({ x:60, y:26 }, 10);
    await Promise.all([c.go(cc, 60, 30, 900), c.go(c.hero, 46, 26, 900), c.pose(cc, P_HOP, 300, 3), c.pose(c.hero, P_HOP, 300, 3)]);
    await Promise.all([c.go(cc, 84, 5, 800), c.go(c.hero, 70, 5, 800)]);
    await Promise.all([c.line(cc, 'th.coco.5'), c.pose(cc, P_HOP, 400, 3)]);
    await c.line(null, 'th.coco.6');
  } },
  { id:'duri', ep:5, bg:'bug', setup(c){ c.place(c.hero, 22, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const eg = c.prop(CAST_ART.duriEgg, 20, 62, 5, 2);
    await Promise.all([c.line(null, 'th.duri.1'), c.cam(56, 20, 1.5, 1000)]);
    c.snd('boing'); c.face(c.hero, 'surprised');
    await Promise.all([c.line(c.hero, 'th.duri.2'), c.pose(eg, P_WIG, 260, 5)]);
    c.restyle(eg, CAST_ART.duriEggCrack); c.snd('pop'); await c.pose(eg, P_SHAKE, 220, 3);
    c.snd('magic'); c.burst(eg, 10); eg.remove();
    const du = c.cast('duri', 62, 5, 22);
    c.face(c.hero, 'happy'); await c.pose(du, P_GROW, 600);
    await Promise.all([c.line(du, 'th.duri.3'), c.cam(62, 22, 2, 800), c.pose(du, P_HOP, 380, 3)]);
    await c.cam(50, 50, 1, 600);
    const b = c.boss(112, 5, 14);
    await c.enter(b, 82, 800);
    await Promise.all([c.line(b, 'th.duri.4'), c.pose(b, P_WIG, 320, 4)]);
    await c.defeat(b, 'pet');
    c.face(c.hero, null); c.brush(c.hero, true);
    await Promise.all([c.line(c.hero, 'th.duri.5'), c.pose(c.hero, P_TINY, 400, 4), c.pose(du, P_TINY, 400, 4)]);
    c.brush(c.hero, false);
    await Promise.all([c.line(null, 'th.duri.6'), c.pose(du, P_HOP, 420, 2), c.pose(c.hero, P_HOP, 420, 2)]);
  } },
  { id:'hero', ep:10, bg:'castle', setup(c){ c.place(c.hero, 26, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const b = c.boss(76, 5, 20);
    const gs = [[56, 40], [68, 56], [86, 44]].map(([x, y], i) => c.prop(germSVG(i % 4), 10, x, y, 4));
    await Promise.all([c.line(null, 'th.hero.1'), ...gs.map(g => c.pose(g, P_WIG, 300, 4))]);
    await Promise.all([c.line(b, 'th.hero.2'), c.quake(500), c.pose(b, P_SQ, 400, 2)]);
    c.face(c.hero, 'determined');
    await Promise.all([c.cam(26, 24, 1.8, 700)]);
    await c.line(c.hero, 'th.hero.3');
    c.snd('magic'); await c.pose(c.hero, P_SPIN, 600);
    const set = pick(HERO_SETS).id;
    c.restyle(c.hero, Character.art(heroLook(set))); c.burst(c.hero, 12); c.snd('fanfare');
    await Promise.all([c.line(c.hero, 'th.hero.4'), c.pose(c.hero, P_BIG, 700)]);
    await c.cam(50, 50, 1, 600);
    c.brush(c.hero, true);
    for (const g of gs){ c.snd('swish'); await c.go(c.hero, Math.min(70, g.pos.x - 10), 5, 380); c.snd('pop'); c.burst(g, 6); g.remove(); }
    c.brush(c.hero, false);
    await c.defeat(b);
    await c.line(null, 'th.hero.5');
    await Promise.all([c.line(null, 'th.hero.6'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
    c.restyle(c.hero, Character.art(effectiveLook()));
  } },
  { id:'pea', ep:14, bg:'bath', setup(c){ c.place(c.hero, 32, 5); c.place(c.pet, 12, 5); }, run: async (c) => {
    const tb = c.prop(TH_P.tube, 18, 60, 40, 4, .4);
    await Promise.all([c.line(c.hero, 'th.pea.1'), c.pose(tb, P_TINY, 400, 3)]);
    const bl = c.prop(TH_P.blob, 20, 62, 30, 5, .5);
    c.snd('pop'); await c.morph(bl, 'scale(2.4)', 900);
    c.face(c.hero, 'surprised'); c.snd('boing');
    await Promise.all([c.line(c.hero, 'th.pea.2'), c.shower(TH_P.bubble, 12, 1800, 7), c.quake(500)]);
    await Promise.all([c.line(null, 'th.pea.3'), c.pose(c.pet, P_BIG, 700)]);
    await c.morph(bl, 'scale(.3)', 700); bl.remove();
    const pe = c.prop(TH_P.pea, 8, 62, 34, 5, .75);
    c.snd('ding'); await c.pose(pe, P_GROW, 500);
    await Promise.all([c.line(null, 'th.pea.4'), c.cam(60, 34, 1.9, 900)]);
    await c.cam(50, 50, 1, 500);
    const b = c.boss(112, 5, 16); await c.enter(b, 78, 800);
    await Promise.all([c.line(b, 'th.pea.5'), c.pose(b, P_WIG, 320, 3)]);
    c.face(c.hero, 'determined');
    await c.defeat(b, 'brush');
    await Promise.all([c.line(c.hero, 'th.pea.6'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
  } },
  { id:'sand', ep:15, bg:'bath', setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 66, 5); }, run: async (c) => {
    c.brush(c.hero, true);
    await Promise.all([c.line(null, 'th.sand.1'), c.pose(c.hero, P_SHAKE, 150, 6)]);
    c.brush(c.hero, false);
    const b = c.boss(48, 34, 12);
    c.snd('boing'); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(c.pet, 'th.sand.2'), c.pose(c.pet, P_HOP, 350, 2)]);
    const hg = c.prop(TH_P.hourglass, 10, 84, 30, 5, 1.4);
    c.snd('ding'); await c.pose(hg, P_SPIN, 600);
    await Promise.all([c.line(c.hero, 'th.sand.3'), c.cam(30, 24, 1.6, 800)]);
    c.brush(c.hero, true); c.face(c.hero, 'determined');
    await Promise.all([c.line(null, 'th.sand.4'), c.pose(c.hero, P_SHAKE, 280, 8), c.cam(40, 26, 1.3, 2000), c.morph(b, 'scale(.6)', 2000)]);
    c.brush(c.hero, false);
    await c.cam(50, 50, 1, 500);
    await c.defeat(b);
    await Promise.all([c.line(null, 'th.sand.5'), c.pose(hg, P_SPIN, 600), c.pose(c.hero, P_HOP, 420, 2)]);
  } },
  { id:'spit', ep:16, bg:'bath', setup(c){ c.place(c.hero, 34, 5); c.place(c.pet, 12, 5); }, run: async (c) => {
    c.face(c.hero, 'happy');
    await Promise.all([c.line(c.hero, 'th.spit.1'), c.pose(c.hero, P_TINY, 400, 3)]);
    c.face(c.hero, 'surprised'); c.snd('boing');
    await Promise.all([c.line(c.pet, 'th.spit.2'), c.pose(c.pet, P_BIG, 600)]);
    const b = c.boss(50, 34, 12);
    await Promise.all([c.pose(b, P_GROW, 400), c.cam(46, 30, 1.7, 700)]);
    await Promise.all([c.line(b, 'th.spit.3'), c.pose(b, P_WIG, 300, 3)]);
    c.face(c.hero, null);
    const sp = c.prop(TH_P.splash, 14, 50, 26, 6, .75);
    c.snd('sneeze'); c.say(c.hero, 'th.spit.4');
    await Promise.all([c.go(sp, 50, 10, 500, 'ease-in'), c.go(b, 50, 10, 500, 'ease-in')]);
    sp.remove(); await c.cam(50, 50, 1, 500);
    await c.defeat(b, 'rinse');
    await Promise.all([c.line(null, 'th.spit.5'), c.pose(c.hero, P_HOP, 420, 2), c.pose(c.pet, P_HOP, 420, 2)]);
  } },
  { id:'tongue', ep:17, bg:'bath', setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 10, 5); }, run: async (c) => {
    c.face(c.hero, 'happy');
    await Promise.all([c.line(c.hero, 'th.tongue.1'), c.pose(c.hero, P_HOP, 400, 2)]);
    const tg = c.prop(TH_P.tongue, 22, 66, 10, 2, .7);
    const b = c.boss(66, 22, 12);
    c.snd('boing'); await Promise.all([c.pose(tg, P_GROW, 500), c.cam(64, 18, 1.8, 800)]);
    await Promise.all([c.line(b, 'th.tongue.2'), c.pose(b, P_HOP, 340, 3)]);
    c.face(c.hero, 'surprised');
    await Promise.all([c.cam(50, 50, 1, 500), c.line(c.pet, 'th.tongue.3')]);
    c.face(c.hero, null); c.brush(c.hero, true);
    await Promise.all([c.go(c.hero, 48, 5, 600), c.pose(c.hero, P_WALK, 300, 2)]);
    await Promise.all([c.line(c.hero, 'th.tongue.4'), c.pose(c.hero, P_TINY, 300, 5)]);
    c.brush(c.hero, false);
    await c.defeat(b, pick(['foam', 'song', 'pet']));
    tg.remove();
    await Promise.all([c.line(null, 'th.tongue.5'), c.pose(c.hero, P_HOP, 420, 2)]);
  } },
  { id:'oldbrush', ep:18, bg:'bath', setup(c){ c.place(c.hero, 26, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const ob = c.prop(TH_P.brushTired, 22, 62, 30, 4, .45);
    await Promise.all([c.line(null, 'th.oldbrush.1'), c.cam(60, 30, 1.6, 900)]);
    await Promise.all([c.line(ob, 'th.oldbrush.2'), c.pose(ob, P_YAWN, 800, 2)]);
    await c.cam(50, 50, 1, 500);
    const b = c.boss(112, 5, 16); await c.enter(b, 82, 800);
    await Promise.all([c.line(b, 'th.oldbrush.3'), c.pose(b, P_WIG, 320, 3)]);
    c.face(c.hero, 'sad');
    await Promise.all([c.line(c.hero, 'th.oldbrush.4'), c.go(ob, 62, -20, 900, 'ease-in')]);
    ob.remove();
    const nb = c.prop(TH_P.brushNew, 22, 62, 30, 4, .45);
    c.snd('fanfare'); c.burst(nb, 10); c.face(c.hero, 'happy');
    await Promise.all([c.line(nb, 'th.oldbrush.5'), c.pose(nb, P_BIG, 700)]);
    nb.remove();
    await c.defeat(b, 'brush');
    await c.line(null, 'th.oldbrush.6');
  } }
);
