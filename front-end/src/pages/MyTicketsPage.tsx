function MyTicketsPage() {
  return (
    <main className="pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <header className="mb-stack-lg text-center md:text-left">
        <h1 className="font-h1 text-h1 text-primary mb-unit">Vé của tôi</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Quản lý tất cả vé máy bay của bạn</p>
      </header>

      <div className="flex flex-col md:flex-row justify-between items-center mb-stack-lg gap-gutter">
        <div className="flex bg-surface-container rounded-full p-1 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-stack-lg py-2 rounded-full text-on-primary bg-primary-container font-semibold transition-all">Tất cả</button>
          <button className="flex-1 md:flex-none px-stack-lg py-2 rounded-full text-on-surface-variant hover:bg-white/50 transition-all font-semibold">Sân bay</button>
          <button className="flex-1 md:flex-none px-stack-lg py-2 rounded-full text-on-surface-variant hover:bg-white/50 transition-all font-semibold">Đã bay</button>
          <button className="flex-1 md:flex-none px-stack-lg py-2 rounded-full text-on-surface-variant hover:bg-white/50 transition-all font-semibold">Đã hủy</button>
        </div>
        <div className="flex items-center gap-stack-sm bg-white/40 border border-white/20 backdrop-blur-xl px-4 py-2 rounded-xl cursor-pointer hover:shadow-sm transition-shadow">
          <span className="material-symbols-outlined text-primary">tune</span>
          <span className="font-semibold text-primary">Bộ lọc</span>
        </div>
      </div>

      <div className="space-y-stack-lg">
        <article className="glass-card rounded-xl shadow-[0px_10px_30px_rgba(0,51,102,0.08)] flex flex-col md:flex-row overflow-hidden relative group hover:shadow-[0px_15px_40px_rgba(0,51,102,0.12)] transition-all">
          <div className="flex-1 p-stack-lg relative">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2">
                <span className="font-h3 text-h3 font-extrabold text-primary">SkyVoyage</span>
                <span className="text-label-caps bg-surface-container-low px-2 py-1 rounded border border-outline-variant/30">SKV-2026-001234</span>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-label-caps border border-green-200">Đã thanh toán</span>
                <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-label-caps border border-orange-200">Chờ check-in</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-center">
              <div className="space-y-1">
                <p className="text-label-caps text-on-surface-variant">Hành khách</p>
                <p className="font-bold text-primary text-body-lg">Nguyễn Văn A</p>
                <p className="text-label-caps text-on-surface-variant mt-4">Hãng & Chuyến bay</p>
                <p className="font-semibold text-on-surface">Vietnam Airlines (VN-123)</p>
              </div>
              <div className="flex items-center justify-between col-span-1 md:col-span-2">
                <div className="text-left"><h2 className="font-h2 text-h2 text-primary">HAN</h2><p className="text-body-md text-on-surface-variant">Hà nội</p><p className="font-bold text-primary mt-2">06:00</p></div>
                <div className="flex flex-col items-center flex-1 px-4">
                  <span className="text-label-caps text-on-surface-variant mb-1">15/06/2026</span>
                  <div className="w-full flex items-center gap-2">
                    <div className="h-[2px] flex-1 bg-outline-variant relative"><div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-primary"></div></div>
                    <span className="material-symbols-outlined text-primary rotate-90">flight</span>
                    <div className="h-[2px] flex-1 bg-outline-variant relative"><div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-primary"></div></div>
                  </div>
                  <span className="text-label-caps text-on-surface-variant mt-1">2h 10m</span>
                </div>
                <div className="text-right"><h2 className="font-h2 text-h2 text-primary">SGN</h2><p className="text-body-md text-on-surface-variant">TP. Hồ Chí Minh</p><p className="font-bold text-primary mt-2">08:10</p></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-stack-md mt-8 pt-6 border-t border-outline-variant/20">
              <div><p className="text-label-caps text-on-surface-variant uppercase">Ghế</p><p className="font-bold text-primary">12A</p></div>
              <div><p className="text-label-caps text-on-surface-variant uppercase">Hạng</p><p className="font-bold text-primary">Phổ thông</p></div>
              <div><p className="text-label-caps text-on-surface-variant uppercase">Cổng</p><p className="font-bold text-primary">A5</p></div>
            </div>
          </div>

          <div className="w-full md:w-80 p-stack-lg flex flex-col items-center justify-center relative ticket-perforation bg-white/30">
            <div className="semi-circle-top hidden md:block"></div>
            <div className="semi-circle-bottom hidden md:block"></div>
            <div className="text-center mb-6"><p className="text-label-caps text-on-surface-variant mb-2">Giờ lên máy bay bay</p><p className="font-h2 text-h2 text-primary">05:30</p></div>
            <div className="w-32 h-32 bg-white p-2 rounded-lg shadow-sm border border-outline-variant/30 mb-6 flex items-center justify-center">
              <img alt="Ticket QR Code" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi3vNkYMpHrUT2fVzdc3cv8k-Oz0mmhAt6Wu2VXz4A4JXpo2riPIYn_WVg1xaCJ3X18hjHONOaQd-lfHyE_Cgsl2Z9IP30RNkVRMS_QyeMLtQOlzJk7MSnB3RJNdYYhjhMPl7YWWtKF2LUtXKeMLZzcWsd9t4t146gc5OoFi1xll2yAP5K0sUULrgA5lTWo4JkAqbtfAHEsSmlQ2PMJTiW_5hb1-YN75uOpq6O3vIVgMx6uRny7IwC2cAov2b0XY-36LwnZc8BWuk" />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <button className="w-full bg-[#FF8C00] text-white py-3 rounded-xl font-bold btn-orange-glow transition-all active:scale-95 shadow-lg shadow-orange-500/20">Check-in ngay</button>
              <button onClick={() => { window.location.hash = '/ticket-detail' }} className="w-full border border-primary text-primary py-3 rounded-xl font-bold hover:bg-primary/5 transition-all active:scale-95">Xem chi tiết</button>
            </div>
          </div>
        </article>
      </div>

      <section className="mt-section-gap">
        <div className="relative rounded-3xl overflow-hidden h-[300px] flex items-center px-stack-lg md:px-margin-desktop">
          <img className="absolute inset-0 w-full h-full object-cover z-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8aZGwNd-BKMuC4zj7LIy4aTxXZsN60_IXloPBVrFZTBdJ46SdQ6S3noscXI0KontQmj-sF9oha01AQifTORMkno0MEIETNGNSu1ChBSXgwl4D5-gT7EkQ9gDRBe44u-axSehHys-F_1P7GzIo4rnGYMCh3TAdu1eMHS57-GUZMHvlqk1Oi7IE-npOcXuzJeOepDmG5TBy3yzHz8Rzl2YkdAa2mX1jKnsMx3BdRlDtM6io7yBy0C7yqrqqf_vs-EGuj_fs9-S3OKE" alt="Airplane in sky" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent z-10"></div>
          <div className="relative z-20 max-w-lg text-white">
            <h2 className="font-h2 text-h2 mb-stack-sm">Bạn chưa có chuyến bay nào?</h2>
            <p className="text-body-lg mb-stack-lg opacity-90">Hãy bắt đầu hành trình mới cùng SkyVoyage và tận hưởng dịch vụ hàng không đẳng cấp quốc tế.</p>
            <button onClick={() => { window.location.hash = '/flights' }} className="bg-[#FF8C00] text-white px-stack-lg py-4 rounded-xl font-bold btn-orange-glow transition-all active:scale-95 flex items-center gap-2">
              Tìm chuyến bay <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default MyTicketsPage
