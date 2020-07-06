Cypress.Commands.add('iframe', { prevSubject: 'element' }, ($iframe) => {
  const $iframeDoc = $iframe.contents()
  const findBody = () => $iframeDoc.find('body')

  if ($iframeDoc.prop('readyState') === 'complete') return findBody()

  return Cypress.Promise((resolve) => $iframe.on('load', () => resolve(findBody())))
})

describe('The B-iris page', () =>  {
  it('analyzer check', () =>  {
	cy.visit('http://b-iris.mobigen.com')
	cy.get('.login-form-box').get('.login-form__username-input').type('root')
        cy.get('.login-form__password-input').type('*****')
	cy.get('.login-form__submit-button').click()
	cy.get('.layout-root');
	cy.get('.group-menu__id-text').click()
        cy.get('.group-menu-item__text').contains('Analyzer').click()
	cy.wait(10000)  // Analyzer 화면 로딩 기다림

	cy.get('#iframe').iframe().within(() => {
	    cy.get('.mu-tabCont > .mu-input-icon > .mu-input').type('syslog');
	    // 실패하는 테스트 케이스
    	    //cy.get('.mu-tabCont > .mu-input-icon > .mu-input').type('APP_XDR_0511');
	    cy.get('.ng-scope > :nth-child(1) > td .model-owner').click();
	    cy.get('.play').click()
	    cy.get('.highcharts-root').should('be.visible')
	    cy.get('[row-index="0"]').should('be.exist')  // grid first element should be exist 
	    cy.get('.ag-center-cols-viewport').should('be.exist')  // viewport of bar graph should be exist
      })
    })
})


