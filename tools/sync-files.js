'use strict';
/* 앱 화면이 부를 js 목록 맞추기 (v0.49.0):  node tools/sync-files.js [앱 이름, 기본 lets-brush]
   core/js 전부 + 앱 js/ 전부 + 앱이 쓰는 캐릭터 js (index.html 에 이미 있는 characters/<이름>) 를 파일 이름(= 번호) 순서로
   → apps/<앱>/index.html 의 <script> 줄들과 apps/<앱>/sw.js 의 APP 목록을 다시 씀. v0.52.0 앱 lang/*.json (받는 언어팩) 은 sw.js LANGS 목록으로.
     파일을 더하거나 이름을 바꾼 뒤에 돌리면 됨
   (tests/static-checks.js 가 빠진 것 · 순서를 잡아 줌) */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), app = process.argv[2] || 'lets-brush', dir = path.join(ROOT, 'apps', app);
const htmlP = path.join(dir, 'index.html'), swP = path.join(dir, 'sw.js');
let html = fs.readFileSync(htmlP, 'utf8'), sw = fs.readFileSync(swP, 'utf8');
const chars = [...new Set([...html.matchAll(/\.\.\/\.\.\/characters\/([\w-]+)\/js\//g)].map(m => m[1]))];
const js = (d, pre) => fs.existsSync(d) ? fs.readdirSync(d).filter(f => f.endsWith('.js')).map(f => pre + f) : [];
const list = [...js(path.join(ROOT, 'core', 'js'), '../../core/js/'), ...js(path.join(dir, 'js'), 'js/'),
  ...chars.flatMap(c => js(path.join(ROOT, 'characters', c, 'js'), `../../characters/${c}/js/`))]
  .sort((a, b) => path.basename(a).localeCompare(path.basename(b)));
const tags = list.map(f => `<script src="${f}"></script>`).join('\n');
const re = /(^<script src="[^"]+\.js"><\/script>\n)+/m;          // 줄 맨 앞에서 시작하는 것만 (주석 속 resources.js 줄은 안 건드림)
if (!re.test(html)) throw new Error('index.html 에서 <script> 줄을 못 찾음');
html = html.replace(re, tags + '\n');
sw = sw.replace(/const APP = \[[\s\S]*?\];/, `const APP = ['./index.html', './css/app.css',\n${list.map(f => `  '${f.startsWith('js/') ? './' + f : f}'`).join(',\n')}];`);
const langs = fs.existsSync(path.join(dir, 'lang')) ? fs.readdirSync(path.join(dir, 'lang')).filter(f => f.endsWith('.json')).sort().map(f => `'./lang/${f}'`) : [];
if (/const LANGS = \[[^\]]*\];/.test(sw)) sw = sw.replace(/const LANGS = \[[^\]]*\];/, `const LANGS = [${langs.join(', ')}];`);
fs.writeFileSync(htmlP, html); fs.writeFileSync(swP, sw);
console.log(`apps/${app}: js ${list.length}개 (${chars.length ? '캐릭터 ' + chars.join(', ') : '캐릭터 없음'})`);
