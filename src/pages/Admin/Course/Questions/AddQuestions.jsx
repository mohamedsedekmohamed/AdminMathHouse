import React, { useMemo } from "react";
import { useNavigate ,useLocation } from "react-router-dom";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";
import useGet from "@/hooks/useGet";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";

const AddQuestions = () => {
  const navigate = useNavigate();
  const { postData } = usePost("/api/admin/questions");
  const location = useLocation();
  const { lessonId } = location.state || {};
  const { data: Lessons, loading: loadingLessons, error: errorLessons } = 
    useGet("/api/admin/questions/selectionLesson");
      const { data: Sections, loading: loadingSections, error: errorSections } = useGet("/api/admin/sections/selectionSections");
    
  const { data: ExamCode, loading: loadingExamCode, error: errorExamCode } = 
    useGet("/api/admin/questions/selectionExamCode");

  // توحيد شكل بيانات الدروس
  const LessonsOptions = useMemo(() => {
    return Lessons?.data?.data?.map(lesson => ({
      value: lesson.value,
      label: lesson.label 
    })) || [];
  }, [Lessons]);
  const SectionsOptions = useMemo(() => {
    return Sections?.data?.sections?.map(s => ({
      value: s.id,
      label: s.sectionName // تأكد أن الحقل في الـ API اسمه name أو عدله هنا
    })) || [];
  }, [Sections]);

  // توحيد شكل بيانات أكواد الامتحانات
  const ExamCodeOptions = useMemo(() => {
    return ExamCode?.data?.data?.map(code => ({
      value: code.id,
      label: code.code
    })) || [];
  }, [ExamCode]);
const currentYear = new Date().getFullYear();
const startYear = 2000;

const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => {
  const y = startYear + i;
  return { value: y.toString(), label: y.toString() };
});

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
            fullWidth: true,

      section: "General Information",
    },
    {
      name: "answerType",
      label: "Answer Type",
      type: "select",
      options: [
        { value: "MCQ", label: "MCQ" },
        { value: "Grid in", label:"Grid in" },
      ],
      required: true,
      section: "Details",
    },
    {
      name: "questionType",
      label: "Question Type",
      type: "select",
      options: [
        { value: "Extra", label: "Extra" },
        { value: "Trail", label: "Trail" },
    
      ],
      required: true,
      section: "Details",
    },
    {
  name: "month",
  label: "Month",
  type: "select",
  options: [
    { value: "Jan", label: "Jan" },
    { value: "Feb", label: "Feb" },
    { value: "Mar", label: "Mar" },
    { value: "Apr", label: "Apr" },
    { value: "May", label: "May" },
    { value: "Jun", label: "Jun" },
    { value: "Jul", label: "Jul" },
    { value: "Aug", label: "Aug" },
    { value: "Sep", label: "Sep" },
    { value: "Oct", label: "Oct" },
    { value: "Nov", label: "Nov" },
    { value: "Dec", label: "Dec" },
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
        { value: "D", label: "D" },
        { value: "E", label: "E" },
      ],
      required: true,
      section: "Details",
    },
    // {
    //   name: "lessonId",
    //   label: "Lesson",
    //   type: "select",
    //   options: LessonsOptions,
    //   required: true,
    //   section: "Relations",
    // },
    {
      name: "sectionId",
      label: "Section",
      type: "select",
      options: SectionsOptions,
      required: true,
      placeholder: "Enter the section",
      section: "Details",
    },
   {
  name: "year",
  label: "Year",
  type: "select",
  options: years,
  required: true,
  section: "Details",
  fullWidth: true,
},
    {
      name: "codeId",
      label: "Code",
      type: "select",
      options: ExamCodeOptions,
      required: true,
      section: "Relations",
    },
   {
      name: "options", 
      label: "Answer Options",
      type: "dynamic-list", 
      required: true,
      section: "Options",
      helperText: "Add as many options as you need.",
      fullWidth: true, // لتأخذ عرض الشاشة
    },
  {
      name: "correctOption",
      label: "Correct Option",
      type: "custom", // غيرنا النوع هنا
      required: true,
      section: "Options",
      
      // دالة الرسم (Render Function)
      render: ({ value, onChange, formData, error }) => {

        const currentOptionsCount = formData.options?.length || 4;
        const availableLetters = Array.from({ length: currentOptionsCount }, (_, i) => String.fromCharCode(65 + i));

        return (
          <div className="flex flex-wrap gap-3">
            {availableLetters.map((letter) => {
              const isSelected = value === letter;
              return (
                <button
                  key={letter}
                  type="button" // ضروري جداً عشان الفورم ميعملش Submit
                  onClick={() => onChange(letter)}
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-200 border-2
                    ${isSelected 
                      ? "bg-one text-white border-one shadow-lg scale-110" // ستايل المختار
                      : "bg-white text-slate-500 border-slate-200 hover:border-one/50 hover:bg-slate-50" // ستايل العادي
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
    {
      name: "answerPdf",
      label: "Answer PDF (Optional)",
      type: "text",
      section: "Resources",
      helperText: "Enter the PDF URL",
    },
    {
      name: "answerVideo",
      label: "Answer Video (Optional)",
      type: "text",
      section: "Resources",
      helperText: "Enter the video URL",
    },
  ], [LessonsOptions, ExamCodeOptions]);

  const initialFormValues = {
    question: "",
    image: "",
    answerType: "",
    difficulty: "",
    lessonId: "",
    year: "",
    month: "",
    sectionId: "",
    codeId: "",
   options: ["", "", "", ""], 
    correctOption: "",
    answerPdf: "",
    answerVideo: "",
  };

 const onSave = async (formData) => {
  // تحويل الصورة Base64 لو موجودة
  let imageBase64 = null;
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
    .filter(opt => opt.answer); // يشيل الفاضي

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
    lessonId: lessonId,
    options,
  };

  if (imageBase64) {
    payload.image = imageBase64;
  }

  try {
    await postData(payload, `/api/admin/questions`, "Question added successfully");
    toast.success("Question added successfully");
    navigate(-1);
  } catch (error) {

    throw error;
  }
};
  if (loadingLessons || loadingExamCode ||loadingSections) return <Loader />;
  if (errorLessons || errorExamCode || errorSections) return <Errorpage />;

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