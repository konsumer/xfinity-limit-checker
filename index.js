import puppeteer from 'puppeteer'

const { XFINITY_USER, XFINTIY_PASSWORD } = process.env
if (!XFINITY_USER || !XFINTIY_PASSWORD) {
  console.error('Please set XFINITY_USER & XFINTIY_PASSWORD.\n')
  process.exit(1)
}

async function main() {
  // use this to see what it's doing
  // const browser = await puppeteer.launch({ devtools: true })

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // this helps with headless
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.0 Safari/537.36')

  await page.goto('https://login.xfinity.com/login')
  await page.type('#user', XFINITY_USER)
  await page.type('#passwd', XFINTIY_PASSWORD)
  await page.click('#sign_in')
  await page.waitForNavigation()

  // this makes usage work
  await page.goto('https://customer.xfinity.com/#/')
  await page.waitForSelector('overview-page')

  await page.goto('https://customer.xfinity.com/apis/services/internet/usage')
  const info = await page.evaluate(() => JSON.parse(document.querySelector('body').innerText))
  await browser.close()
  console.log(info)
}
main()
