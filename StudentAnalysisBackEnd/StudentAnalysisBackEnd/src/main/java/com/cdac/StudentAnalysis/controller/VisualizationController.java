package com.cdac.StudentAnalysis.controller;

import com.cdac.StudentAnalysis.service.VisualizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/visuals")
public class VisualizationController {

    private final VisualizationService visualizationService;

    public VisualizationController(VisualizationService visualizationService) {
        this.visualizationService = visualizationService;
    }

    // ✅ Student Performance Data for Visualization
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @GetMapping("/student/{studentId}")
    public ResponseEntity<Map<String, Object>> getStudentPerformance(@PathVariable Long studentId) {
        return ResponseEntity.ok(visualizationService.getStudentPerformanceData(studentId));
    }

    // ✅ Batch Performance Data for Visualization
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @GetMapping("/batch/{batchId}")
    public ResponseEntity<Map<String, Object>> getBatchPerformance(@PathVariable Long batchId) {
        return ResponseEntity.ok(visualizationService.getBatchPerformanceData(batchId));
    }
}

