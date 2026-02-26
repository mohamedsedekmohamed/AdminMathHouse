import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";

const AddPopup = () => {
  const navigate = useNavigate();
  const {
    postData,
    loading: saving,
    error: postError,
  } = usePost("/api/admin/popup");

 
  const fields = useMemo(
    () => [
      {
        name: "name",
        label: "Popup Name",
        type: "text",
        required: true,
        fullWidth: true,
        placeholder: "Enter popup name",
        section: "Popup Information",
      },
      {
        name: "destination",
        label: "Destination",
        type: "select",
        fullWidth: true,
        options: [
          { value: "student", label: "Student" },
          { value: "parent", label: "Parent" },
          { value: "teacher", label: "Teacher" },
        ],
        required: true,
        section: "Popup Information",
      },
      {
        fullWidth: true,
        name: "image",
        label: "Popup Image",
        type: "file",
        required: true,
        section: "Popup Information",
        helperText: "Upload an image (PNG/JPG)",
      },
      {
        name:"isActive",
        label:"Active",
        type:"switch",
        section:"Popup Information"
      },
      {
        name: "startDate",
        label: "Start Date",
        type: "datemin",
        required: true,
        section: "Popup Duration",
      },
      {
        name: "endDate",
        label: "End Date",
        type: "datemin",
        required: true,
        section: "Popup Duration",
      },
    ],
    [],
  );

  // 👇 البيانات الأولية للفورم
  const initialFormValues = useMemo(
    () => ({
      name: "",
      image: "",
      isActive: false,
      destination: "",
      startDate: "",
      endDate: "",
    }),
    [],
  );
 const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  const onSave = async (formData) => {
   if(formData.startDate > formData.endDate) {
    toast.error("Start date must be before end date");
    return;
   }
 let imageBase64 = null;
    if (formData.image instanceof File) {
      imageBase64 = await fileToBase64(formData.image);
    }

    const payload = {
      name: formData.name,
      image: imageBase64, // تأكد إن FileUpload يحولها إلى Base64
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    try {
      await postData(payload, "/api/admin/popup", "Popup added successfully");
      navigate("/admin/marketing/popup");
    } catch (error) {
      throw error; // الخطأ سيتم التعامل معه بواسطة usePost
    }
  };


  return (
    <AddPage
      title="Add Popup"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate("/admin/marketing/popup")}
      initialData={initialFormValues}
      loading={saving}
    />
  );
};

export default AddPopup;
