import React, { useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import AddPage from "@/components/AddPage";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import Loader from "@/components/Loader";
import Errorpage from "@/components/Errorpage";
import toast from "react-hot-toast";

const SameQuestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const lessonId = location.state?.lessonId;

  const { postData } = usePost("/api/admin/questions");

  // fetch question
  const {
    data: questionRes,
    loading: loadingQuestion,
    error: errorQuestion,
  } = useGet(`/api/admin/questions/${id}`);

  // selections
  const {
    data: Sections,
    loading: loadingSections,
    error: errorSections,
  } = useGet("/api/admin/sections/selectionSections");

  const {
    data: ExamCode,
    loading: loadingExamCode,
    error: errorExamCode,
  } = useGet("/api/admin/questions/selectionExamCode");

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

  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => {
    const y = startYear + i;
    return { value: y.toString(), label: y.toString() };
  });

  const fields = useMemo(
    () => [
      {
        name: "question",
        label: "Question",
        type: "text",
        required: true,
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
          { value: "Grid in", label: "Grid in" },
        ],
        required: true,
      section: "General Information",
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
      section: "General Information",
      },
      {
        name: "month",
        label: "Month",
        type: "select",
        options: [
          "Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec"
        ].map((m) => ({ value: m, label: m })),
        required: true,
      section: "General Information",
      },
      {
        name: "difficulty",
        label: "Difficulty",
        type: "select",
        options: ["A","B","C","D","E"].map((d) => ({
          value: d,
          label: d,
        })),
        required: true,
      section: "General Information",
      },
      {
        name: "sectionId",
        label: "Section",
        type: "select",
        options: SectionsOptions,
        required: true,
      section: "General Information",
      },
      {
        name: "year",
        label: "Year",
        type: "select",
        options: years,
        required: true,
      section: "General Information",
      },
      {
        name: "codeId",
        label: "Code",
        type: "select",
        options: ExamCodeOptions,
        required: true,
      section: "General Information",
      },
      {
        name: "options",
        label: "Answer Options",
        type: "dynamic-list",
        required: true,
        section: "Options",
        fullWidth: true,
      },
      {
        name: "correctOption",
        label: "Correct Option",
        type: "custom",
        required: true,
        section: "Options",
        render: ({ value, onChange, formData }) => {
          const count = formData.options?.length || 4;

          const letters = Array.from(
            { length: count },
            (_, i) => String.fromCharCode(65 + i)
          );

          return (
            <div className="flex gap-3 flex-wrap">
              {letters.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => onChange(l)}
                  className={`w-12 h-12 rounded-xl border-2 font-bold
                  ${
                    value === l
                      ? "bg-one text-white border-one"
                      : "bg-white border-slate-200"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          );
        },
      },
      {
        name: "answerPdf",
        label: "Answer PDF",
        type: "text",
        section: "Resources",
      },
      {
        name: "answerVideo",
        label: "Answer Video",
        type: "text",
        section: "Resources",
      },
      {
        name: "image",
        label: "Question Image (Optional)",
        type: "file",
        section: "General Information",
      },
    ],
    [SectionsOptions, ExamCodeOptions]
  );

  // clone question data
  const initialData = useMemo(() => {
    if (!questionRes?.data?.data) return {};

    const q = questionRes.data.data;

    const options = q.options?.map((o) => o.answer) || [];
    const correctOption =
      q.options?.find((o) => o.isCorrect)?.order || "";

    return {
      question: q.question || "",
      image: q.image || "",
      answerType: q.answerType || "",
      questionType: q.questionType || "",
      month: q.month || "",
      difficulty: q.difficulty || "",
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

    const { image, ...rest } = formData;

    let imageBase64;

    // لو المستخدم غيّر الصورة فقط
    if (image instanceof File) {
      imageBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });
    }

    const options = (formData.options || [])
      .map((answer, index) => ({
        answer: answer?.trim(),
        isCorrect:
          formData.correctOption ===
          String.fromCharCode(65 + index),
        order: String.fromCharCode(65 + index),
      }))
      .filter((o) => o.answer);

    if (options.length < 2) {
      toast.error("Please add at least two answer options");
      return;
    }

    const payload = {
      ...rest,
      lessonId: lessonId,
      year: Number(formData.year),
      options,
    };

    // أضف الصورة فقط لو اتغيرت
    if (imageBase64) {
      payload.image = imageBase64;
    }

    try {
      await postData(
        payload,
        "/api/admin/questions",
        "Question duplicated successfully"
      );

      navigate(-1);
    } catch (error) {
      throw error;
    }
  };

  if (loadingQuestion || loadingSections || loadingExamCode)
    return <Loader />;

  if (errorQuestion || errorSections || errorExamCode)
    return <Errorpage />;

  return (
    <AddPage
      title="Duplicate Question"
      fields={fields}
      initialData={initialData}
      onSave={onSave}
      onCancel={() => navigate(-1)}
    />
  );
};

export default SameQuestions;