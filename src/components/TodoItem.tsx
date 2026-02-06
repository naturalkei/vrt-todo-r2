import { Check, GripVertical, Pencil, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { type DraggableProvidedDragHandleProps } from '@hello-pangea/dnd'
import { type Todo } from '../lib/db'
import clsx from 'clsx'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number) => void
  onUpdate: (id: number, text: string) => void
  onDelete: (id: number) => void
  isDragging?: boolean
  dragHandleProps?: DraggableProvidedDragHandleProps | null
}

export default function TodoItem({
  todo,
  onToggle,
  onUpdate,
  onDelete,
  isDragging,
  dragHandleProps,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id!, editText)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div
      className={clsx(
        'group flex items-start gap-3 rounded-bubble border-4 p-4 transition-all',
        isDragging ? 'border-nook-green shadow-glow' : todo.completed ? 'border-nook-mint-dark bg-nook-mint' : 'border-nook-yellow-dark bg-nook-yellow hover:border-nook-green-dark',
        todo.completed && 'opacity-75',
      )}
      role="article"
      aria-label={`Todo: ${todo.text}`}
    >
      {/* Drag Handle */}
      <button
        {...dragHandleProps}
        type="button"
        className="cursor-grab touch-none rounded-full p-1 text-nook-brown opacity-0 transition-all hover:bg-nook-brown/10 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nook-green group-hover:opacity-100 active:cursor-grabbing"
        aria-label="Drag to reorder todo"
      >
        <GripVertical size={20} aria-hidden="true" />
      </button>

      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onToggle(todo.id!)}
        className={clsx(
          'mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-3 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nook-green',
          todo.completed
            ? 'border-nook-green-dark bg-nook-green text-white shadow-soft'
            : 'border-nook-brown hover:border-nook-green hover:shadow-soft',
        )}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        aria-pressed={todo.completed}
      >
        {todo.completed && <Check size={16} aria-hidden="true" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 rounded-bubble border-2 border-nook-green bg-white px-3 py-2 font-korean text-sm text-nook-brown-dark outline-none focus:shadow-glow"
              autoFocus
              aria-label="Edit todo text"
            />
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-nook-green p-2 text-white transition-all hover:bg-nook-green-dark hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nook-green active:scale-90"
              aria-label="Save changes"
            >
              <Check size={16} aria-hidden="true" strokeWidth={3} />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-full bg-nook-brown p-2 text-white transition-all hover:bg-nook-brown-dark hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nook-brown active:scale-90"
              aria-label="Cancel editing"
            >
              <X size={16} aria-hidden="true" strokeWidth={3} />
            </button>
          </div>
        ) : (
          <>
            <p
              className={clsx(
                'font-korean text-base font-medium break-words',
                todo.completed ? 'text-nook-brown line-through opacity-75' : 'text-nook-brown-dark',
              )}
            >
              {todo.text}
            </p>
            {todo.dueDate && (
              <p className="mt-2 font-korean text-xs text-nook-brown" aria-label={`Due date: ${format(todo.dueDate, 'PPP', { locale: ko })}`}>
                📅 {format(todo.dueDate, 'PPP', { locale: ko })}
              </p>
            )}
            {todo.tags && todo.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5" role="list" aria-label="Tags">
                {todo.tags.map(tag => (
                  <span
                    key={tag}
                    className="rounded-full bg-nook-sky px-2.5 py-1 font-korean text-xs font-medium text-nook-brown-dark shadow-soft"
                    role="listitem"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      {!isEditing && (
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-full bg-nook-sky p-2 text-nook-brown-dark transition-all hover:bg-nook-sky-dark hover:scale-110 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nook-sky active:scale-90"
            aria-label="Edit todo"
          >
            <Pencil size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(todo.id!)}
            className="rounded-full bg-nook-peach p-2 text-nook-brown-dark transition-all hover:bg-nook-peach-dark hover:scale-110 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nook-peach active:scale-90"
            aria-label="Delete todo"
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}
