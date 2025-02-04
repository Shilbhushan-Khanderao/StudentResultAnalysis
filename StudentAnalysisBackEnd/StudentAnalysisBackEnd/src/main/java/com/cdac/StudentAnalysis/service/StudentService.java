package com.cdac.StudentAnalysis.service;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.io.BufferedReader;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
    
    //import student data from csv
    public void importStudentsFromCSV(MultipartFile file, String batchName) {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            // Check if batch exists, else create it
            Optional<Batch> existingBatch = batchRepository.findByBatchName(batchName);
            Batch batch;
            if (existingBatch.isPresent()) {
                batch = existingBatch.get();
            } else {
                batch = new Batch();
                batch.setBatchName(batchName);
                batch = batchRepository.save(batch);
            }

            String line;
            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",");

                if (data.length < 2) {
                    throw new RuntimeException("Invalid CSV format. Each row must contain at least Name and Roll Number.");
                }

                String rollNumber = data[0].trim();
                String name = data[1].trim();

                // Check if the student already exists by roll number
                if (studentRepository.findByRollNumber(rollNumber).isPresent()) {
                    System.out.println("Skipping duplicate student: " + rollNumber);
                    continue;
                }

                Student student = new Student();
                student.setName(name);
                student.setRollNumber(rollNumber);
                student.setBatch(batch);

                studentRepository.save(student);
            }

            System.out.println("CSV Upload Completed Successfully");
        } catch (Exception e) {
            throw new RuntimeException("Error processing CSV file: " + e.getMessage(), e);
        }
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