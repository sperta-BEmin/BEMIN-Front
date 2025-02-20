import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import Layout from '../components/Layout';
import {AuthProvider} from "../context/AuthContext";

export default function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </AuthProvider>
    )
}
