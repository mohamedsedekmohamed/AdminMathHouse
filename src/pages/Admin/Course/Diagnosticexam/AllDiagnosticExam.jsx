import { useNavigate } from "react-router-dom";
import ReusableTable from "@/components/ReusableTable";
import useGet from "@/hooks/useGet";
import React, { useMemo } from "react";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";

const AllDiagnosticExam = () => {
  const navigate = useNavigate();

  const { data, loading, error } = useGet("/api/admin/diagnosticExam");

  const columns = [
    {
      header: "Exam",
      key: "title",
    },
    {
      header: "Course",
      key: "course",
      filterable: true,
      filterType: "select",
    },
    {
      header: "Score Name",
      key: "scoreName",
      filterable: true,
      filterType: "select",
    },
    {
      header: "Questions",
      key: "questions",
    },
    {
      header: "Grade / Question",
      key: "gradePerQuestion",
      filterable: true,
      filterType: "select",
    },
    {
      header: "Duration",
      key: "duration",
    },
    {
      header: "Total Score",
      key: "totalScore",
    },
    {
      header: "Pass Score",
      key: "passScore",
    },
    {
      header: "Status",
      key: "status",
    },
  ];

  const tableData = useMemo(() => {
    return (
      data?.data?.data?.map((exam) => ({
        id: exam.id,
        title: exam.title,
        course: exam.course?.name || "—",
        scoreName: exam.rawScore?.name || "—",
        questions: exam.numberOfQuestions,
        gradePerQuestion: exam.gradePerQuestion,
        duration: `${exam.duration} min`,
        totalScore: exam.totalScore,
        passScore: exam.passScore,
        status: exam.isActive ? "Active" : "Inactive",
        raw: exam,
      })) || []
    );
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <Errorpage />;

  return (
    <div>
      <ReusableTable
        title="All Diagnostic Exams"
        columns={columns}
        data={tableData}
        loading={loading}
      />
    </div>
  );
};

export default AllDiagnosticExam;