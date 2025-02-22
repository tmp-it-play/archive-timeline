package com.snowykte0426.ontodo.data.repository

import com.snowykte0426.ontodo.data.api.RetrofitClient
import com.snowykte0426.ontodo.data.model.TodoArticle

/*
class TodoRepository {
    private val apiService = RetrofitClient.apiService

    suspend fun getArticles(offset: Int, limit: Int) = apiService.getArticles(offset, limit)

    suspend fun searchArticles(
        keyword: String?,
        isComplete: Boolean?,
        date: String?,
        level: Int?,
        offset: Int,
        limit: Int
    ) = apiService.searchArticles(keyword, isComplete, date, level, offset, limit)

    suspend fun createArticle(todo: TodoArticle) = apiService.createArticle(todo)

    suspend fun updateArticle(id: Int, todo: TodoArticle) = apiService.updateArticle(id, todo)

    suspend fun deleteArticle(id: Int) = apiService.deleteArticle(id)
}
*/
import kotlinx.coroutines.delay

class TodoRepository {

    // 🚀 임시 데이터 리스트
    private val mockTodos = mutableListOf(
        TodoArticle(1, "Jetpack Compose 배우기", 2, false),
        TodoArticle(2, "Spring Boot API 개발", 3, true),
        TodoArticle(3, "운동 가기", 1, false),
    )

    // 🚀 TODO 리스트 가져오기 (네트워크 대신 임시 데이터 반환)
    suspend fun getArticles(offset: Int, limit: Int): List<TodoArticle> {
        delay(500) // 네트워크 지연을 시뮬레이션
        return mockTodos
    }

    // 🚀 TODO 추가 (네트워크 대신 로컬 리스트에 추가)
    suspend fun createArticle(todo: TodoArticle): TodoArticle {
        mockTodos.add(todo)
        return todo
    }

    // 🚀 TODO 수정
    suspend fun updateArticle(id: Int, updatedTodo: TodoArticle): TodoArticle {
        val index = mockTodos.indexOfFirst { it.id == id }
        if (index != -1) {
            mockTodos[index] = updatedTodo
        }
        return updatedTodo
    }

    // 🚀 TODO 삭제
    suspend fun deleteArticle(id: Int) {
        mockTodos.removeAll { it.id == id }
    }
}
