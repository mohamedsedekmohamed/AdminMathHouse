import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";
const AddTeachers = () => {
  const navigate = useNavigate();
  const { postData, loading: saving } = usePost("/api/admin/teacher");

  const { data: categoriesRes , loading: loadingCats ,error } = useGet("/api/admin/teacher/selectionCategories");
  const { data: courses  , loading: loadingCours ,error: errorC} = useGet("/api/admin/teacher/selectionCourses");

  const categoryOptions = useMemo(() => {
    return (
      categoriesRes?.data?.data?.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })) || []
    );
  }, [categoriesRes]);

  const couersOptions = useMemo(() => {
    return (
      courses?.data?.courses?.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })) || []
    );
  }, [courses]);

  const fields = useMemo(
    () => [
      {
        name: "name",
        label: "Teacher Name",
        type: "text",
        required: true,
        placeholder: "Enter teacher name",
        section: "General Information",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "Enter email",
        section: "General Information",
      },
      {
        name: "phoneNumber",
        label: "Phone Number",
        type: "text",
        required: true,
        placeholder: "Enter phone number",
        section: "General Information",
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        required: true,
        placeholder: "Enter password",
        section: "General Information",
      },
      {
        name: "avatar",
        label: "Avatar (Optional)",
        type: "file",
        section: "General Information",
      },
      {
        name: "categoryId",
        label: "Category (Optional)",
        type: "select",
        options: categoryOptions,
        section: "Assignment",
        helperText: "Optional: Assign teacher to a category",
      },
      {
        name: "courseId",
        label: "Course (Optional)",
        type: "select",
        options: couersOptions,
        section: "Assignment",
        helperText: "Optional: Assign teacher to a course",
      },
    ],
    [categoryOptions, couersOptions]
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
      email: "",
      phoneNumber: "",
      password: "",
      avatar: "",
      categoryId: "",
      courseId: "",
    }),
    []
  );

  const onSave = async (formData) => {
    let avatarBase64 = null;
    if (formData.avatar instanceof File) {
      avatarBase64 = await fileToBase64(formData.avatar);
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      avatar: avatarBase64,
      categoryId: formData.categoryId || null,
      courseId: formData.courseId || null,
    };

    try {
      await postData(payload, "/api/admin/teacher", "Teacher added successfully");
      navigate("/admin/users/teachers");
    } catch (error) {
      throw error;
    }
  };

  if (loadingCats || loadingCours) {
    return <Loader />;
  }
  if (error || errorC) {
    return <Errorpage />;
  }
  return (
    <AddPage
      title="Add Teacher"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate("/admin/users/teachers")}
      initialData={initialFormValues}
    />
  );
};

export default AddTeachers;