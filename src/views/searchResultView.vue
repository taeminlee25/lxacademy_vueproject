<template>
  <!-- 전체 레이아웃: 세로 방향 flex, 최소 높이 화면 전체, 배경 연한 회색 -->
  <div class="d-flex flex-column min-vh-100 bg-light">
    <!-- 검색 헤더: 상단 고정, 흰색 배경, 그림자 효과 -->
    <div class="app-header bg-white shadow-sm sticky-top">
      <div class="container-fluid py-3">
        <div class="d-flex align-items-center">
          <!-- 뒤로가기 버튼: 클릭 시 홈 페이지로 이동 -->
          <button
            class="btn btn-icon btn-light me-3"
            @click="goBack"
            type="button"
            aria-label="뒤로가기"
          >
            <i class="ki-duotone ki-left fs-6"></i>
          </button>

          <!-- 빵 종류 선택 드롭다운 -->
          <div class="dropdown me-3">
            <!-- 드롭다운 버튼: 선택된 빵 이름 표시 -->
            <button
              class="btn btn-sm btn-light-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="fas fa-bread-slice fs-6 me-2 text-warning"></i>
              {{ selectedBread || '빵 종류 선택' }}
            </button>
            <!-- 드롭다운 메뉴: 빵 리스트 반복 렌더링 -->
            <ul class="dropdown-menu">
              <li v-for="bread in breadList" :key="bread">
                <!-- 클릭 시 해당 빵 선택, 기본 동작 막기 -->
                <a class="dropdown-item" href="#" @click.prevent="selectBread(bread)">
                  <i class="fas fa-bread-slice fs-6 me-2 text-warning"></i>{{ bread }}
                </a>
              </li>
            </ul>
          </div>

          <!-- 검색 입력창 영역 (position-relative로 아이콘 위치 조절) -->
          <div class="position-relative flex-grow-1">
            <!-- 검색 아이콘: 입력창 왼쪽에 위치 -->
            <i
              class="bi bi-search fs-3 text-gray-500 position-absolute top-50 translate-middle-y ms-4"
              aria-hidden="true"
            ></i>
            <!-- 검색 input: v-model 양방향 바인딩, 엔터키 입력 시 검색 수행 -->
            <input
              type="text"
              v-model="searchQuery"
              @keyup.enter="performSearch"
              class="form-control form-control-solid ps-13 bg-light border-0 rounded-pill"
              placeholder="빵을 검색해주세요!"
              aria-label="검색 입력"
            />
          </div>

          <!-- 검색 버튼: 입력값이 비어있으면 비활성화 -->
          <button
            @click="performSearch"
            class="btn btn-primary"
            type="button"
            :disabled="!searchQuery || !searchQuery.trim()"
            aria-label="검색"
          >
            검색
          </button>
        </div>
      </div>
    </div>

    <!-- 검색 결과 콘텐츠 영역 -->
    <div class="flex-grow-1 px-3 py-4">
      <!-- 검색 결과 헤더: 검색어와 결과 개수 표시 -->
      <div class="mb-5" v-if="currentSearchTerm">
        <h2 class="fw-bold text-gray-800 mb-2">
          <i class="ki-duotone ki-magnifier me-2 text-primary fs-2"></i>
          "{{ currentSearchTerm }}" 검색 결과
        </h2>
        <p class="text-muted fs-6 mb-0">총 {{ totalResults }}개의 결과를 찾았습니다.</p>
      </div>

      <!-- 검색 결과가 없을 때 보여주는 안내 메시지 -->
      <div v-if="totalResults === 0 && currentSearchTerm" class="text-center py-5">
        <div class="symbol symbol-100px mx-auto mb-4">
          <span class="symbol-label bg-light-warning">
            <i class="bi bi-search fs-1 text-warning"></i>
          </span>
        </div>
        <h4 class="text-gray-800 fw-bold mb-2">검색 결과가 없습니다</h4>
        <p class="text-muted mb-4">다른 키워드로 검색해보세요!</p>
        <!-- 홈으로 돌아가기 버튼 -->
        <button class="btn btn-primary" type="button" @click="goBack">
          <i class="ki-duotone ki-home fs-6 me-2"></i>홈으로 돌아가기
        </button>
      </div>

      <!-- 레시피 검색 결과 섹션 -->
      <section v-if="searchResults.recipes.length > 0" class="mb-6" aria-label="레시피 검색 결과">
        <!-- 섹션 헤더 -->
        <div class="d-flex align-items-center mb-4">
          <div class="symbol symbol-50px me-3">
            <span class="symbol-label bg-light-primary">
              <i class="fas fa-book-open fs-1 text-primary"></i>
            </span>
          </div>
          <div>
            <h4 class="fw-bold text-gray-800 mb-0">레시피 공유</h4>
            <p class="text-muted fs-7 mb-0">{{ searchResults.recipes.length }}개 결과</p>
          </div>
        </div>
        <!-- 카드 그리드: 반응형 -->
        <div class="row g-4">
          <div v-for="recipe in searchResults.recipes" :key="recipe.id" class="col-md-6 col-lg-4">
            <div
              class="card border-0 shadow-sm h-100 card-hover"
              @click="goToRecipe(recipe.id)"
              role="button"
              tabindex="0"
              @keyup.enter="goToRecipe(recipe.id)"
              aria-label="레시피 상세 보기"
            >
              <img
                :src="recipe.image"
                class="card-img-top rounded-top-4"
                style="height: 200px; object-fit: cover"
                :alt="recipe.title"
              />
              <div class="card-body p-4">
                <h5 class="card-title fw-bold text-gray-800 mb-2">{{ recipe.title }}</h5>
                <p class="card-text text-muted fs-6 mb-3">{{ recipe.description }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center">
                    <i class="ki-duotone ki-time text-warning me-1 fs-6"></i>
                    <small class="text-muted">{{ recipe.cookTime }}</small>
                  </div>
                  <div class="d-flex align-items-center">
                    <i class="ki-duotone ki-star text-warning me-1 fs-6"></i>
                    <small class="text-muted">{{ recipe.rating }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 빵집 후기 검색 결과 섹션 -->
      <section
        v-if="searchResults.reviews.length > 0"
        class="mb-6"
        aria-label="빵집 후기 검색 결과"
      >
        <div class="d-flex align-items-center mb-4">
          <div class="symbol symbol-50px me-3">
            <span class="symbol-label bg-light-warning">
              <i class="ki-duotone ki-star fs-2 text-warning"></i>
            </span>
          </div>
          <div>
            <h4 class="fw-bold text-gray-800 mb-0">빵집 후기</h4>
            <p class="text-muted fs-7 mb-0">{{ searchResults.reviews.length }}개 결과</p>
          </div>
        </div>
        <div class="row g-4">
          <div v-for="review in searchResults.reviews" :key="review.id" class="col-md-6 col-lg-4">
            <div
              class="card border-0 shadow-sm h-100 card-hover"
              @click="goToReview(review.id)"
              role="button"
              tabindex="0"
              @keyup.enter="goToReview(review.id)"
              aria-label="빵집 후기 상세 보기"
            >
              <img
                :src="review.image"
                class="card-img-top rounded-top-4"
                style="height: 200px; object-fit: cover"
                :alt="review.bakeryName"
              />
              <div class="card-body p-4">
                <h5 class="card-title fw-bold text-gray-800 mb-2">{{ review.bakeryName }}</h5>
                <p class="card-text text-muted fs-6 mb-3">{{ review.content }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center">
                    <i class="ki-duotone ki-geolocation text-danger me-1 fs-6"></i>
                    <small class="text-muted">{{ review.location }}</small>
                  </div>
                  <div class="d-flex align-items-center">
                    <i class="ki-duotone ki-star text-warning me-1 fs-6"></i>
                    <small class="text-muted">{{ review.rating }}/5</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Q&A 검색 결과 섹션 -->
      <section v-if="searchResults.qnas.length > 0" class="mb-6" aria-label="Q&A 검색 결과">
        <div class="d-flex align-items-center mb-4">
          <div class="symbol symbol-50px me-3">
            <span class="symbol-label bg-light-success">
              <i class="fas fa-question-circle fs-1 text-success"></i>
            </span>
          </div>
          <div>
            <h4 class="fw-bold text-gray-800 mb-0">Q&A</h4>
            <p class="text-muted fs-7 mb-0">{{ searchResults.qnas.length }}개 결과</p>
          </div>
        </div>
        <div class="row g-4">
          <div v-for="qna in searchResults.qnas" :key="qna.id" class="col-12">
            <div
              class="card border-0 shadow-sm card-hover"
              @click="goToQna(qna.id)"
              role="button"
              tabindex="0"
              @keyup.enter="goToQna(qna.id)"
              aria-label="Q&A 상세 보기"
            >
              <div class="card-body p-4">
                <div class="d-flex align-items-start">
                  <div class="symbol symbol-40px me-4">
                    <span class="symbol-label bg-success">
                      <span class="text-white fw-bold fs-6">Q</span>
                    </span>
                  </div>
                  <div class="flex-grow-1">
                    <h5 class="card-title fw-bold text-gray-800 mb-2">{{ qna.question }}</h5>
                    <p class="card-text text-muted fs-6 mb-3">{{ qna.preview }}</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <small class="text-muted">{{ qna.author }} • {{ qna.date }}</small>
                      <div class="d-flex align-items-center">
                        <i class="ki-duotone ki-message-text text-primary me-1 fs-6"></i>
                        <small class="text-muted">{{ qna.answers }}개 답변</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 자유게시판 검색 결과 섹션 -->
      <section
        v-if="searchResults.community.length > 0"
        class="mb-6"
        aria-label="자유게시판 검색 결과"
      >
        <div class="d-flex align-items-center mb-4">
          <div class="symbol symbol-50px me-3">
            <span class="symbol-label bg-light-danger">
              <i class="fas fa-comments fs-1 text-danger"></i>
            </span>
          </div>
          <div>
            <h4 class="fw-bold text-gray-800 mb-0">자유게시판</h4>
            <p class="text-muted fs-7 mb-0">{{ searchResults.community.length }}개 결과</p>
          </div>
        </div>
        <div class="row g-4">
          <div v-for="post in searchResults.community" :key="post.id" class="col-12">
            <div
              class="card border-0 shadow-sm card-hover"
              @click="goToCommunity(post.id)"
              role="button"
              tabindex="0"
              @keyup.enter="goToCommunity(post.id)"
              aria-label="자유게시판 글 보기"
            >
              <div class="card-body p-4">
                <h5 class="card-title fw-bold text-gray-800 mb-2">{{ post.title }}</h5>
                <p class="card-text text-muted fs-6 mb-3">{{ post.content }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">{{ post.author }} • {{ post.date }}</small>
                  <div class="d-flex align-items-center">
                    <div class="d-flex align-items-center me-4">
                      <i class="ki-duotone ki-heart text-danger me-1 fs-6"></i>
                      <small class="text-muted">{{ post.likes }}</small>
                    </div>
                    <div class="d-flex align-items-center">
                      <i class="ki-duotone ki-message-text text-primary me-1 fs-6"></i>
                      <small class="text-muted">{{ post.comments }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
// Vue 3 <script setup> 문법 사용
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Vue Router 관련 인스턴스
const router = useRouter()
const route = useRoute()

// 선택된 빵 종류 상태(초기화: 쿼리 파라미터 또는 빈 문자열)
const selectedBread = ref(route.query.q || '')
// 검색어 상태 (처음에는 선택된 빵 종류 복사)
const searchQuery = ref(selectedBread.value)

// 현재 검색된 키워드 (검색 결과 헤더 표시용)
const currentSearchTerm = ref('')
// 검색 결과 데이터 상태 (초기 빈 배열)
const searchResults = ref({
  recipes: [],
  reviews: [],
  qnas: [],
  community: [],
})

// 빵 종류 리스트 (드롭다운에 사용)
const breadList = ['카스텔라', '베이글', '크루아상', '치아바타', '와플', '스콘', '머핀']

// 더미 데이터 (실제 API 호출 대신 사용)
// - 각 카테고리별 아이템 배열 포함
const allData = {
  recipes: [
    {
      id: 1,
      title: '집에서 만드는 부드러운 카스텔라',
      description:
        '일본 전통 방식으로 만드는 촉촉한 카스텔라 레시피입니다. 달걀 거품을 잘 내는 것이 핵심!',
      image: '/assets/media/images/castella_recipe.jpg',
      cookTime: '45분',
      rating: '4.8',
      tags: ['카스텔라', '디저트', '일본과자', '스펀지케이크'],
    },
    {
      id: 2,
      title: 'NY 스타일 베이글 만들기',
      description: '쫄깃한 식감의 정통 뉴욕 베이글 레시피입니다. 끓는 물에 삶는 과정이 중요해요.',
      image: '/assets/media/images/bagel_recipe.jpg',
      cookTime: '2시간',
      rating: '4.6',
      tags: ['베이글', '브런치', '빵', '뉴욕'],
    },
    {
      id: 3,
      title: '프랑스식 크루아상 레시피',
      description: '버터 향이 가득한 겹겹이 바삭한 크루아상을 집에서도 만들 수 있어요.',
      image: '/assets/media/images/croissant_recipe.jpg',
      cookTime: '4시간',
      rating: '4.9',
      tags: ['크루아상', '프랑스', '페이스트리', '버터'],
    },
    {
      id: 4,
      title: '홈메이드 와플 만들기',
      description: '바삭바삭한 겉면과 부드러운 속살의 와플을 집에서 쉽게!',
      image: '/assets/media/images/waffle_recipe.jpg',
      cookTime: '30분',
      rating: '4.7',
      tags: ['와플', '브런치', '디저트'],
    },
  ],
  reviews: [
    {
      id: 1,
      bakeryName: '나가사키 카스텔라 명동 지점',
      content:
        '정말 부드럽고 달콤한 카스텔라입니다. 일본에서 먹던 맛 그대로! 포장도 예쁘게 해주셔서 선물용으로도 좋아요.',
      image: '/assets/media/images/nagasaki_bakery.jpg',
      location: '명동',
      rating: '4.7',
      tags: ['카스텔라', '명동', '일본과자', '선물'],
    },
    {
      id: 2,
      bakeryName: '포베이글 강남점',
      content:
        '신선한 재료로 만든 베이글이 정말 맛있어요. 크림치즈와 찰떡궁합! 아침 식사로 완벽합니다.',
      image: '/assets/media/images/fourb_store.jpg',
      location: '강남',
      rating: '4.5',
      tags: ['베이글', '강남', '브런치', '크림치즈'],
    },
    {
      id: 3,
      bakeryName: '파리바게뜨 강남역점',
      content: '크루아상이 정말 바삭하고 맛있어요. 버터 향이 진짜 좋습니다.',
      image: '/assets/media/images/paris_baguette.jpg',
      location: '강남역',
      rating: '4.3',
      tags: ['크루아상', '강남역', '프랑스빵', '버터'],
    },
  ],
  qnas: [
    {
      id: 1,
      question: '카스텔라에 들어가는 계란은 몇 개인가요?',
      preview: '카스텔라 레시피에 계란 개수를 정확히 알고 싶어요.',
      author: '사용자A',
      date: '2025-08-01',
      answers: 5,
      tags: ['카스텔라', '계란', '레시피'],
    },
    {
      id: 2,
      question: '베이글을 더 쫄깃하게 만드는 팁이 있나요?',
      preview: '베이글 식감을 개선하는 방법에 대해 질문드립니다.',
      author: '사용자B',
      date: '2025-08-02',
      answers: 3,
      tags: ['베이글', '식감', '팁'],
    },
  ],
  community: [
    {
      id: 1,
      title: '내가 좋아하는 카스텔라 맛집 공유',
      content: '서울에서 맛있는 카스텔라를 파는 가게 추천해요!',
      author: '빵덕후',
      date: '2025-07-31',
      likes: 12,
      comments: 3,
      tags: ['카스텔라', '맛집', '추천'],
    },
    {
      id: 2,
      title: '베이글 만들기 도전 후기',
      content: '처음 만들어봤는데 생각보다 어렵네요 ㅎㅎ',
      author: '홈베이커',
      date: '2025-08-01',
      likes: 7,
      comments: 2,
      tags: ['베이글', '도전기', '홈베이킹'],
    },
  ],
}

// 검색 결과 총합(각 카테고리 결과 수 합산)
const totalResults = computed(() => {
  return (
    searchResults.value.recipes.length +
    searchResults.value.reviews.length +
    searchResults.value.qnas.length +
    searchResults.value.community.length
  )
})

// 검색 수행 함수
function performSearch() {
  const query = searchQuery.value.trim()
  if (!query) {
    // 빈 검색어면 결과 초기화
    clearSearch()
    return
  }

  currentSearchTerm.value = query

  // 검색어에 따라 빵 종류 자동 선택
  const queryLower = query.toLowerCase()

  // 빵 종류 목록에서 검색어와 일치하는 것 찾기
  const matchingBread = breadList.find(
    (bread) => bread.toLowerCase().includes(queryLower) || queryLower.includes(bread.toLowerCase()),
  )

  // 일치하는 빵 종류가 있으면 자동 선택
  if (matchingBread) {
    selectedBread.value = matchingBread
  }

  // 선택된 빵 종류로 필터링
  const selectedBreadLower = selectedBread.value.toLowerCase()

  // 문자열 포함 여부 + 빵 종류 매칭 조건으로 필터링
  const filteredRecipes = allData.recipes.filter((item) => {
    const queryLower = query.toLowerCase()
    const titleMatch = item.title.toLowerCase().includes(queryLower)
    const descriptionMatch = item.description.toLowerCase().includes(queryLower)
    const tagMatch = item.tags.some((tag) => tag.toLowerCase().includes(queryLower))
    const breadTagMatch = item.tags.some((tag) => tag.toLowerCase() === selectedBreadLower)
    return (titleMatch || descriptionMatch || tagMatch) && breadTagMatch
  })

  const filteredReviews = allData.reviews.filter((item) => {
    const queryLower = query.toLowerCase()
    const bakeryMatch = item.bakeryName.toLowerCase().includes(queryLower)
    const contentMatch = item.content.toLowerCase().includes(queryLower)
    const tagMatch = item.tags.some((tag) => tag.toLowerCase().includes(queryLower))
    const breadTagMatch = item.tags.some((tag) => tag.toLowerCase() === selectedBreadLower)
    return (bakeryMatch || contentMatch || tagMatch) && breadTagMatch
  })

  const filteredQnas = allData.qnas.filter((item) => {
    const queryLower = query.toLowerCase()
    const questionMatch = item.question.toLowerCase().includes(queryLower)
    const previewMatch = item.preview.toLowerCase().includes(queryLower)
    const tagMatch = item.tags.some((tag) => tag.toLowerCase().includes(queryLower))
    const breadTagMatch = item.tags.some((tag) => tag.toLowerCase() === selectedBreadLower)
    return (questionMatch || previewMatch || tagMatch) && breadTagMatch
  })

  const filteredCommunity = allData.community.filter((item) => {
    const queryLower = query.toLowerCase()
    const titleMatch = item.title.toLowerCase().includes(queryLower)
    const contentMatch = item.content.toLowerCase().includes(queryLower)
    const tagMatch = item.tags.some((tag) => tag.toLowerCase().includes(queryLower))
    const breadTagMatch = item.tags.some((tag) => tag.toLowerCase() === selectedBreadLower)
    return (titleMatch || contentMatch || tagMatch) && breadTagMatch
  })

  // 필터링 결과 반영
  searchResults.value.recipes = filteredRecipes
  searchResults.value.reviews = filteredReviews
  searchResults.value.qnas = filteredQnas
  searchResults.value.community = filteredCommunity

  // URL 쿼리 파라미터 업데이트 (히스토리 기록 없이)
  router.replace({
    query: {
      q: query,
    },
  })
}

// 빵 종류 선택 함수 (드롭다운 클릭 시)
function selectBread(bread) {
  selectedBread.value = bread
  searchQuery.value = bread
}

// 검색 결과 초기화
function clearSearch() {
  searchQuery.value = ''
  currentSearchTerm.value = ''
  searchResults.value = {
    recipes: [],
    reviews: [],
    qnas: [],
    community: [],
  }
  router.replace({ query: {} })
}

// 뒤로 가기 함수 (홈으로 이동)
function goBack() {
  router.push({ path: '/' })
}

// 상세 페이지로 이동 함수들
function goToRecipe(id) {
  router.push({ name: 'RecipeDetail', params: { id } })
}
function goToReview(id) {
  router.push({ name: 'ReviewDetail', params: { id } }) // 실제 라우터 이름 확인 필요
}
function goToQna(id) {
  router.push({ name: 'QnaDetail', params: { id } }) // 실제 라우터 이름 확인 필요
}
function goToCommunity(id) {
  router.push({ name: 'CommunityDetail', params: { id } }) // 실제 라우터 이름 확인 필요
}

// 컴포넌트 마운트 시 URL 쿼리에서 검색어 읽어와 자동 검색 수행
onMounted(() => {
  const query = route.query.q
  if (query && typeof query === 'string') {
    searchQuery.value = query
    performSearch()
  }
})
</script>

<style scoped>
/* 카드 hover 시 그림자 증가 및 살짝 위로 이동 효과 */
.card-hover {
  cursor: pointer;
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
}
.card-hover:hover,
.card-hover:focus {
  box-shadow: 0 0.75rem 1.5rem rgb(0 0 0 / 0.1);
  transform: translateY(-5px);
  outline: none;
}

/* 헤더 고정 영역 스타일 */
.app-header {
  z-index: 1050;
  border-bottom: 1px solid #e5e5e5;
}
</style>
