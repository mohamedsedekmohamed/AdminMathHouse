import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";

const AddStudent = () => {
  const navigate = useNavigate();
  const { postData } = usePost("/api/admin/student");
  const { data: selectData, loading } = useGet("/api/admin/student/select");

  // 🔹 تجهيز خيارات categories و grades
  const categoriesOptions = useMemo(() => {
    return (
      selectData?.data?.data?.categories?.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })) || []
    );
  }, [selectData]);

  const gradesOptions = useMemo(() => {
    return (
      selectData?.data?.data?.grades?.map((g) => ({
        value: g,
        label: `Grade ${g}`,
      })) || []
    );
  }, [selectData]);

  const fields = useMemo(
    () => [
      {
        name: "firstname",
        label: "First Name",
        type: "text",
        required: true,
        placeholder: "Enter first name",
        section: "Personal Information",
      },
      {
        name: "lastname",
        label: "Last Name",
        type: "text",
        required: true,
        placeholder: "Enter last name",
        section: "Personal Information",
      },
      {
        name: "nickname",
        label: "Nickname",
        type: "text",
        required: true,

        placeholder: "Optional nickname",
        section: "Personal Information",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "Enter email",
        section: "Account Information",
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        required: true,
        placeholder: "Enter password",
        section: "Account Information",
      },
      {
        name: "phone",
        label: "Phone",
        type: "text",
        pattern: /^[0-9]{10,15}$/,
        required: true,
        placeholder: "Student phone",
        section: "Contact Information",
      },
      {
        name: "parentphone",
        label: "Parent Phone",
        type: "text",
        required: true,
        pattern: /^[0-9]{10,15}$/,
        placeholder: "Parent phone",
        section: "Contact Information",
      },
      {
        name: "category",
        label: "Category",
        required: true,
        type: "select",
        options: categoriesOptions,
        section: "Academic Information",
        helperText: "Choose the student's category",
      },
      {
        name: "grade",
        label: "Grade",
        required: true,
        type: "select",
        options: gradesOptions,
        section: "Academic Information",
        helperText: "Choose the student's grade",
      },
    ],
    [categoriesOptions, gradesOptions],
  );

  const onSave = async (formData) => {
    // Validation
    if (
      !formData.firstname?.trim() ||
      !formData.lastname?.trim() ||
      !formData.email?.trim() ||
      !formData.password?.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      nickname: formData.nickname || "",
      email: formData.email,
      password: formData.password,
      phone: formData.phone || "",
      parentphone: formData.parentphone || "",
      category: formData.category || null,
      grade: formData.grade || null,
    };

    await postData(payload, "/api/admin/student", "Student added successfully");
    navigate("/admin/users/students");
  };

  return (
    <AddPage
      title="Add Student"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate("/admin/users/students")}
      initialData={{
        firstname: "",
        lastname: "",
        nickname: "",
        email: "",
        password: "",
        phone: "",
        parentphone: "",
        category: "",
        grade: "",
      }}
    />
  );
};

export default AddStudent;
