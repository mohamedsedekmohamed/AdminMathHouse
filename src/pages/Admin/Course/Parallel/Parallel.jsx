import React, { useEffect, useMemo, useState } from "react";
import useGet from "@/hooks/useGet";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";
import ReusableTableSearch from "@/components/ReusableTableSearch";

const ParallelModal = ({ open, onClose, originalQuestionId }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, loading, error } = useGet(
   `/api/admin/questions/parallel?origianlQuestionId=${originalQuestionId}&page=${page}&limit=${limit}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""}`
    
  );

  const paginationData = data?.data?.pagination || {};

  const columns = [
    { header: "Question", key: "question" },
    { header: "Type", key: "answerType" },
    { header: "Difficulty", key: "difficulty" },
  ];

  const tableData = useMemo(() => {
    return (
      data?.data?.data?.map((q) => ({
        id: q.id,
        question: q.question,
        answerType: q.answerType,
        difficulty: q.difficulty,
        raw: q,
      })) || []
    );
  }, [data]);

  if (!open) return null;
  if (loading) return <Loader />;
  if (error) return <Errorpage />;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-5xl rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Parallel Questions</h2>
          <button onClick={onClose} className="text-red-500 font-bold">✕</button>
        </div>

        <ReusableTableSearch
          title="Parallel Questions"
          columns={columns}
          data={tableData}
          loading={loading}
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
      </div>
    </div>
  );
};

export default ParallelModal;