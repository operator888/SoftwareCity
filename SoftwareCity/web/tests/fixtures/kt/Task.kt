// Kotlin: class, data class, extension function, enum class.
package demo

enum class Status {
    PENDING, ACTIVE, DONE
}

data class Task(val id: Long, val name: String, var status: Status = Status.PENDING)

class TaskRepository {
    private val tasks = mutableListOf<Task>()

    fun add(t: Task) { tasks.add(t) }
    fun findById(id: Long): Task? = tasks.find { it.id == id }
    fun active(): List<Task> = tasks.filter { it.status == Status.ACTIVE }
}

fun Task.shortName(): String = name.take(8)
