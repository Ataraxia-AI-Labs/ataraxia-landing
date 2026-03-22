import { test, expect } from '@playwright/test'

test.describe('Pricing Section', () => {
  test('has 4 pricing cards', async ({ page }) => {
    await page.goto('/')
    const cards = page.locator('.pk')
    expect(await cards.count()).toBe(4)
  })

  test('pricing tiers have correct names', async ({ page }) => {
    await page.goto('/')
    const names = page.locator('.pnm')
    await expect(names.nth(0)).toHaveText('Starter')
    await expect(names.nth(1)).toHaveText('Pro')
    await expect(names.nth(2)).toHaveText('Business')
    await expect(names.nth(3)).toHaveText('Enterprise')
  })

  test('monthly prices are visible by default', async ({ page }) => {
    await page.goto('/')
    const monthly = page.locator('.pk .p-monthly').first()
    await expect(monthly).toBeVisible()
    const annual = page.locator('.pk .p-annual').first()
    await expect(annual).toBeHidden()
  })

  test('starter shows $119.000 COP monthly', async ({ page }) => {
    await page.goto('/')
    const price = page.locator('.pk').first().locator('.p-monthly')
    await expect(price).toContainText('$119.000')
  })

  test('pro shows $319.000 COP monthly', async ({ page }) => {
    await page.goto('/')
    const price = page.locator('.pk.ft .p-monthly')
    await expect(price).toContainText('$319.000')
  })

  test('business shows $549.000 COP monthly', async ({ page }) => {
    await page.goto('/')
    const price = page.locator('.pk').nth(2).locator('.p-monthly')
    await expect(price).toContainText('$549.000')
  })

  test('enterprise shows Custom', async ({ page }) => {
    await page.goto('/')
    const price = page.locator('.pk').nth(3).locator('h3')
    await expect(price).toHaveText('Custom')
  })

  test('pro card has "Recomendado" badge', async ({ page }) => {
    await page.goto('/')
    const badge = page.locator('.pkb')
    await expect(badge).toHaveText('Recomendado')
  })

  test('each tier has feature list', async ({ page }) => {
    await page.goto('/')
    const cards = page.locator('.pk')
    for (let i = 0; i < 4; i++) {
      const items = cards.nth(i).locator('ul li')
      expect(await items.count()).toBeGreaterThan(3)
    }
  })

  test('trial note shows "7 días gratis" on first 3 tiers', async ({ page }) => {
    await page.goto('/')
    const notes = page.locator('.pk-trial-note')
    expect(await notes.count()).toBe(3)
    for (let i = 0; i < 3; i++) {
      await expect(notes.nth(i)).toContainText('7 dias gratis')
    }
  })
})

test.describe('Pricing Toggle', () => {
  test('toggle exists with Monthly and Annual labels', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#togMonthly')).toHaveText('Mensual')
    await expect(page.locator('#togAnnual')).toHaveText('Anual')
  })

  test('annual badge shows "2 meses gratis"', async ({ page }) => {
    await page.goto('/')
    const badge = page.locator('.annual-badge')
    await expect(badge).toHaveText('2 meses gratis')
  })

  test('clicking toggle switches to annual pricing', async ({ page }) => {
    await page.goto('/')
    const toggle = page.locator('#priceToggle')
    await toggle.click()
    // After clicking, body should have annual-pricing class
    const isAnnual = await page.evaluate(() => document.body.classList.contains('annual-pricing'))
    expect(isAnnual).toBe(true)
  })

  test('annual prices show after toggle', async ({ page }) => {
    await page.goto('/')
    await page.locator('#priceToggle').click()
    const annual = page.locator('.pk').first().locator('.p-annual')
    await expect(annual).toBeVisible()
    await expect(annual).toContainText('$1.190.000')
  })

  test('monthly prices hidden after toggle', async ({ page }) => {
    await page.goto('/')
    await page.locator('#priceToggle').click()
    const monthly = page.locator('.pk').first().locator('.p-monthly')
    await expect(monthly).toBeHidden()
  })

  test('pro annual shows $2.990.000', async ({ page }) => {
    await page.goto('/')
    await page.locator('#priceToggle').click()
    const price = page.locator('.pk.ft .p-annual')
    await expect(price).toContainText('$3.190.000')
  })

  test('business annual shows $4.990.000', async ({ page }) => {
    await page.goto('/')
    await page.locator('#priceToggle').click()
    const price = page.locator('.pk').nth(2).locator('.p-annual')
    await expect(price).toContainText('$5.490.000')
  })

  test('double toggle returns to monthly', async ({ page }) => {
    await page.goto('/')
    const toggle = page.locator('#priceToggle')
    await toggle.click()
    await page.waitForTimeout(300)
    await toggle.click()
    const isAnnual = await page.evaluate(() => document.body.classList.contains('annual-pricing'))
    expect(isAnnual).toBe(false)
  })

  test('annual equiv prices appear after toggle', async ({ page }) => {
    await page.goto('/')
    await page.locator('#priceToggle').click()
    const equiv = page.locator('.price-annual').first()
    await expect(equiv).toBeVisible()
    await expect(equiv).toContainText('equiv.')
  })
})

test.describe('ROI Calculator', () => {
  test('calculator section is visible', async ({ page }) => {
    await page.goto('/')
    const calc = page.locator('.roi-calc')
    await calc.scrollIntoViewIfNeeded()
    await expect(calc).toBeVisible()
  })

  test('has 4 sliders', async ({ page }) => {
    await page.goto('/')
    const sliders = page.locator('.roi-slider-group input[type="range"]')
    expect(await sliders.count()).toBe(4)
  })

  test('slider 1: patients has correct range (20-300)', async ({ page }) => {
    await page.goto('/')
    const s1 = page.locator('#s1')
    expect(await s1.getAttribute('min')).toBe('20')
    expect(await s1.getAttribute('max')).toBe('300')
    expect(await s1.getAttribute('value')).toBe('80')
  })

  test('slider 2: no-show has correct range (5-60)', async ({ page }) => {
    await page.goto('/')
    const s2 = page.locator('#s2')
    expect(await s2.getAttribute('min')).toBe('5')
    expect(await s2.getAttribute('max')).toBe('60')
  })

  test('slider 3: ticket has correct range (100-5000)', async ({ page }) => {
    await page.goto('/')
    const s3 = page.locator('#s3')
    expect(await s3.getAttribute('min')).toBe('100')
    expect(await s3.getAttribute('max')).toBe('5000')
    expect(await s3.getAttribute('step')).toBe('50')
  })

  test('slider 4: off-hours has correct range (5-70)', async ({ page }) => {
    await page.goto('/')
    const s4 = page.locator('#s4')
    expect(await s4.getAttribute('min')).toBe('5')
    expect(await s4.getAttribute('max')).toBe('70')
  })

  test('each slider has a label', async ({ page }) => {
    await page.goto('/')
    const labels = page.locator('.roi-slider-group label')
    expect(await labels.count()).toBe(4)
    await expect(labels.nth(0)).toContainText('Pacientes')
    await expect(labels.nth(1)).toContainText('no-show')
    await expect(labels.nth(2)).toContainText('Ticket')
    await expect(labels.nth(3)).toContainText('fuera de horario')
  })

  test('default values show in display spans', async ({ page }) => {
    await page.goto('/')
    await page.locator('.roi-calc').scrollIntoViewIfNeeded()
    await expect(page.locator('#s1-val')).toContainText('80 pacientes')
    await expect(page.locator('#s2-val')).toContainText('25%')
    await expect(page.locator('#s3-val')).toContainText('$600')
    await expect(page.locator('#s4-val')).toContainText('30%')
  })

  test('roiTotal displays a USD value', async ({ page }) => {
    await page.goto('/')
    await page.locator('.roi-calc').scrollIntoViewIfNeeded()
    await page.waitForTimeout(700) // animation duration
    const text = await page.locator('#roiTotal').textContent()
    expect(text).toMatch(/\$[\d.,]+ USD/)
  })

  test('roiMult displays ROI multiplier', async ({ page }) => {
    await page.goto('/')
    await page.locator('.roi-calc').scrollIntoViewIfNeeded()
    await page.waitForTimeout(700)
    const text = await page.locator('#roiMult').textContent()
    expect(text).toMatch(/[\d.]+x ROI/)
  })

  test('moving slider updates displayed value', async ({ page }) => {
    await page.goto('/')
    const s1 = page.locator('#s1')
    await s1.scrollIntoViewIfNeeded()
    // Change patients slider to max
    await s1.fill('200')
    await s1.dispatchEvent('input')
    await page.waitForTimeout(100)
    await expect(page.locator('#s1-val')).toContainText('200 pacientes')
  })

  test('moving slider updates ROI total', async ({ page }) => {
    await page.goto('/')
    await page.locator('.roi-calc').scrollIntoViewIfNeeded()
    await page.waitForTimeout(700)
    const before = await page.locator('#roiTotal').textContent()
    // Increase patients
    await page.locator('#s1').fill('300')
    await page.locator('#s1').dispatchEvent('input')
    await page.waitForTimeout(700)
    const after = await page.locator('#roiTotal').textContent()
    expect(after).not.toBe(before)
  })

  test('calculator has CTA button', async ({ page }) => {
    await page.goto('/')
    const cta = page.locator('[data-cta="calc-cta"]')
    await expect(cta).toHaveAttribute('href', /onboarding/)
  })

  test('ROI result label is present', async ({ page }) => {
    await page.goto('/')
    const label = page.locator('.roi-lbl')
    await expect(label).toContainText('Revenue mensual recuperable')
  })
})
