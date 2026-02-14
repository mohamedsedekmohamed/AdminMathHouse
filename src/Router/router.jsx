import { createBrowserRouter } from "react-router-dom";
import Login from "../Auth/Login";
import SaveRoute from "../Auth/SaveRoute";
import AdminLayout from "../Layout/AdminLayout";
import Home from "../pages/Home/Home";

import Admin from "../pages/Admin/Admin/Admin";
import AddAdmin from "../pages/Admin/Admin/AddAdmin";
import EditAdmin from "../pages/Admin/Admin/EditAdmin";

import Student from "../pages/Admin/Student/Student";
import AddStudent from "../pages/Admin/Student/AddStudent";
import EditStudent from "../pages/Admin/Student/EditStudent";

import Category from '../pages/Admin/Category/Category'
import AddCategory from '../pages/Admin/Category/AddCategory'
import EditCategory from '../pages/Admin/Category/EditCategory'

import Semester from '../pages/Admin/Semester/Semester'
import AddSemester from '../pages/Admin/Semester/AddSemester'
import EditSemester from '../pages/Admin/Semester/EditSemester'

import Teacher from '../pages/Admin/Teacher/Teachers'
import AddTeacher from '../pages/Admin/Teacher/AddTeachers'
import EditTeacher from '../pages/Admin/Teacher/EditTeachers'

import Parent from '../pages/Admin/Parent/Parent'
import AddParent from '../pages/Admin/Parent/AddParent'
import EditParent from '../pages/Admin/Parent/EditParent'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/admin/*",
    element: (
      <SaveRoute>
        <AdminLayout />
      </SaveRoute>
    ),
    children: [
      { index: true, element: <Home /> },

     { path: "Admin", element: <Admin /> },
      { path: "Admin/add", element: <AddAdmin /> },
      { path: "Admin/edit/:id", element: <EditAdmin /> },

      { path: "users/students", element: <Student /> },
      { path: "users/students/add", element: <AddStudent /> },
      { path: "users/students/edit/:id", element: <EditStudent /> },

      { path: "courses/categories", element: <Category /> },
      { path: "courses/categories/add", element: <AddCategory /> },
      { path: "courses/categories/edit/:id", element: <EditCategory /> },

      { path: "courses/semester", element: <Semester /> },
      { path: "courses/semester/add", element: <AddSemester /> },
      { path: "courses/semester/edit/:id", element: <EditSemester /> },

      { path: "users/teachers", element: <Teacher /> },
      { path: "users/teachers/add", element: <AddTeacher /> },
      { path: "users/teachers/edit/:id", element: <EditTeacher /> },

      { path: "users/parents", element: <Parent /> },
      { path: "users/parents/add", element: <AddParent /> },
      { path: "users/parents/edit/:id", element: <EditParent /> },


    ],
  },
]);

export default router;
