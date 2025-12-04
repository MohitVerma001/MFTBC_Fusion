import React, { useRef, useMemo } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./FormFields.css";

const RichTextEditor = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
}) => {
  const quillRef = useRef(null);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);

          quill.insertEmbed(range.index, "image", e.target.result);
          quill.setSelection(range.index + 1);

          setTimeout(() => {
            const img = quill.root.querySelector(`img[src="${e.target.result}"]`);
            if (img) {
              img.style.maxWidth = "100%";
              img.style.height = "auto";
              img.style.cursor = "nwse-resize";
              img.setAttribute("draggable", "false");

              let isResizing = false;
              let startX, startWidth;

              img.addEventListener("mousedown", (e) => {
                if (e.offsetX > img.offsetWidth - 10 && e.offsetY > img.offsetHeight - 10) {
                  isResizing = true;
                  startX = e.clientX;
                  startWidth = img.offsetWidth;
                  e.preventDefault();
                }
              });

              document.addEventListener("mousemove", (e) => {
                if (isResizing) {
                  const width = startWidth + (e.clientX - startX);
                  img.style.width = Math.max(100, Math.min(width, quill.root.offsetWidth)) + "px";
                  img.style.height = "auto";
                }
              });

              document.addEventListener("mouseup", () => {
                isResizing = false;
              });
            }
          }, 100);
        };
        reader.readAsDataURL(file);
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    clipboard: {
      matchVisual: false,
    },
  }), []);

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "align",
  ];

  return (
    <div className="mb-3">
      <label className={`form-label ${required ? "required" : ""}`}>
        {label}
      </label>
      <div className={`rich-text-editor ${error ? "is-invalid" : ""}`}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </div>
      {error && <div className="invalid-feedback d-block">{error}</div>}
      <style jsx>{`
        .rich-text-editor .ql-editor img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 10px 0;
          cursor: nwse-resize;
        }

        .rich-text-editor .ql-editor {
          min-height: 200px;
          max-height: 600px;
          overflow-y: auto;
        }

        .rich-text-editor .ql-editor * {
          max-width: 100%;
        }

        .rich-text-editor .ql-toolbar {
          background: #f8f9fa;
          border-radius: 8px 8px 0 0;
        }

        .rich-text-editor .ql-container {
          border-radius: 0 0 8px 8px;
          font-family: 'Roboto', sans-serif;
          font-size: 15px;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
