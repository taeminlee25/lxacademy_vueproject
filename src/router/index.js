// src/router/index.js
// Vue Router 설정 파일
// SPA(Single Page Application)에서 라우팅을 담당
// 사용자가 주소(URL)를 바꿀 때 페이지 전체를 새로고침하지 않고, 해당 컴포넌트만 바꿔서 보여주는 역할

// createRouter : 라우터 인스턴스를 생성하는 함수
// createWebHistory: 브라우저의 HTML5 History API를 사용하는 히스토리 모드 설정
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  // HTML5 히스토리 모드 사용(URL에 # 없이 깔끔한 경로 사용 가능)
  history: createWebHistory(import.meta.env.BASE_URL),
  // 라우팅 정의 배열
  routes: [
    // 홈 페이지 경로
    {
      path: '/',
      name: 'home',
      // 컴포넌트를 동적으로 import(코드 스플리팅을 위해)
      //
      component: () => import('../views/HomeView.vue'),
    },
    // 레시피 목록 페이지 경로
    {
      path: '/Recipes',
      name: 'recipes',
      component: () => import('../views/RecipeView.vue'),
    },
    // 리뷰 게시판 경로
    {
      path: '/Review',
      name: 'review',
      component: () => import('../views/ReviewView.vue'),
    },
    // QnA 게시판 경로
    {
      path: '/QnA',
      name: 'qna',
      component: () => import('../views/QnaView.vue'),
    },
    // 커뮤니티 게시판 경로
    {
      path: '/Community',
      name: 'commnunity',
      component: () => import('../views/CommunityView.vue'),
    },
    // 검색 결과 페이지 경로
    {
      path: '/search',
      name: 'SearchResult',
      component: () => import('../views/searchResultView.vue'),
    },
    // 특정 레시피 상세 페이지 (동적 라우트 매개변수 : id 사용)
    // 예: /recipes/1 -> id=1
    {
      path: '/recipes/:id',
      name: 'RecipeDetail',
      component: () => import('../views/RecipeDetailView.vue'),
    },
  ],
})
// 라우터 인스턴스를 외부에서 사용할 수 있도록 export
export default router
