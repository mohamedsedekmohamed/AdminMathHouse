  import { useNavigate, useParams } from "react-router-dom";
  import ReusableTable from "@/components/ReusableTable";
  import useGet from "@/hooks/useGet";
  import React, { useMemo, useState } from "react";
  import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
  import useDelete from "@/hooks/useDelete";
  import NavChild from "@/components/NavChild";
  import Loader from "@/components/Loader";
  import Errorpage from "@/components/Errorpage";
  import usePost from "@/hooks/usePost";
import { GiTeacher } from "react-icons/gi";
import { PiExamFill } from "react-icons/pi";

  const Courses = () => {
    const navigate = useNavigate();
    const { categoryId } = useParams();

    const { data, loading, refetch, error } = useGet(
      `/api/admin/courses/category/${categoryId}`
    );
const [optionPopup, setOptionPopup] = useState({ open: false, row: null });

    const { data: teachersData, loading: teachersLoading } = useGet(
      "/api/admin/teacher"
    );

    const teachers = teachersData?.data?.teacher || [];

    const { deleteData, loading: deleteLoading } = useDelete();
    const { postData, loading: addTeacherLoading } = usePost();

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openTeacherModal, setOpenTeacherModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedTeacherId, setSelectedTeacherId] = useState("");

    const handleDelete = (row) => {
      setSelectedRow(row);
      setOpenDeleteModal(true);
    };

    const confirmDelete = async () => {
      try {
        await deleteData(`/api/admin/courses/${selectedRow.id}`);
        setOpenDeleteModal(false);
        setSelectedRow(null);
        refetch();
      } catch (e) {
          throw e
      }
    };

  const handleRemoveTeacher = async (courseId, teacherId) => {
    try {
      await deleteData(`/api/admin/courses/${courseId}/teachers/${teacherId}`);

    
      setSelectedRow((prev) => ({
        ...prev,
        teachers: prev.teachers.filter(
          (t) => t.teacherId !== teacherId
        ),
      }));

      refetch(); 
    } catch (err) {
      console.error(err);
    }
  };

    const handleAddTeacher = async (courseId, teacherId) => {
  try {
    await postData(
      { teacherId },
      `/api/admin/courses/${courseId}/teachers`,
      "Teacher added successfully"
    );

    const addedTeacher = teachers.find((t) => t.id === teacherId);

    if (addedTeacher) {
      setSelectedRow((prev) => ({
        ...prev,
        teachers: [
          ...(prev.teachers || []),
          {
            teacherId: addedTeacher.id,
            name: addedTeacher.name,
            email: addedTeacher.email,
            avatar: addedTeacher.avatar,
          },
        ],
      }));
    }

    setSelectedTeacherId("");
    refetch();
  } catch (err) {
    console.error(err);
  }
};

    const columns = [
      {
        header: "Image",
        key: "image",
        render: (value) => (
          <img
            src={value || "/placeholder.png"}
            alt="course"
            className="w-12 h-12 object-cover rounded-md border bg-gray-100"
          />
        ),
      },
      { header: "Name", key: "name" },
      { header: "Description", key: "description" },
      { header: "Price", key: "price" },
      { header: "Discount", key: "discount" },
      { header: "Total Price", key: "totalPrice" },
      { header: "Duration", key: "duration" },
      { header: "isHaveSemester", key: "isHaveSemester" },
    ];

    const tableData = useMemo(() => {
      return (
        data?.data?.data?.map((course) => ({
          id: course.id,
          name: course.name,
          description: course.description,
          price: course.price,
          discount: course.discount,
          totalPrice: course.totalPrice,
          duration: course.duration,
          semesterName: course.semester?.name || "—",
          image: course.image,
          teachers: course.teachers,
          isHaveSemester: course.isHaveSemester,
          raw: course,
        })) || []
      );
    }, [data]);

    const handleEdit = (row) => {
      navigate(`/admin/courses/courses/edit/${row.id}`);
    };

    const assignedTeacherIds =
      selectedRow?.teachers?.map((t) => t.teacherId) || [];

    const availableTeachers = teachers.filter(
      (teacher) => !assignedTeacherIds.includes(teacher.id)
    );

    if (loading) return <Loader />;
    if (error) return <Errorpage />;

    return (
      <div>
        <ReusableTable
          title="Courses"
          titleAdd="Course"
          columns={columns}
          data={tableData}
          loading={loading || deleteLoading}
          onAddClick={() =>
            navigate(`/admin/courses/courses/add`, { state: { categoryId } })
          }
          onEdit={handleEdit}
          onDelete={handleDelete}
          extraActions={(row) => (
            <div className="flex gap-2">
              {row.isHaveSemester 
              ?( <NavChild route={`/admin/courses/semester/${row.id}`} />):(
                <NavChild route={`/admin/courses/chapters/${row.id}`} />
              )}
              <button
                onClick={() => {
                  setSelectedRow(row);
                  setSelectedTeacherId("");
                  setOpenTeacherModal(true);
                }}
              
              >
                <GiTeacher   className="px-1 py-1 text-3xl rounded bg-one text-white hover:bg-one/80"/> 


              </button>
        <button
  onClick={() => setOptionPopup({ open: true, row })}
  className="
    relative flex items-center justify-center p-2.5 
    text-black
    rounded-xl shadow-md hover:shadow-red-500/50 
    transition-all duration-300 ease-in-out
    hover:scale-105 active:scale-95 group
  "
>
  {/* الأيقونة */}
  <span className="relative z-10 text-xl drop-shadow-sm transition-transform duration-300 group-hover:rotate-6">
    <PiExamFill />
  </span>

  {/* طبقة إضاءة داخلية خفيفة */}
  <span className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></span>
</button>
            </div>
          )}
        />

        <ConfirmDeleteModal
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Delete Course"
          description={`Are you sure you want to delete "${selectedRow?.name}" ?`}
        />

    {openTeacherModal && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-5">
        <h2 className="text-lg font-semibold text-one mb-4">Manage Teachers</h2>

        {/* Assigned Teachers */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Assigned Teachers</h3>

          {selectedRow?.teachers?.length ? (
            <div className="flex flex-col gap-2 max-h-40 overflow-auto">
              {selectedRow.teachers.map((teacher) => (
                <div
                  key={teacher.teacherId}
                  className="flex items-center gap-2 border rounded p-2"
                >
                  <img
                    src={teacher.avatar || "/placeholder.png"}
                    alt={teacher.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />

                  <div className="flex-1 text-sm">
                    <p className="font-medium">{teacher.name}</p>
                    <p className="text-xs text-gray-500">{teacher.email}</p>
                  </div>

     <button
  disabled={deleteLoading}
  onClick={() => handleRemoveTeacher(selectedRow.id, teacher.teacherId)}
  className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md font-medium
    ${deleteLoading ? "bg-red-300 text-white cursor-not-allowed" : "bg-one hover:bg-one/80 text-white"}`}
>
  {deleteLoading ? (
    // دائرة التحميل أثناء الحذف
    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
  ) : (
    "Remove"
  )}
</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No teachers assigned yet</p>
          )}
        </div>

        {/* Available Teachers */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Add Teacher</h3>

          {teachersLoading ? (
            <p>Loading teachers...</p>
          ) : (
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select teacher</option>

              {availableTeachers.length ? (
                availableTeachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} – {teacher.email}
                  </option>
                ))
              ) : (
                <option disabled value="">
                  No available teachers
                </option>
              )}
            </select>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setOpenTeacherModal(false)}
            className="px-4 py-2 text-sm rounded border"
          >
            Close
          </button>

          <button
            disabled={!selectedTeacherId || addTeacherLoading}
            onClick={async () => {
              await handleAddTeacher(selectedRow.id, selectedTeacherId);
              setSelectedTeacherId("");
            }}
            className="px-4 py-2 text-sm rounded bg-one text-white disabled:opacity-50"
          >
            {addTeacherLoading ? "Adding..." : "Add Teacher"}
          </button>
        </div>
      </div>
    </div>
  )}
  {optionPopup.open && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg w-full max-w-sm p-5">
      <h2 className="text-lg font-semibold mb-4">Choose an Option</h2>
      <div className="flex flex-col gap-3">

        {/* Exam */}
        <button
          className="px-4 py-2 rounded bg-one text-white hover:bg-one/80"
          onClick={() => {
            navigate(`/admin/courses/exam/${optionPopup.row.id}`);
            setOptionPopup({ open: false, row: null });
          }}
        >
          Exam
        </button>

        {/* Diagnostic Exam */}
        <button
          className="px-4 py-2 rounded bg-one text-white hover:bg-one/80"
          onClick={() => {
            navigate(`/admin/courses/diagnosticexam/${optionPopup.row.id}`);
            setOptionPopup({ open: false, row: null });
          }}
        >
          Diagnostic Exam
        </button>
      </div>

      {/* Close button */}
      <button
        onClick={() => setOptionPopup({ open: false, row: null })}
        className="mt-4 px-4 py-2 rounded border"
      >
        Close
      </button>
    </div>
  </div>
)}
      </div>
    );
  };

  export default Courses;