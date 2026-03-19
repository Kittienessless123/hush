package com.example.hushandroidclient.ui.screens.home

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

@Composable
fun HomeScreen(navController: NavController) {
    // Как в React: <Flex gap="medium" vertical>
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Как в React: <Title>hush</Title>
        Text(
            text = "hush",
            fontSize = 48.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF1890FF) // @color/primary
        )

        Spacer(modifier = Modifier.height(32.dp))

        // Как в React: <Flex gap="medium">
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Кнопка Register как в React
            Button(
                onClick = { navController.navigate("register") },
                modifier = Modifier.width(200.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF1890FF)
                )
            ) {
                Text("Register")
            }

            // Кнопка Login как в React
            Button(
                onClick = { navController.navigate("login") },
                modifier = Modifier.width(200.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF1890FF)
                )
            ) {
                Text("Login")
            }
        }
    }
}