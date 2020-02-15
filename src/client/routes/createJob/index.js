
import React from 'react';
import Job from './job';
import Layout from '../../components/Layout';

export default {
  path:'/create-job',
    action () {
      return {
        title:'Create a Job',
          component: <Layout>
            <Job/>
          </Layout>
      }
    }
}