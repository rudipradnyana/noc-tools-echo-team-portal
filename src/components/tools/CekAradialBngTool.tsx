
import { useState } from "react";
import "./CekAradialBngTool.css";

export default function CekAradialBngTool() {
  const [server, setServer] = useState("");
  const [customer, setCustomer] = useState("");
  const [message, setMessage] = useState(
    "Masukkan nama pelanggan dan pilih server untuk memulai."
  );
  const [searched, setSearched] = useState(false);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!server || !customer.trim()) {
      setMessage("Pilih server dan masukkan nama pelanggan terlebih dahulu.");
      setSearched(true);
      return;
    }

    setMessage(
      "Mode demo: pencarian log belum terhubung ke backend Aradial."
    );
    setSearched(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setMessage((current) => current);
      alert("Teks berhasil disalin.");
    } catch {
      alert("Gagal menyalin teks. Silakan salin secara manual.");
    }
  };

  return (
    <div className="aradial-page">
      <div className="aradial-glow aradial-glow-one" />
      <div className="aradial-glow aradial-glow-two" />

      <main className="aradial-container">
        <header className="aradial-header">
          <div className="aradial-logo">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m8 9 3 3-3 3m5 0h3M5 20h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" />
            </svg>
          </div>

          <h1>Check Log Aradial BNG</h1>
          <p>
            Inspect subscriber activity logs across all Aradial servers
          </p>
          <span className="aradial-demo-badge">UI DEMO</span>
        </header>

        <form className="aradial-form" onSubmit={handleSearch}>
          <div className="aradial-form-row">
            <div className="aradial-form-group">
              <label htmlFor="aradial-server">Pilih Server</label>
              <select
                id="aradial-server"
                value={server}
                onChange={(event) => setServer(event.target.value)}
                required
              >
                <option value="">Pilih server...</option>
                <option value="server-1">Server Aradial 1 (demo)</option>
                <option value="server-2">Server Aradial 2 (demo)</option>
              </select>
            </div>

            <div className="aradial-form-group">
              <label htmlFor="aradial-customer">Nama Pelanggan</label>
              <input
                id="aradial-customer"
                type="text"
                value={customer}
                onChange={(event) => setCustomer(event.target.value)}
                placeholder="e.g. username_pelanggan"
                autoComplete="off"
                required
              />
            </div>
          </div>

          <button className="aradial-search-button" type="submit">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            Search Aradial Logs
          </button>
        </form>

        {searched && (
          <section className="aradial-status" role="status">
            <span className="aradial-status-icon">ⓘ</span>
            <div>
              <strong>Status pencarian</strong>
              <p>{message}</p>
              <p className="aradial-status-detail">
                Server: {server || "-"} · Pelanggan: {customer || "-"}
              </p>
            </div>
          </section>
        )}

        <section className="aradial-terminal">
          <div className="aradial-terminal-header">
            <div className="aradial-terminal-dots">
              <span className="aradial-dot red" />
              <span className="aradial-dot yellow" />
              <span className="aradial-dot green" />
            </div>

            <span className="aradial-terminal-title">
              aradial-log-viewer
            </span>

            <button
              className="aradial-copy-button"
              type="button"
              onClick={handleCopy}
            >
              Copy Output
            </button>
          </div>

          <div className="aradial-terminal-body">
            <div className="aradial-terminal-line">
              <span className="aradial-terminal-prompt">$</span>{" "}
              aradial-log-viewer --status
            </div>
            <p>{message}</p>
            <p className="aradial-terminal-muted">
              Log output akan ditampilkan di sini setelah backend
              diintegrasikan.
            </p>
            <span className="aradial-cursor" />
          </div>
        </section>
      </main>
    </div>
  );
}
