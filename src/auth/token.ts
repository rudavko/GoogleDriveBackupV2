export const makeToken = (token: string): Token =>
  ({ refresh_token: token })

export interface Token {
  refresh_token: string
}
