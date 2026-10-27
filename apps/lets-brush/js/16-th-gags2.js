'use strict';

/* =========================================================
   아침 한 컷 극장 2 (v0.52.0): 31 ~ 60번째 (16-th-gags.js 와 합쳐 60개)
     고르기: 최근 20개는 안 고름 · 좋아요 한 것일수록 잘 뽑힘 (16-theater.js thPickGag)
     글: 한 · 영은 여기 (addText), 다른 언어는 lang/<code>.json (tools/lang.js)
   ========================================================= */
addText({
  ko:{
    'thg.echo.t':'메아리', 'thg.echo.1':'치카치카~', 'thg.echo.2':'(치카치카~)', 'thg.echo.3':'양치 최고~', 'thg.echo.4':'(양치 최고~)',
    'thg.trophy.t':'오늘의 양치 왕', 'thg.trophy.1':'오늘의 양치 왕은…', 'thg.trophy.2':'나야? 나 아직 안 닦았는데?', 'thg.trophy.3':'그럼 지금 같이 닦자!',
    'thg.beebuzz.t':'윙윙 꿀벌', 'thg.beebuzz.1':'윙윙~ 아침에 꿀 먹었니?', 'thg.beebuzz.2':'꿀 먹었으면 치카치카!',
    'thg.flutter.t':'나비 손님', 'thg.flutter.1':'어? 나비가 칫솔에 앉았어!', 'thg.flutter.2':'칫솔을 꽃인 줄 알았나 봐!', 'thg.flutter.3':'미안, 이건 내 칫솔이야~',
    'thg.snailrace.t':'달팽이와 시합', 'thg.snailrace.1':'누가 더 꼼꼼히 닦나 시합!', 'thg.snailrace.2':'나는 세 시간 동안 닦지~', 'thg.snailrace.3':'그건 너무 길어! 2분이면 돼!',
    'thg.whalespout.t':'고래 헹굼', 'thg.whalespout.1':'헹굴 땐 고래처럼…', 'thg.whalespout.2':'푸우우!', 'thg.whalespout.3':'세면대에 살살 뱉어요~',
    'thg.robobeep.t':'로봇 검사', 'thg.robobeep.1':'삐빅! 양치 검사 시작!', 'thg.robobeep.2':'앞니 통과, 어금니 통과…', 'thg.robobeep.3':'반짝 점수 100점! 삐빅!',
    'thg.penwalk.t':'펭귄 산책', 'thg.penwalk.1':'뒤뚱뒤뚱, 나도 아침 산책!', 'thg.penwalk.2':'펭귄은 이가 없잖아?', 'thg.penwalk.3':'그래도 세수는 하지!',
    'thg.rainbowpaste.t':'무지개 치약', 'thg.rainbowpaste.1':'무지개 치약이면 좋겠다~', 'thg.rainbowpaste.2':'색은 몰라도 양은 알지?', 'thg.rainbowpaste.3':'콩알만큼!',
    'thg.snowmanbrush.t':'눈사람의 소원', 'thg.snowmanbrush.1':'나도 이가 있으면 좋겠다…', 'thg.snowmanbrush.2':'그럼 당근 코를 반짝반짝 닦아 줄게!', 'thg.snowmanbrush.3':'간지러워!',
    'thg.floaty.t':'두둥실', 'thg.floaty.1':'어? 몸이 둥실 떠!', 'thg.floaty.2':'양치는 땅에서 해야지~', 'thg.floaty.3':'휴, 내려왔다!',
    'thg.crumbstuck.t':'과자 부스러기', 'thg.crumbstuck.1':'이 사이에 뭐가 꼈어!', 'thg.crumbstuck.2':'물 한 모금 가글가글!', 'thg.crumbstuck.3':'그다음엔 칫솔로 쓱쓱!',
    'thg.icecold.t':'앗 차가워', 'thg.icecold.1':'아침부터 아이스크림!', 'thg.icecold.2':'앗, 이가 시려!', 'thg.icecold.3':'차가운 건 천천히 먹자~',
    'thg.burp.t':'뽀글뽀글 탄산', 'thg.burp.1':'뽀글뽀글 탄산음료!', 'thg.burp.2':'꺼억!', 'thg.burp.3':'마신 뒤엔 물로 헹구기!',
    'thg.minitree.t':'작은 나무', 'thg.minitree.1':'브로콜리는 작은 나무 같아!', 'thg.minitree.2':'이 사이에 끼면 나무가 자랄걸?', 'thg.minitree.3':'얼른 닦자!',
    'thg.bunnycarrot.t':'토끼의 당근', 'thg.bunnycarrot.1':'아삭아삭 당근!', 'thg.bunnycarrot.2':'토끼 이는 평생 자란대!', 'thg.bunnycarrot.3':'우리 이는 한 번만 바뀌니까 아껴요!',
    'thg.pjbrush.t':'잠옷 양치', 'thg.pjbrush.1':'잠옷 입고 양치해도 돼?', 'thg.pjbrush.2':'옷보다 양치가 먼저!', 'thg.pjbrush.3':'좋아, 치카치카!',
    'thg.dingdong.t':'땡땡 종소리', 'thg.dingdong.1':'땡땡! 땡땡!', 'thg.dingdong.2':'무슨 종이야?', 'thg.dingdong.3':'양치 시간 알리는 종이지!',
    'thg.kitewind.t':'바람에 연', 'thg.kitewind.1':'바람이 쌩쌩!', 'thg.kitewind.2':'연이 칫솔처럼 흔들흔들!', 'thg.kitewind.3':'위아래로 쓱쓱, 연처럼!',
    'thg.choochoo.t':'칙칙폭폭', 'thg.choochoo.1':'칙칙폭폭!', 'thg.choochoo.2':'이번 역은 양치역입니다~', 'thg.choochoo.3':'내릴게요! 치카치카!',
    'thg.magicwand.t':'수리수리', 'thg.magicwand.1':'수리수리 반짝!', 'thg.magicwand.2':'아무 일도 안 일어났어…', 'thg.magicwand.3':'양치가 진짜 마법이야!',
    'thg.sheepleft.t':'남은 양', 'thg.sheepleft.1':'아침인데 양이 왜 여기 있어?', 'thg.sheepleft.2':'어젯밤에 세다가 잠들었잖아~', 'thg.sheepleft.3':'음매~ 나도 양치할래!',
    'thg.dinoroar.t':'크앙 하품', 'thg.dinoroar.1':'하아암… 크앙!', 'thg.dinoroar.2':'크앙 하기 전에 치카치카!', 'thg.dinoroar.3':'크앙… 반짝!',
    'thg.unicornhorn.t':'뿔에 거품', 'thg.unicornhorn.1':'거품이 뿔에 묻었어!', 'thg.unicornhorn.2':'뿔이 아이스크림 됐다!', 'thg.unicornhorn.3':'히히, 물로 씻자~',
    'thg.dropcount.t':'물방울 셋', 'thg.dropcount.1':'물방울 하나, 둘, 셋!', 'thg.dropcount.2':'헹굼은 세 번이면 충분해~', 'thg.dropcount.3':'몽이 선생님 최고!',
    'thg.flowerbrush.t':'꽃향기 칫솔', 'thg.flowerbrush.1':'칫솔에서 꽃향기가 나!', 'thg.flowerbrush.2':'피피가 꽃잎 하나 놓고 갔어!', 'thg.flowerbrush.3':'꽃잎은 빼고 닦아요~',
    'thg.eightarms.t':'다리 여덟 개', 'thg.eightarms.1':'다리가 여덟 개니까 칫솔도 여덟 개!', 'thg.eightarms.2':'입은 하나뿐인데?', 'thg.eightarms.3':'그럼 칫솔도 하나!',
    'thg.slowturtle.t':'거북이 양치', 'thg.slowturtle.1':'천천히… 꼼꼼히…', 'thg.slowturtle.2':'거북이처럼 하나씩!', 'thg.slowturtle.3':'빠뜨린 이가 하나도 없네!',
    'thg.mouthscope.t':'입속 망원경', 'thg.mouthscope.1':'망원경으로 입속을 보자!', 'thg.mouthscope.2':'어금니 별 발견!', 'thg.mouthscope.3':'별도 반짝반짝 닦자!',
    'thg.medalday.t':'반짝 메달', 'thg.medalday.1':'매일 닦은 친구에게 메달!', 'thg.medalday.2':'내 거야?', 'thg.medalday.3':'오늘도 반짝, 내일도 반짝!'
  },
  en:{
    'thg.echo.t':'Echo', 'thg.echo.1':'Brush brush~', 'thg.echo.2':'(brush brush~)', 'thg.echo.3':'Brushing is the best~', 'thg.echo.4':'(the best~)',
    'thg.trophy.t':'Brushing Champ of the Day', 'thg.trophy.1':"Today's brushing champ is…", 'thg.trophy.2':"Me? But I haven't brushed yet!", 'thg.trophy.3':"Then let's brush together now!",
    'thg.beebuzz.t':'Buzzy Bee', 'thg.beebuzz.1':'Buzz~ did you have honey this morning?', 'thg.beebuzz.2':'If you had honey, brush brush!',
    'thg.flutter.t':'Butterfly Guest', 'thg.flutter.1':'Oh! A butterfly landed on my toothbrush!', 'thg.flutter.2':'It thinks the toothbrush is a flower!', 'thg.flutter.3':"Sorry, this one's mine~",
    'thg.snailrace.t':'Race with a Snail', 'thg.snailrace.1':'Who brushes most carefully? Race!', 'thg.snailrace.2':'I brush for three hours~', 'thg.snailrace.3':'Too long! Two minutes is enough!',
    'thg.whalespout.t':'Whale Rinse', 'thg.whalespout.1':'When you rinse, like a whale…', 'thg.whalespout.2':'Pfffoooo!', 'thg.whalespout.3':'Spit gently into the sink~',
    'thg.robobeep.t':'Robot Check', 'thg.robobeep.1':'Beep! Brushing check, start!', 'thg.robobeep.2':'Front teeth OK, back teeth OK…', 'thg.robobeep.3':'Sparkle score 100! Beep!',
    'thg.penwalk.t':'Penguin Walk', 'thg.penwalk.1':'Waddle waddle, my morning walk!', 'thg.penwalk.2':"Penguins don't have teeth, right?", 'thg.penwalk.3':'But I still wash my face!',
    'thg.rainbowpaste.t':'Rainbow Toothpaste', 'thg.rainbowpaste.1':'I wish toothpaste came in rainbow colors~', 'thg.rainbowpaste.2':'Whatever the color, you know how much?', 'thg.rainbowpaste.3':'Pea-sized!',
    'thg.snowmanbrush.t':"Snowman's Wish", 'thg.snowmanbrush.1':'I wish I had teeth…', 'thg.snowmanbrush.2':"Then I'll polish your carrot nose!", 'thg.snowmanbrush.3':'That tickles!',
    'thg.floaty.t':'Floating Up', 'thg.floaty.1':"Huh? I'm floating!", 'thg.floaty.2':'Brushing happens on the ground~', 'thg.floaty.3':"Phew, I'm back down!",
    'thg.crumbstuck.t':'Cookie Crumb', 'thg.crumbstuck.1':"Something's stuck between my teeth!", 'thg.crumbstuck.2':'A sip of water, swish swish!', 'thg.crumbstuck.3':'Then brush it away!',
    'thg.icecold.t':'Brrr, Cold!', 'thg.icecold.1':'Ice cream in the morning!', 'thg.icecold.2':'Ooh, my teeth feel cold!', 'thg.icecold.3':'Eat cold things slowly~',
    'thg.burp.t':'Fizzy Pop', 'thg.burp.1':'Fizzy, bubbly soda!', 'thg.burp.2':'BURP!', 'thg.burp.3':'After drinking, rinse with water!',
    'thg.minitree.t':'Tiny Tree', 'thg.minitree.1':'Broccoli looks like a tiny tree!', 'thg.minitree.2':"If it's stuck in your teeth, a tree might grow!", 'thg.minitree.3':"Let's brush, quick!",
    'thg.bunnycarrot.t':"Bunny's Carrot", 'thg.bunnycarrot.1':'Crunch crunch, carrot!', 'thg.bunnycarrot.2':"Bunny teeth keep growing forever!", 'thg.bunnycarrot.3':'Our teeth change only once, so take care of them!',
    'thg.pjbrush.t':'Pajama Brushing', 'thg.pjbrush.1':'Can I brush in my pajamas?', 'thg.pjbrush.2':'Brushing comes before clothes!', 'thg.pjbrush.3':'Okay, brush brush!',
    'thg.dingdong.t':'Ding Dong', 'thg.dingdong.1':'Ding dong! Ding dong!', 'thg.dingdong.2':"What's that bell?", 'thg.dingdong.3':"It's the brushing-time bell!",
    'thg.kitewind.t':'Kite in the Wind', 'thg.kitewind.1':'Whoosh goes the wind!', 'thg.kitewind.2':'The kite wiggles like a toothbrush!', 'thg.kitewind.3':'Up and down, like a kite!',
    'thg.choochoo.t':'Choo Choo', 'thg.choochoo.1':'Choo choo!', 'thg.choochoo.2':'Next stop: Brushing Station~', 'thg.choochoo.3':'Getting off! Brush brush!',
    'thg.magicwand.t':'Abracadabra', 'thg.magicwand.1':'Abracadabra, sparkle!', 'thg.magicwand.2':'Nothing happened…', 'thg.magicwand.3':'Brushing is the real magic!',
    'thg.sheepleft.t':'Leftover Sheep', 'thg.sheepleft.1':'Why is a sheep here in the morning?', 'thg.sheepleft.2':'You fell asleep counting sheep last night~', 'thg.sheepleft.3':'Baa~ I want to brush too!',
    'thg.dinoroar.t':'Roaring Yawn', 'thg.dinoroar.1':'Yaaawn… ROAR!', 'thg.dinoroar.2':'Brush before you roar!', 'thg.dinoroar.3':'Roar… sparkle!',
    'thg.unicornhorn.t':'Foamy Horn', 'thg.unicornhorn.1':'Foam got on my horn!', 'thg.unicornhorn.2':'My horn looks like an ice cream cone!', 'thg.unicornhorn.3':"Hee hee, let's wash it off~",
    'thg.dropcount.t':'Three Drops', 'thg.dropcount.1':'One drop, two, three!', 'thg.dropcount.2':'Three rinses are plenty~', 'thg.dropcount.3':'Teacher Mongi is the best!',
    'thg.flowerbrush.t':'Flower Toothbrush', 'thg.flowerbrush.1':'My toothbrush smells like flowers!', 'thg.flowerbrush.2':'Pipi left a petal on it!', 'thg.flowerbrush.3':'Take the petal off before brushing~',
    'thg.eightarms.t':'Eight Arms', 'thg.eightarms.1':'Eight arms means eight toothbrushes!', 'thg.eightarms.2':'But you have one mouth?', 'thg.eightarms.3':'Then one toothbrush!',
    'thg.slowturtle.t':'Turtle Brushing', 'thg.slowturtle.1':'Slowly… carefully…', 'thg.slowturtle.2':'One tooth at a time, like a turtle!', 'thg.slowturtle.3':'Not a single tooth missed!',
    'thg.mouthscope.t':'Mouth Telescope', 'thg.mouthscope.1':"Let's look inside with a telescope!", 'thg.mouthscope.2':'I found a back-tooth star!', 'thg.mouthscope.3':"Let's polish that star too!",
    'thg.medalday.t':'Sparkle Medal', 'thg.medalday.1':'A medal for brushing every day!', 'thg.medalday.2':'For me?', 'thg.medalday.3':'Sparkle today, sparkle tomorrow!'
  }
});
(function(){
  const S = (c) => { c.place(c.hero, 34, 5); c.place(c.pet, 14, 5); };
  const pr = (c, svg, w, x, y, z = 4, r = 1) => c.prop(svg, w, x, y, z, r);
  window.TH_GAGS = (window.TH_GAGS || []).concat([
    { id:'echo', bg:'cave', setup:S, run: async (c) => {
      c.face(c.hero, 'happy'); c.brush(c.hero, true);
      await Promise.all([c.line(c.hero, 'thg.echo.1'), c.pose(c.hero, P_SHAKE, 240, 3)]);
      await Promise.all([c.line(null, 'thg.echo.2'), c.cam(70, 50, 1.3, 600)]);
      await c.cam(50, 50, 1, 300);
      await c.line(c.hero, 'thg.echo.3');
      c.brush(c.hero, false); c.snd('ding', 7);
      await Promise.all([c.line(null, 'thg.echo.4'), c.pose(c.pet, P_HOP, 380, 2)]);
    } },
    { id:'trophy', bg:'room', setup:S, run: async (c) => {
      const tr = pr(c, TH_P.trophy, 12, 62, 30);
      c.snd('fanfare');
      await Promise.all([c.line(null, 'thg.trophy.1'), c.pose(tr, P_BIG, 700)]);
      await c.go(tr, 16, 34, 500); c.face(c.pet, 'surprised');
      await Promise.all([c.line(c.pet, 'thg.trophy.2'), c.pose(c.pet, P_SHAKE, 220, 3)]);
      c.face(c.hero, 'happy'); c.brush(c.hero, true);
      await Promise.all([c.line(c.hero, 'thg.trophy.3'), c.pose(c.hero, P_SHAKE, 240, 3)]);
      c.brush(c.hero, false);
    } },
    { id:'beebuzz', bg:'garden', setup:S, run: async (c) => {
      const be = pr(c, TH_P.bee, 8, 80, 50, 4, .83);
      c.snd('swish');
      await Promise.all([c.line(be, 'thg.beebuzz.1'), c.go(be, 48, 40, 900), c.pose(be, P_TINY, 200, 4)]);
      c.face(c.hero, 'happy'); c.brush(c.hero, true);
      await Promise.all([c.line(c.hero, 'thg.beebuzz.2'), c.pose(c.hero, P_SHAKE, 240, 4), c.go(be, 110, 60, 1200)]);
      c.brush(c.hero, false);
    } },
    { id:'flutter', bg:'garden', setup:S, run: async (c) => {
      const br = pr(c, TH_P.brushNew, 14, 56, 22, 4, .45), bf = pr(c, TH_P.butterfly, 8, 90, 60, 5, .77);
      await c.go(bf, 58, 27, 1000);
      c.face(c.hero, 'surprised');
      await Promise.all([c.line(c.hero, 'thg.flutter.1'), c.pose(bf, P_TINY, 250, 3)]);
      await c.line(c.pet, 'thg.flutter.2');
      c.face(c.hero, 'happy');
      await Promise.all([c.line(c.hero, 'thg.flutter.3'), c.go(bf, 90, 70, 1000)]);
      br.remove();
    } },
    { id:'snailrace', bg:'garden', setup:S, run: async (c) => {
      const sn = pr(c, TH_P.snail, 12, 66, 5, 3, .7);
      c.brush(c.hero, true);
      await Promise.all([c.line(c.hero, 'thg.snailrace.1'), c.pose(c.hero, P_SHAKE, 240, 3)]);
      await Promise.all([c.line(sn, 'thg.snailrace.2'), c.pose(sn, P_TINY, 600, 2)]);
      c.brush(c.hero, false); c.face(c.hero, 'surprised');
      await Promise.all([c.line(c.hero, 'thg.snailrace.3'), c.pose(c.hero, P_BIG, 600)]);
      c.face(c.hero, 'happy');
    } },
    { id:'whalespout', bg:'sea', setup:S, run: async (c) => {
      const wh = pr(c, TH_P.whale, 26, 72, 10, 3, .45);
      await Promise.all([c.line(c.hero, 'thg.whalespout.1'), c.pose(wh, P_TINY, 500, 2)]);
      c.snd('whoosh'); [0, 1, 2].forEach(i => setTimeout(() => c.floatProp(TH_P.drop, 3, 64 + i * 3, 26), i * 120));
      await Promise.all([c.line(wh, 'thg.whalespout.2'), c.pose(wh, P_BIG, 600)]);
      c.face(c.hero, 'happy');
      await c.line(c.pet, 'thg.whalespout.3');
    } },
    { id:'robobeep', bg:'room', setup:S, run: async (c) => {
      const rb = pr(c, TH_P.robot, 12, 70, 5, 3, 1.2);
      c.snd('beep');
      await Promise.all([c.line(rb, 'thg.robobeep.1'), c.pose(rb, P_TINY, 300, 2)]);
      c.snd('beep'); c.face(c.hero, 'shy');
      await Promise.all([c.line(rb, 'thg.robobeep.2'), c.cam(34, 22, 1.5, 600)]);
      c.face(c.hero, 'happy'); c.snd('fanfare'); c.burst({ x:34, y:30 }, 8);
      await Promise.all([c.cam(50, 50, 1, 400), c.line(rb, 'thg.robobeep.3'), c.pose(rb, P_HOP, 380, 2)]);
    } },
    { id:'penwalk', bg:'sky', setup:S, run: async (c) => {
      const pg = pr(c, TH_P.penguin, 10, 104, 5, 3, 1.15);
      await Promise.all([c.line(pg, 'thg.penwalk.1'), c.go(pg, 70, 5, 1400), c.pose(pg, P_WALK, 300, 4)]);
      await c.line(c.hero, 'thg.penwalk.2');
      c.snd('boing');
      await Promise.all([c.line(pg, 'thg.penwalk.3'), c.pose(pg, P_HOP, 340, 2)]);
    } },
    { id:'rainbowpaste', bg:'bath', setup:S, run: async (c) => {
      const rb = pr(c, TH_P.rainbow, 26, 60, 48, 2, .5);
      c.face(c.hero, 'happy');
      await Promise.all([c.line(c.hero, 'thg.rainbowpaste.1'), c.pose(rb, P_GROW, 600)]);
      await c.line(c.pet, 'thg.rainbowpaste.2');
      const pe = pr(c, TH_P.pea, 6, 52, 24, 5, .75); c.snd('ding', 5);
      await Promise.all([c.line(c.hero, 'thg.rainbowpaste.3'), c.pose(pe, P_BIG, 600)]);
    } },
    { id:'snowmanbrush', bg:'sky', setup:S, run: async (c) => {
      c.shower(TH_P.snowflake, 10, 2400, 3).catch(() => {});
      const sm = pr(c, TH_P.snowman, 14, 68, 5, 3, 1.3);
      c.face(c.hero, 'sad');
      await Promise.all([c.line(sm, 'thg.snowmanbrush.1'), c.pose(sm, P_TINY, 500, 2)]);
      c.face(c.hero, 'happy'); c.brush(c.hero, true);
      await Promise.all([c.line(c.hero, 'thg.snowmanbrush.2'), c.go(c.hero, 54, 5, 600)]);
      await Promise.all([c.line(sm, 'thg.snowmanbrush.3'), c.pose(sm, P_SHAKE, 220, 4), c.pose(c.hero, P_SHAKE, 240, 3)]);
      c.brush(c.hero, false);
    } },
    { id:'floaty', bg:'town', setup:S, run: async (c) => {
      const bl = pr(c, TH_P.balloon, 7, 40, 46, 4, 1.8);
      c.face(c.hero, 'surprised');
      await Promise.all([c.line(c.hero, 'thg.floaty.1'), c.go(c.hero, 34, 22, 900, 'ease-out'), c.go(bl, 40, 62, 900, 'ease-out')]);
      await Promise.all([c.line(c.pet, 'thg.floaty.2'), c.pose(c.pet, P_HOP, 340, 2)]);
      c.snd('thud');
      await Promise.all([c.go(c.hero, 34, 5, 500, 'ease-in'), c.go(bl, 70, 110, 1400)]);
      c.face(c.hero, 'happy');
      await c.line(c.hero, 'thg.floaty.3');
    } },
    { id:'crumbstuck', bg:'room', setup:S, run: async (c) => {
      const cr = pr(c, TH_P.crumb, 3, 36, 30, 5);
      c.face(c.hero, 'surprised');
      await Promise.all([c.line(c.hero, 'thg.crumbstuck.1'), c.cam(34, 24, 1.6, 600), c.pose(cr, P_SHAKE, 200, 3)]);
      c.snd('blow');
      await Promise.all([c.cam(50, 50, 1, 400), c.line(c.pet, 'thg.crumbstuck.2'), c.pose(c.hero, P_SHAKE, 200, 4)]);
      cr.remove(); c.face(c.hero, 'happy'); c.brush(c.hero, true);
      await Promise.all([c.line(c.hero, 'thg.crumbstuck.3'), c.pose(c.hero, P_SHAKE, 240, 3)]);
      c.brush(c.hero, false);
    } },
    { id:'icecold', bg:'room', setup:S, run: async (c) => {
      const ic = pr(c, TH_P.icecream, 7, 46, 22, 5, 1.5);
      c.face(c.hero, 'happy');
      await Promise.all([c.line(c.hero, 'thg.icecold.1'), c.pose(ic, P_TINY, 300, 2)]);
      c.face(c.hero, 'surprised'); c.snd('beep');
      await Promise.all([c.line(c.hero, 'thg.icecold.2'), c.pose(c.hero, P_SHAKE, 140, 6)]);
      c.face(c.hero, null);
      await c.line(c.pet, 'thg.icecold.3');
    } },
    { id:'burp', bg:'room', setup:S, run: async (c) => {
      const sd = pr(c, TH_P.soda, 6, 46, 22, 5, 1.6);
      [0, 1, 2].forEach(i => setTimeout(() => c.floatProp(TH_P.bubble, 2.4, 46, 34), i * 200));
      await Promise.all([c.line(c.hero, 'thg.burp.1'), c.pose(sd, P_TINY, 250, 3)]);
      c.face(c.hero, 'surprised'); c.snd('sneeze');
      await Promise.all([c.line(c.hero, 'thg.burp.2'), c.pose(c.hero, P_BIG, 500)]);
      sd.remove(); c.face(c.hero, 'shy');
      const wt = pr(c, TH_P.water, 6, 46, 22, 5, 1.6);
      await Promise.all([c.line(c.pet, 'thg.burp.3'), c.pose(wt, P_TINY, 300, 2)]);
    } },
    { id:'minitree', bg:'room', setup:S, run: async (c) => {
      const bc = pr(c, TH_P.broccoli, 8, 50, 22, 5, 1.2);
      await Promise.all([c.line(c.hero, 'thg.minitree.1'), c.pose(bc, P_TINY, 300, 2)]);
      c.face(c.hero, 'surprised');
      await Promise.all([c.line(c.pet, 'thg.minitree.2'), c.pose(bc, P_GROW, 700)]);
      bc.remove(); c.face(c.hero, 'determined'); c.brush(c.hero, true);
      await Promise.all([c.line(c.hero, 'thg.minitree.3'), c.pose(c.hero, P_SHAKE, 220, 4)]);
      c.brush(c.hero, false); c.face(c.hero, 'happy');
    } },
    { id:'bunnycarrot', bg:'garden', setup:S, run: async (c) => {
      const rb = pr(c, TH_P.rabbit, 11, 70, 5, 3, 1.25), ca = pr(c, TH_P.carrot, 5, 63, 16, 4, 1.7);
      c.snd('pop');
      await Promise.all([c.line(rb, 'thg.bunnycarrot.1'), c.pose(ca, P_SHAKE, 160, 4)]);
      ca.remove(); c.face(c.hero, 'surprised');
      await c.line(c.hero, 'thg.bunnycarrot.2');
      c.face(c.hero, 'happy');
      await Promise.all([c.line(c.pet, 'thg.bunnycarrot.3'), c.pose(rb, P_HOP, 340, 2)]);
    } },
    { id:'pjbrush', bg:'room', setup:S, run: async (c) => {
      c.face(c.hero, 'sleep');
      await Promise.all([c.line(c.hero, 'thg.pjbrush.1'), c.pose(c.hero, P_YAWN, 900)]);
      await Promise.all([c.line(c.pet, 'thg.pjbrush.2'), c.pose(c.pet, P_HOP, 340, 2)]);
      c.face(c.hero, 'happy'); c.brush(c.hero, true);
      await Promise.all([c.line(c.hero, 'thg.pjbrush.3'), c.pose(c.hero, P_SHAKE, 240, 4)]);
      c.brush(c.hero, false);
    } },
    { id:'dingdong', bg:'town', setup:S, run: async (c) => {
      const bl = pr(c, TH_P.bell, 9, 66, 52, 3, 1.05);
      c.snd('ding', 0); setTimeout(() => c.snd('ding', 4), 300);
      await Promise.all([c.line(bl, 'thg.dingdong.1'), c.pose(bl, P_SHAKE, 160, 6)]);
      await c.line(c.pet, 'thg.dingdong.2');
      c.face(c.hero, 'happy'); c.brush(c.hero, true);
      await Promise.all([c.line(c.hero, 'thg.dingdong.3'), c.pose(c.hero, P_SHAKE, 240, 3)]);
      c.brush(c.hero, false);
    } },
    { id:'kitewind', bg:'sky', setup:S, run: async (c) => {
      const kt = pr(c, TH_P.kite, 8, 70, 56, 3, 1.5);
      c.snd('whoosh');
      await Promise.all([c.line(null, 'thg.kitewind.1'), c.pose(kt, P_WIG, 300, 3)]);
      await Promise.all([c.line(c.pet, 'thg.kitewind.2'), c.pose(kt, P_TINY, 250, 4)]);
      c.face(c.hero, 'happy'); c.brush(c.hero, true);
      await Promise.all([c.line(c.hero, 'thg.kitewind.3'), c.pose(c.hero, P_TINY, 250, 4), c.pose(kt, P_TINY, 250, 4)]);
      c.brush(c.hero, false);
    } },
    { id:'choochoo', bg:'town', setup:S, run: async (c) => {
      const tn = pr(c, TH_P.train, 40, 130, 3, 2, .37);
      c.snd('beep');
      await Promise.all([c.line(null, 'thg.choochoo.1'), c.go(tn, 66, 3, 1400, 'ease-out')]);
      await Promise.all([c.line(tn, 'thg.choochoo.2'), c.pose(tn, P_TINY, 300, 2)]);
      c.face(c.hero, 'happy'); c.brush(c.hero, true);
      await Promise.all([c.line(c.hero, 'thg.choochoo.3'), c.pose(c.hero, P_HOP, 340, 2)]);
      c.brush(c.hero, false);
    } },
    { id:'magicwand', bg:'room', setup:S, run: async (c) => {
      c.face(c.hero, 'determined'); c.snd('magic');
      [0, 1, 2].forEach(i => setTimeout(() => c.floatProp(TH_P.star, 3, 40 + i * 5, 32), i * 150));
      await Promise.all([c.line(c.hero, 'thg.magicwand.1'), c.pose(c.hero, P_SPIN, 700)]);
      c.face(c.hero, 'surprised');
      await c.line(c.pet, 'thg.magicwand.2');
      c.face(c.hero, 'happy'); c.brush(c.hero, true); c.burst({ x:34, y:30 }, 8);
      await Promise.all([c.line(c.hero, 'thg.magicwand.3'), c.pose(c.hero, P_SHAKE, 240, 3)]);
      c.brush(c.hero, false);
    } },
    { id:'sheepleft', bg:'room', setup:S, run: async (c) => {
      const sh = pr(c, TH_P.sheep, 14, 72, 5, 3, .77);
      c.face(c.hero, 'surprised');
      await Promise.all([c.line(c.hero, 'thg.sheepleft.1'), c.pose(sh, P_TINY, 400, 2)]);
      await c.line(c.pet, 'thg.sheepleft.2');
      c.face(c.hero, 'happy'); c.snd('boing');
      await Promise.all([c.line(sh, 'thg.sheepleft.3'), c.pose(sh, P_HOP, 340, 2)]);
    } },
    { id:'dinoroar', bg:'garden', setup:S, run: async (c) => {
      const du = c.cast('duri', 70, 5, 14);
      await Promise.all([c.line(du, 'thg.dinoroar.1'), c.pose(du, P_YAWN, 900)]);
      c.snd('thud'); c.quake(300).catch(() => {});
      c.face(c.hero, 'happy'); c.brush(c.hero, true);
      await Promise.all([c.line(c.hero, 'thg.dinoroar.2'), c.pose(c.hero, P_SHAKE, 240, 3)]);
      c.brush(c.hero, false); c.burst(du, 6); c.snd('ding', 5);
      await Promise.all([c.line(du, 'thg.dinoroar.3'), c.pose(du, P_HOP, 340, 2)]);
    } },
    { id:'unicornhorn', bg:'sky', setup:S, run: async (c) => {
      const cc = c.cast('coco', 70, 5, 15), bb = pr(c, TH_P.bubble, 4, 72, 30, 5);
      c.face(c.hero, 'surprised');
      await Promise.all([c.line(cc, 'thg.unicornhorn.1'), c.pose(bb, P_GROW, 500)]);
      c.face(c.hero, 'happy');
      await Promise.all([c.line(c.hero, 'thg.unicornhorn.2'), c.pose(cc, P_HOP, 340, 2)]);
      c.snd('pop'); bb.remove();
      await c.line(cc, 'thg.unicornhorn.3');
    } },
    { id:'dropcount', bg:'bath', setup:S, run: async (c) => {
      const mg = c.cast('mongi', 70, 8, 14);
      for (let i = 0; i < 3; i++){ c.snd('ding', i * 3); c.floatProp(TH_P.drop, 3, 60 + i * 6, 30); await c.wait(220); }
      await c.line(mg, 'thg.dropcount.1');
      await Promise.all([c.line(mg, 'thg.dropcount.2'), c.pose(mg, P_HOP, 340, 2)]);
      c.face(c.hero, 'happy');
      await Promise.all([c.line(c.hero, 'thg.dropcount.3'), c.pose(c.hero, P_HOP, 340, 2)]);
    } },
    { id:'flowerbrush', bg:'bath', setup:S, run: async (c) => {
      const br = pr(c, TH_P.brushNew, 14, 54, 22, 4, .45), fl = pr(c, TH_P.flower, 4, 58, 26, 5, 1.6);
      c.face(c.hero, 'happy');
      await Promise.all([c.line(c.hero, 'thg.flowerbrush.1'), c.pose(fl, P_TINY, 300, 2)]);
      const pp = c.cast('pipi', 84, 8, 12);
      await Promise.all([c.line(pp, 'thg.flowerbrush.2'), c.pose(pp, P_HOP, 340, 2)]);
      c.snd('pop'); await c.go(fl, 84, 40, 600);
      await c.line(c.pet, 'thg.flowerbrush.3');
      br.remove();
    } },
    { id:'eightarms', bg:'sea', setup:S, run: async (c) => {
      const oc = pr(c, TH_P.octopus, 18, 70, 8, 3, .82);
      await Promise.all([c.line(oc, 'thg.eightarms.1'), c.pose(oc, P_WIG, 300, 3)]);
      c.face(c.hero, 'surprised');
      await c.line(c.hero, 'thg.eightarms.2');
      c.face(c.hero, 'happy'); c.snd('ding', 5);
      await Promise.all([c.line(oc, 'thg.eightarms.3'), c.pose(oc, P_HOP, 340, 2)]);
    } },
    { id:'slowturtle', bg:'sea', setup:S, run: async (c) => {
      const tt = pr(c, TH_P.turtle, 20, 72, 5, 3, .55);
      c.brush(c.hero, true);
      await Promise.all([c.line(tt, 'thg.slowturtle.1'), c.pose(c.hero, P_SHAKE, 500, 3), c.pose(tt, P_TINY, 600, 2)]);
      await Promise.all([c.line(c.hero, 'thg.slowturtle.2'), c.pose(c.hero, P_SHAKE, 500, 3)]);
      c.brush(c.hero, false); c.face(c.hero, 'happy'); c.snd('fanfare');
      await c.line(c.pet, 'thg.slowturtle.3');
    } },
    { id:'mouthscope', bg:'room', setup:S, run: async (c) => {
      const ts = pr(c, TH_P.telescope, 16, 60, 5, 3, .85);
      await Promise.all([c.line(c.pet, 'thg.mouthscope.1'), c.pose(ts, P_TINY, 300, 2)]);
      const st = pr(c, TH_P.star, 4, 36, 32, 6); c.snd('ding', 5);
      await Promise.all([c.line(c.pet, 'thg.mouthscope.2'), c.cam(36, 28, 2, 700)]);
      c.face(c.hero, 'happy'); c.brush(c.hero, true);
      await Promise.all([c.cam(50, 50, 1, 400), c.line(c.hero, 'thg.mouthscope.3'), c.pose(c.hero, P_SHAKE, 240, 3)]);
      c.brush(c.hero, false); st.remove();
    } },
    { id:'medalday', bg:'room', setup:S, run: async (c) => {
      const md = pr(c, TH_P.medal, 9, 60, 40, 5, 1.4);
      c.snd('fanfare');
      await Promise.all([c.line(null, 'thg.medalday.1'), c.pose(md, P_BIG, 700)]);
      c.face(c.hero, 'surprised');
      await Promise.all([c.line(c.hero, 'thg.medalday.2'), c.go(md, 34, 30, 600)]);
      c.face(c.hero, 'happy'); c.burst(md, 8);
      await Promise.all([c.line(c.pet, 'thg.medalday.3'), c.pose(c.hero, P_HOP, 380, 2)]);
    } }
  ]);
})();
