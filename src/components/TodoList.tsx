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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Todo List
          </h1>
          <p className="text-sm text-gray-600">
            Manage your tasks efficiently
          </p>
        </header>

        {/* Add Todo Form */}
        <form onSubmit={handleAddTodo} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodoText}
              onChange={e => setNewTodoText(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500"
              disabled={isLoading}
              aria-label="New todo text"
            />
            <button
              type="submit"
              disabled={isLoading || !newTodoText.trim()}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Add new todo"
            >
              <Plus size={20} aria-hidden="true" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border-2 border-red-200 bg-red-50 p-4 text-sm text-red-700"
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

          <div className="flex items-center justify-between">
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
                  className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                    filter === f
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-pressed={filter === f}
                >
                  {f}
                </button>
              ))}
            </div>

            {todos.length > 0 && (
              <button
                type="button"
                onClick={clearAllTodos}
                className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                aria-label="Clear all todos"
              >
                <Trash2 size={16} aria-hidden="true" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-4 flex gap-4 text-sm text-gray-600" role="status" aria-live="polite">
          <span>Total: <strong>{stats.total}</strong></span>
          <span>Active: <strong>{stats.active}</strong></span>
          <span>Completed: <strong>{stats.completed}</strong></span>
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
                  <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                    <p className="text-gray-500">
                      {searchQuery
                        ? 'No todos found matching your search.'
                        : filter === 'completed'
                          ? 'No completed todos yet.'
                          : filter === 'active'
                            ? 'No active todos. Add one above!'
                            : 'No todos yet. Add your first one above!'}
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
