// services/recipeService.js
import axios from 'axios'

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:7001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 로딩 상태 등을 여기서 처리할 수 있습니다
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API 에러:', error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export const recipeService = {
  // 레시피 목록 조회
  async getRecipes(params = {}) {
    try {
      const response = await api.get('/recipes', { params })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '레시피 목록을 불러오는데 실패했습니다.')
    }
  },

  // 레시피 상세 조회
  async getRecipe(id) {
    try {
      const response = await api.get(`/recipes/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '레시피를 불러오는데 실패했습니다.')
    }
  },

  // 레시피 생성
  async createRecipe(recipeData) {
    try {
      const formData = new FormData()

      // 일반 필드들 추가
      Object.keys(recipeData).forEach((key) => {
        if (key !== 'image' && recipeData[key] !== null && recipeData[key] !== undefined) {
          formData.append(key, recipeData[key])
        }
      })

      // 이미지 파일 추가
      if (recipeData.image) {
        formData.append('image', recipeData.image)
      }

      const response = await api.post('/recipes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '레시피 등록에 실패했습니다.')
    }
  },

  // 레시피 좋아요/취소
  async toggleLike(recipeId, userId) {
    try {
      const response = await api.post(`/recipes/${recipeId}/like`, { user_id: userId })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '좋아요 처리에 실패했습니다.')
    }
  },

  // 댓글 작성
  async createComment(recipeId, commentData) {
    try {
      const response = await api.post(`/recipes/${recipeId}/comments`, commentData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '댓글 작성에 실패했습니다.')
    }
  },

  // 카테고리 목록 조회
  async getCategories() {
    try {
      const response = await api.get('/categories')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '카테고리 목록을 불러오는데 실패했습니다.')
    }
  },

  // 인기 레시피 조회
  async getPopularRecipes() {
    try {
      const response = await api.get('/recipes/popular/weekly')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '인기 레시피를 불러오는데 실패했습니다.')
    }
  },

  // 사용자 정보 조회
  async getUser(userId) {
    try {
      const response = await api.get(`/users/${userId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '사용자 정보를 불러오는데 실패했습니다.')
    }
  },
}

export default recipeService
