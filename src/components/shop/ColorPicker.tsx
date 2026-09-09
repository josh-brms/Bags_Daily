import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { selectOnArrow } from '@/lib/radioKeyboard'
import type { ProductColor } from '@/data/products'

interface ColorPickerProps {
  colors: ProductColor[]
  value: string
  onChange: (name: string) => void
}

export default function ColorPicker({ colors, value, onChange }: ColorPickerProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      onKeyDown={selectOnArrow(onChange)}
      aria-label="Colour"
      className="flex flex-wrap gap-3"
    >
      {colors.map(c => (
        <RadioGroupItem
          key={c.name}
          value={c.name}
          aria-label={c.name}
          style={{ backgroundColor: c.hex }}
          className={`
            h-11 w-11 border-ink/15 transition-shadow duration-150
            data-[state=checked]:ring-2 data-[state=checked]:ring-ink data-[state=checked]:ring-offset-2 data-[state=checked]:ring-offset-cream
            [&>span>svg]:hidden
          `}
        />
      ))}
    </RadioGroup>
  )
}
