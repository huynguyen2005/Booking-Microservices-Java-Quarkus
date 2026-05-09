function SeatSelectionPage() {
  return (
    <main className="pt-24 pb-section-gap px-gutter max-w-container-max mx-auto">
      <section className="mb-stack-lg flex justify-between max-w-3xl mx-auto items-center">
        <div className="flex flex-col items-center gap-2 group"><div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg"><span className="material-symbols-outlined text-sm">check</span></div><span className="text-label-caps text-on-surface-variant">Chọn chuyến bay</span></div>
        <div className="h-0.5 flex-1 bg-primary mx-4"></div>
        <div className="flex flex-col items-center gap-2"><div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white ring-4 ring-secondary-container/30"><span className="font-bold">2</span></div><span className="text-label-caps text-primary font-bold">Chọn ghế</span></div>
        <div className="h-0.5 flex-1 bg-outline-variant/30 mx-4"></div>
        <div className="flex flex-col items-center gap-2"><div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-outline"><span className="font-bold">3</span></div><span className="text-label-caps text-on-surface-variant">Thông tin hành khách</span></div>
        <div className="h-0.5 flex-1 bg-outline-variant/30 mx-4"></div>
        <div className="flex flex-col items-center gap-2"><div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-outline"><span className="font-bold">4</span></div><span className="text-label-caps text-on-surface-variant">Thanh toán</span></div>
        <div className="h-0.5 flex-1 bg-outline-variant/30 mx-4"></div>
        <div className="flex flex-col items-center gap-2"><div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-outline"><span className="font-bold">5</span></div><span className="text-label-caps text-on-surface-variant">Xác nhận</span></div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm p-stack-lg border border-outline-variant/20">
            <h2 className="font-h3 text-h3 text-primary mb-stack-md text-center">Chọn chỗ ngồi yêu thích</h2>
            <div className="flex flex-wrap justify-center gap-6 mb-stack-lg pb-6 border-b border-outline-variant/20">
              <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-secondary-container"></div><span className="text-label-caps">Trống</span></div>
              <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-primary-container flex items-center justify-center text-white"><span className="material-symbols-outlined text-[16px]">check</span></div><span className="text-label-caps">Đang chọn</span></div>
              <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-outline-variant"></div><span className="text-label-caps">Đã đặt</span></div>
              <div className="flex items-center gap-2"><div className="w-6 h-6 rounded border-2 border-tertiary-container"></div><span className="text-label-caps">Thương gia/Exit</span></div>
            </div>

            <div className="relative plane-outline mx-auto max-w-[480px] pt-20 pb-10 bg-surface-container-lowest seat-map-bg">
              <div className="absolute top-8 left-1/2 -translate-x-1/2 text-outline-variant font-bold text-label-caps tracking-widest uppercase">BUỒNG LÁI</div>
              <div className="flex flex-col gap-4 px-12">
                <div className="grid grid-cols-7 gap-2 mb-2 text-center text-outline font-bold"><span>A</span><span>B</span><span>C</span><span className="text-transparent">X</span><span>D</span><span>E</span><span>F</span></div>
                <div className="grid grid-cols-7 gap-2 items-center">
                  <button className="aspect-square rounded border-2 border-tertiary-container hover:bg-tertiary-fixed transition-colors text-label-caps">10A</button><button className="aspect-square rounded border-2 border-tertiary-container hover:bg-tertiary-fixed transition-colors text-label-caps">10B</button><button className="aspect-square rounded border-2 border-tertiary-container hover:bg-tertiary-fixed transition-colors text-label-caps">10C</button><span className="text-outline-variant text-[10px] font-bold">10</span><button className="aspect-square rounded border-2 border-tertiary-container hover:bg-tertiary-fixed transition-colors text-label-caps">10D</button><button className="aspect-square rounded border-2 border-tertiary-container hover:bg-tertiary-fixed transition-colors text-label-caps">10E</button><button className="aspect-square rounded border-2 border-tertiary-container hover:bg-tertiary-fixed transition-colors text-label-caps">10F</button>
                </div>
                <div className="flex items-center justify-between gap-4 py-2 opacity-50"><div className="h-[1px] flex-1 bg-outline-variant"></div><span className="text-label-caps text-tertiary-container whitespace-nowrap">HÀNG GHẾ THOÁT HIỂM</span><div className="h-[1px] flex-1 bg-outline-variant"></div></div>
                <div className="grid grid-cols-7 gap-2 items-center"><button className="aspect-square rounded bg-outline-variant text-white cursor-not-allowed text-label-caps">11A</button><button className="aspect-square rounded bg-secondary-container hover:bg-secondary transition-colors text-label-caps">11B</button><button className="aspect-square rounded bg-secondary-container hover:bg-secondary transition-colors text-label-caps">11C</button><span className="text-outline-variant text-[10px] font-bold">11</span><button className="aspect-square rounded bg-secondary-container hover:bg-secondary transition-colors text-label-caps">11D</button><button className="aspect-square rounded bg-secondary-container hover:bg-secondary transition-colors text-label-caps">11E</button><button className="aspect-square rounded bg-outline-variant text-white cursor-not-allowed text-label-caps">11F</button></div>
                <div className="grid grid-cols-7 gap-2 items-center"><button className="aspect-square rounded bg-primary-container text-white flex items-center justify-center shadow-md text-label-caps ring-2 ring-primary ring-offset-2"><span className="material-symbols-outlined text-[14px]">check</span></button><button className="aspect-square rounded bg-secondary-container hover:bg-secondary transition-colors text-label-caps">12B</button><button className="aspect-square rounded bg-secondary-container hover:bg-secondary transition-colors text-label-caps">12C</button><span className="text-outline-variant text-[10px] font-bold">12</span><button className="aspect-square rounded bg-secondary-container hover:bg-secondary transition-colors text-label-caps">12D</button><button className="aspect-square rounded bg-secondary-container hover:bg-secondary transition-colors text-label-caps">12E</button><button className="aspect-square rounded bg-secondary-container hover:bg-secondary transition-colors text-label-caps">12F</button></div>
                <div className="grid grid-cols-7 gap-2 items-center"><button className="aspect-square rounded bg-secondary-container hover:bg-secondary transition-colors text-label-caps">13A</button><button className="aspect-square rounded bg-secondary-container hover:bg-secondary transition-colors text-label-caps">13B</button><button className="aspect-square rounded bg-secondary-container hover:bg-secondary transition-colors text-label-caps">13C</button><span className="text-outline-variant text-[10px] font-bold">13</span><button className="aspect-square rounded bg-secondary-container hover:bg-secondary transition-colors text-label-caps">13D</button><button className="aspect-square rounded bg-secondary-container hover:bg-secondary transition-colors text-label-caps">13E</button><button className="aspect-square rounded bg-secondary-container hover:bg-secondary transition-colors text-label-caps">13F</button></div>
                <div className="flex items-center justify-center py-4"><span className="text-outline-variant animate-bounce text-label-caps">Cuộn xuống để xem thêm ghế</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-xl p-6 shadow-[0px_10px_30px_rgba(0,51,102,0.08)] overflow-hidden relative">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-container/5 rounded-full blur-3xl"></div>
            <h3 className="font-h3 text-h3 text-primary mb-4">Tóm tắt chuyến bay</h3>
            <div className="flex items-center justify-between mb-4"><div className="text-center"><p className="font-h3 text-h3 text-primary">HAN</p><p className="text-label-caps text-on-surface-variant">Hà Nội</p></div><div className="flex flex-col items-center flex-1 px-4"><span className="text-primary font-bold text-[10px]">VN-123</span><div className="w-full h-[1px] bg-outline-variant relative my-2"><span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-secondary text-sm">flight_takeoff</span></div><span className="text-[10px] text-outline">2h 10m</span></div><div className="text-center"><p className="font-h3 text-h3 text-primary">SGN</p><p className="text-label-caps text-on-surface-variant">TP.HCM</p></div></div>
            <div className="flex items-center gap-2 text-on-surface-variant text-body-md border-t border-outline-variant/10 pt-4"><span className="material-symbols-outlined">calendar_today</span><span>Thứ Tư, 15 Thg 5, 2024</span></div>
          </div>

          <div className="glass-panel rounded-xl p-6 shadow-[0px_10px_30px_rgba(0,51,102,0.08)]">
            <h3 className="text-label-caps text-outline mb-4">GHẾ ĐÃ CHỌN</h3>
            <div className="flex items-center justify-between"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center text-white"><span className="font-bold text-lg">12A</span></div><div><p className="font-bold text-primary">Hạng Phổ Thông</p><p className="text-body-md text-on-surface-variant">Vị trí cửa sổ</p></div></div><span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-error">delete</span></div>
          </div>

          <div className="glass-panel rounded-xl p-6 shadow-[0px_10px_30px_rgba(0,51,102,0.08)]">
            <div className="space-y-3 mb-6"><div className="flex justify-between text-body-md"><span className="text-on-surface-variant">Giá vé cơ bản</span><span className="font-bold">1.150.000 VNĐ</span></div><div className="flex justify-between text-body-md"><span className="text-on-surface-variant">Phí chọn chỗ (12A)</span><span className="font-bold text-secondary">+ 150.000 VNĐ</span></div><div className="flex justify-between pt-3 border-t border-outline-variant/20"><span className="font-h3 text-h3 text-primary">Tổng cộng</span><span className="font-h3 text-h3 text-primary">1.300.000 VNĐ</span></div></div>
            <button onClick={() => { window.location.hash = '/passenger-info' }} className="w-full py-4 bg-[#FF8C00] text-white rounded-full font-bold text-lg shadow-[0px_4px_15px_rgba(255,140,0,0.3)] hover:shadow-[0px_6px_20px_rgba(255,140,0,0.5)] transition-all transform active:scale-95 flex items-center justify-center gap-2"><span>Tiếp tục</span><span className="material-symbols-outlined">arrow_forward</span></button>
            <p className="text-center text-[12px] text-outline mt-4">Bằng cách tiếp tục, bạn đồng ý với Điều khoản của chúng tôi.</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default SeatSelectionPage

