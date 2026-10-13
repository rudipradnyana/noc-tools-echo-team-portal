import React, { useState } from 'react';

export const CekConfigCNGTool: React.FC = () => {
  const [regional, setRegional] = useState('');
  const [sidOrMac, setSidOrMac] = useState('');

  return (
    <div className="rounded-2xl bg-slate-50 p-4 sm:p-6 text-slate-900">
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="text-xl font-bold text-blue-600">
            Cek Config Service String di CNG
          </h2>

          <span className="text-xs text-slate-500">
            CNG Configuration Lookup
          </span>
        </div>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="regional"
              className="block text-sm font-medium mb-2"
            >
              Regional:
            </label>

            <select
              id="regional"
              name="regional"
              value={regional}
              onChange={(event) => setRegional(event.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">Pilih Regional</option>
              {/* Pilihan regional ditambahkan setelah sumber datanya diketahui */}
            </select>
          </div>

          <div>
            <label
              htmlFor="sid_or_mac"
              className="block text-sm font-medium mb-2"
            >
              SID / MAC Address:
            </label>

            <input
              id="sid_or_mac"
              name="sid_or_mac"
              type="text"
              value={sidOrMac}
              onChange={(event) => setSidOrMac(event.target.value)}
              placeholder="Masukkan SID / MAC Address"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
          >
            Cek
          </button>
        </form>

        {/* Area hasil ditampilkan setelah integrasi fungsi pemeriksaan */}
      </div>
    </div>
  );
};