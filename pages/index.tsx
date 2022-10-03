/* eslint-disable react-hooks/exhaustive-deps */
// noinspection JSUnusedGlobalSymbols

import type {GetServerSideProps, NextPage} from 'next'
import Head from 'next/head'
import {Container, Grid, IconButton, Tab, Tabs, Typography} from "@mui/material";
import Result from "../components/result";
import MCTForm from "../components/MCTForm";
import React, {useEffect, useState} from "react";
import {server} from "../config";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDoneIcon from '@mui/icons-material/CloudDone';

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
    const [changesMade, setChangesMade] = React.useState(false);

    const currDate = new Date().toISOString().split('T')[0];
    const prevDate = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
    const nextDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

    useEffect(() => {
        // @ts-ignore
        setData(props.data);
    }, []);

    const handleDataChange = ({value, name}: { value: number, name: string }) => {
        const _data = {...data};
        setChangesMade(true);

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
                setChangesMade(false);
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
                    setChangesMade(false);
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
                    <Grid container justifyContent={'space-between'} alignItems={'flex-end'} spacing={2} my={3}>
                        <Grid xs/>
                        <Grid item xs={10}>
                            <Tabs value={menu} centered>
                                <Tab label={prevDate} onClick={() => handleMenuChange(prevDate, 0)}/>
                                <Tab label={currDate} onClick={() => handleMenuChange(currDate, 1)}/>
                                <Tab label={nextDate} onClick={() => handleMenuChange(nextDate, 2)}/>
                            </Tabs>
                        </Grid>
                        <Grid xs>
                            {
                                changesMade ?
                                    <IconButton size="large" color={'warning'} disabled={saving}
                                                onClick={handleSave} disableRipple>
                                        <CloudUploadIcon fontSize="inherit"/>
                                    </IconButton>
                                    :
                                    <IconButton size="large" disableRipple>
                                        <CloudDoneIcon fontSize="inherit"/>
                                    </IconButton>
                            }

                        </Grid>
                    </Grid>
                    <Grid container spacing={5} alignItems={'center'} justifyContent={'center'}>
                        <Grid item xs={12} md={6} lg={7} order={{xs: 1, md: 2}}>
                            <Grid container justifyContent={'center'} alignItems={'center'} spacing={2}>
                                <Grid item xs={6} sm={3} md={6}>
                                    <Result result={data.macro.calories}/>
                                </Grid>
                                <Grid item xs={6} sm={3} md={6}>
                                    <Result result={data.macro.fat}/>
                                </Grid>
                                <Grid item xs={6} sm={3} md={6}>
                                    <Result result={data.macro.carbs}/>
                                </Grid>
                                <Grid item xs={6} sm={3} md={6}>
                                    <Result result={data.macro.protein}/>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} lg={5} order={{xs: 2, md: 1}}>
                            <Grid container justifyContent={'center'} alignItems={'center'} spacing={2}>
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
                            </Grid>
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
