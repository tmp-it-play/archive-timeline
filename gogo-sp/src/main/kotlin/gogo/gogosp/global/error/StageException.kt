package gogo.gogosp.global.error

open class StageException(
    override val message: String,
    val status: Int
) : RuntimeException(message)
