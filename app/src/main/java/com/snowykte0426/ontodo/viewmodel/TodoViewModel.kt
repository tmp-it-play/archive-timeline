package com.snowykte0426.ontodo.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.snowykte0426.ontodo.data.model.TodoArticle
import com.snowykte0426.ontodo.data.repository.TodoRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
/*
class TodoViewModel : ViewModel() {
    private val repository = TodoRepository()

    private val _todoList = MutableStateFlow<List<TodoArticle>>(emptyList())
    val todoList: StateFlow<List<TodoArticle>> = _todoList

    fun loadTodos(offset: Int, limit: Int) {
        viewModelScope.launch {
            _todoList.value = repository.getArticles(offset, limit)
        }
    }

    fun toggleComplete(todo: TodoArticle) {
        viewModelScope.launch {
            val updatedTodo = todo.copy(isComplete = !todo.isComplete)
            repository.updateArticle(todo.id, updatedTodo)
            loadTodos(0, 10)
        }
    }
}
*/

class TodoViewModel : ViewModel() {
    private val repository = TodoRepository()

    private val _todoList = MutableStateFlow<List<TodoArticle>>(emptyList())
    val todoList: StateFlow<List<TodoArticle>> = _todoList

    init {
        loadTodos()
    }

    // 🚀 서버 대신 임시 데이터를 가져옴
    fun loadTodos() {
        viewModelScope.launch {
            _todoList.value = repository.getArticles(0, 10)
        }
    }

    // 🚀 TODO 추가
    fun addTodo(context: String, level: Int) {
        viewModelScope.launch {
            val newTodo = TodoArticle(_todoList.value.size + 1, context, level, false)
            repository.createArticle(newTodo)
            loadTodos() // 리스트 갱신
        }
    }

    // 🚀 TODO 완료 체크
    fun toggleComplete(todo: TodoArticle) {
        viewModelScope.launch {
            val updatedTodo = todo.copy(isComplete = !todo.isComplete)
            repository.updateArticle(todo.id, updatedTodo)
            loadTodos()
        }
    }

    // 🚀 TODO 삭제
    fun deleteTodo(id: Int) {
        viewModelScope.launch {
            repository.deleteArticle(id)
            loadTodos()
        }
    }
}
