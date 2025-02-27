package com.cdac.StudentAnalysis.repository;

import com.cdac.StudentAnalysis.enums.RoleType;
import com.cdac.StudentAnalysis.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleType role2);
}
