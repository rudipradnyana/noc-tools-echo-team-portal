
import { useState, type FormEvent } from "react";
import "./CekIpPublik.css";

type SearchResults = {
  gandul: string[];
  garsak: string[];
  gandul100g: string[];
};

const dummyResults: SearchResults = {
  gandul: [
    "IP Address: 203.0.113.10",
    "Status: Reachable",
    "Interface: WAN-1",
  ],
  garsak: [
    "IP Address: 203.0.113.10",
    "Status: Reachable",
    "Interface: WAN-2",
  ],
  gandul100g: [
    "IP Address: 203.0.113.10",
    "Status: Reachable",
    "Interface: 100G",
  ],
};

function ResultCard({
  title,
  results,
}: {
  title: string;
  results: string[];
}) {
  return (
    <section className="cek-ip-results-card">
      <h2 className="cek-ip-section-title">{title}</h2>

      {results.length > 0 ? (
        <div className="cek-ip-table-wrapper">
          <table className="cek-ip-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Hasil Pencarian</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={`${title}-${index}`}>
                  <td>{index + 1}</td>
                  <td>{result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="cek-ip-no-results">
          Tidak ada hasil untuk {title}.
        </p>
      )}
    </section>
  );
}

export default function CekIpPublik() {
  const [ipAddress, setIpAddress] = useState("");
  const [searchedIp, setSearchedIp] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const ip = ipAddress.trim();
    if (!ip) return;

    // UI DEMO: hasil ini masih dummy, belum mencari IP sebenarnya.
    setSearchedIp(ip);
    setResults({
      gandul: dummyResults.gandul.map((item) =>
        item.replace("203.0.113.10", ip)
      ),
      garsak: dummyResults.garsak.map((item) =>
        item.replace("203.0.113.10", ip)
      ),
      gandul100g: dummyResults.gandul100g.map((item) =>
        item.replace("203.0.113.10", ip)
      ),
    });
  };

  return (
    <div className="cek-ip-page">
      <header className="cek-ip-header">
        <div className="cek-ip-logo">🌐 Tool Cek Internet</div>
      </header>

      <main className="cek-ip-container">
        <section className="cek-ip-search-card">
          <div className="cek-ip-card-heading">
            <h1>Cek IP Publik</h1>
            <p>
              Masukkan alamat IP untuk melihat hasil pencarian.
            </p>
          </div>

          <form className="cek-ip-form" onSubmit={handleSearch}>
            <label htmlFor="cek-ip-address">Alamat IP</label>

            <input
              id="cek-ip-address"
              type="text"
              name="ip_address"
              value={ipAddress}
              onChange={(event) => setIpAddress(event.target.value)}
              placeholder="Masukkan alamat IP yang ingin dicari"
              autoComplete="off"
              required
            />

            <button className="cek-ip-btn-search" type="submit">
              Cari IP
            </button>
          </form>

          {results && (
            <p className="cek-ip-demo-notice">
              Mode demo: hasil di bawah adalah data dummy untuk{" "}
              <strong>{searchedIp}</strong>, bukan hasil pemeriksaan
              perangkat sebenarnya.
            </p>
          )}
        </section>

        {results && (
          <div className="cek-ip-results">
            <ResultCard title="GANDUL" results={results.gandul} />
            <ResultCard title="GARSAK" results={results.garsak} />
            <ResultCard
              title="GANDUL 100G"
              results={results.gandul100g}
            />

            <button
              type="button"
              className="cek-ip-back-button"
              onClick={() => {
                setResults(null);
                setSearchedIp("");
              }}
            >
              ← Kembali ke Pencarian
            </button>
          </div>
        )}
      </main>

      <div className="cek-ip-watermark">JozzLabs</div>
    </div>
  );
}
