import { useState, useEffect, useRef } from 'react'
import { MapPin, Loader2 } from 'lucide-react'
import { useAddressSearch } from '@/hooks/useAddressSearch'
import type { AddressSuggestion } from '@/types/map'

interface Props {
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSelect: (suggestion: AddressSuggestion) => void
  iconColor?: string
}

export default function AddressAutocomplete({
  placeholder,
  value,
  onChange,
  onSelect,
  iconColor = '#9ca3af',
}: Props) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(t)
  }, [query])

  const { data: suggestions = [], isFetching } = useAddressSearch(debouncedQuery)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setQuery(v)
    onChange(v)
    setOpen(true)
  }

  function handleSelect(s: AddressSuggestion) {
    const name = s.display_name.split(',').slice(0, 2).join(',').trim()
    setQuery(name)
    onChange(name)
    onSelect(s)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative flex items-center">
        <MapPin
          size={16}
          className="absolute left-3 flex-shrink-0"
          style={{ color: iconColor }}
        />
        <input
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => query.length >= 3 && setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-9 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/25 focus:bg-white/8"
        />
        {isFetching && (
          <Loader2 size={14} className="absolute right-3 animate-spin text-white/30" />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-white/10 bg-[#1a1d27] shadow-xl">
          {suggestions.map((s) => (
            <li key={s.place_id}>
              <button
                type="button"
                onClick={() => handleSelect(s)}
                className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left hover:bg-white/5"
              >
                <MapPin size={13} className="mt-0.5 flex-shrink-0 text-white/30" />
                <span className="text-xs leading-snug text-white/80">
                  {s.display_name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
