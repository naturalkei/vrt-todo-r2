import { Search, X } from 'lucide-react'
import { useState } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = 'Search todos...' }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div
      className={`relative flex items-center gap-3 rounded-bubble border-4 bg-white px-5 py-3 shadow-soft transition-all ${
        isFocused ? 'border-nook-green shadow-glow' : 'border-nook-cream-dark'
      }`}
    >
      <Search
        size={22}
        className="text-nook-brown"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent font-korean text-sm text-nook-brown-dark outline-none placeholder:text-nook-brown/50"
        aria-label="Search todos"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="rounded-full bg-nook-peach p-1.5 transition-all hover:bg-nook-peach-dark hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nook-peach active:scale-90"
          aria-label="Clear search"
        >
          <X size={16} className="text-nook-brown-dark" aria-hidden="true" strokeWidth={3} />
        </button>
      )}
    </div>
  )
}
