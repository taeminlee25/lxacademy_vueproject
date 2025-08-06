<!-- MainPage.vue -->
<template>
  <!-- 전체 화면을 세로 방향으로 구성하고, 배경을 밝게 설정 -->
  <div class="d-flex flex-column min-vh-100 bg-light">
    <!-- 🔍 [1] 상단 고정 검색 헤더 -->
    <div class="app-header bg-white shadow-sm sticky-top">
      <div class="container-fluid py-3">
        <div class="d-flex align-items-center">
          <!-- 🥐 1-1. 빵 종류 선택 드롭다운 메뉴 -->
          <div class="dropdown me-3">
            <!-- 현재 선택된 빵 종류를 표시하는 버튼 -->
            <button class="btn btn-sm btn-light-primary dropdown-toggle" data-bs-toggle="dropdown">
              <i class="fas fa-bread-slice fs-6 me-2 text-warning"></i>
              {{ selectedBread }}
              <!-- 현재 선택된 빵 이름 -->
            </button>

            <!-- 드롭다운 리스트 - 모든 빵 종류를 반복 출력 -->
            <ul class="dropdown-menu">
              <li v-for="bread in breadList" :key="bread">
                <a class="dropdown-item" href="#" @click="selectBread(bread)">
                  <i class="fas fa-bread-slice fs-6 me-2 text-warning"></i>{{ bread }}
                </a>
              </li>
            </ul>
          </div>

          <!-- 🔎 1-2. 검색 입력창 -->
          <div class="position-relative flex-grow-1 me-3">
            <!-- 왼쪽 돋보기 아이콘 -->
            <i
              class="bi bi-search fs-3 text-gray-500 position-absolute top-50 translate-middle-y ms-4"
            ></i>

            <!-- 사용자 입력을 받는 텍스트 입력창 -->
            <!-- 입력값을 searchQuery에 바인딩 -->
            <!-- Enter 키 누르면 검색 실행 -->
            <input
              id="searchInput"
              name="searchQuery"
              type="text"
              v-model="searchQuery"
              @keyup.enter="performSearch"
              class="form-control form-control-solid ps-13 bg-light border-0 rounded-pill"
              placeholder="빵을 검색해주세요!"
            />
          </div>

          <!-- 🔘 1-3. 검색 버튼 -->
          <!-- 클릭 시 검색 함수 실행 -->
          <!-- 입력 없을 경우 버튼 비활성화 -->
          <button
            @click="performSearch"
            class="btn btn-primary"
            type="button"
            :disabled="!searchQuery.trim()"
          >
            검색
          </button>
        </div>
      </div>
    </div>

    <!-- 🎞️ [2] 배너 슬라이드 영역 - 인기글 소개 -->
    <!-- 자동 슬라이드 간격 (3초) -->
    <div class="w-100 h-100 mt-5 mb-5">
      <div class="card border-0 overflow-hidden shadow-sm mx-3 rounded-4">
        <div class="card-body p-0">
          <div
            id="kt_carousel_banner"
            class="carousel slide"
            data-bs-ride="carousel"
            data-bs-interval="3000"
          >
            <!-- 슬라이드 내용 -->
            <!-- slide 배열 반복 -->
            <!-- 첫 번째 항목만 활성화 -->
            <div class="carousel-inner">
              <div
                v-for="(slide, index) in slides"
                :key="index"
                class="carousel-item"
                :class="{ active: index === 0 }"
              >
                <div
                  class="d-flex flex-row align-items-center banner-slide"
                  :style="{ backgroundColor: slide.bg }"
                >
                  <!-- 텍스트 설명 영역 -->
                  <div class="col-7 text-white p-5">
                    <p class="opacity-100 mb-2 fs-6">{{ slide.tag }}</p>
                    <h2 class="fw-bolder mb-2">{{ slide.title1 }}</h2>
                    <h1 class="fw-bolder mb-3">{{ slide.title2 }}</h1>
                    <p class="opacity-100 mb-0 fs-6">{{ slide.desc }}</p>
                  </div>
                  <!-- 이미지 표시 영역 -->
                  <div class="col-5 banner-img-container">
                    <img :src="slide.image" class="banner-img rounded-end-4" :alt="slide.title2" />
                  </div>
                </div>
              </div>
            </div>

            <!-- ◀️▶️ 이전/다음 버튼 -->
            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#kt_carousel_banner"
              data-bs-slide="prev"
            >
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            </button>
            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#kt_carousel_banner"
              data-bs-slide="next"
            >
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
            </button>

            <!-- ••• 슬라이드 하단 인디케이터 버튼 -->
            <div class="carousel-indicators">
              <button
                v-for="(slide, index) in slides"
                :key="index"
                type="button"
                data-bs-target="#kt_carousel_banner"
                :data-bs-slide-to="index"
                :class="{ active: index === 0 }"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 📦 [3] 주요 기능 카드 목록 (레시피, 후기, Q&A 등) -->
    <div class="flex-grow-1 px-3 pb-4">
      <div class="row g-4 h-100">
        <!-- cards 배열의 각 항목 반복 렌더링 -->
        <div v-for="card in cards" :key="card.title" class="col-6 col-lg-3">
          <!-- 클릭 시 해당 경로로 이동 -->
          <div
            class="card card-flush bg-white text-center h-100 shadow-sm border-0 card-hover"
            @click="handleCardClick(card.route)"
          >
            <div class="card-body d-flex flex-column justify-content-center p-5 position-relative">
              <!-- 카드 아이콘 -->
              <div class="symbol symbol-80px mx-auto mb-4">
                <span :class="['symbol-label', card.bg, 'rounded-4']">
                  <i :class="card.icon"></i>
                </span>
              </div>
              <!-- 카드 제목 및 설명 -->
              <h4 class="fw-bold text-gray-800 mb-2">{{ card.title }}</h4>
              <p class="text-muted fs-6 mb-0">{{ card.desc }}</p>
              <!-- 카드 오른쪽 상단 뱃지 (아이콘 또는 텍스트) -->
              <div class="badge badge-circle position-absolute top-0 end-0 m-3" :class="card.badge">
                <i v-if="card.badgeIcon" :class="card.badgeIcon"></i>
                <span v-else>{{ card.badgeText }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* -----------------------------------------------
📦 <script setup>은 Composition API 기반으로 Vue 3에서 추천되는 방식
-------------------------------------------------*/
import { ref } from 'vue' // 반응형 변수 생성
import { useRouter } from 'vue-router' // 페이지 이동용 라우터 사용

// 라우터 인스턴스 가져오기
const router = useRouter()

// 🥐 선택된 빵 이름 (기본값: 카스텔라)
const selectedBread = ref('카스텔라')

// 🔎 검색창 입력값
const searchQuery = ref('카스텔라')

// 🍞 드롭다운 빵 목록
const breadList = ['카스텔라', '베이글', '크루아상', '치아바타', '와플', '스콘', '머핀']

// 🎞️ 슬라이드에 표시할 내용 리스트 (텍스트 + 이미지 + 배경색)
const slides = [
  {
    tag: '#일본 나가사키식 카스텔라',
    title1: '가장 긴 역사를 자랑하는',
    title2: '나가사키의 3대 브랜드',
    desc: '분메이도, 쇼오켄, 후쿠사야',
    image: '/assets/media/images/nagasaki_castella.jpg',
    bg: '#ffcc00',
  },
  {
    tag: '#FOURB 베이글',
    title1: '천연발효종과 유기농 설탕 사용',
    title2: '신선한 재료로 매일 아침 생산',
    desc: '부드러운 식감과 깊은 풍미',
    image: '/assets/media/images/fourb_bagle.jfif',
    bg: '#deb887',
  },
  {
    tag: '#서울 3대 디저트',
    title1: '줄 서서 먹는',
    title2: '덕수궁 리에제 와플',
    desc: '블루베리 크림치즈 와플',
    image: '/assets/media/images/liege_waffle.jpg',
    bg: 'blueviolet',
  },
]

// 🧭 주요 기능 카드 (레시피, 후기 등)
const cards = [
  {
    title: '레시피 공유',
    desc: '나만의 베이킹 노하우',
    route: 'recipes',
    bg: 'bg-light-primary',
    icon: 'fas fa-book-open fs-1 text-primary',
    badge: 'badge-light-primary',
    badgeIcon: 'ki-duotone ki-plus fs-6',
  },
  {
    title: '빵집 후기',
    desc: '솔직한 방문 리뷰',
    route: 'review',
    bg: 'bg-light-warning',
    icon: 'ki-duotone ki-star fs-1 text-warning',
    badge: 'badge-light-warning',
    badgeText: 'HOT',
  },
  {
    title: 'Q&A',
    desc: '빵 궁금증 해결',
    route: 'qna',
    bg: 'bg-light-success',
    icon: 'fas fa-question-circle fs-1 text-success',
    badge: 'badge-light-success',
    badgeIcon: 'fas fa-question fs-6',
  },
  {
    title: '자유게시판',
    desc: '빵덕후들의 소통 공간',
    route: 'community',
    bg: 'bg-light-danger',
    icon: 'fas fa-comments fs-1 text-danger',
    badge: 'badge-light-danger',
    badgeIcon: 'fas fa-users fs-6',
  },
]

// ✅ 빵 드롭다운에서 선택 시: 상태 변경 + 검색어 동기화
const selectBread = (bread) => {
  selectedBread.value = bread
  searchQuery.value = bread
}

// ✅ 검색 버튼 또는 Enter 키 입력 시 실행되는 함수
const performSearch = () => {
  if (searchQuery.value.trim()) {
    // 검색 페이지로 이동 (쿼리스트링에 입력값 전달)
    router.push({ path: '/search', query: { q: searchQuery.value.trim() } })
  }
}

// ✅ 기능 카드 클릭 시 해당 페이지로 이동
const handleCardClick = (cardType) => {
  router.push(`/${cardType.toLowerCase()}`)
}
</script>

<style scoped>
/* 👇 스타일은 원본 그대로 유지하되, 앞서 설명한 것처럼 요소별 정렬과 시각 효과 중심으로 작성된 스타일입니다 */
.banner-slide {
  height: 260px;
  width: 100%;
}
.banner-img-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.carousel-control-prev,
.carousel-control-next {
  top: 50%;
  transform: translateY(-50%);
}
.carousel-indicators button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  border: 2px solid #fff;
  margin: 0 6px;
}
.carousel-indicators button.active {
  background-color: #fff;
  transform: scale(1.2);
}
.card-hover {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 16px !important;
}
.card-hover:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
}
.pe-15 {
  padding-right: 4.5rem !important;
}
.pe-20 {
  padding-right: 6rem !important;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
