import { create } from 'zustand'
import {
  getAllTodos,
  addTodo as dbAddTodo,
  updateTodo as dbUpdateTodo,
  deleteTodo as dbDeleteTodo,
  clearAllTodos as dbClearAllTodos,
  bulkUpdateOrders,
  type Todo,
} from '../lib/db'

export type FilterType = 'all' | 'active' | 'completed'

interface TodoState {
  todos: Todo[]
  isLoading: boolean
  error: string | null
  filter: FilterType
  searchQuery: string

  // Actions
  loadTodos: () => Promise<void>
  addTodo: (text: string, dueDate?: number, tags?: string[]) => Promise<void>
  toggleTodo: (id: number) => Promise<void>
  updateTodoText: (id: number, text: string) => Promise<void>
  updateTodoDueDate: (id: number, dueDate?: number) => Promise<void>
  deleteTodo: (id: number) => Promise<void>
  clearAllTodos: () => Promise<void>
  reorderTodos: (todos: Todo[]) => Promise<void>
  setFilter: (filter: FilterType) => void
  setSearchQuery: (query: string) => void
  getFilteredTodos: () => Todo[]
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,
  filter: 'all',
  searchQuery: '',

  loadTodos: async () => {
    set({ isLoading: true, error: null })
    try {
      const todos = await getAllTodos()
      set({ todos, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load todos',
        isLoading: false,
      })
    }
  },

  addTodo: async (text: string, dueDate?: number, tags?: string[]) => {
    if (!text.trim()) {
      set({ error: 'Todo text cannot be empty' })
      return
    }

    set({ isLoading: true, error: null })
    try {
      const currentTodos = get().todos
      const maxOrder = currentTodos.length > 0
        ? Math.max(...currentTodos.map(t => t.order))
        : -1

      const newTodo: Omit<Todo, 'id'> = {
        text: text.trim(),
        completed: false,
        order: maxOrder + 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        dueDate,
        tags,
      }

      await dbAddTodo(newTodo)
      await get().loadTodos()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add todo',
        isLoading: false,
      })
    }
  },

  toggleTodo: async (id: number) => {
    set({ isLoading: true, error: null })
    try {
      const todo = get().todos.find(t => t.id === id)
      if (!todo) {
        throw new Error('Todo not found')
      }

      await dbUpdateTodo(id, { completed: !todo.completed })
      await get().loadTodos()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to toggle todo',
        isLoading: false,
      })
    }
  },

  updateTodoText: async (id: number, text: string) => {
    if (!text.trim()) {
      set({ error: 'Todo text cannot be empty' })
      return
    }

    set({ isLoading: true, error: null })
    try {
      await dbUpdateTodo(id, { text: text.trim() })
      await get().loadTodos()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update todo',
        isLoading: false,
      })
    }
  },

  updateTodoDueDate: async (id: number, dueDate?: number) => {
    set({ isLoading: true, error: null })
    try {
      await dbUpdateTodo(id, { dueDate })
      await get().loadTodos()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update due date',
        isLoading: false,
      })
    }
  },

  deleteTodo: async (id: number) => {
    set({ isLoading: true, error: null })
    try {
      await dbDeleteTodo(id)
      await get().loadTodos()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete todo',
        isLoading: false,
      })
    }
  },

  clearAllTodos: async () => {
    set({ isLoading: true, error: null })
    try {
      await dbClearAllTodos()
      set({ todos: [], isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to clear todos',
        isLoading: false,
      })
    }
  },

  reorderTodos: async (reorderedTodos: Todo[]) => {
    set({ isLoading: true, error: null })
    try {
      const updates = reorderedTodos.map((todo, index) => ({
        id: todo.id!,
        order: index,
      }))

      await bulkUpdateOrders(updates)
      await get().loadTodos()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reorder todos',
        isLoading: false,
      })
    }
  },

  setFilter: (filter: FilterType) => {
    set({ filter })
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query })
  },

  getFilteredTodos: () => {
    const { todos, filter, searchQuery } = get()

    let filtered = todos

    // Apply filter
    if (filter === 'active') {
      filtered = filtered.filter(t => !t.completed)
    } else if (filter === 'completed') {
      filtered = filtered.filter(t => t.completed)
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t =>
        t.text.toLowerCase().includes(query) ||
        t.tags?.some(tag => tag.toLowerCase().includes(query)),
      )
    }

    return filtered
  },
}))
