/// <reference types="cypress" />

Cypress.Commands.add("iframe", { prevSubject: "element" }, ($iframe) => {
  const $iframeDoc = $iframe.contents();
  const findBody = () => $iframeDoc.find("body");

  if ($iframeDoc.prop("readyState") === "complete") return findBody();

  return Cypress.Promise((resolve) =>
    $iframe.on("load", () => resolve(findBody()))
  );
});

context("00-ANALYSER-시각화", () => {
  it("login", () => {
    cy.visit("http://192.168.102.114:32331/");
    
    // 아이디 입력
    cy.get("input.login-form__username-input")
      .type("root")
      .should("have.value", "root");

    // 비밀번호 입력
    cy.get("input.login-form__password-input")
      .type("DEFAULT_PASSWORD")
      .should("have.value", "DEFAULT_PASSWORD");
    cy.get("input.login-form__submit-button").click();

    //  메뉴 -> analyser
    cy.get("div.group-menu.group-menu_hide")
      .click()
      .then(() => {
        cy.get("span[title='IRIS Analyser']").click();
      });

    // 시각화
    cy.get("ul.top-menu > li").eq(2).click();

    // iframe 대기
    cy.wait(5000);

    // iframe 전환
    cy.get("#iframe")
      .iframe()
      .within(() => {
        // 꺾은 선형으로 변경 & 데이터 모델 선택
        cy.get("#adv_desc_menu_btn").click();
        cy.get(".type.ng-scope.type1 > ul > li").eq(0).click();
        cy.get(".model-name").eq(0).click();

        const dataTransfer = new DataTransfer();

        // 드래그 할 대상
        const FROM = cy.get("li.ng-scope").eq(1);

        FROM.trigger("dragstart", { dataTransfer });
        cy.wait(5000);
        cy.get(".bx-yaxis-body > div").eq(1).trigger("drop", { dataTransfer });
        cy.wait(5000);
        cy.get(".bx-yaxis-body > div").eq(1).trigger("dragend");
      });
  });
});
