import { useNavigate } from "react-router-dom";
import ReusableTable from "@/components/ReusableTable";
import useGet from "@/hooks/useGet";
import React, { useMemo, useState } from "react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import useDelete from "@/hooks/useDelete";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";

const Sessions = () => {
  const navigate = useNavigate();

  const { data, loading, refetch, error } = useGet("/api/admin/session");
  const { deleteData, loading: deleteLoading } = useDelete();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleDelete = (row) => {
    setSelectedRow(row);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteData(`/api/admin/sessions/${selectedRow.id}`);
      setOpenDeleteModal(false);
      setSelectedRow(null);
      refetch();
    } catch (e) {
        throw e
    }
  };

  const handleEdit = (row) => {
    navigate(`/admin/live/sessions/edit/${row.id}`);
  };

  const columns = [
    { header: "Name", key: "name" },
    { header: "Category", key: "categoryName" },
    { header: "Course", key: "courseName" },
    { header: "Lesson", key: "lessonName" },
    { header: "Type", key: "type" },
    { header: "Group", key: "groupName" },
    { header: "Teacher", key: "teacherName" },
    { header: "Date", key: "sessionDate" },
    { header: "From", key: "timeFrom" },
    { header: "To", key: "timeTo" },
  ];

  const tableData = useMemo(() => {
    return (
      data?.data?.map((s) => ({
        id: s.id,
        name: s.name,
        categoryName: s.categoryName,
        courseName: s.courseName,
        lessonName: s.lessonName,
        type: s.type,
        groupName: s.groupName || "-",
        teacherName: s.teacherName,
        sessionDate: new Date(s.sessionDate).toLocaleDateString(),
        timeFrom: s.timeFrom,
        timeTo: s.timeTo,
        raw: s,
      })) || []
    );
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <Errorpage />;

  return (
    <div>
      <ReusableTable
        title="Sessions"
        titleAdd="Session"
        columns={columns}
        data={tableData}
        loading={loading || deleteLoading}
        onAddClick={() => navigate("/admin/live/sessions/add")}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Session"
        description={`Are you sure you want to delete "${selectedRow?.name}"?`}
      />
    </div>
  );
};

export default Sessions;