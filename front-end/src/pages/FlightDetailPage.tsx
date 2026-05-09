function FlightDetailPage() {
  return (
    <main className="pt-20">
      <section className="relative h-[500px] w-full">
        <img alt="Hero" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRwJ-zuCQPAIWyw8AGTs6xIK-Y9e0lnTHUK1iWf24ovMomb7djQYmQg_LfsKGqcE8sC7uSiBncX2OBk6Tiyl1x6u2xpmrKjA81Du2kOTdmtHVLQb3-e7OJmooCCRXOblxtqF2nF36gPwhe5dfSPMhdrHoVD6IsVG4Cgq_LCBuXXMlyYeOenw66PVoobQr7wWD9LcVMfifGTb8c4Y-20uowEvZBy2XY4k61kr9m172XwYqhK1JfnGWsyn2VBly-Jchz9VMvF0pNfCk" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/40"></div>
        <div className="relative z-10 max-w-container-max mx-auto px-margin-desktop pt-8">
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-stack-lg">
            <span>Trang chủ</span><span className="material-symbols-outlined text-xs">chevron_right</span><span>Tìm chuyến bay</span><span className="material-symbols-outlined text-xs">chevron_right</span><span className="text-white font-semibold">Chi tiết chuyến bay</span>
          </nav>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2"><span className="bg-sky-accent text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Bay thẳng</span><span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Phổ thông</span></div>
            <h1 className="font-h1 text-h1 text-white">Chuyến bay VN-123</h1>
            <p className="text-white/80 font-body-lg">Hành trình trải nghiệm đẳng cấp từ Thủ đô đến Thành phố mang tên Bác.</p>
          </div>
        </div>
      </section>

      <section className="max-w-container-max mx-auto px-margin-desktop -mt-32 relative z-20">
        <div className="glass-card rounded-2xl p-stack-lg border border-white/40">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-gutter">
            <div className="flex-1 w-full text-center lg:text-left"><div className="text-primary font-bold text-h2">06:00</div><div className="text-on-surface font-h3">Hà Nội (HAN)</div><div className="text-on-surface-variant text-sm mt-1">Sân bay Nội Bài</div></div>
            <div className="flex-[2] w-full flex flex-col items-center"><div className="text-primary-container font-semibold text-sm mb-2">2h 10m</div><div className="w-full relative flex items-center justify-center"><div className="flight-path-line w-full"></div><span className="material-symbols-outlined absolute text-primary scale-125 bg-white rounded-full p-1" style={{ fontVariationSettings: "'FILL' 1" }}>flight_takeoff</span></div><div className="text-on-surface-variant text-xs mt-2 uppercase tracking-widest">Vietnam Airlines</div></div>
            <div className="flex-1 w-full text-center lg:text-right"><div className="text-primary font-bold text-h2">08:10</div><div className="text-on-surface font-h3">TP.HCM (SGN)</div><div className="text-on-surface-variant text-sm mt-1">Sân bay Tân Sơn Nhất</div></div>
          </div>
          <div className="mt-stack-lg pt-stack-lg border-t border-outline-variant/30 grid grid-cols-1 md:grid-cols-3 gap-gutter text-center">
            <div><div className="text-on-surface-variant text-xs uppercase font-bold tracking-tighter">Ngày khởi hành</div><div className="text-primary font-semibold">15/06/2026</div></div>
            <div><div className="text-on-surface-variant text-xs uppercase font-bold tracking-tighter">Hãng hàng không</div><div className="text-primary font-semibold">Vietnam Airlines</div></div>
            <div><div className="text-on-surface-variant text-xs uppercase font-bold tracking-tighter">Loại máy bay</div><div className="text-primary font-semibold">Airbus A321</div></div>
          </div>
        </div>
      </section>

      <section className="max-w-container-max mx-auto px-margin-desktop mt-section-gap">
        <h2 className="font-h2 text-h2 text-primary mb-stack-lg">Thông tin chi tiết</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <div className="md:col-span-4 group cursor-pointer overflow-hidden rounded-2xl glass-card border-none"><div className="relative h-48 overflow-hidden"><img alt="Noi Bai" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1Qh5tf1msyv44NfnLpXpdVXn0bEkuwzYPj5l2z62JbBEyEB3R7PA6EmPaqyjT-Ro9YJcPsKHkND6rck2U-MCZuFtSOGSHookdWW3jeFhL73BJNCxH6jgWWh6liIGotXPnt8Y77AnSMFlNLf15RHUuN-PRud5x2P3yswBaZndC_okNafQQY0zveRNgb2Fr8KsouoLkueD5ZYw9uOfm6wEa7ZLiO4Tb3yUDWtO5d5OoGM6aSPukixLOaosctHo0cf4imgTQYlZ3ukY" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div><div className="absolute bottom-4 left-4 text-white"><div className="text-xs font-bold uppercase">Điểm khởi hành</div><div className="text-xl font-bold">Nội Bài (HAN)</div></div></div><div className="p-6"><p className="text-on-surface-variant text-sm">Sân bay lớn nhất miền Bắc, nằm tại huyện Sóc Sơn, cách trung tâm Hà Nội khoảng 30km.</p></div></div>
          <div className="md:col-span-4 group overflow-hidden rounded-2xl glass-card border-none"><div className="relative h-48 overflow-hidden"><img alt="Aircraft" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCClq2CCbGwnWdc7IQC2XfeT2V-ec1LXPYdMYlDQrxNk8cs8v64m_KCxqvetl2sjuapqK7KvoMT0kcLoRSxZ1PFdq-a8hsaTMWh-ZF1IYec2krf9P-ee0iThPvIXLo62hQLCUjtn31sS4CbYYCS_n7SsYTBYqJk91TacZohbW2Ux6gSLflAey538INnDaHXP-B59nw07H5sind-JFr521jaFTxP_HtcseQzAhQsFNyKrIMxABzwDl1ze6hoTbsiwDkp-6mtmNLEPa0" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div><div className="absolute bottom-4 left-4 text-white"><div className="text-xs font-bold uppercase">Phương tiện</div><div className="text-xl font-bold">Airbus A321</div></div></div><div className="p-6"><div className="flex items-center gap-2 mb-2"><span className="material-symbols-outlined text-primary">airline_seat_recline_extra</span><span className="text-on-surface font-semibold">180 ghế tiêu chuẩn</span></div><p className="text-on-surface-variant text-sm">Dòng máy bay thân hẹp hiện đại, tiện nghi, mang lại sự êm ái tối đa trong suốt hành trình.</p></div></div>
          <div className="md:col-span-4 group cursor-pointer overflow-hidden rounded-2xl glass-card border-none"><div className="relative h-48 overflow-hidden"><img alt="Tan Son Nhat" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd-E8KyJ7IAIb1EevSYHQqsbN6yafnS6x_BXQFAamOjrSDNePtcEyHLIwt7IraUpMFZW7-F4gy1hF-_ugoMUEUlhmfZUi7IW-PG11dxbyo6xzAlJ_MJa3l3YQZmadau4SLC6tL5SYobcH51IukAjBLt3cA4JCX-SvUgFCvbyDXi90aLMco_gjzneL8TYn63xIO-Ve_ljjDa7FeBDLqhcDVsWXrCt4B1AqoPeoFRDoGnksLJIll9EWj3ToFuGYLxHwUnU8mQynSoDE" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div><div className="absolute bottom-4 left-4 text-white"><div className="text-xs font-bold uppercase">Điểm đến</div><div className="text-xl font-bold">Tân Sơn Nhất (SGN)</div></div></div><div className="p-6"><p className="text-on-surface-variant text-sm">Sân bay nhộn nhịp nhất Việt Nam, cửa ngõ giao thương kinh tế của miền Nam.</p></div></div>
        </div>
      </section>

      <section className="max-w-container-max mx-auto px-margin-desktop mt-section-gap grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        <div className="glass-card rounded-2xl p-stack-lg">
          <h3 className="font-h3 text-h3 text-primary mb-stack-lg">Chính sách &amp; Tiện ích</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
            <div className="flex items-start gap-4"><div className="bg-primary/10 p-3 rounded-xl"><span className="material-symbols-outlined text-primary">luggage</span></div><div><div className="font-semibold text-on-surface">Hành lý xách tay</div><div className="text-on-surface-variant text-sm">Tối đa 7kg miễn phí</div></div></div>
            <div className="flex items-start gap-4"><div className="bg-primary/10 p-3 rounded-xl"><span className="material-symbols-outlined text-primary">work</span></div><div><div className="font-semibold text-on-surface">Hành lý ký gửi</div><div className="text-on-surface-variant text-sm">23kg mỗi hành khách</div></div></div>
            <div className="flex items-start gap-4"><div className="bg-primary/10 p-3 rounded-xl"><span className="material-symbols-outlined text-primary">event_repeat</span></div><div><div className="font-semibold text-on-surface">Đổi vé</div><div className="text-on-surface-variant text-sm">Có phí (theo quy định)</div></div></div>
            <div className="flex items-start gap-4"><div className="bg-primary/10 p-3 rounded-xl text-error"><span className="material-symbols-outlined">cancel</span></div><div><div className="font-semibold text-on-surface">Hoàn vé</div><div className="text-error text-sm">Không hỗ trợ hoàn vé</div></div></div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-stack-lg flex flex-col justify-center">
          <div className="flex justify-between items-end mb-4"><div><h3 className="font-h3 text-h3 text-primary">Tình trạng chỗ</h3><p className="text-on-surface-variant text-sm">Chuyến bay đang nhận đặt chỗ</p></div><div className="text-right"><span className="text-h2 font-bold text-sky-accent">45</span><span className="text-on-surface-variant">/ 180 ghế trống</span></div></div>
          <div className="w-full bg-surface-container-high h-4 rounded-full overflow-hidden"><div className="h-full bg-sky-accent rounded-full transition-all duration-1000" style={{ width: '25%' }}></div></div>
          <div className="flex justify-between mt-2 text-xs font-bold text-on-surface-variant/60 uppercase"><span>Đã đặt 135 ghế</span><span>25% còn lại</span></div>
          <div className="mt-stack-lg flex gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10"><span className="material-symbols-outlined text-primary">info</span><p className="text-xs text-primary-fixed-variant leading-relaxed">Lưu ý: Số lượng ghế trống có thể thay đổi liên tục theo thời gian thực. Hãy nhanh tay để sở hữu vị trí ưng ý nhất!</p></div>
        </div>
      </section>

      <section className="max-w-container-max mx-auto px-margin-desktop mt-section-gap mb-section-gap">
        <div className="bg-primary-container text-on-primary rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-gutter">
            <div className="text-center lg:text-left"><div className="text-on-primary-container text-sm font-bold uppercase tracking-widest mb-2">Giá vé ưu đãi nhất</div><div className="flex items-baseline gap-2"><span className="text-h1 font-h1 text-white">1.250.000</span><span className="text-h3 font-h3 text-on-primary-container">VNĐ</span></div><div className="text-white/60 text-sm">Bao gồm thuế, phí và các dịch vụ đi kèm tiêu chuẩn</div></div>
            <div className="w-full lg:w-auto"><button onClick={() => { window.location.hash = '/seat-selection' }} className="w-full lg:w-64 bg-sky-accent hover:bg-sky-accent/90 text-white font-h3 px-10 py-5 rounded-2xl shadow-xl shadow-sky-accent/20 transition-all duration-300 active:scale-95 group-hover:scale-105">Đặt vé ngay</button></div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default FlightDetailPage

