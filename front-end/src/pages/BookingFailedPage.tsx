function BookingFailedPage() {
  return (
    <main className="pt-[120px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <section className="flex flex-col items-center text-center mb-stack-lg">
        <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mb-stack-md">
          <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'wght' 700" }}>
            close
          </span>
        </div>
        <h1 className="font-h2 text-h2 text-on-surface mb-stack-sm">Thanh toán không thành công!</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Rất tiếc, đã có lỗi xảy ra trong quá trình xử lý giao dịch của bạn. Vui lòng kiểm tra lại thông tin và thử lại.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div className="md:col-span-8 flex flex-col gap-gutter">
          <div className="glass-card p-stack-lg rounded-xl">
            <div className="flex justify-between items-start border-b border-outline-variant/30 pb-stack-md mb-stack-md">
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant">Mã đặt chỗ (PNR)</span>
                <div className="font-h3 text-h3 text-primary">SKV-2026-001234</div>
              </div>
              <div className="bg-error-container text-on-error-container px-3 py-1 rounded-full font-label-caps text-label-caps">
                Thất bại
              </div>
            </div>

            <div className="bg-error/5 border border-error/20 rounded-lg p-stack-md mb-stack-lg">
              <div className="flex gap-2 items-center text-error mb-1">
                <span className="material-symbols-outlined text-[20px]">error</span>
                <span className="font-label-caps text-label-caps">Lý do thất bại</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface">
                Số dư tài khoản không đủ hoặc thẻ bị từ chối. Vui lòng liên hệ ngân hàng phát hành thẻ để biết thêm chi tiết.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Hành khách</span>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">person</span>
                  <span className="font-body-md text-body-md font-semibold">Nguyễn Văn A</span>
                </div>
              </div>
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Chuyến bay</span>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">flight_takeoff</span>
                  <span className="font-body-md text-body-md font-semibold">VN-123 | 15/06/2026</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-stack-lg rounded-xl">
            <h3 className="font-h3 text-h3 mb-stack-md text-primary">Chi tiết hành trình</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-stack-lg">
              <div className="text-center md:text-left">
                <div className="font-h2 text-h2 text-primary">HAN</div>
                <div className="font-body-md text-body-md text-on-surface-variant">Hà Nội</div>
              </div>
              <div className="flex-1 flex flex-col items-center px-stack-lg">
                <div className="w-full flex items-center gap-2">
                  <div className="h-[2px] flex-1 bg-outline-variant"></div>
                  <span className="material-symbols-outlined text-primary rotate-90 md:rotate-0">flight</span>
                  <div className="h-[2px] flex-1 bg-outline-variant"></div>
                </div>
                <div className="font-label-caps text-label-caps text-on-surface-variant mt-2">Bay thẳng | 2h 15m</div>
              </div>
              <div className="text-center md:text-right">
                <div className="font-h2 text-h2 text-primary">SGN</div>
                <div className="font-body-md text-body-md text-on-surface-variant">TP. Hồ Chí Minh</div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col gap-gutter">
          <div className="glass-card p-stack-lg rounded-xl flex flex-col">
            <h3 className="font-h3 text-h3 mb-stack-md text-primary">Tổng cộng</h3>
            <div className="flex justify-between items-center mb-stack-lg">
              <span className="font-body-md text-body-md text-on-surface-variant">Giá vé & Thuế</span>
              <span className="font-h3 text-h3 text-on-surface">1.450.000 VNĐ</span>
            </div>
            <div className="flex flex-col gap-stack-md">
              <button
                onClick={() => {
                  window.location.hash = '/payment'
                }}
                className="w-full py-4 bg-[#FF8C00] text-white rounded-full font-h3 text-h3 hover:shadow-[0_0_20px_rgba(255,140,0,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">refresh</span>
                Thử lại thanh toán
              </button>
              <button
                onClick={() => {
                  window.location.hash = '/flights'
                }}
                className="w-full py-4 border-2 border-primary text-primary rounded-full font-h3 text-h3 hover:bg-primary/5 transition-all active:scale-95"
              >
                Về trang chủ
              </button>
            </div>
            <div className="mt-stack-lg pt-stack-lg border-t border-outline-variant/30 text-center">
              <p className="font-body-md text-body-md text-on-surface-variant mb-stack-sm">Cần hỗ trợ ngay?</p>
              <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                <span className="material-symbols-outlined">headset_mic</span>
                1900 1234
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden relative h-48 flex items-end p-6 group">
            <img
              alt="Payment Security"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPXDfEZkWdDZFCKgQQJ2Cize1cGNWWzytoJcugjS-29z3ljtWzJitvMWw7vCSvf9cOVgpc8u375QUld-8VhDRPmRFW3Y01swdj6_VKJA0bTUSy5M67IV0vN5hbUegd8ixdWB8O72pK1aNEbVSyDoBFpNEVZPQoR8-2hbu4ftlUy6yjv_e2ca_ulUJ27cGOngHuP8dnZY5wcAKLL3K96RFOpBLGxV3uVKQ8VQcBzv6rL8ojMx3LijGX75oJcxH0vmqY80uVCFm-QSE"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
            <div className="relative z-10">
              <p className="text-white font-semibold">Thanh toán an toàn 100%</p>
              <p className="text-white/80 text-sm">Hệ thống bảo mật tiêu chuẩn quốc tế PCI DSS</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default BookingFailedPage
