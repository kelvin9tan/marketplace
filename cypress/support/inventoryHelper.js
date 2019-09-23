Cypress.Commands.add("selectChemical", (chemical) => {
    cy.server()
    cy.route("GET",'/prodex/api/products/own/search?*').as('search')

    cy.get("#field_dropdown_product")
        .children("input")
        .type(chemical)
        .should("have.value",chemical)

    cy.wait('@search')
    cy.wait(500)
    cy.get('div[role=option]').eq(0).click({force: true})
})

Cypress.Commands.add("assertProductDetail", (index,value) => {
    cy.get(".data-grid")
        .children()
        .eq(index).contains(value)
})