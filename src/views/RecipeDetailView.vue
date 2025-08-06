<!-- RecipeDetailView.vue - 레시피 상세 페이지 -->
<template>
  <div class="d-flex flex-column min-vh-100 bg-light">
    <!-- 헤더 -->
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

          <!-- 페이지 제목 -->
          <h2 class="fw-bold text-gray-800 mb-0 me-auto">레시피 상세</h2>

          <!-- 액션 버튼들 -->
          <div class="d-flex gap-2">
            <button class="btn btn-light-primary" @click="toggleLike" :disabled="likingInProgress">
              <i class="ki-duotone ki-heart fs-4 me-2" :class="{ 'text-danger': isLiked }">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ isLiked ? '좋아요 취소' : '좋아요' }}
            </button>
            <button class="btn btn-light-success">
              <i class="ki-duotone ki-share fs-4 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              공유하기
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- 레시피 상세 내용 -->
    <div v-else-if="recipe" class="flex-grow-1">
      <!-- 레시피 헤더 이미지 -->
      <div class="recipe-hero position-relative">
        <img
          :src="
            recipe.image_url
              ? `http://localhost:7001${recipe.image_url}`
              : 'https://via.placeholder.com/800x400/DDD/999?text=No+Image'
          "
          class="w-100"
          style="height: 400px; object-fit: cover"
          :alt="recipe.title"
        />
        <div class="position-absolute top-0 end-0 m-4">
          <span class="badge badge-primary fs-6 px-3 py-2">{{
            recipe.category_name || '기타'
          }}</span>
        </div>
        <div class="recipe-overlay position-absolute bottom-0 start-0 w-100 p-4">
          <div class="container-fluid">
            <h1 class="text-white fw-bold mb-2">{{ recipe.title }}</h1>
            <div class="d-flex flex-wrap gap-3 text-white">
              <div class="d-flex align-items-center">
                <i class="ki-duotone ki-timer fs-5 me-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
                {{ formatCookingTime(recipe.cooking_time) }}
              </div>
              <div class="d-flex align-items-center">
                <i class="ki-duotone ki-profile-user fs-5 me-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                  <span class="path4"></span>
                </i>
                {{ recipe.servings }}인분
              </div>
              <div class="d-flex align-items-center">
                <i class="ki-duotone ki-medal-star fs-5 me-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
                {{ recipe.difficulty_level }}
              </div>
              <div class="d-flex align-items-center">
                <i class="ki-duotone ki-star fs-5 me-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                {{ recipe.rating || '0.0' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container-fluid py-5">
        <div class="row g-5">
          <!-- 메인 콘텐츠 -->
          <div class="col-lg-8">
            <!-- 레시피 설명 -->
            <div class="card shadow-sm border-0 mb-5">
              <div class="card-body p-5">
                <h3 class="fw-bold text-gray-800 mb-4">레시피 소개</h3>
                <p class="text-gray-600 fs-5 lh-lg">{{ recipe.description }}</p>
              </div>
            </div>

            <!-- 재료 -->
            <div class="card shadow-sm border-0 mb-5">
              <div class="card-body p-5">
                <h3 class="fw-bold text-gray-800 mb-4">
                  <i class="ki-duotone ki-basket fs-2 me-3 text-primary">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                    <span class="path4"></span>
                  </i>
                  재료
                </h3>
                <div class="ingredients-list">
                  <div
                    v-for="(ingredient, index) in formatIngredients(recipe.ingredients)"
                    :key="index"
                    class="d-flex align-items-center py-2 border-bottom border-light"
                  >
                    <div class="symbol symbol-30px me-3">
                      <div class="symbol-label bg-light-primary">
                        <i class="ki-duotone ki-check fs-6 text-primary">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                      </div>
                    </div>
                    <span class="fs-6">{{ ingredient }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 조리 과정 -->
            <div class="card shadow-sm border-0 mb-5">
              <div class="card-body p-5">
                <h3 class="fw-bold text-gray-800 mb-4">
                  <i class="ki-duotone ki-chef-hat fs-2 me-3 text-success">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  조리 과정
                </h3>
                <div class="instructions-list">
                  <div
                    v-for="(step, index) in formatInstructions(recipe.instructions)"
                    :key="index"
                    class="d-flex mb-4"
                  >
                    <div class="step-number me-4">
                      <div class="symbol symbol-40px">
                        <div class="symbol-label bg-primary text-white fw-bold">
                          {{ index + 1 }}
                        </div>
                      </div>
                    </div>
                    <div class="flex-grow-1">
                      <p class="fs-6 text-gray-700 mb-0 lh-lg">{{ step }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 댓글 섹션 -->
            <div class="card shadow-sm border-0">
              <div class="card-body p-5">
                <h3 class="fw-bold text-gray-800 mb-4">
                  <i class="ki-duotone ki-message-text fs-2 me-3 text-warning">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                  </i>
                  댓글 ({{ comments.length }})
                </h3>

                <!-- 댓글 작성 폼 -->
                <div class="comment-form mb-5 p-4 bg-light rounded">
                  <div class="mb-3">
                    <label class="form-label fw-semibold">평점</label>
                    <div class="rating-input d-flex gap-2">
                      <button
                        v-for="star in 5"
                        :key="star"
                        type="button"
                        class="btn btn-sm"
                        :class="newComment.rating >= star ? 'btn-warning' : 'btn-light'"
                        @click="setRating(star)"
                      >
                        <i class="ki-duotone ki-star fs-6">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                      </button>
                    </div>
                  </div>
                  <div class="mb-3">
                    <textarea
                      v-model="newComment.content"
                      class="form-control"
                      rows="3"
                      placeholder="레시피에 대한 후기를 남겨주세요..."
                    ></textarea>
                  </div>
                  <button
                    class="btn btn-primary"
                    @click="submitComment"
                    :disabled="!newComment.content.trim() || commentSubmitting"
                  >
                    <span
                      v-if="commentSubmitting"
                      class="spinner-border spinner-border-sm me-2"
                    ></span>
                    댓글 작성
                  </button>
                </div>

                <!-- 댓글 목록 -->
                <div class="comments-list">
                  <div
                    v-for="comment in comments"
                    :key="comment.id"
                    class="comment-item d-flex mb-4 p-3 bg-light rounded"
                  >
                    <div class="symbol symbol-40px me-3">
                      <img
                        :src="
                          comment.profile_image || 'https://via.placeholder.com/40/DDD/999?text=U'
                        "
                        :alt="comment.username"
                        class="rounded-circle"
                      />
                    </div>
                    <div class="flex-grow-1">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <span class="fw-semibold text-gray-800">{{ comment.username }}</span>
                          <div v-if="comment.rating" class="rating d-inline-block ms-2">
                            <i
                              v-for="star in 5"
                              :key="star"
                              class="ki-duotone ki-star fs-7"
                              :class="star <= comment.rating ? 'text-warning' : 'text-muted'"
                            >
                              <span class="path1"></span>
                              <span class="path2"></span>
                            </i>
                          </div>
                        </div>
                        <span class="text-muted fs-8">{{ formatDate(comment.created_at) }}</span>
                      </div>
                      <p class="text-gray-700 mb-0">{{ comment.content }}</p>
                    </div>
                  </div>

                  <div v-if="comments.length === 0" class="text-center py-4">
                    <i class="ki-duotone ki-message-question fs-3x text-muted mb-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                    </i>
                    <p class="text-muted">아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 사이드바 -->
          <div class="col-lg-4">
            <!-- 작성자 정보 -->
            <div class="card shadow-sm border-0 mb-4">
              <div class="card-body p-4 text-center">
                <div class="symbol symbol-80px mx-auto mb-3">
                  <img
                    :src="recipe.profile_image || 'https://via.placeholder.com/80/DDD/999?text=U'"
                    :alt="recipe.username"
                    class="rounded-circle"
                  />
                </div>
                <h5 class="fw-bold text-gray-800 mb-2">{{ recipe.username }}</h5>
                <p class="text-muted fs-7 mb-3">{{ recipe.email }}</p>
                <button class="btn btn-light-primary btn-sm">
                  <i class="ki-duotone ki-plus fs-6 me-1">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  팔로우
                </button>
              </div>
            </div>

            <!-- 레시피 통계 -->
            <div class="card shadow-sm border-0 mb-4">
              <div class="card-body p-4">
                <h5 class="fw-bold text-gray-800 mb-4">레시피 통계</h5>
                <div class="row g-3">
                  <div class="col-6">
                    <div class="text-center p-3 bg-light rounded">
                      <i class="ki-duotone ki-heart fs-2x text-danger mb-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <div class="fw-bold text-gray-800">
                        {{ formatNumber(recipe.likes_count) }}
                      </div>
                      <div class="fs-8 text-muted">좋아요</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="text-center p-3 bg-light rounded">
                      <i class="ki-duotone ki-eye fs-2x text-primary mb-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                      </i>
                      <div class="fw-bold text-gray-800">
                        {{ formatNumber(recipe.views_count) }}
                      </div>
                      <div class="fs-8 text-muted">조회수</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="text-center p-3 bg-light rounded">
                      <i class="ki-duotone ki-message-text fs-2x text-success mb-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                      </i>
                      <div class="fw-bold text-gray-800">
                        {{ formatNumber(recipe.comments_count) }}
                      </div>
                      <div class="fs-8 text-muted">댓글</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="text-center p-3 bg-light rounded">
                      <i class="ki-duotone ki-star fs-2x text-warning mb-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <div class="fw-bold text-gray-800">{{ recipe.rating || '0.0' }}</div>
                      <div class="fs-8 text-muted">평점</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 레시피 정보 -->
            <div class="card shadow-sm border-0">
              <div class="card-body p-4">
                <h5 class="fw-bold text-gray-800 mb-4">레시피 정보</h5>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="text-muted">등록일</span>
                  <span class="fw-semibold">{{ formatDate(recipe.created_at) }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="text-muted">카테고리</span>
                  <span class="badge badge-light-primary">{{ recipe.category_name }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="text-muted">난이도</span>
                  <span
                    class="badge"
                    :class="{
                      'badge-light-success': recipe.difficulty_level === '쉬움',
                      'badge-light-warning': recipe.difficulty_level === '보통',
                      'badge-light-danger': recipe.difficulty_level === '어려움',
                    }"
                  >
                    {{ recipe.difficulty_level }}
                  </span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="text-muted">조리시간</span>
                  <span class="fw-semibold">{{ formatCookingTime(recipe.cooking_time) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 레시피 없음 -->
    <div v-else class="text-center py-5">
      <i class="ki-duotone ki-file-deleted fs-3x text-muted mb-3">
        <span class="path1"></span>
        <span class="path2"></span>
      </i>
      <h4 class="text-muted">레시피를 찾을 수 없습니다</h4>
      <button class="btn btn-primary mt-3" @click="goBack">목록으로 돌아가기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { recipeService } from '@/services/recipeService'

const route = useRoute()

// 반응형 데이터
const loading = ref(true)
const recipe = ref(null)
const comments = ref([])
const isLiked = ref(false)
const likingInProgress = ref(false)
const commentSubmitting = ref(false)
const newComment = ref({
  content: '',
  rating: 0,
})

// 임시 사용자 ID (실제로는 로그인 시스템에서 가져와야 함)
const currentUserId = ref(1)

// 메서드
const goBack = () => {
  window.history.back()
}

const loadRecipeDetail = async () => {
  try {
    loading.value = true
    const recipeId = route.params.id
    const response = await recipeService.getRecipe(recipeId)

    recipe.value = response.data.recipe
    comments.value = response.data.comments || []

    // 좋아요 상태 확인 (실제로는 API에서 확인해야 함)
    // isLiked.value = await checkIfLiked(recipeId, currentUserId.value)
  } catch (error) {
    console.error('레시피 상세 정보 로드 실패:', error)
  } finally {
    loading.value = false
  }
}

const toggleLike = async () => {
  if (likingInProgress.value) return

  try {
    likingInProgress.value = true

    const response = await recipeService.toggleLike(recipe.value.id, currentUserId.value)
    isLiked.value = response.liked

    // 좋아요 수 업데이트
    if (response.liked) {
      recipe.value.likes_count++
    } else {
      recipe.value.likes_count--
    }
  } catch (error) {
    console.error('좋아요 처리 실패:', error)
  } finally {
    likingInProgress.value = false
  }
}

const setRating = (rating) => {
  newComment.value.rating = rating
}

const submitComment = async () => {
  if (!newComment.value.content.trim()) return

  try {
    commentSubmitting.value = true

    const commentData = {
      user_id: currentUserId.value,
      content: newComment.value.content,
      rating: newComment.value.rating || null,
    }

    await recipeService.createComment(recipe.value.id, commentData)

    // 댓글 목록 새로고침
    await loadRecipeDetail()

    // 폼 초기화
    newComment.value = {
      content: '',
      rating: 0,
    }
  } catch (error) {
    console.error('댓글 작성 실패:', error)
  } finally {
    commentSubmitting.value = false
  }
}

// 유틸리티 함수들
const formatCookingTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes}분`
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}시간 ${remainingMinutes}분` : `${hours}시간`
  } else {
    const days = Math.floor(minutes / 1440)
    return `${days}일`
  }
}

const formatIngredients = (ingredients) => {
  if (!ingredients) return []
  return ingredients
    .split(',')
    .map((ingredient) => ingredient.trim())
    .filter((ingredient) => ingredient)
}

const formatInstructions = (instructions) => {
  if (!instructions) return []
  return instructions
    .split('\n')
    .map((step) => step.trim())
    .filter((step) => step)
}

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
    return date.toLocaleDateString('ko-KR')
  }
}

const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 생명주기
onMounted(() => {
  loadRecipeDetail()
})
</script>

<style scoped>
.recipe-hero {
  height: 400px;
  overflow: hidden;
}

.recipe-overlay {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

.ingredients-list {
  max-height: 400px;
  overflow-y: auto;
}

.instructions-list {
  max-height: 600px;
  overflow-y: auto;
}

.comment-item {
  border-left: 3px solid #e4e6ef;
}

.rating-input .btn {
  border: none;
  padding: 0.25rem 0.5rem;
}

.step-number {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .recipe-hero {
    height: 250px;
  }

  .recipe-overlay .container-fluid {
    padding: 1rem;
  }

  .card-body {
    padding: 1.5rem !important;
  }
}
</style>
