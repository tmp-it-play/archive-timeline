//package com.snowykte0426.minsole.domain.auth.service;
//
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.snowykte0426.minsole.domain.auth.dto.request.LoginRequest;
//import com.snowykte0426.minsole.domain.auth.dto.request.SignUpRequest;
//import com.snowykte0426.minsole.domain.auth.dto.response.AuthResponse;
//import com.snowykte0426.minsole.domain.auth.entity.User;
//import com.snowykte0426.minsole.domain.auth.repository.UserJpaRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class AuthService {
//
//    private final UserJpaRepository userJpaRepository;
//    private final ObjectMapper objectMapper;
//
//    /**
//     * 회원가입
//     */
//    @Transactional
//    public AuthResponse signUp(SignUpRequest request) {
//        try {
//            // 중복 체크
//            if (userJpaRepository.existsByUser(request.getUser())) {
//                return AuthResponse.builder()
//                    .success(false)
//                    .message("이미 존재하는 사용자명입니다.")
//                    .build();
//            }
//
//            if (userJpaRepository.existsByEmail(request.getEmail())) {
//                return AuthResponse.builder()
//                    .success(false)
//                    .message("이미 존재하는 이메일입니다.")
//                    .build();
//            }
//
//            // 선호 카테고리를 JSON 문자열로 변환
//            String preferredCategoriesJson = "";
//            if (request.getPreferredCategories() != null && !request.getPreferredCategories().isEmpty()) {
//                preferredCategoriesJson = objectMapper.writeValueAsString(request.getPreferredCategories());
//            }
//
//            // 사용자 생성
//            User user = User.builder()
//                    .name()
//                .user(request.getUser())
//                .password(request.getPassword()) // 실제로는 암호화 필요
//                .email(request.getEmail())
//                .nickname(request.getNickname())
//                .preferredLocation(request.getPreferredLocation())
//                .preferredCategories(preferredCategoriesJson)
//                .build();
//
//            User savedUser = userJpaRepository.save(user);
//
//            return AuthResponse.builder()
//                .success(true)
//                .message("회원가입이 완료되었습니다.")
//                .userId(savedUser.getId())
//                .user(savedUser.getUser())
//                .nickname(savedUser.getNickname())
//                .email(savedUser.getEmail())
//                .preferredLocation(savedUser.getPreferredLocation())
//                .preferredCategories(request.getPreferredCategories())
//                .token("mock-jwt-token-" + savedUser.getId()) // 실제로는 JWT 토큰 생성 필요
//                .build();
//
//        } catch (JsonProcessingException e) {
//            log.error("선호 카테고리 JSON 변환 실패", e);
//            return AuthResponse.builder()
//                .success(false)
//                .message("회원가입 처리 중 오류가 발생했습니다.")
//                .build();
//        } catch (Exception e) {
//            log.error("회원가입 실패", e);
//            return AuthResponse.builder()
//                .success(false)
//                .message("회원가입 처리 중 오류가 발생했습니다.")
//                .build();
//        }
//    }
//
//    /**
//     * 로그인
//     */
//    @Transactional(readOnly = true)
//    public AuthResponse login(LoginRequest request) {
//        try {
//            Optional<User> userOptional = userJpaRepository.findByUser(request.getUser());
//
//            if (userOptional.isEmpty()) {
//                return AuthResponse.builder()
//                    .success(false)
//                    .message("존재하지 않는 사용자명입니다.")
//                    .build();
//            }
//
//            User user = userOptional.get();
//
//            // 비밀번호 확인 (실제로는 암호화된 비밀번호와 비교 필요)
//            if (!user.getPassword().equals(request.getPassword())) {
//                return AuthResponse.builder()
//                    .success(false)
//                    .message("비밀번호가 일치하지 않습니다.")
//                    .build();
//            }
//
//            // 선호 카테고리 JSON 파싱
//            List<String> preferredCategories = null;
//            if (user.getPreferredCategories() != null && !user.getPreferredCategories().isEmpty()) {
//                try {
//                    preferredCategories = objectMapper.readValue(user.getPreferredCategories(), List.class);
//                } catch (JsonProcessingException e) {
//                    log.warn("선호 카테고리 JSON 파싱 실패: {}", user.getId(), e);
//                }
//            }
//
//            return AuthResponse.builder()
//                .success(true)
//                .message("로그인 성공")
//                .userId(user.getId())
//                .user(user.getUser())
//                .nickname(user.getNickname())
//                .email(user.getEmail())
//                .preferredLocation(user.getPreferredLocation())
//                .preferredCategories(preferredCategories)
//                .token("mock-jwt-token-" + user.getId()) // 실제로는 JWT 토큰 생성 필요
//                .build();
//
//        } catch (Exception e) {
//            log.error("로그인 실패", e);
//            return AuthResponse.builder()
//                .success(false)
//                .message("로그인 처리 중 오류가 발생했습니다.")
//                .build();
//        }
//    }
//
//    /**
//     * 사용자 정보 조회
//     */
//    @Transactional(readOnly = true)
//    public AuthResponse getUserInfo(Long userId) {
//        try {
//            Optional<User> userOptional = userJpaRepository.findById(userId);
//
//            if (userOptional.isEmpty()) {
//                return AuthResponse.builder()
//                    .success(false)
//                    .message("존재하지 않는 사용자입니다.")
//                    .build();
//            }
//
//            User user = userOptional.get();
//
//            // 선호 카테고리 JSON 파싱
//            List<String> preferredCategories = null;
//            if (user.getPreferredCategories() != null && !user.getPreferredCategories().isEmpty()) {
//                try {
//                    preferredCategories = objectMapper.readValue(user.getPreferredCategories(), List.class);
//                } catch (JsonProcessingException e) {
//                    log.warn("선호 카테고리 JSON 파싱 실패: {}", user.getId(), e);
//                }
//            }
//
//            return AuthResponse.builder()
//                .success(true)
//                .userId(user.getId())
//                .user(user.getUser())
//                .nickname(user.getNickname())
//                .email(user.getEmail())
//                .preferredLocation(user.getPreferredLocation())
//                .preferredCategories(preferredCategories)
//                .build();
//
//        } catch (Exception e) {
//            log.error("사용자 정보 조회 실패: {}", userId, e);
//            return AuthResponse.builder()
//                .success(false)
//                .message("사용자 정보 조회 중 오류가 발생했습니다.")
//                .build();
//        }
//    }
//
//    /**
//     * 위치 정보 업데이트
//     */
//    @Transactional
//    public AuthResponse updateLocation(Long userId, String location) {
//        try {
//            Optional<User> userOptional = userJpaRepository.findById(userId);
//
//            if (userOptional.isEmpty()) {
//                return AuthResponse.builder()
//                    .success(false)
//                    .message("존재하지 않는 사용자입니다.")
//                    .build();
//            }
//
//            User user = userOptional.get();
//            user.updatePreferredLocation(location);
//            userJpaRepository.save(user);
//
//            return AuthResponse.builder()
//                .success(true)
//                .message("위치 정보가 업데이트되었습니다.")
//                .preferredLocation(location)
//                .build();
//
//        } catch (Exception e) {
//            log.error("위치 정보 업데이트 실패: userId={}, location={}", userId, location, e);
//            return AuthResponse.builder()
//                .success(false)
//                .message("위치 정보 업데이트 중 오류가 발생했습니다.")
//                .build();
//        }
//    }
//
//    /**
//     * 선호 카테고리 업데이트
//     */
//    @Transactional
//    public AuthResponse updatePreferredCategories(Long userId, List<String> categories) {
//        try {
//            Optional<User> userOptional = userJpaRepository.findById(userId);
//
//            if (userOptional.isEmpty()) {
//                return AuthResponse.builder()
//                    .success(false)
//                    .message("존재하지 않는 사용자입니다.")
//                    .build();
//            }
//
//            User user = userOptional.get();
//            String categoriesJson = objectMapper.writeValueAsString(categories);
//            user.updatePreferredCategories(categoriesJson);
//            userJpaRepository.save(user);
//
//            return AuthResponse.builder()
//                .success(true)
//                .message("선호 카테고리가 업데이트되었습니다.")
//                .preferredCategories(categories)
//                .build();
//
//        } catch (Exception e) {
//            log.error("선호 카테고리 업데이트 실패: userId={}", userId, e);
//            return AuthResponse.builder()
//                .success(false)
//                .message("선호 카테고리 업데이트 중 오류가 발생했습니다.")
//                .build();
//        }
//    }
//}
