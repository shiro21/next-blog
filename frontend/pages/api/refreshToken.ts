// pages/api/refreshToken.ts

export const setTokenCookie = (token: string) => {
  fetch("http:localhost:3000/api/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ token })
  })
}
