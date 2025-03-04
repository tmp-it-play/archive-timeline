package com.snowykte0426.ontodo.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.snowykte0426.ontodo.data.model.TodoArticle
import com.snowykte0426.ontodo.data.repository.TodoRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class TodoViewModel : ViewModel() {
    private val repository = TodoRepository()

    private val _todoList = MutableStateFlow<List<TodoArticle>>(emptyList())
    val todoList: StateFlow<List<TodoArticle>> = _todoList

    var isRefreshing = MutableStateFlow(false)

    init {
        loadTodos()
    }

    fun loadTodos() {
        viewModelScope.launch {
            isRefreshing.value = true
            _todoList.value = repository.getArticles()
            isRefreshing.value = false
        }
    }

    fun searchTodos(keyword: String) {
        viewModelScope.launch {
            _todoList.value = repository.searchArticles(keyword)
        }
    }

    fun addTodo(content: String, level: String) {
        viewModelScope.launch {
            repository.createArticle(content, level)
            loadTodos()
        }
    }

    fun updateTodo(todo: TodoArticle, content: String?, level: String?, isCompleted: Boolean?) {
        viewModelScope.launch {
            repository.updateArticle(todo.id, content, level, isCompleted)
            loadTodos()
        }
    }

    fun deleteTodo(id: Long) {
        viewModelScope.launch {
            repository.deleteArticle(id)
            loadTodos()
        }
    }

    fun toggleComplete(todo: TodoArticle) {
        viewModelScope.launch {
            repository.updateArticle(todo.id, null, null, !todo.isCompleted)
            loadTodos()
        }
    }
}