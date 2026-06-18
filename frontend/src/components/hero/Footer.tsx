export function Footer() {
  return (
    <footer className="px-8 py-8" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded flex items-center justify-center"
            style={{ background: "#22d3ee" }}
          >
            <span style={{ color: "#000", fontWeight: 700, fontSize: 9 }}>E</span>
          </div>
          <span style={{ color: "rgba(160,180,200,0.4)", fontSize: 13 }}>
            Edu Finance · DIO Lab · 2025
          </span>
        </div>
        <span style={{ color: "rgba(160,180,200,0.3)", fontSize: 12 }}>
          Powered by Groq · FastAPI · React
        </span>
      </div>
    </footer>
  );
}