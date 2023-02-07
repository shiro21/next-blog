import '@/styles/globals.css'
import type { AppContext, AppProps } from 'next/app'
import Layout from './components/Layout'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { NextPageContext } from 'next'

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}

export async function getServerSideProps(context: any) {
  const cookie = context.req ? context.req.headers.cookie : "";
  console.log(cookie)
}

export default App;