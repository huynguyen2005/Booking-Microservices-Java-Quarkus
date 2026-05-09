function FlightsPage() {
  const goDetail = () => {
    window.location.hash = '/flight-detail'
  }

  return (
    <main className="pt-20">
      <section className="bg-surface-container-low py-stack-md px-margin-desktop shadow-sm">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-stack-md">
          <div className="flex items-center gap-stack-md text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-primary">flight_takeoff</span>
            <span className="text-body-md">Hà Nội (HAN) → TP. Hồ Chí Minh (SGN)</span>
            <span className="w-px h-4 bg-outline-variant"></span>
            <span className="text-body-md">15/06/2026</span>
            <span className="w-px h-4 bg-outline-variant"></span>
            <span className="text-body-md">1 Hành khách</span>
            <span className="w-px h-4 bg-outline-variant"></span>
            <span className="text-body-md">Phổ thông</span>
          </div>
          <button className="px-stack-lg py-2 rounded-full border border-primary text-primary hover:bg-primary/5 transition-all font-semibold text-body-md">Sửa tìm kiếm</button>
        </div>
      </section>

      <section className="max-w-container-max mx-auto px-margin-desktop py-stack-lg flex flex-col md:flex-row gap-gutter">
        <aside className="w-full md:w-80 flex flex-col gap-stack-md p-stack-md h-fit bg-white/40 backdrop-blur-xl rounded-xl border border-white/20 shadow-[0px_10px_30px_rgba(0,51,102,0.08)]">
          <div className="flex justify-between items-center pb-stack-sm border-b border-outline-variant/30">
            <div><h2 className="font-h3 text-h3 text-primary">Filters</h2><p className="text-label-caps text-on-surface-variant uppercase tracking-wider">Refine your journey</p></div>
            <span className="material-symbols-outlined text-primary">filter_list</span>
          </div>
          <div className="py-stack-sm"><div className="flex justify-between items-center mb-2"><label className="font-semibold text-primary">Price Range</label><span className="material-symbols-outlined text-on-surface-variant">payments</span></div><input className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary" max={5000000} min={0} type="range" /><div className="flex justify-between mt-2 text-label-caps text-on-surface-variant"><span>0 VNĐ</span><span>5.000.000 VNĐ</span></div></div>
          <div className="py-stack-sm"><div className="flex justify-between items-center mb-2"><label className="font-semibold text-primary">Flight Time</label><span className="material-symbols-outlined text-on-surface-variant">schedule</span></div><div className="flex flex-col gap-2"><label className="flex items-center gap-3 cursor-pointer group"><input className="rounded border-outline text-primary focus:ring-primary w-5 h-5" type="checkbox" /><span className="text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Sáng (05:00 - 12:00)</span></label><label className="flex items-center gap-3 cursor-pointer group"><input className="rounded border-outline text-primary focus:ring-primary w-5 h-5" type="checkbox" /><span className="text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Chiều (12:00 - 18:00)</span></label><label className="flex items-center gap-3 cursor-pointer group"><input className="rounded border-outline text-primary focus:ring-primary w-5 h-5" type="checkbox" /><span className="text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Tối (18:00 - 00:00)</span></label></div></div>
          <div className="py-stack-sm"><div className="flex justify-between items-center mb-2"><label className="font-semibold text-primary">Airlines</label><span className="material-symbols-outlined text-on-surface-variant">flight_takeoff</span></div><div className="flex flex-col gap-2"><label className="flex items-center gap-3 cursor-pointer group"><input className="rounded border-outline text-primary focus:ring-primary w-5 h-5" type="checkbox" /><span className="text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Vietnam Airlines</span></label><label className="flex items-center gap-3 cursor-pointer group"><input className="rounded border-outline text-primary focus:ring-primary w-5 h-5" type="checkbox" /><span className="text-body-md text-on-surface-variant group-hover:text-primary transition-colors">VietJet Air</span></label><label className="flex items-center gap-3 cursor-pointer group"><input className="rounded border-outline text-primary focus:ring-primary w-5 h-5" type="checkbox" /><span className="text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Bamboo Airways</span></label></div></div>
          <div className="py-stack-sm"><div className="flex justify-between items-center mb-2"><label className="font-semibold text-primary">Stops</label><span className="material-symbols-outlined text-on-surface-variant">alt_route</span></div><div className="flex flex-col gap-2"><label className="flex items-center gap-3 cursor-pointer group"><input className="rounded border-outline text-primary focus:ring-primary w-5 h-5" type="checkbox" /><span className="text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Bay thẳng</span></label><label className="flex items-center gap-3 cursor-pointer group"><input className="rounded border-outline text-primary focus:ring-primary w-5 h-5" type="checkbox" /><span className="text-body-md text-on-surface-variant group-hover:text-primary transition-colors">1 điểm dừng</span></label></div></div>
          <div className="mt-4 flex flex-col gap-2"><button className="w-full py-3 bg-primary-container text-on-primary-container font-semibold rounded-lg hover:backdrop-brightness-110 transition-all">Apply All</button><button className="w-full py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all text-body-md">Xóa bộ lọc</button></div>
        </aside>

        <div className="flex-1 flex flex-col gap-stack-md">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm"><div className="flex items-center gap-stack-md"><span className="text-body-md font-semibold text-primary">Sắp xếp theo:</span><div className="flex gap-4"><button className="text-body-md text-primary font-bold border-b-2 border-primary">Giá thấp nhất</button><button className="text-body-md text-on-surface-variant hover:text-primary transition-colors">Sớm nhất</button><button className="text-body-md text-on-surface-variant hover:text-primary transition-colors">Nhanh nhất</button></div></div><span className="text-body-md text-on-surface-variant">Hiển thị 48 kết quả</span></div>

          <div className="space-y-stack-md">
            {[
              ['VN-123', 'Vietnam Airlines', 'flight', '06:00', '08:10', '2h 10m (Bay thẳng)', 'Còn 12 ghế', '1.250.000 VNĐ', 'bg-error-container text-on-error-container'],
              ['VJ-456', 'VietJet Air', 'flight_takeoff', '09:30', '11:45', '2h 15m (Bay thẳng)', 'Linh hoạt', '1.050.000 VNĐ', 'bg-surface-container-high text-on-surface-variant'],
              ['QH-789', 'Bamboo Airways', 'airplanemode_active', '13:15', '15:25', '2h 10m (Bay thẳng)', 'Còn 5 ghế', '1.480.000 VNĐ', 'bg-error-container text-on-error-container'],
            ].map((flight) => (
              <div key={flight[0]} onClick={goDetail} className="cursor-pointer bg-white rounded-xl p-stack-lg shadow-sm hover:shadow-md transition-all border border-outline-variant/20 flex flex-col md:flex-row items-center gap-gutter">
                <div className="w-full md:w-32 flex flex-col items-center gap-1"><div className="h-12 w-12 flex items-center justify-center"><span className="material-symbols-outlined text-primary text-4xl">{flight[2]}</span></div><span className="font-bold text-primary">{flight[0]}</span><span className="text-label-caps text-on-surface-variant">{flight[1]}</span></div>
                <div className="flex-1 flex justify-between items-center px-4 w-full"><div className="text-center"><p className="text-h2 font-h2 text-primary leading-none">{flight[3]}</p><p className="text-body-md text-on-surface-variant font-medium">HAN</p></div><div className="flex-1 px-8 flex flex-col items-center"><p className="text-label-caps text-on-surface-variant mb-2">{flight[5]}</p><div className="w-full flight-path flex justify-between items-center"><div className="w-2 h-2 rounded-full bg-primary relative z-10"></div><span className="material-symbols-outlined text-primary text-sm relative z-10 bg-white">flight</span><div className="w-2 h-2 rounded-full bg-outline-variant relative z-10"></div></div></div><div className="text-center"><p className="text-h2 font-h2 text-primary leading-none">{flight[4]}</p><p className="text-body-md text-on-surface-variant font-medium">SGN</p></div></div>
                <div className="w-full md:w-48 flex flex-col items-end gap-2 border-l border-outline-variant/30 pl-gutter"><span className={`${flight[8]} px-3 py-1 rounded-full text-label-caps font-bold`}>{flight[6]}</span><p className="text-h3 font-h3 text-primary">{flight[7]}</p><button onClick={(e) => { e.stopPropagation(); goDetail() }} className="w-full bg-[#FF8C00] text-white py-3 rounded-lg font-bold hover:shadow-[0_0_15px_rgba(255,140,0,0.4)] transition-all">Chọn chuyến bay</button></div>
              </div>
            ))}
          </div>

          <div className="py-stack-lg flex justify-center"><button className="px-section-gap py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-container transition-all">Xem thêm chuyến bay</button></div>
        </div>
      </section>
    </main>
  )
}

export default FlightsPage
