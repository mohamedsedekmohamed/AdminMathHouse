import { useNavigate } from "react-router-dom";
import ReusableTable from "@/components/ReusableTable";
import useGet from "@/hooks/useGet";
import React, { useMemo } from "react";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";

const AllSemesters = () => {
  const navigate = useNavigate();

  const { data, loading, error } = useGet("/api/admin/semester");

  const columns = [
    {
      header: "Semester Name",
      key: "name",
    },
    {
      header: "Course",
      key: "course",
      filterable: true,
      filterType: "select",
    },
  ];

  const tableData = useMemo(() => {
    return (
      data?.data?.data?.map((sem) => ({
        id: sem.id,
        name: sem.name,
        course: sem.course?.name || "—",
        raw: sem,
      })) || []
    );
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <Errorpage />;

  return (
    <div>
      <ReusableTable
        title="All Semesters"
        columns={columns}
        data={tableData}
        loading={loading}
      />
    </div>
  );
};

export default AllSemesters;    