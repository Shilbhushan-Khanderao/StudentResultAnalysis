package com.cdac.StudentAnalysis.controller;

import com.cdac.StudentAnalysis.service.TrendAnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trends")
public class TrendAnalysisController {

    private final TrendAnalysisService trendAnalysisService;

    public TrendAnalysisController(TrendAnalysisService trendAnalysisService) {
        this.trendAnalysisService = trendAnalysisService;
    }

    // 1. API for Student's Performance Trend
    @GetMapping("/student-trend")
    public ResponseEntity<?> getStudentTrend(@RequestParam Long studentId) {
        return ResponseEntity.ok(trendAnalysisService.getStudentTrend(studentId));
    }

    // 2. API for Subject-Wise Trend
    @GetMapping("/subject-trend")
    public ResponseEntity<?> getSubjectTrend(@RequestParam Long subjectId) {
        return ResponseEntity.ok(trendAnalysisService.getSubjectTrend(subjectId));
    }
}

