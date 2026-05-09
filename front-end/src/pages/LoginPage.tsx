import '../App.css'

function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <section className="relative hidden md:flex md:w-1/2 overflow-hidden items-center justify-center bg-primary-container">
        <div className="absolute inset-0 z-0">
          <img alt="SkyVoyage Premium View" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnj8FhJI2LRQNT2oWWO-Yzec6_6kw0KMG33k-DOwCTDxlHkW9G8-oD-9hxM6bDCWK3zh9gBLDm-kp9yk5cd_Z9zhnzCqIKyAa8VKlSH42-Ycx14ac806rOT5XPUCAbLnVkAWYVhBB_C4HnCbCExXvbP5-uCogUyu-8NV197KWqexhpx_38liH8lzXGv4q7m4EYvlxsKsjwZOnf1ckZpBnSpfz_iYSEN0KiJviB_oytpJtHnRdho-6aTqYEsOvIxiJoy1FpFzY2tdk" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary-container/60 to-transparent" />
        </div>
        <div className="relative z-10 text-center px-margin-desktop space-y-stack-md">
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-white text-[64px] mb-4">flight_takeoff</span>
            <h1 className="font-h1 text-h1 text-white tracking-tight">SkyVoyage</h1>
            <p className="font-body-lg text-body-lg text-white/90 max-w-md mx-auto">Fly Smarter, Travel Better</p>
          </div>
        </div>
        <div className="absolute bottom-12 left-12 p-6 glass-card rounded-2xl max-w-xs hidden lg:block">
          <p className="font-label-caps text-label-caps text-primary mb-2">SẮP KHỞI HÀNH</p>
          <p className="font-body-md text-body-md text-on-surface-variant italic">"Trải nghiệm sự khác biệt trong từng dặm bay cùng đội ngũ tận tâm của chúng tôi."</p>
        </div>
      </section>

      <section className="flex-1 flex items-center justify-center bg-surface-container p-margin-mobile md:p-margin-desktop min-h-screen">
        <div className="w-full max-w-[480px]">
          <div className="md:hidden flex flex-col items-center mb-stack-lg">
            <span className="material-symbols-outlined text-primary text-[48px]">flight_takeoff</span>
            <h1 className="font-h2 text-h3 font-bold text-primary">SkyVoyage</h1>
          </div>

          <div className="glass-card rounded-2xl p-8 md:p-12">
            <header className="mb-stack-lg text-center md:text-left">
              <h2 className="font-h2 text-h2 text-primary mb-2">Chào mừng trở lại</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Đăng nhập để tiếp tục đặt vé</p>
            </header>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant ml-1" htmlFor="email">EMAIL</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors">mail</span>
                  <input className="w-full pl-12 pr-4 py-4 bg-white/50 border border-outline-variant rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all font-body-md placeholder:text-outline/60" id="email" placeholder="Nhập email của bạn" type="email" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant ml-1" htmlFor="password">MẬT KHẨU</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors">lock</span>
                  <input className="w-full pl-12 pr-12 py-4 bg-white/50 border border-outline-variant rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all font-body-md placeholder:text-outline/60" id="password" placeholder="Nhập mật khẩu" type="password" />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors" type="button">
                    <span className="material-symbols-outlined">visibility</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input className="peer appearance-none w-5 h-5 border-2 border-outline-variant rounded checked:bg-secondary checked:border-secondary transition-all cursor-pointer" type="checkbox" />
                    <span className="material-symbols-outlined absolute text-white text-[16px] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">check</span>
                  </div>
                  <span className="font-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">Ghi nhớ đăng nhập</span>
                </label>
                <a className="font-body-md text-secondary hover:underline transition-all" href="#">Quên mật khẩu?</a>
              </div>

              <button className="orange-cta w-full py-4 rounded-full text-white font-h3 text-h3 shadow-lg flex items-center justify-center gap-2" type="submit">Tìm chuyến bay</button>
            </form>

            <footer className="mt-8 text-center mt-12">
              <p className="font-body-md text-on-surface-variant">Chưa có tài khoản?<a className="text-primary font-bold hover:underline ml-1" href="#">Đăng ký ngay</a></p>
            </footer>
          </div>

          <div className="mt-stack-lg flex flex-wrap justify-center gap-4 text-outline font-label-caps opacity-60">
            <a className="hover:text-on-surface transition-colors" href="#">Điều khoản</a>
            <a className="hover:text-on-surface transition-colors" href="#">Bảo mật</a>
            <a className="hover:text-on-surface transition-colors" href="#">Hỗ trợ</a>
            <span>© 2024 SkyVoyage</span>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
