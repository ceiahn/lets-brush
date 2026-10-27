#!/bin/sh
# v0.47.0 Cloudflare Pages 에 올릴 파일만 dist/ 로 모음 (docs · tests · android · tools 같은 개발 자료는 올리지 않음)
#   Cloudflare Pages 설정: 빌드 명령 sh tools/build-site.sh · 출력 폴더 dist  (docs/스토어_앱_포장.md 0장)
#   직접 확인: sh tools/build-site.sh && ls dist
set -e
cd "$(dirname "$0")/.."
rm -rf dist && mkdir dist
cp index.html sw.js manifest.json privacy.html terms.html LICENSE dist/
cp -R css js fonts icons dist/
[ -f resources.js ] && cp resources.js dist/
mkdir -p dist/specials && cp specials/titles.txt dist/specials/ 2>/dev/null || true
for f in specials/*.mp4 specials/*.webm; do [ -f "$f" ] && cp "$f" dist/specials/; done
[ -d .well-known ] && cp -R .well-known dist/                       # 스토어 앱 연결 파일 assetlinks.json (3장)
printf '/.well-known/assetlinks.json\n  Content-Type: application/json\n' > dist/_headers
echo "dist/ 준비 끝: $(find dist -type f | wc -l) 개 파일"
