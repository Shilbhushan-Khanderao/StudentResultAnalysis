package com.cdac.StudentAnalysis.service;

import com.cdac.StudentAnalysis.model.Role;
import com.cdac.StudentAnalysis.model.User;
import com.cdac.StudentAnalysis.repository.RoleRepository;
import com.cdac.StudentAnalysis.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public CustomUserDetailsService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRoles().stream().map(Role::getName).toArray(String[]::new))
                .build();
    }

    public boolean userExists(String username) {
        return userRepository.existsByUsername(username);
    }

    public void saveUser(String username, String password, String roleName) {
    	Optional<Role> optionalRole = roleRepository.findByName(roleName);
    	
    	if (optionalRole.isEmpty()) {
            throw new RuntimeException("Role not found: " + roleName);
        }

        Role role = optionalRole.get();
        User user = User.builder()
                .username(username)
                .password(password)
                .roles(Collections.singleton(role))
                .build();
        userRepository.save(user);
    }
}
