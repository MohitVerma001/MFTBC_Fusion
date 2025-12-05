import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
} from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./FormFields.css";

/**
 * Extend Quill's Link format so every link opens in a new tab.
 */
const BaseLink = Quill.import("formats/link");
class CustomLink extends BaseLink {
  static create(value) {
    const node = super.create(value);
    const sanitized = this.sanitize(value);
    node.setAttribute("href", sanitized);
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
    return node;
  }
}
Quill.register(CustomLink, true);

const RichTextEditor = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
}) => {
  const quillRef = useRef(null);

  // For custom link modal
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkForm, setLinkForm] = useState({
    url: "",
    text: "",
  });
  const savedRangeRef = useRef(null);

  // For image tools (size + alignment)
  const [selectedImage, setSelectedImage] = useState(null);

  /**
   * Custom image handler: insert base64 image and make it responsive.
   */
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const range = quill.getSelection(true) || { index: quill.getLength() };
        quill.insertEmbed(range.index, "image", e.target.result, "user");
        quill.setSelection(range.index + 1, 0);

        // Ensure responsive by default
        setTimeout(() => {
          const editor = quill.root;
          const imgs = editor.querySelectorAll(`img[src="${e.target.result}"]`);
          imgs.forEach((img) => {
            img.style.maxWidth = "100%";
            img.style.height = "auto";
          });
        }, 50);
      };

      reader.readAsDataURL(file);
    };
  };

  /**
   * Custom link handler – opens our own modal instead of Quill's prompt.
   */
  const linkHandler = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection();
    savedRangeRef.current = range;

    let selectedText = "";
    if (range && range.length > 0) {
      selectedText = quill.getText(range.index, range.length);
    }

    setLinkForm({
      url: "",
      text: selectedText,
    });
    setIsLinkModalOpen(true);
  };

  const handleInsertLink = (e) => {
    e.preventDefault();
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    let { url, text } = linkForm;
    url = (url || "").trim();
    text = (text || "").trim();

    if (!url) {
      setIsLinkModalOpen(false);
      return;
    }

    // prepend protocol if missing
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    const range = savedRangeRef.current || quill.getSelection(true);

    if (!range) {
      // No selection at all – append link at the end
      const index = quill.getLength();
      quill.insertText(index, text || url, "link", url, "user");
      quill.setSelection(index + (text || url).length, 0);
    } else if (range.length === 0) {
      // Cursor only – insert new text as link
      quill.insertText(range.index, text || url, "link", url, "user");
      quill.setSelection(range.index + (text || url).length, 0);
    } else {
      // Text selected – convert to link
      quill.formatText(range.index, range.length, "link", url, "user");
      quill.setSelection(range.index + range.length, 0);
    }

    setIsLinkModalOpen(false);
  };

  const handleCancelLink = (e) => {
    e.preventDefault();
    setIsLinkModalOpen(false);
  };

  /**
   * Listen to clicks inside the editor to detect selected image.
   * When user clicks an <img>, show image tools panel.
   */
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const editor = quill.root;

    const handleClick = (ev) => {
      const target = ev.target;
      if (target && target.tagName === "IMG") {
        setSelectedImage(target);
      } else {
        setSelectedImage(null);
      }
    };

    editor.addEventListener("click", handleClick);
    return () => {
      editor.removeEventListener("click", handleClick);
    };
  }, []);

  const setImageSize = (size) => {
    if (!selectedImage) return;
    // size: 'small' | 'medium' | 'large'
    let width;
    switch (size) {
      case "small":
        width = "25%";
        break;
      case "medium":
        width = "50%";
        break;
      case "large":
      default:
        width = "100%";
        break;
    }
    selectedImage.style.width = width;
    selectedImage.style.height = "auto";
  };

  const setImageAlign = (align) => {
    if (!selectedImage) return;

    // Remove previous alignment classes
    selectedImage.classList.remove(
      "rte-img-left",
      "rte-img-right",
      "rte-img-center"
    );

    if (align === "left") {
      selectedImage.classList.add("rte-img-left");
    } else if (align === "right") {
      selectedImage.classList.add("rte-img-right");
    } else if (align === "center") {
      selectedImage.classList.add("rte-img-center");
    }
  };

  const modules = useMemo(
    () => ({
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
          link: linkHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

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

      {/* Wrapper makes the editor vertically resizable */}
      <div
        className={`rich-text-editor-wrapper ${
          error ? "is-invalid-editor" : ""
        }`}
      >
        <div className="rich-text-editor">
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
      </div>

      {error && <div className="invalid-feedback d-block">{error}</div>}

      {/* IMAGE TOOLS PANEL – shown when an image is selected */}
      {selectedImage && (
        <div className="rte-image-tools">
          <span className="rte-tools-label">Image tools:</span>
          <div className="rte-tools-group">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setImageSize("small")}
            >
              Small
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setImageSize("medium")}
            >
              Medium
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setImageSize("large")}
            >
              Full
            </button>
          </div>
          <div className="rte-tools-group">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setImageAlign("left")}
            >
              Left
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setImageAlign("center")}
            >
              Center
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setImageAlign("right")}
            >
              Right
            </button>
          </div>
        </div>
      )}

      {/* LINK MODAL */}
      {isLinkModalOpen && (
        <div className="rte-modal-backdrop">
          <div className="rte-modal">
            <h5 className="rte-modal-title">Insert Link</h5>
            <form onSubmit={handleInsertLink}>
              <div className="mb-3">
                <label className="form-label">URL</label>
                <input
                  type="text"
                  className="form-control"
                  value={linkForm.url}
                  onChange={(e) =>
                    setLinkForm((prev) => ({
                      ...prev,
                      url: e.target.value,
                    }))
                  }
                  placeholder="https://example.com"
                  autoFocus
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Text to display</label>
                <input
                  type="text"
                  className="form-control"
                  value={linkForm.text}
                  onChange={(e) =>
                    setLinkForm((prev) => ({
                      ...prev,
                      text: e.target.value,
                    }))
                  }
                  placeholder="Optional – if empty, URL will be used"
                />
              </div>
              <div className="rte-modal-actions">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCancelLink}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Insert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
