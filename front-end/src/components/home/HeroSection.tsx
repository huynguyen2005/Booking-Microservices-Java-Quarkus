export function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="container hero-content">
        <h1>Bay xa hon cùng SkyVoyage</h1>
        <p>
          Khám phá th? gi?i v?i d?ch v? hàng không 5 sao, mang l?i s? an tâm và
          tho?i mái tuy?t d?i trên m?i d?m bay.
        </p>

        <form className="glass-card booking-card" onSubmit={(event) => event.preventDefault()}>
          <div className="booking-grid">
            <label>
              <span>Ði?m di</span>
              <input type="text" placeholder="Hà N?i (HAN)" />
            </label>
            <label>
              <span>Ði?m d?n</span>
              <input type="text" placeholder="H? Chí Minh (SGN)" />
            </label>
            <label>
              <span>Ngày di</span>
              <input type="date" />
            </label>
            <label>
              <span>Ngày v?</span>
              <input type="date" />
            </label>
            <label>
              <span>Hành khách</span>
              <input type="text" value="1 Ngu?i l?n" readOnly />
            </label>
            <label>
              <span>H?ng gh?</span>
              <select defaultValue="economy">
                <option value="economy">Ph? thông (Economy)</option>
                <option value="business">Thuong gia (Business)</option>
                <option value="first">H?ng nh?t (First Class)</option>
              </select>
            </label>
            <button type="submit" className="btn btn-cta">Tìm chuy?n bay</button>
          </div>
        </form>
      </div>
    </section>
  )
}

