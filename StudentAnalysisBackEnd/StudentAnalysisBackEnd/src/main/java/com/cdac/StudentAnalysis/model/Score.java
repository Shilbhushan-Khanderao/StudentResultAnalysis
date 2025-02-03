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

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    private int theoryMarks;
    private int iaMarks;
    private int labMarks;
    private int totalMarks;

    public Score(Student student, Subject subject) {
    }

	public Student getStudent() {
		// TODO Auto-generated method stub
		return null;
	}
}
