import api from './axios'

export const loginApi = (data) => api.post('/api/auth/login', data)

export const getAllUsersApi = () => api.get('/api/admin/users')
export const getUsersByRoleApi = (role) => api.get(`/api/admin/users/role/${role}`)
export const createUserApi = (data) => api.post('/api/admin/users', data)
export const updateUserApi = (id, data) => api.put(`/api/admin/users/${id}`, data)
export const deleteUserApi = (id) => api.delete(`/api/admin/users/${id}`)

export const getMyQuestionsApi = () => api.get('/api/teacher/questions')
export const createQuestionApi = (data) => api.post('/api/teacher/questions', data)
export const updateQuestionApi = (id, data) => api.put(`/api/teacher/questions/${id}`, data)
export const deleteQuestionApi = (id) => api.delete(`/api/teacher/questions/${id}`)

export const getMyQuizzesApi = () => api.get('/api/teacher/quizzes')
export const createQuizApi = (data) => api.post('/api/teacher/quizzes', data)
export const updateQuizApi = (id, data) => api.put(`/api/teacher/quizzes/${id}`, data)
export const deleteQuizApi = (id) => api.delete(`/api/teacher/quizzes/${id}`)
export const getQuizStatsApi = (id) => api.get(`/api/teacher/quizzes/${id}/stats`)
export const getStudentsApi = () => api.get('/api/teacher/students')

export const getStudentQuizzesApi = () => api.get('/api/student/quizzes')
export const startQuizApi = (quizId) => api.post(`/api/student/quizzes/${quizId}/start`)
export const submitQuizApi = (quizId, data) => api.post(`/api/student/quizzes/${quizId}/submit`, data)
export const getMyResultsApi = () => api.get('/api/student/results')
export const getQuizResultApi = (quizId) => api.get(`/api/student/quizzes/${quizId}/result`)