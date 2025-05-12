package com.ecommerce.config;

import com.ecommerce.service.JwtService;
import com.ecommerce.service.UserService;
import com.ecommerce.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserService userService;

    @Autowired
    public CustomOAuth2SuccessHandler(JwtService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        System.out.println("onAuthenticationSuccess called!");
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String username = email;
        // Try to find user by username (email)
        Optional<User> userOpt = userService.findByUsername(username);
        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
        } else {
            // Create new user with random password (not used for OAuth)
            user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(UUID.randomUUID().toString());
            user.setRole("USER");
            userService.save(user);
        }
        System.out.println("OAuth2 login success for: " + email);
        String jwt = jwtService.generateToken(user.getUsername(), user.getRole());
        response.sendRedirect("http://localhost:3000/products?jwt=" + jwt);
    }
}
