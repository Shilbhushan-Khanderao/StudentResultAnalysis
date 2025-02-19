package com.cdac.StudentAnalysis.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Score {
    
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    private int theoryMarks;
    private int iaMarks;
    private int labMarks;
    private int totalMarks;
    
    public Score(Student student, Subject subject) {
		this.student = student;
		this.subject = subject;
	}
    
    @PrePersist
    @PreUpdate
    private void calculateTotalMarks() {
        this.totalMarks = this.theoryMarks + this.iaMarks + this.labMarks;
    }

}
