import { test, expect } from '@playwright/test'

test.describe('Performance', () => {
  test('page loads in under 5 seconds', async ({ page }) => {
    const start = Date.now()
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const elapsed = Date.now() - start
    expect(elapsed).toBeLessThan(5000)
  })

  test('no critical JS errors on load', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto('/')
    await page.waitForTimeout(2000)
    // Filter out non-critical errors (e.g. third-party analytics)
    const critical = errors.filter(
      (e) => !e.includes('fbq') && !e.includes('gtag') && !e.includes('Script error')
    )
    expect(critical).toHaveLength(0)
  })

  test('all images have alt attributes', async ({ page }) => {
    await page.goto('/')
    const images = page.locator('img')
    const count = await images.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt')
      expect(alt).not.toBeNull()
      expect(alt!.length).toBeGreaterThan(0)
    }
  })

  test('no broken inline styles crash layout', async ({ page }) => {
    await page.goto('/')
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const vpWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(vpWidth + 5)
  })

  test('page has no console warnings about missing resources', async ({ page }) => {
    const failedRequests: string[] = []
    page.on('response', (res) => {
      if (res.status() >= 400 && !res.url().includes('analytics')) {
        failedRequests.push(`${res.status()} ${res.url()}`)
      }
    })
    await page.goto('/')
    await page.waitForTimeout(2000)
    // Allow analytics/tracking failures
    const critical = failedRequests.filter(
      (r) =>
        !r.includes('googletagmanager') &&
        !r.includes('facebook') &&
        !r.includes('fbevents') &&
        !r.includes('analytics')
    )
    expect(critical).toHaveLength(0)
  })
})

test.describe('FAQ Accordion', () => {
  test('FAQ section has 9 items', async ({ page }) => {
    await page.goto('/')
    const items = page.locator('.fq')
    expect(await items.count()).toBe(9)
  })

  test('FAQ answers are hidden by default', async ({ page }) => {
    await page.goto('/')
    const firstAnswer = page.locator('.fqa').first()
    // fqa elements should not have 'op' class by default
    const hasOp = await firstAnswer.evaluate((el) => el.classList.contains('op'))
    expect(hasOp).toBe(false)
  })

  test('clicking FAQ question toggles answer', async ({ page }) => {
    await page.goto('/')
    const firstQ = page.locator('.fqq').first()
    const firstA = page.locator('.fqa').first()
    await firstQ.scrollIntoViewIfNeeded()
    await firstQ.click()
    const hasOp = await firstA.evaluate((el) => el.classList.contains('op'))
    expect(hasOp).toBe(true)
  })

  test('clicking FAQ again closes the answer', async ({ page }) => {
    await page.goto('/')
    const firstQ = page.locator('.fqq').first()
    const firstA = page.locator('.fqa').first()
    await firstQ.scrollIntoViewIfNeeded()
    await firstQ.click()
    await firstQ.click()
    const hasOp = await firstA.evaluate((el) => el.classList.contains('op'))
    expect(hasOp).toBe(false)
  })

  test('each FAQ has question text', async ({ page }) => {
    await page.goto('/')
    const questions = page.locator('.fqq h4')
    expect(await questions.count()).toBe(9)
    for (let i = 0; i < 9; i++) {
      const text = await questions.nth(i).textContent()
      expect(text!.length).toBeGreaterThan(10)
    }
  })

  test('each FAQ has answer text', async ({ page }) => {
    await page.goto('/')
    const answers = page.locator('.fqa p')
    expect(await answers.count()).toBe(9)
    for (let i = 0; i < 9; i++) {
      const text = await answers.nth(i).textContent()
      expect(text!.length).toBeGreaterThan(20)
    }
  })

  test('FAQ question has toggle arrow', async ({ page }) => {
    await page.goto('/')
    const arrows = page.locator('.fqq .ar')
    expect(await arrows.count()).toBe(9)
    await expect(arrows.first()).toHaveText('+')
  })
})

test.describe('Accessibility', () => {
  test('page has main heading h1 or h2', async ({ page }) => {
    await page.goto('/')
    const headings = page.locator('h1, h2')
    expect(await headings.count()).toBeGreaterThan(0)
  })

  test('interactive elements are keyboard focusable', async ({ page }) => {
    await page.goto('/')
    // Tab to first interactive element
    await page.keyboard.press('Tab')
    const focused = await page.evaluate(() => document.activeElement?.tagName)
    expect(['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT']).toContain(focused)
  })

  test('links have accessible text', async ({ page }) => {
    await page.goto('/')
    const links = page.locator('a')
    const count = await links.count()
    for (let i = 0; i < count; i++) {
      const text = await links.nth(i).textContent()
      const ariaLabel = await links.nth(i).getAttribute('aria-label')
      const hasText = (text && text.trim().length > 0) || ariaLabel
      expect(hasText).toBeTruthy()
    }
  })

  test('form inputs have associated labels', async ({ page }) => {
    await page.goto('/')
    const form = page.locator('form.cf')
    const inputs = form.locator('input, textarea')
    const count = await inputs.count()
    expect(count).toBeGreaterThan(0)
    // Each input should be preceded by a label in its parent
    for (let i = 0; i < count; i++) {
      const parent = inputs.nth(i).locator('..')
      const label = parent.locator('label')
      expect(await label.count()).toBeGreaterThanOrEqual(1)
    }
  })

  test('page uses semantic HTML sections', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('nav')
    const footer = page.locator('footer')
    const sections = page.locator('section')
    expect(await nav.count()).toBeGreaterThan(0)
    expect(await footer.count()).toBeGreaterThan(0)
    expect(await sections.count()).toBeGreaterThan(5)
  })

  test('color contrast: text is not invisible', async ({ page }) => {
    await page.goto('/')
    // Check that hero heading has non-transparent color
    const hero = page.locator('.hero h1, .hero h2').first()
    const color = await hero.evaluate((el) => {
      const style = getComputedStyle(el)
      return style.color
    })
    // Color should not be transparent or same as background
    expect(color).not.toBe('rgba(0, 0, 0, 0)')
    expect(color).not.toBe('transparent')
  })

  test('page has skip-to-content or logical tab order', async ({ page }) => {
    await page.goto('/')
    // Check that nav comes before main content in DOM
    const navIndex = await page.evaluate(() => {
      const all = document.querySelectorAll('nav, section, footer')
      return Array.from(all).findIndex((el) => el.tagName === 'NAV')
    })
    expect(navIndex).toBe(0)
  })

  test('buttons have visible text or aria-label', async ({ page }) => {
    await page.goto('/')
    const buttons = page.locator('button')
    const count = await buttons.count()
    for (let i = 0; i < count; i++) {
      const text = await buttons.nth(i).textContent()
      const ariaLabel = await buttons.nth(i).getAttribute('aria-label')
      const hasText = (text && text.trim().length > 0) || ariaLabel
      expect(hasText).toBeTruthy()
    }
  })
})

test.describe('Scroll Animations', () => {
  test('reveal elements have rv class', async ({ page }) => {
    await page.goto('/')
    const rvElements = page.locator('.rv')
    expect(await rvElements.count()).toBeGreaterThan(20)
  })

  test('elements get v class after scroll into view', async ({ page }) => {
    await page.goto('/')
    // Scroll to pricing section and wait for IntersectionObserver
    await page.locator('#pricing').scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)
    // Check that at least some .rv elements near pricing have gained .v class
    const visibleCount = await page.evaluate(() => {
      return document.querySelectorAll('#pricing .rv.v, #pricing .v').length
    })
    expect(visibleCount).toBeGreaterThan(0)
  })
})

test.describe('Guarantee Section', () => {
  test('guarantee section is present', async ({ page }) => {
    await page.goto('/')
    const gar = page.locator('.gar')
    await gar.scrollIntoViewIfNeeded()
    await expect(gar).toBeVisible()
  })

  test('guarantee mentions 30 days', async ({ page }) => {
    await page.goto('/')
    const gar = page.locator('.gar')
    await expect(gar).toContainText('30 Dias')
  })

  test('guarantee mentions money back', async ({ page }) => {
    await page.goto('/')
    const gar = page.locator('.gar')
    await expect(gar).toContainText('100%')
  })
})

test.describe('Final CTA Section', () => {
  test('dual CTA block exists', async ({ page }) => {
    await page.goto('/')
    const selfService = page.locator('[data-cta="final-self-service"]')
    const demo = page.locator('[data-cta="final-demo"]')
    await expect(selfService).toHaveAttribute('href', /onboarding/)
    await expect(demo).toHaveAttribute('href', '#demo-form')
  })

  test('self-service CTA text', async ({ page }) => {
    await page.goto('/')
    const cta = page.locator('[data-cta="final-self-service"]')
    await expect(cta).toContainText('Gratis')
  })

  test('demo CTA text', async ({ page }) => {
    await page.goto('/')
    const cta = page.locator('[data-cta="final-demo"]')
    await expect(cta).toContainText('Demo')
  })

  test('mid-page urgency CTA exists', async ({ page }) => {
    await page.goto('/')
    const cta = page.locator('[data-cta="mid-page-urgency"]')
    await expect(cta).toHaveAttribute('href', /onboarding/)
  })
})
