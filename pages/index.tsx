import type {NextPage} from 'next'
import Head from 'next/head'
import {Typography} from "@mui/material";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Macro Compliance Tracker</title>
            </Head>
            <Typography variant="h1" component="h1" gutterBottom>Macro Compliance Tracker</Typography>
        </>
    )
}

export default Home
