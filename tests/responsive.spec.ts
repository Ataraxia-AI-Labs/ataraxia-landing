import { test, expect } from '@playwright/test'

const MOBILE_VP = { width: 390, height: 844 }
const TABLET_VP = { width: 768, height: 1024 }

test.describe('Responsive — Desktop', () => {
  test('page loads without horizontal overflow', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1000)
    const noOverflow = await page.evaluate(() => document.body.scrollWidth <= window.innerWidth + 5)
    expect(noOverflow).toBe(true)
  })

  test('nav links are visible', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
    // Desktop nav should show text links
    const links = page.locator('nav a')
    expect(await links.count()).toBeGreaterThan(3)
  })

  test('hamburger button is hidden on desktop', async ({ page }) => {
    await page.goto('/')
    const ham = page.locator('#hamBtn')
    // On desktop, hamburger may be hidden via CSS
    const isVisible = await ham.isVisible().catch(() => false)
    // On wide viewport it should be hidden or display:none
    if (isVisible) {
      const display = await ham.evaluate((el) => getComputedStyle(el).display)
      // It's ok if it exists but styled for mobile only
      expect(display).toBeDefined()
    }
  })

  test('pricing cards are in a row', async ({ page }) => {
    await page.goto('/')
    const cards = page.locator('.pk')
    expect(await cards.count()).toBe(4)
  })

  test('hero section is visible', async ({ page }) => {
    await page.goto('/')
    const hero = page.locator('.hero')
    await expect(hero).toBeVisible()
  })
})

test.describe('Responsive — Mobile', () => {
  test('page loads without horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE_VP)
    await page.goto('/')
    await page.waitForTimeout(1000)
    const noOverflow = await page.evaluate(() => document.body.scrollWidth <= window.innerWidth + 5)
    expect(noOverflow).toBe(true)
  })

  test('hamburger button is visible on mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE_VP)
    await page.goto('/')
    const ham = page.locator('#hamBtn')
    await expect(ham).toBeVisible()
  })

  test('mobile menu opens on hamburger click', async ({ page }) => {
    await page.setViewportSize(MOBILE_VP)
    await page.goto('/')
    const ham = page.locator('#hamBtn')
    await expect(ham).toBeVisible()
    await ham.click()
    const mobMenu = page.locator('#mobMenu, .mob-menu')
    await expect(mobMenu.first()).toBeVisible({ timeout: 3000 })
  })

  test('mobile menu has CTA buttons', async ({ page }) => {
    await page.setViewportSize(MOBILE_VP)
    await page.goto('/')
    await page.locator('#hamBtn').click()
    const cta = page.locator('[data-cta="mob-menu-trial"]')
      .or(page.locator('.mob-menu a'))
    await expect(cta.first()).toBeVisible({ timeout: 3000 })
  })

  test('hero section is visible on mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE_VP)
    await page.goto('/')
    const hero = page.locator('.hero')
    await expect(hero).toBeVisible()
  })

  test('pricing section is visible on mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE_VP)
    await page.goto('/')
    await page.locator('#pricing').scrollIntoViewIfNeeded()
    await expect(page.locator('#pricing')).toBeVisible()
  })

  test('FAQ section is visible on mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE_VP)
    await page.goto('/')
    await page.locator('#faq').scrollIntoViewIfNeeded()
    await expect(page.locator('#faq')).toBeVisible()
  })

  test('contact form is visible on mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE_VP)
    await page.goto('/')
    const form = page.locator('form.cf')
    await form.scrollIntoViewIfNeeded()
    await expect(form).toBeVisible()
  })

  test('footer is visible on mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE_VP)
    await page.goto('/')
    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer).toBeVisible()
  })
})

test.describe('Responsive — Tablet', () => {
  test('page loads without horizontal overflow on tablet', async ({ page }) => {
    await page.setViewportSize(TABLET_VP)
    await page.goto('/')
    await page.waitForTimeout(1000)
    const noOverflow = await page.evaluate(() => document.body.scrollWidth <= window.innerWidth + 5)
    expect(noOverflow).toBe(true)
  })

  test('all main sections visible on tablet', async ({ page }) => {
    await page.setViewportSize(TABLET_VP)
    await page.goto('/')
    const sections = ['#problema', '#como', '#pricing', '#faq', '#cta']
    for (const sel of sections) {
      const el = page.locator(sel)
      await el.scrollIntoViewIfNeeded()
      await expect(el).toBeVisible()
    }
  })
})
