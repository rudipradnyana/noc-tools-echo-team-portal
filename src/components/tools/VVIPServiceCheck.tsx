
import { useState } from "react";
import { Activity, Play, RefreshCw, RadioTower } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import "./VVIPServiceCheck.css";

type PingResult = {
  dst: string;
  success: number;
  rtt: string;
  reply: string;
};

type RouterResult = {
  title: string;
  hostname?: string;
  interface?: string;
  vrf?: string;
  ip?: string;
  ips?: { iface: string; addr: string }[];
  bgp?: { dst: string; gw: string; rv: string; rf: string }[];
  pings?: PingResult[];
  error?: string;
};

type ResultGroup = {
  group: string;
  routers: RouterResult[];
};

const demoResults: ResultGroup[] = [
  {
    group: "VVIP SERVICE CHECK — JAWA BALI",
    routers: [
      {
        title: "LINK UTAMA JAKARTA",
        hostname: "PE-JKT-ASR9K-01",
        interface: "Bundle-Ether10",
        vrf: "VRF-VVIP",
        ip: "192.0.2.10",
        ips: [
          { iface: "Bundle-Ether10", addr: "192.0.2.10/30" },
          { iface: "Loopback0", addr: "192.0.2.1/32" },
        ],
        bgp: [
          {
            dst: "198.51.100.0/24",
            gw: "192.0.2.9",
            rv: "Bundle-Ether10",
            rf: "PE-SBY-MX960",
          },
        ],
        pings: [
          {
            dst: "192.0.2.9",
            success: 100,
            rtt: "1.2/1.8/2.4",
            reply: "5/5",
          },
          {
            dst: "198.51.100.1",
            success: 100,
            rtt: "8.1/9.3/10.2",
            reply: "5/5",
          },
        ],
      },
      {
        title: "LINK BACKUP SURABAYA",
        hostname: "PE-SBY-MX960",
        interface: "xe-0/0/1",
        vrf: "VRF-VVIP",
        ip: "192.0.2.20",
        ips: [
          { iface: "xe-0/0/1", addr: "192.0.2.20/30" },
        ],
        bgp: [
          {
            dst: "203.0.113.0/24",
            gw: "192.0.2.21",
            rv: "xe-0/0/1",
            rf: "PE-JKT-ASR9K-01",
          },
        ],
        pings: [
          {
            dst: "192.0.2.21",
            success: 80,
            rtt: "8.1/12.5/25.4",
            reply: "4/5",
          },
        ],
      },
    ],
  },
];

export default function VVIPServiceCheck() {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResultGroup[] | null>(null);
  const [checkedAt, setCheckedAt] = useState("");

  const runCheck = () => {
    setLoading(true);
    setResults(null);

    window.setTimeout(() => {
      setResults(demoResults);
      setCheckedAt(new Date().toLocaleString("id-ID"));
      setLoading(false);
    }, 800);
  };

  return (
    <div className={`vvip-page ${isDark ? "vvip-dark" : "vvip-light"}`}>
      <div className="vvip-heading">
        <div className="vvip-heading-icon">
          <RadioTower size={23} />
        </div>
        <div>
          <h2>VVIP Service Check</h2>
          <p>Monitoring status service, routing, dan konektivitas</p>
        </div>
      </div>

      <section className="vvip-panel">
        <div className="vvip-panel-copy">
          <Activity size={20} />
          <div>
            <strong>Service Connectivity Check</strong>
            <p>
              Jalankan simulasi pemeriksaan link dan tampilkan ringkasan hasil.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="vvip-run-btn"
          onClick={runCheck}
          disabled={loading}
        >
          {loading ? (
            <RefreshCw size={16} className="vvip-spin" />
          ) : (
            <Play size={16} />
          )}
          {loading ? "Memeriksa..." : "Run Script"}
        </button>
      </section>

      {loading && (
        <div className="vvip-loading" role="status" aria-live="polite">
          <span className="vvip-spinner" />
          <p>Sedang memproses pemeriksaan...</p>
        </div>
      )}

      {results && (
        <section className="vvip-results">
          <div className="vvip-result-header">
            <div>
              <h3>📡 Status Service VVIP</h3>
              <p>Waktu Check: {checkedAt}</p>
            </div>
            <span className="vvip-demo-badge">DATA SIMULASI</span>
          </div>

          {results.map((group) => (
            <article className="vvip-group-card" key={group.group}>
              <h3>{group.group}</h3>

              {group.routers.map((router) => (
                <div
                  className={`vvip-router ${
                    router.error ? "vvip-router-error" : ""
                  }`}
                  key={router.title}
                >
                  <h4>{router.title}</h4>

                  {router.hostname && (
                    <div className="vvip-router-info">
                      <p><b>Hostname:</b> {router.hostname}</p>
                      <p><b>Interface:</b> {router.interface}</p>
                      <p><b>VRF:</b> {router.vrf}</p>
                      <p><b>IP Address:</b> {router.ip}</p>
                    </div>
                  )}

                  {router.ips && router.ips.length > 0 && (
                    <>
                      <h5>IP ADDRESSES</h5>
                      <div className="vvip-table-wrap">
                        <table>
                          <thead>
                            <tr>
                              <th>Interface</th>
                              <th>IP Address</th>
                            </tr>
                          </thead>
                          <tbody>
                            {router.ips.map((item) => (
                              <tr key={`${item.iface}-${item.addr}`}>
                                <td>{item.iface}</td>
                                <td>{item.addr}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {router.bgp && router.bgp.length > 0 && (
                    <>
                      <h5>BGP ROUTES</h5>
                      <div className="vvip-table-wrap">
                        <table>
                          <thead>
                            <tr>
                              <th>Destination</th>
                              <th>Gateway</th>
                              <th>Reachable Via</th>
                              <th>Received From</th>
                            </tr>
                          </thead>
                          <tbody>
                            {router.bgp.map((route, index) => (
                              <tr key={`${route.dst}-${index}`}>
                                <td>{route.dst}</td>
                                <td>{route.gw}</td>
                                <td>{route.rv}</td>
                                <td>{route.rf}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {router.pings && router.pings.length > 0 && (
                    <>
                      <h5>PING RESULT</h5>
                      <div className="vvip-table-wrap">
                        <table>
                          <thead>
                            <tr>
                              <th>Destination</th>
                              <th>Success Rate (%)</th>
                              <th>Min/Avg/Max (ms)</th>
                              <th>Total Reply</th>
                            </tr>
                          </thead>
                          <tbody>
                            {router.pings.map((ping, index) => (
                              <tr
                                key={`${ping.dst}-${index}`}
                                className={
                                  ping.success === 0 ||
                                  ping.reply.startsWith("0/")
                                    ? "vvip-ping-error"
                                    : ""
                                }
                              >
                                <td>{ping.dst}</td>
                                <td>
                                  <span
                                    className={`vvip-status ${
                                      ping.success === 100
                                        ? "vvip-status-up"
                                        : "vvip-status-warning"
                                    }`}
                                  >
                                    {ping.success}%
                                  </span>
                                </td>
                                <td>{ping.rtt}</td>
                                <td>{ping.reply}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {router.error && (
                    <p className="vvip-error">{router.error}</p>
                  )}
                </div>
              ))}
            </article>
          ))}

          <p className="vvip-disclaimer">
            Data di atas hanya untuk demonstrasi UI, bukan hasil monitoring
            router aktual.
          </p>

          <button
            type="button"
            className="vvip-back-btn"
            onClick={() => setResults(null)}
          >
            ← Kembali
          </button>
        </section>
      )}
    </div>
  );
}
