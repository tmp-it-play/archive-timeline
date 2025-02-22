package com.snowykte0426.ontodo.ui.screens

import android.graphics.drawable.Icon
import androidx.compose.foundation.background
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.style.TextDecoration
import com.snowykte0426.ontodo.ui.graphics.getPriorityColor

@Composable
fun HomeScreen(
    modifier: Modifier = Modifier,
    todoViewModel: TodoViewModel = viewModel()
) {
    val todoList by todoViewModel.todoList.collectAsState()

    Scaffold(
        modifier = modifier.fillMaxSize(),
        floatingActionButton = {
            FloatingActionButton(onClick = {
                todoViewModel.addTodo("새로운 TODO", 2)
            }) {
                Icon(imageVector = Icons.Default.Add, contentDescription = "추가")
            }
        }
    ) { innerPadding ->
        Column(modifier = Modifier.padding(innerPadding)) {
            Text("📌 TODO 리스트", style = MaterialTheme.typography.headlineSmall, modifier = Modifier.padding(16.dp))

            LazyColumn {
                items(todoList) { todo ->
                    TodoItem(todo, onToggle = { todoViewModel.toggleComplete(it) })
                }
            }
        }
    }
}

@Composable
fun TodoItem(todo: TodoArticle, onToggle: (TodoArticle) -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp, horizontal = 16.dp)
            .background(MaterialTheme.colorScheme.surface, RoundedCornerShape(8.dp))
            .clip(RoundedCornerShape(8.dp))
    ) {
        // 왼쪽 중요도 표시 바
        Box(
            modifier = Modifier
                .width(8.dp)
                .fillMaxHeight()
                .background(getPriorityColor(todo.level))
        )

        // TODO 내용 및 체크박스
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = todo.context,
                modifier = Modifier.weight(1f),
                style = if (todo.isComplete) {
                    MaterialTheme.typography.bodyLarge.copy(
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
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
        }
    }
}

