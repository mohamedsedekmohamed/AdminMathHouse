import { useNavigate } from "react-router-dom";
import ReusableTable from "@/components/ReusableTable";
import useGet from "@/hooks/useGet";
import React, { useMemo, useState } from "react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import useDelete from "@/hooks/useDelete";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";
import toast from "react-hot-toast";
import usePut from "@/hooks/usePut";
import axios from "axios";
import { getToken } from "../../../../utils/auth";

const Currency = () => {
  const navigate = useNavigate();
  const { data, loading, refetch, error } = useGet("/api/admin/currency");
  const { deleteData, loading: deleteLoading } = useDelete();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleDelete = (row) => {
    setSelectedRow(row);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteData(`/api/admin/currency/${selectedRow.id}`);
      setOpenDeleteModal(false);
      setSelectedRow(null);
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  const columns = [
    { header: "Name", key: "name" },
    { header: "Symbol", key: "symbol" },
    { header: "Code", key: "code" },
    { header: "Exchange Rate", key: "exchangeRate" },
    {
      header: "Base",
      key: "isBase",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <span
            className={` rounded-full text-white font-semibold text-sm ${
              value
                ? "bg-green-500 px-2 py-1"
                : "hidden bg-gray-300 text-gray-800"
            }`}
          >
            {value && "Yes"}
          </span>
          {!value && (
     <button
  onClick={async () => {
    try {
      await axios.put(
        `https://bcknd.mathshouse.net/api/admin/currency/base/${row.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  }}
  className="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-600/80 transition"
>
  Make Base
</button>
          )}
        </div>
      ),
    },
  ];

  const tableData = useMemo(() => {
    return (
      data?.data?.data?.map((c) => ({
        id: c.id,
        name: c.name,
        symbol: c.symbol,
        code: c.code,
        exchangeRate: c.exchangeRate,
        isBase: c.isBase,
        createdAt: c.createdAt,
        raw: c,
      })) || []
    );
  }, [data]);

  const handleEdit = (row) => {
    navigate(`/admin/settings/currency/edit/${row.id}`);
  };

  if (loading) return <Loader />;
  if (error) return <Errorpage />;

  return (
    <div>
      <ReusableTable
        title="Currencies"
        titleAdd="Currency"
        columns={columns}
        data={tableData}
        loading={loading || deleteLoading}
        onAddClick={() => navigate("/admin/settings/currency/add")}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Currency"
        description={`Are you sure you want to delete "${selectedRow?.name}" ?`}
      />
    </div>
  );
};

export default Currency;
