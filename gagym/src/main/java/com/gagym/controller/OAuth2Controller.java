package com.gagym.controller;

import com.gagym.dto.AuthDto;
import com.gagym.entity.User;
import com.gagym.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/oauth2")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class OAuth2Controller {
    
    private final AuthService authService;
    
    @GetMapping("/user")
    public ResponseEntity<AuthDto.LoginResponse> getOAuth2User(@AuthenticationPrincipal OAuth2User oauth2User) {
        if (oauth2User == null) {
            log.error("OAuth2User is null");
            return ResponseEntity.badRequest().build();
        }
        
        Map<String, Object> attributes = oauth2User.getAttributes();
        log.info("OAuth2User attributes: {}", attributes);
        log.info("OAuth2User name: {}", oauth2User.getName());
        log.info("OAuth2User authorities: {}", oauth2User.getAuthorities());
        
        String email = null;
        String name = null;
        String providerId = null;
        
        // Google의 경우
        if (attributes.containsKey("sub")) {
            email = (String) attributes.get("email");
            name = (String) attributes.get("name");
            providerId = (String) attributes.get("sub");
            log.info("Google OAuth2 - Email: {}, Name: {}, ProviderId: {}", email, name, providerId);
        }
        // Kakao의 경우
        else if (attributes.containsKey("id")) {
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            if (kakaoAccount != null) {
                email = (String) kakaoAccount.get("email");
            }
            Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
            if (properties != null) {
                name = (String) properties.get("nickname");
            }
            providerId = String.valueOf(attributes.get("id"));
            log.info("Kakao OAuth2 - Email: {}, Name: {}, ProviderId: {}", email, name, providerId);
        }
        // Naver의 경우
        else if (attributes.containsKey("response")) {
            Map<String, Object> response = (Map<String, Object>) attributes.get("response");
            if (response != null) {
                email = (String) response.get("email");
                name = (String) response.get("name");
                providerId = (String) response.get("id");
            }
            log.info("Naver OAuth2 - Email: {}, Name: {}, ProviderId: {}", email, name, providerId);
        }
        
        if (email == null) {
            // 이메일이 없는 경우 임시 이메일 생성
            email = "temp_" + System.currentTimeMillis() + "@oauth.com";
            log.warn("Email not found in OAuth2 attributes, using temporary email: {}", email);
        }
        
        if (name == null) {
            name = "OAuth 사용자";
            log.warn("Name not found in OAuth2 attributes, using default name: {}", name);
        }
        
        if (providerId == null) {
            providerId = String.valueOf(System.currentTimeMillis());
            log.warn("ProviderId not found in OAuth2 attributes, using timestamp: {}", providerId);
        }
        
        // 소셜 로그인 처리
        User.AuthProvider authProvider = determineAuthProvider(oauth2User);
        log.info("Processing social login for provider: {}", authProvider);
        
        try {
            AuthDto.LoginResponse response = authService.processSocialLogin(email, name, providerId, authProvider);
            log.info("Social login successful for user: {}", response.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Social login failed: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    private User.AuthProvider determineAuthProvider(OAuth2User oauth2User) {
        String registrationId = oauth2User.getName();
        log.info("OAuth2User registrationId: {}", registrationId);
        
        if (registrationId.contains("google")) {
            return User.AuthProvider.GOOGLE;
        } else if (registrationId.contains("kakao")) {
            return User.AuthProvider.KAKAO;
        } else if (registrationId.contains("naver")) {
            return User.AuthProvider.NAVER;
        }
        return User.AuthProvider.LOCAL;
    }
} 