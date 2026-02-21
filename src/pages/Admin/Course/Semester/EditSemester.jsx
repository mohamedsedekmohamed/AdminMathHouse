import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddPage from "@/components/AddPage";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import Loader from "@/components/Loader";

const EditSemester = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: categoriesRes, loading: loadingCats } = useGet("/api/admin/semester/selection");
  const { data: semesterRes, loading: loadingOne } = useGet(`/api/admin/semester/${id}`);
  const { putData, loading: saving } = usePut(`/api/admin/semester/${id}`);

  const categoryOptions = useMemo(() => {
    return (
      categoriesRes?.data?.data?.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })) || []
    );
  }, [categoriesRes]);

  const fields = useMemo(
    () => [
      {
        name: "name",
        label: "Semester Name",
        type: "text",
        required: true,
        placeholder: "Enter semester name",
        section: "General Information",
      },
      {
        name: "categoryId",
        label: "Category",
        type: "select",
        options: categoryOptions,
        required: true,
        section: "General Information",
        helperText: "Select the category this semester belongs to",
        loading: loadingCats,
      },
    ],
    [categoryOptions, loadingCats]
  );

  const onSave = async (formData) => {
  
    const payload = {
      name: formData.name,
      categoryId: formData.categoryId,
    };

    await putData(payload, `/api/admin/semester/${id}`, "Semester updated successfully");
    navigate("/admin/courses/semester");
  };

  if (loadingCats || loadingOne) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

const semester = semesterRes?.data?.data?.[0];
  return (
    <AddPage
      title="Edit Semester"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate("/admin/courses/semester")}
      initialData={{
        name: semester?.name || "",
        categoryId: semester?.categoryId || "",
      }}
    />
  );
};

export default EditSemester;
