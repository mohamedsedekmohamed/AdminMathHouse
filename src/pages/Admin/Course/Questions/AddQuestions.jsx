import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";
import useGet from "@/hooks/useGet";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";

const AddQuestions = () => {
  const navigate = useNavigate();
  const { postData } = usePost("/api/admin/questions");
  
  const { data: Lessons, loading: loadingLessons, error: errorLessons } = 
    useGet("/api/admin/questions/selectionLesson");
    
  const { data: ExamCode, loading: loadingExamCode, error: errorExamCode } = 
    useGet("/api/admin/questions/selectionExamCode");

  // توحيد شكل بيانات الدروس
  const LessonsOptions = useMemo(() => {
    return Lessons?.data?.data?.map(lesson => ({
      value: lesson.id,
      label: lesson.label // تأكد أن الحقل في الـ API اسمه name أو عدله هنا
    })) || [];
  }, [Lessons]);

  // توحيد شكل بيانات أكواد الامتحانات
  const ExamCodeOptions = useMemo(() => {
    return ExamCode?.data?.data?.map(code => ({
      value: code.id,
      label: code.code
    })) || [];
  }, [ExamCode]);

  const answerOrders = ["A", "B", "C", "D"];

  const fields = useMemo(() => [
    {
      name: "question",
      label: "Question",
      type: "text",
      required: true,
      placeholder: "Enter the question",
      section: "General Information",
      fullWidth: true,
    },
    {
      name: "image",
      label: "Question Image (Optional)",
      type: "file",
      section: "General Information",
    },
    {
      name: "answerType",
      label: "Answer Type",
      type: "select",
      options: [
        { value: "MCQ", label: "MCQ" },
        { value: "TrueFalse", label: "True / False" },
        { value: "Text", label: "Text" },
      ],
      required: true,
      section: "Details",
    },
    {
      name: "difficulty",
      label: "Difficulty",
      type: "select",
      options: [
        { value: "A", label: "A" },
        { value: "B", label: "B" },
        { value: "C", label: "C" },
      ],
      required: true,
      section: "Details",
    },
    {
      name: "lessonId",
      label: "Lesson",
      type: "select",
      options: LessonsOptions,
      required: true,
      section: "Relations",
    },
    {
      name: "year",
      label: "Year",
      type: "date",
      required: true,
      placeholder: "2024",
      section: "Details",
    },
    {
      name: "month",
      label: "Month",
      type: "date",
      required: true,
      placeholder: "Jan",
      section: "Details",
    },
    {
      name: "section",
      label: "Section",
      type: "text",
      required: true,
      placeholder: "1",
      section: "Details",
    },
    {
      name: "codeId",
      label: "Code",
      type: "select",
      options: ExamCodeOptions,
      required: true,
      section: "Relations",
    },
    ...answerOrders.map((order) => ({
      name: `option${order}`,
      label: `Option ${order}`,
      type: "text",
      placeholder: `Enter option ${order}`,
      section: "Options",
    })),
    {
      name: "correctOption",
      label: "Correct Option",
      type: "select",
      options: answerOrders.map(o => ({ value: o, label: o })),
      required: true,
      section: "Options",
    },
    {
      name: "answerPdf",
      label: "Answer PDF (Optional)",
      type: "text",
      section: "Resources",
    },
    {
      name: "answerVideo",
      label: "Answer Video (Optional)",
      type: "text",
      section: "Resources",
    },
  ], [LessonsOptions, ExamCodeOptions]);

  const initialFormValues = {
    question: "",
    image: "",
    answerType: "MCQ",
    difficulty: "A",
    lessonId: "",
    year: new Date().getFullYear(),
    month: "",
    section: "",
    codeId: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "A",
    answerPdf: "",
    answerVideo: "",
  };

  const onSave = async (formData) => {
    let imageBase64 = null;
    if (formData.image instanceof File) {
      imageBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(formData.image);
      });
    }

    const options = answerOrders.map(o => ({
      answer: formData[`option${o}`],
      isCorrect: formData.correctOption === o,
      order: o,
    })).filter(opt => opt.answer);

    const payload = {
      ...formData,
      image: imageBase64,
      year: Number(formData.year),
      options,
    };

    await postData(payload, "/api/admin/questions", "Question added successfully");
    toast.success("Question added successfully");
    navigate(-1);
  };

  if (loadingLessons || loadingExamCode) return <Loader />;
  if (errorLessons || errorExamCode) return <Errorpage />;

  return (
    <AddPage
      title="Add Question"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate(-1)}
      initialData={initialFormValues}
    />
  );
};

export default AddQuestions;