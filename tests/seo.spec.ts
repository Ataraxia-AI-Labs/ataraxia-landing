import { test, expect } from '@playwright/test'

test.describe('SEO — Meta Tags', () => {
  test('page has correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/SofIA.*Ataraxia IA Labs/)
  })

  test('page has meta description', async ({ page }) => {
    await page.goto('/')
    const desc = page.locator('meta[name="description"]')
    await expect(desc).toHaveAttribute('content', /SofIA es el sistema operativo.*24\/7/)
  })

  test('page has lang="es"', async ({ page }) => {
    await page.goto('/')
    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('es')
  })

  test('page has viewport meta tag', async ({ page }) => {
    await page.goto('/')
    const viewport = page.locator('meta[name="viewport"]')
    await expect(viewport).toHaveAttribute('content', /width=device-width/)
  })

  test('page has charset meta tag', async ({ page }) => {
    await page.goto('/')
    const charset = page.locator('meta[charset]')
    await expect(charset).toHaveAttribute('charset', 'UTF-8')
  })

  test('page has theme-color meta tag', async ({ page }) => {
    await page.goto('/')
    const theme = page.locator('meta[name="theme-color"]')
    await expect(theme).toHaveAttribute('content', '#050507')
  })
})

test.describe('SEO — Open Graph', () => {
  test('has og:type', async ({ page }) => {
    await page.goto('/')
    const og = page.locator('meta[property="og:type"]')
    await expect(og).toHaveAttribute('content', 'website')
  })

  test('has og:title', async ({ page }) => {
    await page.goto('/')
    const og = page.locator('meta[property="og:title"]')
    await expect(og).toHaveAttribute('content', /SofIA/)
  })

  test('has og:description', async ({ page }) => {
    await page.goto('/')
    const og = page.locator('meta[property="og:description"]')
    await expect(og).toHaveAttribute('content', /Sistema operativo de IA/)
  })

  test('has og:image with correct dimensions', async ({ page }) => {
    await page.goto('/')
    const img = page.locator('meta[property="og:image"]')
    await expect(img).toHaveAttribute('content', /og-image\.png/)
    const width = page.locator('meta[property="og:image:width"]')
    await expect(width).toHaveAttribute('content', '1200')
    const height = page.locator('meta[property="og:image:height"]')
    await expect(height).toHaveAttribute('content', '630')
  })

  test('has og:locale es_CO', async ({ page }) => {
    await page.goto('/')
    const locale = page.locator('meta[property="og:locale"]')
    await expect(locale).toHaveAttribute('content', 'es_CO')
  })

  test('has og:url', async ({ page }) => {
    await page.goto('/')
    const url = page.locator('meta[property="og:url"]')
    await expect(url).toHaveAttribute('content', /ataraxiaialabs\.ai/)
  })
})

test.describe('SEO — Twitter Cards', () => {
  test('has twitter:card', async ({ page }) => {
    await page.goto('/')
    const card = page.locator('meta[name="twitter:card"]')
    await expect(card).toHaveAttribute('content', 'summary_large_image')
  })

  test('has twitter:title', async ({ page }) => {
    await page.goto('/')
    const title = page.locator('meta[name="twitter:title"]')
    await expect(title).toHaveAttribute('content', /SofIA/)
  })

  test('has twitter:image', async ({ page }) => {
    await page.goto('/')
    const img = page.locator('meta[name="twitter:image"]')
    await expect(img).toHaveAttribute('content', /og-image\.png/)
  })
})

test.describe('SEO — Favicons & PWA', () => {
  test('has favicon.ico link', async ({ page }) => {
    await page.goto('/')
    const favicon = page.locator('link[rel="icon"][type="image/x-icon"]')
    await expect(favicon).toHaveAttribute('href', '/favicon.ico')
  })

  test('has 32x32 favicon', async ({ page }) => {
    await page.goto('/')
    const icon = page.locator('link[rel="icon"][sizes="32x32"]')
    await expect(icon).toHaveAttribute('href', /favicon-32/)
  })

  test('has apple-touch-icon', async ({ page }) => {
    await page.goto('/')
    const icon = page.locator('link[rel="apple-touch-icon"]')
    await expect(icon).toHaveAttribute('href', /apple-touch-icon/)
  })

  test('has web manifest', async ({ page }) => {
    await page.goto('/')
    const manifest = page.locator('link[rel="manifest"]')
    await expect(manifest).toHaveAttribute('href', '/site.webmanifest')
  })

  test('manifest file loads', async ({ page }) => {
    const response = await page.goto('/site.webmanifest')
    expect(response?.status()).toBe(200)
  })
})

test.describe('SEO — robots.txt & sitemap', () => {
  test('robots.txt is accessible', async ({ page }) => {
    const response = await page.goto('/robots.txt')
    expect(response?.status()).toBe(200)
    const text = await page.textContent('body')
    expect(text).toContain('User-agent')
  })

  test('sitemap.xml is accessible', async ({ page }) => {
    const response = await page.goto('/sitemap.xml')
    expect(response?.status()).toBe(200)
  })
})

test.describe('SEO — Analytics Scripts', () => {
  test('GA4 script is present', async ({ page }) => {
    await page.goto('/')
    const ga4 = page.locator('script[src*="googletagmanager.com/gtag/js?id=G-2Q7EMV19DY"]')
    expect(await ga4.count()).toBeGreaterThan(0)
  })

  test('Meta Pixel is present', async ({ page }) => {
    await page.goto('/')
    const content = await page.content()
    expect(content).toContain('fbq')
    expect(content).toContain('2156891591805599')
  })
})
