
import { useState, type FormEvent } from "react";
import "./CekBBIPJawaBali.css";

type LinkReport = {
  header: string;
  time: string;
  device_ip: string;
  summary: {
    total: number;
    up: number;
    down: number;
    unknown: number;
  };
  results: {
    Port: string;
    Status: "UP" | "DOWN" | "UNKNOWN";
    "Traffic In": string;
    "Traffic Out": string;
    CRC: string;
    "Cost OSPF": string;
  }[];
};

const linkOptions = [
  { id: "link-1", desc: "JAWA - BALI | Link 1" },
  { id: "link-2", desc: "JAWA - BALI | Link 2" },
  { id: "link-3", desc: "JAWA - BALI | Link 3" },
];

// Data simulasi sementara untuk membangun UI.
// Data ini bukan hasil pemeriksaan perangkat aktual.
const demoReports: Record<string, LinkReport[]> = {
  "link-1": [
    {
      header: "JAWA - BALI | Link 1",
      time: "12/10/2026 10:00:00",
      device_ip: "192.0.2.10",
      summary: { total: 3, up: 2, down: 1, unknown: 0 },
      results: [
        {
          Port: "GigabitEthernet0/0/0",
          Status: "UP",
          "Traffic In": "125 Mbps",
          "Traffic Out": "98 Mbps",
          CRC: "0",
          "Cost OSPF": "10",
        },
        {
          Port: "GigabitEthernet0/0/1",
          Status: "UP",
          "Traffic In": "80 Mbps",
          "Traffic Out": "75 Mbps",
          CRC: "0",
          "Cost OSPF": "20",
        },
        {
          Port: "GigabitEthernet0/0/2",
          Status: "DOWN",
          "Traffic In": "-",
          "Traffic Out": "-",
          CRC: "0",
          "Cost OSPF": "100",
        },
      ],
    },
  ],
  "link-2": [
    {
      header: "JAWA - BALI | Link 2",
      time: "12/10/2026 10:00:00",
      device_ip: "192.0.2.20",
      summary: { total: 3, up: 2, down: 0, unknown: 1 },
      results: [
        {
          Port: "TenGigabitEthernet0/1/0",
          Status: "UP",
          "Traffic In": "450 Mbps",
          "Traffic Out": "380 Mbps",
          CRC: "0",
          "Cost OSPF": "10",
        },
        {
          Port: "TenGigabitEthernet0/1/1",
          Status: "UP",
          "Traffic In": "320 Mbps",
          "Traffic Out": "290 Mbps",
          CRC: "2",
          "Cost OSPF": "20",
        },
        {
          Port: "TenGigabitEthernet0/1/2",
          Status: "UNKNOWN",
          "Traffic In": "-",
          "Traffic Out": "-",
          CRC: "-",
          "Cost OSPF": "-",
        },
      ],
    },
  ],
  "link-3": [
    {
      header: "JAWA - BALI | Link 3",
      time: "12/10/2026 10:00:00",
      device_ip: "192.0.2.30",
      summary: { total: 2, up: 2, down: 0, unknown: 0 },
      results: [
        {
          Port: "HundredGigE0/0/0",
          Status: "UP",
          "Traffic In": "8 Gbps",
          "Traffic Out": "7 Gbps",
          CRC: "0",
          "Cost OSPF": "5",
        },
        {
          Port: "HundredGigE0/0/1",
          Status: "UP",
          "Traffic In": "6 Gbps",
          "Traffic Out": "5 Gbps",
          CRC: "0",
          "Cost OSPF": "5",
        },
      ],
    },
  ],
};

export default function CekBBIPJawaBali() {
  const [selectedLink, setSelectedLink] = useState("link-1");
  const [reports, setReports] = useState<LinkReport[] | null>(null);
  const [loading, setLoading] = useState(false);

  function handleCheck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setReports(null);

    // Simulasi sementara, tidak memanggil backend.
    window.setTimeout(() => {
      setReports(demoReports[selectedLink] ?? []);
      setLoading(false);
    }, 700);
  }

  return (
    <div className="bbjb-page">
      <main className="bbjb-container">
        <h1 className="bbjb-title">
          <span aria-hidden="true">📡</span>
          Check Status Link Jawa - Bali
        </h1>

        <div className="bbjb-app-header">
          <div className="bbjb-user-info">
            Not logged in
          </div>

          <div>
            <a className="bbjb-logout-btn" href="/login">
              Login
            </a>
          </div>
        </div>

        <form className="bbjb-form" onSubmit={handleCheck}>
          <label htmlFor="bbjb-link">Pilih Link:</label>

          <select
            name="link_id"
            id="bbjb-link"
            value={selectedLink}
            onChange={(event) => setSelectedLink(event.target.value)}
            disabled={loading}
          >
            {linkOptions.map((link) => (
              <option key={link.id} value={link.id}>
                {link.desc}
              </option>
            ))}
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Memeriksa..." : "Cek"}
          </button>
        </form>

        {reports && (
          <section className="bbjb-reports">
            <div className="bbjb-demo-notice">
              MODE DEMO — data yang ditampilkan merupakan simulasi,
              bukan hasil pemeriksaan perangkat aktual.
            </div>

            {reports.length > 0 ? (
              reports.map((report, reportIndex) => (
                <article
                  className="bbjb-card"
                  key={`${report.header}-${reportIndex}`}
                >
                  <h2>{report.header}</h2>

                  <p className="bbjb-report-meta">
                    <b>Check Time:</b> {report.time}
                    {" | "}
                    <b>Device:</b> {report.device_ip}
                  </p>

                  <p className="bbjb-summary">
                    <b>Total:</b> {report.summary.total}
                    {" | "}
                    <span className="bbjb-up">
                      Up: {report.summary.up}
                    </span>
                    {" | "}
                    <span className="bbjb-down">
                      Down: {report.summary.down}
                    </span>
                    {" | "}
                    <span className="bbjb-unknown">
                      Unknown: {report.summary.unknown}
                    </span>
                  </p>

                  <div className="bbjb-table-wrapper">
                    <table className="bbjb-table">
                      <thead>
                        <tr>
                          <th>Port</th>
                          <th>Status</th>
                          <th>Traffic IN</th>
                          <th>Traffic OUT</th>
                          <th>CRC</th>
                          <th>Cost OSPF</th>
                        </tr>
                      </thead>

                      <tbody>
                        {report.results.map((result, index) => (
                          <tr key={`${result.Port}-${index}`}>
                            <td>{result.Port}</td>
                            <td
                              className={`bbjb-status-${result.Status.toLowerCase()}`}
                            >
                              {result.Status}
                            </td>
                            <td>{result["Traffic In"]}</td>
                            <td>{result["Traffic Out"]}</td>
                            <td>{result.CRC}</td>
                            <td>{result["Cost OSPF"]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              ))
            ) : (
              <p>Tidak ada laporan untuk link ini.</p>
            )}

            <button
              type="button"
              className="bbjb-back-button"
              onClick={() => setReports(null)}
            >
              ← Kembali ke Pemilihan Link
            </button>
          </section>
        )}

        <div className="bbjb-back-home">
          <a href="/">⬅️ Back to Home</a>
        </div>
      </main>

      {loading && (
        <div
          className="bbjb-loading-overlay"
          role="status"
          aria-live="polite"
        >
          <div className="bbjb-loader" />
          <p>Loading... Please wait</p>
        </div>
      )}
    </div>
  );
}
