import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Upload, AlertCircle, Info } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

const AddPage = ({ title, fields, onSave, onCancel, initialData }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState({});
  
  // Initialize default data
  const [formData, setFormData] = useState(() => 
    fields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue ?? '' }), {})
  );

  // Dirty Check (to detect unsaved changes)
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData || fields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue ?? '' }), {}));
useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
      
      const newPreviews = {};
      // يمكنك استخدام fields هنا دون وضعها في مصفوفة الاعتماديات 
      // أو الاكتفاء بالـ initialData
      Object.keys(initialData).forEach(key => {
        // افتراض: لو في داتا جاية كـ string وصورتها محفوظة
        if (typeof initialData[key] === 'string' && initialData[key].includes('http')) {
           newPreviews[key] = initialData[key];
        }
      });
      setPreviews(newPreviews);
    }
  // ✅ احذف fields من هنا لتجنب مسح الفورم عند جلب الـ roles
  }, [initialData]);

  // --- Validation Logic (Translated) ---
  const validateField = useCallback((field, value) => {
    let error = "";
    if (field.required && (!value || value.toString().trim() === "")) {
      error = field.requiredMessage || "This field is required";
    } else if (value && field.type === "number" && isNaN(value)) {
      error = "Must be a valid number";
    } else if (value && field.pattern && !field.pattern.test(value)) {
      error = field.patternMessage || "Invalid format";
    } else if (field.customValidator) {
      const customError = field.customValidator(value, formData);
      if (customError) error = customError;
    }
    if (
  field.required &&
  (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  )
) {
  error = field.requiredMessage || "This field is required";
}

    return error;
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    fields.forEach(field => {
      if (typeof field.hidden === "function" && field.hidden(formData)) return;
      const error = validateField(field, formData[field.name]);
      if (error) newErrors[field.name] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e, name) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [name]: file }));
      setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to exit?")) onCancel();
    } else {
      onCancel();
    }
  };

  // Group fields by section
  const sections = fields.reduce((acc, field) => {
    const sectionName = field.section || "General Information";
    if (!acc[sectionName]) acc[sectionName] = [];
    acc[sectionName].push(field);
    return acc;
  }, {});

  return (
    <div className="p-1 md:p-2 bg-[#f8fafc] min-h-screen text-left" dir="ltr">
      {/* Header */}
      <div className=" mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{title}</h1>
          <p className="text-slate-500 mt-1">Please fill in the required information accurately.</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center w-fit gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      <form
       onSubmit={async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await onSave(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }}
        className=" mx-auto space-y-8"
      >
        {Object.entries(sections).map(([sectionTitle, sectionFields]) => (
          <div key={sectionTitle} className="bg-white rounded-2xl shadow-sm border border-slate-100 ">
            <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-700">{sectionTitle}</h2>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-left">
              {sectionFields.map((field) => {
                if (typeof field.hidden === "function" && field.hidden(formData)) return null;

                return (
                  <div key={field.name} className={`flex flex-col gap-1.5 ${field.fullWidth ? 'md:col-span-2' : ''}`}>
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1 justify-start">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                      {field.tooltip && <Info size={14} className="text-slate-400 cursor-help" title={field.tooltip} />}
                    </label>

                    {/* Inputs logic */}
                    {['text', 'email', 'password'].includes(field.type) && (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] || ''}
                        placeholder={field.placeholder}
                        className={`p-3 rounded-xl border bg-slate-50/30 focus:ring-4 focus:ring-one/10 outline-none transition-all ${errors[field.name] ? 'border-red-400' : 'border-slate-200 focus:border-one'}`}
                        onChange={handleChange}
                      />
                    )}
                  
      {['number'].includes(field.type) && (
  <input
    min={0}
    type={field.type}
    name={field.name}
    value={formData[field.name] || ''}
    placeholder={field.placeholder}
    className={`
      appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none 
      no-spinner p-3 rounded-xl border bg-slate-50/30 focus:ring-4 focus:ring-one/10 outline-none transition-all ${
      errors[field.name]
        ? 'border-red-400'
        : 'border-slate-200 focus:border-one'
    }`}
    onChange={handleChange}
  />
)}
{['numberdecimal'].includes(field.type) && (
  <input
    min={0}
    step="any"        // هنا
    type="number"     // type لازم يكون "number"
    name={field.name}
    value={formData[field.name] || ''}
    placeholder={field.placeholder}
    className={`
      appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none 
      no-spinner p-3 rounded-xl border bg-slate-50/30 focus:ring-4 focus:ring-one/10 outline-none transition-all ${
        errors[field.name]
          ? 'border-red-400'
          : 'border-slate-200 focus:border-one'
      }`}
    onChange={handleChange}
  />
)}  


{field.type === "multipleSelect" && (
  <Select
    isMulti
    name={field.name}
    options={field.options} // [{ value: '1', label: 'Option 1' }]
value={
  Array.isArray(formData[field.name])
    ? field.options.filter(opt => formData[field.name].includes(opt.value))
    : []
}
    onChange={(selected) => {
      const values = selected ? selected.map(opt => opt.value) : [];
      setFormData(prev => ({ ...prev, [field.name]: values }));
      if (errors[field.name]) setErrors(prev => ({ ...prev, [field.name]: "" }));
    }}
    className="basic-multi-select"
    classNamePrefix="select"
  styles={{
    control: (provided) => ({
      ...provided,
      backgroundColor: "var(--color-two)", // خلفية الصندوق
      borderColor: "var(--color-one)",     // لون الحدود
      borderRadius: "0.75rem",
      padding: "0.25rem",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "var(--color-three)" // عند المرور بالماوس
        : "var(--color-two)",  // الخلفية العادية
      color: "var(--color-one)", // لون النص
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "var(--color-four)", // خلفية القيمة المختارة
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "var(--color-two)", // نص القيمة المختارة
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "var(--color-two)", // لون علامة الإزالة
      ":hover": {
        backgroundColor: "var(--color-one)",
        color: "var(--color-two)",
      },
    }),
  }}
  />
)}
                    {field.type === "date" && (
                      <DatePicker
                        selected={formData[field.name] ? new Date(formData[field.name]) : null}
                        onChange={(date) => setFormData(prev => ({ ...prev, [field.name]: date ? date.toISOString() : "" }))}
                        dateFormat="yyyy-MM-dd"
                        placeholderText={field.placeholder}
                        className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:border-one focus:ring-4 focus:ring-one/10 outline-none"
                      />
                    )}

                    {field.type === 'select' && (
                      <select
                        name={field.name}
                        value={formData[field.name] || ''}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:border-one outline-none cursor-pointer"
                        onChange={handleChange}
                      >
                        <option value="">Select from list...</option>
                        {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    )}

                    {field.type === 'file' && (
                      <div className={`relative group border-2 border-dashed rounded-xl p-4 transition-all ${previews[field.name] ? 'border-one bg-one/5' : 'border-slate-200 hover:border-one/50'}`}>
                        <input 
                          type="file" 
                          onChange={(e) => handleFileChange(e, field.name)} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className="flex items-center gap-4 text-left">
                          {previews[field.name] ? (
                            <img src={previews[field.name]} alt="preview" className="w-16 h-16 rounded-lg object-cover ring-2 ring-white shadow-md" />
                          ) : (
                            <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-one transition-colors">
                              <Upload size={24} />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-600">Click to upload or drag and drop</span>
                            <span className="text-xs text-slate-400">PNG, JPG up to 5MB</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {field.type === 'switch' && (
                      <div className="flex items-center gap-3 py-2 justify-start">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, [field.name]: !prev[field.name] }))}
                          className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${formData[field.name] ? "bg-one" : "bg-slate-300"}`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${formData[field.name] ? "translate-x-6" : "translate-x-0"}`} />
                        </button>
                        <span className="text-sm text-slate-600 font-medium">{formData[field.name] ? 'Active' : 'Inactive'}</span>
                      </div>
                    )}

                    {/* Helper Text & Errors */}
                    {field.helperText && !errors[field.name] && (
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 justify-start">
                        <Info size={12} /> {field.helperText}
                      </p>
                    )}
                    {errors[field.name] && (
                      <p className="text-xs text-red-500 font-medium flex items-center gap-1 justify-start">
                        <AlertCircle size={14} /> {errors[field.name]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pb-12">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-8 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-12 py-3 bg-one text-white rounded-xl font-bold shadow-xl shadow-one/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 flex items-center gap-3"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPage;