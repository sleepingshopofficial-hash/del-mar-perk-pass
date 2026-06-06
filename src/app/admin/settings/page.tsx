'use client';

import { Settings, Database, FileSpreadsheet, Calendar } from 'lucide-react';

export default function AdminSettings() {
  const sheetsConfigured = !!process.env.NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Event Info */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4"><Calendar className="w-5 h-5 text-orange" /><h2 className="text-lg font-bold text-white">Event Configuration</h2></div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Event Name</span><span className="text-white">Del Mar 2026</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Page Title</span><span className="text-white">Del Mar Fair Perk Pass</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Partner</span><span className="text-white">Mom&apos;s Bakeshoppe (Cookie Perk)</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="text-green-400">Active</span></div>
        </div>
      </div>

      {/* Database */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4"><Database className="w-5 h-5 text-blue-400" /><h2 className="text-lg font-bold text-white">Database</h2></div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Provider</span><span className="text-white">Supabase (PostgreSQL)</span></div>
          <div className="flex justify-between"><span className="text-gray-400">URL</span><span className="text-white font-mono text-xs">{process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Configured' : '✗ Not set'}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">RLS Policies</span><span className="text-green-400">Enabled</span></div>
        </div>
      </div>

      {/* Google Sheets */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4"><FileSpreadsheet className="w-5 h-5 text-green-400" /><h2 className="text-lg font-bold text-white">Google Sheets Sync</h2></div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Status</span>
            <span className={sheetsConfigured ? 'text-green-400' : 'text-yellow-400'}>{sheetsConfigured ? 'Configured' : 'Not configured'}</span>
          </div>
          {!sheetsConfigured && (
            <div className="bg-gray-700/50 rounded-lg p-4 mt-2">
              <p className="text-gray-300 text-xs mb-2">To enable Google Sheets sync, set these environment variables:</p>
              <ul className="text-xs text-gray-400 list-disc list-inside space-y-1">
                <li><code>GOOGLE_SHEETS_SPREADSHEET_ID</code></li>
                <li><code>GOOGLE_SHEETS_CLIENT_EMAIL</code></li>
                <li><code>GOOGLE_SHEETS_PRIVATE_KEY</code></li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Integration */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4"><Settings className="w-5 h-5 text-gray-400" /><h2 className="text-lg font-bold text-white">Integration Info</h2></div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">External Link</span><span className="text-blue-400">coolerpads.com</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Tracking</span><span className="text-white">coolerpads_click events</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Languages</span><span className="text-white">English, Español</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Paths</span><span className="text-white">8 adaptive paths</span></div>
        </div>
      </div>
    </div>
  );
}
