import type { Feature } from '../../data/homeData'

type FeaturesSectionProps = {
  items: Feature[]
}

export function FeaturesSection({ items }: FeaturesSectionProps) {
  return (
    <section className="section section-soft">
      <div className="container">
        <div className="section-title center">
          <h2>Tại sao chọn SkyVoyage?</h2>
        </div>
        <div className="feature-grid">
          {items.map((item) => (
            <article className="glass-card feature-card" key={item.title}>
              <div className="icon-badge">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
