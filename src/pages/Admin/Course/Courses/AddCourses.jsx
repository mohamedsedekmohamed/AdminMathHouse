import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage"
const AddCourses = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // لو جاي من صفحة الكاتيجوري
  const { categoryId } = location.state || {};
console.log(categoryId);
  const { postData, loading: saving } = usePost("/api/admin/courses");
  const { data: teachersRes , loading: loadingTeachers , error: errorTeachers } = useGet("/api/admin/teacher");
  const { data: categoriesRes , loading: loadingCats ,error: error} = useGet("/api/admin/teacher/selectionCategories");

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
      },
      {
        name: "categoryId",
        label: "Category",
        type: "select",
        required: true,
        options: categoryOptions,
        section: "General Information",
        defaultValue: categoryId || "",
      },
      {
        name: "teacherIds",
        label: "Teacher",
        type: "multipleSelect",
        options: teacherOptions,
        section: "General Information",
        helperText: "You can select more than one teacher",
      },
      {
        name: "duration",
        label: "Duration (Days)",
        type: "text",
        required: true,
        placeholder: "30",
        section: "General Information",
      },
      {
        name: "price",
        label: "Price",
        type: "number",
        required: true,
        placeholder: "Enter price",
        section: "General Information",
      },
      {
        name: "discount",
        label: "Discount",
        type: "number",
        placeholder: "Enter discount",
        section: "General Information",
        helperText: "leave empty for no discount",
      },
      {
        name: "preRequisition",
        label: "Pre-requisition (Optional)",
        type: "text",
        placeholder: "Geometry basics",
        section: "General Information",
          helperText: "leave empty for no pre-requisition",
      },
      {
        name: "whatYouGain",
        label: "What You Will Gain (Optional)",
        type: "text",
        placeholder: "Skills, knowledge...",
        section: "General Information",
        helperText: "leave empty for no what you will gain",
      },
      {
        name: "isHaveSemester",
        label: "Is Have Semester",
        type: "switch",
                section: "Relations",
        placeholder: "Skills, knowledge...",
        helperText: "leave empty for no what you will gain",
      },
      {
        name: "image",
        label: "Course Image (Optional)",
        type: "file",
        section: "Relations",
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
      isHaveSemester: false,
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
      isHaveSemester: formData.isHaveSemester
    };

    await postData(payload, "/api/admin/courses", "Course added successfully");
    navigate(`/admin/courses/courses/${formData.categoryId}`);
  };
if ( loadingTeachers || loadingCats) {
    return <Loader />;
  }
  if (  error || errorTeachers ) {
    return <Errorpage  />;
  }
  
  return (
    <AddPage
      title="Add Course"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate(-1)}
       
      initialData={initialFormValues}
    />
  );
};

export default AddCourses;
