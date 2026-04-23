import { useNavigate } from "react-router-dom";
import ReusableTable from "@/components/ReusableTable";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";
import React, { useMemo ,useState} from "react";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

const AllChapters = () => {
  const navigate = useNavigate();

  const { data, loading, error } = useGet("/api/admin/chapters");
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
      throw e;
    }
  };
  const handleEdit = (row) => {
    navigate(`/admin/courses/chapters/edit/${row.id}`);
  };

  const columns = [
    {
      header: "Chapter",
      key: "chapterName",
    },
     {
      header: "Category",
      key: "category",
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
      header: "Semester",
      key: "semester",
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
        loading={loading || deleteLoading}
         onEdit={handleEdit}
        onDelete={handleDelete}
        rowsPerPage={5}
      />
       <ConfirmDeleteModal
              open={openDeleteModal}
              onClose={() => setOpenDeleteModal(false)}
              onConfirm={confirmDelete}
              title="Delete Chapter"
              description={`Are you sure you want to delete "${selectedRow?.chapterName}" ?`}
            />
    </div>
  );
};

export default AllChapters;