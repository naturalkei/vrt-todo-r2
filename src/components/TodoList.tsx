import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import { Plus, Trash2 } from 'lucide-react'
import { useTodoStore, type FilterType } from '../stores/todo-store'
import TodoItem from './TodoItem'
import SearchBar from './SearchBar'

export default function TodoList() {
  const {
    todos,
    isLoading,
    error,
    filter,
    searchQuery,
    loadTodos,
    addTodo,
    toggleTodo,
    updateTodoText,
    deleteTodo,
    clearAllTodos,
    reorderTodos,
    setFilter,
    setSearchQuery,
    getFilteredTodos,
  } = useTodoStore()

  const [newTodoText, setNewTodoText] = useState('')

  useEffect(() => {
    loadTodos()
  }, [loadTodos])

  const filteredTodos = getFilteredTodos()

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodoText.trim()) {
      await addTodo(newTodoText)
      setNewTodoText('')
    }
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(filteredTodos)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    reorderTodos(items)
  }

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <header className="mb-8 rounded-bubbly border-4 border-nook-brown-dark bg-nook-cream p-6 shadow-bubble">
          <h1 className="mb-2 font-bubbly text-4xl font-bold text-nook-brown-dark">
            🍃 Todo List
          </h1>
          <p className="font-korean text-sm text-nook-brown">
            Manage your daily schedule!
          </p>
        </header>

        {/* Add Todo Form */}
        <form onSubmit={handleAddTodo} className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTodoText}
              onChange={e => setNewTodoText(e.target.value)}
              placeholder="Enter a new todo..."
              className="flex-1 rounded-bubble border-4 border-nook-mint-dark bg-white px-6 py-4 font-korean text-lg text-nook-brown-dark outline-none transition-all placeholder:text-nook-brown/50 focus:border-nook-green focus:shadow-glow"
              disabled={isLoading}
              aria-label="New todo text"
            />
            <button
              type="submit"
              disabled={isLoading || !newTodoText.trim()}
              className="flex items-center gap-2 rounded-bubble border-4 border-nook-green-dark bg-nook-green px-8 py-4 font-bubbly font-bold text-white shadow-soft transition-all hover:scale-105 hover:bg-nook-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nook-green disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
              aria-label="Add new todo"
            >
              <Plus size={24} aria-hidden="true" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mb-4 rounded-bubble border-4 border-nook-peach-dark bg-nook-peach p-4 font-korean text-sm text-nook-brown-dark shadow-soft"
          >
            ⚠️ {error}
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search todos..."
          />

          <div className="flex items-center justify-between gap-4">
            <div
              role="group"
              aria-label="Filter todos"
              className="flex gap-2"
            >
              {(['all', 'active', 'completed'] as FilterType[]).map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-bubble border-2 px-4 py-2 font-korean text-sm font-medium capitalize transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nook-green ${
                    filter === f
                      ? 'border-nook-green bg-nook-green text-white shadow-soft'
                      : 'border-nook-cream-dark bg-white text-nook-brown hover:border-nook-mint'
                  }`}
                  aria-pressed={filter === f}
                >
                  {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Completed'}
                </button>
              ))}
            </div>

            {todos.length > 0 && (
              <button
                type="button"
                onClick={clearAllTodos}
                className="flex items-center gap-2 rounded-bubble border-4 border-nook-brown bg-nook-brown-dark px-4 py-2 font-bubbly text-sm font-bold text-nook-cream shadow-soft transition-all hover:scale-105 hover:bg-nook-brown focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nook-brown active:scale-95"
                aria-label="Clear all todos"
              >
                <Trash2 size={16} aria-hidden="true" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-4 rounded-bubble border-4 border-nook-cream-dark bg-white/80 p-4 shadow-soft" role="status" aria-live="polite">
          <div className="flex justify-center gap-6 font-korean text-sm text-nook-brown">
            <span>Total <strong className="text-nook-brown-dark">{stats.total}</strong></span>
            <span>Active <strong className="text-nook-yellow-dark">{stats.active}</strong></span>
            <span>Completed <strong className="text-nook-green">{stats.completed}</strong></span>
          </div>
        </div>

        {/* Todo List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="todos">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-2 rounded-lg transition-colors ${
                  snapshot.isDraggingOver ? 'bg-blue-50' : ''
                }`}
                role="list"
                aria-label="Todo items"
              >
                {filteredTodos.length === 0 ? (
                  <div className="rounded-bubbly border-4 border-dashed border-nook-cream-dark bg-white p-12 text-center shadow-soft">
                    <p className="font-korean text-lg text-nook-brown">
                      {searchQuery
                        ? '🔍 No search results found.'
                        : filter === 'completed'
                          ? '✅ No completed todos.'
                          : filter === 'active'
                            ? '📝 No active todos!'
                            : '🌸 Add a todo!'}
                    </p>
                  </div>
                ) : (
                  filteredTodos.map((todo, index) => (
                    <Draggable
                      key={todo.id}
                      draggableId={String(todo.id)}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          role="listitem"
                        >
                          <TodoItem
                            todo={todo}
                            onToggle={toggleTodo}
                            onUpdate={updateTodoText}
                            onDelete={deleteTodo}
                            isDragging={snapshot.isDragging}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}
