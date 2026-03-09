import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddPage from "@/components/AddPage";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";

const EditCourses = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: courseRes,
    loading: loadingOne,
    error: errorOne,
  } = useGet(`/api/admin/courses/${id}`);
  const {
    data: teachersRes,
    loading: loadingTeachers,
    error: errorTeachers,
  } = useGet("/api/admin/teacher");
  const {
    data: categoriesRes,
    loading: loadingCats,
    error: error,
  } = useGet("/api/admin/teacher/selectionCategories");
  const { putData, loading: saving } = usePut(`/api/admin/courses/${id}`);

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
        section: "General Information",
      },
      {
        name: "categoryId",
        label: "Category",
        type: "select",
        required: true,
        options: categoryOptions,
        section: "General Information",
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
        name: "preRequisition",
        label: "Pre-requisition (Optional)",
        type: "text",
        section: "General Information",
        helperText: "leave empty for no pre-requisition",
      },
      {
        name: "whatYouGain",
        label: "What You Will Gain (Optional)",
        type: "text",
        section: "General Information",
        helperText: "leave empty for no what you will gain",
      },
      {
        name: "image",
        label: "Course Image (Optional)",
        type: "file",
        section: "Relations",
        helperText: "leave empty for no image",
      },
      {
        name: "isHaveSemester",
        label: "Is Have Semester",
        type: "switch",
                section: "Relations",
        placeholder: "Skills, knowledge...",
        helperText: "leave empty for no what you will gain",
      },
    ],
    [teacherOptions, categoryOptions],
  );

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const onSave = async (formData) => {
    if (Number(formData.discount) > Number(formData.price)) {
      toast.error("Discount can't be greater than price");
      return;
    }

    let imageBase64 = null;

    if (formData.image instanceof File) {
      imageBase64 = await fileToBase64(formData.image);
    } else if (typeof formData.image === "string" && formData.image) {
      imageBase64 = formData.image;
    }

    const payload = {
      name: formData.name,
      categoryId: formData.categoryId,
      teacherIds: formData.teacherIds,
      preRequisition: formData.preRequisition || "",
      whatYouGain: formData.whatYouGain || "",
      duration:formData.duration,
      image: imageBase64, // ممكن تبقى null لو ما غيّرش الصورة
      description: formData.description || "",
      price: Number(formData.price),
      discount: Number(formData.discount || 0),
            isHaveSemester: formData.isHaveSemester

    };

    await putData(
      payload,
      `/api/admin/courses/${id}`,
      "Course updated successfully",
    );
    navigate(`/admin/courses/courses/${formData.categoryId}`);
  };

  if (loadingOne || loadingTeachers || loadingCats) {
    return <Loader />;
  }
  if (errorOne || errorTeachers || error) {
    return <Errorpage />;
  }

  const course = courseRes?.data;

  return (
    <AddPage
      title="Edit Course"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate(-1)}
      initialData={{
        name: course?.name || "",
        description: course?.description || "",
        categoryId: course?.categoryId || "",
        teacherIds: course?.teachers?.map((t) => t.teacherId) || [], // الاسم صح الآن
        preRequisition: course?.preRequisition || "",
        whatYouGain: course?.whatYouGain || "",
        duration: course?.duration || "",
        image: course?.image || "", // URL الصورة القديمة
        price: course?.price || "",
        discount: course?.discount || "",
              isHaveSemester: course?.isHaveSemester,

      }}
    />
  );
};

export default EditCourses;
