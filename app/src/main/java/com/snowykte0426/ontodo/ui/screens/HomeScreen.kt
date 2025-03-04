package com.snowykte0426.ontodo.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.snowykte0426.ontodo.data.model.TodoArticle
import com.snowykte0426.ontodo.viewmodel.TodoViewModel
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.ui.text.style.TextDecoration

@Composable
fun HomeScreen(viewModel: TodoViewModel = viewModel()) {
    val todoList by viewModel.todoList.collectAsState()
    val isRefreshing by viewModel.isRefreshing.collectAsState()
    var showDialog by remember { mutableStateOf(false) }
    var searchQuery by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = {
                    searchQuery = it
                    viewModel.searchTodos(it)
                },
                placeholder = { Text("검색어 입력") },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = { showDialog = true }) {
                Icon(Icons.Default.Add, contentDescription = "추가")
            }
        }
    ) { innerPadding ->
        SwipeRefresh(
            state = rememberSwipeRefreshState(isRefreshing),
            onRefresh = { viewModel.loadTodos() },
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
        ) {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
            ) {
                items(todoList) { todo ->
                    TodoItem(
                        todo = todo,
                        onToggle = { viewModel.toggleComplete(it) },
                        onDelete = { viewModel.deleteTodo(it.id)}
                    )
                }
            }
        }

        if (showDialog) {
            AddTodoDialog(
                onAdd = { content, level ->
                    viewModel.addTodo(content, level)
                    showDialog = false
                },
                onDismiss = { showDialog = false }
            )
        }
    }
}

@Composable
fun AddTodoDialog(onAdd: (String, String) -> Unit, onDismiss: () -> Unit) {
    var content by remember { mutableStateOf("") }
    var level by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("새로운 TODO 추가") },
        text = {
            Column {
                OutlinedTextField(
                    value = content,
                    onValueChange = { content = it },
                    label = { Text("내용") }
                )
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(
                    value = level,
                    onValueChange = { level = it },
                    label = { Text("레벨") }
                )
            }
        },
        confirmButton = {
            Button(onClick = { onAdd(content, level) }) {
                Text("추가")
            }
        },
        dismissButton = {
            OutlinedButton(onClick = onDismiss) {
                Text("취소")
            }
        }
    )
}

@Composable
fun TodoItem(todo: TodoArticle, onToggle: (TodoArticle) -> Unit, onDelete: (TodoArticle) -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp)
            .background(MaterialTheme.colorScheme.surface)
            .padding(16.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = todo.content,
            modifier = Modifier.weight(1f),
            style = if (todo.isComplete) {
                MaterialTheme.typography.bodyLarge.copy(
                    textDecoration = TextDecoration.LineThrough
                )
            } else {
                MaterialTheme.typography.bodyLarge
            }
        )
        Checkbox(
            checked = todo.isComplete,
            onCheckedChange = { onToggle(todo) }
        )
        IconButton(onClick = { onDelete(todo) }) {
            Icon(Icons.Default.Delete, contentDescription = "삭제")
        }
    }
}