import { useNavigate } from "react-router-dom";
import ReusableTable from "@/components/ReusableTable";
import useGet from "@/hooks/useGet";
import React, { useMemo } from "react";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";

const AllExams = () => {
  const navigate = useNavigate();

  const { data, loading, error } = useGet("/api/admin/exams");

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
      header: "Code",
      key: "codeName",
      filterable: true,
      filterType: "select",
    },
    {
      header: "Score Name",
      key: "rawScoreName",
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
      header: "Year",
      key: "year",
    },
    {
      header: "Month",
      key: "month",
    },
    {
      header: "Type",
      key: "examType",
    },
    {
      header: "Status",
      key: "status",
    },
  ];

  const tableData = useMemo(() => {
    const staticExams = data?.data?.data?.static || [];
    const adaptiveExams = data?.data?.data?.adaptive || [];

    const allExams = [...staticExams, ...adaptiveExams];

    return allExams.map((exam) => ({
      id: exam.id,
      title: exam.title,
      course: exam.courseName || "—",
      codeName: exam.codeName || "—",
      rawScoreName: exam.rawScoreName || "—",
      duration: `${exam.duration} min`,
      totalScore: exam.totalScore,
      passScore: exam.passScore,
      year: exam.year,
      month: exam.Month,
      examType: exam.examType,
      status: exam.isActive ? "Active" : "Inactive",
      raw: exam,
    }));
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <Errorpage />;

  return (
    <div>
      <ReusableTable
        title="All Exams"
        columns={columns}
        data={tableData}
        loading={loading}
      />
    </div>
  );
};

export default AllExams;