import React, { useState } from 'react';
import useGet from '../hooks/useGet'; 
import usePost from '../hooks/usePost';
import useDelete from '../hooks/useDelete';
import { Toaster, toast } from "react-hot-toast";

const DriveLayout = () => {
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  
  // تعديل الـ State ليشمل الـ id والنوع (ملف أو مجلد)
  const [itemToDelete, setItemToDelete] = useState(null); 

  const url = currentFolderId ? `/api/drive/folders/${currentFolderId}` : '/api/drive/folders';
  const { data, loading, error, refetch } = useGet(url);

  const { postData: createFolder, loading: creatingFolder } = usePost('/api/drive/folders');
  const { postData: uploadFile, loading: uploadingFile } = usePost('/api/drive/upload/init');
  const { deleteData, loading: isDeleting } = useDelete();

  const driveData = data?.data;

  // --- Handlers ---

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      await createFolder(
        { name: newFolderName, parentFolderId: currentFolderId }, 
        null, 
        'Folder created successfully'
      );
      setNewFolderName('');
      refetch();
    } catch (err) {}
  };

  const handleUploadFile = async (e) => {
    e.preventDefault();
    if (!newVideoTitle.trim()) return;
    try {
      await uploadFile(
        { videoTitle: newVideoTitle, folderId: currentFolderId }, 
        null, 
        'File uploaded successfully'
      );
      setNewVideoTitle('');
      refetch();
    } catch (err) {}
  };

  // دالة الحذف المعدلة لتدعم الملفات والمجلدات
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    // تحديد الـ API Endpoint بناءً على النوع
    const deleteUrl = itemToDelete.type === 'folder' 
      ? `/api/drive/folders/${itemToDelete.id}` 
      : `/api/drive/files/${itemToDelete.id}`;

    try {
      await deleteData(deleteUrl);
      // toast.success(`${itemToDelete.type === 'folder' ? 'Folder' : 'File'} deleted successfully`);
      setItemToDelete(null); // قفل الـ Popup
      refetch();
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  const handleBack = () => {
    if (driveData?.currentFolder) {
      setCurrentFolderId(driveData.currentFolder.parentFolderId);
    }
  };

  // --- UI Components ---

  if (loading && !driveData) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 w-full">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
          <p className="font-semibold">Oops! Something went wrong.</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 w-full min-h-screen font-sans text-slate-800 bg-slate-50">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {currentFolderId && (
            <button 
              onClick={handleBack}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Go Back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </button>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {driveData?.currentFolder ? driveData.currentFolder.name : "My Drive"}
          </h1>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-10 w-full">
        <form onSubmit={handleCreateFolder} className="flex-1 flex gap-2">
          <input 
            type="text" 
            placeholder="New folder name..."
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="flex-1 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none px-4 py-2.5 rounded-xl shadow-sm transition-all"
            disabled={creatingFolder}
          />
          <button 
            type="submit" 
            className="bg-white border border-slate-200 text-slate-700 font-medium px-5 py-2.5 rounded-xl hover:bg-slate-50 hover:text-indigo-600 shadow-sm transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
            disabled={creatingFolder}
          >
            New Folder
          </button>
        </form>

        <form onSubmit={handleUploadFile} className="flex-1 flex gap-2">
          <input 
            type="text" 
            placeholder="New file/video title..."
            value={newVideoTitle}
            onChange={(e) => setNewVideoTitle(e.target.value)}
            className="flex-1 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none px-4 py-2.5 rounded-xl shadow-sm transition-all"
            disabled={uploadingFile}
          />
          <button 
            type="submit" 
            className="bg-indigo-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
            disabled={uploadingFile}
          >
            Upload File
          </button>
        </form>
      </div>

      {/* Grid: Folders and Files */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
        
        {/* Folders */}
        {driveData?.folders?.map((folder) => (
          <div 
            key={folder.id}
            className="group bg-white border border-slate-200 p-5 rounded-2xl cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col gap-3"
          >
            <div className="flex items-center gap-4" onClick={() => setCurrentFolderId(folder.id)}>
                <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl group-hover:bg-indigo-100 transition-transform flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                </svg>
                </div>
                <span className="font-semibold text-slate-700 truncate">{folder.name}</span>
            </div>
            {/* زر حذف المجلد */}
            <div className="flex justify-end border-t border-slate-50 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setItemToDelete({ id: folder.id, type: 'folder', name: folder.name });
                  }}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                </button>
            </div>
          </div>
        ))}

        {/* Files */}
        {driveData?.files?.map((file) => (
          <div 
            key={file.id} 
            className="group bg-white border border-slate-200 p-5 rounded-2xl hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-slate-50 text-slate-500 rounded-xl group-hover:bg-slate-100 transition-colors flex-shrink-0">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <span className="font-medium text-slate-700 truncate mt-1" title={file.title || file.videoTitle}>
                {file.title || file.videoTitle}
              </span>
            </div>
            
            <div className="flex justify-end border-t border-slate-100 pt-3 mt-2">
              <button 
                onClick={() => setItemToDelete({ id: file.id, type: 'file', name: file.title || file.videoTitle })}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {driveData?.folders?.length === 0 && driveData?.files?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 w-full">
          <p className="text-lg font-medium">This folder is empty</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <div className="bg-red-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Delete {itemToDelete.type === 'folder' ? 'Folder' : 'File'}</h3>
            </div>
            
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete <span className="font-bold text-slate-800">"{itemToDelete.name}"</span>? 
              This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-5 py-2.5 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-sm font-medium transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriveLayout;