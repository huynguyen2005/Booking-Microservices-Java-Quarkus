import type { BookingStep } from '../../data/homeData'

type BookingStepsSectionProps = {
  items: BookingStep[]
}

export function BookingStepsSection({ items }: BookingStepsSectionProps) {
  return (
    <section className="section container">
      <div className="section-title center">
        <h2>Quy trình đặt vé</h2>
      </div>
      <div className="steps-grid">
        {items.map((item, index) => (
          <article className="step-item" key={item.title}>
            <div className="step-index">{index + 1}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
