
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddPage from "@/components/AddPage";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import Loader from "@/components/Loader";

const EditChapters = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // جلب بيانات الفصل
  const { data: chapterRes, loading: loadingChapter } = useGet(`/api/admin/chapters/${id}`);
  const { data: teachersRes } = useGet("/api/admin/teacher/selectionTeachers");
  const { data: coursesRes } = useGet("/api/admin/teacher/selectionCourses");
  const { putData, loading: saving } = usePut(`/api/admin/chapters/${id}`);

  const teacherOptions = useMemo(() => 
    teachersRes?.data?.teacher?.map(t => ({ value: t.id, label: t.name })) || []
  , [teachersRes]);

  const courseOptions = useMemo(() => 
    coursesRes?.data?.courses?.map(c => ({ value: c.id, label: c.name })) || []
  , [coursesRes]);

  const fields = useMemo(() => [
    { name: "name", label: "Chapter Name", type: "text", required: true, section: "General Information" },
    { name: "teacherId", label: "Teacher", type: "select", required: true, options: teacherOptions, section: "Relations" },
    { name: "courseId", label: "Course", type: "select", required: true, options: courseOptions, section: "Relations" },
    { name: "duration", label: "Duration", type: "text", required: true, section: "Details" },
    { name: "price", label: "Price", type: "number", required: true, section: "Pricing" },
    { name: "discount", label: "Discount", type: "number", section: "Pricing", helperText: "leave empty for no discount" },
    { name: "description", label: "Description", type: "text", section: "Content", fullWidth: true },
    { name: "preRequisition", label: "Pre-requisition", type: "text", section: "Content" },
    { name: "whatYouGain", label: "What You Will Gain", type: "text", section: "Content" },
    { name: "image", label: "Chapter Image", type: "file", section: "Media" },
  ], [teacherOptions, courseOptions]);

 const initialData = useMemo(() => ({
  name: chapterRes?.data?.chapter?.name || "",
  teacherId: chapterRes?.data?.teacher?.id || "",      // ⚡ هنا استخدم teacher.id
  courseId: chapterRes?.data?.course?.id || "",        // ⚡ هنا استخدم course.id
  duration: chapterRes?.data?.chapter?.duration || "",
  price: chapterRes?.data?.chapter?.price || "",
  discount: chapterRes?.data?.chapter?.discount || "",
  description: chapterRes?.data?.chapter?.description || "",
  preRequisition: chapterRes?.data?.chapter?.preRequisition || "",
  whatYouGain: chapterRes?.data?.chapter?.whatYouGain || "",
  image: chapterRes?.data?.chapter?.image || "",
}), [chapterRes]);


  const onSave = async (formData) => {
    if (Number(formData.discount || 0) > Number(formData.price)) {
      toast.error("Discount can't be greater than price");
      return;
    }

    await putData(formData, `/api/admin/chapters/${id}`, "Chapter updated successfully");
    navigate(`/admin/courses/chapters/${formData.courseId}`);
  };

 if (loadingChapter || saving) {
    return <div className=""><Loader /></div>;
  }
  return (
    <AddPage
      title="Edit Chapter"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate(-1)}
      loading={saving}
      initialData={initialData}
    />
  );
};

export default EditChapters;
