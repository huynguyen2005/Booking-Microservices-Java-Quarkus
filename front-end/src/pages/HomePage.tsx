import '../App.css'

function HomePage() {
  return (
    <>
      {/* Header Section */}
      <header className="bg-surface/80 backdrop-blur-md dark:bg-surface-container/80 docked full-width top-0 z-50 shadow-sm border-b border-white/20">
        <nav className="flex justify-between items-center w-full px-margin-desktop py-4 max-w-container-max mx-auto transition-all duration-300 ease-in-out">
          <div className="font-h3 text-h3 font-bold text-primary dark:text-primary-fixed">SkyVoyage</div>
          <div className="hidden md:flex items-center gap-stack-lg">
            <a className="font-body-md text-body-md text-primary border-b-2 border-primary dark:text-primary-fixed dark:border-primary-fixed pb-1 transition-opacity hover:opacity-80" href="#">Chuyến bay</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary dark:text-surface-variant dark:hover:text-primary-fixed transition-opacity hover:opacity-80" href="#">Vé của tôi</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary dark:text-surface-variant dark:hover:text-primary-fixed transition-opacity hover:opacity-80" href="#">Check-in</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary dark:text-surface-variant dark:hover:text-primary-fixed transition-opacity hover:opacity-80" href="#">Hỗ trợ</a>
          </div>
          <div className="flex items-center gap-stack-md">
            <button className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-opacity px-4 py-2">Đăng nhập</button>
            <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-body-md text-body-md hover:opacity-90 transition-all">Đăng ký</button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[870px] flex items-center justify-center overflow-hidden pt-16">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#003366] to-[#87CEEB] opacity-90" />
          <img alt="Airplane in sky" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0x2TOH-mKoyBs7eCh3cbef6BtU_W2MwCpLwd7Sb6JUHFuUwqxLnmFA0slvTGAZMhzd1pAU-UC4MPvPnUOSWFDxSe5RypgTs7bxqAwFY5HNCnxKcHG_ymVX1_BpX8Z5ru-skT3fc4m1iOwPLhaT1iP3o0jgh8E0pWV5FnZ_uWvoj7Jg3GxrMwGJnQM7dgPmZlFzZsRZvS1pNt4so7k7dadZZnlrqJBZDvNjyH0cFqHhFCsrZWswfzqJsCEVwKy8x9DGosZeii8KIA" />
        </div>
        <div className="relative z-10 w-full max-w-container-max px-margin-mobile md:px-margin-desktop py-stack-lg">
          <div className="text-center mb-stack-lg">
            <h1 className="font-h1 text-h1 text-white mb-stack-sm drop-shadow-lg">Bay xa hơn cùng SkyVoyage</h1>
            <p className="text-white/90 font-body-lg text-body-lg max-w-2xl mx-auto drop-shadow-md">Khám phá thế giới với dịch vụ hàng không 5 sao, mang lại sự an tâm và thoải mái tuyệt đối trên mỗi dặm bay.</p>
          </div>
          {/* Booking Search Card */}
          <div className="glass-card rounded-[24px] p-8 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-on-surface-variant flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">flight_takeoff</span> ĐIỂM ĐI</label>
                <input className="bg-white/50 border-outline-variant focus:border-primary focus:ring-secondary-container rounded-xl px-4 py-3 text-on-surface" placeholder="Hà Nội (HAN)" type="text" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-on-surface-variant flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">flight_land</span> ĐIỂM ĐẾN</label>
                <input className="bg-white/50 border-outline-variant focus:border-primary focus:ring-secondary-container rounded-xl px-4 py-3 text-on-surface" placeholder="Hồ Chí Minh (SGN)" type="text" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-on-surface-variant flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">calendar_today</span> NGÀY ĐI</label>
                  <input className="bg-white/50 border-outline-variant focus:border-primary focus:ring-secondary-container rounded-xl px-4 py-3 text-on-surface" type="date" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-on-surface-variant flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">event_repeat</span> NGÀY VỀ</label>
                  <input className="bg-white/50 border-outline-variant focus:border-primary focus:ring-secondary-container rounded-xl px-4 py-3 text-on-surface" type="date" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-on-surface-variant flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">person</span> HÀNH KHÁCH</label>
                <div className="flex items-center justify-between bg-white/50 border border-outline-variant rounded-xl px-4 py-3">
                  <button className="w-8 h-8 rounded-full border border-outline flex items-center justify-center hover:bg-white transition-colors"><span className="material-symbols-outlined text-[18px]">remove</span></button>
                  <span className="font-medium">1 Người lớn</span>
                  <button className="w-8 h-8 rounded-full border border-outline flex items-center justify-center hover:bg-white transition-colors"><span className="material-symbols-outlined text-[18px]">add</span></button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-on-surface-variant flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">airline_seat_recline_extra</span> HẠNG GHẾ</label>
                <select className="bg-white/50 border-outline-variant focus:border-primary focus:ring-secondary-container rounded-xl px-4 py-3 text-on-surface">
                  <option>Phổ thông (Economy)</option>
                  <option>Thương gia (Business)</option>
                  <option>Hạng nhất (First Class)</option>
                </select>
              </div>
              <button className="btn-cta text-white font-bold h-[52px] rounded-full text-body-md flex items-center justify-center gap-2">Tìm chuyến bay <span className="material-symbols-outlined">search</span></button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex justify-between items-end mb-stack-lg">
          <div>
            <h2 className="font-h2 text-h2 text-primary mb-2">Điểm đến phổ biến</h2>
            <p className="text-on-surface-variant font-body-md">Những hành trình được yêu thích nhất trong tháng này</p>
          </div>
          <button className="text-secondary font-semibold hover:underline flex items-center gap-1">Xem tất cả <span className="material-symbols-outlined text-[18px]">arrow_forward</span></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
          <div className="group relative overflow-hidden rounded-[16px] aspect-[4/3] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
            <img alt="Tokyo" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxJ6srs8r31bpmLMqUzT7o2-sgn52Y3eETbi_8zUqBSzSObEa6rONfTFoKSo8u0bDTp0nvfeEjXAskhtjoVTqzMbmYJu9TN6z7Dish2crofc8MZZn4ELCc7QQLwMeaNQyxeqNW6QcCVI05pXCzCtGaQk5JXUo63htliot57n-8J8y4jALaplq2gTwYDQXebM4K-DUbn3z3LUSQSeYg5QJV9wk_Y45qAPgtuz-UUm17Eg9wJb9inNxJ4UEz_yT8294cHze92zDUjkE" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white w-full"><h3 className="font-h3 text-h3 mb-1">Tokyo</h3><div className="flex justify-between items-center"><span className="text-white/80 text-sm">Từ 2.900.000 VNĐ</span><span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs uppercase tracking-wider">Khám phá ngay</span></div></div>
          </div>
          <div className="group relative overflow-hidden rounded-[16px] aspect-[4/3] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
            <img alt="Paris" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1AeTiZ8Nr2Gs1oOMTD1m6kRgN-a7oxEMLLEK1CY-O9Qnbp8gJ3om5ffDaMPIt3rR7eIIGauC47-nxDgkJBTAM-wnCXeLd6fbPfn9QjYncr4cQ82PKMoPjyCOUKGbAMoL466O4abD3fOoyBU406csPXgHy8VnAkHx7wyFvtG0XXqehaf2cJLP6_kJuVCi5m3lRIt3GmRiJ71PeWuAD-MIQQ56l0rAcz01tRiw8BZnVmKNsDhUBYgq0JpWxgOEHNfeE7ZwLBygsEyE" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white w-full"><h3 className="font-h3 text-h3 mb-1">Paris</h3><div className="flex justify-between items-center"><span className="text-white/80 text-sm">Từ 5.400.000 VNĐ</span><span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs uppercase tracking-wider">Khám phá ngay</span></div></div>
          </div>
          <div className="group relative overflow-hidden rounded-[16px] aspect-[4/3] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
            <img alt="Singapore" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9KQB9O9ITI2lmlNxY8o76COOwKMa-6_wYPgk6_9CjOqCcylcYIOL5MSbbD8pgnT58FBtYwQIaaCqy5eY54TYlVYxrxTa3a--z_pOM7Zw8okhNWPWMW4F-lBru_dCVtu5dGT0b5IvcZ-yb0sDf5FHPITiCp9X92XL0GJTXLyxsyAzJYf4koX1vJWIZb6cKQy6K-hr4J7x-fnpx7pY6aBUkigdq37NjH5a-n7fVDLW48_cH-oLJ3Cs7cPslH7nTrUqAsvbvnf0GGNU" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white w-full"><h3 className="font-h3 text-h3 mb-1">Singapore</h3><div className="flex justify-between items-center"><span className="text-white/80 text-sm">Từ 1.800.000 VNĐ</span><span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs uppercase tracking-wider">Khám phá ngay</span></div></div>
          </div>
          <div className="group relative overflow-hidden rounded-[16px] aspect-[4/3] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
            <img alt="Seoul" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD08Ic-t3y2YHb2MvG91j4w_wJpIUoPw33hzSXWrNWXz9J4b7dOe4gKnSJOgtL5NpQWpquF-B8OLWkreyO4_fYyvWOESrN7F97rOQ5uqCLaL1FI_hxROMc9YZB5DsJiF9lgdnk1nzBxgaUDqRwPwNe-tGu0xfMwl6eDPb8j7PpuewSLDllE3Q2mAS1CdBLULaemgUVPrtGkmYyIr6hkJmV0S3U4Oxt3eFN8DBm-PDUJQgOLOX-vT37vzPXJh86gfCh2Hy6tj5zzNQg" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white w-full"><h3 className="font-h3 text-h3 mb-1">Seoul</h3><div className="flex justify-between items-center"><span className="text-white/80 text-sm">Từ 3.200.000 VNĐ</span><span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs uppercase tracking-wider">Khám phá ngay</span></div></div>
          </div>
          <div className="group relative overflow-hidden rounded-[16px] aspect-[4/3] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
            <img alt="London" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKOv-5lIpfdozyNXQi1J0ZAfKeQfT5d4NaNi16NkMZ9s5_SPJGbb0ATyaWKuUDabHfmvEoJ4BF2xCX6Ypaxsbr2pC7KhrXWmO1dKt1qX_qtI-E96-nF9gjq0dr-KtIpH-KzZfuhVanbcc04GOLUk_3YfpivNegwXRks697Q2G4AB-2duVtzU7lGy6VfKtYjkwCkXDcIB8WQLatmdFld_gISY94YlnN8OT_NWeQSRPzib9nZGcFuO6CuG1BzOp1WYz1r_k-FJ0SolA" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white w-full"><h3 className="font-h3 text-h3 mb-1">London</h3><div className="flex justify-between items-center"><span className="text-white/80 text-sm">Từ 6.100.000 VNĐ</span><span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs uppercase tracking-wider">Khám phá ngay</span></div></div>
          </div>
          <div className="group relative overflow-hidden rounded-[16px] aspect-[4/3] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
            <img alt="Dubai" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBezuwn5GS80paPWZA9twwqixuMi4MlRIgPOM8R5t5uFjZGFQx0zU2JFoLxoZUU1Y_J15twwvU77kH5FUhCSYKqGa_b8yjFWfyWC3VzrZZa7vn8IbQIcvLVHPTgG53XMPn76zCj0CHyFHRguqdwWNRbSvyAw1C38VczMpYvKwLtTHIv13hw96ZKt4YPul3DQPoMzCBYK-WLKCBMnmFRgCJ5Sb-RodosZrfZCkPVM12VQpavUqEXDVJpaFKPIM8gPZeRxY_51hwMjUI" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white w-full"><h3 className="font-h3 text-h3 mb-1">Dubai</h3><div className="flex justify-between items-center"><span className="text-white/80 text-sm">Từ 4.800.000 VNĐ</span><span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs uppercase tracking-wider">Khám phá ngay</span></div></div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-section-gap bg-surface-container-low">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center">
          <h2 className="font-h2 text-h2 text-primary mb-stack-lg">Tại sao chọn SkyVoyage?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            <div className="glass-card p-8 rounded-[16px] flex flex-col items-center text-center hover:-translate-y-2 transition-all"><div className="w-16 h-16 bg-primary-container/20 rounded-full flex items-center justify-center mb-6"><span className="material-symbols-outlined text-primary text-[32px]">bolt</span></div><h4 className="font-h3 text-h3 text-primary mb-3">Đặt vé nhanh</h4><p className="text-on-surface-variant font-body-md">Thanh toán và nhận vé chỉ trong 60 giây với quy trình tối ưu.</p></div>
            <div className="glass-card p-8 rounded-[16px] flex flex-col items-center text-center hover:-translate-y-2 transition-all"><div className="w-16 h-16 bg-primary-container/20 rounded-full flex items-center justify-center mb-6"><span className="material-symbols-outlined text-primary text-[32px]">verified_user</span></div><h4 className="font-h3 text-h3 text-primary mb-3">Thanh toán an toàn</h4><p className="text-on-surface-variant font-body-md">Hệ thống bảo mật đa lớp, hỗ trợ mọi phương thức quốc tế.</p></div>
            <div className="glass-card p-8 rounded-[16px] flex flex-col items-center text-center hover:-translate-y-2 transition-all"><div className="w-16 h-16 bg-primary-container/20 rounded-full flex items-center justify-center mb-6"><span className="material-symbols-outlined text-primary text-[32px]">edgesensor_high</span></div><h4 className="font-h3 text-h3 text-primary mb-3">Check-in online</h4><p className="text-on-surface-variant font-body-md">Tiết kiệm thời gian tại sân bay với tính năng làm thủ tục trực tuyến.</p></div>
            <div className="glass-card p-8 rounded-[16px] flex flex-col items-center text-center hover:-translate-y-2 transition-all"><div className="w-16 h-16 bg-primary-container/20 rounded-full flex items-center justify-center mb-6"><span className="material-symbols-outlined text-primary text-[32px]">diamond</span></div><h4 className="font-h3 text-h3 text-primary mb-3">Trải nghiệm premium</h4><p className="text-on-surface-variant font-body-md">Dịch vụ mặt đất và trên không tiêu chuẩn 5 sao quốc tế.</p></div>
          </div>
        </div>
      </section>

      {/* Booking Process */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden">
        <h2 className="font-h2 text-h2 text-primary text-center mb-16">Quy trình đặt vé</h2>
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-outline-variant -translate-y-1/2 hidden lg:block border-dashed border-t-2" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 relative z-10">
            <div className="flex flex-col items-center group"><div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-6 ring-8 ring-white">1</div><h5 className="font-h3 text-[18px] text-primary mb-2">Tìm chuyến bay</h5><p className="text-sm text-on-surface-variant text-center max-w-[200px]">Chọn điểm đến và thời gian bay phù hợp.</p></div>
            <div className="flex flex-col items-center group"><div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-6 ring-8 ring-white">2</div><h5 className="font-h3 text-[18px] text-primary mb-2">Chọn ghế</h5><p className="text-sm text-on-surface-variant text-center max-w-[200px]">Xem sơ đồ và chọn vị trí ngồi yêu thích.</p></div>
            <div className="flex flex-col items-center group"><div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-6 ring-8 ring-white">3</div><h5 className="font-h3 text-[18px] text-primary mb-2">Thanh toán</h5><p className="text-sm text-on-surface-variant text-center max-w-[200px]">Đa dạng phương thức, an toàn và bảo mật.</p></div>
            <div className="flex flex-col items-center group"><div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-6 ring-8 ring-white">4</div><h5 className="font-h3 text-[18px] text-primary mb-2">Nhận vé</h5><p className="text-sm text-on-surface-variant text-center max-w-[200px]">Vé điện tử được gửi qua email/SMS ngay lập tức.</p></div>
            <div className="flex flex-col items-center group"><div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-6 ring-8 ring-white">5</div><h5 className="font-h3 text-[18px] text-primary mb-2">Check-in</h5><p className="text-sm text-on-surface-variant text-center max-w-[200px]">Hoàn tất thủ tục online và sẵn sàng cất cánh.</p></div>
          </div>
          <div className="absolute top-1/2 left-[5%] -translate-y-[100%] hidden lg:block opacity-30"><span className="material-symbols-outlined text-primary text-[40px] transform rotate-45">flight</span></div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-h2 text-h2 text-primary mb-2">Khách hàng nói gì về chúng tôi</h2>
          <p className="text-on-surface-variant">Sự hài lòng của bạn là động lực phát triển của SkyVoyage</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="glass-card p-8 rounded-[16px] flex flex-col h-full"><div className="flex gap-1 text-[#FFD700] mb-4"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span></div><p className="font-body-md text-on-surface italic mb-8 flex-grow">"Dịch vụ cực kỳ chuyên nghiệp. Tôi rất ấn tượng với tốc độ đặt vé và giao diện dễ sử dụng. Chuyến bay từ Hà Nội đi Tokyo của tôi diễn ra vô cùng suôn sẻ."</p><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high"><img alt="User 1" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIDAUMFs5gEWjBeQ-8noYimtvmF9fZxG4tm74Tb2wSJnLYv6fZIOn3CBoI53RWhz-_fL6Tpi-vEYw8fxbPBmxN-qKz2fuByx7fmSFg2wdH-wMenEfKMQkxBUHCruxtfFoJJx2h4MUMblvfjmE6CZ10FzvPWznkf9fkRVwIz1pFCc1tdOMIXjpZxo0z_eX1osZFfpmXI_ecazC3b1KLByMn49CRbyJySypqSxAD3c-okRNynVKEnXvZvhh-yNMLzHvKH1FPKutdRB0" /></div><div><h6 className="font-bold text-primary">Minh Hoàng</h6><span className="text-xs text-on-surface-variant">Doanh nhân</span></div></div></div>
          <div className="glass-card p-8 rounded-[16px] flex flex-col h-full"><div className="flex gap-1 text-[#FFD700] mb-4"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span></div><p className="font-body-md text-on-surface italic mb-8 flex-grow">"SkyVoyage thực sự mang lại trải nghiệm premium. Từ phòng chờ đến ghế ngồi trên máy bay, mọi thứ đều hoàn hảo. Nhân viên hỗ trợ rất nhiệt tình khi tôi cần đổi lịch bay."</p><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high"><img alt="User 2" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0Kk3kxBMMzZw--NJAREJXSUixJ7o8cGbdEif2zng5nGgUqA6R0oExsuV_-yly15I-HZUKkWUM9Jslp2ctzzUZIZq9h9MaLDiH2LsGQbF95lfRTcnXG0skWci55hAMznZBpKZC42LePwAkkYfJcqHoBQqMPzEDDNHXyKRbS2V2glFeVz3QJIa96Qx4sKH5vi8F90dOuP7T5jTYpWqXFC3odglcErBR1eAyPHyH8o97qUD18ZdY10KrSqiSValuUzYrGE8F3eWwI60" /></div><div><h6 className="font-bold text-primary">Khánh Linh</h6><span className="text-xs text-on-surface-variant">Travel Blogger</span></div></div></div>
          <div className="glass-card p-8 rounded-[16px] flex flex-col h-full"><div className="flex gap-1 text-[#FFD700] mb-4"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span></div><p className="font-body-md text-on-surface italic mb-8 flex-grow">"Tôi thường xuyên đi công tác nước ngoài và SkyVoyage luôn là lựa chọn hàng đầu. Ứng dụng đặt vé rất tiện lợi, thông tin chuyến bay được cập nhật liên tục."</p><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high"><img alt="User 3" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-zSCLcPrmoc0rjNmIQXcawg0095OxP_qhbK7frwt9ll_yzACWhpsbMnAvYZKuv5SeNEJhAZOw6BX-u1AH9KQBYRsaxStXcL9YRrh7SRC4DY3YoRrX-mDlECng5Hdqbdu_79nagQUSgNbSBNbctevi2RISRMrg1Z4Z6mSmMeoJ49XKfHJYv8DVVTfg5cYH363pbT2OrmZd8hc5o6bvs9zbpQXlsFR4DRh_WCLBrnPbRCU6puKPlSfGakUrin3P1VoScaozBlZZFuE" /></div><div><h6 className="font-bold text-primary">Thành Nam</h6><span className="text-xs text-on-surface-variant">Giám đốc Marketing</span></div></div></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary dark:bg-surface-container-highest full-width border-t border-white/10 none">
        <div className="w-full px-margin-desktop py-section-gap flex flex-col md:flex-row justify-between items-start gap-gutter max-w-container-max mx-auto transition-colors duration-200">
          <div className="flex flex-col gap-stack-md max-w-sm">
            <div className="font-h3 text-h3 font-bold text-on-primary dark:text-on-surface">SkyVoyage</div>
            <p className="font-body-md text-body-md text-on-primary/70 dark:text-on-surface-variant">Hãng hàng không thế hệ mới, mang đến những hành trình an toàn, tiện nghi và cảm hứng bất tận trên mỗi chuyến bay.</p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors" href="#"><svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg></a>
              <a className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors" href="#"><svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c.796 0 1.441.645 1.441 1.44s-.645 1.44-1.441 1.44-1.44-.645-1.44-1.44.645-1.44 1.44-1.44z" /></svg></a>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-stack-lg">
            <div className="flex flex-col gap-4"><h6 className="font-bold text-on-primary">Dịch vụ</h6><a className="font-body-md text-body-md text-on-primary/70 hover:text-on-primary dark:text-on-surface-variant dark:hover:text-on-surface hover:underline transition-all" href="#">Liên hệ</a><a className="font-body-md text-body-md text-on-primary/70 hover:text-on-primary dark:text-on-surface-variant dark:hover:text-on-surface hover:underline transition-all" href="#">Câu hỏi thường gặp</a></div>
            <div className="flex flex-col gap-4"><h6 className="font-bold text-on-primary">Chính sách</h6><a className="font-body-md text-body-md text-on-primary/70 hover:text-on-primary dark:text-on-surface-variant dark:hover:text-on-surface hover:underline transition-all" href="#">Chính sách bảo mật</a><a className="font-body-md text-body-md text-on-primary/70 hover:text-on-primary dark:text-on-surface-variant dark:hover:text-on-surface hover:underline transition-all" href="#">Điều khoản sử dụng</a></div>
            <div className="flex flex-col gap-4"><h6 className="font-bold text-on-primary">Bản tin</h6><p className="text-xs text-on-primary/60 mb-2">Đăng ký nhận ưu đãi mới nhất</p><div className="flex"><input className="bg-white/10 border-white/20 text-white rounded-l-lg px-4 py-2 focus:ring-0 focus:border-white w-full" placeholder="Email của bạn" type="email" /><button className="bg-white text-primary px-4 py-2 rounded-r-lg font-bold"><span className="material-symbols-outlined">send</span></button></div></div>
          </div>
        </div>
        <div className="w-full px-margin-desktop py-8 border-t border-white/10 max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4"><span className="text-on-primary/50 text-sm">© 2024 SkyVoyage. Tất cả các quyền được bảo lưu.</span><div className="flex gap-6"><span className="material-symbols-outlined text-on-primary/50">payments</span><span className="material-symbols-outlined text-on-primary/50">credit_card</span><span className="material-symbols-outlined text-on-primary/50">account_balance</span></div></div>
      </footer>
    </>
  )
}

export default HomePage


