import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import AddPage from "@/components/AddPage";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";

const EditQuestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { putData, loading: saving } = usePut(`/api/admin/questions/${id}`);

  // Fetch existing question
  const {
    data: questionRes,
    loading: loadingQuestion,
    error: errorQuestion,
  } = useGet(`/api/admin/questions/${id}`);

  // Fetch selection data
  const { data: Lessons, loading: loadingLessons, error: errorLessons } =
    useGet("/api/admin/questions/selectionLesson");
  const { data: Sections, loading: loadingSections, error: errorSections } =
    useGet("/api/admin/sections/selectionSections");
  const { data: ExamCode, loading: loadingExamCode, error: errorExamCode } =
    useGet("/api/admin/questions/selectionExamCode");

  // Prepare select options
  const LessonsOptions = useMemo(
    () =>
      Lessons?.data?.data?.map((lesson) => ({
        value: lesson.value,
        label: lesson.label,
      })) || [],
    [Lessons]
  );

  const SectionsOptions = useMemo(
    () =>
      Sections?.data?.sections?.map((s) => ({
        value: s.id,
        label: s.sectionName,
      })) || [],
    [Sections]
  );

  const ExamCodeOptions = useMemo(
    () =>
      ExamCode?.data?.data?.map((code) => ({
        value: code.id,
        label: code.code,
      })) || [],
    [ExamCode]
  );

  const currentYear = new Date().getFullYear();
  const startYear = 2000;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => {
      const y = startYear + i;
      return { value: y.toString(), label: y.toString() };
    }
  );

  const answerOrders = ["A", "B", "C", "D"];

  const fields = useMemo(
    () => [
      { name: "question", label: "Question", type: "text", required: true, section: "General Information", fullWidth: true },
      { name: "image", label: "Question Image (Optional)", type: "file", section: "General Information" },
      { name: "answerType", label: "Answer Type", type: "select", options: [{ value: "MCQ", label: "MCQ" }, { value: "Grid in", label:"Grid in" }], required: true, section: "Details" },
      { name: "questionType", label: "Question Type", type: "select", options: [{ value: "Extra", label: "Extra" }, { value: "Trail", label: "Trail" }], required: true, section: "Details" },
      { name: "month", label: "Month", type: "select", options: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m => ({ value: m, label: m })), required: true, section: "Details" },
      { name: "difficulty", label: "Difficulty", type: "select", options: ["A","B","C","D","E"].map(d => ({ value: d, label: d })), required: true, section: "Details" },
      { name: "lessonId", label: "Lesson", type: "select", options: LessonsOptions, required: true, section: "Relations" },
      { name: "sectionId", label: "Section", type: "select", options: SectionsOptions, required: true, section: "Details" },
      { name: "year", label: "Year", type: "select", options: years, required: true, section: "Details", fullWidth: true },
      { name: "codeId", label: "Code", type: "select", options: ExamCodeOptions, required: true, section: "Relations" },
    {
  name: "options", 
  label: "Answer Options",
  type: "dynamic-list", 
  required: true,
  section: "Options",
  helperText: "Add as many options as you need.",
  fullWidth: true,
},
{
  name: "correctOption",
  label: "Correct Option",
  type: "custom",
  required: true,
  section: "Options",
  render: ({ value, onChange, formData, error }) => {
    const currentOptionsCount = formData.options?.length || 4;
    const availableLetters = Array.from(
      { length: currentOptionsCount },
      (_, i) => String.fromCharCode(65 + i)
    );

    return (
      <div className="flex flex-wrap gap-3">
        {availableLetters.map((letter) => {
          const isSelected = value === letter;
          return (
            <button
              key={letter}
              type="button"
              onClick={() => onChange(letter)}
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-200 border-2
                ${isSelected 
                  ? "bg-one text-white border-one shadow-lg scale-110"
                  : "bg-white text-slate-500 border-slate-200 hover:border-one/50 hover:bg-slate-50"
                }
                ${error ? "border-red-500" : ""}
              `}
            >
              {letter}
            </button>
          );
        })}
      </div>
    );
  },
},
      { name: "answerPdf", label: "Answer PDF (Optional)", type: "text", section: "Resources", helperText: "Enter the PDF URL" },
      { name: "answerVideo", label: "Answer Video (Optional)", type: "text", section: "Resources", helperText: "Enter the video URL" },
    ],
    [LessonsOptions, SectionsOptions, ExamCodeOptions]
  );

  const initialData = useMemo(() => {
    if (!questionRes?.data?.data) return {};
    const q = questionRes.data.data;
const options = q.options?.map(opt => opt.answer) || [];
const correctOption = q.options?.find(opt => opt.isCorrect)?.order || "";

return {
  question: q.question || "",
  image: q.image || "",
  answerType: q.answerType || "",
  questionType: q.questionType || "",
  month: q.month || "",
  difficulty: q.difficulty || "",
  lessonId: q.lessonId || "",
  sectionId: q.section?.id || "",
  year: q.year?.toString() || "",
  codeId: q.codeId || "",
  options,
  correctOption,
  answerPdf: q.pdf || "",
  answerVideo: q.video || "",
};
  }, [questionRes]);

const onSave = async (formData) => {
  // تحويل الصورة Base64 لو المستخدم غيّرها
  let imageBase64 = formData.image;
  if (formData.image instanceof File) {
    imageBase64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(formData.image);
    });
  }

  // تجهيز الـ Options من dynamic-list
  const options = (formData.options || [])
    .map((answer, index) => ({
      answer: answer?.trim(),
      isCorrect: formData.correctOption === String.fromCharCode(65 + index),
      order: String.fromCharCode(65 + index),
    }))
    .filter(opt => opt.answer);

  // 🛑 Validation قبل الإرسال
  if (options.length < 2) {
  toast.error("Please add at least two answer options");
  return;
}

if (!formData.correctOption) {
  toast.error("Please select the correct answer");
  return;
}

const hasCorrect = options.some(opt => opt.isCorrect);
if (!hasCorrect) {
  toast.error("The correct answer must be one of the provided options");
  return;
}

  const numyear = Number(formData.year);
  const { year, ...rest } = formData;

  const payload = {
    ...rest,
    year: numyear,
    image: imageBase64,
    options,
  };

  try {
    await putData(payload, `/api/admin/questions/${id}`, "Question updated successfully");
    toast.success("Question updated successfully");
    navigate(-1);
  } catch (error) {
    toast.error("Failed to update question");
    console.error(error);
  }
};

  if (loadingQuestion || loadingLessons || loadingSections || loadingExamCode) return <Loader />;
  if (errorQuestion || errorLessons || errorSections || errorExamCode) return <Errorpage />;

  return (
    <AddPage
      title="Edit Question"
      fields={fields}
      onSave={onSave}
      onCancel={() => navigate(-1)}
      initialData={initialData}
    />
  );
};

export default EditQuestions;