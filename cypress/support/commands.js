// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (email, password) => {
    cy.server()
    //This is the post call we are interested in capturing
    cy.route('POST', '/prodex/oauth/token').as('login')
    cy.visit("")
    cy.url().should("include", "login")
    cy.get("input[name=username]")
        .type(email)
    cy.get("input[name=password]")
        .type(password)
    cy.get("button[type=submit]").click()

    cy.wait('@login')

    //Assert on XHR
    cy.get('@login').then(function (xhr) {
        expect(xhr.status).to.eq(200)
        expect(xhr.responseBody).to.have.property('access_token')
    })
})

Cypress.Commands.add("logout", () => {
    cy.get(".right.menu .user.circle").click("center")
    cy.get(".right.menu .item.dropdown").should("have.class", "visible")
    cy.get(".right.menu .item.dropdown").contains("Logout").click("center")
    cy.url().should("include", "/login")
    cy.visit("admin")
    cy.url().should("include", "/login")
})

Cypress.Commands.add("getToken", () => {
    cy.request({
        method: 'POST',
        url: '/prodex/oauth/token',
        headers: {
            authorization: "Basic cHJvZGV4LXJlYWN0OmthcmVsLXZhcmVs"
        },
        form: true,
        body: {
            grant_type: "password",
            username: "user1@example.com",
            password: "echopass123"
        }
    }).then((response) => {
        expect(response.status).to.eq(200)
        return response.body.access_token
    })
})

Cypress.Commands.add("getFirstItemId", (token) => {
    cy.request({
        method: 'POST',
        url: '/prodex/api/product-offers/own/datagrid/',
        headers: {
            authorization: "Bearer " + token
        },
        body: {pageNumber: 0, filters: [], pageSize: 50}
    }).then((response) => {
        expect(response.status).to.eq(200)
        return response.body[0].id
    })
})

Cypress.Commands.add("waitForUI", () => {
    cy.wait(1500)
})