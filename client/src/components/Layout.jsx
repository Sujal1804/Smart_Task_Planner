import React from "react";

export default function Layout({ sidebar, main }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#070812' }}>
      <header className="border-b" style={{ borderColor: 'rgba(167, 176, 195, 0.1)', backgroundColor: 'rgba(15, 23, 36, 0.8)' }}>
        <div className="mx-auto max-w-[1600px] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6F8BFF 0%, #4BA3FF 100%)' }}>
              <span className="text-xl font-bold text-white">✓</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Smart Task Planner</h1>
              <p className="text-xs" style={{ color: '#A7B0C3' }}>
                Turn big goals into clear, actionable plans.
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-[1600px] px-6 py-6">
          <div className="flex flex-col xl:flex-row gap-6" style={{ gap: '24px' }}>
            <aside className="w-full xl:w-[30%] xl:max-w-[30%] flex-shrink-0">
              {sidebar}
            </aside>
            <section className="w-full xl:w-[70%] xl:flex-1">
              {main}
            </section>
          </div>
        </div>
      </main>
      <footer className="border-t py-4 text-center text-xs" style={{ borderColor: 'rgba(167, 176, 195, 0.1)', color: '#A7B0C3' }}>
        Backend: Node + Express + MongoDB | Frontend: React + Tailwind
      </footer>
    </div>
  );
}
