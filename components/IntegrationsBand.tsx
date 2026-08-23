import styles from './IntegrationsBand.module.css'

type IntegrationsContent = { integrationsEyebrow: string; integrationsHeadline: string; integrations: string[] }

export function IntegrationsBand({ content, style }: { content: IntegrationsContent; style?: React.CSSProperties }) {
  return (
    <section className={styles.section} style={style}>
      <div className={styles.eyebrow}>{content.integrationsEyebrow}</div>
      <h2 className={styles.headline}>{content.integrationsHeadline}</h2>
      <div className={styles.row}>
        {content.integrations.map((item) => (
          <span key={item} className={styles.pill}>
            {item}
          </span>
        ))}
      </div>
    </section>
  )
}
