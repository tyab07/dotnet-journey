import { useState, useEffect } from "react";
import {
  getDocumentationsByEmployeeId,
  uploadDocumentFile,
  addDocumentation,
  deleteDocumentation,
  downloadDocumentUrl,
} from "../api/documentationService";
import { getAllEmployees } from "../api/employeeService";
import { useAuth } from "../context/AuthContext";

const EMPTY_FORM = {
  documentName: "",
  documentNumber: "",
  expiryDate: "",
  file: null,
};

function EmployeeDocumentation() {
  const { getRole } = useAuth();
  const role = getRole();
  const isAdmin = role === "Admin" || role === "SuperAdmin";

  const [employees, setEmployees]   = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [empDocs, setEmpDocs]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [docsLoading, setDocsLoading] = useState(false);
  const [error, setError]           = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm]             = useState(EMPTY_FORM);
  const [formError, setFormError]   = useState("");
  const [saving, setSaving]         = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    getAllEmployees()
      .then((res) => {
        setEmployees((res?.data ?? res) ?? []);
      })
      .catch(() => setError("Failed to load employees."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedEmp) {
      setEmpDocs([]);
      return;
    }
    setDocsLoading(true);
    getDocumentationsByEmployeeId(selectedEmp.id)
      .then(setEmpDocs)
      .catch(() => alert("Failed to load employee documents."))
      .finally(() => setDocsLoading(false));
  }, [selectedEmp]);

  const filteredEmployees = employees.filter((emp) =>
    emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setForm((prev) => ({ ...prev, file: e.dataTransfer.files[0] }));
    }
  };

  const handlePaste = (e) => {
    if (e.clipboardData.files && e.clipboardData.files[0]) {
      setForm((prev) => ({ ...prev, file: e.clipboardData.files[0] }));
    }
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm((prev) => ({ ...prev, file: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!selectedEmp) { setFormError("No employee selected."); return; }
    if (!form.documentName) { setFormError("Document name is required."); return; }
    if (!form.documentNumber) { setFormError("Document number is required."); return; }
    if (!form.file) { setFormError("Please select or paste/drag a file."); return; }

    setSaving(true);
    setFormError("");
    setUploadProgress("Uploading file...");

    try {
      const uploadRes = await uploadDocumentFile(form.file);
      if (!uploadRes.success) throw new Error(uploadRes.message);

      setUploadProgress("Saving record...");
      await addDocumentation({
        employeeId: selectedEmp.id,
        documentName: form.documentName,
        documentNumber: form.documentNumber,
        filePath: uploadRes.filePath,
        expiryDate: form.expiryDate || null,
      });

      setForm(EMPTY_FORM);
      setUploadProgress("");

      const docsRes = await getDocumentationsByEmployeeId(selectedEmp.id);
      setEmpDocs(docsRes);
    } catch (err) {
      setFormError(err?.response?.data?.message || err.message || "Failed to save document.");
    } finally {
      setSaving(false);
      setUploadProgress("");
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await deleteDocumentation(docId);
      const docsRes = await getDocumentationsByEmployeeId(selectedEmp.id);
      setEmpDocs(docsRes);
    } catch {
      alert("Delete failed.");
    }
  };

  const handleDownload = (filePath) => {
    const token = localStorage.getItem("token");
    fetch(downloadDocumentUrl(filePath), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("File not found");
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filePath.split("/").pop();
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => alert("Could not download file."));
  };

  if (loading) return <p className="text-gray-500 text-sm">Loading employees...</p>;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-200 bg-white">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredEmployees.length === 0 ? (
            <p className="text-center text-sm text-gray-400 mt-6">No employees found.</p>
          ) : (
            filteredEmployees.map((emp) => (
              <button
                key={emp.id}
                onClick={() => { setSelectedEmp(emp); setForm(EMPTY_FORM); setFormError(""); }}
                className={`w-full text-left px-4 py-3 border-b border-gray-200 hover:bg-gray-100 transition-colors flex flex-col gap-0.5 ${
                  selectedEmp?.id === emp.id ? "bg-blue-50/50 border-l-4 border-l-blue-600" : ""
                }`}
              >
                <span className="font-medium text-gray-800 text-sm">{emp.name}</span>
                <span className="text-xs text-gray-400">{emp.email}</span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto p-6">
        {!selectedEmp ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <span className="text-5xl mb-3">📁</span>
            <p className="text-sm font-medium">Select an employee from the list to manage their documents.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{selectedEmp.name}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{selectedEmp.email}</p>
              </div>
              <button
                onClick={() => setSelectedEmp(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear Selection
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Uploaded Documents</h3>
              {docsLoading ? (
                <p className="text-sm text-gray-400">Loading documents...</p>
              ) : empDocs.length === 0 ? (
                <p className="text-sm text-gray-400">No documents uploaded yet.</p>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Document Name</th>
                        <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Number</th>
                        <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Expiry</th>
                        <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Download</th>
                        {isAdmin && <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {empDocs.map((doc) => (
                        <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-800 font-medium">{doc.documentName}</td>
                          <td className="px-4 py-3 text-gray-600">{doc.documentNumber}</td>
                          <td className="px-4 py-3 text-gray-600">
                            {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDownload(doc.filePath)}
                              className="text-blue-600 hover:underline text-xs font-medium"
                            >
                              Download
                            </button>
                          </td>
                          {isAdmin && (
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleDelete(doc.id)}
                                className="text-red-500 hover:underline text-xs"
                              >
                                Delete
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Upload New Document</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Document Name *</label>
                    <input
                      name="documentName"
                      value={form.documentName}
                      onChange={handleFormChange}
                      placeholder="e.g. Passport, ID Card"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Document Number *</label>
                    <input
                      name="documentNumber"
                      value={form.documentNumber}
                      onChange={handleFormChange}
                      placeholder="e.g. PN9821872"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={form.expiryDate}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onPaste={handlePaste}
                  className={`border-2 border-dashed rounded-lg p-8 text-center flex flex-col items-center justify-center transition-all ${
                    dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400 bg-gray-50"
                  }`}
                >
                  <input
                    type="file"
                    id="file-upload"
                    name="file"
                    onChange={handleFormChange}
                    accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx"
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    <span className="text-3xl mb-2">📥</span>
                    <span className="text-sm font-medium text-blue-600 hover:underline">
                      Click to upload
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      or drag & drop a file here, or paste it directly
                    </span>
                  </label>
                  {form.file && (
                    <div className="mt-4 p-2 bg-white border border-gray-200 rounded flex items-center gap-2 text-xs text-gray-700">
                      <span>📄 {form.file.name}</span>
                      <button
                        onClick={() => setForm((prev) => ({ ...prev, file: null }))}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {formError && <p className="text-red-500 text-xs">{formError}</p>}
                {uploadProgress && <p className="text-blue-500 text-xs">{uploadProgress}</p>}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors"
                  >
                    {saving ? "Saving..." : "Save Document"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeDocumentation;
