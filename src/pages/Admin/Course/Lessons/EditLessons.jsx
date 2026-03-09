import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddPage from "@/components/AddPage";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";

const EditLessons = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // جلب بيانات الدرس
  const {
    data: lessonRes,
    loading: loadingLesson,
    error,
  } = useGet(`/api/admin/lessons/${id}`);
  const {
    data: teachersRes,
    loading: loadingTeachers,
    error: errorTeachers,
  } = useGet("/api/admin/teacher");
  const { putData, loading: saving } = usePut(`/api/admin/lessons/${id}`);

  const teacherOptions = useMemo(
    () =>
      teachersRes?.data?.teacher?.map((t) => ({
        value: t.id,
        label: t.name,
      })) || [],
    [teachersRes],
  );

  const fields = useMemo(
    () => [
      {
        name: "name",
        label: "Lesson Name",
        type: "text",
        required: true,
        section: "General Information",
      },
      {
        name: "teacherId",
        label: "Teacher",
        type: "select",
        required: true,
        options: teacherOptions,
        section: "General Information",
      },
      // {
      //   name: "chapterId",
      //   label: "Chapter",
      //   type: "text",
      //   required: true,
      //   section: "Relations",
      //   disabled: true, // علشان مايتغيرش من هنا
      // },
      {
        name: "price",
        label: "Price",
        type: "number",
        required: true,
        section: "General Information",
      },
      {
        name: "discount",
        label: "Discount",
        type: "number",
        section: "General Information",
        helperText: "leave empty for no discount",
      },
      {
        name: "description",
        label: "Description",
        type: "text",
        section: "General Information",
      },
      {
        name: "preRequisition",
        label: "Pre-requisition",
        type: "text",
        section: "General Information",
        helperText: "leave empty for no pre-requisition",
      },
      {
        name: "whatYouGain",
        label: "What You Will Gain",
        type: "text",
        section: "General Information",
        helperText: "leave empty for no what you will gain",
      },
      {
        name: "image",
        label: "Lesson Image",
        type: "file",
        section: "General Information",
        helperText: "leave empty for no image",
      },
    ],
    [teacherOptions],
  );

  const initialData = useMemo(
    () => ({
      name: lessonRes?.data?.lesson?.name || "",
      teacherId: lessonRes?.data?.teacher?.id || "",
      chapterId: lessonRes?.data?.chapter?.id || "",
      price: lessonRes?.data?.lesson?.price || "",
      discount: lessonRes?.data?.lesson?.discount || "",
      description: lessonRes?.data?.lesson?.description || "",
      preRequisition: lessonRes?.data?.lesson?.preRequisition || "",
      whatYouGain: lessonRes?.data?.lesson?.whatYouGain || "",
      image: lessonRes?.data?.lesson?.image || "",
    }),
    [lessonRes],
  );

  const onSave = async (formData) => {
    if (Number(formData.discount || 0) > Number(formData.price)) {
      toast.error("Discount can't be greater than price");
      return;
    }

    await putData(
      formData,
      `/api/admin/lessons/${id}`,
      "Lesson updated successfully",
    );
    navigate(`/admin/courses/lessons/${formData.chapterId}`);
  };

  if (loadingLesson || loadingTeachers) {
    return <Loader />;
  }

  if (error || errorTeachers) {
    return <Errorpage />;
  }

  return (
    <AddPage
      title="Edit Lesson"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate(-1)}
      initialData={initialData}
    />
  );
};

export default EditLessons;
