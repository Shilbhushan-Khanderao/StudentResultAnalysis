package com.cdac.StudentAnalysis.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RankingHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private int oldRank = 0;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private int newRank = 0;
    
    @Column(nullable = false)
    private double previousPercentage;

    @Column(nullable = false)
    private LocalDateTime timestamp;
}

