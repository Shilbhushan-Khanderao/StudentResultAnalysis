package com.cdac.StudentAnalysis.controller;

import com.cdac.StudentAnalysis.model.Ranking;
import com.cdac.StudentAnalysis.model.RankingHistory;
import com.cdac.StudentAnalysis.service.RankingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rankings")
public class RankingController {

    private final RankingService rankingService;

    public RankingController(RankingService rankingService) {
        this.rankingService = rankingService;
    }

    @GetMapping
    public ResponseEntity<List<Ranking>> getAllRankings() {
        return ResponseEntity.ok(rankingService.getAllRankings());
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<Ranking> getStudentRanking(@PathVariable Long studentId) {
        return ResponseEntity.ok(rankingService.getStudentRanking(studentId));
    }

    @GetMapping("/calculate")
    public ResponseEntity<String> calculateRanks() {
        rankingService.calculateRanks();
        return ResponseEntity.ok("Ranks calculated and updated successfully.");
    }

    @GetMapping("/history/{studentId}")
    public ResponseEntity<List<RankingHistory>> getRankingHistory(@PathVariable Long studentId) {
        return ResponseEntity.ok(rankingService.getRankingHistory(studentId));
    }
    
    @GetMapping("/leaderboard")
    public ResponseEntity<List<Ranking>> getLeaderboard(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(rankingService.getTopRankers(limit));
    }
    
    @GetMapping("/batch/{batchId}")
    public ResponseEntity<List<Ranking>> getBatchRankings(@PathVariable Long batchId) {
        return ResponseEntity.ok(rankingService.getBatchRankings(batchId));
    }

    @GetMapping("/compare/{studentId}")
    public ResponseEntity<List<RankingHistory>> compareStudentRanks(@PathVariable Long studentId) {
        return ResponseEntity.ok(rankingService.getRankComparison(studentId));
    }


}

