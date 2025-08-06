<!-- ReviewView.vue - 빵집 후기 페이지 (외부 이미지 적용) -->
<template>
  <div class="d-flex flex-column min-vh-100 bg-light">
    <!-- 헤더 -->
    <div class="app-header bg-white shadow-sm sticky-top">
      <div class="container-fluid py-3">
        <div class="d-flex align-items-center">
          <button class="btn btn-icon btn-light me-3" @click="goBack">
            <i class="ki-duotone ki-arrow-left fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </button>

          <h2 class="fw-bold text-gray-800 mb-0 me-auto">빵집 후기</h2>

          <button class="btn btn-warning" @click="writeReview">
            <i class="ki-duotone ki-star fs-3 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            후기 작성
          </button>
        </div>
      </div>
    </div>

    <!-- 지역 및 필터 -->
    <div class="container-fluid py-4">
      <div class="row g-3">
        <div class="col-auto">
          <div class="dropdown">
            <button class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
              <i class="ki-duotone ki-geolocation fs-4 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ selectedLocation }}
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#" @click="setLocation('전체')">전체</a></li>
              <li><a class="dropdown-item" href="#" @click="setLocation('서울')">서울</a></li>
              <li><a class="dropdown-item" href="#" @click="setLocation('경기')">경기</a></li>
              <li><a class="dropdown-item" href="#" @click="setLocation('부산')">부산</a></li>
            </ul>
          </div>
        </div>

        <div class="col-auto">
          <div class="dropdown">
            <button class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
              <i class="ki-duotone ki-star fs-4 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ selectedRating }}
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#" @click="setRating('전체')">전체</a></li>
              <li>
                <a class="dropdown-item" href="#" @click="setRating('5점')">⭐⭐⭐⭐⭐ 5점</a>
              </li>
              <li>
                <a class="dropdown-item" href="#" @click="setRating('4점 이상')"
                  >⭐⭐⭐⭐ 4점 이상</a
                >
              </li>
              <li>
                <a class="dropdown-item" href="#" @click="setRating('3점 이상')">⭐⭐⭐ 3점 이상</a>
              </li>
            </ul>
          </div>
        </div>

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
              <li><a class="dropdown-item" href="#" @click="setSort('평점순')">평점순</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 빵집 후기 목록 -->
    <div class="flex-grow-1 container-fluid pb-4">
      <div class="row g-4">
        <!-- 후기 카드 1 -->
        <div class="col-12">
          <div class="card card-flush shadow-sm border-0 card-hover" @click="viewReview(1)">
            <div class="card-body p-6">
              <!-- 빵집 정보 헤더 -->
              <div class="d-flex align-items-center mb-4">
                <div class="symbol symbol-60px me-4">
                  <img
                    src="/assets/media/images/sungsu_bakery.jpg"
                    alt="빵집"
                    class="rounded-3"
                    style="object-fit: cover"
                  />
                </div>
                <div class="flex-grow-1">
                  <h3 class="fw-bold text-gray-800 mb-1">성수동 더베이커리</h3>
                  <div class="d-flex align-items-center mb-2">
                    <div class="rating me-3">
                      <i class="ki-duotone ki-star fs-6 text-warning">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <i class="ki-duotone ki-star fs-6 text-warning">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <i class="ki-duotone ki-star fs-6 text-warning">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <i class="ki-duotone ki-star fs-6 text-warning">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <i class="ki-duotone ki-star fs-6 text-warning">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <span class="fw-bold text-warning ms-1">5.0</span>
                    </div>
                    <span class="badge badge-light-primary">케이크 전문</span>
                  </div>
                  <div class="text-muted fs-7">
                    <i class="ki-duotone ki-geolocation fs-6 me-1">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    서울 성동구 성수동
                  </div>
                </div>
                <div class="text-end">
                  <span class="text-muted fs-8">2시간 전</span>
                </div>
              </div>

              <!-- 리뷰 내용 -->
              <div class="mb-4">
                <p class="text-gray-700 fs-6 mb-3">
                  성수동에서 가장 맛있는 크루아상을 파는 곳이에요! 특히 아몬드 크루아상이 진짜
                  최고입니다. 버터향이 진하고 겉은 바삭, 속은 촉촉해서 한 번 먹으면 잊을 수 없어요.
                  사장님도 너무 친절하시고 매장 분위기도 아늑해서 자주 가게 되는 곳입니다.
                </p>
              </div>

              <!-- 리뷰 이미지들 -->
              <div class="row g-3 mb-4">
                <div class="col-4 col-md-3">
                  <img
                    src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80"
                    class="rounded-3 w-100"
                    style="height: 100px; object-fit: cover"
                    alt="리뷰 사진"
                  />
                </div>
                <div class="col-4 col-md-3">
                  <img
                    src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80"
                    class="rounded-3 w-100"
                    style="height: 100px; object-fit: cover"
                    alt="리뷰 사진"
                  />
                </div>
                <div class="col-4 col-md-3">
                  <img
                    src="/assets/media/images/review_bread1.jpg"
                    class="rounded-3 w-100"
                    style="height: 100px; object-fit: cover"
                    alt="리뷰 사진"
                  />
                </div>
              </div>

              <!-- 작성자 및 반응 -->
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-35px me-3">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="작성자"
                      class="rounded-circle"
                    />
                  </div>
                  <div>
                    <span class="fw-semibold text-gray-800 fs-7">빵덕후123</span>
                    <span class="text-muted fs-8 d-block">방문일: 2024.11.15</span>
                  </div>
                </div>

                <div class="d-flex align-items-center">
                  <button class="btn btn-sm btn-light-primary me-2">
                    <i class="ki-duotone ki-heart fs-6 me-1">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    좋아요 47
                  </button>
                  <button class="btn btn-sm btn-light me-2">
                    <i class="ki-duotone ki-message-text fs-6 me-1">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                    </i>
                    댓글 12
                  </button>
                  <button class="btn btn-sm btn-light">
                    <i class="ki-duotone ki-share fs-6">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 후기 카드 2 -->
        <div class="col-12">
          <div class="card card-flush shadow-sm border-0 card-hover" @click="viewReview(2)">
            <div class="card-body p-6">
              <div class="d-flex align-items-center mb-4">
                <div class="symbol symbol-60px me-4">
                  <img
                    src="/assets/media/images/nagasaki_bakery.jpg"
                    alt="빵집"
                    class="rounded-3"
                    style="object-fit: cover"
                  />
                </div>
                <div class="flex-grow-1">
                  <h3 class="fw-bold text-gray-800 mb-1">홍대 마더스베이커리</h3>
                  <div class="d-flex align-items-center mb-2">
                    <div class="rating me-3">
                      <i class="ki-duotone ki-star fs-6 text-warning">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <i class="ki-duotone ki-star fs-6 text-warning">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <i class="ki-duotone ki-star fs-6 text-warning">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <i class="ki-duotone ki-star fs-6 text-warning">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <i class="ki-duotone ki-star fs-6 text-muted">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <span class="fw-bold text-warning ms-1">4.0</span>
                    </div>
                    <span class="badge badge-light-success">빵 전문</span>
                  </div>
                  <div class="text-muted fs-7">
                    <i class="ki-duotone ki-geolocation fs-6 me-1">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    서울 마포구 홍대입구
                  </div>
                </div>
                <div class="text-end">
                  <span class="text-muted fs-8">5시간 전</span>
                </div>
              </div>

              <div class="mb-4">
                <p class="text-gray-700 fs-6 mb-3">
                  홍대에서 유명한 베이커리입니다. 소금빵이 정말 맛있어요! 겉은 바삭하고 속은
                  부드러워서 한 개 먹으면 자꾸 손이 갑니다. 다만 사람이 많아서 줄을 좀 서야 해요.
                  그래도 기다릴 만한 가치가 있는 곳이에요.
                </p>
              </div>

              <div class="row g-3 mb-4">
                <div class="col-4 col-md-3">
                  <img
                    src="/assets/media/images/review_bread2.jpg"
                    class="rounded-3 w-100"
                    style="height: 100px; object-fit: cover"
                    alt="리뷰 사진"
                  />
                </div>
                <div class="col-4 col-md-3">
                  <img
                    src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80"
                    class="rounded-3 w-100"
                    style="height: 100px; object-fit: cover"
                    alt="리뷰 사진"
                  />
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-35px me-3">
                    <img
                      src="https://randomuser.me/api/portraits/women/65.jpg"
                      alt="작성자"
                      class="rounded-circle"
                    />
                  </div>
                  <div>
                    <span class="fw-semibold text-gray-800 fs-7">홍대맛집러</span>
                    <span class="text-muted fs-8 d-block">방문일: 2024.11.14</span>
                  </div>
                </div>

                <div class="d-flex align-items-center">
                  <button class="btn btn-sm btn-light-primary me-2">
                    <i class="ki-duotone ki-heart fs-6 me-1">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    좋아요 23
                  </button>
                  <button class="btn btn-sm btn-light me-2">
                    <i class="ki-duotone ki-message-text fs-6 me-1">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                    </i>
                    댓글 8
                  </button>
                  <button class="btn btn-sm btn-light">
                    <i class="ki-duotone ki-share fs-6">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 후기 카드 3 -->
        <div class="col-12">
          <div class="card card-flush shadow-sm border-0 card-hover" @click="viewReview(3)">
            <div class="card-body p-6">
              <div class="d-flex align-items-center mb-4">
                <div class="symbol symbol-60px me-4">
                  <img
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=60&q=80"
                    alt="빵집"
                    class="rounded-3"
                    style="object-fit: cover"
                  />
                </div>
                <div class="flex-grow-1">
                  <h3 class="fw-bold text-gray-800 mb-1">강남 디저트하우스</h3>
                  <div class="d-flex align-items-center mb-2">
                    <div class="rating me-3">
                      <i class="ki-duotone ki-star fs-6 text-warning">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <i class="ki-duotone ki-star fs-6 text-warning">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <i class="ki-duotone ki-star fs-6 text-warning">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <i class="ki-duotone ki-star fs-6 text-warning">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <i class="ki-duotone ki-star fs-6 text-warning">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <span class="fw-bold text-warning ms-1">4.8</span>
                    </div>
                    <span class="badge badge-light-danger">디저트 전문</span>
                  </div>
                  <div class="text-muted fs-7">
                    <i class="ki-duotone ki-geolocation fs-6 me-1">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    서울 강남구 역삼동
                  </div>
                </div>
                <div class="text-end">
                  <span class="text-muted fs-8">1일 전</span>
                </div>
              </div>

              <div class="mb-4">
                <p class="text-gray-700 fs-6 mb-3">
                  강남에서 유명한 디저트 카페입니다. 티라미수가 정말 부드럽고 맛있어요. 내부
                  인테리어도 세련되고 조용해서 친구들과 담소 나누기 좋아요.
                </p>
              </div>

              <div class="row g-3 mb-4">
                <div class="col-4 col-md-3">
                  <img
                    src="/assets/media/images/review_bread3.jpg"
                    class="rounded-3 w-100"
                    style="height: 100px; object-fit: cover"
                    alt="리뷰 사진"
                  />
                </div>
                <div class="col-4 col-md-3">
                  <img
                    src="/assets/media/images/paris_baguette.jpg"
                    class="rounded-3 w-100"
                    style="height: 100px; object-fit: cover"
                    alt="리뷰 사진"
                  />
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-35px me-3">
                    <img
                      src="https://randomuser.me/api/portraits/men/76.jpg"
                      alt="작성자"
                      class="rounded-circle"
                    />
                  </div>
                  <div>
                    <span class="fw-semibold text-gray-800 fs-7">디저트매니아</span>
                    <span class="text-muted fs-8 d-block">방문일: 2024.11.10</span>
                  </div>
                </div>

                <div class="d-flex align-items-center">
                  <button class="btn btn-sm btn-light-primary me-2">
                    <i class="ki-duotone ki-heart fs-6 me-1">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    좋아요 35
                  </button>
                  <button class="btn btn-sm btn-light me-2">
                    <i class="ki-duotone ki-message-text fs-6 me-1">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                    </i>
                    댓글 10
                  </button>
                  <button class="btn btn-sm btn-light">
                    <i class="ki-duotone ki-share fs-6">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 필요시 후기 카드 더 추가 가능 -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedLocation: '전체',
      selectedRating: '전체',
      selectedSort: '최신순',
    }
  },
  methods: {
    goBack() {
      window.history.back()
    },
    writeReview() {
      // 후기 작성 페이지 이동 예: this.$router.push('/write-review')
      alert('후기 작성 페이지로 이동합니다.')
    },
    setLocation(location) {
      this.selectedLocation = location
      // TODO: 필터링 로직 추가
    },
    setRating(rating) {
      this.selectedRating = rating
      // TODO: 필터링 로직 추가
    },
    setSort(sort) {
      this.selectedSort = sort
      // TODO: 정렬 로직 추가
    },
    viewReview(id) {
      // 상세 후기 페이지로 이동 예: this.$router.push(`/review/${id}`)
      alert(`후기 상세 페이지로 이동합니다. (id: ${id})`)
    },
  },
}
</script>

<style scoped>
.card-hover {
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}
.card-hover:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
</style>
