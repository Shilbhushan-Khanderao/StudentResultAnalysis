package com.cdac.StudentAnalysis.controller;

import com.cdac.StudentAnalysis.model.Student;
import com.cdac.StudentAnalysis.service.CSVService;
import com.cdac.StudentAnalysis.service.StudentService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final CSVService csvService;
    
    
    private final StudentService studentService;

    public StudentController(CSVService csvService, StudentService studentService) {
        this.csvService = csvService;
		this.studentService = studentService;
    }
    

    @PostMapping("/upload")
    public ResponseEntity<String> uploadStudentData(@RequestParam("file") MultipartFile file,
                                                    @RequestParam("batchName") String batchName) {
        csvService.importStudentsFromCSV(file, batchName);
        return ResponseEntity.ok("Student data uploaded successfully for batch: " + batchName);
    }
    
 // Get all students
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    // Get a specific student by ID
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    // Create a new student
    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        return ResponseEntity.ok(studentService.createStudent(student));
    }

    // Update an existing student
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student student) {
        return ResponseEntity.ok(studentService.updateStudent(id, student));
    }
    
    // Delete a student
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}

