
import { useState, type FormEvent } from "react";
import {
  Network,
  Search,
  AlertCircle,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";
import "./CekEaPopTool.css";

export default function CekEaPopTool() {
  const [ipEa, setIpEa] = useState("");
  const [searchedIp, setSearchedIp] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLookup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = ipEa.trim();
    const ipv4Pattern =
      /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;

    if (!ipv4Pattern.test(value)) {
      setSearchedIp("");
      setNotice("Format IP tidak valid. Contoh: 192.168.1.1");
      return;
    }

    setLoading(true);
    setSearchedIp("");
    setNotice("");

    // Simulasi UI saja; belum terhubung ke backend lookup.
    window.setTimeout(() => {
      setSearchedIp(value);
      setLoading(false);
      setNotice(
        "Pencarian demo selesai. Data IP Info dan hostname asli belum tersedia karena backend belum terhubung."
      );
    }, 600);
  };

  return (
    <div className="ea-tool">
      <div className="ea-glow ea-glow-top" />
      <div className="ea-glow ea-glow-bottom" />

      <main className="ea-container">
        <header className="ea-header">
          <div className="ea-heading-icon">
            <Network size={27} />
          </div>

          <h1>Lookup POP EA</h1>
          <p>
            Pencarian informasi POP EA berdasarkan alamat IP
          </p>

          <span className="ea-demo-label">
            UI DEMO · BACKEND NOT CONNECTED
          </span>
        </header>

        {notice && (
          <div
            className={`ea-notice ${
              notice.includes("tidak valid")
                ? "ea-notice-warning"
                : "ea-notice-info"
            }`}
            role="status"
          >
            <AlertCircle size={19} />
            <span>{notice}</span>
          </div>
        )}

        <form className="ea-form" onSubmit={handleLookup}>
          <div className="ea-section-heading">
            <h2>Cari Informasi EA</h2>
            <p>
              Masukkan alamat IP EA yang ingin diperiksa.
            </p>
          </div>

          <div className="ea-form-group">
            <label htmlFor="ea-ip">IP EA</label>
            <input
              id="ea-ip"
              type="text"
              value={ipEa}
              onChange={(event) => setIpEa(event.target.value)}
              placeholder="Contoh: 192.168.1.1"
              autoComplete="off"
              inputMode="decimal"
              required
            />
          </div>

          <button
            className="ea-primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle className="ea-spin" size={18} />
            ) : (
              <Search size={18} />
            )}
            {loading ? "Memproses..." : "Cari Informasi"}
          </button>
        </form>

        {loading && (
          <div className="ea-notice ea-notice-info">
            <LoaderCircle className="ea-spin" size={19} />
            <span>Memproses simulasi pencarian...</span>
          </div>
        )}

        {searchedIp && !loading && (
          <section className="ea-result">
            <div className="ea-result-heading">
              <CheckCircle2 size={20} />
              <h2>Pratinjau Hasil Pencarian</h2>
            </div>

            <div className="ea-result-row">
              <span>IP EA</span>
              <strong>{searchedIp}</strong>
            </div>

            <div className="ea-result-row">
              <span>IP Info</span>
              <strong>Belum tersedia</strong>
            </div>

            <div className="ea-result-row">
              <span>Hostname</span>
              <strong>Belum tersedia</strong>
            </div>

            <p className="ea-result-note">
              Hasil ini masih berupa simulasi. IP Info dan hostname
              akan ditampilkan setelah backend lookup terhubung.
            </p>
          </section>
        )}

        <footer className="ea-footer">
          NOC Tools · Lookup POP EA
        </footer>
      </main>
    </div>
  );
}
