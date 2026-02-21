import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";
import toast from "react-hot-toast";
const AddCourses = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // لو جاي من صفحة الكاتيجوري
  const { categoryId } = location.state || {};

  const { postData, loading: saving } = usePost("/api/admin/courses");
  const { data: teachersRes } = useGet("/api/admin/teacher");
  const { data: categoriesRes } = useGet("/api/admin/teacher/selectionCategories");

  const teacherOptions = useMemo(() => {
    return (
      teachersRes?.data?.teacher?.map((t) => ({
        value: t.id,
        label: t.name,
      })) || []
    );
  }, [teachersRes]);

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
        label: "Course Name",
        type: "text",
        required: true,
        placeholder: "Enter course name",
        section: "General Information",
      },
      {
        name: "description",
        label: "Description (Optional)",
        type: "text",
        placeholder: "Course description",
        section: "General Information",
        fullWidth: true,
      },
      {
        name: "categoryId",
        label: "Category",
        type: "select",
        required: true,
        options: categoryOptions,
        section: "Relations",
        defaultValue: categoryId || "",
      },
      {
        name: "teacherIds",
        label: "Teacher",
        type: "multipleSelect",
        options: teacherOptions,
        section: "Relations",
        helperText: "You can select more than one teacher",
      },
      {
        name: "duration",
        label: "Duration (Days)",
        type: "number",
        required: true,
        placeholder: "30",
        section: "Details",
      },
      {
        name: "price",
        label: "Price",
        type: "number",
        required: true,
        placeholder: "Enter price",
        section: "Pricing",
      },
      {
        name: "discount",
        label: "Discount",
        type: "number",
        placeholder: "Enter discount",
        section: "Pricing",
        helperText: "leave empty for no discount",
      },
      {
        name: "preRequisition",
        label: "Pre-requisition (Optional)",
        type: "text",
        placeholder: "Geometry basics",
        section: "Content",
        helperText: "leave empty for no pre-requisition",
      },
      {
        name: "whatYouGain",
        label: "What You Will Gain (Optional)",
        type: "text",
        placeholder: "Skills, knowledge...",
        section: "Content",
        helperText: "leave empty for no what you will gain",
      },
      {
        name: "image",
        label: "Course Image (Optional)",
        type: "file",
        section: "Media",
        helperText: "leave empty for no image",
      },
    ],
    [teacherOptions, categoryOptions, categoryId],
  );

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const initialFormValues = useMemo(
    () => ({
      name: "",
      description: "",
      categoryId: categoryId || "",
      teacherIds: [],
      preRequisition: "",
      whatYouGain: "",
      duration: "",
      image: "",
      price: "",
      discount: "",
    }),
    [categoryId],
  );

  const onSave = async (formData) => {
    let imageBase64 = null;
    if (formData.image instanceof File) {
      imageBase64 = await fileToBase64(formData.image);
    }
    if (formData.discount > formData.price) {
      toast.error("Discount can't be greater than price");
      return;
    }
    const payload = {
      name: formData.name,
      categoryId: formData.categoryId,
      teacherIds: formData.teacherIds,
      preRequisition: formData.preRequisition || "",
      whatYouGain: formData.whatYouGain || "",
      duration: formData.duration,
      image: imageBase64,
      description: formData.description || "",
      price: Number(formData.price),
      discount: Number(formData.discount || 0),
    };

    await postData(payload, "/api/admin/courses", "Course added successfully");
    navigate(`/admin/courses/courses/${formData.categoryId}`);
  };

  return (
    <AddPage
      title="Add Course"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate(-1)}
      loading={saving}
      initialData={initialFormValues}
    />
  );
};

export default AddCourses;
