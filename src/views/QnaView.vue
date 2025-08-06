<!-- QnaView.vue - Q&A 페이지 -->
<template>
  <div class="d-flex flex-column min-vh-100 bg-light">
    <!-- ✅ 헤더 -->
    <div class="app-header bg-white shadow-sm sticky-top">
      <div class="container-fluid py-3">
        <div class="d-flex align-items-center">
          <button class="btn btn-icon btn-light me-3" @click="goBack">
            <i class="ki-duotone ki-arrow-left fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </button>
          <h2 class="fw-bold text-gray-800 mb-0 me-auto">Q&A</h2>
          <button class="btn btn-success" @click="askQuestion">
            <i class="ki-duotone ki-questionnaire-tablet fs-3 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            질문하기
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ 필터 영역 -->
    <div class="container-fluid py-4">
      <div class="row g-3">
        <div class="col-auto" v-for="filter in filters" :key="filter.label">
          <div class="dropdown">
            <button class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
              <i :class="filter.icon + ' fs-4 me-2'"></i>
              {{ filter.selected }}
            </button>
            <ul class="dropdown-menu">
              <li v-for="option in filter.options" :key="option">
                <a class="dropdown-item" href="#" @click.prevent="filter.set(option)">
                  {{ option }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ Q&A 리스트 -->
    <div class="flex-grow-1 container-fluid pb-4">
      <div class="row g-4">
        <!-- Q&A 카드 -->
        <div class="col-12" v-for="qna in qnaList" :key="qna.id">
          <div class="card card-flush shadow-sm border-0 card-hover" @click="viewQna(qna.id)">
            <div class="card-body p-6">
              <!-- 질문 -->
              <div class="d-flex align-items-start mb-4">
                <div class="symbol symbol-50px me-4">
                  <span :class="qna.statusClass + ' symbol-label fw-bold fs-5'">Q</span>
                </div>
                <div class="flex-grow-1">
                  <div class="d-flex align-items-center mb-2">
                    <span class="badge me-2" :class="qna.statusBadge">{{ qna.statusText }}</span>
                    <span class="badge badge-light-primary">{{ qna.category }}</span>
                  </div>
                  <h3 class="fw-bold text-gray-800 mb-2">{{ qna.title }}</h3>
                  <p class="text-gray-600 fs-6 mb-3">{{ qna.content }}</p>

                  <!-- 질문자 -->
                  <div class="d-flex align-items-center mb-3">
                    <div class="symbol symbol-30px me-2">
                      <img :src="qna.askerAvatar" alt="질문자" class="rounded-circle" />
                    </div>
                    <span class="text-muted fs-7">{{ qna.askerName }} · {{ qna.time }}</span>
                  </div>
                </div>
              </div>

              <!-- 답변(있을 경우만) -->
              <div v-if="qna.answer" class="d-flex align-items-start border-top pt-4">
                <div class="symbol symbol-50px me-4">
                  <span class="symbol-label bg-light-primary text-primary fw-bold fs-5">A</span>
                </div>
                <div class="flex-grow-1">
                  <div class="d-flex align-items-center mb-2">
                    <span class="badge badge-light-warning">🏆 전문가</span>
                  </div>
                  <p class="text-gray-700 fs-6 mb-3">{{ qna.answer.content }}</p>
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-30px me-2">
                      <img :src="qna.answer.avatar" alt="답변자" class="rounded-circle" />
                    </div>
                    <span class="text-muted fs-7"
                      >{{ qna.answer.name }} · {{ qna.answer.time }}</span
                    >
                  </div>
                </div>
              </div>

              <!-- 통계 & 액션 -->
              <div class="d-flex justify-content-between align-items-center mt-4 pt-4 border-top">
                <div class="d-flex">
                  <span class="text-muted fs-7 me-4">
                    <i class="ki-duotone ki-heart fs-6 me-1 text-danger"></i>
                    도움돼요 {{ qna.likes }}
                  </span>
                  <span class="text-muted fs-7 me-4">
                    <i class="ki-duotone ki-message-text fs-6 me-1"></i>
                    댓글 {{ qna.comments }}
                  </span>
                  <span class="text-muted fs-7">
                    <i class="ki-duotone ki-eye fs-6 me-1"></i>
                    조회 {{ qna.views }}
                  </span>
                </div>
                <button
                  v-if="!qna.answer"
                  class="btn btn-sm btn-success"
                  @click.stop="answerQuestion(qna.id)"
                >
                  <i class="ki-duotone ki-message-add fs-6 me-1"></i> 답변하기
                </button>
                <button v-else class="btn btn-sm btn-light">
                  <i class="ki-duotone ki-share fs-6"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 더보기 -->
      <div class="text-center mt-8">
        <button class="btn btn-light-success" @click="loadMore">
          <i class="ki-duotone ki-arrow-down fs-3 me-2"></i>
          더 많은 Q&A 보기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedCategory = ref('전체')
const selectedStatus = ref('전체')
const selectedSort = ref('최신순')

// ✅ 필터
const filters = [
  {
    label: '카테고리',
    icon: 'ki-duotone ki-category',
    selected: selectedCategory,
    options: ['전체', '베이킹 기초', '재료 관련', '도구 및 장비', '트러블슈팅', '기타'],
    set: (val) => {
      selectedCategory.value = val
    },
  },
  {
    label: '상태',
    icon: 'ki-duotone ki-check-circle',
    selected: selectedStatus,
    options: ['전체', '답변 완료', '답변 대기'],
    set: (val) => {
      selectedStatus.value = val
    },
  },
  {
    label: '정렬',
    icon: 'ki-duotone ki-sort',
    selected: selectedSort,
    options: ['최신순', '답변순', '인기순'],
    set: (val) => {
      selectedSort.value = val
    },
  },
]

// ✅ Q&A 데이터 (임시)
const qnaList = ref([
  {
    id: 1,
    statusText: '✅ 답변완료',
    statusBadge: 'badge-success',
    statusClass: 'bg-light-success text-success',
    category: '베이킹 기초',
    title: '버터를 실온에 두는 이유가 뭔가요?',
    content: '버터를 차갑게 쓰면 안되는 이유가 궁금합니다.',
    askerAvatar: '/assets/media/avatars/300-7.jpg',
    askerName: '베이킹초보',
    time: '3시간 전',
    answer: {
      content: '버터는 실온에서 크림화가 잘 되어 공기를 머금고, 부드러운 식감을 만듭니다.',
      avatar: '/assets/media/avatars/300-8.jpg',
      name: '베이킹마스터',
      time: '2시간 전',
    },
    likes: 15,
    comments: 3,
    views: 127,
  },
  {
    id: 2,
    statusText: '⏳ 답변대기',
    statusBadge: 'badge-warning',
    statusClass: 'bg-light-warning text-warning',
    category: '트러블슈팅',
    title: '마카롱이 계속 갈라져요ㅠㅠ',
    content: '5번째 도전인데 윗면이 계속 갈라져요. 왜 그런 걸까요?',
    askerAvatar: '/assets/media/avatars/300-9.jpg',
    askerName: '마카롱포기싫어',
    time: '1시간 전',
    answer: null,
    likes: 8,
    comments: 12,
    views: 89,
  },
])

// ✅ 이벤트 함수
const goBack = () => window.history.back()
const askQuestion = () => console.log('질문 작성 페이지로 이동')
const viewQna = (id) => console.log(`Q&A ${id} 상세보기`)
const answerQuestion = (id) => console.log(`질문 ${id} 답변하기`)
const loadMore = () => console.log('더 많은 Q&A 로드')
</script>

<style scoped>
.card-hover {
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.symbol-label {
  font-weight: bold;
  font-size: 1.2rem;
}

@media (max-width: 576px) {
  .card-body {
    padding: 1rem !important;
  }

  .d-flex.justify-content-between {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
