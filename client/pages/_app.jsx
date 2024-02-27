import 'bootstrap/dist/css/bootstrap.css'
import React from 'react'
import buildClient from "../api/build-client"
import Header from '../components/Header'



const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <div className="container">
                <Component {...pageProps} currentUser={currentUser} />
            </div>
        </div>
    )
}

// DEPRECATED getServerSideProps should be used
AppComponent.getInitialProps = async (appContext) => {
    try {
        const client = buildClient(appContext.ctx)
        const { data } = await client.get('/api/users/currentuser')

        let pageProps = {}
        if (appContext.Component.getInitialProps) {
            // NB: /api/users/currentuser called twice
            pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser)
        }

        return {
            pageProps,
            ...data
        }
    } catch (error) {
        return {}
    }
}

export default AppComponent