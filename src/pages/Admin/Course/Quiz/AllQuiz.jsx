import { useNavigate } from "react-router-dom";
import ReusableTable from "@/components/ReusableTable";
import useGet from "@/hooks/useGet";
import React, { useMemo } from "react";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";

const AllQuiz = () => {
  const navigate = useNavigate();

  const { data, loading, error } = useGet("/api/admin/quiz");

  const columns = [
    {
      header: "Quiz",
      key: "title",
    },
    {
      header: "Lesson",
      key: "lesson",
      filterable: true,
      filterType: "select",
    },
    {
      header: "Chapter",
      key: "chapter",
      filterable: true,
      filterType: "select",
    },
    {
      header: "Course",
      key: "course",
      filterable: true,
      filterType: "select",
    },
    {
      header: "Category",
      key: "category",
      filterable: true,
      filterType: "select",
    },
    {
      header: "Duration",
      key: "duration",
    },
    {
      header: "Pass Score",
      key: "passScore",
    },
    {
      header: "Questions",
      key: "questions",
    },
    {
      header: "Status",
      key: "status",
    },
  ];

  const tableData = useMemo(() => {
    return (
      data?.data?.data?.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        lesson: quiz.lesson?.name || "—",
        chapter: quiz.chapter?.name || "—",
        course: quiz.course?.name || "—",
        category: quiz.category?.name || "—",
        duration: `${quiz.durationHours}h ${quiz.durationMinutes}m`,
        passScore: quiz.passScore,
        questions: quiz.questionsCount,
        status: quiz.isActive ? "Active" : "Inactive",
        raw: quiz,
      })) || []
    );
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <Errorpage />;

  return (
    <div>
      <ReusableTable
        title="All Quizzes"
        columns={columns}
        data={tableData}
        loading={loading}
      />
    </div>
  );
};

export default AllQuiz;