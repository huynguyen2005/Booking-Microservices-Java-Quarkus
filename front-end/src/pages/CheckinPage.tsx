function CheckinPage() {
  return (
    <main className="flex-grow pt-24 pb-stack-lg px-margin-mobile flex items-center justify-center bg-sky-gradient min-h-[calc(100vh-160px)]">
      <section className="w-full max-w-[600px] text-center">
        <div className="glass-card p-stack-lg rounded-xl space-y-stack-lg">
          <div className="w-20 h-20 bg-primary-container/10 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[48px] text-primary">flight_takeoff</span>
          </div>

          <div>
            <h1 className="font-h1 text-h2 text-primary">Check-in Online</h1>
            <p className="font-body-lg text-on-surface-variant mt-2">Nhập mã vé để thực hiện check-in</p>
          </div>

          <div className="space-y-stack-md text-left">
            <label className="font-label-caps text-on-surface-variant block uppercase tracking-wider">Mã đặt chỗ / PNR</label>
            <input
              className="w-full bg-white border border-outline-variant rounded-lg p-4 text-h3 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all"
              placeholder="SKV-2026-001234"
              type="text"
            />
          </div>

          <button className="w-full bg-[#FF8C00] text-white py-4 px-8 rounded-full font-h3 cta-glow transition-all active:scale-[0.98]">
            Kiểm tra vé
          </button>

          <p className="text-label-caps text-on-surface-variant/60 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[14px]">info</span>
            Check-in mở trước 24 giờ khởi hành
          </p>
        </div>
      </section>
    </main>
  )
}

export default CheckinPage
