// ─── Reusable Modal component ─────────────────────────────────────────────────
//
// This is a generic modal (popup) wrapper.
// Every page that needs Add/Edit dialog uses this same component.
//
// CONCEPT — "children" prop:
//   In React, children is whatever you put BETWEEN the opening and closing tags.
//   <Modal> <form>...</form> </Modal>
//   The form is "children" here. This makes Modal generic and reusable.
//
// ─────────────────────────────────────────────────────────────────────────────

function Modal({ isOpen, title, onClose, children }) {
  // If isOpen is false, render nothing (don't show the modal at all)
  if (!isOpen) return null;

  return (
    // Overlay: covers the entire screen with a semi-transparent dark background
    // fixed inset-0 → position fixed, top/right/bottom/left all = 0 (full screen)
    // z-50 → on top of everything else
    // flex items-center justify-center → center the modal card
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      {/* Modal card */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">

        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          {/* Close button — calls onClose() which the parent controls */}
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal body — renders whatever is passed as children */}
        <div className="px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
