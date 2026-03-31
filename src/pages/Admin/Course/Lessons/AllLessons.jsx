import { useNavigate } from "react-router-dom";
import ReusableTable from "@/components/ReusableTable";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";
import React, { useMemo, useState } from "react";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

const AllLessons = () => {
  const navigate = useNavigate();

  const { data, loading, error } = useGet("/api/admin/lessons");
  const { deleteData, loading: deleteLoading } = useDelete();
 const [selectedRow, setSelectedRow] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleDelete = (row) => {
    setSelectedRow(row);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteData(`/api/admin/lessons/${selectedRow.id}`);
      setOpenDeleteModal(false);
      setSelectedRow(null);
      refetch();
    } catch (e) {
      throw e;
    }
  };
const handleEdit = (row) => {
    navigate(`/admin/courses/lessons/edit/${row.id}`);
  };
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
        loading={loading||deleteLoading}
       onEdit={handleEdit}
        onDelete={handleDelete}
         rowsPerPage={5}
      />
       <ConfirmDeleteModal
              open={openDeleteModal}
              onClose={() => setOpenDeleteModal(false)}
              onConfirm={confirmDelete}
              title="Delete Lesson"
              description={`Are you sure you want to delete "${selectedRow?.lessonName}" ?`}
            />
            
    </div>
  );
};

export default AllLessons;