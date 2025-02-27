package com.cdac.StudentAnalysis.config;

import com.cdac.StudentAnalysis.model.Role;
import com.cdac.StudentAnalysis.repository.RoleRepository;

import jakarta.transaction.Transactional;

import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RoleInitializer {

    private static final Logger logger = LoggerFactory.getLogger(RoleInitializer.class);

    @Bean
    @Transactional
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            List<String> roles = Arrays.asList("ADMIN", "TEACHER");
            for (String roleName : roles) {
                roleRepository.findByName(roleName).orElseGet(() -> {
                    logger.info("Creating role: {}", roleName);
                    return roleRepository.save(new Role(roleName));
                });
            }
        };
    }
}