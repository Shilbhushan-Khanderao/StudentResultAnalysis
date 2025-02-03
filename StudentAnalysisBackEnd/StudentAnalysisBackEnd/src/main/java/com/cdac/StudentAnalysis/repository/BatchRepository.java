package com.cdac.StudentAnalysis.repository;

import com.cdac.StudentAnalysis.model.Batch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BatchRepository extends JpaRepository<Batch, Long> {
    Optional<Batch> findByBatchName(String batchName);
}
