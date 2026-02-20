package com.example.rollbasedlogin.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String twilioPhoneNumber;

    @PostConstruct
    public void init() {
        if (!"YOUR_TWILIO_SID".equals(accountSid) && accountSid != null && !accountSid.isEmpty()) {
            Twilio.init(accountSid, authToken);
        }
    }

    public void sendSms(String to, String messageBody) {
        if ("YOUR_TWILIO_SID".equals(accountSid) || accountSid == null || accountSid.isEmpty()) {
            System.out.println("⚠️ Twilio lies unconfigured. SMS not sent to: " + to);
            return;
        }

        try {
            if (to != null && !to.isEmpty()) {
                Message message = Message.creator(
                        new PhoneNumber(to),
                        new PhoneNumber(twilioPhoneNumber),
                        messageBody
                ).create();
                System.out.println("✅ Sent SMS to " + to + " (SID " + message.getSid() + ")");
            }
        } catch (Exception e) {
            System.err.println("❌ Failed to send SMS to " + to + ": " + e.getMessage());
        }
    }
}
