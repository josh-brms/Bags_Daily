import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { selectOnArrow } from '@/lib/radioKeyboard'

interface SizePickerProps {
  sizes: string[]
  value: string
  onChange: (size: string) => void
}

export default function SizePicker({ sizes, value, onChange }: SizePickerProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      onKeyDown={selectOnArrow(onChange)}
      aria-label="Size"
      className="flex flex-wrap gap-2.5"
    >
      {sizes.map(s => (
        <RadioGroupItem
          key={s}
          value={s}
          aria-label={`Size ${s}`}
          className={`
            flex h-11 min-w-12 items-center justify-center rounded-md border border-line bg-surface
            px-3.5 text-[0.9rem] font-medium transition-colors duration-150 hover:border-ink
            data-[state=checked]:border-ink data-[state=checked]:bg-ink data-[state=checked]:text-cream
          `}
        >
          {s}
        </RadioGroupItem>
      ))}
    </RadioGroup>
  )
}
