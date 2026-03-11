import { useNavigate } from "react-router-dom";
import ReusableTable from "@/components/ReusableTable";
import useGet from "@/hooks/useGet";
import React, { useMemo } from "react";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";

const AllLessons = () => {
  const navigate = useNavigate();

  const { data, loading, error } = useGet("/api/admin/lessons");

  const columns = [
    {
      header: "Lesson",
      key: "lessonName",
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
      header: "Teacher",
      key: "teacher",
      filterable: true,
      filterType: "select",
    },
    {
      header: "Price",
      key: "price",
    },
    {
      header: "Discount",
      key: "discount",
    },
    {
      header: "Total Price",
      key: "totalPrice",
    },
    {
      header: "Ideas",
      key: "ideasCount",
    },
  ];

  const tableData = useMemo(() => {
    if (!data?.data?.chapters) return [];

    return data.data.chapters.flatMap((chapterItem) =>
      chapterItem.lessons.map((lesson) => ({
        id: lesson.id,
        lessonName: lesson.name,
        chapter: chapterItem.chapter?.name || "—",
        course: lesson.course?.name || "—",
        category: lesson.category?.name || "—",
        teacher: lesson.teacher?.name || "—",
        price: lesson.price,
        discount: lesson.discount,
        totalPrice: lesson.totalPrice,
        ideasCount: lesson.ideas?.length || 0,
        raw: lesson,
      }))
    );
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <Errorpage />;

  return (
    <div>
      <ReusableTable
        title="All Lessons"
        columns={columns}
        data={tableData}
        loading={loading}
      
      />
    </div>
  );
};

export default AllLessons;