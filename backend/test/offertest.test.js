var supertest = require('supertest')
var request = supertest('http://localhost:5000/api/offer/')

describe('GET-OFFER', () => {
    describe('new-email-successfull', () => {
        it("give error code 0", async () => {
            let data = {
                "email": email
            }
            const response = await request.post('signup/email').send(data)
            // .set("Authorization",Token)
            // console.log("response.body",response.body);
            expect(response.body.errorcode).toBe(0)
        })
    })

    describe('email-exist', () => {
        it("give error code 2", async () => {
            let data = {
                "email": email
            }
            const response = await request.post('signup/email').send(data)
            // .set("Authorization",Token)
            // console.log("response.body",response.body);
            expect(response.body.errorcode).toBe(2)
        })
    })
})
