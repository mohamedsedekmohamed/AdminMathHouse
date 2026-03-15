import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import LessonSelectionRow from "./LessonSelectionRow"; // تأكد من المسار الصحيح

const HierarchicalLessonSelector = ({ value, onChange }) => {
  // بنية الصفوف: كل عنصر هو مصفوفة من الـ IDs المختارة في ذلك الصف
  const [rows, setRows] = useState([[]]); 

  const handleUpdateRow = (index, selectedIds) => {
    const newRows = [...rows];
    newRows[index] = selectedIds;
    setRows(newRows);
    
    // دمج كل الـ IDs من كل الصفوف في مصفوفة واحدة بدون تكرار
    const allIds = Array.from(new Set(newRows.flat()));
    onChange(allIds); // إرسال المصفوفة النهائية للفورم (lessonIds)
  };

  const addRow = () => setRows([...rows, []]);

  const removeRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
    onChange(Array.from(new Set(newRows.flat())));
  };

  return (
    <div className="space-y-4 w-full">
      {rows.map((rowIds, index) => (
        <LessonSelectionRow
          key={index}
          index={index}
          onUpdate={handleUpdateRow}
          onRemove={removeRow}
          isOnlyOne={rows.length === 1}
        />
      ))}

      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-one/30 text-one rounded-2xl hover:bg-one/5 transition-all font-bold text-sm"
      >
        <Plus size={18} />
        Add Another Lesson Group
      </button>
    </div>
  );
};

export default HierarchicalLessonSelector;