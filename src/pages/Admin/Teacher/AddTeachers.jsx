import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";

const AddTeachers = () => {
  const navigate = useNavigate();
  const { postData } = usePost("/api/admin/teacher");

  // اختيارات الـ Categories (اختياري)
  const { data: categoriesRes } = useGet("/api/admin/category");
  // اختيارات الـ Courses (اختياري)
  // const { data: coursesRes } = useGet("/api/admin/course/selection");

  const categoryOptions = useMemo(() => {
    return (
      categoriesRes?.data?.data?.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })) || []
    );
  }, [categoriesRes]);

  // const courseOptions = useMemo(() => {
  //   return (
  //     coursesRes?.data?.data?.map((course) => ({
  //       value: course.id,
  //       label: course.name,
  //     })) || []
  //   );
  // }, [coursesRes]);

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
        section: "Security",
      },
      {
        name: "avatar",
        label: "Avatar (Optional)",
        type: "file",
        section: "Media",
      },
      {
        name: "categoryId",
        label: "Category (Optional)",
        type: "select",
        options: categoryOptions,
        section: "Assignment",
        helperText: "Optional: Assign teacher to a category",
      },
      // {
      //   name: "courseId",
      //   label: "Course (Optional)",
      //   type: "select",
      //   options: courseOptions,
      //   section: "Assignment",
      //   helperText: "Optional: Assign teacher to a course",
      // },
    ],
    [categoryOptions]
    // [categoryOptions, courseOptions]
  );

  // تحويل File إلى Base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

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
      avatar: avatarBase64,              // optional
      categoryId: formData.categoryId || null, // optional
      // courseId: formData.courseId || null,     // optional
    };

    await postData(payload, "/api/admin/teacher", "Teacher added successfully");
    navigate("/admin/users/teachers");
  };

  return (
    <AddPage
      title="Add Teacher"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate("/admin/users/teachers")}
      initialData={{
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        avatar: "",
        categoryId: "",
        // courseId: "",
      }}
    />
  );
};

export default AddTeachers;
