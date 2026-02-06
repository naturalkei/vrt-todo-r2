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
        'group flex items-start gap-3 rounded-lg border-2 bg-white p-4 transition-all',
        isDragging ? 'border-blue-400 shadow-lg' : 'border-gray-200 hover:border-gray-300',
        todo.completed && 'opacity-60',
      )}
      role="article"
      aria-label={`Todo: ${todo.text}`}
    >
      {/* Drag Handle */}
      <button
        {...dragHandleProps}
        type="button"
        className="cursor-grab touch-none rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 group-hover:opacity-100 active:cursor-grabbing"
        aria-label="Drag to reorder todo"
      >
        <GripVertical size={20} aria-hidden="true" />
      </button>

      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onToggle(todo.id!)}
        className={clsx(
          'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
          todo.completed
            ? 'border-green-500 bg-green-500 text-white'
            : 'border-gray-300 hover:border-green-500',
        )}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        aria-pressed={todo.completed}
      >
        {todo.completed && <Check size={14} aria-hidden="true" />}
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
              className="flex-1 rounded border-2 border-blue-500 px-2 py-1 text-sm outline-none"
              autoFocus
              aria-label="Edit todo text"
            />
            <button
              type="button"
              onClick={handleSave}
              className="rounded bg-green-500 p-2 text-white transition-colors hover:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
              aria-label="Save changes"
            >
              <Check size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded bg-gray-500 p-2 text-white transition-colors hover:bg-gray-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
              aria-label="Cancel editing"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <>
            <p
              className={clsx(
                'text-sm break-words',
                todo.completed && 'text-gray-500 line-through',
              )}
            >
              {todo.text}
            </p>
            {todo.dueDate && (
              <p className="mt-1 text-xs text-gray-500" aria-label={`Due date: ${format(todo.dueDate, 'PPP', { locale: ko })}`}>
                📅 {format(todo.dueDate, 'PPP', { locale: ko })}
              </p>
            )}
            {todo.tags && todo.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1" role="list" aria-label="Tags">
                {todo.tags.map(tag => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700"
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
            className="rounded p-2 text-gray-500 transition-colors hover:bg-blue-100 hover:text-blue-600 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            aria-label="Edit todo"
          >
            <Pencil size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(todo.id!)}
            className="rounded p-2 text-gray-500 transition-colors hover:bg-red-100 hover:text-red-600 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            aria-label="Delete todo"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}
