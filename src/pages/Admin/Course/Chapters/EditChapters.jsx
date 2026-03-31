import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddPage from "@/components/AddPage";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";

const EditChapters = () => {
  const { id } = useParams();
  const navigate = useNavigate();

 
  const {
    data: chapterRes,
    loading: loadingChapter,
    error,
  } = useGet(`/api/admin/chapters/${id}`);
  const {
    data: teachersRes,
    loading: loadingTeachers,
    error: errorTeachers,
  } = useGet("/api/admin/teacher/selectionTeachers");
  const {
    data: coursesRes,
    loading: loadingCours,
    error: errorteacher,
  } = useGet("/api/admin/teacher/selectionCourses");
  const { putData, loading: saving } = usePut(`/api/admin/chapters/${id}`);

  const teacherOptions = useMemo(
    () =>
      teachersRes?.data?.teacher?.map((t) => ({
        value: t.id,
        label: t.name,
      })) || [],
    [teachersRes],
  );

  const courseOptions = useMemo(
    () =>
      coursesRes?.data?.courses?.map((c) => ({ value: c.id, label: c.name })) ||
      [],
    [coursesRes],
  );
useEffect(() => {
  
}, []);
  const fields = useMemo(
    () => [
      {
        name: "name",
        label: "Chapter Name",
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
      //   name: "courseId",
      //   label: "Course",
      //   type: "select",
      //   required: true,
      //   options: courseOptions,
      //   section: "Relations",
      // },
      {
        name: "duration",
        label: "Duration",
        type: "text",
        required: true,
        section: "General Information",
      },
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
      { name: "image", label: "Chapter Image", type: "file", section: "Media" ,
              helperText: "leave empty for no image",

      },
    ],
    [teacherOptions, courseOptions],
  );

  const initialData = useMemo(
    () => ({
      name: chapterRes?.data?.chapter?.name || "",
      teacherId: chapterRes?.data?.teacher?.id || "",
      courseId: chapterRes?.data?.course?.id || "",
      duration: chapterRes?.data?.chapter?.duration || "",
      price: chapterRes?.data?.chapter?.price || "",
      discount: chapterRes?.data?.chapter?.discount || "",
      description: chapterRes?.data?.chapter?.description || "",
      preRequisition: chapterRes?.data?.chapter?.preRequisition || "",
      whatYouGain: chapterRes?.data?.chapter?.whatYouGain || "",
      image: chapterRes?.data?.chapter?.image || "",
      semesterId: chapterRes?.data?.semester?.id || "",
    }),
    [chapterRes],
  );

  const onSave = async (formData) => {
    if (Number(formData.discount || 0) > Number(formData.price)) {
      toast.error("Discount can't be greater than price");
      return;
    }

    await putData(
      formData,
      `/api/admin/chapters/${id}`,
      "Chapter updated successfully",
    );
    navigate(-1);
  };

  if (loadingChapter || loadingTeachers || loadingCours) return <Loader />;
  if (error || errorTeachers || errorteacher) return <Errorpage />;
  return (
    <AddPage
      title="Edit Chapter"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate(-1)}
      initialData={initialData}
    />
  );
};

export default EditChapters;
