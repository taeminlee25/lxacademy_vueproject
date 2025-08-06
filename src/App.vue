<!-- 루트 컴포넌트 -->
<template>
  <!-- 
    <RouterView />는 현재 URL에 해당하는 컴포넌트를 표시해주는 자리.
    라우터에 설정된 경로에 따라 컴포넌트를 이 자리에 렌더링함.
    예: /recipes → RecipeView.vue 컴포넌트가 여기 렌더링됨
  -->
  <RouterView />
</template>

<script setup>
// Vue 3의 <script setup> 문법 사용
// RouterView는 vue-router에서 제공하는 컴포넌트로, 라우터에 따라 뷰를 표시함
import { RouterView } from 'vue-router'
</script>

<style scoped>
/* 
  scoped: 이 스타일은 현재 컴포넌트에만 적용됨
  (다른 컴포넌트에 영향 주지 않음)
  이 부분에 전역이 아닌 루트 컴포넌트 전용 스타일을 작성할 수 있음
*/
</style>
