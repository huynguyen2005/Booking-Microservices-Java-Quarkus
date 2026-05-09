import type { Destination } from '../../data/homeData'

type DestinationsSectionProps = {
  items: Destination[]
}

export function DestinationsSection({ items }: DestinationsSectionProps) {
  return (
    <section className="section container">
      <div className="section-title">
        <h2>Ði?m d?n ph? bi?n</h2>
        <p>Nh?ng hành trình du?c yêu thích nh?t trong tháng này</p>
      </div>
      <div className="destination-grid">
        {items.map((item) => (
          <article className="destination-card" key={item.city}>
            <img src={item.image} alt={item.city} />
            <div className="destination-overlay">
              <h3>{item.city}</h3>
              <div>
                <span>{item.price}</span>
                <small>Khám phá ngay</small>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

