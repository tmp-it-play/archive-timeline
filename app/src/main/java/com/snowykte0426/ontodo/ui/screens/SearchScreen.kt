package com.snowykte0426.ontodo.ui.screens

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.OutlinedTextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.lifecycle.viewmodel.compose.viewModel
import com.snowykte0426.ontodo.viewmodel.TodoViewModel

@Composable
fun SearchScreen(todoViewModel: TodoViewModel = viewModel()) {
    var keyword by remember { mutableStateOf("") }

    Column(modifier = Modifier
        .fillMaxSize()
        .padding(16.dp)) {
        OutlinedTextField(
            value = keyword,
            onValueChange = { keyword = it },
            label = { Text("검색") }
        )

        Button(onClick = { todoViewModel.loadTodos() }) {
            Text("검색하기")
        }
    }
}
