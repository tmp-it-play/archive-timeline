package gogo.gogouser.global.filter

import gogo.gogouser.domain.user.persistence.Authority
import gogo.gogouser.global.jwt.JwtGenerator
import gogo.gogouser.global.jwt.JwtProperties
import io.jsonwebtoken.security.Keys
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.nio.charset.StandardCharsets

@Component
class AuthenticationFilter(
    private val jwtGenerator: JwtGenerator,
    private val jwtProperties: JwtProperties,
) : OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val userId: String? = request.getHeader("Request-User-Id")
        val authority: Authority? = request.getHeader("Request-User-Authority")?.run { Authority.valueOf(this) }

        if (userId != null && authority != null) {
            setAuthentication(userId, authority)
            filterChain.doFilter(request, response)
            return
        }

        val bearerToken = request.getHeader("Authorization")
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            try {
                val token = bearerToken.removePrefix("Bearer ")
                val key = Keys.hmacShaKeyFor(jwtProperties.accessSecret.toByteArray(StandardCharsets.UTF_8))
                val claims = jwtGenerator.getTokenBody(token, key)
                val subject = claims.subject
                val authorityValue = Authority.valueOf(claims.get(JwtGenerator.AUTHORITY, String::class.java))
                setAuthentication(subject, authorityValue)
            } catch (_: Exception) {
                // 유효하지 않은 토큰이면 인증 없이 통과 → Security 규칙에 위임
            }
        }

        filterChain.doFilter(request, response)
    }

    private fun setAuthentication(userId: String, authority: Authority) {
        val authorities: MutableCollection<SimpleGrantedAuthority> = ArrayList()
        authorities.add(SimpleGrantedAuthority("ROLE_${authority.name}"))
        val userDetails: UserDetails = User(userId, "", authorities)
        val authentication: Authentication =
            UsernamePasswordAuthenticationToken(userDetails, "", userDetails.authorities)
        SecurityContextHolder.getContext().authentication = authentication
    }
}