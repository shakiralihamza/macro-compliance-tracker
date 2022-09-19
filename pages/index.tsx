/* eslint-disable react-hooks/exhaustive-deps */
// noinspection JSUnusedGlobalSymbols

import type {GetServerSideProps, NextPage} from 'next'
import Head from 'next/head'
import {Button, Container, Grid, Tab, Tabs, Typography} from "@mui/material";
import Result from "../components/result";
import MCTForm from "../components/MCTForm";
import React, {useEffect, useState} from "react";


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

const Home: NextPage = (props) => {
    const [data, setData] = useState<macroType | null>(null);
    const [saving, setSaving] = React.useState(false);
    const [menu, setMenu] = React.useState(1);

    const currDate = new Date().toISOString().split('T')[0];
    const prevDate = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
    const nextDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

    useEffect(() => {
        // @ts-ignore
        setData(props.data);
    }, []);

    const handleDataChange = ({value, name}: { value: number, name: string }) => {
        const _data = {...data};

        let resultType = name.split(" ")[0].toLowerCase();
        let resultMacro = name.split(" ")[1].toLowerCase();

        // @ts-ignore
        _data[resultMacro][resultType] = value;

        // @ts-ignore
        setData(_data);
    }

    const handleMenuChange = async (date: string, menu: number) => {
        const res = await fetch(`http://localhost:3000/api/daily?date=${date}`);
        res.json().then(res => {
            setData(res);
            setMenu(menu);
        })
    };

    const handleSave = async () => {
        setSaving(true);
        const res = await fetch('http://localhost:3000/api/daily', {
            method: 'post',
            body: JSON.stringify(data)
        });
        res.json().then(res => {
            console.log(res)
            setSaving(false);
        });
    }
    return (
        <>
            <Head>
                <title>Macro Compliance Tracker</title>
            </Head>
            {
                data &&
                <Container maxWidth={'lg'}>
                    <Grid container justifyContent={'center'} alignItems={'center'} spacing={2} my={3}>
                        <Grid item xs={12}>
                            <Tabs value={menu} centered>
                                <Tab label={prevDate} onClick={() => handleMenuChange(prevDate, 0)}/>
                                <Tab label={currDate} onClick={() => handleMenuChange(currDate, 1)}/>
                                <Tab label={nextDate} onClick={() => handleMenuChange(nextDate, 2)}/>
                            </Tabs>
                        </Grid>
                    </Grid>

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
                            <MCTForm data={data} name={'total'} handleChange={handleDataChange}/>
                        </Grid>
                        <Grid item xs={'auto'}>
                            <Typography variant={'h5'} mb={2}>Target</Typography>
                            <MCTForm data={data} name={'target'} handleChange={handleDataChange}/>
                        </Grid>
                        <Grid item xs={'auto'}>
                            <Typography variant={'h5'} mb={2}>Variance</Typography>
                            <MCTForm data={data} name={'variant'} handleChange={handleDataChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant={'contained'} disabled={saving} onClick={handleSave}>Save</Button>
                        </Grid>
                    </Grid>
                </Container>
            }
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    //date today
    const date = new Date().toISOString().split('T')[0];
    const res = await fetch(`http://localhost:3000/api/daily?date=${date}`);
    const json = await res.json();
    return {
        props: {
            data: json,
        },
    };
};

export default Home
