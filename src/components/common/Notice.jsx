const palette = {
  info: { bg: "#e8f4ff", color: "#0b63ce", border: "#b5d7ff" },
  success: { bg: "#e7f6ed", color: "#1b7a3d", border: "#bde5c4" },
  error: { bg: "#fdecea", color: "#a52a2a", border: "#f5c6c6" },
};

export default function Notice({ type = "info", message }) {
  if (!message) return null;
  const tone = palette[type] || palette.info;
  return (
    <div
      style={{
        background: tone.bg,
        color: tone.color,
        border: `1px solid ${tone.border}`,
        padding: "12px 14px",
        borderRadius: 10,
        margin: "12px 0px",
      }}
    >
      {message}
    </div>
  );
}
