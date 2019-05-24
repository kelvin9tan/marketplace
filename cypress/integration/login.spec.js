/**
 * Created by ARTIO on 23.5.2019.
 */
context("Login and logout",() => {
    const testedDomain = "http://test.echoexchange.net";
    it('Bad credentials',() => {
        cy.server();
        //This is the post call we are interested in capturing
        cy.route('POST', '/prodex/oauth/token').as('login');

        cy.visit(testedDomain);
        cy.url().should("include","login");
        cy.get("input[name=username]")
            .type("admin@example.com")
            .should("have.value","admin@example.com");
        cy.get("input[name=password]")
            .type("test")
            .should("have.value","test");
        cy.get("button[type=submit]").click();

        cy.wait('@login');

        //Assert on XHR
        cy.get('@login').then(function (xhr) {
            expect(xhr.status).to.eq(400);
            expect(xhr.requestHeaders).to.have.property('Content-Type');
            expect(xhr.method).to.eq('POST');
            expect(xhr.responseBody).to.have.property('error');
            expect(xhr.responseBody).to.have.property('error_description');
            cy.get(".error.message p")
                .should("have.text","Bad credentials");
        })
    });

    it('Admin login and logout',() => {
        cy.server();
        //This is the post call we are interested in capturing
        cy.route('POST', '/prodex/oauth/token').as('login');
        cy.route('POST', '/auth/logout').as('logout');

        cy.visit(testedDomain);
        cy.url().should("include","login");
        cy.get("input[name=username]")
            .type("admin@example.com")
            .should("have.value","admin@example.com");
        cy.get("input[name=password]")
            .type("echopass123")
            .should("have.value","echopass123");
        cy.get("button[type=submit]").click();

        cy.wait('@login');

        //Assert on XHR
        cy.get('@login').then(function (xhr) {
            expect(xhr.status).to.eq(200);
            expect(xhr.requestHeaders).to.have.property('Content-Type');
            expect(xhr.method).to.eq('POST');
            expect(xhr.url).to.contain("oauth/token");
            expect(xhr.responseBody).to.have.property('access_token');
            expect(xhr.responseBody).to.have.property('expires_in');
            expect(xhr.responseBody).to.have.property('refresh_token');
            expect(xhr.responseBody).to.have.property('scope');
            expect(xhr.responseBody).to.have.property('token_type');
            expect(xhr.responseBody.token_type).to.eq("bearer");
        });

        cy.url().should("include","/admin");
        cy.wait(200);
        cy.get(".right.menu .user.circle").click("center");
        cy.get(".right.menu .item.dropdown").should("have.class","visible");
        cy.get(".right.menu .item.dropdown").contains("Logout").click("center");
        cy.url().should("include","/login");
        cy.visit(testedDomain+"/admin");
        cy.url().should("include","/login");
    });

    it('Normal user login and logout',() => {
        cy.server();
        //This is the post call we are interested in capturing
        cy.route('POST', '/prodex/oauth/token').as('login');
        cy.route('POST', '/auth/logout').as('logout');

        cy.visit(testedDomain);
        cy.url().should("include","login");
        cy.get("input[name=username]")
            .type("user1@example.com")
            .should("have.value","user1@example.com");
        cy.get("input[name=password]")
            .type("echopass123")
            .should("have.value","echopass123");
        cy.get("button[type=submit]").click();

        cy.wait('@login');

        //Assert on XHR
        cy.get('@login').then(function (xhr) {
            expect(xhr.status).to.eq(200);
            expect(xhr.requestHeaders).to.have.property('Content-Type');
            expect(xhr.method).to.eq('POST');
            expect(xhr.url).to.contain("oauth/token");
            expect(xhr.responseBody).to.have.property('access_token');
            expect(xhr.responseBody).to.have.property('expires_in');
            expect(xhr.responseBody).to.have.property('refresh_token');
            expect(xhr.responseBody).to.have.property('scope');
            expect(xhr.responseBody).to.have.property('token_type');
            expect(xhr.responseBody.token_type).to.eq("bearer");
        });

        cy.wait(200);
        cy.get(".right.menu .user.circle").click("center");
        cy.get(".right.menu .item.dropdown").should("have.class","visible");
        cy.get(".right.menu .item.dropdown").contains("Logout").click("center");
        cy.url().should("include","/login");
        cy.visit(testedDomain+"/dashboard");
        cy.url().should("include","/login");
    });
});