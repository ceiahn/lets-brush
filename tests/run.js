'use strict';
/* 점검 전부 돌리기:  node tests/run.js        (글 · 파일 점검만: node tests/run.js --quick)
   끝에 ✓ 통과 / ✗ 문제 수를 보여 주고, 문제가 있으면 종료 코드 1 (GitHub 자동 점검이 빨간색) */
const { runStatic } = require('./static-checks');
const { runBrowser } = require('./browser-checks');
(async () => {
  console.log('── 글 · 파일 점검');
  const a = runStatic();
  let b = [];
  if (!process.argv.includes('--quick')){ console.log('── 브라우저 점검 (한국어 · 영어 · 일본어, 약 2~3분)'); b = await runBrowser(); }
  const n = a.length + b.length;
  console.log(n ? `\n✗ 문제 ${n}개` : '\n✓ 모두 통과');
  process.exit(n ? 1 : 0);
})();
