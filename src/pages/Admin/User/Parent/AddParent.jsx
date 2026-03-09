import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";
const AddParent = () => {
  const navigate = useNavigate();
  const { postData, loading: saving } = usePost("/api/admin/parent");

  const fields = useMemo(
    () => [
      {
        name: "name",
        label: "Parent Name",
        type: "text",
        required: true,
        placeholder: "Enter parent name",
        section: "Contact Information",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "example@email.com",
        section: "Contact Information",
      },
      {
        name: "phoneNumber",
        label: "Phone Number",
        type: "number",
        required: true,
        placeholder: "010xxxxxxxx",
        section: "Contact Information",
      },
      {
        name: "password",
        label: "Password",
        type: "text",
        required: true,
        placeholder: "Enter password",
        section: "Contact Information",
      },
    ],
    []
  );

  const initialFormValues = useMemo(
    () => ({
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
    }),
    []
  );

  const onSave = async (formData) => {
    const payload = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
    };

    try {
      await postData(payload, "/api/admin/parent", "Parent added successfully");
      navigate("/admin/users/parents");
    } catch (error) {
      throw error;
    }
  };
  if ( saving) return <Loader />;

  return (
    <AddPage
      title="Add Parent"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate("/admin/users/parents")}
       
      initialData={initialFormValues}
    />
  );
};

export default AddParent;