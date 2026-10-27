'use strict';

/* =========================================================
   반짝이 극장 이야기 묶음 3 (v0.51.0): 4시즌 「먹는 것」 33 ~ 40 + 5시즌 「잠 · 꿈」 41 ~ 42
     33 우유 한 잔 · 34 물이 최고 · 35 과자 부스러기 숨바꼭질 · 36 채소 친구들 · 37 간식 시간 지키기
     38 치즈 한 조각 · 39 탄산 거품 소동 · 40 두리의 요리사 모자 · 41 꿈나라 칫솔 기차 · 42 구름 베개
   ========================================================= */
addText({
  ko:{
    'th.milk.t':'우유 한 잔', 'th.milk.1':'반짝이가 우유를 꿀꺽꿀꺽 마셨어요.', 'th.milk.2':'우유를 마시면 이가 튼튼해진대!', 'th.milk.3':'자기 전에 우유 마시고 그냥 자면 내 차례!',
    'th.milk.4':'우유 마신 뒤에도 쓱쓱!', 'th.milk.5':'우유는 이를 튼튼하게, 양치는 이를 깨끗하게!',
    'th.water.t':'물이 최고', 'th.water.1':'뛰어놀다 보니 목이 말라요.', 'th.water.2':'달콤한 음료 마실래? 히히!', 'th.water.3':'나는 시원한 물이 좋아!',
    'th.water.4':'목마를 땐 물이 최고!', 'th.water.5':'목마를 땐 단 음료보다 물을 마셔요.',
    'th.crumb.t':'과자 부스러기 숨바꼭질', 'th.crumb.1':'과자를 먹었더니 부스러기가 데굴데굴.', 'th.crumb.2':'부스러기 속에 숨으면 아무도 모르지!', 'th.crumb.3':'킁킁, 어금니 홈에 숨었어!',
    'th.crumb.4':'어금니 홈은 앞뒤로 싹싹!', 'th.crumb.5':'과자를 먹은 뒤엔 어금니 홈까지 꼼꼼히.',
    'th.veggie.t':'채소 친구들', 'th.veggie.1':'채소 친구들이 놀러 왔어요.', 'th.veggie.2':'아삭아삭 씹으면 이도 튼튼해져!', 'th.veggie.3':'채소는 싫어~ 사탕이 최고야!',
    'th.veggie.4':'채소도 냠냠, 골고루 먹을래!', 'th.veggie.5':'아삭한 채소를 골고루 먹으면 이가 좋아해요.',
    'th.snack.t':'간식 시간 지키기', 'th.snack.1':'반짝이가 하루 종일 간식을 먹으려고 해요.', 'th.snack.2':'아무 때나 간식, 좋지 좋아!', 'th.snack.3':'띠링! 간식은 정해진 시간에!',
    'th.snack.4':'간식 시간 지키고, 먹은 뒤엔 물 한 모금!', 'th.snack.5':'간식은 정해진 시간에만 먹어요.',
    'th.cheese.t':'치즈 한 조각', 'th.cheese.1':'반짝이가 노란 치즈를 찾았어요.', 'th.cheese.2':'치즈는 이를 지켜 주는 간식이래!', 'th.cheese.3':'치즈 구멍은 내 비밀 기지다!',
    'th.cheese.4':'치즈 먹고 양치까지 하면 두 배로 튼튼!', 'th.cheese.5':'치즈 같은 간식도 좋지만, 먹은 뒤엔 양치!',
    'th.soda.t':'탄산 거품 소동', 'th.soda.1':'반짝이가 탄산음료 병을 흔들었어요.', 'th.soda.2':'으악, 거품이 퐁퐁 솟아!', 'th.soda.3':'탄산 거품 타고 이로 출발!',
    'th.soda.4':'탄산음료는 가끔만, 마신 뒤엔 물 한 모금!', 'th.soda.5':'단 음료는 가끔만 마셔요.',
    'th.chef.t':'두리의 요리사 모자', 'th.chef.1':'두리가 요리사 모자를 썼어요.', 'th.chef.2':'오늘은 내가 맛있는 요리를 할게!', 'th.chef.3':'맛있게 먹고 양치는 깜빡~ 그게 내 요리지!',
    'th.chef.4':'요리도 냠냠, 양치도 쓱쓱!', 'th.chef.5':'요리사의 마지막 순서는 양치!', 'th.chef.6':'맛있게 먹은 뒤의 마지막 순서는 양치예요.',
    'th.train.t':'꿈나라 칫솔 기차', 'th.train.1':'칙칙폭폭, 꿈나라 칫솔 기차가 왔어요.', 'th.train.2':'기차표는 어디서 사요?', 'th.train.3':'반짝반짝 닦은 이가 바로 기차표야!',
    'th.train.4':'나도 태워 줘! 이는 안 닦았지만~', 'th.train.5':'양치 안 하면 못 타!', 'th.train.6':'양치를 마치면 꿈나라 기차를 탈 수 있어요.',
    'th.pillow.t':'구름 베개', 'th.pillow.1':'폭신폭신 구름 베개가 둥실둥실.', 'th.pillow.2':'하암, 졸려. 바로 잘래.', 'th.pillow.3':'좋아, 양치 안 하고 자면 베개도 내 거!',
    'th.pillow.4':'양치하고 누워야 꿈도 포근하지!', 'th.pillow.5':'쿨쿨…', 'th.pillow.6':'양치하고 누우면 구름처럼 포근하게 잘 수 있어요.'
  },
  en:{
    'th.milk.t':'A Glass of Milk', 'th.milk.1':'Sparkle gulped down a glass of milk.', 'th.milk.2':'They say milk makes teeth strong!', 'th.milk.3':'Milk at bedtime and no brushing? My turn!',
    'th.milk.4':'Brush after milk too!', 'th.milk.5':'Milk makes teeth strong, brushing makes them clean!',
    'th.water.t':'Water Is Best', 'th.water.1':'After playing, everyone got thirsty.', 'th.water.2':'Want a sweet drink? Hee hee!', 'th.water.3':'I like cool water!',
    'th.water.4':"When you're thirsty, water is best!", 'th.water.5':"When you're thirsty, drink water instead of sweet drinks.",
    'th.crumb.t':'Hide-and-Seek Crumbs', 'th.crumb.1':'After snack time, crumbs rolled everywhere.', 'th.crumb.2':'Hide in the crumbs and nobody knows!', 'th.crumb.3':'Sniff sniff, it\'s hiding in the back-tooth grooves!',
    'th.crumb.4':'Scrub the grooves back and forth!', 'th.crumb.5':'After snacks, brush all the way into the grooves.',
    'th.veggie.t':'Veggie Friends', 'th.veggie.1':'The veggie friends came to play.', 'th.veggie.2':'Crunch crunch, chewing makes teeth strong!', 'th.veggie.3':'Yuck, veggies! Candy is the best!',
    'th.veggie.4':"I'll munch veggies too, a bit of everything!", 'th.veggie.5':'Teeth love crunchy veggies.',
    'th.snack.t':'Snack Time Rules', 'th.snack.1':'Sparkle wants to snack all day long.', 'th.snack.2':'Snacks anytime? Yes please!', 'th.snack.3':'Ding! Snacks only at snack time!',
    'th.snack.4':'Keep snack time, and sip some water after!', 'th.snack.5':'Eat snacks only at snack time.',
    'th.cheese.t':'A Slice of Cheese', 'th.cheese.1':'Sparkle found a yellow piece of cheese.', 'th.cheese.2':'They say cheese is a tooth-friendly snack!', 'th.cheese.3':'The cheese holes are my secret base!',
    'th.cheese.4':'Cheese plus brushing makes teeth twice as strong!', 'th.cheese.5':'Cheese is a nice snack, but brush after eating!',
    'th.soda.t':'The Fizzy Soda Mess', 'th.soda.1':'Sparkle shook a bottle of soda.', 'th.soda.2':'Whoa, the fizz is bubbling over!', 'th.soda.3':'Riding the fizz, off to the teeth!',
    'th.soda.4':'Soda only once in a while, and a sip of water after!', 'th.soda.5':'Sweet drinks are only for once in a while.',
    'th.chef.t':"Duri's Chef Hat", 'th.chef.1':'Duri put on a chef hat.', 'th.chef.2':"Today I'll cook something yummy!", 'th.chef.3':'Eat it all and forget to brush, that\'s my recipe!',
    'th.chef.4':'Yummy food, then brush brush!', 'th.chef.5':"A chef's last step is brushing!", 'th.chef.6':'After a yummy meal, the last step is brushing.',
    'th.train.t':'The Dreamland Toothbrush Train', 'th.train.1':'Choo choo! The dreamland toothbrush train is here.', 'th.train.2':'Where do I get a ticket?', 'th.train.3':'Your sparkly clean teeth are the ticket!',
    'th.train.4':"Let me ride too! I didn't brush, though~", 'th.train.5':"No brushing, no riding!", 'th.train.6':'Finish brushing, and you can ride the dreamland train.',
    'th.pillow.t':'The Cloud Pillow', 'th.pillow.1':'A fluffy cloud pillow floated by.', 'th.pillow.2':"Yawn, I'm sleepy. Straight to bed.", 'th.pillow.3':'Sleep without brushing? Then the pillow is mine!',
    'th.pillow.4':'Brush, then lie down for cozy dreams!', 'th.pillow.5':'Zzz…', 'th.pillow.6':'Brush before bed and sleep as cozy as a cloud.'
  },
  ja:{
    'th.milk.t':'ぎゅうにゅう いっぱい', 'th.milk.1':'キラリが ぎゅうにゅうを ごくごく のんだよ。', 'th.milk.2':'ぎゅうにゅうを のむと はが じょうぶに なるんだって!', 'th.milk.3':'ねる まえに ぎゅうにゅうを のんで そのまま ねたら、おれの ばんだ!',
    'th.milk.4':'ぎゅうにゅうの あとも ゴシゴシ!', 'th.milk.5':'ぎゅうにゅうで じょうぶに、はみがきで きれいに!',
    'th.water.t':'おみずが いちばん', 'th.water.1':'いっぱい あそんで のどが かわいたよ。', 'th.water.2':'あまい ジュース のむ? ひひっ!', 'th.water.3':'ぼくは つめたい おみずが すき!',
    'th.water.4':'のどが かわいたら おみずが いちばん!', 'th.water.5':'のどが かわいたら、あまい のみものより おみずを のもう。',
    'th.crumb.t':'おかしの くずと かくれんぼ', 'th.crumb.1':'おかしを たべたら、くずが ころころ。', 'th.crumb.2':'くずの なかに かくれたら だれにも わからないぞ!', 'th.crumb.3':'くんくん、おくばの みぞに かくれてる!',
    'th.crumb.4':'おくばの みぞは まえうしろに シャカシャカ!', 'th.crumb.5':'おかしの あとは、おくばの みぞまで ていねいに。',
    'th.veggie.t':'やさいの ともだち', 'th.veggie.1':'やさいの ともだちが あそびに きたよ。', 'th.veggie.2':'シャキシャキ かむと はも じょうぶに なるよ!', 'th.veggie.3':'やさいは いやだ〜 キャンディが いちばん!',
    'th.veggie.4':'やさいも もぐもぐ、なんでも たべるよ!', 'th.veggie.5':'シャキシャキ やさいを いろいろ たべると、はが よろこぶよ。',
    'th.snack.t':'おやつの じかんを まもろう', 'th.snack.1':'キラリが いちにちじゅう おやつを たべようと しているよ。', 'th.snack.2':'いつでも おやつ、いいね いいね!', 'th.snack.3':'ピピピ! おやつは きまった じかんに!',
    'th.snack.4':'おやつの じかんを まもって、たべたら おみずを ひとくち!', 'th.snack.5':'おやつは きまった じかんだけ。',
    'th.cheese.t':'チーズ ひとかけ', 'th.cheese.1':'キラリが きいろい チーズを みつけたよ。', 'th.cheese.2':'チーズは はを まもる おやつなんだって!', 'th.cheese.3':'チーズの あなは おれの ひみつきちだ!',
    'th.cheese.4':'チーズを たべて はみがきも したら、2ばい じょうぶ!', 'th.cheese.5':'チーズも いいけど、たべた あとは はみがき!',
    'th.soda.t':'たんさんの あわ さわぎ', 'th.soda.1':'キラリが たんさんの びんを ふっちゃった。', 'th.soda.2':'うわあ、あわが ぽこぽこ!', 'th.soda.3':'あわに のって はへ しゅっぱつ!',
    'th.soda.4':'たんさんは ときどきだけ、のんだら おみずを ひとくち!', 'th.soda.5':'あまい のみものは ときどきだけ。',
    'th.chef.t':'ドゥリの コックさん ぼうし', 'th.chef.1':'ドゥリが コックさんの ぼうしを かぶったよ。', 'th.chef.2':'きょうは ぼくが おいしい りょうりを つくるね!', 'th.chef.3':'たべて はみがきを わすれる、それが おれの りょうりさ!',
    'th.chef.4':'りょうりも もぐもぐ、はみがきも ゴシゴシ!', 'th.chef.5':'コックさんの さいごの しごとは はみがき!', 'th.chef.6':'おいしく たべた あとの さいごは はみがきだよ。',
    'th.train.t':'ゆめの くにの はぶらし れっしゃ', 'th.train.1':'シュッシュッポッポ、ゆめの くにの はぶらし れっしゃが きたよ。', 'th.train.2':'きっぷは どこで かうの?', 'th.train.3':'ピカピカに みがいた はが きっぷだよ!',
    'th.train.4':'おれも のせて! はは みがいて ないけど〜', 'th.train.5':'はみがき しないと のれないよ!', 'th.train.6':'はみがきが おわったら、ゆめの くにの れっしゃに のれるよ。',
    'th.pillow.t':'くもの まくら', 'th.pillow.1':'ふわふわの くもの まくらが ぷかぷか。', 'th.pillow.2':'ふあぁ、ねむい。もう ねる。', 'th.pillow.3':'よし、はみがき しないで ねたら まくらも おれの もの!',
    'th.pillow.4':'はみがきしてから ねると、ゆめも ふかふか!', 'th.pillow.5':'すやすや…', 'th.pillow.6':'はみがきしてから ねると、くもみたいに ふかふか ねむれるよ。'
  }
});
(window.TH_EPS = window.TH_EPS || []).push(
  { id:'milk', ep:33, bg:'room', setup(c){ c.place(c.hero, 32, 5); c.place(c.pet, 10, 5); }, run: async (c) => {
    const mk = c.prop(TH_P.milk, 8, 48, 26, 4, 1.4);
    await Promise.all([c.line(null, 'th.milk.1'), c.pose(mk, P_WIG, 300, 4), c.pose(c.hero, P_TINY, 300, 4)]);
    mk.remove(); c.face(c.hero, 'happy');
    await Promise.all([c.line(c.hero, 'th.milk.2'), c.pose(c.hero, P_BIG, 700), c.cam(34, 24, 1.6, 700)]);
    await c.cam(50, 50, 1, 500);
    const b = c.boss(112, 5, 16); c.face(c.hero, null);
    await c.enter(b, 74, 900);
    await Promise.all([c.line(b, 'th.milk.3'), c.pose(b, P_YAWN, 700, 2)]);
    c.face(c.hero, 'determined');
    await Promise.all([c.line(c.pet, 'th.milk.4'), c.pose(c.pet, P_HOP, 350, 2)]);
    await c.defeat(b);
    await c.line(null, 'th.milk.5');
  } },
  { id:'water', ep:34, bg:'safari', setup(c){ c.place(c.hero, 22, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const du = c.cast('duri', 46, 5, 18);
    c.face(c.hero, 'sad');
    await Promise.all([c.line(null, 'th.water.1'), c.pose(c.hero, P_YAWN, 700, 2), c.pose(du, P_YAWN, 700, 2)]);
    const b = c.boss(112, 5, 16), sd = c.prop(TH_P.soda, 7, 112, 24, 4, 1.6);
    await Promise.all([c.enter(b, 78, 900), c.go(sd, 70, 24, 900)]);
    await Promise.all([c.line(b, 'th.water.2'), c.pose(sd, P_WIG, 300, 3), c.cam(74, 22, 1.6, 700)]);
    await c.cam(50, 50, 1, 500);
    await Promise.all([c.line(du, 'th.water.3'), c.pose(du, P_HOP, 380, 3)]);
    const wb = c.prop(TH_P.water, 8, 34, 26, 5, 1.7);
    c.snd('ding'); c.face(c.hero, 'happy'); await c.pose(wb, P_GROW, 500);
    await c.line(c.hero, 'th.water.4');
    wb.remove(); sd.remove();
    await c.defeat(b, 'rinse');
    await Promise.all([c.line(null, 'th.water.5'), c.pose(du, P_HOP, 400, 2)]);
  } },
  { id:'crumb', ep:35, bg:'room', setup(c){ c.place(c.hero, 28, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const ck = c.prop(TH_P.cookie, 10, 56, 24, 3);
    await c.pose(ck, P_TINY, 300, 2); ck.remove(); c.snd('pop');
    const cr = [44, 54, 64, 74].map((x, i) => c.prop(TH_P.crumb, 4, x, 5 + (i % 2) * 2, 2));
    await Promise.all([c.line(null, 'th.crumb.1'), ...cr.map((x, i) => c.pose(x, P_SPIN, 500 + i * 80))]);
    const b = c.boss(66, 5, 12);
    await Promise.all([c.line(b, 'th.crumb.2'), c.pose(b, P_TINY, 300, 4)]);
    await Promise.all([c.cam(66, 16, 2, 800), c.line(c.pet, 'th.crumb.3')]);
    await c.cam(50, 50, 1, 500);
    c.face(c.hero, 'determined');
    await c.line(c.hero, 'th.crumb.4');
    cr.forEach(x => x.remove());
    await c.defeat(b, 'brush');
    await c.line(null, 'th.crumb.5');
  } },
  { id:'veggie', ep:36, bg:'garden', setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const ca = c.prop(TH_P.carrot, 10, 62, 5, 3, 1.6), bc = c.prop(TH_P.broccoli, 12, 78, 5, 3, 1.2);
    await Promise.all([c.line(null, 'th.veggie.1'), c.pose(ca, P_HOP, 400, 2), c.pose(bc, P_HOP, 400, 2)]);
    await Promise.all([c.line(ca, 'th.veggie.2'), c.cam(68, 18, 1.6, 700)]);
    await c.cam(50, 50, 1, 500);
    const b = c.boss(50, 34, 12); c.snd('boing'); await c.pose(b, P_GROW, 500);
    await Promise.all([c.line(b, 'th.veggie.3'), c.pose(b, P_WIG, 320, 3)]);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(c.hero, 'th.veggie.4'), c.pose(c.hero, P_HOP, 380, 3)]);
    await c.defeat(b);
    await Promise.all([c.line(null, 'th.veggie.5'), c.pose(ca, P_HOP, 420, 2), c.pose(bc, P_HOP, 420, 2)]);
  } },
  { id:'snack', ep:37, bg:'room', setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 10, 5); }, run: async (c) => {
    const ks = [52, 62, 72].map((x, i) => c.prop(TH_P.cookie, 8, x, 5 + i * 9, 3));
    await Promise.all([c.line(null, 'th.snack.1'), ...ks.map((k, i) => c.pose(k, P_TINY, 360 + i * 60, 3))]);
    const b = c.boss(80, 30, 12); c.snd('boing'); await c.pose(b, P_GROW, 500);
    await Promise.all([c.line(b, 'th.snack.2'), c.pose(b, P_HOP, 320, 3)]);
    const ck = c.prop(TH_P.clock, 12, 50, 62, 6);
    c.snd('beep'); await c.pose(ck, P_SHAKE, 200, 4);
    await Promise.all([c.line(ck, 'th.snack.3'), c.cam(50, 60, 1.6, 600)]);
    await c.cam(50, 50, 1, 500);
    c.face(c.hero, 'determined');
    await c.line(c.hero, 'th.snack.4');
    ks.forEach(k => k.remove()); ck.remove();
    await c.defeat(b);
    await c.line(null, 'th.snack.5');
  } },
  { id:'cheese', ep:38, bg:'town', setup(c){ c.place(c.hero, 26, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const ch = c.prop(TH_P.cheese, 16, 62, 5, 2, .72);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.cheese.1'), c.cam(56, 20, 1.5, 800)]);
    await Promise.all([c.line(c.pet, 'th.cheese.2'), c.pose(c.pet, P_HOP, 380, 2)]);
    await c.cam(50, 50, 1, 500);
    const b = c.boss(64, 10, 10); c.snd('boing'); c.face(c.hero, 'surprised');
    await c.pose(b, P_GROW, 500);
    await Promise.all([c.line(b, 'th.cheese.3'), c.pose(b, P_TINY, 300, 4)]);
    c.face(c.hero, 'determined');
    await c.line(c.hero, 'th.cheese.4');
    await c.defeat(b);
    await Promise.all([c.line(null, 'th.cheese.5'), c.pose(ch, P_HOP, 420, 2)]);
  } },
  { id:'soda', ep:39, bg:'room', setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 10, 5); }, run: async (c) => {
    const sd = c.prop(TH_P.soda, 8, 52, 26, 4, 1.6);
    await Promise.all([c.line(null, 'th.soda.1'), c.pose(sd, P_SHAKE, 160, 8)]);
    c.snd('pop'); c.face(c.hero, 'surprised');
    await Promise.all([c.line(c.hero, 'th.soda.2'), c.shower(TH_P.fizz, 10, 1800, 8), c.quake(600)]);
    const b = c.boss(52, 40, 12); c.snd('boing');
    await Promise.all([c.pose(b, P_GROW, 400), c.cam(52, 38, 1.6, 600)]);
    await Promise.all([c.line(b, 'th.soda.3'), c.pose(b, P_HOP, 300, 3)]);
    await c.cam(50, 50, 1, 500);
    c.face(c.hero, 'determined');
    await c.line(c.pet, 'th.soda.4');
    sd.remove();
    await c.defeat(b);
    await c.line(null, 'th.soda.5');
  } },
  { id:'chef', ep:40, bg:'town', setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const du = c.cast('duri', 58, 5, 20), hat = c.prop(TH_P.chefHat, 12, 58, 26, 4, .9);
    await Promise.all([c.line(null, 'th.chef.1'), c.pose(du, P_HOP, 380, 2), c.pose(hat, P_HOP, 380, 2)]);
    const sp = c.prop(TH_P.soup, 14, 78, 5, 2, .66);
    await Promise.all([c.line(du, 'th.chef.2'), c.cam(64, 20, 1.6, 700), c.pose(sp, P_TINY, 300, 4)]);
    await c.cam(50, 50, 1, 500);
    const b = c.boss(78, 24, 12); c.snd('boing'); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(b, 'th.chef.3'), c.pose(b, P_WIG, 300, 3)]);
    c.face(c.hero, 'determined');
    await c.line(c.hero, 'th.chef.4');
    sp.remove();
    await c.defeat(b);
    await Promise.all([c.line(du, 'th.chef.5'), c.pose(du, P_HOP, 400, 2), c.pose(hat, P_HOP, 400, 2)]);
    await c.line(null, 'th.chef.6');
  } },
  { id:'train', ep:41, bg:'nightsky', setup(c){ c.place(c.hero, 22, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const tr = c.prop(TH_P.train, 44, 130, 6, 2, .37);
    c.snd('music');
    await Promise.all([c.line(null, 'th.train.1'), c.go(tr, 66, 6, 1600, 'ease-out')]);
    await Promise.all([c.line(c.hero, 'th.train.2'), c.cam(26, 22, 1.6, 700)]);
    await c.cam(50, 50, 1, 500);
    const cc = c.cast('coco', 66, 18, 16);
    c.snd('ding'); await c.pose(cc, P_GROW, 500);
    await Promise.all([c.line(cc, 'th.train.3'), c.pose(cc, P_HOP, 380, 2)]);
    const b = c.boss(-12, 5, 14); c.face(c.hero, 'surprised');
    await c.enter(b, 38, 900);
    await Promise.all([c.line(b, 'th.train.4'), c.pose(b, P_HOP, 320, 3)]);
    c.face(c.hero, 'determined');
    await c.line(c.pet, 'th.train.5');
    await c.defeat(b, 'pet');
    cc.remove();
    await Promise.all([c.go(c.hero, 66, 22, 800), c.pose(c.hero, P_HOP, 400, 2)]);
    c.snd('music');
    await Promise.all([c.go(tr, -60, 6, 1800, 'ease-in'), c.go(c.hero, -40, 22, 1800, 'ease-in')]);
    await c.iris(true, 500); c.place(c.hero, 40, 5); await c.iris(false, 600);
    await c.line(null, 'th.train.6');
  } },
  { id:'pillow', ep:42, bg:'sky', setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 10, 5); }, run: async (c) => {
    const pl = c.prop(TH_P.pillow, 30, 66, 30, 2, .45);
    await Promise.all([c.line(null, 'th.pillow.1'), c.pose(pl, P_TINY, 700, 2)]);
    c.face(c.hero, 'sleep');
    await Promise.all([c.line(c.hero, 'th.pillow.2'), c.pose(c.hero, P_YAWN, 900, 2)]);
    const b = c.boss(66, 40, 12); c.snd('boing'); c.face(c.hero, 'surprised');
    await Promise.all([c.pose(b, P_GROW, 500), c.cam(66, 38, 1.7, 600)]);
    await Promise.all([c.line(b, 'th.pillow.3'), c.pose(b, P_HOP, 320, 3)]);
    await c.cam(50, 50, 1, 500);
    c.face(c.hero, 'determined');
    await c.line(c.pet, 'th.pillow.4');
    await c.defeat(b);
    await Promise.all([c.go(c.hero, 62, 30, 900), c.pose(c.hero, P_HOP, 450, 2)]);
    c.face(c.hero, 'sleep'); c.floatProp(TH_P.zzz, 6, 70, 62);
    await c.line(c.hero, 'th.pillow.5');
    await c.line(null, 'th.pillow.6');
    c.face(c.hero, 'happy'); c.place(c.hero, 40, 5);
  } }
);
