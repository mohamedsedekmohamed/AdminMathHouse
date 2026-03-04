import React, { useMemo, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import ReusableTable from "@/components/ReusableTable";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

const Parallel = () => {
  const navigate = useNavigate();
  const location = useLocation();
const { id } = useParams();
  const { lessonId } = location.state || {};

  const {
    data,
    loading,
    error,
    refetch,
  } = useGet(
      `/api/admin/questions/parallel/original/${id}`
  );

  const { deleteData, loading: deleteLoading } = useDelete();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleDelete = (row) => {
    setSelectedRow(row);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteData(`/api/admin/questions/${selectedRow.id}`);
      setOpenDeleteModal(false);
      setSelectedRow(null);
      refetch();
    } catch (e) {
        throw e
    }
  };

  const handleEdit = (row) => {
    navigate(`/admin/courses/questions/parallel/edit/${row.id}`, {
      state: { lessonId },
    });
  };

  const columns = [
    { header: "Question", key: "question" },
    { header: "Original Question", key: "originalQuestion" },
    { header: "Lesson", key: "lessonName" },
    { header: "Answer Type", key: "answerType" },
    { header: "Difficulty", key: "difficulty" },
    { header: "Created At", key: "createdAt" },
  ];

  const tableData = useMemo(() => {
    return (data?.data?.data || []).map((item) => ({
      id: item.id,
      question: item.question,
      originalQuestion:
        item.originalQuestion?.question || "-",
      lessonName: item.lesson?.name || "-",
      answerType: item.answerType,
      difficulty: item.difficulty,
      createdAt: new Date(item.createdAt).toLocaleDateString(),
      raw: item,
    }));
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <Errorpage />;

  return (
    <div>
      <ReusableTable
        title="Parallel Questions"
        titleAdd="Parallel Question"
        columns={columns}
        data={tableData}
        loading={loading || deleteLoading}
        onAddClick={() =>
          navigate("/admin/courses/questions/parallel/add", {
            state: { lessonId , originalQuestionId: id },
          })
        }
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Parallel Question"
        description={`Are you sure you want to delete "${selectedRow?.question}"?`}
      />
    </div>
  );
};

export default Parallel;