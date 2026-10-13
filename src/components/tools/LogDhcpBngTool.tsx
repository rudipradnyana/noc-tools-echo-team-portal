
import { useState } from "react";
import {
  Terminal,
  Home,
  Search,
  Copy,
  Check,
  AlertTriangle,
  Lightbulb,
  LoaderCircle,
} from "lucide-react";
import "./LogDhcpBngTool.css";

const DEMO_SERVERS = [
  { ip: "192.0.2.10", name: "BNG Server 1 (Demo)" },
  { ip: "192.0.2.11", name: "BNG Server 2 (Demo)" },
];

export default function LogDhcpBngTool() {
  const [selectedIp, setSelectedIp] = useState(DEMO_SERVERS[0].ip);
  const [macAddress, setMacAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedMac = macAddress.trim().toLowerCase();
    const macPattern = /^([0-9a-f]{2}[:-]){5}[0-9a-f]{2}$/i;

    if (!macPattern.test(normalizedMac)) {
      setSearched(true);
      setMessage(
        "Format MAC Address tidak valid. Contoh: 6c:3b:6b:fe:f1:5b"
      );
      return;
    }

    setLoading(true);
    setSearched(false);
    setMessage("");

    // Simulasi UI saja. Belum melakukan query ke server BNG.
    window.setTimeout(() => {
      setLoading(false);
      setSearched(true);
      setMessage(
        [
          "DHCP BNG LOG CHECKER — DEMO MODE",
          "=================================",
          `Server IP : ${selectedIp}`,
          `MAC       : ${normalizedMac}`,
          `Timestamp : ${new Date().toLocaleString("id-ID")}`,
          "",
          "[INFO] Form pencarian berhasil diproses.",
          "[INFO] Koneksi ke server BNG belum diaktifkan.",
          "[INFO] Data log di atas bukan hasil query server.",
          "",
          "Hubungkan backend untuk menampilkan log DHCP yang sebenarnya.",
        ].join("\n")
      );
    }, 800);
  };

  const handleCopy = async () => {
    if (!message) return;

    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setMessage((current) => current);
    }
  };

  const hasError =
    searched &&
    (message.includes("tidak valid") ||
      message.includes("Error:") ||
      message.includes("Timeout"));

  return (
    <div className="dhcp-tool">
      <div className="dhcp-glow dhcp-glow-one" />
      <div className="dhcp-glow dhcp-glow-two" />

      <main className="dhcp-container">
        <header className="dhcp-header">
          <div className="dhcp-logo">
            <Terminal size={27} />
          </div>

          <h1>DHCP BNG Log Checker</h1>
          <p>
            Inspect subscriber DHCP logs across BNG servers
          </p>
          <span className="dhcp-demo-badge">
            UI DEMO · BACKEND NOT CONNECTED
          </span>
        </header>

        <form className="dhcp-form" onSubmit={handleSearch}>
          <div className="dhcp-form-row">
            <div className="dhcp-form-group">
              <label htmlFor="dhcp-server">Select IP Server</label>
              <select
                id="dhcp-server"
                value={selectedIp}
                onChange={(event) => setSelectedIp(event.target.value)}
              >
                {DEMO_SERVERS.map((server) => (
                  <option key={server.ip} value={server.ip}>
                    {server.name} — {server.ip}
                  </option>
                ))}
              </select>
            </div>

            <div className="dhcp-form-group">
              <label htmlFor="dhcp-mac">MAC Address</label>
              <input
                id="dhcp-mac"
                type="text"
                value={macAddress}
                onChange={(event) => setMacAddress(event.target.value)}
                placeholder="e.g. 6c:3b:6b:fe:f1:5b"
                autoComplete="off"
                required
              />
            </div>
          </div>

          <button className="dhcp-submit" type="submit" disabled={loading}>
            {loading ? (
              <LoaderCircle size={19} className="dhcp-spin" />
            ) : (
              <Search size={19} />
            )}
            {loading ? "Processing..." : "Search DHCP Logs"}
          </button>
        </form>

        {loading && (
          <div className="dhcp-loading" aria-label="Loading">
            <div className="dhcp-spinner">
              <span />
              <span />
            </div>
            <p>Memproses simulasi pencarian...</p>
          </div>
        )}

        {!searched && !loading && (
          <div className="dhcp-status dhcp-info">
            <Lightbulb size={23} />
            <p>
              Masukkan MAC Address dan pilih IP server untuk melihat
              pratinjau hasil pencarian. Data yang ditampilkan masih
              berupa simulasi.
            </p>
          </div>
        )}

        {searched && !hasError && (
          <section className="dhcp-terminal">
            <div className="dhcp-terminal-header">
              <div className="dhcp-dots">
                <span />
                <span />
                <span />
              </div>

              <span className="dhcp-terminal-title">
                dhcp-log-viewer
              </span>

              <button
                type="button"
                className={`dhcp-copy ${copied ? "is-copied" : ""}`}
                onClick={handleCopy}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy Output"}
              </button>
            </div>

            <div className="dhcp-terminal-body">
              <pre>{message}</pre>
            </div>
          </section>
        )}

        {hasError && (
          <div className="dhcp-status dhcp-warning">
            <AlertTriangle size={23} />
            <p>{message}</p>
          </div>
        )}

        <footer className="dhcp-footer">
          NOC Tools · DHCP BNG Log Checker
        </footer>
      </main>
    </div>
  );
}
