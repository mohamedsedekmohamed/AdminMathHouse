import { useNavigate, useParams } from "react-router-dom";
import ReusableTable from "@/components/ReusableTable";
import useGet from "@/hooks/useGet";
import React, { useMemo, useState } from "react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import useDelete from "@/hooks/useDelete";
import NavChild from "@/components/NavChild";

const Courses = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const { data, loading, refetch } = useGet(
    `/api/admin/courses/category/${categoryId}`
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
      await deleteData(`/api/admin/courses/${selectedRow.id}`); // عدّل لو عندك endpoint مختلف للحذف
      setOpenDeleteModal(false);
      setSelectedRow(null);
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  const columns = [
    {
      header: "Image",
      key: "image",
      render: (value) => (
        <img
          src={value || "/placeholder.png"}
          alt="course"
          className="w-12 h-12 object-cover rounded-md border bg-gray-100"
        />
      ),
    },
    { header: "Name", key: "name" },
    { header: "Description", key: "description" },
    { header: "Price", key: "price" },
    { header: "Discount", key: "discount" },
    { header: "Total Price", key: "totalPrice" },
    { header: "Duration", key: "duration" },
    { header: "Semester", key: "semesterName" },
  ];

  const tableData = useMemo(() => {
    return (
      data?.data?.data?.map((course) => ({
        id: course.id,
        name: course.name,
        description: course.description,
        price: course.price,
        discount: course.discount,
        totalPrice: course.totalPrice,
        duration: course.duration,
        semesterName: course.semester?.name || "—",
        image: course.image,
        raw: course,
      })) || []
    );
  }, [data]);

  const handleEdit = (row) => {
    navigate(`/admin/courses/courses/edit/${row.id}`);
  };

  return (
    <div>
      <ReusableTable
        title="Courses"
        titleAdd="Course"
        columns={columns}
        data={tableData}
        loading={loading || deleteLoading}
        onAddClick={() => navigate(`/admin/courses/courses/add`, { state: { categoryId } })}
        onEdit={handleEdit}
        onDelete={handleDelete}
        extraActions={(row) => (
          <NavChild route={`/admin/courses/chapters/${row.id}`} />
        )}
      />

      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Course"
        description={`Are you sure you want to delete "${selectedRow?.name}" ?`}
      />
    </div>
  );
};

export default Courses;
