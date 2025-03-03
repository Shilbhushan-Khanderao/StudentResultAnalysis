package com.cdac.StudentAnalysis.config;

import java.util.List;

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
	        List<String> roles = List.of("ADMIN", "TEACHER");

	        List<Role> missingRoles = roles.stream()
	            .filter(roleName -> roleRepository.findByName(roleName).isEmpty())
	            .map(Role::new)
	            .toList();

	        if (!missingRoles.isEmpty()) {
	            roleRepository.saveAll(missingRoles);
	        }
	    };
	}

}