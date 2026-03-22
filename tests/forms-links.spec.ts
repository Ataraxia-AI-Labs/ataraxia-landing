import { test, expect } from '@playwright/test'

test.describe('Navigation Links', () => {
  test('nav has logo', async ({ page }) => {
    await page.goto('/')
    const logo = page.locator('nav img[alt*="SofIA"], nav img[alt*="Ataraxia"], nav svg')
    await expect(logo.first()).toBeVisible()
  })

  test('nav has section anchor links', async ({ page }) => {
    await page.goto('/')
    const links = page.locator('nav a[href^="#"]')
    expect(await links.count()).toBeGreaterThan(0)
  })

  test('nav has onboarding CTA', async ({ page }) => {
    await page.goto('/')
    const cta = page.locator('nav a[href*="onboarding"]')
    // On mobile the CTA may be hidden in hamburger menu
    expect(await cta.count()).toBeGreaterThan(0)
    const href = await cta.first().getAttribute('href')
    expect(href).toContain('onboarding')
  })

  test('clicking section link scrolls to section', async ({ page }) => {
    await page.goto('/')
    // Click on pricing link
    const pricingLink = page.locator('nav a[href="#pricing"]').first()
    if (await pricingLink.isVisible()) {
      await pricingLink.click()
      await page.waitForTimeout(1000)
      const inView = await page.locator('#pricing').isVisible()
      expect(inView).toBe(true)
    }
  })
})

test.describe('CTA Buttons', () => {
  test('all CTAs have data-cta attribute', async ({ page }) => {
    await page.goto('/')
    const ctas = page.locator('[data-cta]')
    expect(await ctas.count()).toBeGreaterThan(10)
  })

  test('hero CTA links to onboarding', async ({ page }) => {
    await page.goto('/')
    const heroCta = page.locator('[data-cta="hero-primary"]')
    await expect(heroCta).toHaveAttribute('href', /onboarding/)
  })

  test('pricing starter links to onboarding', async ({ page }) => {
    await page.goto('/')
    const cta = page.locator('[data-cta="pricing-starter"]')
    await expect(cta).toHaveAttribute('href', /onboarding/)
  })

  test('pricing pro links to onboarding', async ({ page }) => {
    await page.goto('/')
    const cta = page.locator('[data-cta="pricing-pro"]')
    await expect(cta).toHaveAttribute('href', /onboarding/)
  })

  test('pricing business links to onboarding', async ({ page }) => {
    await page.goto('/')
    const cta = page.locator('[data-cta="pricing-business"]')
    await expect(cta).toHaveAttribute('href', /onboarding/)
  })

  test('pricing enterprise links to contact', async ({ page }) => {
    await page.goto('/')
    const cta = page.locator('[data-cta="pricing-enterprise"]')
    await expect(cta).toHaveAttribute('href', '#cta')
  })

  test('all onboarding CTAs point to correct URL', async ({ page }) => {
    await page.goto('/')
    const ctaLinks = page.locator('a[href*="dashboard.ataraxiaialabs.ai/onboarding"]')
    const count = await ctaLinks.count()
    expect(count).toBeGreaterThan(5)
    for (let i = 0; i < count; i++) {
      const href = await ctaLinks.nth(i).getAttribute('href')
      expect(href).toBe('https://dashboard.ataraxiaialabs.ai/onboarding')
    }
  })
})

test.describe('Contact Form', () => {
  test('form has all required fields', async ({ page }) => {
    await page.goto('/')
    const form = page.locator('form.cf')
    await form.scrollIntoViewIfNeeded()

    await expect(form.locator('input[name="nombre"]')).toBeVisible()
    await expect(form.locator('input[name="email"]')).toBeVisible()
    await expect(form.locator('input[name="clinica"]')).toBeVisible()
    await expect(form.locator('input[name="whatsapp"]')).toBeVisible()
    await expect(form.locator('textarea[name="mensaje"]')).toBeVisible()
  })

  test('nombre field is required', async ({ page }) => {
    await page.goto('/')
    const field = page.locator('form.cf input[name="nombre"]')
    const required = await field.getAttribute('required')
    expect(required).not.toBeNull()
  })

  test('email field is required and type email', async ({ page }) => {
    await page.goto('/')
    const field = page.locator('form.cf input[name="email"]')
    expect(await field.getAttribute('required')).not.toBeNull()
    expect(await field.getAttribute('type')).toBe('email')
  })

  test('whatsapp field is required', async ({ page }) => {
    await page.goto('/')
    const field = page.locator('form.cf input[name="whatsapp"]')
    expect(await field.getAttribute('required')).not.toBeNull()
  })

  test('form has submit button', async ({ page }) => {
    await page.goto('/')
    const btn = page.locator('form.cf button[type="submit"]')
    await btn.scrollIntoViewIfNeeded()
    await expect(btn).toBeVisible()
    await expect(btn).toHaveText(/Demo Personalizada/)
  })

  test('form fields accept input', async ({ page }) => {
    await page.goto('/')
    const form = page.locator('form.cf')
    await form.scrollIntoViewIfNeeded()

    await form.locator('input[name="nombre"]').fill('Dr. Test')
    await form.locator('input[name="email"]').fill('test@clinica.com')
    await form.locator('input[name="clinica"]').fill('Clinica Test')
    await form.locator('input[name="whatsapp"]').fill('+57 300 123 4567')
    await form.locator('textarea[name="mensaje"]').fill('Quiero saber mas')

    await expect(form.locator('input[name="nombre"]')).toHaveValue('Dr. Test')
    await expect(form.locator('input[name="email"]')).toHaveValue('test@clinica.com')
  })

  test('form has labels', async ({ page }) => {
    await page.goto('/')
    const labels = page.locator('form.cf label')
    expect(await labels.count()).toBeGreaterThanOrEqual(4)
  })
})

test.describe('Footer', () => {
  test('footer has copyright', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer).toContainText('2026')
    await expect(footer).toContainText('Ataraxia IA Labs')
  })

  test('footer has email link', async ({ page }) => {
    await page.goto('/')
    const email = page.locator('footer a[href*="mailto"]')
    await expect(email.first()).toHaveAttribute('href', 'mailto:gestion@ataraxiaialabs.ai')
  })

  test('footer has nav links', async ({ page }) => {
    await page.goto('/')
    const links = page.locator('.footer-links a')
    expect(await links.count()).toBeGreaterThanOrEqual(3)
  })

  test('footer mentions Habeas Data', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer).toContainText('Habeas Data')
  })
})
