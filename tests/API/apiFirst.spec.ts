import { test, expect } from '@playwright/test'

test('Api Get request', async ({ request }) => {
    const response = await request.get('https://conduit-api.bondaracademy.com/api/tags')
    const responseBody = await response.json() 
    expect(response.status()).toBe(200)
    expect(response.ok()).toBeTruthy()
    expect(responseBody.tags).toHaveLength(10)
    console.log(responseBody)
})

test('Api Post request', async ({ request }) => {
    // create random article title
    const randomTitle = `Sagar_${Math.floor(Math.random() * 1000)}`;
    const response = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        headers: {
            Authorization: 'Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo2NjIzOH0sImlhdCI6MTc4ODkzNzY0MywiZXhwIjoxNzk0MTIxNjQzfQ.MreldR2_4ZHUse0NEQG4UceIARnTIh2cmBY3rQKKTLQ'
        },
        data: {
            'article': {title: randomTitle, description: "pqr", body: "post", tagList: ["Git"]}
        }
    })
    expect(response.status()).toBe(201)
    expect(response.ok()).toBeTruthy()
    const responseBody = await response.json()
    expect(responseBody.article.title).toBe(randomTitle)
    console.log(responseBody)
})

// data
// url = https://conduit.bondaracademy.com