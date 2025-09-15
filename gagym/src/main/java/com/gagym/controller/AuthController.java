package com.gagym.controller;

import com.gagym.dto.AuthDto;
import com.gagym.entity.User;
import com.gagym.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final AuthService authService;
    
    // 이메일 인증 코드 발송
    @PostMapping("/email/verification")
    public ResponseEntity<String> sendVerificationEmail(@RequestBody AuthDto.EmailVerificationRequest request) {
        authService.sendVerificationEmail(request.getEmail());
        return ResponseEntity.ok("인증 코드가 이메일로 발송되었습니다.");
    }
    
    // 이메일 인증 확인
    @PostMapping("/email/verify")
    public ResponseEntity<String> verifyEmail(@RequestBody AuthDto.EmailVerificationConfirmRequest request) {
        boolean isVerified = authService.verifyEmail(request.getEmail(), request.getVerificationCode());
        
        if (isVerified) {
            return ResponseEntity.ok("이메일 인증이 완료되었습니다.");
        } else {
            return ResponseEntity.badRequest().body("인증 코드가 올바르지 않거나 만료되었습니다.");
        }
    }
    
    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<AuthDto.SignupResponse> signup(@RequestBody AuthDto.SignupRequest request) {
        AuthDto.SignupResponse response = authService.signup(request);
        return ResponseEntity.ok(response);
    }
    
    // 로그인
    @PostMapping("/login")
    public ResponseEntity<AuthDto.LoginResponse> login(@RequestBody AuthDto.LoginRequest request) {
        AuthDto.LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    // 소셜 로그인
    @PostMapping("/social/login")
    public ResponseEntity<AuthDto.LoginResponse> socialLogin(@RequestBody AuthDto.SocialLoginRequest request) {
        User.AuthProvider authProvider = User.AuthProvider.valueOf(request.getAuthProvider());
        AuthDto.LoginResponse response = authService.processSocialLogin(
                request.getEmail(), 
                request.getName(), 
                request.getProviderId(), 
                authProvider
        );
        return ResponseEntity.ok(response);
    }
} 