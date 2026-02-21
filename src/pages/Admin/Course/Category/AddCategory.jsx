import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";

const AddCategory = () => {
  const navigate = useNavigate();
  
  const { postData, loading: saving } = usePost("/api/admin/category");
  const { data: categoriesRes, loading: loadingCats } = useGet("/api/admin/category");


  const parentOptions = useMemo(() => {
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
        label: "Category Name",
        type: "text",
        required: true,
        placeholder: "Enter category name",
        section: "General Information",
      },
      {
        name: "description",
        label: "Description",
        type: "text",
                required: true,
        placeholder: " description",
        section: "General Information",
        fullWidth: true,
      },
      {
        name: "parentCategoryId",
        label: "Parent Category (Optional)",
        type: "select",
        options: parentOptions,
        section: "Hierarchy",
        helperText: "Leave empty if this is a main category",
      },
      {
        name: "image",
        label: "Category Image (Optional)",
        type: "file",
        section: "Media",
      },
    ],
    [parentOptions]
  );

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const initialFormValues = useMemo(() => ({
    name: "",
    description: "",
    parentCategoryId: "",
    image: "",
  }), []);

  const onSave = async (formData) => {
 

    let imageBase64 = null;
    if (formData.image instanceof File) {
      imageBase64 = await fileToBase64(formData.image);
    }

    const payload = {
      name: formData.name,
      description: formData.description || "",
      image: imageBase64,
      parentCategoryId: formData.parentCategoryId || null, 
    };

    try {
      await postData(payload, "/api/admin/category", "Category added successfully");
      navigate("/admin/courses/categories");
    } catch (error) {
    
      throw error;
    }
  };

  return (
    <AddPage
      title="Add Category"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate("/admin/courses/categories")}
      loading={saving} 
      initialData={initialFormValues} 
    />
  );
};

export default AddCategory;