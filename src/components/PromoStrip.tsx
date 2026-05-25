"use client";

export function PromoStrip() {
  return (
    <div
      className="w-full rounded-lg p-3 flex items-center justify-center font-semibold shadow-sm"
      style={{
        backgroundColor: 'var(--accent-primary)',
        color: 'var(--text-on-amber)',
        boxShadow: 'var(--shadow-amber)',
      }}
    >
      <div className="max-w-6xl w-full flex items-center justify-between px-4">
        <div className="font-semibold">Limited time: Free shipping over ETB 5,000</div>
        <div className="text-sm opacity-90">Ends: May 25, 23:59</div>
      </div>
    </div>
  );
}
