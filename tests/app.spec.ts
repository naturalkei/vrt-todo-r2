import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the app title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Todo List')
  })

  test('should add a new todo', async ({ page }) => {
    const todoText = 'Buy Turnips'
    
    // Type in the input
    await page.getByRole('textbox', { name: 'New todo text' }).fill(todoText)
    
    // Click add button
    await page.getByRole('button', { name: /추가|Add/i }).click()
    
    // Verify the todo appears in the list
    await expect(page.getByText(todoText)).toBeVisible()
  })

  test('should toggle todo completion', async ({ page }) => {
    // Add a todo
    await page.getByRole('textbox', { name: 'New todo text' }).fill('Test todo')
    await page.getByRole('button', { name: /추가|Add/i }).click()
    
    // Wait for todo to appear
    await expect(page.getByText('Test todo')).toBeVisible()
    
    // Toggle completion
    const checkbox = page.getByRole('button', { name: 'Mark as complete' }).first()
    await checkbox.click()
    
    // Verify button text changed
    await expect(page.getByRole('button', { name: 'Mark as incomplete' }).first()).toBeVisible()
  })

  test('should edit a todo', async ({ page }) => {
    // Add a todo
    await page.getByRole('textbox', { name: 'New todo text' }).fill('Original text')
    await page.getByRole('button', { name: /추가|Add/i }).click()
    
    // Wait for todo to appear
    await expect(page.getByText('Original text')).toBeVisible()
    
    // Hover to show edit button and click
    const todoItem = page.locator('[role="article"]').first()
    await todoItem.hover()
    await page.getByRole('button', { name: 'Edit todo' }).first().click()
    
    // Edit the text
    await page.getByRole('textbox', { name: 'Edit todo text' }).fill('Updated text')
    await page.getByRole('button', { name: 'Save changes' }).click()
    
    // Verify the updated text
    await expect(page.getByText('Updated text')).toBeVisible()
    await expect(page.getByText('Original text')).not.toBeVisible()
  })

  test('should delete a todo', async ({ page }) => {
    // Add a todo
    await page.getByRole('textbox', { name: 'New todo text' }).fill('Todo to delete')
    await page.getByRole('button', { name: /추가|Add/i }).click()
    
    // Wait for todo to appear
    await expect(page.getByText('Todo to delete')).toBeVisible()
    
    // Hover to show delete button and click
    const todoItem = page.locator('[role="article"]').first()
    await todoItem.hover()
    await page.getByRole('button', { name: 'Delete todo' }).first().click()
    
    // Verify the todo is gone
    await expect(page.getByText('Todo to delete')).not.toBeVisible()
  })

  test('should filter todos', async ({ page }) => {
    // Add multiple todos
    await page.getByRole('textbox', { name: 'New todo text' }).fill('Active todo')
    await page.getByRole('button', { name: /추가|Add/i }).click()
    
    await page.getByRole('textbox', { name: 'New todo text' }).fill('Completed todo')
    await page.getByRole('button', { name: /추가|Add/i }).click()
    
    // Complete the second todo
    await page.getByRole('button', { name: 'Mark as complete' }).nth(1).click()
    
    // Filter to show only active
    await page.getByRole('button', { name: '진행중', pressed: false }).click()
    await expect(page.getByText('Active todo')).toBeVisible()
    await expect(page.getByText('Completed todo')).not.toBeVisible()
    
    // Filter to show only completed
    await page.getByRole('button', { name: '완료', pressed: false }).click()
    await expect(page.getByText('Completed todo')).toBeVisible()
    await expect(page.getByText('Active todo')).not.toBeVisible()
    
    // Show all
    await page.getByRole('button', { name: '전체', pressed: false }).click()
    await expect(page.getByText('Active todo')).toBeVisible()
    await expect(page.getByText('Completed todo')).toBeVisible()
  })

  test('should search todos', async ({ page }) => {
    // Add multiple todos
    await page.getByRole('textbox', { name: 'New todo text' }).fill('Buy apples')
    await page.getByRole('button', { name: /추가|Add/i }).click()
    
    await page.getByRole('textbox', { name: 'New todo text' }).fill('Buy oranges')
    await page.getByRole('button', { name: /추가|Add/i }).click()
    
    await page.getByRole('textbox', { name: 'New todo text' }).fill('Clean kitchen')
    await page.getByRole('button', { name: /추가|Add/i }).click()
    
    // Search for "buy"
    await page.getByRole('searchbox', { name: 'Search todos' }).fill('buy')
    
    // Verify search results
    await expect(page.getByText('Buy apples')).toBeVisible()
    await expect(page.getByText('Buy oranges')).toBeVisible()
    await expect(page.getByText('Clean kitchen')).not.toBeVisible()
    
    // Clear search
    await page.getByRole('button', { name: 'Clear search' }).click()
    await expect(page.getByText('Clean kitchen')).toBeVisible()
  })

  test('should persist todos after page refresh', async ({ page }) => {
    const todoText = 'Persistent todo'
    
    // Add a todo
    await page.getByRole('textbox', { name: 'New todo text' }).fill(todoText)
    await page.getByRole('button', { name: /추가|Add/i }).click()
    
    // Mark as complete
    await page.getByRole('button', { name: 'Mark as complete' }).first().click()
    
    // Refresh the page
    await page.reload()
    
    // Verify the todo is still there and completed
    await expect(page.getByText(todoText)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Mark as incomplete' }).first()).toBeVisible()
  })

  test('should display correct stats', async ({ page }) => {
    // Add todos
    await page.getByRole('textbox', { name: 'New todo text' }).fill('Todo 1')
    await page.getByRole('button', { name: /추가|Add/i }).click()
    
    await page.getByRole('textbox', { name: 'New todo text' }).fill('Todo 2')
    await page.getByRole('button', { name: /추가|Add/i }).click()
    
    await page.getByRole('textbox', { name: 'New todo text' }).fill('Todo 3')
    await page.getByRole('button', { name: /추가|Add/i }).click()
    
    // Complete one
    await page.getByRole('button', { name: 'Mark as complete' }).first().click()
    
    // Check stats
    const stats = page.locator('[role="status"]')
    await expect(stats).toContainText('전체 3')
    await expect(stats).toContainText('진행중 2')
    await expect(stats).toContainText('완료 1')
  })

  test('should clear all todos', async ({ page }) => {
    // Add multiple todos
    await page.getByRole('textbox', { name: 'New todo text' }).fill('Todo 1')
    await page.getByRole('button', { name: /추가|Add/i }).click()
    
    await page.getByRole('textbox', { name: 'New todo text' }).fill('Todo 2')
    await page.getByRole('button', { name: /추가|Add/i }).click()
    
    // Clear all
    await page.getByRole('button', { name: /전체삭제|Clear All/i }).click()
    
    // Verify empty state
    await expect(page.getByText(/할 일을 추가해보세요/i)).toBeVisible()
  })

  test('should support keyboard navigation', async ({ page }) => {
    // Add a todo using Enter key
    const input = page.getByRole('textbox', { name: 'New todo text' })
    await input.fill('Keyboard todo')
    await input.press('Enter')
    
    // Verify todo was added
    await expect(page.getByText('Keyboard todo')).toBeVisible()
  })
})

test.describe('Accessibility (A11y)', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/')
    
    // Add some todos to test different states
    await page.getByRole('textbox', { name: 'New todo text' }).fill('Test todo')
    await page.getByRole('button', { name: /추가|Add/i }).click()
    
    // Inject axe-core
    await injectAxe(page)
    
    // Run accessibility checks
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    })
  })

  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    await page.goto('/')
    
    // Check main input
    await expect(page.getByRole('textbox', { name: 'New todo text' })).toBeVisible()
    
    // Add a todo to test other elements
    await page.getByRole('textbox', { name: 'New todo text' }).fill('Test')
    await page.getByRole('button', { name: /추가|Add/i }).click()
    
    // Check todo item has proper aria-label
    await expect(page.locator('[role="article"]').first()).toHaveAttribute('aria-label')
    
    // Check filter buttons have aria-pressed
    const filterButton = page.getByRole('button', { name: '전체', pressed: true })
    await expect(filterButton).toBeVisible()
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')
    
    // Tab through interactive elements
    await page.keyboard.press('Tab') // Should focus input
    const input = page.getByRole('textbox', { name: 'New todo text' })
    await expect(input).toBeFocused()
    
    // Type and submit with Enter
    await input.type('Keyboard test')
    await input.press('Enter')
    
    // Verify todo was added
    await expect(page.getByText('Keyboard test')).toBeVisible()
  })
})
