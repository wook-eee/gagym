package com.gagym.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    public void sendVerificationEmail(String to, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("[다짐] 이메일 인증 코드");
        message.setText(
            "안녕하세요! 다짐 회원가입을 위한 이메일 인증 코드입니다.\n\n" +
            "인증 코드: " + verificationCode + "\n\n" +
            "이 코드는 10분간 유효합니다.\n" +
            "본인이 요청하지 않은 경우 이 메일을 무시하세요.\n\n" +
            "감사합니다.\n" +
            "다짐 팀"
        );
        
        mailSender.send(message);
    }
    
    public void sendWelcomeEmail(String to, String nickname) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("[다짐] 회원가입을 축하합니다!");
        message.setText(
            "안녕하세요, " + nickname + "님!\n\n" +
            "다짐 회원가입을 축하합니다! 🎉\n\n" +
            "이제 다짐에서 다양한 헬스장을 찾고, 일일권을 구매하여 이용할 수 있습니다.\n\n" +
            "건강한 운동 생활을 응원합니다!\n\n" +
            "감사합니다.\n" +
            "다짐 팀"
        );
        
        mailSender.send(message);
    }
} 