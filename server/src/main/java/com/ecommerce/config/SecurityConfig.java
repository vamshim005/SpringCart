package com.ecommerce.config;

import com.ecommerce.service.JwtService;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Configuration
public class SecurityConfig {
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CustomOAuth2SuccessHandler customOAuth2SuccessHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .cors().and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
            .antMatchers("/", "/index.html").permitAll()
            .antMatchers("/api/auth/**").permitAll()
            .antMatchers("/oauth2/**").permitAll()
            .antMatchers("/img/**", "/css/**", "/js/**", "/static/**").permitAll()
            .antMatchers(org.springframework.http.HttpMethod.GET, "/api/products/**").permitAll()
            .antMatchers(org.springframework.http.HttpMethod.POST, "/api/products/**").hasAuthority("ADMIN")
            .antMatchers(org.springframework.http.HttpMethod.PUT, "/api/products/**").hasAuthority("ADMIN")
            .antMatchers(org.springframework.http.HttpMethod.DELETE, "/api/products/**").hasAuthority("ADMIN")
            .anyRequest().authenticated()
            .and()
            .oauth2Login()
            .successHandler(customOAuth2SuccessHandler)
            .and()
            .addFilterBefore(new JwtAuthFilter(jwtService, userRepository), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    public static class JwtAuthFilter extends OncePerRequestFilter {
        private final JwtService jwtService;
        private final UserRepository userRepository;
        public JwtAuthFilter(JwtService jwtService, UserRepository userRepository) {
            this.jwtService = jwtService;
            this.userRepository = userRepository;
        }
        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
            String authHeader = request.getHeader("Authorization");
            String token = null;
            String username = null;
            String role = null;
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                username = jwtService.extractUsername(token);
                role = jwtService.extractRole(token);
            }
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                Optional<com.ecommerce.model.User> userOpt = userRepository.findByUsername(username);
                if (userOpt.isPresent() && jwtService.validateToken(token, username)) {
                    UserDetails userDetails = org.springframework.security.core.userdetails.User
                        .withUsername(username)
                        .password(userOpt.get().getPassword())
                        .authorities(role != null ? role : "USER")
                        .build();
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
            filterChain.doFilter(request, response);
        }
    }
} 