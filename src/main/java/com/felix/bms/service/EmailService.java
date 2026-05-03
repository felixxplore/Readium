package com.felix.bms.service;

import com.felix.bms.entity.Comment;
import com.felix.bms.entity.User;
import com.felix.bms.enums.LikeType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendCommentNotification(User author, Comment comment) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(author.getEmail());
        msg.setSubject("New comment on your post");
        msg.setText("""
            Hi %s,
            
            %s commented on your post "%s":
            
            "%s"
            
            View: http://localhost:8080/api/posts/%d
            """.formatted(
                author.getName(),
                comment.getAuthor().getName(),
                comment.getPost().getTitle(),
                comment.getContent(),
                comment.getPost().getId()
        ));
        mailSender.send(msg);
    }

    public void sendCommentReplyNotification(String receiver, String sender, String content){

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(receiver);
        msg.setSubject("New reply to your comment");

        msg.setText("""
        Hi,

        %s replied to your comment:

        "%s"

        Keep the conversation going!

        Regards,
        Blog Team
        """.formatted(
                sender,
                content
        ));

        mailSender.send(msg);

    }


    public void sendLikedNotification(String receiverEmail, String senderName, LikeType likeType) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(receiverEmail);

        String subject;
        String body;

        if (likeType == LikeType.POST) {
            subject = "Someone liked your post!";
            body = """
            Hi,

            %s liked your post!

            Keep sharing great content!

            Regards,
            Blog Team
            """.formatted(senderName);
        } else if (likeType == LikeType.COMMENT) {
            subject = "Someone liked your comment!";
            body = """
            Hi,

            %s liked your comment!

            Keep engaging in conversations!

            Regards,
            Blog Team
            """.formatted(senderName);
        } else {
            // fallback if new like type in future
            subject = "You got a like!";
            body = """
            Hi,

            %s liked your content.

            Regards,
            Blog Team
            """.formatted(senderName);
        }

        msg.setSubject(subject);
        msg.setText(body);

        mailSender.send(msg);
    }

     public void sendVerificationEmail(String toEmail, String token) {

        String verificationLink = frontendUrl + "/verify?token=" + token+"&email="+toEmail;

        String subject = "Verify your email";

        String body = buildEmailBody(verificationLink);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);

            log.info("Verification email sent to {}", toEmail);

        } catch (Exception ex) {
            log.error("Failed to send email to {}", toEmail, ex);
            throw new RuntimeException("Failed to send verification email : "+ex.getMessage());
        }
    }

    private String buildEmailBody(String link) {
        return """
                Hello,

                Please verify your email by clicking the link below:

                %s

                This link will expire in 15 minutes.

                If you did not register, please ignore this email.

                Thanks,
                Your Team
                """.formatted(link);
    }
}
