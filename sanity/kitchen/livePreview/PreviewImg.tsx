/**
 * Stand-in for `next/image` inside the Studio bundle — there's no Next.js image
 * server here, so this renders a plain `<img>`, replicating just enough of
 * `next/image`'s own layout behavior (`fill` mode is an absolutely-positioned,
 * cover-fit image) that the real `.module.css` written against it still lines up.
 */
export function PreviewImg({
  src,
  alt,
  className,
  fill,
  width,
  height,
}: {
  src: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
}) {
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
    )
  }
  return <img src={src} alt={alt} className={className} width={width} height={height} />
}
