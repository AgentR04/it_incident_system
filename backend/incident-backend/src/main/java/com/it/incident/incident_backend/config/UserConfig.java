package com.it.incident.incident_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

@Configuration
public class UserConfig {

    @Bean
    public UserDetailsService userDetailsService(
            @Value("${spring.security.user.name:admin}") String username,
            @Value("${spring.security.user.password:{noop}admin123}") String password
    ) {
        UserDetails user = User.withUsername(username)
                .password(password)
                .roles("USER")
                .build();
        return new InMemoryUserDetailsManager(user);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Supports {noop}, {bcrypt}, and others. Ideal for dev and gradual migrations.
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
