
import React from 'react';
import Listing from './listing';
import Layout from '../../components/Layout';

export default {
  path:'/job-listing',
    action (context) {
      return {
        title:'home',
          component: <Layout>
            <Listing {...context}/>
          </Layout>
      }
    }
}