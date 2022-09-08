var supertest = require('supertest')
var request = supertest('http://localhost:5000/api/user/')
let email = "manaf79@gmail.com"
let email1 = "vpzqz@gmail.com"
let password="123456"

describe('EMAIL-ENROLLING', () => {
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


describe('USER-SIGNUP', () => {
    describe('user-signup-successffull', () => {
        it("give error code 0", async () => {
            let data = {
                "email": email,
                "password":password
            }
            const response = await request.post('signup').send(data)
            // .set("Authorization",Token)
            console.log("response.body",response.body);
            expect(response.body.errorcode).toBe(0)
        })
    })

    describe('email-not-present', () => {
        it("give error code 3", async () => {
            let data = {
                "email": email,
                "password":password
            }
            const response = await request.post('signup').send(data)
            // .set("Authorization",Token)
            console.log("response.body",response.body);
            expect(response.body.errorcode).toBe(3)
        })
    })

    describe('user-already-signedUP', () => {
        it("give error code 2", async () => {
            let data = {
                "email": email,
                "password":password
            }
            const response = await request.post('signup').send(data)
            // .set("Authorization",Token)
            console.log("response.body",response.body);
            expect(response.body.errorcode).toBe(2)
        })
    })
})

describe('USER-SIGNIN', () => {
    describe('user-not-exist', () => {
        it("give error code 2", async () => {
            let data = {
                "email": email,
                "password":password
            }
            const response = await request.post('signin').send(data)
            // .set("Authorization",Token)
            console.log("response.body",response.body);
            expect(response.body.errorcode).toBe(2)
        })
    })

    describe('password-incorrect', () => {
        it("give error code 3", async () => {
            let data = {
                "email": email
            }
            const response = await request.post('signin').send(data)
            // .set("Authorization",Token)
            console.log("response.body",response.body);
            expect(response.body.errorcode).toBe(3)
        })
    })

    describe('sign-in-successfull', () => {
        it("give error code 0", async () => {
            let data = {
                "email": email,
                "password":password
            }
            const response = await request.post('signin').send(data)
            // .set("Authorization",Token)
            console.log("response.body",response.body);
            expect(response.body.errorcode).toBe(0)
        })
    })
})