<template>
  <!-- 전체 페이지 컨테이너: 세로 플렉스박스, 최소 높이 100vh, 연한 회색 배경 -->
  <div class="d-flex flex-column min-vh-100 bg-light">
    <!-- 상단 헤더: 흰색 배경, 그림자, 스크롤 시 상단 고정 -->
    <div class="app-header bg-white shadow-sm sticky-top">
      <div class="container-fluid py-3">
        <div class="d-flex align-items-center">
          <!-- 뒤로가기 버튼 -->
          <button class="btn btn-icon btn-light me-3" @click="goBack">
            <i class="ki-duotone ki-arrow-left fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </button>

          <!-- 페이지 제목 (me-auto로 오른쪽 여백 자동 확장) -->
          <h2 class="fw-bold text-gray-800 mb-0 me-auto">레시피 공유</h2>

          <!-- 레시피 작성 버튼 -->
          <button class="btn btn-primary" @click="createRecipe">
            <i class="ki-duotone ki-plus fs-3 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            레시피 작성
          </button>
        </div>
      </div>
    </div>

    <!-- 필터 및 정렬 영역 -->
    <div class="container-fluid py-4">
      <div class="row g-3">
        <!-- 카테고리 필터 드롭다운 -->
        <div class="col-auto">
          <div class="dropdown">
            <button class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
              <i class="ki-duotone ki-category fs-4 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
              </i>
              {{ selectedFilter }}
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#" @click="setFilter('전체')">전체</a></li>
              <!-- v-for로 카테고리 목록 반복 생성 -->
              <li v-for="category in categories" :key="category.id">
                <a class="dropdown-item" href="#" @click="setFilter(category.name)">
                  {{ category.name }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- 정렬 드롭다운 -->
        <div class="col-auto">
          <div class="dropdown">
            <button class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
              <i class="ki-duotone ki-sort fs-4 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ selectedSort }}
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#" @click="setSort('최신순')">최신순</a></li>
              <li><a class="dropdown-item" href="#" @click="setSort('인기순')">인기순</a></li>
              <li><a class="dropdown-item" href="#" @click="setSort('댓글순')">댓글순</a></li>
              <li><a class="dropdown-item" href="#" @click="setSort('조회순')">조회순</a></li>
            </ul>
          </div>
        </div>

        <!-- 검색 입력 필드 (ms-auto로 오른쪽 정렬) -->
        <div class="col-auto ms-auto">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="레시피 검색..."
              v-model="searchQuery"
              @keyup.enter="searchRecipes"
            />
            <button class="btn btn-primary" @click="searchRecipes">
              <i class="ki-duotone ki-magnifier fs-4">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 로딩 상태 표시 (v-if로 조건부 렌더링) -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- 레시피 목록 영역 (v-else로 로딩이 아닐 때만 표시) -->
    <div v-else class="flex-grow-1 container-fluid pb-4">
      <div class="row g-4">
        <!-- 레시피 카드 반복 생성 (v-for 사용) -->
        <div v-for="recipe in recipes" :key="recipe.id" class="col-12 col-md-6 col-lg-4">
          <!-- 반응형 그리드: 모바일(12), 태블릿(6), 데스크톱(4) -->
          <div
            class="card card-flush h-100 shadow-sm border-0 card-hover"
            @click="viewRecipe(recipe.id)"
          >
            <!-- 카드 헤더 (이미지 영역) -->
            <div class="card-header p-0">
              <div class="position-relative">
                <!-- 레시피 이미지 (없으면 기본 이미지 사용) -->
                <img
                  :src="recipe.image_url || '\assets\media\images\croissant_recipe.jpg'"
                  class="card-img-top rounded-top-4"
                  style="height: 200px; object-fit: cover"
                  :alt="recipe.title"
                />
                <!-- 카테고리 배지 (이미지 우상단) -->
                <div class="position-absolute top-0 end-0 m-3">
                  <span class="badge badge-primary">{{ recipe.category_name || '기타' }}</span>
                </div>
                <!-- 조리시간 배지 (이미지 좌하단) -->
                <div class="position-absolute bottom-0 start-0 m-3">
                  <span class="badge badge-light-success">
                    <i class="ki-duotone ki-timer fs-7 me-1">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                    </i>
                    {{ formatCookingTime(recipe.cooking_time) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 카드 본문 -->
            <div class="card-body p-4">
              <!-- 레시피 제목 -->
              <h4 class="fw-bold text-gray-800 mb-2">{{ recipe.title }}</h4>

              <!-- 레시피 설명 (60자로 제한) -->
              <p class="text-muted fs-6 mb-3">
                {{ truncateText(recipe.description, 60) }}
              </p>

              <!-- 작성자 정보 -->
              <div class="d-flex align-items-center mb-3">
                <!-- 프로필 이미지 -->
                <div class="symbol symbol-35px me-3">
                  <img
                    :src="recipe.profile_image || 'https://via.placeholder.com/35/DDD/999?text=U'"
                    :alt="recipe.username"
                    class="rounded-circle"
                  />
                </div>
                <div class="flex-grow-1">
                  <!-- 작성자 이름 -->
                  <span class="fw-semibold text-gray-800 fs-7">{{ recipe.username }}</span>
                  <!-- 작성일 (상대적 시간) -->
                  <span class="text-muted fs-8 d-block">{{ formatDate(recipe.created_at) }}</span>
                </div>
              </div>

              <!-- 통계 정보 (좋아요, 댓글, 조회수, 평점) -->
              <div class="d-flex justify-content-between align-items-center">
                <!-- 좌측: 좋아요, 댓글, 조회수 -->
                <div class="d-flex">
                  <span class="text-muted fs-7 me-3">
                    <i class="ki-duotone ki-heart fs-6 me-1 text-danger">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    {{ formatNumber(recipe.likes_count) }}
                  </span>
                  <span class="text-muted fs-7 me-3">
                    <i class="ki-duotone ki-message-text fs-6 me-1">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                    </i>
                    {{ formatNumber(recipe.comments_count) }}
                  </span>
                  <span class="text-muted fs-7">
                    <i class="ki-duotone ki-eye fs-6 me-1">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                    </i>
                    {{ formatNumber(recipe.views_count) }}
                  </span>
                </div>
                <!-- 우측: 평점 -->
                <div class="rating">
                  <i class="ki-duotone ki-star fs-6 text-warning">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  <span class="fw-bold text-warning ms-1">{{ recipe.rating || '0.0' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 빈 상태 메시지 (로딩 중이 아니고 레시피가 없을 때) -->
      <div v-if="!loading && recipes.length === 0" class="text-center py-5">
        <i class="ki-duotone ki-file-deleted fs-3x text-muted mb-3">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        <h4 class="text-muted">등록된 레시피가 없습니다</h4>
        <p class="text-muted">첫 번째 레시피를 등록해보세요!</p>
      </div>

      <!-- 더보기 버튼 (더 많은 레시피가 있을 때만 표시) -->
      <div v-if="hasMoreRecipes" class="text-center mt-8">
        <button class="btn btn-light-primary" @click="loadMore" :disabled="loadingMore">
          <!-- 로딩 중일 때 스피너, 아닐 때 화살표 -->
          <span v-if="loadingMore" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="ki-duotone ki-arrow-down fs-3 me-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          {{ loadingMore ? '로딩 중...' : '더 많은 레시피 보기' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Vue 3 Composition API 사용 - setup 함수 없이 간단하게 작성

// 필요한 Vue 함수들과 라이브러리 import
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { recipeService } from '@/services/recipeService'

// 라우터 인스턴스 생성 (페이지 이동용)
const router = useRouter()

// ============== 반응형 데이터 정의 ==============
// ref(): 반응형 참조 생성 - 값이 변경되면 화면이 자동으로 재렌더링됨

const selectedFilter = ref('전체') // 현재 선택된 카테고리 필터
const selectedSort = ref('최신순') // 현재 선택된 정렬 방식
const searchQuery = ref('') // 검색어 입력값
const recipes = ref([]) // 레시피 목록 배열
const categories = ref([]) // 카테고리 목록 배열
const loading = ref(false) // 초기 로딩 상태
const loadingMore = ref(false) // 더보기 로딩 상태
const currentPage = ref(1) // 현재 페이지 번호
const totalPages = ref(1) // 전체 페이지 수

// ============== 계산된 속성 (Computed) ==============
// computed(): 다른 반응형 데이터를 기반으로 계산되는 값
// 의존하는 데이터가 변경될 때만 재계산됨 (성능 최적화)

const hasMoreRecipes = computed(() => currentPage.value < totalPages.value)
// 현재 페이지 < 전체 페이지 = 더 많은 레시피 있음

// ============== 메서드 정의 ==============

// 뒤로가기 기능 - 브라우저 히스토리 사용
const goBack = () => {
  window.history.back()
}

// 레시피 작성 페이지로 이동
const createRecipe = () => {
  console.log('레시피 작성 페이지로 이동')
  // 실제 구현 시: router.push('/recipes/create')
}

// 카테고리 필터 설정
const setFilter = async (filter) => {
  selectedFilter.value = filter // 선택된 필터 업데이트
  currentPage.value = 1 // 페이지를 처음으로 리셋
  await loadRecipes(true) // 레시피 목록 새로 로드
}

// 정렬 방식 설정
const setSort = async (sort) => {
  selectedSort.value = sort // 선택된 정렬 방식 업데이트
  currentPage.value = 1 // 페이지를 처음으로 리셋
  await loadRecipes(true) // 레시피 목록 새로 로드
}

// 검색 실행
const searchRecipes = async () => {
  currentPage.value = 1 // 페이지를 처음으로 리셋
  await loadRecipes(true) // 레시피 목록 새로 로드
}

// 레시피 상세 페이지로 이동
const viewRecipe = (id) => {
  console.log(`레시피 ${id} 상세보기`)
  router.push(`/recipes/${id}`) // Vue Router로 페이지 이동
}

// 더 많은 레시피 로드 (무한 스크롤 대신 버튼 방식)
const loadMore = async () => {
  if (hasMoreRecipes.value && !loadingMore.value) {
    currentPage.value++ // 다음 페이지로 증가
    await loadRecipes(false) // 기존 목록에 추가로 로드
  }
}

// 레시피 목록을 서버에서 로드
const loadRecipes = async (reset = false) => {
  try {
    // 로딩 상태 설정
    if (reset) {
      loading.value = true // 초기 로딩 (전체 화면 스피너)
    } else {
      loadingMore.value = true // 더보기 로딩 (버튼 스피너)
    }

    // API 요청 파라미터 구성
    const params = {
      category: selectedFilter.value, // 선택된 카테고리
      sort: selectedSort.value, // 선택된 정렬 방식
      page: currentPage.value, // 현재 페이지
      limit: 12, // 한 페이지당 12개 아이템
    }

    // 검색어가 있으면 파라미터에 추가
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }

    // 레시피 서비스를 통해 API 호출
    const response = await recipeService.getRecipes(params)

    // 응답 데이터로 화면 업데이트
    if (reset) {
      // 새로 로드: 기존 목록 교체
      recipes.value = response.data.recipes
    } else {
      // 더보기: 기존 목록에 추가
      recipes.value.push(...response.data.recipes)
    }

    // 페이지네이션 정보 업데이트
    totalPages.value = response.data.pagination.totalPages
  } catch (error) {
    console.error('레시피 목록 로드 실패:', error)
    // 실제 앱에서는 사용자에게 토스트 메시지로 에러 알림
  } finally {
    // 성공/실패 관계없이 로딩 상태 해제
    loading.value = false
    loadingMore.value = false
  }
}

// 카테고리 목록을 서버에서 로드
const loadCategories = async () => {
  try {
    const response = await recipeService.getCategories()
    categories.value = response.data
  } catch (error) {
    console.error('카테고리 로드 실패:', error)
  }
}

// ============== 유틸리티 함수들 ==============

// 조리 시간을 읽기 쉬운 형태로 변환 (분 → "30분", "2시간 30분" 등)
const formatCookingTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes}분`
  } else if (minutes < 1440) {
    // 1440분 = 1일
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}시간 ${remainingMinutes}분` : `${hours}시간`
  } else {
    const days = Math.floor(minutes / 1440)
    return `${days}일`
  }
}

// 긴 텍스트를 지정된 길이로 자르고 "..." 추가
const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// 날짜를 상대적 시간으로 변환 ("2시간 전", "3일 전" 등)
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now - date
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    return `${diffInMinutes}분 전`
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전`
  } else {
    return date.toLocaleDateString('ko-KR') // "2024.12.15" 형태
  }
}

// 큰 숫자를 간단한 형태로 변환 (1000 → 1k)
const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// ============== 컴포넌트 생명주기 ==============

// onMounted: 컴포넌트가 DOM에 마운트된 후 실행
// 이 시점에서 초기 데이터를 로드
onMounted(async () => {
  // Promise.all: 여러 비동기 작업을 동시에 실행 (성능 향상)
  await Promise.all([
    loadCategories(), // 카테고리 목록 로드
    loadRecipes(true), // 초기 레시피 목록 로드
  ])
})
</script>

<style scoped>
/* scoped: 이 컴포넌트에만 적용되는 CSS */

/* 카드 호버 효과 */
.card-hover {
  cursor: pointer; /* 마우스 커서를 포인터로 변경 */
  transition: all 0.3s ease; /* 모든 속성 변화에 0.3초 애니메이션 */
}

.card-hover:hover {
  transform: translateY(-5px); /* 호버 시 카드를 5px 위로 이동 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important; /* 더 진한 그림자 */
}

/* 카드 이미지 애니메이션 */
.card-img-top {
  transition: transform 0.3s ease; /* 이미지 변형에 애니메이션 */
}

/* 호버 시 이미지 5% 확대 */
.card-hover:hover .card-img-top {
  transform: scale(1.05);
}

/* 평점 표시 영역 */
.rating {
  display: flex;
  align-items: center;
}

/* 검색 입력 그룹 최소 너비 */
.input-group {
  min-width: 300px;
}

/* 반응형 디자인 */

/* 태블릿 (768px 이하) */
@media (max-width: 768px) {
  .input-group {
    min-width: 200px;
  }
}

/* 모바일 (576px 이하) */
@media (max-width: 576px) {
  .card-body {
    padding: 1rem !important; /* 카드 본문 패딩 축소 */
  }

  .col-12 {
    margin-bottom: 1rem; /* 카드 간 간격 추가 */
  }

  .input-group {
    min-width: 150px; /* 검색창 더 축소 */
  }
}
</style>
