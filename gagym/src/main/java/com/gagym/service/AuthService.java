package com.gagym.service;

import com.gagym.config.JwtTokenProvider;
import com.gagym.dto.AuthDto;
import com.gagym.entity.EmailVerification;
import com.gagym.entity.User;
import com.gagym.reposiotry.EmailVerificationRepository;
import com.gagym.reposiotry.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    
    private final UserRepository userRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    
    // 이메일 인증 코드 생성
    public void sendVerificationEmail(String email) {
        // 기존 인증 코드 삭제
        emailVerificationRepository.deleteByExpiresAtBefore(LocalDateTime.now());
        
        // 새로운 인증 코드 생성
        String verificationCode = generateVerificationCode();
        
        EmailVerification verification = EmailVerification.builder()
                .email(email)
                .verificationCode(verificationCode)
                .isVerified(false)
                .build();
        
        emailVerificationRepository.save(verification);
        emailService.sendVerificationEmail(email, verificationCode);
    }
    
    // 이메일 인증 확인
    public boolean verifyEmail(String email, String verificationCode) {
        EmailVerification verification = emailVerificationRepository
                .findByEmailAndVerificationCode(email, verificationCode)
                .orElse(null);
        
        if (verification != null && !verification.getIsVerified() && 
            verification.getExpiresAt().isAfter(LocalDateTime.now())) {
            
            verification.setIsVerified(true);
            verification.setVerifiedAt(LocalDateTime.now());
            emailVerificationRepository.save(verification);
            
            // 사용자 이메일 인증 상태 업데이트
            userRepository.findByEmail(email).ifPresent(user -> {
                user.setIsEmailVerified(true);
                userRepository.save(user);
            });
            
            return true;
        }
        
        return false;
    }
    
    // 회원가입
    public AuthDto.SignupResponse signup(AuthDto.SignupRequest request) {
        // 이메일 중복 확인
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 가입된 이메일입니다.");
        }
        
        // 사용자명 중복 확인
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("이미 사용 중인 사용자명입니다.");
        }
        
        // 이메일 인증 확인
        if (!isEmailVerified(request.getEmail())) {
            throw new RuntimeException("이메일 인증이 필요합니다.");
        }
        
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .nickname(request.getNickname())
                .role(User.Role.USER)
                .authProvider(User.AuthProvider.LOCAL)
                .isEmailVerified(true)
                .build();
        
        User savedUser = userRepository.save(user);
        
        // 환영 이메일 발송
        emailService.sendWelcomeEmail(request.getEmail(), request.getNickname());
        
        return AuthDto.SignupResponse.builder()
                .userId(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .nickname(savedUser.getNickname())
                .build();
    }
    
    // 로그인
    public AuthDto.LoginResponse login(AuthDto.LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        String token = jwtTokenProvider.generateToken(authentication);
        
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        return AuthDto.LoginResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .authProvider(user.getAuthProvider().name())
                .build();
    }
    
    // 소셜 로그인 사용자 생성/업데이트
    public AuthDto.LoginResponse processSocialLogin(String email, String name, String providerId, User.AuthProvider authProvider) {
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    // 새 사용자 생성
                    User newUser = User.builder()
                            .username(email) // 임시로 이메일을 사용자명으로 사용
                            .password(passwordEncoder.encode("SOCIAL_LOGIN_" + System.currentTimeMillis()))
                            .email(email)
                            .nickname(name)
                            .role(User.Role.USER)
                            .authProvider(authProvider)
                            .providerId(providerId)
                            .isEmailVerified(true)
                            .build();
                    return userRepository.save(newUser);
                });
        
        String token = jwtTokenProvider.generateToken(user.getUsername());
        
        return AuthDto.LoginResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .authProvider(user.getAuthProvider().name())
                .build();
    }
    
    // 이메일 인증 상태 확인
    private boolean isEmailVerified(String email) {
        return emailVerificationRepository.findByEmailOrderByCreatedAtDesc(email)
                .map(EmailVerification::getIsVerified)
                .orElse(false);
    }
    
    // 인증 코드 생성
    private String generateVerificationCode() {
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            code.append(random.nextInt(10));
        }
        return code.toString();
    }
} 