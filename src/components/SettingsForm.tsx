"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const DEFAULTS = { compact: false, showDescriptions: true, confirmDelete: true };
type Settings = typeof DEFAULTS;

export default function SettingsForm() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("checklist-settings");
    if (stored) {
      try {
        setSettings({ ...DEFAULTS, ...JSON.parse(stored) });
      } catch {
        window.localStorage.removeItem("checklist-settings");
      }
    }
  }, []);

  function update(key: keyof Settings, value: boolean) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    window.localStorage.setItem("checklist-settings", JSON.stringify(next));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  function reset() {
    setSettings(DEFAULTS);
    window.localStorage.setItem("checklist-settings", JSON.stringify(DEFAULTS));
    setSaved(true);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Configuration</p>
          <h1 className="text-2xl font-semibold text-gray-900">Paramètres</h1>
        </div>
        <Link href="/" className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Retour</Link>
      </div>

      <section className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white shadow-sm">
        <label className="flex cursor-pointer items-center justify-between gap-4 p-4">
          <span><strong className="block text-sm font-medium text-gray-900">Affichage compact</strong><span className="text-xs text-gray-500">Réduit l&apos;espacement entre les tâches.</span></span>
          <input type="checkbox" checked={settings.compact} onChange={(event) => update("compact", event.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600" />
        </label>
        <label className="flex cursor-pointer items-center justify-between gap-4 p-4">
          <span><strong className="block text-sm font-medium text-gray-900">Afficher les descriptions</strong><span className="text-xs text-gray-500">Montre les notes directement dans la liste.</span></span>
          <input type="checkbox" checked={settings.showDescriptions} onChange={(event) => update("showDescriptions", event.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600" />
        </label>
        <label className="flex cursor-pointer items-center justify-between gap-4 p-4">
          <span><strong className="block text-sm font-medium text-gray-900">Confirmer les suppressions</strong><span className="text-xs text-gray-500">Demande une confirmation avant de supprimer une tâche.</span></span>
          <input type="checkbox" checked={settings.confirmDelete} onChange={(event) => update("confirmDelete", event.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600" />
        </label>
      </section>

      <div className="mt-4 flex items-center justify-between">
        <button type="button" onClick={reset} className="text-sm text-gray-500 hover:text-gray-900">Réinitialiser</button>
        <span className="text-sm text-green-700" aria-live="polite">{saved ? "Enregistré" : ""}</span>
      </div>
    </div>
  );
}
