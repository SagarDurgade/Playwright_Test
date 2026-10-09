import { test, expect } from "@playwright/test"

test("UI and API testing", async ({ page, request }) => {
    const loginUsingApi = await request.post(
        "https://conduit-api.bondaracademy.com/api/users/login",
        {
            data: {
                user: {
                    email: "sagardurgadesdet@gmail.com",
                    password: "Durgade@123",
                },
            },
        },
    )

    expect(loginUsingApi.status()).toBe(200)
    const responceData = await loginUsingApi.json()
    const token = responceData.user.token

    const createNewArticle = await request.post(
        "https://conduit-api.bondaracademy.com/api/articles/",
        {
            data: {
                article: {
                    title: "Automation_test_Engineer",
                    description: "test",
                    body: "playwright",
                    tagList: ["Coding"],
                }
            },
            headers: {
                Authorization: `Token ${token}`
            }
        },
    )

    expect(createNewArticle.status()).toBe(201)

    await page.goto('https://conduit.bondaracademy.com/')
    await page.getByRole('link', { name: 'Sign in' }).click()
    await page.getByRole('textbox', { name: 'Email' }).fill('sagardurgadesdet@gmail.com')
    await page.getByRole('textbox', { name: 'Password' }).fill('Durgade@123')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.locator('.preview-link h1').first()).toContainText('Automation_test_Engineer')
    await page.getByRole('link', { name: 'Automation_test_Engineer test' }).click()
    await page.getByRole('button', { name: 'Delete Article' }).first().click()

    await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
    await expect(page.locator('.preview-link h1').first()).not.toContainText('Automation_test_Engineer')
})

test('Verify Data Creation via UI and Deletion via API', async ({ page, request }) => {
    await page.goto('https://conduit.bondaracademy.com/')
    await page.getByRole('link', { name: 'Sign in' }).click()
    await page.getByRole('textbox', { name: 'Email' }).fill('sagardurgadesdet@gmail.com')
    await page.getByRole('textbox', { name: 'Password' }).fill('Durgade@123')
    await page.getByRole('button', { name: 'Sign in' }).click()

    const articleTitle = 'UI_Automation_test_Engineer_' + Math.floor(Math.random() * 10000)
    await page.getByRole('link', { name: 'New Article' }).click()
    await page.getByRole('textbox', { name: 'Article Title' }).fill(articleTitle)
    await page.getByRole('textbox', { name: 'What\'s this article about?' }).fill('test')
    await page.getByRole('textbox', { name: 'Write your article (in markdown)' }).fill('playwright')
    await page.getByRole('textbox', { name: 'Enter tags' }).fill('Coding')
    await page.getByRole('button', { name: 'Publish Article' }).click()

    const createdArticalResopnce = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
    const articalResonseJson = await createdArticalResopnce.json()
    const slugId = articalResonseJson.article.slug
    console.log(slugId)
    await page.getByRole('link', { name: 'Home' }).click()
    await expect(page.locator('app-article-list')).toContainText(articleTitle)


    const loginUsingApi = await request.post(
        "https://conduit-api.bondaracademy.com/api/users/login",
        {
            data: {
                user: {
                    email: "sagardurgadesdet@gmail.com",
                    password: "Durgade@123",
                },
            },
        },
    )

    expect(loginUsingApi.status()).toBe(200)
    const responceData = await loginUsingApi.json()
    const token = responceData.user.token

    // Delete the article via API using the token and slugId
    const deleteArticleResponse = await request.delete(
        `https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
        {
            headers: {
                Authorization: `Token ${token}`,
            },
        }
    )
    expect(deleteArticleResponse.status()).toBe(204)

    await page.reload()
    await expect(page.locator('app-article-list')).not.toContainText(articleTitle)
})

