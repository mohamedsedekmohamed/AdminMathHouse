import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";
import useGet from "@/hooks/useGet";

const AddExam = () => {
  const navigate = useNavigate();
  const { postData, loading: saving } = usePost();
  
  // جلب Raw Scores لاختيارها
  const { data: rawScoresRes, loading: loadingRawScores, error: errorRawScores } = useGet("/api/admin/rawScore");

  const rawScoreOptions = useMemo(() => {
    return (
      rawScoresRes?.data?.rawScores?.map((r) => ({
        value: r.id,
        label: r.name,
      })) || []
    );
  }, [rawScoresRes]);

  const fields = useMemo(() => [
    {
      name: "title",
      label: "Exam Title",
      type: "text",
      required: true,
      placeholder: "Enter exam title",
      section: "General Information",
    },
    {
      name: "description",
      label: "Description (Optional)",
      type: "text",
      placeholder: "Enter description",
      section: "General Information",
      fullWidth: true,
    },
    {
      name: "duration",
      label: "Duration (minutes)*",
      type: "number",
      required: true,
      placeholder: "60",
      section: "Details",
    },
    {
      name: "rawScoreId",
      label: "Raw Score Rule*",
      type: "select",
      required: true,
      options: rawScoreOptions,
      section: "Details",
    },
    {
      name: "numberOfQuestions",
      label: "Number of Questions*",
      type: "number",
      required: true,
      placeholder: "20",
      section: "Details",
    },
    {
      name: "passScore",
      label: "Passing Score*",
      type: "number",
      required: true,
      placeholder: "70",
      section: "Details",
    },
    {
      name: "isActive",
      label: "Active",
      type: "switch",
      section: "General Information",
    },
    {
      name: "questionIds",
      label: "Question IDs (Optional)",
      type: "text",
      placeholder: "Comma separated UUIDs",
      section: "Details",
      helperText: "Enter question UUIDs separated by commas",
    },
  ], [rawScoreOptions]);

  const initialFormValues = useMemo(() => ({
    title: "",
    description: "",
    duration: "",
    rawScoreId: "",
    numberOfQuestions: "",
    passScore: "",
    isActive: false,
    questionIds: "",
  }), []);

  const onSave = async (formData) => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description || "",
        duration: Number(formData.duration),
        rawScoreId: formData.rawScoreId,
        numberOfQuestions: Number(formData.numberOfQuestions),
        passScore: Number(formData.passScore),
        isActive: formData.isActive,
        questionIds: formData.questionIds
          ? formData.questionIds.split(",").map((q) => q.trim())
          : [],
      };

      await postData(payload, "/api/admin/diagnosticExam", "Exam added successfully");
      toast.success("Exam added successfully");
      navigate("/admin/diagnosticExam");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add exam");
    }
  };

  if (loadingRawScores) return <Loader />;
  if (errorRawScores) return <Errorpage />;

  return (
    <AddPage
      title="Add Exam"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate(-1)}
      initialData={initialFormValues}
    />
  );
};

export default AddExam;