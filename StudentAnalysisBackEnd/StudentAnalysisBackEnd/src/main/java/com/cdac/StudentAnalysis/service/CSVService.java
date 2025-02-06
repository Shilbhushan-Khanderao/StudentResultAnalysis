package com.cdac.StudentAnalysis.service;

import com.cdac.StudentAnalysis.model.Batch;
import com.cdac.StudentAnalysis.model.Student;
import com.cdac.StudentAnalysis.repository.BatchRepository;
import com.cdac.StudentAnalysis.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@Service
public class CSVService {

    private final StudentRepository studentRepository;
    private final BatchRepository batchRepository;

    public CSVService(StudentRepository studentRepository, BatchRepository batchRepository) {
        this.studentRepository = studentRepository;
        this.batchRepository = batchRepository;
    }

    public void importStudentsFromCSV(MultipartFile file, String batchName) {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            // Check if batch exists, else create it
            Batch batch = batchRepository.findByBatchName(batchName)
                    .orElseGet(() -> batchRepository.save(Batch.builder().batchName(batchName).build()));

            String line = reader.readLine();
            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",");

                Student student = Student.builder()
                        .name(data[1])
                        .rollNumber(data[0])
                        .batch(batch)
                        .build();

                studentRepository.save(student);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

