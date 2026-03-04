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
        fullWidth: true,
        section: "General Information",
      },
      {
        name: "sessionDate",
        label: "Session Date",
        type: "date",
        required: true,
        section: "Schedule",
        helperText: "YYYY-MM-DD",
      },
      {
        name: "timeFrom",
        label: "From",
        type: "time",
        required: true,
        section: "Schedule",
      },
      {
        name: "timeTo",
        label: "To",
        type: "time",
        required: true,
        section: "Schedule",
      },
      {
        name: "categoryId",
        label: "Category",
        type: "text", // لو عندك select للـ categories بعدين نربطه
        required: true,
        section: "Relations",
      },
      {
        name: "courseId",
        label: "Course",
        type: "text", // نفس الفكرة
        required: true,
        section: "Relations",
      },
      {
        name: "lessonName",
        label: "Lesson Name",
        type: "text",
        fullWidth: true,
        required: true,
        section: "Details",
      },
      {
        name: "type",
        label: "Type",
        type: "select",
        required: true,
        options: typeOptions,
        section: "Relations",
      },
      {
        name: "groupId",
        label: "Group",
        type: "select",
        options: groupOptions,
        section: "Relations",
      },
      {
        name: "teacherId",
        label: "Teacher",
        type: "select",
        required: true,
        options: teacherOptions,
        section: "Relations",
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