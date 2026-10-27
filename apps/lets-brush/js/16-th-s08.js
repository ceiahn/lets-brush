'use strict';

/* =========================================================
   반짝이 극장 이야기 묶음 8 (v0.51.0): 9시즌 「섬 여행」 84 ~ 90 + 10시즌 「대장 세균」 91 ~ 93
     84 초코 숲의 부엉이 · 85 거품 바다 항해 · 86 거품 바다 등대 · 87 별빛 섬의 밤 · 88 별빛 섬 천문대
     89 무지개 성의 문 · 90 무지개 성 축제 · 91 대장 세균의 사과 · 92 대장 세균의 첫 칫솔 · 93 친구 소개 앨범
     (90.5 이가 아픈 임금님 · 92.5 늪의 세균 떼 는 16-theater.js)
   ========================================================= */
addText({
  ko:{
    'th.owl.t':'초코 숲의 부엉이', 'th.owl.1':'초코 숲 깊은 곳에 부엉이가 살아요.', 'th.owl.2':'부엉부엉… 오늘 밤 이를 닦은 친구는 누구지?', 'th.owl.3':'저요! 자기 전에 꼭 닦아요!',
    'th.owl.4':'쉿, 나는 안 닦았지롱. 몰래 숨어야지!', 'th.owl.5':'부엉이 눈은 다 보인단다!', 'th.owl.6':'밤에 닦는 양치가 하루 중 가장 중요해요.',
    'th.sail.t':'거품 바다 항해', 'th.sail.1':'배를 타고 거품 바다로 출발!', 'th.sail.2':'바다가 온통 보글보글 거품이야!', 'th.sail.3':'치약을 몽땅 짜서 거품 파도를 만들 테다!',
    'th.sail.4':'치약은 콩알만큼이면 충분해!', 'th.sail.5':'치약은 콩알만큼, 거품은 꼼꼼히.',
    'th.lighthouse.t':'거품 바다 등대', 'th.lighthouse.1':'밤바다에 등대 불빛이 희미해졌어요.', 'th.lighthouse.2':'등대 유리에 세균이 잔뜩 붙었어!', 'th.lighthouse.3':'깜깜하면 배들이 길을 잃겠지? 히히!',
    'th.lighthouse.4':'반짝반짝 닦아서 불을 밝히자!', 'th.lighthouse.5':'등대가 다시 환하게 바다를 비춰요.', 'th.lighthouse.6':'깨끗한 이는 웃을 때 등대처럼 반짝여요.',
    'th.starisle.t':'별빛 섬의 밤', 'th.starisle.1':'별빛 섬에 밤이 찾아왔어요.', 'th.starisle.2':'별이 하나, 둘, 셋… 너무 예쁘다!', 'th.starisle.3':'별을 세다 보면 양치는 까먹겠지?',
    'th.starisle.4':'별 세기 전에 양치 먼저!', 'th.starisle.5':'잠들기 전 양치는 꼭 먼저 해요.',
    'th.observatory.t':'별빛 섬 천문대', 'th.observatory.1':'천문대에 커다란 망원경이 있어요.', 'th.observatory.2':'망원경으로 보니 저 별에 세균이 숨어 있어!', 'th.observatory.3':'멀리 있으면 아무도 못 찾을걸!',
    'th.observatory.4':'자세히 보면 다 보이지!', 'th.observatory.5':'거울로 이 안쪽까지 자세히 살펴봐요.',
    'th.rbgate.t':'무지개 성의 문', 'th.rbgate.1':'무지개 성 앞에 도착했어요.', 'th.rbgate.2':'문이 끈적끈적 잠겨 있어!', 'th.rbgate.3':'암호를 말해야 열어 주지!',
    'th.rbgate.4':'암호는… 치카치카 반짝반짝!', 'th.rbgate.5':'딩동댕! 문이 활짝 열렸어요.', 'th.rbgate.6':'좋은 습관은 어떤 문이든 열어 줘요.',
    'th.rbfest.t':'무지개 성 축제', 'th.rbfest.1':'무지개 성에서 축제가 열렸어요!', 'th.rbfest.2':'풍선이랑 깃발이 가득해!', 'th.rbfest.3':'축제 케이크는 내가 끈적하게 만들 테다!',
    'th.rbfest.4':'축제가 끝나면 다 같이 양치하자!', 'th.rbfest.5':'신나게 먹은 날일수록 양치는 꼼꼼히.',
    'th.sorry.t':'대장 세균의 사과', 'th.sorry.1':'오늘은 {boss}{boss|이/가} 혼자 시무룩해요.', 'th.sorry.2':'왜 그렇게 슬퍼 보여?', 'th.sorry.3':'그동안 이를 괴롭혀서… 미안해.',
    'th.sorry.4':'사과해 줘서 고마워! 이제 친구 하자!', 'th.sorry.5':'정말? 나랑 친구 해 줄 거야?', 'th.sorry.6':'미안해, 고마워. 마음도 반짝반짝 닦아요.',
    'th.firstbrush.t':'대장 세균의 첫 칫솔', 'th.firstbrush.1':'{boss}에게 선물을 주기로 했어요.', 'th.firstbrush.2':'짜잔! 너만의 칫솔이야!', 'th.firstbrush.3':'이걸로 어떻게 하는 거야?',
    'th.firstbrush.4':'위아래로 쓱쓱, 동글동글!', 'th.firstbrush.5':'우와, 상쾌해! 나 반짝반짝해졌어!', 'th.firstbrush.6':'칫솔은 한 사람에 하나씩, 나만의 칫솔로 닦아요.',
    'th.album.t':'친구 소개 앨범', 'th.album.1':'반짝이가 친구 앨범을 펼쳤어요.', 'th.album.2':'꽃 요정 피피! 꽃처럼 향긋하게 닦아.', 'th.album.3':'물방울 인어 몽이! 헹굼은 몽이가 최고야.',
    'th.album.4':'아기 유니콘 코코! 무지개 거품을 만들어.', 'th.album.5':'아기 공룡 두리! 꼭꼭 씹기 대장이야.', 'th.album.6':'그리고 {pet}! 늘 함께하는 짝꿍!', 'th.album.7':'친구들과 함께라서 양치가 즐거워요.'
  },
  en:{
    'th.owl.t':'The Owl of the Chocolate Forest', 'th.owl.1':'An owl lives deep in the chocolate forest.', 'th.owl.2':'Hoo hoo… who brushed their teeth tonight?', 'th.owl.3':'Me! I always brush before bed!',
    'th.owl.4':"Shh, I didn't brush. I'll sneak away!", 'th.owl.5':'Owl eyes see everything!', 'th.owl.6':'Bedtime brushing is the most important of the day.',
    'th.sail.t':'Sailing the Foam Sea', 'th.sail.1':'All aboard for the Foam Sea!', 'th.sail.2':'The whole sea is bubbly foam!', 'th.sail.3':"I'll squeeze ALL the toothpaste and make foam waves!",
    'th.sail.4':'A pea-sized dab is plenty!', 'th.sail.5':'A pea-sized dab of toothpaste, and brush every spot.',
    'th.lighthouse.t':'The Foam Sea Lighthouse', 'th.lighthouse.1':'The lighthouse light grew dim over the night sea.', 'th.lighthouse.2':'Germs are stuck all over the lighthouse glass!', 'th.lighthouse.3':'In the dark, the boats will get lost! Hee hee!',
    'th.lighthouse.4':"Let's polish it bright!", 'th.lighthouse.5':'The lighthouse shines over the sea again.', 'th.lighthouse.6':'Clean teeth shine like a lighthouse when you smile.',
    'th.starisle.t':'Night on Starlight Island', 'th.starisle.1':'Night came to Starlight Island.', 'th.starisle.2':'One star, two, three… so pretty!', 'th.starisle.3':"Counting stars, they'll forget to brush!",
    'th.starisle.4':'Brush first, then count stars!', 'th.starisle.5':'Always brush first before you fall asleep.',
    'th.observatory.t':'The Starlight Observatory', 'th.observatory.1':'The observatory has a giant telescope.', 'th.observatory.2':"Through the telescope, there's a germ hiding on that star!", 'th.observatory.3':"So far away, nobody will find me!",
    'th.observatory.4':'Look closely and you see everything!', 'th.observatory.5':'Use a mirror to check deep inside your mouth.',
    'th.rbgate.t':'The Rainbow Castle Gate', 'th.rbgate.1':'They arrived at the Rainbow Castle.', 'th.rbgate.2':'The gate is stuck shut with goo!', 'th.rbgate.3':'Say the password, or it stays shut!',
    'th.rbgate.4':'The password is… brush brush, sparkle sparkle!', 'th.rbgate.5':'Ding ding! The gate swung open.', 'th.rbgate.6':'Good habits open every door.',
    'th.rbfest.t':'The Rainbow Castle Festival', 'th.rbfest.1':'A festival began at the Rainbow Castle!', 'th.rbfest.2':'Balloons and flags everywhere!', 'th.rbfest.3':"I'll make the festival cake all sticky!",
    'th.rbfest.4':"After the festival, let's all brush together!", 'th.rbfest.5':'The more fun you eat, the more carefully you brush.',
    'th.sorry.t':"The Boss Germ's Apology", 'th.sorry.1':'Today {boss} looks sad all alone.', 'th.sorry.2':'Why do you look so sad?', 'th.sorry.3':"I bothered everyone's teeth… I'm sorry.",
    'th.sorry.4':"Thanks for saying sorry! Let's be friends!", 'th.sorry.5':'Really? You want to be my friend?', 'th.sorry.6':'Sorry and thank you make hearts sparkle too.',
    'th.firstbrush.t':"The Boss Germ's First Toothbrush", 'th.firstbrush.1':'They decided to give {boss} a present.', 'th.firstbrush.2':'Ta-da! A toothbrush just for you!', 'th.firstbrush.3':'How do I use it?',
    'th.firstbrush.4':'Up and down, round and round!', 'th.firstbrush.5':"Wow, so fresh! I'm all sparkly!", 'th.firstbrush.6':'One toothbrush per person. Brush with your very own.',
    'th.album.t':'The Friends Album', 'th.album.1':'Sparkle opened the friends album.', 'th.album.2':'Pipi the flower sprite! Brushes fresh as a flower.', 'th.album.3':'Mongi the water-drop mermaid! The rinsing champ.',
    'th.album.4':'Coco the baby unicorn! Makes rainbow foam.', 'th.album.5':'Duri the baby dino! The chewing champ.', 'th.album.6':'And {pet}! My buddy, always by my side!', 'th.album.7':'With friends, brushing is so much fun.'
  },
  ja:{
    'th.owl.t':'チョコの もりの フクロウ', 'th.owl.1':'チョコの もりの おくに フクロウが すんでいるよ。', 'th.owl.2':'ホーホー… こんや はを みがいたのは だれかな?', 'th.owl.3':'はーい! ねる まえに かならず みがくよ!',
    'th.owl.4':'しーっ、おれは みがいてないぞ。こっそり かくれよう!', 'th.owl.5':'フクロウの めは ぜんぶ みえるのさ!', 'th.owl.6':'よるの はみがきが いちにちで いちばん だいじ。',
    'th.sail.t':'あわの うみの こうかい', 'th.sail.1':'ふねに のって あわの うみへ しゅっぱつ!', 'th.sail.2':'うみが ぜんぶ ぶくぶく あわだ!', 'th.sail.3':'はみがきこを ぜんぶ しぼって あわの なみを つくるぞ!',
    'th.sail.4':'はみがきこは おまめ くらいで じゅうぶん!', 'th.sail.5':'はみがきこは おまめ くらい、みがくのは ていねいに。',
    'th.lighthouse.t':'あわの うみの とうだい', 'th.lighthouse.1':'よるの うみで とうだいの あかりが くらく なったよ。', 'th.lighthouse.2':'とうだいの ガラスに ばいきんが いっぱい!', 'th.lighthouse.3':'まっくらだと ふねが まいごに なるぞ! ひひっ!',
    'th.lighthouse.4':'ピカピカに みがいて あかりを つけよう!', 'th.lighthouse.5':'とうだいが また うみを あかるく てらしたよ。', 'th.lighthouse.6':'きれいな はは わらうと とうだいみたいに ひかるよ。',
    'th.starisle.t':'ほしの しまの よる', 'th.starisle.1':'ほしの しまに よるが きたよ。', 'th.starisle.2':'ほしが ひとつ、ふたつ、みっつ… きれい!', 'th.starisle.3':'ほしを かぞえてたら はみがきを わすれるだろう?',
    'th.starisle.4':'ほしを かぞえる まえに はみがき!', 'th.starisle.5':'ねむる まえの はみがきは さきに しようね。',
    'th.observatory.t':'ほしの しまの てんもんだい', 'th.observatory.1':'てんもんだいに おおきな ぼうえんきょうが あるよ。', 'th.observatory.2':'ぼうえんきょうで みたら、あの ほしに ばいきんが かくれてる!', 'th.observatory.3':'とおくに いれば だれにも みつからないぞ!',
    'th.observatory.4':'よーく みれば ぜんぶ みえるよ!', 'th.observatory.5':'かがみで くちの おくまで よく みてみよう。',
    'th.rbgate.t':'にじの おしろの もん', 'th.rbgate.1':'にじの おしろの まえに ついたよ。', 'th.rbgate.2':'もんが ねばねばで しまってる!', 'th.rbgate.3':'あいことばを いわないと あけないぞ!',
    'th.rbgate.4':'あいことばは… シャカシャカ ピカピカ!', 'th.rbgate.5':'ピンポーン! もんが ひらいたよ。', 'th.rbgate.6':'いい しゅうかんは どんな もんも ひらくよ。',
    'th.rbfest.t':'にじの おしろの おまつり', 'th.rbfest.1':'にじの おしろで おまつりが はじまったよ!', 'th.rbfest.2':'ふうせんと はたが いっぱい!', 'th.rbfest.3':'おまつりの ケーキを ねばねばに してやる!',
    'th.rbfest.4':'おまつりの あとは みんなで はみがき!', 'th.rbfest.5':'たのしく たべた ひほど、はみがきは ていねいに。',
    'th.sorry.t':'ばいきん たいしょうの ごめんね', 'th.sorry.1':'きょうは {boss}が ひとりで しょんぼり。', 'th.sorry.2':'どうして そんなに かなしそうなの?', 'th.sorry.3':'ずっと はを いじめて… ごめんね。',
    'th.sorry.4':'あやまって くれて ありがとう! ともだちに なろう!', 'th.sorry.5':'ほんと? ともだちに なって くれるの?', 'th.sorry.6':'ごめんねと ありがとうで、こころも ピカピカ。',
    'th.firstbrush.t':'ばいきん たいしょうの はじめての はぶらし', 'th.firstbrush.1':'{boss}に プレゼントを あげる ことに したよ。', 'th.firstbrush.2':'じゃーん! きみだけの はぶらしだよ!', 'th.firstbrush.3':'これ、どうやって つかうの?',
    'th.firstbrush.4':'うえ したに ゴシゴシ、くるくる!', 'th.firstbrush.5':'わあ、すっきり! ピカピカに なった!', 'th.firstbrush.6':'はぶらしは ひとり ひとつ。じぶんの はぶらしで みがこう。',
    'th.album.t':'ともだち しょうかい アルバム', 'th.album.1':'キラリが ともだちの アルバムを ひらいたよ。', 'th.album.2':'はなの ようせい ピピ! おはなみたいに いい かおり。', 'th.album.3':'しずくの にんぎょ モンイ! すすぎの めいじん。',
    'th.album.4':'あかちゃん ユニコーン ココ! にじいろの あわを つくるよ。', 'th.album.5':'あかちゃん きょうりゅう ドゥリ! かみかみ めいじん。', 'th.album.6':'そして {pet}! いつも いっしょの なかよし!', 'th.album.7':'ともだちと いっしょだと はみがきが たのしいね。'
  }
});
(window.TH_EPS = window.TH_EPS || []).push(
  { id:'owl', ep:84, bg:'choco', night:true, setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const ow = c.prop(TH_P.owl, 12, 70, 52, 3, 1.1);
    await Promise.all([c.line(null, 'th.owl.1'), c.cam(70, 56, 1.8, 1000)]);
    await Promise.all([c.line(ow, 'th.owl.2'), c.pose(ow, P_LOOK, 700)]);
    await c.cam(50, 50, 1, 400);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(c.hero, 'th.owl.3'), c.pose(c.hero, P_HOP, 380, 2)]);
    const b = c.boss(88, 5, 12); await c.go(b, 92, 5, 300);
    await Promise.all([c.line(b, 'th.owl.4'), c.go(b, 104, 5, 1600), c.pose(b, P_WALK, 320, 4)]);
    c.snd('ding'); await c.go(b, 84, 5, 400);
    await Promise.all([c.line(ow, 'th.owl.5'), c.pose(ow, P_BIG, 600)]);
    c.face(c.hero, 'determined');
    await c.defeat(b);
    await c.line(null, 'th.owl.6');
  } },
  { id:'sail', ep:85, bg:'sea', setup(c){ c.place(c.hero, -10, 14); c.place(c.pet, -24, 14); }, run: async (c) => {
    const bt = c.prop(TH_P.boat, 40, -16, 2, 2, .7);
    c.snd('whoosh');
    await Promise.all([c.line(null, 'th.sail.1'), c.go(bt, 34, 2, 1800), c.go(c.hero, 40, 14, 1800), c.go(c.pet, 26, 14, 1800)]);
    c.face(c.hero, 'happy');
    [0, 1, 2, 3].forEach(i => setTimeout(() => c.floatProp(TH_P.bubble, 5, 20 + i * 20, 10), i * 220));
    await c.line(c.hero, 'th.sail.2');
    const tb = c.prop(TH_P.tube, 22, 80, 40, 4, .4), b = c.boss(80, 52, 11);
    await Promise.all([c.line(b, 'th.sail.3'), c.pose(tb, P_SQ, 260, 3), c.cam(80, 50, 1.6, 600)]);
    c.shower(TH_P.bubble, 10, 1500, 6).catch(() => {});
    c.face(c.hero, 'surprised'); await Promise.all([c.cam(50, 50, 1, 400), c.pose(bt, P_SHAKE, 220, 4)]);
    c.face(c.hero, 'determined');
    const pe = c.prop(TH_P.pea, 8, 44, 40, 5, .75);
    await Promise.all([c.line(c.pet, 'th.sail.4'), c.pose(pe, P_TINY, 300, 3)]);
    pe.remove(); tb.remove();
    await c.defeat(b, 'rinse');
    await c.line(null, 'th.sail.5');
  } },
  { id:'lighthouse', ep:86, bg:'sea', night:true, setup(c){ c.place(c.hero, 22, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const lh = c.prop(TH_P.lighthouseDim, 18, 72, 5, 2, 1.8);
    await Promise.all([c.line(null, 'th.lighthouse.1'), c.cam(72, 40, 1.5, 900)]);
    c.face(c.hero, 'surprised');
    await c.line(c.hero, 'th.lighthouse.2');
    const b = c.boss(74, 50, 9); c.snd('boing'); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(b, 'th.lighthouse.3'), c.pose(b, P_WIG, 300, 3)]);
    await c.cam(50, 50, 1, 400);
    c.face(c.hero, 'determined');
    await c.line(c.hero, 'th.lighthouse.4');
    await c.defeat(b, 'brush');
    c.restyle(lh, TH_P.lighthouse); c.snd('magic'); c.burst(lh, 8);
    const bm = c.prop(TH_P.beam, 50, 50, 46, 1, .5);
    await Promise.all([c.line(null, 'th.lighthouse.5'), c.pose(bm, P_TINY, 500, 2)]);
    c.face(c.hero, 'happy');
    await c.line(null, 'th.lighthouse.6');
  } },
  { id:'starisle', ep:87, bg:'nightsky', setup(c){ c.place(c.hero, 26, 5); c.place(c.pet, 10, 5); }, run: async (c) => {
    await Promise.all([c.line(null, 'th.starisle.1'), c.cam(50, 70, 1.4, 1200)]);
    c.face(c.hero, 'happy');
    for (let i = 0; i < 3; i++){ c.snd('ding', i * 4); c.floatProp(TH_P.star, 5, 30 + i * 20, 70); await c.wait(300); }
    await Promise.all([c.cam(50, 50, 1, 500), c.line(c.hero, 'th.starisle.2')]);
    const b = c.boss(112, 5, 13); await c.enter(b, 76, 800);
    await Promise.all([c.line(b, 'th.starisle.3'), c.pose(b, P_HOP, 320, 3)]);
    c.face(c.hero, 'determined');
    await Promise.all([c.line(c.pet, 'th.starisle.4'), c.pose(c.pet, P_BIG, 600)]);
    await c.defeat(b);
    await c.line(null, 'th.starisle.5');
  } },
  { id:'observatory', ep:88, bg:'nightsky', setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 12, 5); }, run: async (c) => {
    const ts = c.prop(TH_P.telescope, 20, 46, 5, 2, .85);
    await Promise.all([c.line(null, 'th.observatory.1'), c.pose(ts, P_TINY, 500, 2)]);
    const st = c.prop(TH_P.star, 7, 82, 76, 2), b = c.boss(82, 76, 4);
    await Promise.all([c.cam(82, 76, 3, 900)]);
    c.face(c.hero, 'surprised');
    await c.line(c.hero, 'th.observatory.2');
    await Promise.all([c.line(b, 'th.observatory.3'), c.pose(b, P_WIG, 300, 3)]);
    await c.cam(50, 50, 1, 500);
    await Promise.all([c.go(b, 76, 5, 1000, 'ease-in'), c.morph(b, 'scale(3)', 1000)]);
    c.place(b, 76, 5); b.style.width = '13%'; b.style.marginLeft = '-6.5%'; b.w = 13;
    c.face(c.hero, 'determined');
    await c.line(c.hero, 'th.observatory.4');
    await c.defeat(b);
    c.burst(st, 6); c.snd('magic');
    await c.line(null, 'th.observatory.5');
  } },
  { id:'rbgate', ep:89, bg:'castle', setup(c){ c.place(c.hero, 20, 5); c.place(c.pet, 6, 5); }, run: async (c) => {
    const gt = c.prop(TH_P.bridge, 40, 60, 5, 2, .5), gb = c.prop(TH_P.blob, 18, 60, 6, 3, .5);
    await Promise.all([c.line(null, 'th.rbgate.1'), c.cam(56, 30, 1.4, 900)]);
    c.face(c.hero, 'surprised');
    await Promise.all([c.line(c.hero, 'th.rbgate.2'), c.pose(gb, P_SQ, 300, 3)]);
    const b = c.boss(60, 40, 10); c.snd('boing'); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(b, 'th.rbgate.3'), c.pose(b, P_HOP, 300, 3)]);
    await c.cam(50, 50, 1, 400);
    c.face(c.hero, 'happy'); c.brush(c.hero, true);
    await Promise.all([c.line(c.hero, 'th.rbgate.4'), c.pose(c.hero, P_SHAKE, 260, 4), c.pose(c.pet, P_HOP, 380, 3)]);
    c.brush(c.hero, false);
    c.snd('fanfare'); gb.remove(); c.burst(gt, 9);
    await Promise.all([c.line(null, 'th.rbgate.5'), c.pose(gt, P_BIG, 700)]);
    await c.defeat(b, 'song');
    await c.line(null, 'th.rbgate.6');
  } },
  { id:'rbfest', ep:90, bg:'castle', setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const bl = c.many(TH_P.balloon, 4, 60, 6, 2), fl = c.prop(TH_P.flagParade, 8, 88, 5, 2, 1.5), ck = c.prop(TH_ART3.cake, 14, 60, 5, 3);
    const cc = c.cast('coco', 76, 5, 16);
    c.snd('fanfare');
    await Promise.all([c.line(null, 'th.rbfest.1'), ...bl.map((x, i) => c.pose(x, P_TINY, 400 + i * 60, 3))]);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(cc, 'th.rbfest.2'), c.pose(cc, P_HOP, 380, 3), c.pose(fl, P_WIG, 300, 3)]);
    const b = c.boss(60, 30, 10); c.snd('boing'); await c.pose(b, P_GROW, 400);
    await Promise.all([c.line(b, 'th.rbfest.3'), c.cam(60, 24, 1.7, 600), c.pose(ck, P_SHAKE, 220, 4)]);
    await c.cam(50, 50, 1, 400);
    c.face(c.hero, 'determined');
    await c.defeat(b);
    c.shower(TH_P.candyStar, 8, 1400, 3).catch(() => {});
    await Promise.all([c.line(c.hero, 'th.rbfest.4'), c.pose(cc, P_HOP, 400, 2)]);
    await c.line(null, 'th.rbfest.5');
  } },
  { id:'sorry', ep:91, bg:'castle', setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const b = c.boss(72, 5, 14), td = c.prop(TH_P.tear, 3, 74, 22, 4);
    await Promise.all([c.line(null, 'th.sorry.1'), c.cam(72, 18, 1.6, 900), c.go(td, 74, 10, 900)]);
    td.remove();
    await c.cam(50, 50, 1, 400);
    c.face(c.hero, 'sad');
    await c.line(c.hero, 'th.sorry.2');
    await Promise.all([c.line(b, 'th.sorry.3'), c.pose(b, P_SQ, 400, 2)]);
    c.face(c.hero, 'happy');
    await Promise.all([c.go(c.hero, 52, 5, 700), c.pose(c.hero, P_WALK, 300, 2)]);
    c.floatProp(TH_P.heart, 6, 62, 26); c.snd('magic');
    await c.line(c.hero, 'th.sorry.4');
    await Promise.all([c.line(b, 'th.sorry.5'), c.pose(b, P_HOP, 340, 3), c.pose(c.pet, P_HOP, 380, 2)]);
    c.burst(b, 6);
    await c.line(null, 'th.sorry.6');
  } },
  { id:'firstbrush', ep:92, bg:'bath', setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const b = c.boss(70, 5, 14), gf = c.prop(TH_P.gift, 10, 46, 5, 4);
    await Promise.all([c.line(null, 'th.firstbrush.1'), c.pose(gf, P_TINY, 400, 3)]);
    c.face(c.hero, 'happy');
    c.snd('pop'); c.burst(gf, 6); c.restyle(gf, TH_P.brushNew);
    await Promise.all([c.line(c.hero, 'th.firstbrush.2'), c.go(gf, 60, 12, 700)]);
    await Promise.all([c.line(b, 'th.firstbrush.3'), c.pose(b, P_LOOK, 700), c.cam(64, 18, 1.6, 600)]);
    await c.cam(50, 50, 1, 400);
    c.brush(c.hero, true);
    await Promise.all([c.line(c.hero, 'th.firstbrush.4'), c.pose(c.hero, P_SHAKE, 260, 4), c.pose(gf, P_SHAKE, 260, 4)]);
    c.brush(c.hero, false);
    c.snd('magic'); c.burst(b, 9);
    await Promise.all([c.line(b, 'th.firstbrush.5'), c.pose(b, P_SPIN, 600), c.pose(c.pet, P_HOP, 380, 2)]);
    await c.line(null, 'th.firstbrush.6');
  } },
  { id:'album', ep:93, bg:'room', setup(c){ c.place(c.hero, 20, 5); c.place(c.pet, 6, 5); }, run: async (c) => {
    const al = c.prop(TH_P.album, 16, 40, 5, 4, .7);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(null, 'th.album.1'), c.pose(al, P_TINY, 400, 2)]);
    const who = [['pipi', 'th.album.2', 60], ['mongi', 'th.album.3', 72], ['coco', 'th.album.4', 84], ['duri', 'th.album.5', 96]];
    for (const [nm, k, x] of who){
      const a = c.cast(nm, x, 5, 13); c.snd('pop'); c.burst(a, 4);
      await Promise.all([c.line(a, k), c.pose(a, P_HOP, 360, 2)]);
    }
    await Promise.all([c.line(c.pet, 'th.album.6'), c.pose(c.pet, P_BIG, 600)]);
    c.snd('fanfare');
    await c.line(null, 'th.album.7');
  } }
);
