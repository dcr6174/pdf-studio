package `in`.pdfstudio.app

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/** "Add to note" sheet: pick an existing note or make a new one, then Done. Transparent, so it floats over the reader or the page. */
class AddNoteActivity : ComponentActivity() {
    @OptIn(ExperimentalMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val text = intent.getStringExtra("text") ?: ""
        val source = intent.getStringExtra("source") ?: ""
        if (text.isBlank()) { finish(); return }
        setContent {
            val violet = Color(0xFF8B7CFF)
            MaterialTheme(colorScheme = darkColorScheme(primary = violet, surface = Color(0xFF14151D), onSurface = Color(0xFFF2F2F7))) {
                var notes by remember { mutableStateOf(Notes.load(this@AddNoteActivity)) }
                var picked by remember { mutableStateOf<Long?>(null) }
                var query by remember { mutableStateOf("") }
                var creating by remember { mutableStateOf(false) }
                var newTitle by remember { mutableStateOf("") }
                ModalBottomSheet(onDismissRequest = { finish() }, containerColor = Color(0xFF14151D), sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)) {
                    Column(Modifier.padding(horizontal = 22.dp).padding(bottom = 18.dp)) {
                        Text("Add to note", fontSize = 24.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFFF2F2F7))
                        Text("Add to an existing note or create a new note", fontSize = 14.sp, color = Color(0xFF8A8CA3), modifier = Modifier.padding(top = 6.dp, bottom = 14.dp))
                        OutlinedTextField(value = query, onValueChange = { query = it }, singleLine = true, placeholder = { Text("Search notes") }, shape = RoundedCornerShape(28.dp), modifier = Modifier.fillMaxWidth())
                        if (creating) {
                            OutlinedTextField(value = newTitle, onValueChange = { newTitle = it }, singleLine = true, placeholder = { Text("Name of the new note") }, shape = RoundedCornerShape(16.dp),
                                modifier = Modifier.fillMaxWidth().padding(top = 10.dp))
                            Row(Modifier.padding(top = 6.dp)) {
                                TextButton(onClick = {
                                    val id = Notes.create(this@AddNoteActivity, newTitle)
                                    notes = Notes.load(this@AddNoteActivity); picked = id; creating = false; newTitle = ""
                                }) { Text("Create", color = violet) }
                                TextButton(onClick = { creating = false }) { Text("Cancel", color = Color(0xFF8A8CA3)) }
                            }
                        } else {
                            Row(Modifier.fillMaxWidth().clickable { creating = true }.padding(vertical = 14.dp), verticalAlignment = Alignment.CenterVertically) {
                                Text("+", fontSize = 24.sp, color = violet, modifier = Modifier.width(36.dp))
                                Text("New note", fontSize = 17.sp, color = Color(0xFFF2F2F7), fontWeight = FontWeight.SemiBold)
                            }
                        }
                        LazyColumn(Modifier.heightIn(max = 280.dp)) {
                            items(notes.filter { query.isBlank() || it.title.contains(query, ignoreCase = true) }) { n ->
                                Row(Modifier.fillMaxWidth().clickable { picked = n.id }.padding(vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                                    RadioButton(selected = picked == n.id, onClick = { picked = n.id }, colors = RadioButtonDefaults.colors(selectedColor = violet))
                                    Text(n.title, fontSize = 17.sp, color = Color(0xFFF2F2F7), modifier = Modifier.weight(1f))
                                    Text("${n.snippets.size}", fontSize = 13.sp, color = Color(0xFF8A8CA3))
                                }
                            }
                        }
                        Button(
                            onClick = {
                                picked?.let { Notes.addSnippet(this@AddNoteActivity, it, text, source) }
                                Toast.makeText(this@AddNoteActivity, "Saved to note", Toast.LENGTH_SHORT).show()
                                finish()
                            },
                            enabled = picked != null, modifier = Modifier.fillMaxWidth().padding(top = 14.dp).height(52.dp), shape = RoundedCornerShape(26.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF2F2F7), contentColor = Color(0xFF0A0B10))
                        ) { Text("Done", fontWeight = FontWeight.Bold) }
                    }
                }
            }
        }
    }
}
