import { useNavigate, useParams } from "react-router-dom";
import ReusableTable from "@/components/ReusableTable";
import useGet from "@/hooks/useGet";
import React, { useMemo, useState } from "react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import useDelete from "@/hooks/useDelete";
import usePatch from "@/hooks/usePatch";
// import NavChild from "@/components/NavChild";
import LessonIdeasModal from "@/components/LessonIdeasModal";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";
const Lessons = () => {
  const navigate = useNavigate();
  const { chapterId } = useParams();

  const { patchData, loading: loadingPatch } = usePatch(
    "/api/admin/lessons/swap-order",
  );

  const { data, loading, refetch , error } = useGet(
    `/api/admin/lessons/chapter/${chapterId}`,
  );

  const { deleteData, loading: deleteLoading } = useDelete();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openIdeasModal, setOpenIdeasModal] = useState(false);

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
          alt="lesson"
          className="w-12 h-12 object-cover rounded-md border bg-gray-100"
        />
      ),
    },
    { header: "Name", key: "name" },
    { header: "Chapter", key: "chapterName" },
    { header: "Course", key: "courseName" },
    { header: "Category", key: "categoryName" },
    { header: "Teacher", key: "teacherName" },
    // { header: "Price", key: "price" },
    // { header: "Discount", key: "discount" },
    { header: "Total Price", key: "totalPrice" },
    {
      header: "Idaes",
      key: "Idaes",
      render: (value, row) => (
        <button
          onClick={() => {
            setSelectedRow(row);
            setOpenIdeasModal(true);
          }}
          className="
    px-1 py-1 rounded-xl text-one font-semibold
    bg-white/10 backdrop-blur-md border border-one
    shadow-lg shadow-indigo-500/50
    hover:bg-white/20 hover:shadow-indigo-400/70
    transition-all duration-300
    relative overflow-hidden
    before:absolute before:inset-0 before:rounded-xl
   before:opacity-30 before:blur-xl before:animate-pulse
    z-10
  "
        >
          Ideas
        </button>
      ),
    },
    {
  header: "Order",
  key: "order",
  render: (value, row) => (
    <div className="flex items-center gap-2">
    
      <div className="flex gap-1">
        {/* Move Up */}
        <button
          onClick={async () => {
            try {
              await patchData(
                { lessonIdA: row.id, lessonIdB: row.prevId },
                null,
                "Lesson moved up!",
              );
              refetch();
            } catch (err) {
              console.error(err);
            }
          }}
          disabled={loading || row.isFirst || !row.prevId}
          className="px-1 py-1 rounded-lg text-one disabled:opacity-50
          bg-one/10 backdrop-blur-md border border-one/30
          shadow-[0_0_10px_rgba(0,255,255,0.7)] hover:shadow-[0_0_20px_rgba(0,255,255,1)]
          transition-all duration-300"
        >
          ↑
        </button>

        {/* Move Down */}
        <button
          onClick={async () => {
            try {
              await patchData(
                { lessonIdA: row.id, lessonIdB: row.nextId },
                null,
                "Lesson moved down!",
              );
              refetch();
            } catch (err) {
              console.error(err);
            }
          }}
          disabled={loading || row.isLast || !row.nextId}
          className="px-1 py-1 rounded-lg text-one disabled:opacity-50
          bg-one/10 backdrop-blur-md border border-one/30
          shadow-[0_0_10px_rgba(255,0,255,0.7)] hover:shadow-[0_0_20px_rgba(255,0,255,1)]
          transition-all duration-300"
        >
          ↓
        </button>
      </div>
    </div>
  ),
},
  ];

  const tableData = useMemo(() => {
    const list = data?.data?.lessons || [];

    return list.map((item, index) => ({
      id: item.lesson.id,
      name: item.lesson.name,
      image: item.lesson.image,
      price: item.lesson.price,
      discount: item.lesson.discount,
      totalPrice: item.lesson.totalPrice,
      order: item.lesson.order,

      chapterName: item.chapter?.name || "—",
      courseName: item.course?.name || "—",
      categoryName: item.category?.name || "—",
      teacherName: item.teacher?.name || "—",

      prevId: list[index - 1]?.lesson.id || null,
      nextId: list[index + 1]?.lesson.id || null,
      isFirst: index === 0,
      isLast: index === list.length - 1,

      raw: item,
    }));
  }, [data]);

  const handleEdit = (row) => {
    navigate(`/admin/courses/lessons/edit/${row.id}`);
  };

  if (loading ) {
    return <Loader />;
  }

  if (error) {
    return <Error  />;
  }

  return (
    <div>
      <ReusableTable
        title="Lessons"
        titleAdd="Lesson"
        columns={columns}
        data={tableData}
        loading={loading || deleteLoading || loadingPatch}
        onAddClick={() =>
          navigate(`/admin/courses/lessons/add`, { state: { chapterId } })
        }
        extraActions={(row) => (
          <>
       

          </>
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Lesson"
        description={`Are you sure you want to delete "${selectedRow?.name}" ?`}
      />
      <LessonIdeasModal
        open={openIdeasModal}
        lessonId={selectedRow?.id}
        onClose={() => setOpenIdeasModal(false)}
      />
    </div>
  );
};

export default Lessons;
