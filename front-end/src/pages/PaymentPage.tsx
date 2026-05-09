function PaymentPage() {
  return (
    <main className="pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="mb-stack-lg overflow-x-auto">
        <div className="flex items-center justify-between min-w-[800px] relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-outline-variant -z-10"></div>
          <div className="flex flex-col items-center gap-2 bg-background px-4"><div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">check</span></div><span className="text-label-caps font-label-caps text-on-surface-variant">Chọn chuyến bay</span></div>
          <div className="flex flex-col items-center gap-2 bg-background px-4"><div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">check</span></div><span className="text-label-caps font-label-caps text-on-surface-variant">Chọn ghế</span></div>
          <div className="flex flex-col items-center gap-2 bg-background px-4"><div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">check</span></div><span className="text-label-caps font-label-caps text-on-surface-variant">Thông tin hành khách</span></div>
          <div className="flex flex-col items-center gap-2 bg-background px-4"><div className="w-10 h-10 rounded-full border-2 border-primary bg-white text-primary flex items-center justify-center font-bold">4</div><span className="text-label-caps font-label-caps text-primary font-bold">Thanh toán</span></div>
          <div className="flex flex-col items-center gap-2 bg-background px-4"><div className="w-8 h-8 rounded-full border-2 border-outline-variant bg-white text-outline-variant flex items-center justify-center font-bold">5</div><span className="text-label-caps font-label-caps text-outline">Xác nhận</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        <div className="lg:col-span-8 space-y-stack-lg">
          <header><h1 className="font-h1 text-h2 text-primary">Thanh toán</h1><p className="text-body-lg text-on-surface-variant">Chọn phương thức thanh toán an toàn của bạn</p></header>

          <div className="space-y-4">
            <div className="border-2 border-primary bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-6"><div className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">credit_card</span><h3 className="font-h3 text-body-lg font-bold text-primary">Thẻ tín dụng/ghi nợ</h3></div><div className="flex gap-2"><div className="h-4 w-12 bg-surface-container-high rounded"></div><div className="h-4 w-12 bg-surface-container-high rounded"></div></div></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                <div className="md:col-span-2"><label className="block text-label-caps font-label-caps text-outline mb-2">Số thẻ</label><div className="relative"><input className="w-full bg-surface-container-low border-outline-variant rounded-lg p-4 font-mono" readOnly type="text" value="**** **** **** 1234"/><span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline">lock</span></div></div>
                <div className="md:col-span-2"><label className="block text-label-caps font-label-caps text-outline mb-2">Tên chủ thẻ</label><input className="w-full bg-white border-outline-variant rounded-lg p-4" placeholder="NGUYEN VAN A" type="text"/></div>
                <div><label className="block text-label-caps font-label-caps text-outline mb-2">Ngày hết hạn (MM/YY)</label><input className="w-full bg-white border-outline-variant rounded-lg p-4" placeholder="MM / YY" type="text"/></div>
                <div><label className="block text-label-caps font-label-caps text-outline mb-2">CVV</label><input className="w-full bg-white border-outline-variant rounded-lg p-4" placeholder="***" type="password"/></div>
              </div>
              <div className="mt-6 flex items-center gap-3"><input className="rounded border-outline-variant text-primary focus:ring-primary w-5 h-5" id="save-card" type="checkbox"/><label className="text-body-md text-on-surface-variant" htmlFor="save-card">Lưu thông tin thanh toán cho lần sau</label></div>
            </div>

            <div className="border border-outline-variant bg-white/50 p-6 rounded-xl flex justify-between items-center hover:bg-white transition-colors cursor-pointer group"><div className="flex items-center gap-3"><span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">account_balance_wallet</span><span className="font-h3 text-body-md font-semibold text-on-surface-variant group-hover:text-primary transition-colors">Ví điện tử</span></div><div className="flex gap-3"><div className="w-8 h-8 rounded-lg bg-[#a50064]"></div><div className="w-8 h-8 rounded-lg bg-[#0068ff]"></div><div className="w-8 h-8 rounded-lg bg-[#cc0000]"></div></div></div>
            <div className="border border-outline-variant bg-white/50 p-6 rounded-xl flex justify-between items-center hover:bg-white transition-colors cursor-pointer group"><div className="flex items-center gap-3"><span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">account_balance</span><span className="font-h3 text-body-md font-semibold text-on-surface-variant group-hover:text-primary transition-colors">Chuyển khoản ngân hàng</span></div><span className="material-symbols-outlined text-outline-variant">chevron_right</span></div>
          </div>
        </div>

        <div className="lg:col-span-4 sticky top-32">
          <div className="glass-card p-stack-lg rounded-2xl shadow-[0px_10px_30px_rgba(0,51,102,0.08)]">
            <h2 className="font-h3 text-h3 text-primary mb-stack-md">Tóm tắt đơn hàng</h2>
            <div className="bg-primary/5 rounded-xl p-4 mb-stack-md border border-primary/10"><div className="flex justify-between items-center mb-2"><span className="font-bold text-primary">HAN → SGN</span><span className="text-label-caps bg-primary/10 text-primary px-2 py-1 rounded">VN-123</span></div><p className="text-body-md text-on-surface-variant flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">calendar_today</span>15/06/2026</p></div>
            <div className="space-y-3 mb-stack-lg"><div className="flex justify-between text-on-surface-variant"><span>Giá vé</span><span>1.250.000 VNĐ</span></div><div className="flex justify-between text-on-surface-variant"><span>Phụ phí chỗ ngồi</span><span>50.000 VNĐ</span></div><div className="flex justify-between text-on-surface-variant"><span>Thuế & Phí</span><span>150.000 VNĐ</span></div><div className="pt-4 border-t border-outline-variant flex justify-between items-end"><span className="font-bold text-primary">Tổng cộng</span><span className="text-h3 font-bold text-primary">1.450.000 VNĐ</span></div></div>
            <button onClick={() => { window.location.hash = '/booking-failed' }} className="orange-cta w-full text-white font-bold py-4 rounded-xl text-lg shadow-lg mb-4">Xác nhận thanh toán</button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default PaymentPage
