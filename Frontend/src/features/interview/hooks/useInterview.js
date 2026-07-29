import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    generateResumePdf,
} from "../services/interview.api";

import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewId } = useParams();

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports,
    } = context;

    // ================= Generate Interview Report =================
    const generateReport = async ({
        jobDescription,
        selfDescription,
        resumeFile,
    }) => {
        setLoading(true);

        try {
            const response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile,
            });

            if (response?.interviewReport) {
                setReport(response.interviewReport);
                return response.interviewReport;
            }

            return null;
        } catch (error) {
            if (error.response?.status === 401) {
                console.warn("Unauthorized. Please login again.");
            } else {
                console.error("Generate Report Error:", error);
            }

            return null;
        } finally {
            setLoading(false);
        }
    };

    // ================= Get Report By Id =================
    const getReportById = async (interviewId) => {
        setLoading(true);

        try {
            const response = await getInterviewReportById(interviewId);

            if (response?.interviewReport) {
                setReport(response.interviewReport);
                return response.interviewReport;
            }

            return null;
        } catch (error) {
            if (error.response?.status === 401) {
                console.warn("Unauthorized. Please login again.");
            } else {
                console.error("Get Report Error:", error);
            }

            return null;
        } finally {
            setLoading(false);
        }
    };

    // ================= Get All Reports =================
    const getReports = async () => {
        setLoading(true);

        try {
            const response = await getAllInterviewReports();

            if (response?.interviewReports) {
                setReports(response.interviewReports);
                return response.interviewReports;
            }

            setReports([]);
            return [];
        } catch (error) {
            if (error.response?.status === 401) {
                console.warn("Unauthorized. Please login again.");
            } else {
                console.error("Get Reports Error:", error);
            }

            setReports([]);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // ================= Download Resume =================
    const getResumePdf = async (interviewReportId) => {
        setLoading(true);

        try {
            const pdfBlob = await generateResumePdf({ interviewReportId });

            if (!pdfBlob) return;

            const url = window.URL.createObjectURL(
                new Blob([pdfBlob], {
                    type: "application/pdf",
                })
            );

            const link = document.createElement("a");
            link.href = url;
            link.download = `resume_${interviewReportId}.pdf`;

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            if (error.response?.status === 401) {
                console.warn("Unauthorized. Please login again.");
            } else {
                console.error("Resume Download Error:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        } else {
            getReports();
        }
    }, [interviewId]);

    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        getResumePdf,
    };
};