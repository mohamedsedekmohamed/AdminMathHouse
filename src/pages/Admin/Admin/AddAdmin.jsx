import React from 'react'
import AddPage from '../../../components/AddPage'

const AddAdmin = () => {
  // 1. English localized teacher fields configuration
  const teacherFields = [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "Enter teacher's full name",
      section: "Personal Information",
      tooltip: "Name should match official identification documents"
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
      placeholder: "example@mathhouse.com",
      section: "Personal Information",
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      patternMessage: "Please enter a valid email address",
      helperText: "Login credentials will be sent to this email"
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text",
      required: true,
      placeholder: "01xxxxxxxxx",
      section: "Personal Information",
      pattern: /^01[0125][0-9]{8}$/,
      patternMessage: "Invalid Egyptian phone number format"
    },
    {
      name: "subject",
      label: "Subject",
      type: "select",
      required: true,
      section: "Professional Details",
      options: [
        { label: "Pure Math", value: "pure_math" },
        { label: "Applied Math", value: "applied_math" },
        { label: "Statistics", value: "stats" },
      ]
    },
    {
      name: "salary",
      label: "Basic Salary",
      type: "number",
      required: true,
      placeholder: "0.00",
      section: "Professional Details",
      helperText: "Amount in USD"
    },
    {
      name: "joinDate",
      label: "Join Date",
      type: "date",
      required: true,
      section: "Professional Details",
    },
    {
      name: "bio",
      label: "Biography",
      type: "textarea",
      fullWidth: true,
      placeholder: "Write a brief summary of the teacher's experience...",
      section: "Professional Details"
    },
    {
      name: "avatar",
      label: "Teacher Photo",
      type: "file",
      required: true,
      section: "Settings & Files"
    },
    {
      name: "is_active",
      label: "Account Status",
      type: "switch",
      defaultValue: true,
      section: "Settings & Files"
    }
  ];

  const handleSave = async (formData) => {
    console.log("Data ready for API submission:", formData);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        alert("Teacher data saved successfully!");
        resolve();
      }, 2000);
    });
  };

  const handleCancel = () => {
    console.log("Operation cancelled by user");
  };

  return (
    <AddPage 
      title="Add New Teacher"
      fields={teacherFields}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};

export default AddAdmin