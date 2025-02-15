package com.example.Jwt_Authentication.config;

import com.example.Jwt_Authentication.model.Role;
import com.example.Jwt_Authentication.service.LogoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;



@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final LogoutService logoutHandler;
    private final CustomCorsConfig corsConfig;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/v1/auth/**").permitAll() // Open authentication endpoints
                                .requestMatchers("/api/v1/income-controller","/api/v1/expense-controller",
                                        "/api/v1/summary-controller","/api/v1/category-controller/categories",
                                        "/api/v1/category-controller/income-categories" ,"/api/v1/category-controller/expense-categories"  ).hasAnyRole("USER","ADMIN")
                                .requestMatchers("/api/v1/category-controller/createCategory").hasAuthority("category:create")
                                .requestMatchers("/api/v1/category-controller/update-category/**").hasAuthority("category:update")
//                        .requestMatchers("/api/v1/category-controller/delete-category/**").hasAuthority("category:delete")

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Stateless session
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout -> logout
                        .logoutUrl("/api/v1/auth/logout")
                        .addLogoutHandler(logoutHandler)
                        .logoutSuccessHandler((request, response, authentication) -> SecurityContextHolder.clearContext())
                )
                .cors(c -> c.configurationSource(corsConfig));

        return http.build();
    }


}
