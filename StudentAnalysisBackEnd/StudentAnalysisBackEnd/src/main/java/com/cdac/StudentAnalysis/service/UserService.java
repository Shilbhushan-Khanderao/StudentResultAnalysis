package com.cdac.StudentAnalysis.service;

import com.cdac.StudentAnalysis.enums.RoleType;
import com.cdac.StudentAnalysis.model.Role;
import com.cdac.StudentAnalysis.model.User;
import com.cdac.StudentAnalysis.repository.RoleRepository;
import com.cdac.StudentAnalysis.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get a specific user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    // Create a new user (Ensuring roles are correctly assigned)
    @Transactional
    public User createUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists!");
        }

        // Ensure user has at least one role
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            throw new RuntimeException("User must have at least one role.");
        }

        // Fetch and validate roles from database to avoid TransientObjectException
        Set<Role> validatedRoles = new HashSet<>();
        for (Role role : user.getRoles()) {
            Role existingRole = roleRepository.findByName(role.getName())
                    .orElseThrow(() -> new RuntimeException("Role not found: " + role.getName()));
            validatedRoles.add(existingRole);
        }

        user.setRoles(validatedRoles); // Assign validated roles
        user.setPassword(passwordEncoder.encode(user.getPassword())); // Encode password

        return userRepository.save(user);
    }

    // Assign a role to a user
    @Transactional
    public User assignRole(Long userId, RoleType roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        user.getRoles().add(role); // Add new role
        return userRepository.save(user);
    }

    // Delete a user
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        userRepository.delete(user);
    }
}
