import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";
const AddStudent = () => {
  const navigate = useNavigate();
  
  // 🔹 جلب دالة الإرسال وحالة التحميل الخاصة بها
  const { postData, loading: saving ,error: postError } = usePost("/api/admin/student");
  
  // 🔹 جلب البيانات المطلوبة للقوائم (Selects)
  const { data: selectData, loading: loadingSelects ,error: selectError } = useGet("/api/admin/student/select");

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
        section: "Account Information",
      },
      {
        name: "lastname",
        label: "Last Name",
        type: "text",
        required: true,
        placeholder: "Enter last name",
        section: "Account Information",
      },
      {
        name: "nickname",
        label: "Nickname",
        type: "text",
        required: true,
        placeholder: "Optional nickname",
        section: "Account Information",
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
        section: "Account Information",
      },
      {
        name: "parentphone",
        label: "Parent Phone",
        type: "text",
        pattern: /^[0-9]{10,15}$/,
        placeholder: "Parent phone",
        section: "Account Information",
        helperText: "Optional",
      },
      {
        name: "category",
        label: "Category",
        required: true,
        type: "select",
        options: categoriesOptions,
        section: "Account Information",
        helperText: "Choose the student's category",
      },
      {
        name: "grade",
        label: "Grade",
        required: true,
        type: "select",
        options: gradesOptions,
        section: "Account Information",
          helperText: "Choose the student's grade",
      },
    ],
    [categoriesOptions, gradesOptions]
  );

  // 🔹 تعريف initialData باستخدام useMemo لمنع إعادة التصيير العشوائي للفورم
  const initialFormValues = useMemo(() => ({
    firstname: "",
    lastname: "",
    nickname: "",
    email: "",
    password: "",
    phone: "",
    parentphone: "",
    category: "",
    grade: "",
  }), []);

  const onSave = async (formData) => {
    // Validation
    

    const payload = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      nickname: formData.nickname || "",
      email: formData.email,
      password: formData.password,
      phone: formData.phone || "",
      category: formData.category || null,
      grade: formData.grade || null,
    };
    if(formData.parentphone) payload.parentphone = formData.parentphone

    try {
      await postData(payload, "/api/admin/student", "Student added successfully");
      navigate("/admin/users/students");
    } catch (error) {
      
      throw error; 
    }
  };

  if (loadingSelects ) return <Loader />;
  if( selectError) return <Errorpage  />;
  return (
    <AddPage
      title="Add Student"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate("/admin/users/students")}
        // 👈 تمرير حالة الحفظ للـ AddPage
      initialData={initialFormValues} // 👈 استخدام المتغير المحفوظ في الذاكرة
    />
  );
};

export default AddStudent;