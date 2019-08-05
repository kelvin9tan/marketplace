context("Units of measure CRUD", () => {

    beforeEach(function () {
        cy.server()
        cy.route("GET", '/prodex/api/packaging-groups').as('loading')
        cy.route("GET", '/prodex/api/units').as('unitLoad')

        cy.login("admin@example.com", "echopass123")

        cy.url().should("include", "admin")

        cy.wait('@loading')

        cy.get('[data-test="tabs_menu_item_1"]').click()

        cy.wait('@unitLoad')
    })

    it("Creates an unit of measure", () => {
        cy.clickAdd()

        cy.get("#field_input_val0")
            .type("Test measure")
            .should("have.value","Test measure")

        cy.get("#field_input_val1")
            .type("tmr")
            .should("have.value","tmr")

        cy.get("#field_dropdown_val2").click()
        cy.get("#2").click()

        cy.clickSave()

        cy.contains("Unit of Measurement created")
    })

    it("Edits unit of measure", () => {
        cy.get("input[type=text]").type("Test")

        cy.waitForUI()

        cy.get("i[class='ellipsis vertical large icon']").click()

        cy.contains("Edit").click()

        cy.get("#field_input_val1")
            .clear()
            .type("test")
            .should("have.value","test")

        cy.clickSave()

        cy.contains("Updated Unit of Measurement")
    })

    xit("Use unit of measure", () => {
        cy.get("input[type=text]").type("David Tester")

        cy.get("i[class='ellipsis vertical large icon']").click()

        cy.get("#field_input_val1")
            .clear()
            .type("test")
            .should("have.value","test")

        cy.clickSave()
    })

    it("Checks error messages", () => {
        cy.clickAdd()

        cy.clickSave()

        cy.get(".error")
            .should("have.length",3)
            .find(".sui-error-message").each((element) => {
            expect(element.text()).to.match(/(Required)/i)
        })
    })

    it("Deletes an unit of measure", () => {
        cy.get("input[type=text]").type("Test")

        cy.waitForUI()

        cy.get("i[class='ellipsis vertical large icon']").click()

        cy.contains("Delete").click()

        cy.contains("Yes").click()

        cy.contains("No records found.")
    })
})