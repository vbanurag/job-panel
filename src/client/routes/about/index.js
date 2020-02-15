import React from 'react'
import Layout from '../../components/Layout'
import Page from '../../components/Page'

export default {
    path:'/about',
    action () {
        return {
            title:'about',
            component: <Layout>
                <Page/>
            </Layout>
        }
    }
}