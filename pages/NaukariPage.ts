import { BasePage, expect } from './BasePage'

export class NaukariPage extends BasePage {
    loginLink = this.page.getByRole('link', { name: 'Login' })
    emailTextbox = this.page.getByRole('textbox', { name: 'Email ID / Username' })
    passwordTextbox = this.page.getByRole('textbox', { name: 'Password' })
    loginButton = this.page.locator('//button[text()="Login"]')
    viewProfileLink = this.page.getByRole('link', { name: 'View profile' })
    updateResumeButton = this.page.getByRole('button', { name: 'Update resume' })
    attachCVInput = this.page.locator('#attachCV')
    loginRegisterText = this.page.getByText('LoginRegister for free')

    async login(email: string, password: string) {
        await this.loginLink.click()
        await expect(this.emailTextbox).toBeVisible()
        await this.emailTextbox.fill(email)
        await this.passwordTextbox.fill(password)
        await this.loginButton.click()
        await expect(this.viewProfileLink).toBeVisible({ timeout: 30_000 })
    }

    async updateResume(filePath: string) {
        await this.viewProfileLink.click()
        await this.updateResumeButton.waitFor({ state: 'visible' })
        await this.attachCVInput.setInputFiles(filePath)
        await this.updateResumeButton.click()
        await expect(this.page.getByText('Resume has been successfully uploaded.')).toBeVisible({ timeout: 15000 })
    }

    async isLoginRequired(): Promise<boolean> {
  await expect.poll(async () => {
    const profileVisible = await this.viewProfileLink.isVisible()
    const loginVisible = await this.loginLink.isVisible()

    return profileVisible || loginVisible
    }, { message: 'Waiting for the Naukri login or profile option', timeout: 15_000 }).toBe(true)

    return !(await this.viewProfileLink.isVisible())
}
}