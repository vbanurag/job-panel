
import React from 'react';
import Analyze from './analyze';
import Layout from '../../components/Layout';

export default {
  path:'/analyze-profile',
    action () {
      return {
        title:'Profile',
          component: <Layout>
            <Analyze/>
          </Layout>
      }
    }
}