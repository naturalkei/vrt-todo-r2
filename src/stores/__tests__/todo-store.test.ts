import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTodoStore } from '../todo-store'
import * as db from '../../lib/db'

// Mock the database module
vi.mock('../../lib/db', () => ({
  getAllTodos: vi.fn(),
  addTodo: vi.fn(),
  updateTodo: vi.fn(),
  deleteTodo: vi.fn(),
  clearAllTodos: vi.fn(),
  bulkUpdateOrders: vi.fn(),
}))

describe('Todo Store', () => {
  beforeEach(() => {
    // Reset store state
    const store = useTodoStore.getState()
    store.todos = []
    store.filter = 'all'
    store.searchQuery = ''
    store.error = null
    store.isLoading = false

    // Clear all mocks
    vi.clearAllMocks()
  })

  describe('loadTodos', () => {
    it('should load todos from database', async () => {
      const mockTodos = [
        { id: 1, text: 'Test todo', completed: false, order: 0, createdAt: Date.now(), updatedAt: Date.now() },
      ]
      vi.mocked(db.getAllTodos).mockResolvedValue(mockTodos)

      await useTodoStore.getState().loadTodos()

      expect(db.getAllTodos).toHaveBeenCalled()
      expect(useTodoStore.getState().todos).toEqual(mockTodos)
      expect(useTodoStore.getState().isLoading).toBe(false)
    })

    it('should handle load error', async () => {
      vi.mocked(db.getAllTodos).mockRejectedValue(new Error('Database error'))

      await useTodoStore.getState().loadTodos()

      expect(useTodoStore.getState().error).toBe('Database error')
      expect(useTodoStore.getState().isLoading).toBe(false)
    })
  })

  describe('addTodo', () => {
    it('should add a new todo', async () => {
      vi.mocked(db.addTodo).mockResolvedValue(1)
      vi.mocked(db.getAllTodos).mockResolvedValue([
        { id: 1, text: 'New todo', completed: false, order: 0, createdAt: Date.now(), updatedAt: Date.now() },
      ])

      await useTodoStore.getState().addTodo('New todo')

      expect(db.addTodo).toHaveBeenCalled()
      expect(db.getAllTodos).toHaveBeenCalled()
    })

    it('should not add empty todo', async () => {
      await useTodoStore.getState().addTodo('   ')

      expect(db.addTodo).not.toHaveBeenCalled()
      expect(useTodoStore.getState().error).toBe('Todo text cannot be empty')
    })
  })

  describe('toggleTodo', () => {
    beforeEach(() => {
      useTodoStore.getState().todos = [
        { id: 1, text: 'Test', completed: false, order: 0, createdAt: Date.now(), updatedAt: Date.now() },
      ]
    })

    it('should toggle todo completion', async () => {
      vi.mocked(db.updateTodo).mockResolvedValue()
      vi.mocked(db.getAllTodos).mockResolvedValue([])

      await useTodoStore.getState().toggleTodo(1)

      expect(db.updateTodo).toHaveBeenCalledWith(1, { completed: true })
      expect(db.getAllTodos).toHaveBeenCalled()
    })

    it('should handle toggle error for non-existent todo', async () => {
      await useTodoStore.getState().toggleTodo(999)

      expect(useTodoStore.getState().error).toBe('Todo not found')
    })
  })

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      vi.mocked(db.deleteTodo).mockResolvedValue()
      vi.mocked(db.getAllTodos).mockResolvedValue([])

      await useTodoStore.getState().deleteTodo(1)

      expect(db.deleteTodo).toHaveBeenCalledWith(1)
      expect(db.getAllTodos).toHaveBeenCalled()
    })
  })

  describe('clearAllTodos', () => {
    it('should clear all todos', async () => {
      vi.mocked(db.clearAllTodos).mockResolvedValue()

      await useTodoStore.getState().clearAllTodos()

      expect(db.clearAllTodos).toHaveBeenCalled()
      expect(useTodoStore.getState().todos).toEqual([])
    })
  })

  describe('filtering', () => {
    beforeEach(() => {
      useTodoStore.getState().todos = [
        { id: 1, text: 'Active 1', completed: false, order: 0, createdAt: Date.now(), updatedAt: Date.now() },
        { id: 2, text: 'Completed 1', completed: true, order: 1, createdAt: Date.now(), updatedAt: Date.now() },
        { id: 3, text: 'Active 2', completed: false, order: 2, createdAt: Date.now(), updatedAt: Date.now() },
      ]
    })

    it('should filter active todos', () => {
      useTodoStore.getState().setFilter('active')
      const filtered = useTodoStore.getState().getFilteredTodos()

      expect(filtered).toHaveLength(2)
      expect(filtered.every(t => !t.completed)).toBe(true)
    })

    it('should filter completed todos', () => {
      useTodoStore.getState().setFilter('completed')
      const filtered = useTodoStore.getState().getFilteredTodos()

      expect(filtered).toHaveLength(1)
      expect(filtered.every(t => t.completed)).toBe(true)
    })

    it('should return all todos with "all" filter', () => {
      useTodoStore.getState().setFilter('all')
      const filtered = useTodoStore.getState().getFilteredTodos()

      expect(filtered).toHaveLength(3)
    })
  })

  describe('searching', () => {
    beforeEach(() => {
      useTodoStore.getState().todos = [
        { id: 1, text: 'Buy milk', completed: false, order: 0, createdAt: Date.now(), updatedAt: Date.now() },
        { id: 2, text: 'Buy bread', completed: false, order: 1, createdAt: Date.now(), updatedAt: Date.now() },
        { id: 3, text: 'Clean house', completed: false, order: 2, createdAt: Date.now(), updatedAt: Date.now() },
      ]
    })

    it('should search todos by text', () => {
      useTodoStore.getState().setSearchQuery('buy')
      const filtered = useTodoStore.getState().getFilteredTodos()

      expect(filtered).toHaveLength(2)
      expect(filtered.every(t => t.text.toLowerCase().includes('buy'))).toBe(true)
    })

    it('should return all todos with empty search', () => {
      useTodoStore.getState().setSearchQuery('')
      const filtered = useTodoStore.getState().getFilteredTodos()

      expect(filtered).toHaveLength(3)
    })

    it('should search by tags', () => {
      useTodoStore.getState().todos = [
        { id: 1, text: 'Task 1', completed: false, order: 0, createdAt: Date.now(), updatedAt: Date.now(), tags: ['urgent'] },
        { id: 2, text: 'Task 2', completed: false, order: 1, createdAt: Date.now(), updatedAt: Date.now(), tags: ['later'] },
      ]

      useTodoStore.getState().setSearchQuery('urgent')
      const filtered = useTodoStore.getState().getFilteredTodos()

      expect(filtered).toHaveLength(1)
      expect(filtered[0].tags).toContain('urgent')
    })
  })
})
