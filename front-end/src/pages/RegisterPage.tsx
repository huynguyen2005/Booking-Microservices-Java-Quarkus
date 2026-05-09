import '../App.css'

function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <section className="relative w-full md:w-[45%] lg:w-[40%] min-h-[300px] md:min-h-screen overflow-hidden flex flex-col justify-between p-12">
        <div className="absolute inset-0 z-0">
          <img alt="" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-DQ_qOSYVGIanic92xHkAZxeb8dg0J9wHUV5OBOKOgB4qibLUhmed3ofbhSOhBylGCE5Am828lMYux3nQLRGDZovdLJDYfOj6g7gZTMSN4_aOoW8kWwMKE8UzGPu1r-OYwQSBINKk-Itf0A0VpnhS3NN7NV-emyP4cx_pvIfcnnu7nibxAkDp3-ZnccoyCHPLTU9usdjapc5Mg-Prq7poPmOmb_R3erKQwKbo57GKCA_GOBCxjv7omlHPVDgHz8H_VxD0lBNxlKc" />
          <div className="absolute inset-0 bg-navy-gradient" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-primary text-4xl">flight_takeoff</span>
            <h1 className="font-h3 text-h3 font-bold text-on-primary tracking-tight">SkyVoyage</h1>
          </div>
        </div>
        <div className="relative z-10 mb-12">
          <div className="max-w-xs">
            <span className="material-symbols-outlined text-brand-orange text-3xl mb-4 block">format_quote</span>
            <p className="font-h2 text-h2 text-on-primary leading-tight mb-4">Khám phá thế giới, bắt đầu từ đây.</p>
            <div className="h-1 w-12 bg-brand-orange rounded-full" />
          </div>
        </div>
      </section>

      <section className="w-full md:w-[55%] lg:w-[60%] flex items-center justify-center p-6 md:p-12 lg:p-24 bg-surface-bright relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#001e40 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="glass-card w-full max-w-[540px] p-8 md:p-12 rounded-2xl shadow-[0px_10px_30px_rgba(0,51,102,0.08)] relative z-10 border border-white/40">
          <header className="mb-10 text-center md:text-left">
            <h2 className="font-h2 text-h2 text-primary mb-2">Tạo tài khoản mới</h2>
            <p className="font-body-md text-on-surface-variant">Bắt đầu hành trình bay cùng SkyVoyage</p>
          </header>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant px-1" htmlFor="fullname">HỌ VÀ TÊN</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">person</span>
                <input className="w-full pl-12 pr-4 py-4 bg-white/50 border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary-fixed focus:border-primary outline-none transition-all placeholder:text-outline-variant" id="fullname" placeholder="Nguyễn Văn A" type="text" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant px-1" htmlFor="email">EMAIL</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">mail</span>
                <input className="w-full pl-12 pr-4 py-4 bg-white/50 border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary-fixed focus:border-primary outline-none transition-all placeholder:text-outline-variant" id="email" placeholder="example@skyvoyage.com" type="email" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant px-1" htmlFor="phone">SỐ ĐIỆN THOẠI</label>
              <div className="relative group flex">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                  <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">phone</span>
                  <span className="text-on-surface-variant font-medium border-r border-outline-variant pr-2">+84</span>
                </div>
                <input className="w-full pl-28 pr-4 py-4 bg-white/50 border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary-fixed focus:border-primary outline-none transition-all placeholder:text-outline-variant" id="phone" placeholder="987 654 321" type="tel" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant px-1" htmlFor="password">MẬT KHẨU</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">lock</span>
                <input className="w-full pl-12 pr-12 py-4 bg-white/50 border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary-fixed focus:border-primary outline-none transition-all placeholder:text-outline-variant" id="password" placeholder="••••••••" type="password" />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" type="button">
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
              <div className="flex gap-1.5 mt-2 px-1">
                <div className="h-1 flex-1 rounded-full bg-primary-container"></div>
                <div className="h-1 flex-1 rounded-full bg-primary-container"></div>
                <div className="h-1 flex-1 rounded-full bg-surface-variant"></div>
                <div className="h-1 flex-1 rounded-full bg-surface-variant"></div>
              </div>
              <p className="text-[11px] text-outline px-1">Mật khẩu phải bao gồm ít nhất 8 ký tự.</p>
            </div>

            <div className="flex items-start gap-3 px-1 pt-2">
              <input className="mt-1 w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all" id="terms" type="checkbox" />
              <label className="text-body-md text-on-surface-variant leading-tight cursor-pointer" htmlFor="terms">
                Tôi đồng ý với <a className="text-primary font-semibold hover:underline" href="#">Điều khoản sử dụng</a> và <a className="text-primary font-semibold hover:underline" href="#">Chính sách bảo mật</a>.
              </label>
            </div>

            <button className="w-full py-5 bg-brand-orange text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl glow-hover transition-all duration-300 transform active:scale-[0.98] mt-4" type="submit">
              Đăng ký
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-outline-variant/30 text-center">
            <p className="text-on-surface-variant">Đã có tài khoản?<a className="text-primary font-bold hover:underline ml-1" href="#">Đăng nhập</a></p>
          </div>
        </div>

        <div className="absolute top-20 right-20 w-32 h-32 bg-primary-fixed-dim/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-secondary-fixed/20 rounded-full blur-3xl"></div>
      </section>
    </main>
  )
}

export default RegisterPage
