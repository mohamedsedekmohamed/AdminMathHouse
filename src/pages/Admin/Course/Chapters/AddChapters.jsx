import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";

const AddChapters = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // courseId جاي من صفحة Chapters
  const { courseId } = location.state || {};
console.log(courseId);
  const { postData, loading: saving } = usePost("/api/admin/chapters");
  const { data: teachersRes } = useGet("/api/admin/teacher/selectionTeachers");
const { data: coursesRes } = useGet("/api/admin/teacher/selectionCourses");

const courseOptions = useMemo(() => {
  return (
    coursesRes?.data?.courses?.map((c) => ({
      value: c.id,
      label: c.name,
    })) || []
  );
}, [coursesRes]);

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
        label: "Chapter Name",
        type: "text",
        required: true,
        placeholder: "Enter chapter name",
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
        name: "courseId",
        label: "Course",
        type: "select",
        required: true,
        options: courseOptions,
        section: "Relations",
        defaultValue: courseId || "",
      },
      {
        name: "duration",
        label: "Duration",
        type: "text",
        required: true,
        placeholder: "e.g. 2 weeks",
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
        placeholder: "0",
        section: "Pricing",
        helperText: "leave empty for no discount",
      },
      {
        name: "description",
        label: "Description (Optional)",
        type: "text",
        placeholder: "Chapter description",
        section: "Content",
        fullWidth: true,
      },
      {
        name: "preRequisition",
        label: "Pre-requisition (Optional)",
        type: "text",
        placeholder: "Basics you should know",
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
        label: "Chapter Image (Optional)",
        type: "file",
        section: "Media",
      },
    ],
    [teacherOptions]
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
      duration: "",
 courseId: courseId || "",
       price: "",
      discount: "",
      description: "",
      image: "",
    }),
    []
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
      courseId:formData.courseId,
      teacherId: formData.teacherId,
      duration: formData.duration,
      price: Number(formData.price),
      discount: Number(formData.discount || 0),
      description: formData.description || "",
      image: imageBase64,
      preRequisition: formData.preRequisition || "",
      whatYouGain: formData.whatYouGain || "",
    };

    await postData(payload, "/api/admin/chapters", "Chapter added successfully");
    navigate(`/admin/courses/chapters/${courseId}`);
  };

  return (
    <AddPage
      title="Add Chapter"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate(-1)}
      loading={saving}
      initialData={initialFormValues}
    />
  );
};

export default AddChapters;
