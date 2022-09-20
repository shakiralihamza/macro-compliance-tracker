/* eslint-disable react-hooks/exhaustive-deps */
// noinspection JSUnusedGlobalSymbols

import type {GetServerSideProps, NextPage} from 'next'
import Head from 'next/head'
import {Button, Container, Grid, Tab, Tabs, Typography} from "@mui/material";
import Result from "../components/result";
import MCTForm from "../components/MCTForm";
import React, {useEffect, useState} from "react";
import {server} from "../config";


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

interface macroTypeProp {
    date: string,
    macro: macroType
}

const saveMacro = async (data: macroTypeProp) => {
    const res = await fetch(`${server}/api/daily`, {
        method: 'post',
        body: JSON.stringify(data)
    });
    return await res.json();
};

const getMacro = async (date: string) => {
    const res = await fetch(`${server}/api/daily?date=${date}`);
    return await res.json();
}
const Home: NextPage = (props) => {
    const [data, setData] = useState<macroTypeProp | null>(null);
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
        _data.macro[resultMacro][resultType] = value;

        // @ts-ignore
        setData(_data);
    }

    const handleMenuChange = (date: string, menu: number) => {
        getMacro(date)
            .then((data) => {
                setData(data);
                setMenu(menu);
            })
            .catch((error) => {
                console.log('API error', error)
            })
    };

    const handleSave = () => {
        setSaving(true);
        if (data) {
            saveMacro(data)
                .then(() => {
                    setSaving(false);
                })
                .catch((error) => {
                    console.log('API error', error)
                })
        }
    }
    return (
        <>
            <Head>
                <title>Macro Compliance Tracker</title>
            </Head>
            {
                data && data.macro &&
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
                            <Result result={data.macro.calories}/>
                        </Grid>
                        <Grid item xs={3}>
                            <Result result={data.macro.fat}/>
                        </Grid>
                        <Grid item xs={3}>
                            <Result result={data.macro.carbs}/>
                        </Grid>
                        <Grid item xs={3}>
                            <Result result={data.macro.protein}/>
                        </Grid>
                    </Grid>

                    <Grid container justifyContent={'center'} alignItems={'center'} spacing={10}>
                        <Grid item xs={'auto'}>
                            <Typography variant={'h5'} mb={2}>Calories</Typography>
                            <MCTForm data={data.macro} name={'total'} handleChange={handleDataChange}/>
                        </Grid>
                        <Grid item xs={'auto'}>
                            <Typography variant={'h5'} mb={2}>Target</Typography>
                            <MCTForm data={data.macro} name={'target'} handleChange={handleDataChange}/>
                        </Grid>
                        <Grid item xs={'auto'}>
                            <Typography variant={'h5'} mb={2}>Variance</Typography>
                            <MCTForm data={data.macro} name={'variant'} handleChange={handleDataChange}/>
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
    const res = await fetch(`${server}/api/daily?date=${date}`);
    const json = await res.json();
    return {
        props: {
            data: json,
        },
    };
};

export default Home
