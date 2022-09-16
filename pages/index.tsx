// noinspection JSUnusedGlobalSymbols

import type {NextPage} from 'next'
import Head from 'next/head'
import {Container, Grid, Typography} from "@mui/material";
import Result from "../components/result";
import MCTForm from "../components/MCTForm";
import React, {useState} from "react";

let dummyData = {
    calories: {
        label: "Calories",
        total: 1840,
        target: 1840,
        variant: 15
    },
    carbs: {
        label: "Carbs",
        total: 190,
        target: 160,
        variant: 15
    },
    fat: {
        label: "Fat",
        total: 55,
        target: 60,
        variant: 10
    },
    protein: {
        label: "Protein",
        total: 120,
        target: 165,
        variant: 10
    }
}

export type macroDetails = {
    label: string,
    total: number,
    target: number,
    variant: number
}

export interface macroType {
    calories: macroDetails,
    carbs: macroDetails,
    fat: macroDetails,
    protein: macroDetails
}
const Home: NextPage = () => {
    const [data, setData] = useState<macroType>(dummyData);

    const handleChange = ({value, name}: { value: number, name: string }) => {
        const _data = {...data};

        let resultType = name.split(" ")[0].toLowerCase();
        let resultMacro = name.split(" ")[1].toLowerCase();

        // @ts-ignore
        _data[resultMacro][resultType] = value;

        setData(_data);
    }

    return (
        <>
            <Head>
                <title>Macro Compliance Tracker</title>
            </Head>
            <Container maxWidth={'lg'}>
                <Grid container justifyContent={'center'} alignItems={'center'} spacing={2} my={3}>
                    <Grid item xs={3}>
                        <Result result={data.calories}/>
                    </Grid>
                    <Grid item xs={3}>
                        <Result result={data.fat}/>
                    </Grid>
                    <Grid item xs={3}>
                        <Result result={data.carbs}/>
                    </Grid>
                    <Grid item xs={3}>
                        <Result result={data.protein}/>
                    </Grid>
                </Grid>
                <Grid container justifyContent={'center'} alignItems={'center'} spacing={10}>
                    <Grid item xs={'auto'}>
                        <Typography variant={'h5'} mb={2}>Calories</Typography>
                        <MCTForm data={data} name={'total'} handleChange={handleChange}/>
                    </Grid>
                    <Grid item xs={'auto'}>
                        <Typography variant={'h5'} mb={2}>Target</Typography>
                        <MCTForm data={data} name={'target'} handleChange={handleChange}/>
                    </Grid>
                    <Grid item xs={'auto'}>
                        <Typography variant={'h5'} mb={2}>Variance</Typography>
                        <MCTForm data={data} name={'variant'} handleChange={handleChange}/>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default Home
