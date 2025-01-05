// tests/utils/keycloak-auth-utils.ts

import { Page } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const mockJwtPayload = {
  exp: Math.floor(Date.now() / 1000) + 7200,
  iat: Math.floor(Date.now() / 1000),
  auth_time: Math.floor(Date.now() / 1000),
  jti: 'mock-jwt-id',
  iss: process.env.KEYCLOAK_ISSUER,
  aud: process.env.KEYCLOAK_CLIENT_ID,
  sub: 'test-subject-id',
  typ: 'Bearer',
  azp: process.env.KEYCLOAK_CLIENT_ID,
  session_state: 'mock-session',
  acr: '1',
  'allowed-origins': ['http://localhost:3001'],
  realm_access: { roles: ['default-roles-baby-yoda'] },
  resource_access: {},
  scope: 'openid profile email',
  sid: 'mock-session-id',
  email_verified: true,
  name: 'Test User',
  preferred_username: 'test.user',
  given_name: 'Test',
  family_name: 'User',
  email: 'test.user@spaceforce.mil',
  usercertificate: '1234567890@mil',
}

function generateMockJwt() {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify(mockJwtPayload)).toString('base64url')
  const signature = 'mock_signature'
  return `${header}.${payload}.${signature}`
}

export async function setupAuth(page: Page) {
  const mockToken = generateMockJwt()

  await page.route('**/*', async (route) => {
    const request = route.request()
    if (request.url().includes('/api/')) {
      await route.continue({
        headers: {
          ...request.headers(),
          Authorization: `Bearer ${mockToken}`,
        },
      })
    } else {
      await route.continue()
    }
  })

  await page.context().addCookies([
    {
      name: 'auth_token',
      value: mockToken,
      domain: 'localhost',
      path: '/',
    },
    {
      name: 'email',
      value: mockJwtPayload.email,
      domain: 'localhost',
      path: '/',
    },
    {
      name: 'userId',
      value: mockJwtPayload.usercertificate,
      domain: 'localhost',
      path: '/',
    },
  ])
}
