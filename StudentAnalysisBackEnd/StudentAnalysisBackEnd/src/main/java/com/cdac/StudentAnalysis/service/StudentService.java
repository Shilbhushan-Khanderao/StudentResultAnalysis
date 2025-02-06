package com.cdac.StudentAnalysis.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.cdac.StudentAnalysis.model.Batch;
import com.cdac.StudentAnalysis.model.Student;
import com.cdac.StudentAnalysis.repository.BatchRepository;
import com.cdac.StudentAnalysis.repository.StudentRepository;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final BatchRepository batchRepository;

    public StudentService(StudentRepository studentRepository, BatchRepository batchRepository) {
        this.studentRepository = studentRepository;
        this.batchRepository = batchRepository;
    }
    
    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get a specific student by ID
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));
    }

    // Create a new student
    public Student createStudent(Student student) {
        Optional<Batch> batch = batchRepository.findById(student.getBatch().getId());
        if (batch.isEmpty()) {
            throw new RuntimeException("Batch not found with ID: " + student.getBatch().getId());
        }
        student.setBatch(batch.get());
        return studentRepository.save(student);
    }

    // Update an existing student
    public Student updateStudent(Long id, Student updatedStudent) {
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));

        Optional<Batch> batch = batchRepository.findById(updatedStudent.getBatch().getId());
        if (batch.isEmpty()) {
            throw new RuntimeException("Batch not found with ID: " + updatedStudent.getBatch().getId());
        }

        existingStudent.setName(updatedStudent.getName());
        existingStudent.setRollNumber(updatedStudent.getRollNumber());
        existingStudent.setBatch(batch.get());

        return studentRepository.save(existingStudent);
    }

    // Delete a student
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));
        studentRepository.delete(student);
    }
}