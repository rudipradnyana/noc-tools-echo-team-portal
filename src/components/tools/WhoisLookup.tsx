
import React, { useState } from "react";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Globe2,
  LoaderCircle,
  Radar,
  Search,
  ShieldAlert,
  Terminal,
  XCircle,
} from "lucide-react";
import "./WhoisLookup.css";

type WhoisResult = {
  ip?: string;
  asn?: string;
  as_org?: string;
  isp?: string;
  country?: string;
  city?: string;
  error?: string;
};

type ConsoleEntry = {
  id: number;
  text: string;
  type: "system" | "success" | "error";
};

type LookupState = "idle" | "loading" | "success" | "error";

const WHOIS_API_URL = "/api/whois-lookup";

/**
 * Aktifkan false ketika endpoint backend sudah tersedia.
 * Mode simulasi tidak melakukan pencarian WHOIS yang sebenarnya.
 */
const DEMO_MODE = true;

const RESULT_FIELDS: {
  key: keyof WhoisResult;
  label: string;
}[] = [
  { key: "ip", label: "IP Address" },
  { key: "asn", label: "ASN" },
  { key: "as_org", label: "AS Org" },
  { key: "isp", label: "ISP" },
  { key: "country", label: "Negara" },
  { key: "city", label: "Kota" },
];

const WhoisLookup: React.FC = () => {
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<LookupState>("idle");
  const [result, setResult] = useState<WhoisResult | null>(null);
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const addLog = (
    text: string,
    type: ConsoleEntry["type"] = "system"
  ) => {
    setConsoleEntries((previous) => [
      ...previous,
      { id: Date.now() + Math.random(), text, type },
    ]);
  };

  const handleIpChange = (value: string) => {
    // Meniru karakter yang diperbolehkan oleh input HTML lama.
    setIp(value.replace(/[^a-zA-Z0-9.:-]/g, ""));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = ip.trim();
    if (!query) {
      setError("Masukkan IP address atau hostname terlebih dahulu.");
      return;
    }

    setLoading(true);
    setState("loading");
    setResult(null);
    setError("");
    setCopied(false);
    setConsoleEntries([]);

    const appendLog = (text: string, type: ConsoleEntry["type"] = "system") =>
      setConsoleEntries((previous) => [
        ...previous,
        { id: Date.now() + Math.random(), text, type },
      ]);

    try {
      appendLog(`MENYIAPKAN PENCARIAN: [${query}]`);
      await new Promise((resolve) => setTimeout(resolve, 300));

      appendLog("MENYIAPKAN PERMINTAAN REGISTRY...");
      await new Promise((resolve) => setTimeout(resolve, 350));

      if (DEMO_MODE) {
        appendLog("MODE DEMO AKTIF — REQUEST BACKEND DILEWATI.");
        await new Promise((resolve) => setTimeout(resolve, 350));

        appendLog(
          "Tidak ada data WHOIS asli yang diambil.",
          "error"
        );

        setResult({
          ip: query,
          asn: "Tidak tersedia",
          as_org: "Demo frontend",
          isp: "Backend belum terhubung",
          country: "Tidak tersedia",
          city: "Tidak tersedia",
        });
        setState("success");
        return;
      }

      appendLog("MENGIRIM REQUEST KE SERVER WHOIS...");

      const response = await fetch(WHOIS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: new URLSearchParams({ ip: query }),
      });

      if (!response.ok) {
        throw new Error(`Server merespons dengan HTTP ${response.status}.`);
      }

      const data = await response.json();

      if (!data.success) {
        const message =
          data.result?.error || "Lookup gagal diproses oleh server.";

        appendLog(message, "error");
        setResult({ error: message });
        setState("error");
        return;
      }

      const details: WhoisResult = data.result;
      appendLog("RESPONSE DITERIMA DARI SERVER.", "system");
      appendLog("DATA REGISTRY BERHASIL DIPROSES.", "success");

      setResult(details);
      setState("success");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan yang tidak diketahui.";

      appendLog(`ERROR: ${message}`, "error");
      setError(message);
      setResult({ error: message });
      setState("error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIp("");
    setResult(null);
    setConsoleEntries([]);
    setError("");
    setState("idle");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;

    const text = RESULT_FIELDS.map(
      ({ key, label }) => `${label}: ${result[key] || "N/A"}`
    ).join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Gagal menyalin hasil. Silakan salin secara manual.");
    }
  };

  return (
    <section className="whois-page">
      <div className="whois-grid-bg" aria-hidden="true" />
      <div className="whois-glow whois-glow-one" aria-hidden="true" />
      <div className="whois-glow whois-glow-two" aria-hidden="true" />
      <div className="whois-scanline" aria-hidden="true" />

      <div className="whois-content">
        <header className="whois-header">
          <div className="whois-brand-icon">
            <Globe2 size={28} />
          </div>

          <div className="whois-brand-copy">
            <span className="whois-kicker">NETWORK OPERATIONS CENTER</span>
            <h2>WHOIS LOOKUP</h2>
            <p>IP Registry &amp; Network Ownership Lookup</p>
          </div>

          <div className="whois-header-status">
            <span className="whois-status-dot" />
            {DEMO_MODE ? "DEMO MODE" : "API MODE"}
          </div>
        </header>

        {DEMO_MODE && (
          <div className="whois-demo-notice">
            <ShieldAlert size={18} />
            <div>
              <strong>Mode simulasi aktif</strong>
              <p>
                Backend belum dihubungkan. Hasil yang tampil bukan data
                registri asli.
              </p>
            </div>
          </div>
        )}

        <div className="whois-card">
          <div className="whois-card-heading">
            <div className="whois-heading-icon">
              <Radar size={21} />
            </div>
            <div>
              <h3>WHOIS Finder</h3>
              <p>Masukkan alamat IP atau hostname untuk memulai.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="whois-form">
            <label htmlFor="whois-ip">IP Address / Hostname</label>

            <div className="whois-input-wrap">
              <Globe2 size={20} aria-hidden="true" />
              <input
                id="whois-ip"
                name="ip"
                type="text"
                placeholder="Masukkan IP (contoh: 8.8.8.8)"
                value={ip}
                onChange={(event) => handleIpChange(event.target.value)}
                autoComplete="off"
                spellCheck={false}
                required
              />
            </div>

            <button
              type="submit"
              className="whois-submit"
              disabled={loading}
            >
              {loading ? (
                <LoaderCircle className="whois-spin" size={19} />
              ) : (
                <Search size={19} />
              )}
              {loading ? "SCANNING..." : "SCAN REGISTRY"}
            </button>
          </form>

          {error && (
            <div className="whois-error-banner" role="alert">
              <XCircle size={17} />
              <span>{error}</span>
            </div>
          )}

          {consoleEntries.length > 0 && (
            <div className="whois-console" aria-live="polite">
              <div className="whois-console-header">
                <span className="whois-console-lights">
                  <i />
                  <i />
                  <i />
                </span>
                <span>
                  <Terminal size={14} />
                  SYSTEM CONSOLE
                </span>
                <Activity size={15} />
              </div>

              <div className="whois-console-body">
                {consoleEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`whois-console-line ${entry.type}`}
                  >
                    <span className="whois-prompt">&gt;</span>
                    <span>{entry.text}</span>
                  </div>
                ))}
                {loading && (
                  <div className="whois-console-line system">
                    <span className="whois-prompt">&gt;</span>
                    <span className="whois-cursor">_</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {result && (
            <section className="whois-result" aria-live="polite">
              <div className="whois-result-title">
                {state === "error" ? (
                  <XCircle size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                <h3>
                  {state === "error"
                    ? "Lookup Gagal"
                    : "Registry Result"}
                </h3>
                <span className="whois-result-badge">
                  {DEMO_MODE ? "SIMULASI" : state.toUpperCase()}
                </span>
              </div>

              {result.error ? (
                <div className="whois-detail-row">
                  <span>Status</span>
                  <strong className="whois-value-error">{result.error}</strong>
                </div>
              ) : (
                RESULT_FIELDS.map(({ key, label }) => (
                  <div className="whois-detail-row" key={key}>
                    <span>{label}</span>
                    <strong>{result[key] || "N/A"}</strong>
                  </div>
                ))
              )}

              <div className="whois-result-actions">
                <button
                  type="button"
                  className="whois-secondary-btn"
                  onClick={handleCopy}
                  disabled={Boolean(result.error)}
                >
                  {copied ? <CheckCircle2 size={16} /> : <Search size={16} />}
                  {copied ? "Copied" : "Copy Result"}
                </button>

                <button
                  type="button"
                  className="whois-secondary-btn"
                  onClick={handleReset}
                >
                  <ArrowLeft size={16} />
                  New Lookup
                </button>
              </div>
            </section>
          )}

          <footer className="whois-footer">
            <span>WHOIS LOOKUP / NETWORK TOOLS</span>
            <span>IP REGISTRY SCANNER</span>
          </footer>
        </div>

        <div className="whois-bottom-note">
          <span className="whois-bottom-dot" />
          Gunakan untuk pemeriksaan jaringan yang diizinkan.
        </div>
      </div>
    </section>
  );
};

export default WhoisLookup;
