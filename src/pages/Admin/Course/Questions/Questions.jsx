import { useNavigate } from "react-router-dom";
import ReusableTableSearch from "@/components/ReusableTableSearch";
import useGet from "@/hooks/useGet";
import React, { useMemo, useState, useEffect } from "react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import useDelete from "@/hooks/useDelete";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";

const Questions = () => {
  const navigate = useNavigate();

  // 1. States للتحكم في الترقيم والبحث
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 2. تطبيق الـ Debouncing للبحث (تأخير 500ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // إعادة الترقيم للصفحة الأولى عند تغير نص البحث
    }, 2000);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 3. تحديث الـ URL ليرسل الـ search parameter للسيرفر
  const { data, loading, error, refetch } = useGet(
    `/api/admin/questions?page=${page}&limit=${limit}${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ""}`
  );
  
  const { deleteData, loading: deleteLoading } = useDelete();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const paginationData = data?.data?.pagination || {};

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
      console.error(e);
    }
  };

  const columns = [
    { header: "Question", key: "question" },
    { header: "Type", key: "answerType" },
    { header: "Difficulty", key: "difficulty" },
    { header: "Category", key: "questionType" },
    { header: "Lesson", key: "lessonName" },
    { header: "Exam Code", key: "examCode" },
    { header: "Section", key: "sectionName" },
    { header: "Year", key: "year" },
    { header: "Month", key: "month" },
  ];

  const tableData = useMemo(() => {
    return (
      data?.data?.data?.map((q) => ({
        id: q.id || q._id, 
        question: q.question,
        answerType: q.answerType,
        difficulty: q.difficulty,
        questionType: q.questionType,
        lessonName: q.lesson?.name || "—",
        examCode: q.examCode?.code || "—",
        sectionName: q.section?.sectionName || "—",
        year: q.year,
        month: q.month,
        raw: q,
      })) || []
    );
  }, [data]);

  const handleEdit = (row) => {
    navigate(`/admin/courses/questions/edit/${row.id}`);
  };

  if (loading && !tableData.length) return <Loader />;
  if (error) return <Errorpage />;

  return (
    <div>
      <ReusableTableSearch
        title="Questions"
        titleAdd="Question"
        columns={columns}
        data={tableData}
        loading={loading || deleteLoading}
        onAddClick={() => navigate("/admin/courses/questions/add")}
        onEdit={handleEdit}
        onDelete={handleDelete}
        
        // الربط مع الـ Pagination والبحث
        currentPage={page}
        totalPages={paginationData.totalPages || 1}
        totalResults={paginationData.total || 0}
        rowsPerPage={limit}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        searchTerm={searchTerm}
        onSearchChange={(val) => setSearchTerm(val)}
      />

      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Question"
        description={`Are you sure you want to delete this question?`}
      />
    </div>
  );
};

export default Questions;