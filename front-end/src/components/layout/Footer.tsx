export function Footer() {
  return (
    <footer className="bg-primary dark:bg-surface-container-highest full-width border-t border-white/10">
      <div className="w-full px-margin-desktop py-section-gap flex flex-col md:flex-row justify-between items-start gap-gutter max-w-container-max mx-auto transition-colors duration-200">
        <div className="flex flex-col gap-stack-md max-w-sm">
          <div className="font-h3 text-h3 font-bold text-on-primary dark:text-on-surface font-plus-jakarta">SkyVoyage</div>
          <p className="font-body-md text-body-md text-on-primary/70 dark:text-on-surface-variant font-plus-jakarta">Hãng hàng không thế hệ mới, mang đến những hành trình an toàn, tiện nghi và cảm hứng bất tận trên mọi chuyến bay.</p>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors" href="#">
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
            <a className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors" href="#">
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c.796 0 1.441.645 1.441 1.44s-.645 1.44-1.441 1.44-1.44-.645-1.44-1.44.645-1.44 1.44-1.44z" /></svg>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-stack-lg">
          <div className="flex flex-col gap-4">
            <h6 className="font-bold text-on-primary font-plus-jakarta">Dịch vụ</h6>
            <a className="font-body-md text-body-md text-on-primary/70 hover:text-on-primary hover:underline transition-all font-plus-jakarta" href="#">Liên hệ</a>
            <a className="font-body-md text-body-md text-on-primary/70 hover:text-on-primary hover:underline transition-all font-plus-jakarta" href="#">Câu hỏi thường gặp</a>
          </div>
          <div className="flex flex-col gap-4">
            <h6 className="font-bold text-on-primary font-plus-jakarta">Chính sách</h6>
            <a className="font-body-md text-body-md text-on-primary/70 hover:text-on-primary hover:underline transition-all font-plus-jakarta" href="#">Chính sách bảo mật</a>
            <a className="font-body-md text-body-md text-on-primary/70 hover:text-on-primary hover:underline transition-all font-plus-jakarta" href="#">Điều khoản sử dụng</a>
          </div>
          <div className="flex flex-col gap-4">
            <h6 className="font-bold text-on-primary font-plus-jakarta">Bản tin</h6>
            <p className="text-xs text-on-primary/60 mb-2 font-plus-jakarta">Đăng ký nhận ưu đãi mới nhất</p>
            <div className="flex">
              <input className="bg-white/10 border-white/20 text-white rounded-l-lg px-4 py-2 focus:ring-0 focus:border-white w-full font-plus-jakarta" placeholder="Email của bạn" type="email" />
              <button className="bg-white text-primary px-4 py-2 rounded-r-lg font-bold"><span className="material-symbols-outlined">send</span></button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-margin-desktop py-8 border-t border-white/10 max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-on-primary/50 text-sm font-plus-jakarta">© 2024 SkyVoyage. Tất cả các quyền được bảo lưu.</span>
        <div className="flex gap-6">
          <span className="material-symbols-outlined text-on-primary/50">credit_card</span>
          <span className="material-symbols-outlined text-on-primary/50">account_balance</span>
        </div>
      </div>
    </footer>
  )
}
