import React from 'react';
import ReusableTable from '@/components/ReusableTable';
import { Key } from 'lucide-react'; // مثال لأيقونة إضافية
import { useNavigate } from 'react-router-dom';
const Admin = () => {
  const navigate = useNavigate();
  const columns = [
    { header: "Full Name", key: "name" },
    { header: "Email", key: "email" },
    { header: "Role", key: "role" },
  ];

  const data = [
    { id: 1, name: "Ziad Fady", email: "ziad@example.com", role: "Super Admin" },
    { id: 2, name: "Ahmed Ali", email: "ahmed@example.com", role: "Editor" },
  ];

  const handleEdit = (row) => {
    console.log("Edit Admin:", row);
    // افتح Modal التعديل هنا
  };

  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
      console.log("Delete Admin ID:", row.id);
    }
  };

  return (
    <div className="p-6">
      <ReusableTable 
        title="Admin Management"
        titleAdd="Admin"
        columns={columns}
        data={data}
        onAddClick={() => navigate("/admin/admin/add")} 
        onEdit={handleEdit}
        onDelete={handleDelete}
          extraActions={(row) => (
          <button 
            onClick={() => console.log("Reset Password for:", row)}
            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Reset Password"
          >
            <Key className="w-4 h-4" />
          </button>
        )}
      />
    </div>
  );
};

export default Admin;