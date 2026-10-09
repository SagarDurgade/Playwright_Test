import { test, expect } from "@playwright/test"

test("Create and delete article via API", async ({ request }) => {

    const randomNumber = Math.floor(Math.random() * 100000)
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
                    title: `Automation_test_Delete_${randomNumber}`,
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
    const responceCreateArticle = await createNewArticle.json()
    const slug = responceCreateArticle.article.slug
    console.log(slug)
   
    const deleteArticle = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slug}`,
        {
            headers: {
                Authorization: `Token ${token}`
            }
        }
    )
    expect(deleteArticle.status()).toBe(204)
})