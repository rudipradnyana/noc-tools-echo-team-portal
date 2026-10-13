
import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  FileText,
  LoaderCircle,
  Play,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import "./TracemplsCisco.css";

type ScriptType = "tracempls" | "tracempls2" | "tracemplsNPE";
type TraceTheme = "dark" | "light" | "blue" | "neon";

interface TraceForm {
  ipSource: string;
  ipDestination: string;
  username: string;
  password: string;
  scriptType: ScriptType;
}

const SCRIPT_OPTIONS: { value: ScriptType; label: string }[] = [
  { value: "tracempls", label: "Tracempls" },
  {
    value: "tracempls2",
    label: "Tracempls with traffic port",
  },
  {
    value: "tracemplsNPE",
    label: "Tracempls from NPE",
  },
];

const INITIAL_FORM: TraceForm = {
  ipSource: "",
  ipDestination: "",
  username: "",
  password: "",
  scriptType: "tracempls",
};

const DEMO_OUTPUT = (form: TraceForm) => {
  const selectedScript =
    SCRIPT_OPTIONS.find((option) => option.value === form.scriptType)?.label ??
    form.scriptType;

  return [
    "============================================================",
    "                 TRACEMPLS CISCO - DEMO",
    "============================================================",
    "",
    "STATUS  : SIMULASI FRONTEND",
    "CATATAN : Backend traceroute belum terhubung.",
    "",
    `IP SOURCE      : ${form.ipSource}`,
    `IP DESTINATION : ${form.ipDestination}`,
    `SCRIPT TYPE    : ${selectedScript}`,
    "",
    "------------------------------------------------------------",
    "CONTOH FORMAT OUTPUT",
    "------------------------------------------------------------",
    "",
    "Ini hanya contoh format tampilan, bukan hasil perangkat.",
    "",
    "Hop    Address          Latency       Information",
    "------------------------------------------------------------",
    "1      192.0.2.1        --            CONTOH / DEMO",
    "2      198.51.100.1     --            CONTOH / DEMO",
    "3      203.0.113.1      --            CONTOH / DEMO",
    "",
    "------------------------------------------------------------",
    "SIMULASI SELESAI",
    "Tidak ada koneksi ke router atau perangkat jaringan.",
    "Hubungkan backend sebelum menggunakan untuk troubleshooting.",
    "============================================================",
  ].join("\n");
};

const TracemplsCisco: React.FC = () => {
  const [form, setForm] = useState<TraceForm>(INITIAL_FORM);
  const [theme, setTheme] = useState<TraceTheme>("dark");
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const lineCount = useMemo(
    () => (output ? output.split(/\r?\n/).length : 0),
    [output]
  );

  const updateField = <K extends keyof TraceForm>(
    field: K,
    value: TraceForm[K]
  ) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const cleanedForm: TraceForm = {
      ...form,
      ipSource: form.ipSource.trim(),
      ipDestination: form.ipDestination.trim(),
      username: form.username.trim(),
      password: form.password.trim(),
    };

    if (
      !cleanedForm.ipSource ||
      !cleanedForm.ipDestination ||
      !cleanedForm.username ||
      !cleanedForm.password
    ) {
      setError("Semua field wajib diisi terlebih dahulu.");
      return;
    }

    setForm(cleanedForm);
    setIsLoading(true);
    setShowResult(false);
    setCopied(false);

    try {
      // DEMO FRONTEND:
      // Belum ada request jaringan atau eksekusi script di sini.
      // Ganti blok ini dengan request API setelah backend tersedia.
      await new Promise((resolve) => setTimeout(resolve, 700));

      setOutput(DEMO_OUTPUT(cleanedForm));
      setShowResult(true);
    } catch {
      setError("Terjadi kesalahan saat memproses permintaan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError(
        "Gagal menyalin otomatis. Pilih teks pada output, lalu salin secara manual."
      );
    }
  };

  const handleDownload = () => {
    const blob = new Blob([output], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "tracempls-result-demo.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    setShowResult(false);
    setError("");
  };

  return (
    <section className={`tc-page tc-theme-${theme}`}>
      <header className="tc-header">
        <div className="tc-logo">
          <Terminal size={26} />
        </div>

        <div className="tc-heading">
          <div className="tc-eyebrow">NETWORK OPERATIONS CENTER</div>
          <h2>TRACEMPLS CISCO</h2>
          <p>Traceroute MPLS dan analisis jalur jaringan</p>
        </div>

        <div className="tc-header-tag">
          <span className="tc-status-dot" />
          Frontend Demo
        </div>
      </header>

      <div className="tc-demo-notice" role="status">
        <ShieldAlert size={19} />
        <div>
          <strong>Mode simulasi — backend belum terhubung</strong>
          <p>
            Hasil saat ini hanya contoh format output. Belum ada perintah
            traceroute yang dijalankan ke perangkat jaringan.
          </p>
        </div>
      </div>

      {error && (
        <div className="tc-error" role="alert">
          {error}
        </div>
      )}

      {!showResult ? (
        <div className="tc-panel">
          <div className="tc-panel-heading">
            <div>
              <h3>Parameter Traceroute</h3>
              <p>Masukkan sumber, tujuan, dan jenis script.</p>
            </div>
            <span className="tc-panel-icon">
              <FileText size={20} />
            </span>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="tc-form-grid">
              <div className="tc-field">
                <label htmlFor="tc-ip-source">IP Source</label>
                <input
                  id="tc-ip-source"
                  type="text"
                  inputMode="decimal"
                  placeholder="Contoh: 10.10.10.1"
                  value={form.ipSource}
                  onChange={(event) =>
                    updateField("ipSource", event.target.value)
                  }
                  required
                />
                <small>Alamat IP sumber traceroute.</small>
              </div>

              <div className="tc-field">
                <label htmlFor="tc-ip-destination">IP Destination</label>
                <input
                  id="tc-ip-destination"
                  type="text"
                  inputMode="decimal"
                  placeholder="Contoh: 10.20.20.1"
                  value={form.ipDestination}
                  onChange={(event) =>
                    updateField("ipDestination", event.target.value)
                  }
                  required
                />
                <small>Alamat IP tujuan yang akan ditelusuri.</small>
              </div>

              <div className="tc-field">
                <label htmlFor="tc-username">Username</label>
                <input
                  id="tc-username"
                  type="text"
                  placeholder="Username perangkat"
                  value={form.username}
                  onChange={(event) =>
                    updateField("username", event.target.value)
                  }
                  autoComplete="off"
                  required
                />
              </div>

              <div className="tc-field">
                <label htmlFor="tc-password">Password</label>
                <input
                  id="tc-password"
                  type="password"
                  placeholder="Password perangkat"
                  value={form.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <div className="tc-field tc-script-field">
              <label htmlFor="tc-script-type">Jenis Traceroute</label>
              <select
                id="tc-script-type"
                value={form.scriptType}
                onChange={(event) =>
                  updateField("scriptType", event.target.value as ScriptType)
                }
              >
                {SCRIPT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <small>
                Pilihan ini mengikuti value dari aplikasi HTML lama.
              </small>
            </div>

            <div className="tc-form-footer">
              <p>
                <span className="tc-required">*</span> Semua field wajib diisi.
              </p>

              <button
                className="tc-button tc-button-primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="tc-spin" size={18} />
                    Menyiapkan demo...
                  </>
                ) : (
                  <>
                    <Play size={17} />
                    Run Script
                  </>
                )}
              </button>
            </div>

            {isLoading && (
              <div className="tc-loading" aria-live="polite">
                <span className="tc-loading-bar" />
                <p>Menyiapkan tampilan hasil simulasi...</p>
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className="tc-panel tc-result-panel">
          <div className="tc-panel-heading tc-result-heading">
            <div>
              <h3>Hasil Trace</h3>
              <p>Output traceroute dan informasi per-hop.</p>
            </div>

            <span className="tc-demo-badge">DEMO OUTPUT</span>
          </div>

          <div className="tc-result-meta">
            <div>
              <span>IP Source</span>
              <strong>{form.ipSource}</strong>
            </div>
            <div>
              <span>IP Destination</span>
              <strong>{form.ipDestination}</strong>
            </div>
            <div>
              <span>Jenis Script</span>
              <strong>
                {SCRIPT_OPTIONS.find(
                  (option) => option.value === form.scriptType
                )?.label ?? form.scriptType}
              </strong>
            </div>
          </div>

          <div className="tc-toolbar">
            <button
              type="button"
              className="tc-button tc-button-primary"
              onClick={handleCopy}
            >
              {copied ? <Check size={17} /> : <Copy size={17} />}
              {copied ? "Copied!" : "Copy"}
            </button>

            <button
              type="button"
              className="tc-button tc-button-secondary"
              onClick={handleDownload}
            >
              <Download size={17} />
              Download TXT
            </button>

            <label className="tc-theme-control">
              <span>Theme</span>
              <select
                aria-label="Pilih tema output"
                value={theme}
                onChange={(event) =>
                  setTheme(event.target.value as TraceTheme)
                }
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="blue">Blue</option>
                <option value="neon">Neon</option>
              </select>
            </label>

            <button
              type="button"
              className="tc-button tc-button-secondary tc-back-button"
              onClick={handleBack}
            >
              <ArrowLeft size={17} />
              Kembali
            </button>
          </div>

          <pre className="tc-output" tabIndex={0} aria-live="polite">
            {output}
          </pre>

          <footer className="tc-result-footer">
            <span>Monospace · Readable</span>
            <span>Lines: {lineCount}</span>
          </footer>

          <div className="tc-result-warning">
            <ShieldAlert size={17} />
            <span>
              Ini merupakan output simulasi. Jangan gunakan sebagai bukti hasil
              troubleshooting jaringan.
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

export default TracemplsCisco;
