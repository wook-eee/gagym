package com.gagym.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDto {
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SignupRequest {
        private String username;
        private String password;
        private String email;
        private String nickname;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SignupResponse {
        private Long userId;
        private String username;
        private String email;
        private String nickname;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String username;
        private String password;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginResponse {
        private String token;
        private Long userId;
        private String username;
        private String email;
        private String nickname;
        private String authProvider;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmailVerificationRequest {
        private String email;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmailVerificationConfirmRequest {
        private String email;
        private String verificationCode;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SocialLoginRequest {
        private String email;
        private String name;
        private String providerId;
        private String authProvider;
    }
} 