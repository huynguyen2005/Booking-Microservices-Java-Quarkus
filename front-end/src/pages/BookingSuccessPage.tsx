function BookingSuccessPage() {
  return (
    <main className="pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto">
      <div className="flex flex-col items-center text-center mb-stack-lg">
        <div className="w-20 h-20 bg-secondary-container flex items-center justify-center rounded-full mb-6 shadow-lg shadow-secondary/20">
          <span className="material-symbols-outlined text-secondary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <h1 className="font-h1 text-h1 text-primary mb-4">Đặt chỗ thành công!</h1>
        <p className="text-body-lg text-on-surface-variant max-w-md">
          Chúc mừng! Hành trình của bạn đã được xác nhận. Hãy sẵn sàng cho chuyến đi tuyệt vời cùng SkyVoyage.
        </p>
      </div>

      <div className="glass-card rounded-xl p-8 mb-stack-lg flex flex-col md:flex-row justify-between items-center gap-gutter">
        <div>
          <span className="font-label-caps text-on-surface-variant block mb-1">MÃ ĐẶT CHỖ (PNR)</span>
          <span className="font-h2 text-h2 text-primary tracking-widest">SKV-2026-001234</span>
        </div>
        <div className="flex items-center gap-2 bg-primary/5 px-4 py-3 rounded-lg border border-primary/10">
          <span className="material-symbols-outlined text-primary">mail</span>
          <p className="text-body-md text-on-primary-fixed-variant">
            Chi tiết vé đã được gửi vào <span className="font-semibold text-primary">nguyenvan@email.com</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div className="md:col-span-8 glass-card rounded-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-h3 text-h3 text-primary flex items-center gap-2">
              <span className="material-symbols-outlined">flight_takeoff</span>
              Thông tin chuyến bay
            </h3>
            <span className="bg-surface-container-high px-4 py-1 rounded-full text-body-md font-medium text-primary">VN-123</span>
          </div>
          <div className="flex items-center justify-between relative">
            <div className="text-left">
              <p className="font-h2 text-h2 text-primary">HAN</p>
              <p className="text-on-surface-variant">Hà Nội</p>
            </div>
            <div className="flex-grow flex flex-col items-center px-4">
              <span className="text-body-md text-on-surface-variant mb-1">2h 10m</span>
              <div className="w-full h-[2px] bg-outline-variant relative">
                <div className="absolute -top-1 right-0 material-symbols-outlined text-primary text-sm">circle</div>
                <div className="absolute -top-1 left-0 material-symbols-outlined text-primary text-sm">circle</div>
              </div>
              <span className="text-body-md font-medium text-primary mt-1">15/06/2026</span>
            </div>
            <div className="text-right">
              <p className="font-h2 text-h2 text-primary">SGN</p>
              <p className="text-on-surface-variant">TP. Hồ Chí Minh</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col gap-gutter">
          <div className="glass-card rounded-xl p-6 flex-grow">
            <span className="font-label-caps text-on-surface-variant block mb-2">HÀNH KHÁCH</span>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-fixed rounded-full flex items-center justify-center text-primary font-bold">A</div>
              <p className="font-body-lg font-semibold text-primary">Nguyễn Văn A</p>
            </div>
            <span className="font-label-caps text-on-surface-variant block mb-1">TỔNG THANH TOÁN</span>
            <p className="font-h3 text-h3 text-[#FF8C00]">1.450.000 VNĐ</p>
          </div>
        </div>
      </div>

      <div className="mt-section-gap flex flex-col md:flex-row gap-stack-md justify-center">
        <button className="bg-[#FF8C00] text-white px-8 py-4 rounded-full font-h3 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-orange-500/20">
          <span className="material-symbols-outlined">picture_as_pdf</span>
          Tải vé điện tử (PDF)
        </button>
        <button className="bg-surface-container-highest text-primary px-8 py-4 rounded-full font-h3 hover:bg-surface-container-high transition-all active:scale-95">
          Xem chi tiết vé
        </button>
      </div>

      <div className="mt-8 text-center">
        <button onClick={() => { window.location.hash = '/flights' }} className="text-on-surface-variant hover:text-primary font-body-md flex items-center gap-2 mx-auto transition-colors group">
          <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Quay lại trang chủ
        </button>
      </div>

      <div className="mt-section-gap rounded-xl overflow-hidden relative h-[240px] shadow-xl">
        <img
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9ztwfT-XpGnzObacSQ5j5AR78En5JOSt0_OdSaB9qnd2AIakOhVGUURldbf89tKkkT7pFFA4BBxVPvQvBKXVZkllR0uSPT8uNDy7oZJoe7Q0VY3A_0Mr6v2FC3_rwfcIFC8-g_mMuYs8_EHhOEPmm7uoNGtDytb3eDWPOesXs_pCCs0z_zzLmqj_DPgtJTojhkwFFkPiBV8x1RN9oG4wjR2Zs_A01sCwiOFmUwqiTazBMvdw7sds2fqqoBYUZkeVpkEZ2dcR8xrI"
          alt="SkyVoyage"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent flex flex-col justify-center px-12 text-white">
          <h4 className="font-h3 mb-2">Khám phá dịch vụ mặt đất</h4>
          <p className="max-w-xs text-body-md opacity-90">
            Đặt xe đưa đón sân bay hoặc phòng chờ hạng thương gia ngay hôm nay để nhận ưu đãi 20%.
          </p>
        </div>
      </div>
    </main>
  )
}

export default BookingSuccessPage
