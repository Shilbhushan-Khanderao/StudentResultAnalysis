package com.cdac.StudentAnalysis.controller;

import com.cdac.StudentAnalysis.dto.ApiResponse;
import com.cdac.StudentAnalysis.model.Score;
import com.cdac.StudentAnalysis.service.ScoreService;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/marks")
public class ScoreController {

    private final ScoreService scoreService;

    public ScoreController(ScoreService scoreService) {
        this.scoreService = scoreService;
    }
    
    
    //Fetch all scores for all students and subjects.
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllScores() {
        List<Score> scores = scoreService.getAllScores();
        return ResponseEntity.ok(new ApiResponse("All scores retrieved successfully", scores));
    }
    
    //Fetch Marksheet data
    @GetMapping("/marksheet")
    public ResponseEntity<ApiResponse> getMarksheet(@RequestParam Long batchId) {
        List<Map<String, Object>> marksheet = scoreService.getFormattedMarksheet(batchId);
        return ResponseEntity.ok(new ApiResponse("Marksheet for batch retrieved successfully", marksheet));
    }
    
    //Fetch Marksheet data for subjects
    @GetMapping("/marksheet/subjects")
    public ResponseEntity<ApiResponse> getMarksheetForSubjects(@RequestParam Long batchId, @RequestParam List<Long> subjectIds) {
        List<Map<String, Object>> marksheet = scoreService.getMarksheetForSubjects(batchId, subjectIds);
        return ResponseEntity.ok(new ApiResponse("Marksheet for selected subjects retrieved successfully", marksheet));
    }

    
    //Fetch all scores for a specific student by roll number.
    @GetMapping("/student/{rollNumber}")
    public ResponseEntity<ApiResponse> getScoresByStudent(@PathVariable String rollNumber) {
        List<Score> scores = scoreService.getScoresByStudentRollNumber(rollNumber);
        return ResponseEntity.ok(new ApiResponse("Scores retrieved successfully", scores));
    }

    
    //Fetch all scores for a specific subject.
    @GetMapping("/subject/{subjectName}")
    public ResponseEntity<ApiResponse> getScoresBySubject(@PathVariable String subjectName) {
        List<Score> scores = scoreService.getScoresBySubjectName(subjectName);
        return ResponseEntity.ok(new ApiResponse("Scores retrieved successfully", scores));
    }

    @PostMapping("/upload/single")
    public ResponseEntity<ApiResponse> uploadSingleSubjectMarks(@RequestParam("file") MultipartFile file,
                                                                @RequestParam("subjectName") String subjectName) {
        scoreService.importSingleSubjectMarks(file, subjectName);
        return ResponseEntity.ok(new ApiResponse("Single subject marks uploaded successfully", subjectName));
    }

    @PostMapping("/upload/multiple")
    public ResponseEntity<ApiResponse> uploadMultiSubjectMarks(@RequestParam("file") MultipartFile file) {
        scoreService.importMultiSubjectMarks(file);
        return ResponseEntity.ok(new ApiResponse("Multiple subjects marks uploaded successfully", null));
    }
    
    @PostMapping("/upload/project-gac")
    public ResponseEntity<ApiResponse> uploadProjectAndGACGrades(@RequestParam("file") MultipartFile file) {
        scoreService.importProjectAndGACGrades(file);
        return ResponseEntity.ok(new ApiResponse("Project and GAC grades uploaded successfully", null));
    }

    @PutMapping("/update/single")
    public ResponseEntity<ApiResponse> updateSingleStudentMarks(@RequestParam String rollNumber,
                                                                @RequestParam String subjectName,
                                                                @RequestParam int theoryMarks,
                                                                @RequestParam int iaMarks,
                                                                @RequestParam int labMarks) {
        scoreService.updateSingleStudentMarks(rollNumber, subjectName, theoryMarks, iaMarks, labMarks);
        return ResponseEntity.ok(new ApiResponse("Marks updated successfully", rollNumber));
    }

    @PutMapping("/update/multiple")
    public ResponseEntity<ApiResponse> updateMarksFromCSV(@RequestParam("file") MultipartFile file) {
        scoreService.updateMarksFromCSV(file);
        return ResponseEntity.ok(new ApiResponse("Bulk marks updated successfully", null));
    }
    
    
    @DeleteMapping("/student/{studentId}/subject/{subjectId}")
    public ResponseEntity<ApiResponse> deleteScoreForStudent(@PathVariable Long studentId, @PathVariable Long subjectId) {
        scoreService.deleteScoreForStudent(studentId, subjectId);
        return ResponseEntity.ok(new ApiResponse("Score deleted successfully for the student", null));
    }

    @DeleteMapping("/student/{studentId}/all")
    public ResponseEntity<ApiResponse> deleteAllScoresForStudent(@PathVariable Long studentId) {
        scoreService.deleteAllScoresForStudent(studentId);
        return ResponseEntity.ok(new ApiResponse("All scores deleted for the student", null));
    }

    @DeleteMapping("/subject/{subjectId}/all")
    public ResponseEntity<ApiResponse> deleteScoreForAllStudents(@PathVariable Long subjectId) {
        scoreService.deleteScoreForAllStudents(subjectId);
        return ResponseEntity.ok(new ApiResponse("Scores deleted for all students in the subject", null));
    }

    @DeleteMapping("/all")
    public ResponseEntity<ApiResponse> deleteAllScores() {
        scoreService.deleteAllScores();
        return ResponseEntity.ok(new ApiResponse("All scores deleted successfully", null));
    }

}
