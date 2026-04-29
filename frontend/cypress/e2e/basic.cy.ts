export const API_URL = 'http://localhost:3000'

describe('테스트할 Fastcampus Nextbnb 페이지들을 확인한다.', () => {
  it('메인 페이지 방문', () => {
    cy.visit(API_URL)
  })

  it('지도 페이지 방문', () => {
    cy.visit(`${API_URL}/map`)
  })

  it('로그인 페이지 방문', () => {
    cy.visit(`${API_URL}/users/signin`)
  })

  it('FAQ 페이지 방문', () => {
    cy.visit(`${API_URL}/faqs`)
  })

  it('상세 페이지 방문', () => {
    cy.visit(`${API_URL}/rooms/130`)
  })
})
