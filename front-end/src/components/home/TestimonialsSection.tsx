import type { Testimonial } from '../../data/homeData'

type TestimonialsSectionProps = {
  items: Testimonial[]
}

export function TestimonialsSection({ items }: TestimonialsSectionProps) {
  return (
    <section className="section container">
      <div className="section-title center">
        <h2>Khách hàng nói gì về chúng tôi</h2>
        <p>Sự hài lòng của bạn là động lực phát triển của SkyVoyage</p>
      </div>
      <div className="testimonial-grid">
        {items.map((item) => (
          <article className="glass-card testimonial-card" key={item.name}>
            <p className="stars">★★★★★</p>
            <blockquote>"{item.quote}"</blockquote>
            <div className="reviewer">
              <img src={item.avatar} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>{item.role}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
