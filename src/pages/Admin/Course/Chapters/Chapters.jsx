import { useNavigate, useParams } from "react-router-dom";
import ReusableTable from "@/components/ReusableTable";
import useGet from "@/hooks/useGet";
import React, { useMemo, useState } from "react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import useDelete from "@/hooks/useDelete";
import usePatch from "@/hooks/usePatch";
import NavChild from "@/components/NavChild";

const Chapters = () => {
const { patchData, loading: loadingPatch } = usePatch("/api/admin/chapters/swap-order");
  const navigate = useNavigate();
  const { courseId } = useParams();

  const { data, loading, refetch } = useGet(
    `/api/admin/chapters/course/${courseId}`
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
      await deleteData(`/api/admin/chapters/${selectedRow.id}`);
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
          alt="chapter"
          className="w-12 h-12 object-cover rounded-md border bg-gray-100"
        />
      ),
    },
    { header: "Name", key: "name" },
    { header: "Course", key: "courseName" },
    { header: "Category", key: "categoryName" },
    { header: "Teacher", key: "teacherName" },
    { header: "Duration", key: "duration" },
    { header: "Price", key: "price" },
    { header: "Discount", key: "discount" },
    { header: "Total Price", key: "totalPrice" },
  ];

const tableData = useMemo(() => {
  const list = data?.data?.chapters || [];

  return list.map((item, index) => ({
    id: item.chapter.id,
    name: item.chapter.name,
    image: item.chapter.image,
    duration: item.chapter.duration,
    price: item.chapter.price,
    discount: item.chapter.discount,
    totalPrice: item.chapter.totalPrice,
    order: item.chapter.order,
    courseName: item.course?.name || "—",
    categoryName: item.category?.name || "—",
    teacherName: item.teacher?.name || "—",
    prevId: list[index - 1]?.chapter.id || null, // الفصل اللي فوقه
    nextId: list[index + 1]?.chapter.id || null, // الفصل اللي تحته
    isFirst: index === 0,
    isLast: index === list.length - 1,
    raw: item,
  }));
}, [data]);


  const handleEdit = (row) => {
    navigate(`/admin/courses/chapters/edit/${row.id}`);
  };

  return (
    <div>
      <ReusableTable
        title="Chapters"
        titleAdd="Chapter"
        columns={columns}
        data={tableData}
        loading={loading || deleteLoading || loadingPatch}
        onAddClick={() =>
          navigate(`/admin/courses/chapters/add`, { state: { courseId } })
        }
              extraActions={(row) => (

        <>
     
          <div className="flex gap-2">
    {/* Move Up */}
    <button
    onClick={async () => {
      try {
          await patchData(
            { chapterIdA: row.id, chapterIdB: row.prevId },
            null,
            "Chapter moved up!"
          );
          refetch();
        } catch (err) {
          console.error(err);
        }
      }}
      disabled={loading || row.isFirst || !row.prevId}
      className="px-3 py-2 rounded-lg text-one disabled:opacity-50
      bg-one/10 backdrop-blur-md border border-one/30
      shadow-[0_0_10px_rgba(0,255,255,0.7)] hover:shadow-[0_0_20px_rgba(0,255,255,1)]
      animate-pulse transition-all duration-500"
      >
      ↑
      </button>
      
      {/* Move Down */}
      <button
      onClick={async () => {
        try {
          await patchData(
            { chapterIdA: row.id, chapterIdB: row.nextId },
            null,
            "Chapter moved down!"
          );
          refetch();
        } catch (err) {
          console.error(err);
        }
      }}
      disabled={loading || row.isLast || !row.nextId}
      className="px-3 py-2 rounded-lg text-one disabled:opacity-50
      bg-one/10 backdrop-blur-md border border-one/30
      shadow-[0_0_10px_rgba(255,0,255,0.7)] hover:shadow-[0_0_20px_rgba(255,0,255,1)]
      animate-pulse transition-all duration-500"
      >
      ↓
      </button>
      </div>
              <NavChild route={`/admin/courses/lessons/${row.id}`} />

        </>
    )}

        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Chapter"
        description={`Are you sure you want to delete "${selectedRow?.name}" ?`}
      />
    </div>
  );
};

export default Chapters;
