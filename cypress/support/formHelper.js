Cypress.Commands.add("clickSave", () => {
    cy.get("button[class='ui primary button']").click({force: true})
    cy.wait(1000)
})

Cypress.Commands.add("clickAdd", () => {
    cy.get("button[class='ui large primary button']").click({force: true})
})

Cypress.Commands.add("enterText", (selector,text) => {
    cy.get(selector)
        .type(text)
        .should("have.value",text)
})

Cypress.Commands.add("searchInList", (text) => {
    cy.get("input[type=text]").type(text)
})

Cypress.Commands.add("selectFromDropdown", (selector,value) => {
    cy.get(selector)
        .children("input")
        .type(value)
        .should("have.value",value)

    cy.wait(1000)
    cy.get(selector).within(() => {
        cy.get("div[class='selected item']").click({force: true})
    })
})

Cypress.Commands.add("setNumberInput", (selector,number) => {
    cy.get(selector)
        .scrollIntoView()
        .clear()
        .type(number)
        .should("have.value",number)
})