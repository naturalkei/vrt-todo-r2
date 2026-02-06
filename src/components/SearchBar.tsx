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
      className={`relative flex items-center gap-2 rounded-lg border-2 bg-white px-4 py-2 transition-colors ${
        isFocused ? 'border-blue-500' : 'border-gray-300'
      }`}
    >
      <Search
        size={20}
        className="text-gray-400"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
        aria-label="Search todos"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="rounded-full p-1 transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          aria-label="Clear search"
        >
          <X size={16} className="text-gray-400" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
