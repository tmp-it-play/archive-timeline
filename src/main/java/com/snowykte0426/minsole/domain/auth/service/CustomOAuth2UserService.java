package com.snowykte0426.minsole.domain.auth.service;

import com.snowykte0426.minsole.domain.auth.entity.Provider;
import com.snowykte0426.minsole.domain.auth.entity.Role;
import com.snowykte0426.minsole.domain.auth.entity.User;
import com.snowykte0426.minsole.domain.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        String registrationId = oAuth2UserRequest.getClientRegistration().getRegistrationId();
        
        // Extract user details from OAuth2 response
        Map<String, Object> attributes = oAuth2User.getAttributes();
        
        String email = "";
        String name = "";
        String profileImageUrl = "";
        String providerId = "";
        
        if ("google".equals(registrationId)) {
            email = (String) attributes.get("email");
            name = (String) attributes.get("name");
            profileImageUrl = (String) attributes.get("picture");
            providerId = (String) attributes.get("sub");
        }
        
        if (!StringUtils.hasText(email)) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
            // Update existing user
            if (!user.getProvider().equals(Provider.valueOf(registrationId.toUpperCase()))) {
                throw new OAuth2AuthenticationException(
                        "You're signed up with " + user.getProvider() + 
                        " account. Please use your " + user.getProvider() + " account to login.");
            }
            user.updateProfile(name, profileImageUrl);
            user = userRepository.save(user);
            user.setAttributes(attributes);
        } else {
            // Create new user
            user = User.builder()
                    .email(email)
                    .name(name)
                    .profileImageUrl(profileImageUrl)
                    .provider(Provider.valueOf(registrationId.toUpperCase()))
                    .providerId(providerId)
                    .role(Role.USER)
                    .build();
            user = userRepository.save(user);
            user.setAttributes(attributes);
        }

        return user;
    }
}
