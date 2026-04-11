package com.felix.bms;

import com.felix.bms.repository.BlogPostRepository;
import com.felix.bms.repository.CommentRepository;
import com.felix.bms.repository.UserRepository;
import com.felix.bms.service.AuthService;
import com.felix.bms.service.BlogPostService;
import com.felix.bms.service.EmailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("test")
class BmsApplicationTests {

	@Test
	void contextLoads() {

	}

}
