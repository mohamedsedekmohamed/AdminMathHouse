import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage"
const AddChapters = () => {
  const navigate = useNavigate();
  const location = useLocation();

const { courseId, semesterId } = location.state || {};
  const { postData, loading: saving } = usePost("/api/admin/chapters");
  const { data: teachersRes  , loading: loadingTeachers, error: errorTeachers} = useGet("/api/admin/teacher/selectionTeachers");
const { data: coursesRes , loading: loadingCours ,error: error } = useGet("/api/admin/teacher/selectionCourses");
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
      // {
      //   name: "courseId",
      //   label: "Course",
      //   type: "select",
      //   required: true,
      //   options: courseOptions,
      //   section: "Relations",
      //   defaultValue: courseId || "",
      // },
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
        helperText  : "leave empty for no description",
      },
      {
        name: "preRequisition",
        label: "Pre-requisition (Optional)",
        type: "text",
        placeholder: "Basics you should know",
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
        label: "Chapter Image (Optional)",
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
      duration: "",
//  courseId: courseId || "",
       price: "",
      discount: "",
      description: "",
      image: "",
      whatYouGain: "",
      preRequisition: "",
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
    courseId: formData.courseId,
    teacherId: formData.teacherId,
    duration: formData.duration,
    price: Number(formData.price),
    courseId: courseId,
    // discount: Number(formData.discount || 0),
    // description: formData.description || "",
  };

  if (semesterId) {
    payload.semesterId = semesterId;
  }
  if (formData.description) {
    payload.description = formData.description;
  }
if (Number(formData.discount) > 0) {
  payload.discount = Number(formData.discount);
}
  if (formData.preRequisition) {
    payload.preRequisition = formData.preRequisition;
  }
  if (formData.whatYouGain) {
    payload.whatYouGain = formData.whatYouGain;
  }
  if (imageBase64) {
    payload.image = imageBase64;
  }

  await postData(payload, "/api/admin/chapters", "Chapter added successfully");
  navigate(`/admin/courses/chapters/${formData.courseId}`,{state: { 
        courseId: courseId, 
        semesterId: semesterId 
      }});
};

if ( loadingTeachers || loadingCours) {
    return <Loader />;
  }
  if (  error || errorTeachers ) {
    return <Errorpage  />;
  }

  return (
    <AddPage
      title="Add Chapter"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate(-1)}
       
      initialData={initialFormValues}
    />
  );
};

export default AddChapters;
