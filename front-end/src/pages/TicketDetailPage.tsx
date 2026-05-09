function TicketDetailPage() {
  return (
    <main className="flex-grow pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      <div className="relative mb-stack-lg text-center">
        <h1 className="font-h1 text-h2 md:text-h1 text-primary mb-stack-sm">Thông tin chuyến bay</h1>
        <p className="text-on-surface-variant font-body-lg">Cảm ơn quý khách đã tin tưởng lựa chọn SkyVoyage.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8 space-y-gutter">
          <div className="glass-card rounded-xl p-stack-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-md">
            <div>
              <span className="text-label-caps font-label-caps text-on-surface-variant">MÃ ĐẶT CHỖ (PNR)</span>
              <h2 className="text-h2 font-h2 text-primary tracking-widest mt-1">SVY8892A</h2>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <span className="text-label-caps font-label-caps text-on-surface-variant">TRẠNG THÁI VÉ</span>
              <div className="mt-2 flex items-center gap-2 bg-[#E7F3FF] text-[#0061A6] px-4 py-1 rounded-full">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span className="font-bold">Đã xác nhận & Thanh toán</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl overflow-hidden">
            <div className="bg-primary/5 p-stack-md border-b border-white/20">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">flight_takeoff</span>
                  <span className="font-h3 text-h3 text-primary">Chuyến bay SV 102</span>
                </div>
                <span className="bg-white/50 px-3 py-1 rounded-full text-label-caps font-label-caps border border-outline-variant">
                  HẠNG THƯƠNG GIA
                </span>
              </div>
            </div>

            <div className="p-stack-lg">
              <div className="flex flex-col md:flex-row items-center justify-between gap-stack-lg mb-stack-lg">
                <div className="text-center md:text-left flex-1">
                  <p className="text-h3 font-h3 text-primary">TP. Hồ Chí Minh</p>
                  <p className="text-on-surface-variant">Sân bay Tân Sơn Nhất (SGN)</p>
                  <div className="mt-4">
                    <p className="text-h2 font-h2 text-primary">08:30</p>
                    <p className="text-body-md font-medium text-on-surface-variant">15 Thg 12, 2024</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center flight-path w-full">
                  <span className="text-label-caps font-label-caps text-on-surface-variant bg-background px-3 z-10">2h 15m</span>
                  <div className="relative w-full h-px my-4"></div>
                  <span className="material-symbols-outlined text-primary text-3xl rotate-90 -mt-8 bg-background z-10 px-2">flight</span>
                </div>

                <div className="text-center md:text-right flex-1">
                  <p className="text-h3 font-h3 text-primary">Hà Nội</p>
                  <p className="text-on-surface-variant">Sân bay Nội Bài (HAN)</p>
                  <div className="mt-4">
                    <p className="text-h2 font-h2 text-primary">10:45</p>
                    <p className="text-body-md font-medium text-on-surface-variant">15 Thg 12, 2024</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-md pt-stack-lg border-t border-outline-variant/30">
                <div><span className="text-label-caps font-label-caps text-on-surface-variant">LOẠI TÀU BAY</span><p className="font-bold text-primary">Airbus A350-900</p></div>
                <div><span className="text-label-caps font-label-caps text-on-surface-variant">CỬA KHỞI HÀNH</span><p className="font-bold text-primary">Cổng 12</p></div>
                <div><span className="text-label-caps font-label-caps text-on-surface-variant">DỊCH VỤ ĂN UỐNG</span><p className="font-bold text-primary">Suất ăn nóng</p></div>
                <div><span className="text-label-caps font-label-caps text-on-surface-variant">GIẢI TRÍ</span><p className="font-bold text-primary">Wifi & Phim ảnh</p></div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-stack-lg">
            <h3 className="font-h3 text-h3 text-primary mb-stack-md flex items-center gap-2">
              <span className="material-symbols-outlined">group</span>
              Thông tin hành khách
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant/30">
                    <th className="py-4 text-label-caps font-label-caps text-on-surface-variant">HÀNH KHÁCH</th>
                    <th className="py-4 text-label-caps font-label-caps text-on-surface-variant">SỐ GHẾ</th>
                    <th className="py-4 text-label-caps font-label-caps text-on-surface-variant">HÀNH LÝ</th>
                    <th className="py-4 text-label-caps font-label-caps text-on-surface-variant">DỊCH VỤ THÊM</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-outline-variant/10">
                    <td className="py-4 font-bold text-primary">NGUYEN VAN A</td>
                    <td className="py-4 font-bold text-secondary">02A</td>
                    <td className="py-4">40kg Ký gửi + 12kg Xách tay</td>
                    <td className="py-4">Ưu tiên làm thủ tục</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-gutter">
          <div className="glass-card rounded-xl p-stack-lg text-center flex flex-col items-center">
            <div className="bg-white p-4 rounded-xl shadow-inner mb-stack-md">
              <img
                alt="Booking QR Code"
                className="w-48 h-48"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV3u0cyb1GMA8bwlkKXs5q4vWyub92jh8hwE5fdmMsd3KrIEFxRN-r2jDKp-14vg8v1oqZXaqDUM7m45ogS4WW9HUtRW9SUZfbyQiHbI86JrQBY7HrY-50z6z81Q5SrR1QLtgblmEkywEmuW0xSkwAygcVkOIM0OrgxTEyyabkryTbOVudUbV9IwAY10Ltme2CGrmkXLvRg5VjWho3lFtjSlImnXD97VLwHnphzO48GKcukeo8Mf9PofIx99zALWV39pYYIIyN68U"
              />
            </div>
            <p className="font-bold text-primary">Quét mã để Check-in</p>
            <p className="text-on-surface-variant text-sm mt-1">
              Vui lòng có mặt tại sân bay ít nhất 90 phút trước giờ bay.
            </p>
          </div>

          <div className="flex flex-col gap-stack-md">
            <button className="w-full py-4 bg-[#FF8C00] text-white font-bold rounded-xl shadow-lg hover:shadow-[#FF8C00]/30 transition-all active:scale-95 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">download</span>
              Tải vé PDF
            </button>
            <button className="w-full py-4 bg-white border border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-all active:scale-95 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">calendar_month</span>
              Đổi lịch bay
            </button>
            <button
              onClick={() => {
                window.location.hash = '/tickets'
              }}
              className="w-full py-4 bg-transparent text-on-surface-variant font-medium rounded-xl hover:text-primary transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Quay lại
            </button>
          </div>

          <div className="glass-card rounded-xl p-stack-md">
            <div className="flex gap-stack-md items-start">
              <span className="material-symbols-outlined text-secondary">info</span>
              <div>
                <p className="font-bold text-primary text-sm">Ghi chú quan trọng</p>
                <p className="text-on-surface-variant text-xs mt-1">
                  Hành khách cần mang theo CCCD/Hộ chiếu bản gốc. Cửa khởi hành sẽ đóng 15 phút trước giờ cất cánh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed top-1/4 -right-24 w-96 h-96 bg-secondary-container/20 rounded-full blur-[100px] -z-10"></div>
      <div className="fixed bottom-1/4 -left-24 w-96 h-96 bg-primary-container/10 rounded-full blur-[100px] -z-10"></div>
    </main>
  )
}

export default TicketDetailPage
