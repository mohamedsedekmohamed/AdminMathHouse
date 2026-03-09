import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";

const AddSessions = () => {
  const navigate = useNavigate();
  const { postData } = usePost("/api/admin/session");

  const { data: selectData, loading, error } = useGet("/api/admin/session/select");
  const { data: studentsRes } = useGet("/api/admin/groups/search-students");

  const groupOptions = useMemo(
    () => selectData?.data?.groups || [],
    [selectData]
  );
  const courseOptions = useMemo(
    () => selectData?.data?.courses || [],
    [selectData]
  );

  const teacherOptions = useMemo(
    () => selectData?.data?.teachers || [],
    [selectData]
  );

  const studentOptions = useMemo(
    () => studentsRes?.data || [],
    [studentsRes]
  );

  const typeOptions = [
    { value: "group", label: "Group" },
    { value: "private", label: "Private" },
  ];

  const fields = useMemo(
    () => [
      {
        name: "name",
        label: "Session Name",
        type: "text",
        required: true,
        section: "General Information",
      },
      {
        name: "sessionDate",
        label: "Session Date",
        type: "date",
        required: true,
        section: "General Information",
        helperText: "YYYY-MM-DD",
      },
      {
        name: "timeFrom",
        label: "From",
        type: "time",
        required: true,
        section: "General Information",
      },
      {
        name: "timeTo",
        label: "To",
        type: "time",
        required: true,
        section: "General Information",
      },
      // {
      //   name: "categoryId",
      //   label: "Category",
      //   type: "text", // لو عندك select للـ categories بعدين نربطه
      //   required: true,
      //   section: "Relations",
      // },
      {
        name: "courseId",
        label: "Course",
        type: "select", // نفس الفكرة
        required: true,
        options: courseOptions,
        section: "General Information",
      },
      {
        name: "lessonName",
        label: "Lesson Name",
        type: "text",
        required: true,
        section: "General Information",
      },
      {
        name: "session_link",
        label: "Session Link",
        type: "text",
          section: "Links",
      },
      {
        name: "material_link",
        label: "Material Link",
        type: "text",
        section: "Links",
      },
      {
        name: "teacher_material_link",
        label: "Teacher Material Link",
        type: "text",
        section: "Links",
      },
    

      {
        name: "type",
        label: "Type",
        type: "select",
        required: true,
        options: typeOptions,
        section: "General Information",
      },
      {
        name: "groupId",
        label: "Group",
        type: "select",
                required: true,

        options: groupOptions,
        section: "General Information",
      },
      {
        name: "teacherId",
        label: "Teacher",
        type: "select",
        required: true,
        options: teacherOptions,
        section: "General Information",
      },
      {
        name: "userIds",
        label: "Students",
        type: "multipleSelect",
        fullWidth: true,
        options: studentOptions,
        section: "Relations",
      },
    ],
    [groupOptions, teacherOptions, studentOptions]
  );

  const onSave = async (formData) => {
    const payload = {
      ...formData,
      userIds: formData.userIds || [],
    };

    await postData(payload, "/api/admin/session", "Session added successfully");
    navigate(-1);
  };

  if (loading) return <Loader />;
  if (error) return <Errorpage />;

  return (
    <AddPage
      title="Add Session"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate(-1)}
      initialData={{}}
    />
  );
};

export default AddSessions;