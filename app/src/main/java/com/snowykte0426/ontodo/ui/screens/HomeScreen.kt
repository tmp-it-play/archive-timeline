package com.snowykte0426.ontodo.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.snowykte0426.ontodo.data.model.TodoArticle
import com.snowykte0426.ontodo.viewmodel.TodoViewModel
import androidx.compose.material3.Checkbox
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding

@Composable
fun HomeScreen(
    modifier: Modifier = Modifier,
    todoViewModel: TodoViewModel = viewModel()
) {
    val todoList by todoViewModel.todoList.collectAsState()

    Column(modifier = modifier.fillMaxSize().padding(16.dp)) {
        Text("TODO 리스트", style = MaterialTheme.typography.headlineSmall)

        LazyColumn {
            items(todoList) { todo ->
                TodoItem(todo, onToggle = { todoViewModel.toggleComplete(it) })
            }
        }
    }
}


@Composable
fun TodoItem(todo: TodoArticle, onToggle: (TodoArticle) -> Unit) {
    Row(modifier = Modifier.fillMaxWidth().padding(8.dp)) {
        Checkbox(
            checked = todo.isComplete,
            onCheckedChange = { onToggle(todo) }
        )

        Text(
            text = todo.context,
            modifier = Modifier.padding(start = 8.dp),
            style = if (todo.isComplete) {
                MaterialTheme.typography.bodyMedium.copy(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f))
            } else {
                MaterialTheme.typography.bodyMedium
            }
        )
    }
}
