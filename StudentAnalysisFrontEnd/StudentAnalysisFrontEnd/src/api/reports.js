import axios from './axios';
import { saveAs } from 'file-saver';

// Download student report (Excel)
export const downloadStudentReport = async (studentId) => {
    const response = await axios.get(`/reports/student`, {
        params: { studentId },
        responseType: 'blob', // Important for file downloads
    });

    const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `student_report_${studentId}.xlsx`);
};

// Download student report (PDF)
export const downloadStudentPDF = async (studentId) => {
    const response = await axios.get(`/reports/student/pdf`, {
        params: { studentId },
        responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    saveAs(blob, `student_report_${studentId}.pdf`);
};

// Download batch report (PDF)
export const downloadBatchPDF = async (batchId) => {
    const response = await axios.get(`/reports/batch/pdf`, {
        params: { batchId },
        responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    saveAs(blob, `batch_report_${batchId}.pdf`);
};
