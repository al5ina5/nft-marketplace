import dayjs from 'dayjs'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import NextNProgress from "nextjs-progressbar"
import 'nprogress/nprogress.css'
import { SWRConfig } from 'swr'
import { UseWalletProvider } from 'use-wallet'
import { AppWrapper } from '../AppWrapper'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Meta from '../components/Meta'
import '../styles/global.css'
import { api } from '../utils/utils'


const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Meta />
            <NextNProgress color="white" />
            <UseWalletProvider>
                <SWRConfig value={{
                    refreshInterval: 3000, fetcher: (url) => api.get(url).then((res) => res.data)

                }}>
                    <AppWrapper>
                        <Header />
                        <Component {...pageProps} />
                        <Footer />
                    </AppWrapper>
                </SWRConfig>
            </UseWalletProvider>
        </>
    )
}
