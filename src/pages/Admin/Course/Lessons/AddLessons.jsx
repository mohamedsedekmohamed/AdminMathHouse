import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";

const AddLessons = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { chapterId } = location.state || {};

  const { postData, loading: saving } = usePost("/api/admin/lessons");
  const { data: teachersRes , loading: loadingTeachers , error: error } = useGet("/api/admin/teacher");
  // const { data: selectchaper , loading: loadingselectchaper, error: errorchaper } = useGet("/api/admin/lessons/select-chapters");

  const teacherOptions = useMemo(() => {
    return (
      teachersRes?.data?.teacher?.map((t) => ({
        value: t.id,
        label: t.name,
      })) || []
    );
  }, [teachersRes]);
// const chaperOptions = useMemo(() => {
//   return (
//     selectchaper?.data?.data?.map((t) => ({
//       value: t.id,
//       label: t.label,
//     })) || []
//   );
// }, [selectchaper]);

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
        helperText: "select teacher",

      },
      // {
      //   name: "chapterId",
      //   label: "Chapter",
      //   type: "select",
      //   required: true,
      //   options: chaperOptions  ,
      //   section: "Relations",
      //   defaultValue: chapterId || "",
      //           helperText: "select chapter",

      // },
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
        helperText: "optional",
      },
      {
        name: "preRequisition",
        label: "Pre-requisition (Optional)",
        type: "text",
        placeholder: "What students should know first",
        section: "Content",
        helperText: "leave empty for no pre-requisition",
      },
      {
        name: "whatYouGain",
        label: "What You Will Gain (Optional)",
        type: "text",
        placeholder: "Skills you will gain",
        section: "Content",
        helperText: "leave empty for no what you will gain",
      },
      {
        name: "image",
        label: "Lesson Image (Optional)",
        type: "file",
        section: "Media",
              helperText: "leave empty for no image",
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
      // chapterId: chapterId || "",
      price: "",
      discount: "",
      description: "",
      preRequisition: "",
      whatYouGain: "",
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
      chapterId: chapterId,
      teacherId: formData.teacherId,
      price: Number(formData.price),
      discount: Number(formData.discount || 0),
      description: formData.description || "",
      image: imageBase64,
      preRequisition: formData.preRequisition || "",
      whatYouGain: formData.whatYouGain || "",
    };
     try {

    await postData(payload, "/api/admin/lessons", "Lesson added successfully");
    navigate(`/admin/courses/lessons/${chapterId}`);
      } catch (error) {
      throw error;
    } 
  };

  if (loadingTeachers ) return <Loader />;
  if (error  ) return <Errorpage />

  return (
    <AddPage
      title="Add Lesson"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate(-1)}
       
      initialData={initialFormValues}
    />
  );
};

export default AddLessons;
