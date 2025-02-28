package com.cdac.StudentAnalysis.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cdac.StudentAnalysis.model.Role;
import com.cdac.StudentAnalysis.repository.RoleRepository;

@Configuration
public class RoleInitializer {

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByName("ADMIN").isEmpty()) {
                roleRepository.save(new Role("ADMIN"));
            }
            if (roleRepository.findByName("TEACHER").isEmpty()) {
                roleRepository.save(new Role("TEACHER"));
            }
        };
    }
}