-- 토끼유 스튜디오 익명 숫자 (v0.52.0). 날짜 · 앱 · 언어 · 종류 · 이야기 id 마다 숫자 네 개만
CREATE TABLE IF NOT EXISTS counts (
  day TEXT NOT NULL, app TEXT NOT NULL, lang TEXT NOT NULL, kind TEXT NOT NULL, id TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0, done INTEGER NOT NULL DEFAULT 0, skips INTEGER NOT NULL DEFAULT 0, likes INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, app, lang, kind, id)
);
