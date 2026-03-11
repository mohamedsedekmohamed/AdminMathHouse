import { useNavigate } from "react-router-dom";
import ReusableTable from "@/components/ReusableTable";
import useGet from "@/hooks/useGet";
import React, { useMemo } from "react";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";

const AllCourses = () => {
  const navigate = useNavigate();

  const { data, loading, error } = useGet("/api/admin/courses");

  const columns = [
    {
      header: "Course Name",
      key: "name",
    },
    {
      header: "Category",
      key: "category",
      filterable: true,
      filterType: "select",
    },
    {
      header: "Number Of Chapters",
      key: "numberOfChapters",
    },
  ];

  const tableData = useMemo(() => {
    return (
      data?.data?.courses?.map((course) => ({
        id: course.id,
        name: course.name,
        category: course.category,
        numberOfChapters: course.numberOfChapters,
      })) || []
    );
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <Errorpage />;

  return (
    <div>
      <ReusableTable
        title="All Courses"
        columns={columns}
        data={tableData}
        loading={loading}
      />
    </div>
  );
};

export default AllCourses;