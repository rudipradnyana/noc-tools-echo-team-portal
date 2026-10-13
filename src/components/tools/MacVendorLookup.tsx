
import { useState, type FormEvent } from "react";
import {
  Activity,
  CheckCircle2,
  Cpu,
  LoaderCircle,
  Network,
  ScanLine,
  Terminal,
  XCircle,
} from "lucide-react";
import "./MacVendorLookup.css";

type ScanStatus = "idle" | "loading" | "success" | "error";

type MacVendorResult = {
  mac_address: string;
  vendor: string;
};

type LogEntry = {
  text: string;
  type: "system" | "success" | "error";
};

const DEMO_MODE = true;
const API_URL = "/";

function normalizeMac(value: string): string {
  const hex = value.replace(/[^0-9a-f]/gi, "").slice(0, 12);
  return hex.match(/.{1,2}/g)?.join(":").toUpperCase() ?? "";
}

function isValidMac(value: string): boolean {
  return /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/i.test(value);
}

export default function MacVendorLookup() {
  const [macAddress, setMacAddress] = useState("");
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [result, setResult] = useState<MacVendorResult | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [error, setError] = useState("");

  const appendLog = (
    text: string,
    type: LogEntry["type"] = "system"
  ) => {
    setLogs((previous) => [...previous, { text, type }]);
  };

  const wait = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const mac = normalizeMac(macAddress);

    if (!isValidMac(mac)) {
      setStatus("error");
      setError(
        "Format MAC Address tidak valid. Masukkan 12 digit heksadesimal."
      );
      setResult(null);
      setLogs([]);
      return;
    }

    setMacAddress(mac);
    setStatus("loading");
    setError("");
    setResult(null);
    setLogs([]);

    const log = (
      text: string,
      type: LogEntry["type"] = "system"
    ) => appendLog(text, type);

    log(`MENYIAPKAN PENCARIAN MAC: [${mac}]`);
    await wait(300);
    log("MEMULAI PROSES LOOKUP VENDOR...");
    await wait(300);
    log("MENGIRIM PERMINTAAN KE REGISTRY SERVICE...");

    try {
      if (DEMO_MODE) {
        await wait(700);
        log("MODE DEMO AKTIF: BACKEND BELUM DIHUBUNGKAN.");
        log("TIDAK ADA DATA VENDOR ASLI YANG DIAMBIL.", "error");

        setStatus("success");
        setResult({
          mac_address: mac,
          vendor: "Demo — backend belum terhubung",
        });
        return;
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/json",
        },
        body: new URLSearchParams({ mac_address: mac }),
      });

      if (!response.ok) {
        throw new Error(
          `Server merespons dengan status ${response.status}.`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Vendor tidak ditemukan atau lookup gagal."
        );
      }

      if (
        typeof data.vendor !== "string" ||
        typeof data.mac_address !== "string"
      ) {
        throw new Error("Format respons backend tidak sesuai.");
      }

      setResult({
        mac_address: data.mac_address,
        vendor: data.vendor,
      });
      setStatus("success");
      log("RESPONS DITERIMA DARI SERVER.", "success");
      log("LOOKUP SELESAI.", "success");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan yang tidak diketahui.";

      setStatus("error");
      setError(message);
      log(`LOOKUP GAGAL: ${message}`, "error");
    }
  }

  function clearInput() {
    setMacAddress("");
    setStatus("idle");
    setResult(null);
    setError("");
    setLogs([]);
  }

  return (
    <main className="mac-vendor">
      <div className="mac-vendor__glow mac-vendor__glow--cyan" />
      <div className="mac-vendor__glow mac-vendor__glow--purple" />
      <div className="mac-vendor__scanline" />

      <section className="mac-vendor__card">
        <div className="mac-vendor__eyebrow">
          <Activity size={15} />
          NETWORK INTELLIGENCE / HARDWARE REGISTRY
        </div>

        <div className="mac-vendor__icon">
          <Network size={28} />
        </div>

        <h1>MAC FINDER</h1>
        <p className="mac-vendor__subtitle">
          Identifikasi vendor berdasarkan MAC Address
        </p>

        <div className="mac-vendor__status">
          <span
            className={`mac-vendor__status-dot ${
              status === "loading" ? "is-loading" : ""
            }`}
          />
          {status === "loading"
            ? "SCANNING"
            : DEMO_MODE
              ? "DEMO MODE"
              : "REGISTRY READY"}
        </div>

        <form onSubmit={handleSubmit} className="mac-vendor__form">
          <label htmlFor="mac-vendor-input">MAC ADDRESS</label>

          <div className="mac-vendor__input-wrap">
            <Cpu size={20} aria-hidden="true" />
            <input
              id="mac-vendor-input"
              type="text"
              value={macAddress}
              onChange={(event) => {
                setMacAddress(normalizeMac(event.target.value));
                if (status === "error") {
                  setStatus("idle");
                  setError("");
                }
              }}
              placeholder="44:38:39:FF:EF:57"
              autoComplete="off"
              maxLength={17}
              spellCheck={false}
              disabled={status === "loading"}
              aria-invalid={status === "error"}
            />

            {macAddress && (
              <button
                className="mac-vendor__clear"
                type="button"
                onClick={clearInput}
                aria-label="Hapus MAC Address"
                disabled={status === "loading"}
              >
                ×
              </button>
            )}
          </div>

          <p className="mac-vendor__hint">
            Format otomatis: XX:XX:XX:XX:XX:XX
          </p>

          <button
            className="mac-vendor__submit"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <LoaderCircle
                className="mac-vendor__spinner"
                size={19}
              />
            ) : (
              <ScanLine size={19} />
            )}
            {status === "loading" ? "SCANNING..." : "SCAN REGISTRY"}
          </button>
        </form>

        {logs.length > 0 && (
          <section className="mac-vendor__console" aria-live="polite">
            <div className="mac-vendor__console-head">
              <div className="mac-vendor__console-title">
                <Terminal size={15} />
                SYSTEM CONSOLE
              </div>
              <span>{logs.length} EVENTS</span>
            </div>

            <div className="mac-vendor__console-body">
              {logs.map((entry, index) => (
                <div
                  key={`${index}-${entry.text}`}
                  className={`mac-vendor__log mac-vendor__log--${entry.type}`}
                >
                  <span className="mac-vendor__prompt">&gt;</span>
                  {entry.text}
                </div>
              ))}
            </div>
          </section>
        )}

        {status === "success" && result && (
          <section className="mac-vendor__result" aria-live="polite">
            <div className="mac-vendor__result-heading">
              <CheckCircle2 size={18} />
              <span>HASIL LOOKUP</span>
            </div>

            <p className="mac-vendor__result-label">
              VENDOR TERDETEKSI
            </p>
            <h2>{result.vendor}</h2>

            <div className="mac-vendor__mac-value">
              <span>MAC ADDRESS</span>
              <code>{result.mac_address}</code>
            </div>

            {DEMO_MODE && (
              <p className="mac-vendor__demo-note">
                Mode demo: ini bukan hasil identifikasi vendor asli.
              </p>
            )}
          </section>
        )}

        {status === "error" && (
          <div className="mac-vendor__error" role="alert">
            <XCircle size={19} />
            <div>
              <strong>LOOKUP GAGAL</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        <footer className="mac-vendor__footer">
          <span>NOC TOOLKIT</span>
          <span>MAC VENDOR LOOKUP</span>
        </footer>
      </section>
    </main>
  );
}
