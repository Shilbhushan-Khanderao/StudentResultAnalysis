package com.cdac.StudentAnalysis.controller;

import com.cdac.StudentAnalysis.model.Ranking;
import com.cdac.StudentAnalysis.service.RankingService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rankings")
public class RankingController {

    private final RankingService rankingService;

    public RankingController(RankingService rankingService) {
        this.rankingService = rankingService;
    }

    // Get all rankings
    @GetMapping
    public ResponseEntity<List<Ranking>> getAllRankings() {
        return ResponseEntity.ok(rankingService.getAllRankings());
    }

    // Get ranking for a specific student
    @GetMapping("/{studentId}")
    public ResponseEntity<Ranking> getStudentRanking(@PathVariable Long studentId) {
        return ResponseEntity.ok(rankingService.getStudentRanking(studentId));
    }
    
    // Calculate and update ranks
    @GetMapping("/calculate")
    public ResponseEntity<String> calculateRanks() {
        rankingService.calculateRanks();
        return ResponseEntity.ok("Ranks calculated and updated successfully.");
    }
}
