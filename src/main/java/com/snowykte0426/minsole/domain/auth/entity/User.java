package com.snowykte0426.minsole.domain.auth.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User implements UserDetails, OAuth2User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    @Column
    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Provider provider;

    @Column(nullable = false)
    private String providerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Builder
    public User(String email, String name, String profileImageUrl, 
                Provider provider, String providerId, Role role) {
        this.email = email;
        this.name = name;
        this.profileImageUrl = profileImageUrl;
        this.provider = provider;
        this.providerId = providerId;
        this.role = role != null ? role : Role.USER;
    }

    public void updateProfile(String name, String profileImageUrl) {
        this.name = name;
        this.profileImageUrl = profileImageUrl;
        this.updatedAt = LocalDateTime.now();
    }

    // UserDetails implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return null; // OAuth 로그인이므로 비밀번호 없음
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
    
    // OAuth2User 인터페이스 구현
    @Transient // 데이터베이스에 저장하지 않음
    private Map<String, Object> attributes;
    
    public void setAttributes(Map<String, Object> attributes) {
        this.attributes = attributes;
    }
    
    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }
    
    @Override
    public String getName() {
        return this.email;
    }
}
