import { useState, useEffect, useRef, type ReactNode } from 'react'
import { Search, Loader2, MapPin, X } from 'lucide-react'
import { useAddressSearch } from '@/hooks/useAddressSearch'
import type { AddressSuggestion } from '@/types/map'

interface Props {
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSelect: (suggestion: AddressSuggestion) => void
  /** Ícono líder a la izquierda (default: lupa). */
  leadingIcon?: ReactNode
  /** Muestra una X para limpiar el texto cuando hay valor. */
  clearable?: boolean
}

export default function AddressAutocomplete({
  placeholder,
  value,
  onChange,
  onSelect,
  leadingIcon,
  clearable = false,
}: Props) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(value), 300)
    return () => clearTimeout(t)
  }, [value])

  const { data: suggestions = [], isFetching } = useAddressSearch(debouncedQuery)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value)
    setOpen(true)
  }

  function handleSelect(s: AddressSuggestion) {
    const name = s.display_name.split(',').slice(0, 2).join(',').trim()
    onChange(name)
    onSelect(s)
    setOpen(false)
  }

  const showClear = clearable && value.length > 0 && !isFetching

  return (
    <div ref={containerRef} className="relative">
      <div className="field relative flex items-center rounded-none" style={{ height: 44 }}>
        <span className="absolute left-3.5 flex items-center text-[#626B7F]">
          {leadingIcon ?? <Search size={15} />}
        </span>
        <input
          type="text"
          value={value}
          onChange={handleInput}
          onFocus={() => {
            if (value.length >= 3) setOpen(true)
          }}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 pl-10 pr-9 text-sm text-[#F5F7FA] outline-none placeholder:text-[#626B7F]"
        />
        {isFetching && (
          <Loader2 size={14} className="absolute right-3.5 animate-spin text-[#626B7F]" />
        )}
        {showClear && (
          <button
            type="button"
            onClick={() => {
              onChange('')
              setOpen(false)
            }}
            className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-none text-[#626B7F] transition hover:bg-white/[0.08] hover:text-[#F5F7FA]"
            title="Limpiar"
            aria-label="Limpiar"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="panel-scroll absolute z-30 mt-2 max-h-52 w-full overflow-y-auto rounded-none border border-white/[0.08] bg-[#14161c] p-1 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
          {suggestions.map((s) => (
            <li key={s.place_id}>
              <button
                type="button"
                onClick={() => handleSelect(s)}
                className="flex w-full items-start gap-2.5 rounded-none px-3 py-2.5 text-left transition hover:bg-white/[0.06]"
              >
                <MapPin size={13} className="mt-0.5 flex-shrink-0 text-[#626B7F]" />
                <span className="text-xs leading-snug text-[#F5F7FA]/85">{s.display_name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
