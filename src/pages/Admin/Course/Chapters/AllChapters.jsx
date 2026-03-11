import { useNavigate } from "react-router-dom";
import ReusableTable from "@/components/ReusableTable";
import useGet from "@/hooks/useGet";
import React, { useMemo } from "react";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";

const AllChapters = () => {
  const navigate = useNavigate();

  const { data, loading, error } = useGet("/api/admin/chapters");

  const columns = [
    {
      header: "Chapter",
      key: "chapterName",
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
      header: "Semester",
      key: "semester",
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
      header: "Duration",
      key: "duration",
    },
  ];

  const tableData = useMemo(() => {
    return (
      data?.data?.chapters?.map((item) => ({
        id: item.chapter.id,
        chapterName: item.chapter.name,
        course: item.course?.name || "—",
        category: item.category?.name || "—",
        teacher: item.teacher?.name || "—",
        semester: item.semester?.name || "—",
        price: item.chapter.price,
        discount: item.chapter.discount,
        totalPrice: item.chapter.totalPrice,
        duration: item.chapter.duration,
        raw: item,
      })) || []
    );
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <Errorpage />;

  return (
    <div>
      <ReusableTable
        title="All Chapters"
        columns={columns}
        data={tableData}
        loading={loading}
       
      />
    </div>
  );
};

export default AllChapters;