import React, { useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { useActivity } from '../../context/ActivityContext';
import { useAuth } from '../../context/AuthContext';

interface DataTerminasiRow {
  hostname: string;
  ip_loopback: string;
  port: string;
}

export const DataTerminasiTool: React.FC = () => {
  const { user } = useAuth();
  const { logActivity } = useActivity();
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<DataTerminasiRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const search = async (event: React.FormEvent) => {
    event.preventDefault();
    const serviceId = query.trim();
    if (!serviceId) return;

    setLoading(true);
    setError(null);
    setRows([]);
    setSearched(true);
    logActivity({
      title: `Lookup Data Terminasi: ${serviceId}`,
      actor: user?.name || user?.username || 'Operator NOC',
      badge: 'Diagnostic',
      iconName: 'Search',
      iconBg: 'bg-blue-600',
      actionToolId: 'data-terminasi',
    });

    try {
      const baseUrl = import.meta.env.VITE_DATA_TERMINASI_API_URL || 'http://localhost:5009/api/data-terminasi';
      const separator = baseUrl.includes('?') ? '&' : '?';
      const response = await fetch(`${baseUrl}${separator}service_id=${encodeURIComponent(serviceId)}`);
      if (!response.ok) throw new Error(`API mengembalikan HTTP ${response.status}`);
      const payload = await response.json();
      const result = Array.isArray(payload) ? payload : payload.results;
      if (!Array.isArray(result)) throw new Error('Format response API tidak dikenali');
      setRows(result);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Gagal menghubungi API Data Terminasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-50 p-4 sm:p-6 text-slate-900">
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h2 className="text-xl font-bold text-blue-600">🔎 Data Terminasi Service ID</h2>
          <span className="text-xs text-slate-500">Network Configuration Lookup</span>
        </div>

        <form onSubmit={search} className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Masukkan Service ID"
            required
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
          <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </form>

        {error && <div className="rounded-lg border border-amber-300 bg-amber-50 text-amber-700 p-4 text-sm mb-4">API Data Terminasi belum terhubung: {error}</div>}
        {searched && !loading && !error && rows.length === 0 && <div className="rounded-lg border border-amber-300 bg-amber-50 text-amber-700 p-4 text-sm">⚠️ Service ID &quot;{query}&quot; tidak ditemukan.</div>}

        {rows.length > 0 && (
          <>
            <h5 className="mb-3 text-base font-semibold">Hasil pencarian untuk: <span className="text-red-600">{query}</span></h5>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800 text-white"><tr><th className="px-4 py-3">Hostname</th><th className="px-4 py-3">IP Loopback</th><th className="px-4 py-3">Port</th></tr></thead>
                <tbody>{rows.map((row, index) => <tr key={`${row.hostname}-${row.port}-${index}`} className="border-t border-slate-200 hover:bg-slate-50"><td className="px-4 py-3 font-semibold">{row.hostname}</td><td className="px-4 py-3 font-mono">{row.ip_loopback}</td><td className="px-4 py-3">{row.port}</td></tr>)}</tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
