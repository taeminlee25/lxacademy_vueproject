<!-- CommunityView.vue - 자유게시판 페이지 -->
<template>
  <div class="d-flex flex-column min-vh-100 bg-light">
    <!-- ✅ 헤더 -->
    <div class="app-header bg-white shadow-sm sticky-top">
      <div class="container-fluid py-3">
        <div class="d-flex align-items-center">
          <button class="btn btn-icon btn-light me-3" @click="goBack">
            <i class="fas fa-arrow-left fs-2"></i>
          </button>
          <h2 class="fw-bold text-gray-800 mb-0 me-auto">자유게시판</h2>
          <button class="btn btn-danger rounded-pill px-4 fw-semibold shadow-sm" @click="writePost">
            <i class="ki-duotone ki-plus fs-3 me-2"></i> 글쓰기
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ 인기 태그 -->
    <div class="container-fluid py-4">
      <div class="d-flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in tags"
          :key="tag"
          class="badge badge-light-primary fs-6 py-2 px-3 cursor-pointer tag-hover"
          @click="searchByTag(tag)"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- 정렬 옵션 -->
      <div class="row g-3">
        <div class="col-auto">
          <div class="dropdown">
            <button class="btn btn-light dropdown-toggle rounded-pill" data-bs-toggle="dropdown">
              <i class="ki-duotone ki-sort fs-4 me-2"></i>
              {{ selectedSort }}
            </button>
            <ul class="dropdown-menu">
              <li v-for="option in sortOptions" :key="option">
                <a class="dropdown-item" href="#" @click.prevent="setSort(option)">
                  {{ option }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ 게시글 목록 -->
    <div class="flex-grow-1 container-fluid pb-4">
      <div class="row g-4">
        <div v-for="post in posts" :key="post.id" class="col-12">
          <div
            class="card card-flush shadow-sm border-0 card-hover post-card"
            @click="viewPost(post.id)"
          >
            <div class="card-body p-6">
              <!-- 해시태그 -->
              <div class="d-flex align-items-center mb-3 flex-wrap gap-1">
                <span
                  v-for="tag in post.tags"
                  :key="tag"
                  class="badge"
                  :class="tagColors[tag] || 'badge-light-primary'"
                  >#{{ tag }}</span
                >
                <span v-if="post.hot" class="badge badge-danger ms-2">🔥 HOT</span>
              </div>

              <!-- 제목 / 내용 -->
              <h3 class="fw-bold text-gray-800 mb-3">{{ post.title }}</h3>
              <p class="text-gray-600 fs-6 mb-4 text-truncate-3">{{ post.content }}</p>

              <!-- 이미지 (있을 경우) -->
              <div v-if="post.images.length" class="row g-3 mb-4">
                <div v-for="(image, index) in post.images" :key="index" class="col-6 col-md-3">
                  <img :src="image" class="rounded-3 w-100 post-image" alt="게시글 이미지" />
                </div>
              </div>

              <!-- 작성자 & 통계 -->
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-40px me-3">
                    <img :src="post.author.avatar" alt="작성자" class="rounded-circle" />
                  </div>
                  <div>
                    <span class="fw-semibold text-gray-800 fs-7">{{ post.author.name }}</span>
                    <span class="text-muted fs-8 d-block">{{ post.time }}</span>
                  </div>
                </div>

                <div class="d-flex align-items-center gap-3 text-muted fs-7">
                  <span
                    ><i class="ki-duotone ki-heart fs-6 me-1 text-danger"></i>{{ post.likes }}</span
                  >
                  <span
                    ><i class="ki-duotone ki-message-text fs-6 me-1"></i>{{ post.comments }}</span
                  >
                  <span><i class="ki-duotone ki-eye fs-6 me-1"></i>{{ post.views }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ 더보기 버튼 -->
      <div class="text-center mt-8">
        <button class="btn btn-light-danger rounded-pill px-5" @click="loadMore">
          <i class="ki-duotone ki-arrow-down fs-3 me-2"></i> 더 많은 게시글 보기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tags = ['홈베이킹', '빵스타그램', '베이킹초보', '오늘의빵', '빵집추천']
const selectedSort = ref('최신순')
const sortOptions = ['최신순', '인기순', '댓글순', '조회순']

// 태그 색상 매핑
const tagColors = {
  홈베이킹: 'badge-light-primary',
  빵스타그램: 'badge-light-success',
  베이킹초보: 'badge-light-warning',
  오늘의빵: 'badge-light-danger',
  빵집추천: 'badge-light-info',
}

// 게시글 데이터 (샘플)
const posts = ref([
  {
    id: 1,
    hot: true,
    tags: ['홈베이킹', '빵스타그램'],
    title: '첫 소금빵 성공했어요!! 🥖✨',
    content: '5번 도전 끝에 소금빵 성공! 레시피 공유할게요.',
    images: [
      '/assets/media/images/salt_bread1.jpg',
      '/assets/media/images/salt_bread2.jpg',
      '/assets/media/images/salt_bread3.jpg',
    ],
    author: { name: '빵돌이95', avatar: '/assets/media/avatars/300-12.jpg' },
    time: '3시간 전',
    likes: 234,
    comments: 67,
    views: 1234,
  },
  {
    id: 2,
    hot: false,
    tags: ['베이킹초보', '질문'],
    title: '베이킹 입문자인데 어떤 도구부터 사야 할까요?',
    content: '베이킹 도구가 너무 많아서 뭘 먼저 사야 할지 모르겠어요...',
    images: [],
    author: { name: '신입베이커', avatar: '/assets/media/avatars/300-13.jpg' },
    time: '1시간 전',
    likes: 15,
    comments: 23,
    views: 89,
  },
])

// 함수
const goBack = () => window.history.back()
const writePost = () => console.log('게시글 작성 페이지로 이동')
const searchByTag = (tag) => console.log(`${tag} 태그 검색`)
const setSort = (sort) => (selectedSort.value = sort)
const viewPost = (id) => console.log(`게시글 ${id} 상세보기`)
const loadMore = () => console.log('더 많은 게시글 로드')
</script>

<style scoped>
.card-hover {
  cursor: pointer;
  transition: all 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15) !important;
}
.tag-hover:hover {
  transform: translateY(-1px);
  background-color: #eef2ff !important;
}
.post-image {
  height: 120px;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.post-image:hover {
  transform: scale(1.05);
}
.text-truncate-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.post-card {
  border-radius: 12px;
}
@media (max-width: 576px) {
  .card-body {
    padding: 1rem !important;
  }
}
</style>
