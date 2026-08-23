import styles from './TestimonialGrid.module.css'

type Testimonial = { quote: string; author: string; role?: string; venue: string }

type TestimonialsContent = {
  testimonialsEyebrow: string
  testimonialsHeadline: string
  testimonials: Testimonial[]
}

function Card({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className={styles.card}>
      <div className={styles.stars}>★★★★★</div>
      <p className={styles.quote}>&ldquo;{testimonial.quote}&rdquo;</p>
      <div className={styles.author}>{testimonial.author}</div>
      <div className={styles.role}>
        {testimonial.role} · {testimonial.venue}
      </div>
    </div>
  )
}

export function TestimonialGrid({ content, style }: { content: TestimonialsContent; style?: React.CSSProperties }) {
  return (
    <section className={styles.section} style={style}>
      <div className={styles.head}>
        <div className={styles.eyebrow}>{content.testimonialsEyebrow}</div>
        <h2 className={styles.headline}>{content.testimonialsHeadline}</h2>
      </div>
      <div className={styles.grid}>
        {content.testimonials.map((testimonial) => (
          <Card key={`${testimonial.author}-${testimonial.venue}`} testimonial={testimonial} />
        ))}
      </div>
    </section>
  )
}
