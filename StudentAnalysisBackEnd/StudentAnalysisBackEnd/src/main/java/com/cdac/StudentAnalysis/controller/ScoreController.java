package com.cdac.StudentAnalysis.controller;

import com.cdac.StudentAnalysis.service.ScoreService;
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

    // API for single subject upload
    @PostMapping("/upload/single")
    public ResponseEntity<String> uploadSingleSubjectMarks(@RequestParam("file") MultipartFile file,
                                                           @RequestParam("subjectName") String subjectName) {
        scoreService.importSingleSubjectMarks(file, subjectName);
        return ResponseEntity.ok("Single subject marks uploaded successfully for: " + subjectName);
    }

    // API for multiple subjects upload
    @PostMapping("/upload/multiple")
    public ResponseEntity<String> uploadMultiSubjectMarks(@RequestParam("file") MultipartFile file) {
        scoreService.importMultiSubjectMarks(file);
        return ResponseEntity.ok("Multiple subjects marks uploaded successfully.");
    }

    // API for updating a single student's marks
    @PutMapping("/update/single")
    public ResponseEntity<String> updateSingleStudentMarks(@RequestParam String rollNumber,
                                                           @RequestParam String subjectName,
                                                           @RequestParam int theoryMarks,
                                                           @RequestParam int iaMarks,
                                                           @RequestParam int labMarks) {
        scoreService.updateSingleStudentMarks(rollNumber, subjectName, theoryMarks, iaMarks, labMarks);
        return ResponseEntity.ok("Marks updated successfully for student: " + rollNumber);
    }

    @PutMapping("/update/multiple")
    public ResponseEntity<String> updateMarksFromCSV(@RequestParam("file") MultipartFile file) {
        scoreService.updateMarksFromCSV(file);
        return ResponseEntity.ok("Bulk marks updated successfully.");
    }
}

