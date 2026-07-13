import styles from './ServicesGrid.module.css'
import type { HomePage, ServiceCard } from '@/lib/content/types'

type ServicesContent = Pick<HomePage, 'servicesEyebrow' | 'servicesHeadline' | 'services'>

function Card({ service }: { service: ServiceCard }) {
  return (
    <div className={styles.card} data-variant={service.variant}>
      <div className={styles.icon}>{service.icon}</div>
      <h3 className={styles.title}>{service.title}</h3>
      <p className={styles.description}>{service.description}</p>
      {service.bullets.length > 0 && (
        <div className={styles.bullets}>
          {service.bullets.map((bullet) => (
            <div key={bullet} className={styles.bullet}>
              <span className={styles.check}>✓</span>
              {bullet}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ServicesGrid({ content }: { content: ServicesContent }) {
  const [firstRow, secondRow] = [content.services.slice(0, 3), content.services.slice(3)]

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <div className={styles.eyebrow}>{content.servicesEyebrow}</div>
        <h2 className={styles.headline}>{content.servicesHeadline}</h2>
      </div>
      <div className={styles.grid3}>
        {firstRow.map((service) => (
          <Card key={service.title} service={service} />
        ))}
      </div>
      {secondRow.length > 0 && (
        <div className={styles.grid2}>
          {secondRow.map((service) => (
            <Card key={service.title} service={service} />
          ))}
        </div>
      )}
    </section>
  )
}
