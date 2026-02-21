import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddPage from "@/components/AddPage";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";
const EditStudent = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // 🔹 جلب بيانات الطالب الحالي
  const { data: studentRes, loading: loadingStudent , error: selectError } = useGet(`/api/admin/student/${id}`);
  // 🔹 جلب خيارات categories و grades
  const { data: selectData, loading: loadingSelect , error: selectError2 } = useGet("/api/admin/student/select");
  const { putData, loading: saving } = usePut(`/api/admin/student/${id}`);

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
        placeholder: "Leave blank to keep current password",
        section: "Account Information",
      },
      {
        name: "phone",
        label: "Phone",
        type: "text",
        placeholder: "Student phone",
        section: "Contact Information",
      },
      {
        name: "parentphone",
        label: "Parent Phone",
        type: "text",
        placeholder: "Parent phone",
        section: "Contact Information",
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: categoriesOptions,
        section: "Academic Information",
        helperText: "Choose the student's category",
      },
      {
        name: "grade",
        label: "Grade",
        type: "select",
        options: gradesOptions,
        section: "Academic Information",
        helperText: "Choose the student's grade",
      },
    ],
    [categoriesOptions, gradesOptions]
  );

  const onSave = async (formData) => {
    if (!formData.firstname?.trim() || !formData.lastname?.trim() || !formData.email?.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      nickname: formData.nickname || "",
      email: formData.email,
      password: formData.password || undefined, // لو فاضي يبقى ما نغيرش الباسورد
      phone: formData.phone || "",
      parentphone: formData.parentphone || "",
      category: formData.category || null,
      grade: formData.grade || null,
    };

    await putData(payload, `/api/admin/student/${id}`, "Student updated successfully");
    navigate("/admin/users/students");
  };

  if (loadingStudent || loadingSelect) return <Loader />;
  if( selectError || selectError2) return <Errorpage  />;

  const student = studentRes?.data?.data;

  return (
    <AddPage
      title="Edit Student"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate("/admin/users/students")}
      initialData={{
        firstname: student?.firstname || "",
        lastname: student?.lastname || "",
        nickname: student?.nickname || "",
        email: student?.email || "",
        password: "",
        phone: student?.phone || "",
        parentphone: student?.parentphone || "",
        category: student?.category || "",
        grade: student?.grade || "",
      }}
    />
  );
};

export default EditStudent;
