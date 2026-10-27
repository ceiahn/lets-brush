'use strict';

/* =========================================================
   0-1. 공통 도우미 (v0.49.0 모듈화 2단계: 앱 00-config.js 에서 나눔)
      $ · $$ (화면 요소 찾기) · pick (무작위 하나) · 날짜 도우미 (dkey · slotOf · isWeekend · dayNum)
   ========================================================= */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
// 날짜 · 시간대 도우미
const dkey = (d) => d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
const slotOf = (d = new Date()) => d.getHours() < 15 ? 'am' : 'pm';            // 오후 3시 전 = 아침 양치
const isWeekend = (d = new Date()) => d.getDay() === 0 || d.getDay() === 6;
const dayNum = (d) => Math.round(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12).getTime() / 86400000);
