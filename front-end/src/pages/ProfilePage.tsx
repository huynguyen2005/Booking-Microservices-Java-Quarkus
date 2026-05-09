function ProfilePage() {
  return (
    <main className="pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      <div className="mb-stack-lg">
        <h1 className="font-h1 text-h2 md:text-h1 text-primary mb-stack-sm">Thông tin cá nhân</h1>
        <p className="text-on-surface-variant font-body-lg">Quản lý hồ sơ hành khách và thông tin liên hệ của bạn.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <section className="lg:col-span-8 space-y-gutter">
          <div className="glass-card rounded-xl p-stack-lg">
            <h2 className="font-h3 text-h3 text-primary mb-stack-md flex items-center gap-2">
              <span className="material-symbols-outlined">badge</span>
              Hồ sơ tài khoản
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
              <div>
                <label className="text-label-caps font-label-caps text-on-surface-variant">Họ và tên</label>
                <input className="mt-2 w-full bg-white/80 border border-outline-variant rounded-lg px-4 py-3" defaultValue="Nguyễn Văn A" />
              </div>
              <div>
                <label className="text-label-caps font-label-caps text-on-surface-variant">Email</label>
                <input className="mt-2 w-full bg-white/80 border border-outline-variant rounded-lg px-4 py-3" defaultValue="nguyenvan@email.com" />
              </div>
              <div>
                <label className="text-label-caps font-label-caps text-on-surface-variant">Số điện thoại</label>
                <input className="mt-2 w-full bg-white/80 border border-outline-variant rounded-lg px-4 py-3" defaultValue="+84 987 654 321" />
              </div>
              <div>
                <label className="text-label-caps font-label-caps text-on-surface-variant">Ngày sinh</label>
                <input className="mt-2 w-full bg-white/80 border border-outline-variant rounded-lg px-4 py-3" defaultValue="15/08/1998" />
              </div>
              <div className="md:col-span-2">
                <label className="text-label-caps font-label-caps text-on-surface-variant">Địa chỉ</label>
                <input className="mt-2 w-full bg-white/80 border border-outline-variant rounded-lg px-4 py-3" defaultValue="Quận 1, TP. Hồ Chí Minh" />
              </div>
            </div>
            <div className="mt-stack-lg flex gap-stack-md">
              <button className="bg-[#FF8C00] text-white font-bold px-6 py-3 rounded-xl">Lưu thay đổi</button>
              <button className="border border-primary text-primary font-bold px-6 py-3 rounded-xl">Hủy</button>
            </div>
          </div>

          <div className="glass-card rounded-xl p-stack-lg">
            <h2 className="font-h3 text-h3 text-primary mb-stack-md flex items-center gap-2">
              <span className="material-symbols-outlined">verified_user</span>
              Giấy tờ định danh
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
              <div>
                <label className="text-label-caps font-label-caps text-on-surface-variant">Số CCCD / Hộ chiếu</label>
                <input className="mt-2 w-full bg-white/80 border border-outline-variant rounded-lg px-4 py-3" defaultValue="079123456789" />
              </div>
              <div>
                <label className="text-label-caps font-label-caps text-on-surface-variant">Quốc tịch</label>
                <input className="mt-2 w-full bg-white/80 border border-outline-variant rounded-lg px-4 py-3" defaultValue="Việt Nam" />
              </div>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-4 space-y-gutter">
          <div className="glass-card rounded-xl p-stack-lg text-center">
            <div className="w-28 h-28 rounded-full mx-auto bg-primary/10 flex items-center justify-center mb-stack-md">
              <span className="material-symbols-outlined text-primary text-[52px]">person</span>
            </div>
            <h3 className="font-h3 text-h3 text-primary">Nguyễn Văn A</h3>
            <p className="text-on-surface-variant">Hạng thành viên: SkyGold</p>
          </div>

          <div className="glass-card rounded-xl p-stack-lg">
            <h4 className="font-h3 text-body-lg text-primary mb-stack-md">Tùy chọn nhanh</h4>
            <div className="flex flex-col gap-stack-sm">
              <button onClick={() => { window.location.hash = '/tickets' }} className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/70 transition-colors">
                Vé của tôi
              </button>
              <button onClick={() => { window.location.hash = '/checkin' }} className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/70 transition-colors">
                Check-in
              </button>
              <button onClick={() => { window.location.hash = '/flights' }} className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/70 transition-colors">
                Tìm chuyến bay
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default ProfilePage
