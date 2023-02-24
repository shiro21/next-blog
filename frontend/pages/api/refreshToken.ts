import { GetServerSidePropsContext, PreviewData } from "next"
import { ParsedUrlQuery } from "querystring"
import cookie from 'cookie'

// export const setTokenCookie = async (token: string) => {
//   await fetch(`${nextBaseUrl}/login`, {
//       method: "POST",
//       headers: {
//           "Content-Type": "application/json"
//       },
//       credentials: "include",
//       body: JSON.stringify({ token })
//   })
// }

export const setTokenCookie = async (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>, refreshToken: string) => {
  context.res.setHeader(
    "set-cookie",
    cookie.serialize("@nextjs-blog-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60,
      sameSite: "strict",
      path: "/"
    })
  )
}