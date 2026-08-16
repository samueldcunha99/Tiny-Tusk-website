/**
 * The guide's mixed-weight convention (p20, and shown throughout p33-34):
 * a DemiBold first word followed by a Regular second word --
 * "**Schedule** Appointment", "**Start** Here", "**Cavities** stages".
 *
 * It is one label, so it is one element with two spans; screen readers read it
 * as a single phrase rather than two fragments.
 */
export interface MixedWeightLabelProps {
  lead: string
  rest: string
  className?: string | undefined
  /** Use the condensed display face rather than the sans. */
  display?: boolean | undefined
  style?: React.CSSProperties | undefined
}

export function MixedWeightLabel({
  lead,
  rest,
  className,
  display = false,
  style,
}: MixedWeightLabelProps) {
  return (
    <span
      className={[display ? 'font-display' : 'font-sans', className].filter(Boolean).join(' ')}
      style={style}
    >
      <span style={{ fontWeight: 600 }}>{lead}</span>
      <span aria-hidden="true">&nbsp;</span>
      <span style={{ fontWeight: 400 }}>{rest}</span>
    </span>
  )
}
