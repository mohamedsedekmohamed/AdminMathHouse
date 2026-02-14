import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";
import Loader from "@/components/Loader";
const AddSemester = () => {
  const navigate = useNavigate();
  const { postData } = usePost("/api/admin/semester");
  const { data: categoriesRes, loading } = useGet("/api/admin/semester/selection");

  // تجهيز options للـ Category
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

      },
    ],
    [categoryOptions, loading]
  );

  const onSave = async (formData) => {
    if (!formData.name?.trim()) {
      toast.error("Semester name is required");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Category is required");
      return;
    }

    const payload = {
      name: formData.name,
      categoryId: formData.categoryId,
    };

    await postData(payload, "/api/admin/semester", "Semester added successfully");
    navigate("/admin/courses/semester");
  };
if(loading) return <Loader />
  return (
    <AddPage
      title="Add Semester"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate("/admin/courses/semester")}
      initialData={{
        name: "",
        categoryId: "",
      }}
    />
  );
};

export default AddSemester;
