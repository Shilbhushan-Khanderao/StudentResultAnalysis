package com.cdac.StudentAnalysis.model;

import com.cdac.StudentAnalysis.enums.RoleType;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private RoleType name;

    public Role(RoleType roleName) {
        this.name = roleName;
    }
}
