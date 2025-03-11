package com.cdac.StudentAnalysis.utils;

import org.springframework.stereotype.Component;

import com.cdac.StudentAnalysis.model.Subject;
import com.cdac.StudentAnalysis.repository.ScoreRepository;

@Component
public class MarksheetUtils {

    private final ScoreRepository scoreRepository;

    public MarksheetUtils(ScoreRepository scoreRepository) {
        this.scoreRepository = scoreRepository;
    }

    public int determineSubjectMax(Subject subject) {
        boolean hasTheoryMarks = scoreRepository.existsBySubjectAndTheoryMarksGreaterThan(subject, 0);

        if (subject.getType().equalsIgnoreCase("COMBINED")) {
            return 30;
        }
        return hasTheoryMarks ? 100 : 60; 
    }
}
