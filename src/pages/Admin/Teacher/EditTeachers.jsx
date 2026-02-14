import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddPage from "@/components/AddPage";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import Loader from "@/components/Loader";

const EditTeachers = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // جلب المدرّس الواحد
  const { data: teacherRes, loading: loadingOne } = useGet(`/api/admin/teacher/${id}`);
  // جلب الكاتيجوريز للاختيار
  const { data: categoriesRes, loading: loadingCats } = useGet("/api/admin/category");
  const { putData, loading: saving } = usePut(`/api/admin/teacher/${id}`);

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
        label: "Password (Optional)",
        type: "password",
        placeholder: "Leave empty to keep current password",
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
    ],
    [categoryOptions]
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
      categoryId: formData.categoryId || null,
    };

    // لو كتب باسورد جديد
    if (formData.password?.trim()) {
      payload.password = formData.password;
    }

    // لو رفع صورة جديدة
    if (avatarBase64) {
      payload.avatar = avatarBase64;
    }

    await putData(payload, `/api/admin/teacher/${id}`, "Teacher updated successfully");
    navigate("/admin/users/teachers");
  };

  if (loadingOne || loadingCats) {
    return <Loader />;
  }

  const teacher = teacherRes?.data?.teacher 

  return (
    <AddPage
      title="Edit Teacher"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate("/admin/users/teachers")}
      initialData={{
        name: teacher?.name || "",
        email: teacher?.email || "",
        phoneNumber: teacher?.phoneNumber || "",
        password: "", // دايمًا فاضي
        avatar: teacher?.avatar || "",
        categoryId: teacher?.categoryId || "",
      }}
    />
  );
};

export default EditTeachers;
