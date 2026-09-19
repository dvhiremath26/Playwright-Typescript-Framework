import { test, expect } from '@playwright/test'
import { LoginPage } from '@pages/LoginPage/login.page'
import { DataLoader } from '@src/utils/testData/dataLoader'

test.describe(`Logout Tests`, () => {

  const loginData = DataLoader.get('login')
  const salesOrderData = DataLoader.get('salesOrder').standardOrder

  test(`Login Test`, async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.navigateLoginPage()
    await loginPage.enterUsername(loginData.username)
    await loginPage.enterPassword(loginData.password)
    await loginPage.clickOnLoginButton()
  })

  test(`Logout Test`, async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.navigateLoginPage()
    await loginPage.enterUsername(loginData.username)
    await loginPage.enterPassword(loginData.password)
    const homePage = await loginPage.clickOnLoginButton()
    await homePage.clickOnLogoutButton()
  })

  test.only(`Environment check`, async ({ page }) => {
    console.log(`Environment: ${process.env.ENV}`)
    console.log(`Loading data for environment: ${salesOrderData.env}`)
  })
})
