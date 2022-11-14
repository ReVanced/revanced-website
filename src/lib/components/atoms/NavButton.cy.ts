import NavButton from './NavButton.svelte';

describe('NavButton', () => {
  it('should properly highlight', () => {
    // When it matches
    cy.mount(NavButton, { props: { href: location.pathname } });
    cy.get("li").should("have.class", "selected");

    // When it doesn't
    cy.mount(NavButton, { props: { href: "no" } });
    cy.get("li").should("not.have.class", "selected");

    // is_selected behavior
    const spy = cy.spy(() => true);
    cy.mount(NavButton, { props: { is_selected: spy } });
    cy.get("li").should("have.class", "selected");
    cy.wrap(spy).should("have.been.calledOnceWithExactly", location.pathname);
  })
})
