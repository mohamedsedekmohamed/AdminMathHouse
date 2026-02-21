import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";

const AddLessons = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // chapterId جاي من صفحة Lessons
  const { chapterId } = location.state || {};

  const { postData, loading: saving } = usePost("/api/admin/lessons");
  const { data: teachersRes } = useGet("/api/admin/teacher");

  const teacherOptions = useMemo(() => {
    return (
      teachersRes?.data?.teacher?.map((t) => ({
        value: t.id,
        label: t.name,
      })) || []
    );
  }, [teachersRes]);

  const fields = useMemo(
    () => [
      {
        name: "name",
        label: "Lesson Name",
        type: "text",
        required: true,
        placeholder: "Enter lesson name",
        section: "General Information",
      },
      {
        name: "teacherId",
        label: "Teacher",
        type: "select",
        required: true,
        options: teacherOptions,
        section: "Relations",
      },
      {
        name: "chapterId",
        label: "Chapter",
        type: "text",
        required: true,
        section: "Relations",
        defaultValue: chapterId || "",
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
        placeholder: "0",
        section: "Pricing",
        helperText: "leave empty for no discount",
      },
      {
        name: "description",
        label: "Description (Optional)",
        type: "text",
        placeholder: "Lesson description",
        section: "Content",
        fullWidth: true,
      },
      {
        name: "preRequisition",
        label: "Pre-requisition (Optional)",
        type: "text",
        placeholder: "What students should know first",
        section: "Content",
      },
      {
        name: "whatYouGain",
        label: "What You Will Gain (Optional)",
        type: "text",
        placeholder: "Skills you will gain",
        section: "Content",
      },
      {
        name: "image",
        label: "Lesson Image (Optional)",
        type: "file",
        section: "Media",
      },
    ],
    [teacherOptions, chapterId]
  );

  // تحويل File إلى Base64
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
      teacherId: "",
      chapterId: chapterId || "",
      price: "",
      discount: "",
      description: "",
      preRequisition: "",
      whatYouGain: "",
      image: "",
    }),
    [chapterId]
  );

  const onSave = async (formData) => {
    if (Number(formData.discount || 0) > Number(formData.price)) {
      toast.error("Discount can't be greater than price");
      return;
    }

    let imageBase64 = null;
    if (formData.image instanceof File) {
      imageBase64 = await fileToBase64(formData.image);
    }

    const payload = {
      name: formData.name,
      chapterId: formData.chapterId,
      teacherId: formData.teacherId,
      price: Number(formData.price),
      discount: Number(formData.discount || 0),
      description: formData.description || "",
      image: imageBase64,
      preRequisition: formData.preRequisition || "",
      whatYouGain: formData.whatYouGain || "",
    };

    await postData(payload, "/api/admin/lessons", "Lesson added successfully");
    navigate(`/admin/courses/lessons/${chapterId}`);
  };

  return (
    <AddPage
      title="Add Lesson"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate(-1)}
      loading={saving}
      initialData={initialFormValues}
    />
  );
};

export default AddLessons;
