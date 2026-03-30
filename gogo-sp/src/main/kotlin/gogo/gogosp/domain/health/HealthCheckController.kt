package gogo.gogosp.domain.health

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HealthCheckController {

    @GetMapping("/sp/health")
    fun healthCheck() = "GOGO Sp Service OK"

}
