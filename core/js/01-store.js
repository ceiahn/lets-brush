'use strict';

/* =========================================================
   1. 저장 (이 기기 브라우저에만 저장됨)
      의도: 계정 · 서버 없이 바로 쓰게 (아이 개인정보를 모으지 않음). 키 목록은 맨 위 개발 안내 [6]
            나중에 앱으로 낼 때 이 store 만 바꾸면 기기 저장소 · 클라우드로 옮길 수 있게 한 곳에 모음
   ========================================================= */
/* v0.31.0 아이 여럿 (최대 KID_MAX 명)
   의도: 형제가 폰 한 대를 같이 써도 별 · 펫 · 기록 · 퀴즈 · 생년월일은 아이마다 따로
   방법: KID_KEYS 에 든 값만 아이별로 저장. 첫째(1)는 예전 이름 그대로 bj_<키> → 기존 사용자는 옮길 것 없이 첫째가 됨
         둘째 · 셋째는 bj_k2_<키> · bj_k3_<키>. 아이 목록 bj_kids=[1,2…], 지금 아이 bj_kid (둘 다 함께 쓰는 값)
   주의: 아이마다 따로 둘 새 진행 값을 만들면 KID_KEYS 에도 넣을 것 (안 넣으면 형제가 같이 씀)
         아이를 바꾸면 페이지를 새로 읽음 (메모리에 든 값이 섞이지 않게) */
const KID_MAX = 3;
const KID_KEYS = new Set(['stars', 'testGift', 'owned', 'look', 'brush', 'brushes', 'evGift', 'log', 'log2', 'covered', 'shields', 'fairyDay',
  'pet', 'petOwned', 'book', 'map', 'roomOwned', 'roomOn', 'hab', 'goal', 'theater', 'thLikes', 'special', 'quizDay', 'quizStamps',
  'kidName', 'bday', 'birthY', 'age', 'hand', 'technique', 'prep', 'tongue']);
const kidList = () => { try{ const v = JSON.parse(localStorage.getItem('bj_kids')); if (Array.isArray(v) && v.length) return v.filter(x => x >= 1 && x <= KID_MAX); }catch(e){} return [1]; };
const KID = (() => { try{ const v = JSON.parse(localStorage.getItem('bj_kid')); return kidList().includes(v) ? v : kidList()[0]; }catch(e){ return kidList()[0]; } })();
const kidKey = (id, k) => 'bj_' + (id !== 1 && KID_KEYS.has(k) ? 'k' + id + '_' : '') + k;
const store = {
  get(k, d){ return store.getFor(KID, k, d); },
  set(k, v){ try{ localStorage.setItem(kidKey(KID, k), JSON.stringify(v)); }catch(e){} },
  del(k){ try{ localStorage.removeItem(kidKey(KID, k)); }catch(e){} },
  getFor(id, k, d){ try{ const v = localStorage.getItem(kidKey(id, k)); return v === null ? d : JSON.parse(v); }catch(e){ return d; } }
};
