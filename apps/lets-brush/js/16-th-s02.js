'use strict';

/* =========================================================
   반짝이 극장 이야기 묶음 2 (v0.51.0): 3시즌 「계절 · 명절」 21 ~ 30
     season 이 붙은 편 = 그 명절 기간 첫 양치에만 (평소 차례에서는 빠짐, 해마다 다시)
       21 설날 떡국 (seollal) · 23 어린이날 선물 (childrensday · 나라별 어린이날) · 26 추석 보름달 (chuseok)
       27 핼러윈 사탕 바구니 (halloween) · 29 크리스마스 양치 (xmas) · 30 반짝반짝 새해 (newyear)
     평소 차례: 22 봄 소풍 도시락 · 24 여름 바다 물놀이 · 25 한여름 밤 반딧불 · 28 첫눈이 왔어요
   ========================================================= */
addText({
  ko:{
    'th.seollal.t':'설날 떡국 한 그릇', 'th.seollal.1':'설날 아침, 반짝이가 떡국을 먹었어요.', 'th.seollal.2':'떡국 한 그릇 먹으면 한 살 더 먹는 거래!', 'th.seollal.3':'떡이 이에 쫀득쫀득 붙었지롱!',
    'th.seollal.4':'새해 첫 양치, 같이 하자!', 'th.seollal.5':'새해 복 많이 받으세요!', 'th.seollal.6':'맛있게 먹은 뒤엔 꼭 양치해요.',
    'th.picnic.t':'봄 소풍 도시락', 'th.picnic.1':'따뜻한 봄날, 다 같이 소풍을 갔어요.', 'th.picnic.2':'도시락 냠냠, 정말 맛있다!', 'th.picnic.3':'여기엔 칫솔이 없지? 히히!',
    'th.picnic.4':'칫솔이 없을 땐 물로 입을 헹구면 돼!', 'th.picnic.5':'집에 가면 쓱쓱 양치까지 하면 완벽!',
    'th.kidsday.t':'어린이날 선물', 'th.kidsday.1':'오늘은 어린이날! 선물 상자가 도착했어요.', 'th.kidsday.2':'두근두근, 뭐가 들었을까?', 'th.kidsday.3':'짜잔! 선물 대신 내가 왔지!',
    'th.kidsday.4':'진짜 선물은 우리가 지킬래!', 'th.kidsday.5':'반짝반짝 새 칫솔이다!', 'th.kidsday.6':'튼튼한 이는 내가 나에게 주는 선물이에요.',
    'th.summer.t':'여름 바다 물놀이', 'th.summer.1':'뜨거운 여름, 바다에서 첨벙첨벙!', 'th.summer.2':'반짝이, 같이 물놀이하자!', 'th.summer.3':'시원한 아이스크림도 먹었는데…',
    'th.summer.4':'여름엔 단 간식 파티지!', 'th.summer.5':'물결이 세균을 데려갔어!', 'th.summer.6':'시원한 간식을 먹은 뒤에도 양치를 잊지 마요.',
    'th.firefly.t':'한여름 밤 반딧불', 'th.firefly.1':'여름밤, 풀숲에 반딧불이 반짝였어요.', 'th.firefly.2':'어두워서 세균이 안 보여.', 'th.firefly.3':'깜깜할 땐 숨기 딱 좋지!',
    'th.firefly.4':'반딧불아, 비춰 줘!', 'th.firefly.5':'밝은 곳에서 꼼꼼히 닦으면 숨은 세균도 찾아요.',
    'th.chuseok.t':'추석 보름달', 'th.chuseok.1':'추석날 밤, 둥근 보름달이 떴어요.', 'th.chuseok.2':'달에서 토끼가 떡을 찧고 있대!', 'th.chuseok.3':'송편 먹고 안 닦으면 내 세상!',
    'th.chuseok.4':'보름달에게 소원 빌고, 양치도 하자!', 'th.chuseok.5':'우리 가족 모두 이가 튼튼하게 해 주세요!', 'th.chuseok.6':'맛있는 명절 음식 뒤에도 양치는 꼭!',
    'th.halloween.t':'핼러윈 사탕 바구니', 'th.halloween.1':'핼러윈 밤, 사탕 바구니가 가득 찼어요.', 'th.halloween.2':'사탕 주면 장난 안 칠게~ 히히!', 'th.halloween.3':'사탕은 조금만, 그리고 양치는 꼭!',
    'th.halloween.4':'{pet}도 변장했어!', 'th.halloween.5':'사탕을 먹은 날엔 더 꼼꼼히 양치해요.',
    'th.snow.t':'첫눈이 왔어요', 'th.snow.1':'하얀 첫눈이 펑펑 내렸어요.', 'th.snow.2':'우리 눈사람 만들자!', 'th.snow.3':'눈사람처럼 이도 하얗게 반짝!',
    'th.snow.4':'추우니까 양치는 내일 해~', 'th.snow.5':'추운 날엔 미지근한 물로 닦으면 돼!', 'th.snow.6':'추운 날에도 양치는 쉬지 않아요.',
    'th.xmas.t':'크리스마스 양치', 'th.xmas.1':'크리스마스이브, 트리에 불이 반짝여요.', 'th.xmas.2':'산타 할아버지 오시기 전에 뭘 할까?', 'th.xmas.3':'선물 양말에 끈적 사탕을 잔뜩 넣었지!',
    'th.xmas.4':'자기 전에 양치하면 산타도 웃을 거야!', 'th.xmas.5':'반짝이는 이로 활짝 웃는 크리스마스!',
    'th.newyear.t':'반짝반짝 새해', 'th.newyear.1':'하나, 둘, 셋! 새해가 밝았어요!', 'th.newyear.2':'올해 약속은 뭘로 할까?', 'th.newyear.3':'약속은 금방 까먹을걸?',
    'th.newyear.4':'아침저녁 양치 약속, 꼭 지킬 거야!', 'th.newyear.5':'올해도 반짝반짝!', 'th.newyear.6':'새해 약속: 하루 두 번 양치!'
  },
  en:{
    'th.seollal.t':'A Bowl of New Year Soup', 'th.seollal.1':'On Lunar New Year morning, Sparkle ate rice cake soup.', 'th.seollal.2':'They say one bowl makes you one year older!', 'th.seollal.3':'Sticky rice cake stuck to the teeth!',
    'th.seollal.4':"Let's do the first brushing of the year together!", 'th.seollal.5':'Happy New Year!', 'th.seollal.6':'After a yummy meal, always brush.',
    'th.picnic.t':'Spring Picnic Lunch', 'th.picnic.1':'On a warm spring day, everyone went on a picnic.', 'th.picnic.2':'Munch munch, lunch is so yummy!', 'th.picnic.3':'No toothbrush out here, right? Hee hee!',
    'th.picnic.4':'No toothbrush? Rinse your mouth with water!', 'th.picnic.5':'Then brush at home, and it\'s perfect!',
    'th.kidsday.t':"Children's Day Present", 'th.kidsday.1':"It's Children's Day! A present box arrived.", 'th.kidsday.2':"So exciting, what's inside?", 'th.kidsday.3':'Ta-da! You got me instead!',
    'th.kidsday.4':"We'll protect the real present!", 'th.kidsday.5':'A shiny new toothbrush!', 'th.kidsday.6':'Strong teeth are a present you give yourself.',
    'th.summer.t':'Summer at the Beach', 'th.summer.1':'Hot summer, splashing at the beach!', 'th.summer.2':"Sparkle, let's play in the water!", 'th.summer.3':'We had ice cream, too…',
    'th.summer.4':'Summer means sweet snack parties!', 'th.summer.5':'The wave took the germ away!', 'th.summer.6':"After cold sweet treats, don't forget to brush.",
    'th.firefly.t':'Fireflies on a Summer Night', 'th.firefly.1':'On a summer night, fireflies twinkled in the grass.', 'th.firefly.2':"It's too dark to see the germs.", 'th.firefly.3':'The dark is perfect for hiding!',
    'th.firefly.4':'Fireflies, light it up!', 'th.firefly.5':'Brush carefully in good light, and you find hidden germs.',
    'th.chuseok.t':'The Chuseok Full Moon', 'th.chuseok.1':'On Chuseok night, a round full moon rose.', 'th.chuseok.2':'They say a rabbit on the moon makes rice cakes!', 'th.chuseok.3':'Eat rice cakes and skip brushing? My kind of night!',
    'th.chuseok.4':"Let's make a wish to the moon, and brush too!", 'th.chuseok.5':'Please keep everyone in my family\'s teeth strong!', 'th.chuseok.6':'After holiday treats, always brush.',
    'th.halloween.t':'The Halloween Candy Basket', 'th.halloween.1':'On Halloween night, the candy basket was full.', 'th.halloween.2':"Give me candy and I won't play tricks~ Hee hee!", 'th.halloween.3':'Just a little candy, and always brush!',
    'th.halloween.4':'{pet} is in costume too!', 'th.halloween.5':'On candy days, brush extra carefully.',
    'th.snow.t':'The First Snow', 'th.snow.1':'The first white snow came falling down.', 'th.snow.2':"Let's build a snowman!", 'th.snow.3':'White and sparkly, like snowman teeth!',
    'th.snow.4':"It's cold, so brush tomorrow~", 'th.snow.5':'On cold days, brush with lukewarm water!', 'th.snow.6':'Even on cold days, we never skip brushing.',
    'th.xmas.t':'Christmas Brushing', 'th.xmas.1':'On Christmas Eve, the tree lights twinkled.', 'th.xmas.2':'What should we do before Santa comes?', 'th.xmas.3':'I stuffed the stocking with sticky candy!',
    'th.xmas.4':'Brush before bed, and Santa will smile!', 'th.xmas.5':'A Christmas full of sparkly smiles!',
    'th.newyear.t':'A Sparkly New Year', 'th.newyear.1':"Three, two, one! It's a new year!", 'th.newyear.2':"What's our promise for this year?", 'th.newyear.3':"You'll forget your promise in no time!",
    'th.newyear.4':"Brushing morning and night, that's my promise!", 'th.newyear.5':'Sparkly all year long!', 'th.newyear.6':'New Year promise: brush twice a day!'
  },
  ja:{
    'th.seollal.t':'ソルラルの トックク', 'th.seollal.1':'かんこくの おしょうがつの あさ、キラリは トッククを たべたよ。', 'th.seollal.2':'トッククを たべると ひとつ おにいさんに なるんだって!', 'th.seollal.3':'おもちが はに ねばねば くっついたぞ!',
    'th.seollal.4':'しんねん はじめての はみがき、いっしょに しよう!', 'th.seollal.5':'あけまして おめでとう!', 'th.seollal.6':'おいしく たべた あとは かならず はみがき。',
    'th.picnic.t':'はるの えんそく おべんとう', 'th.picnic.1':'あたたかい はるの ひ、みんなで えんそくに いったよ。', 'th.picnic.2':'おべんとう もぐもぐ、おいしい!', 'th.picnic.3':'ここには はぶらしが ないだろう? ひひっ!',
    'th.picnic.4':'はぶらしが ない ときは、おみずで くちを すすげば いいよ!', 'th.picnic.5':'おうちに かえって はみがきしたら かんぺき!',
    'th.kidsday.t':'こどもの ひの プレゼント', 'th.kidsday.1':'きょうは こどもの ひ! プレゼントの はこが とどいたよ。', 'th.kidsday.2':'ドキドキ、なにが はいってるかな?', 'th.kidsday.3':'じゃーん! プレゼントの かわりに おれさまだ!',
    'th.kidsday.4':'ほんものの プレゼントは ぼくたちが まもる!', 'th.kidsday.5':'ピカピカの あたらしい はぶらしだ!', 'th.kidsday.6':'じょうぶな はは、じぶんへの プレゼントだよ。',
    'th.summer.t':'なつの うみあそび', 'th.summer.1':'あつい なつ、うみで ばしゃばしゃ!', 'th.summer.2':'キラリ、いっしょに みずあそび しよう!', 'th.summer.3':'つめたい アイスも たべたけど…',
    'th.summer.4':'なつは あまい おやつ パーティーだ!', 'th.summer.5':'なみが ばいきんを つれていったよ!', 'th.summer.6':'つめたい おやつの あとも はみがきを わすれずに。',
    'th.firefly.t':'なつの よるの ほたる', 'th.firefly.1':'なつの よる、くさむらで ほたるが ひかったよ。', 'th.firefly.2':'くらくて ばいきんが みえない。', 'th.firefly.3':'まっくらは かくれるのに ぴったりだ!',
    'th.firefly.4':'ほたるさん、てらして!', 'th.firefly.5':'あかるい ところで ていねいに みがくと、かくれた ばいきんも みつかるよ。',
    'th.chuseok.t':'チュソクの まんげつ', 'th.chuseok.1':'チュソクの よる、まんまるの おつきさまが でたよ。', 'th.chuseok.2':'おつきさまで うさぎが おもちを ついてるんだって!', 'th.chuseok.3':'おもちを たべて みがかなければ おれの せかいだ!',
    'th.chuseok.4':'おつきさまに おねがいして、はみがきも しよう!', 'th.chuseok.5':'かぞく みんなの はが じょうぶで ありますように!', 'th.chuseok.6':'おいしい ごちそうの あとも はみがきは かならず!',
    'th.halloween.t':'ハロウィンの おかし かご', 'th.halloween.1':'ハロウィンの よる、おかしの かごが いっぱいに なったよ。', 'th.halloween.2':'おかし くれたら いたずら しないぞ〜 ひひっ!', 'th.halloween.3':'おかしは すこしだけ、そして はみがきは かならず!',
    'th.halloween.4':'{pet}も かそう したよ!', 'th.halloween.5':'おかしを たべた ひは、もっと ていねいに みがこう。',
    'th.snow.t':'はつゆきが ふったよ', 'th.snow.1':'しろい はつゆきが ふわふわ ふってきたよ。', 'th.snow.2':'ゆきだるま つくろう!', 'th.snow.3':'ゆきだるまみたいに はも まっしろ ピカピカ!',
    'th.snow.4':'さむいから はみがきは あしたで いいよ〜', 'th.snow.5':'さむい ひは ぬるい おみずで みがけば いいよ!', 'th.snow.6':'さむい ひも はみがきは おやすみ しないよ。',
    'th.xmas.t':'クリスマスの はみがき', 'th.xmas.1':'クリスマスイブ、ツリーの あかりが キラキラ。', 'th.xmas.2':'サンタさんが くる まえに なにを しようか?', 'th.xmas.3':'くつしたに ねばねば キャンディを いっぱい いれたぞ!',
    'th.xmas.4':'ねる まえに はみがきしたら、サンタさんも にっこり!', 'th.xmas.5':'ピカピカの はで にっこり クリスマス!',
    'th.newyear.t':'ピカピカの しんねん', 'th.newyear.1':'さん、に、いち! あたらしい としが きたよ!', 'th.newyear.2':'ことしの やくそくは なんに しよう?', 'th.newyear.3':'やくそくなんて すぐ わすれるさ!',
    'th.newyear.4':'あさと よるの はみがき、ぜったい まもる!', 'th.newyear.5':'ことしも ピカピカ!', 'th.newyear.6':'しんねんの やくそく: いちにち 2かい はみがき!'
  }
});
(window.TH_EPS = window.TH_EPS || []).push(
  { id:'seollal', ep:21, season:'seollal', bg:'room', setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 10, 5); }, run: async (c) => {
    const sp = c.prop(TH_P.soup, 16, 58, 6, 3, .66);
    await Promise.all([c.line(null, 'th.seollal.1'), c.pose(c.hero, P_TINY, 400, 3)]);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(c.hero, 'th.seollal.2'), c.cam(40, 24, 1.6, 800)]);
    await c.cam(50, 50, 1, 500);
    const b = c.boss(58, 20, 13); sp.remove();
    c.snd('boing'); c.face(c.hero, 'surprised'); await c.pose(b, P_GROW, 500);
    await Promise.all([c.line(b, 'th.seollal.3'), c.pose(b, P_WIG, 320, 4)]);
    c.face(c.hero, 'determined');
    await Promise.all([c.line(c.pet, 'th.seollal.4'), c.pose(c.pet, P_HOP, 350, 2)]);
    await c.defeat(b);
    await Promise.all([c.line(c.hero, 'th.seollal.5'), c.pose(c.hero, P_SQ, 500, 2), c.pose(c.pet, P_SQ, 500, 2)]);
    await c.line(null, 'th.seollal.6');
  } },
  { id:'picnic', ep:22, bg:'bird', setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const pp = c.cast('pipi', 76, 5, 20), lb = c.prop(TH_P.lunchbox, 18, 50, 5, 2, .58);
    await Promise.all([c.line(null, 'th.picnic.1'), c.pose(pp, P_HOP, 400, 2), c.pose(c.hero, P_HOP, 400, 2)]);
    await Promise.all([c.line(pp, 'th.picnic.2'), c.pose(lb, P_TINY, 350, 4)]);
    const b = c.boss(50, 16, 12); lb.remove();
    c.snd('boing'); await c.pose(b, P_GROW, 500);
    await Promise.all([c.line(b, 'th.picnic.3'), c.cam(50, 24, 1.7, 700), c.pose(b, P_WIG, 320, 3)]);
    await c.cam(50, 50, 1, 500);
    const wb = c.prop(TH_P.water, 8, 34, 24, 5, 1.7);
    c.snd('ding'); await c.pose(wb, P_GROW, 500);
    await c.line(c.hero, 'th.picnic.4');
    wb.remove();
    await c.defeat(b, 'rinse');
    await Promise.all([c.line(null, 'th.picnic.5'), c.pose(pp, P_HOP, 420, 2), c.pose(c.hero, P_HOP, 420, 2)]);
  } },
  { id:'kidsday', ep:23, season:'childrensday', bg:'room', setup(c){ c.place(c.hero, 28, 5); c.place(c.pet, 10, 5); }, run: async (c) => {
    const gf = c.prop(TH_P.gift, 16, 62, 5, 3);
    await Promise.all([c.line(null, 'th.kidsday.1'), c.pose(gf, P_HOP, 400, 3)]);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(c.hero, 'th.kidsday.2'), c.cam(52, 22, 1.6, 900), c.pose(gf, P_WIG, 260, 4)]);
    gf.remove(); c.snd('pop');
    const b = c.boss(62, 5, 18);
    c.face(c.hero, 'surprised');
    await Promise.all([c.line(b, 'th.kidsday.3'), c.quake(500), c.pose(b, P_BIG, 700)]);
    await c.cam(50, 50, 1, 500);
    c.face(c.hero, 'determined');
    await c.line(c.pet, 'th.kidsday.4');
    await c.defeat(b);
    const nb = c.prop(TH_P.brushNew, 22, 60, 30, 5, .45);
    c.snd('fanfare'); c.burst(nb, 10);
    await Promise.all([c.line(c.hero, 'th.kidsday.5'), c.pose(nb, P_BIG, 700), c.pose(c.hero, P_HOP, 400, 2)]);
    await c.line(null, 'th.kidsday.6');
  } },
  { id:'summer', ep:24, bg:'sea', setup(c){ c.place(c.hero, 24, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const mg = c.cast('mongi', 70, 14, 20), sun = c.prop(TH_P.sun, 14, 84, 76, 1);
    await Promise.all([c.line(null, 'th.summer.1'), c.pose(sun, P_SPIN, 1800), c.pose(c.hero, P_HOP, 380, 3)]);
    await Promise.all([c.line(mg, 'th.summer.2'), c.pose(mg, P_HOP, 380, 3)]);
    const ic = c.prop(TH_P.icecream, 8, 38, 30, 5, 1.5);
    c.face(c.hero, 'sad');
    await Promise.all([c.line(c.hero, 'th.summer.3'), c.cam(32, 24, 1.6, 800)]);
    ic.remove(); await c.cam(50, 50, 1, 500);
    const b = c.boss(112, 30, 16);
    await Promise.all([c.go(b, 66, 30, 900), c.pose(b, P_WIG, 300, 3)]);
    await Promise.all([c.line(b, 'th.summer.4'), c.pose(b, P_HOP, 340, 3)]);
    await c.defeat(b, 'rinse');
    await Promise.all([c.line(mg, 'th.summer.5'), c.pose(mg, P_HOP, 380, 3)]);
    await c.line(null, 'th.summer.6');
  } },
  { id:'firefly', ep:25, bg:'bug', night:true, setup(c){ c.place(c.hero, 26, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const ff = [[40, 60], [62, 70], [80, 54], [20, 66]].map(([x, y]) => c.prop(TH_P.firefly, 6, x, y, 6));
    await Promise.all([c.line(null, 'th.firefly.1'), ...ff.map((f, i) => c.pose(f, P_TINY, 500 + i * 80, 3))]);
    c.face(c.hero, 'sad');
    await Promise.all([c.line(c.hero, 'th.firefly.2'), c.cam(26, 24, 1.6, 800)]);
    await c.cam(50, 50, 1, 500);
    const b = c.boss(76, 5, 16); b.style.opacity = '.35';
    await Promise.all([c.line(b, 'th.firefly.3'), c.pose(b, P_WIG, 320, 3)]);
    c.face(c.hero, 'determined');
    c.say(c.pet, 'th.firefly.4'); c.snd('magic');
    await Promise.all(ff.map((f, i) => c.go(f, 66 + (i % 2) * 18, 16 + i * 6, 900)));
    b.style.opacity = '1'; c.burst(b, 8);
    await c.cam(76, 20, 1.6, 600); await c.wait(500); await c.cam(50, 50, 1, 500);
    await c.defeat(b);
    await Promise.all([c.line(null, 'th.firefly.5'), ...ff.map((f, i) => c.go(f, 10 + i * 24, 60 + (i % 2) * 14, 1200))]);
  } },
  { id:'chuseok', ep:26, season:'chuseok', bg:'nightsky', setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 10, 5); }, run: async (c) => {
    await Promise.all([c.line(null, 'th.chuseok.1'), c.cam(75, 70, 1.6, 1200)]);
    const rb = c.prop(TH_P.rabbit, 7, 72, 70, 3);
    c.snd('ding'); await c.pose(rb, P_HOP, 400, 2);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(c.hero, 'th.chuseok.2'), c.pose(rb, P_SQ, 300, 4)]);
    await c.cam(50, 50, 1, 700);
    const sp = c.prop(TH_P.songpyeon, 14, 56, 5, 2, .5), b = c.boss(60, 16, 12);
    c.snd('boing'); await c.pose(b, P_GROW, 500);
    await Promise.all([c.line(b, 'th.chuseok.3'), c.pose(b, P_WIG, 320, 3)]);
    c.face(c.hero, 'determined');
    await c.line(c.pet, 'th.chuseok.4');
    sp.remove();
    await c.defeat(b);
    await Promise.all([c.line(c.hero, 'th.chuseok.5'), c.cam(55, 55, 1.3, 1500), c.pose(rb, P_HOP, 400, 3)]);
    await c.cam(50, 50, 1, 500);
    await c.line(null, 'th.chuseok.6');
  } },
  { id:'halloween', ep:27, season:'halloween', bg:'castle', night:true, setup(c){ c.place(c.hero, 26, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const pk = c.prop(TH_P.pumpkin, 14, 58, 5, 2), cd = [52, 64].map(x => c.prop(TH_P.candy, 8, x, 18, 3, .53));
    await Promise.all([c.line(null, 'th.halloween.1'), ...cd.map(x => c.pose(x, P_TINY, 400, 3))]);
    const b = c.boss(112, 5, 18);
    await c.enter(b, 80, 900);
    await Promise.all([c.line(b, 'th.halloween.2'), c.cam(78, 22, 1.6, 700), c.pose(b, P_WIG, 300, 4)]);
    await c.cam(50, 50, 1, 500);
    c.face(c.hero, 'determined');
    await c.line(c.hero, 'th.halloween.3');
    await Promise.all([c.line(null, 'th.halloween.4'), c.pose(c.pet, P_SPIN, 700)]);
    cd.forEach(x => x.remove());
    await c.defeat(b);
    await Promise.all([c.line(null, 'th.halloween.5'), c.pose(pk, P_HOP, 400, 2)]);
  } },
  { id:'snow', ep:28, bg:'town', setup(c){ c.place(c.hero, 26, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    c.shower(TH_P.snowflake, 18, 3000, 3).catch(() => {});
    const cc = c.cast('coco', 72, 5, 20);
    await Promise.all([c.line(null, 'th.snow.1'), c.pose(c.hero, P_HOP, 420, 2)]);
    await Promise.all([c.line(cc, 'th.snow.2'), c.pose(cc, P_HOP, 380, 3)]);
    const sm = c.prop(TH_P.snowman, 14, 50, 5, 2, 1.3);
    c.snd('magic'); await c.pose(sm, P_GROW, 600);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(c.hero, 'th.snow.3'), c.cam(45, 22, 1.6, 800)]);
    await c.cam(50, 50, 1, 500);
    const b = c.boss(112, 5, 16); c.face(c.hero, null);
    await c.enter(b, 84, 900);
    await Promise.all([c.line(b, 'th.snow.4'), c.pose(b, P_YAWN, 700, 2)]);
    c.face(c.hero, 'determined');
    await c.line(c.pet, 'th.snow.5');
    await c.defeat(b, 'foam');
    c.shower(TH_P.snowflake, 12, 2200, 3).catch(() => {});
    await Promise.all([c.line(null, 'th.snow.6'), c.pose(cc, P_HOP, 400, 2)]);
  } },
  { id:'xmas', ep:29, season:'xmas', bg:'room', night:true, setup(c){ c.place(c.hero, 26, 5); c.place(c.pet, 8, 5); }, run: async (c) => {
    const tr = c.prop(TH_P.tree, 22, 74, 5, 2, 1.2);
    await Promise.all([c.line(null, 'th.xmas.1'), c.cam(74, 26, 1.5, 1000), c.pose(tr, P_TINY, 500, 3)]);
    await c.cam(50, 50, 1, 600);
    c.face(c.hero, 'happy');
    await c.line(c.hero, 'th.xmas.2');
    const sk = c.prop(TH_P.sock, 9, 56, 26, 3, 1.25), b = c.boss(56, 36, 12);
    c.snd('boing'); c.face(c.hero, 'surprised'); await c.pose(b, P_GROW, 500);
    await Promise.all([c.line(b, 'th.xmas.3'), c.pose(sk, P_WIG, 300, 3)]);
    c.face(c.hero, 'determined');
    await c.line(c.pet, 'th.xmas.4');
    await c.defeat(b);
    sk.remove();
    c.shower(TH_P.snowflake, 14, 2400, 3).catch(() => {}); c.burst(tr, 10); c.snd('fanfare');
    await Promise.all([c.line(null, 'th.xmas.5'), c.pose(c.hero, P_HOP, 420, 3), c.pose(c.pet, P_HOP, 420, 3)]);
  } },
  { id:'newyear', ep:30, season:'newyear', bg:'nightsky', setup(c){ c.place(c.hero, 30, 5); c.place(c.pet, 10, 5); }, run: async (c) => {
    c.snd('fanfare');
    const fw = [[24, 66], [52, 78], [78, 62]].map(([x, y]) => c.prop(TH_P.firework, 16, x, y, 1));
    await Promise.all([c.line(null, 'th.newyear.1'), ...fw.map((f, i) => c.pose(f, P_GROW, 500 + i * 200))]);
    c.face(c.hero, 'happy');
    await Promise.all([c.line(c.hero, 'th.newyear.2'), c.cam(30, 24, 1.6, 800)]);
    await c.cam(50, 50, 1, 500);
    const b = c.boss(112, 5, 16); c.face(c.hero, null);
    await c.enter(b, 76, 900);
    await Promise.all([c.line(b, 'th.newyear.3'), c.pose(b, P_WIG, 320, 3)]);
    c.face(c.hero, 'determined');
    await Promise.all([c.line(c.pet, 'th.newyear.4'), c.pose(c.pet, P_BIG, 700)]);
    await c.defeat(b);
    fw.forEach((f, i) => c.pose(f, P_GROW, 500 + i * 150).catch(() => {}));
    await Promise.all([c.line(c.hero, 'th.newyear.5'), c.pose(c.hero, P_HOP, 400, 3)]);
    await c.line(null, 'th.newyear.6');
  } }
);
