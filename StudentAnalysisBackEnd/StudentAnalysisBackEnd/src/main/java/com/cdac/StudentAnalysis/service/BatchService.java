package com.cdac.StudentAnalysis.service;

import com.cdac.StudentAnalysis.model.Batch;
import com.cdac.StudentAnalysis.repository.BatchRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BatchService {

    private final BatchRepository batchRepository;

    public BatchService(BatchRepository batchRepository) {
        this.batchRepository = batchRepository;
    }

    // Get all batches
    public List<Batch> getAllBatches() {
        return batchRepository.findAll();
    }

    // Get a specific batch by ID
    public Batch getBatchById(Long id) {
        return batchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Batch not found with ID: " + id));
    }

    // Create a new batch
    public Batch createBatch(Batch batch) {
        Optional<Batch> existingBatch = batchRepository.findByBatchName(batch.getBatchName());
        if (existingBatch.isPresent()) {
            throw new RuntimeException("Batch name already exists.");
        }
        return batchRepository.save(batch);
    }

    // Update an existing batch
    public Batch updateBatch(Long id, Batch updatedBatch) {
        Batch existingBatch = batchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Batch not found with ID: " + id));

        existingBatch.setBatchName(updatedBatch.getBatchName());
        return batchRepository.save(existingBatch);
    }

    // Delete a batch
    public void deleteBatch(Long id) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Batch not found with ID: " + id));
        batchRepository.delete(batch);
    }
}
