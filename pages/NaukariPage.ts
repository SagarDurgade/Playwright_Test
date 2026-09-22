import { BasePage, expect } from './BasePage'

export class NaukariPage extends BasePage {
     loginLink = this.page.getByRole('link', { name: 'Login' })
     emailTextbox = this.page.getByRole('textbox', { name: 'Email ID / Username' })
     passwordTextbox = this.page.getByRole('textbox', { name: 'Password' })
     loginButton = this.page.getByRole('button', { name: 'Login', exact: true })
     viewProfileLink = this.page.getByRole('link', { name: 'View profile' })
     updateResumeButton = this.page.getByRole('button', { name: 'Update resume' })
     attachCVInput = this.page.locator('#attachCV')

     async login(email: string, password: string) {
         await this.loginLink.click()
         await this.emailTextbox.fill(email)
         await this.passwordTextbox.fill(password)
         await this.loginButton.click()
     }

     async updateResume(filePath: string) {
         await this.viewProfileLink.click()
         await this.updateResumeButton.waitFor({ state: 'visible' })
         await this.attachCVInput.setInputFiles(filePath)
         await this.updateResumeButton.click()
         await expect(this.page.getByText('Resume has been successfully uploaded.')).toBeVisible({ timeout: 15000 })
     }
}