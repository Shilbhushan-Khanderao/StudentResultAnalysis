package com.cdac.StudentAnalysis.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.StudentAnalysis.service.AnalyticsService;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    // 1. API for Top Performers
    @GetMapping("/top-performers")
    public ResponseEntity<?> getTopPerformers(@RequestParam Long batchId, @RequestParam int limit) {
        return ResponseEntity.ok(analyticsService.getTopPerformers(batchId, limit));
    }

    // 2. API for Subject-Wise Averages
    @GetMapping("/subject-averages")
    public ResponseEntity<?> getSubjectWiseAverages() {
        return ResponseEntity.ok(analyticsService.getSubjectWiseAverages());
    }

    // 3. API for Batch-Wise Performance
    @GetMapping("/batch-performance")
    public ResponseEntity<?> getBatchWisePerformance() {
        return ResponseEntity.ok(analyticsService.getBatchWisePerformance());
    }

    // 4. API for Student Rank Progress
    @GetMapping("/rank-progress")
    public ResponseEntity<?> getRankProgress(@RequestParam Long studentId) {
        return ResponseEntity.ok(analyticsService.getRankProgress(studentId));
    }

    // 5. API for Subject-Wise Top Performers
    @GetMapping("/subject-top-performers")
    public ResponseEntity<?> getSubjectTopPerformers(@RequestParam Long subjectId, @RequestParam int limit) {
        return ResponseEntity.ok(analyticsService.getSubjectTopPerformers(subjectId, limit));
    }

    // 6. API for Pass/Fail Analysis
    @GetMapping("/pass-fail-analysis")
    public ResponseEntity<?> getPassFailAnalysis(@RequestParam Long subjectId, @RequestParam int passingMarks) {
        return ResponseEntity.ok(analyticsService.getPassFailAnalysis(subjectId, passingMarks));
    }

    // 7. API for Batch Performance Comparison
    @GetMapping("/batch-comparison")
    public ResponseEntity<?> compareBatchPerformance(@RequestParam Long batchId1, @RequestParam Long batchId2) {
        return ResponseEntity.ok(analyticsService.compareBatchPerformance(batchId1, batchId2));
    }

    // 8. API for Subject-Wise Batch Comparison
    @GetMapping("/batch-subject-comparison")
    public ResponseEntity<?> compareBatchSubjectPerformance(@RequestParam Long subjectId) {
        return ResponseEntity.ok(analyticsService.compareBatchSubjectPerformance(subjectId));
    }
}

