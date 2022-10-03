import React, {FC, useEffect} from 'react';
import {Grid, Paper, Typography} from "@mui/material";
import {Stack} from "@mui/material";
import {macroDetails} from "../pages";

interface ResultProps {
    result: macroDetails
}

type BackGroundType = 'success' | 'error' | 'info';

const Result: FC<ResultProps> = ({result}) => {
    const [background, setBackground] = React.useState<BackGroundType>('success');

    useEffect(() => {
        const min = result.target - result.variant;
        const max = result.target + result.variant;

        if (result.total >= min && result.total <= max) {
            setBackground('success');
        } else if (result.total < min) {
            setBackground('info');
        } else if (result.total > max) {
            setBackground('error');
        }

    }, [result.target, result.total, result.variant]);

    return (
        <div>
            <Paper elevation={1} sx={{
                p: 2,
                borderRadius: 10,
                bgcolor: background + '.main',
            }}>
                <Grid container alignItems={'center'} justifyContent={'center'} direction={'column'} spacing={2}>
                    <Grid item>
                        <Typography variant={'h4'}>{result.total}</Typography>
                    </Grid>
                    <Grid item xs sx={{width: '100%'}}>
                        <Stack direction={'row'} alignItems={'center'}
                               justifyContent={{xs: 'space-between', md: 'space-around'}}>
                            <Typography variant={'body2'}>{result.target - result.variant}</Typography>
                            <Typography variant={'body1'} fontWeight={'bold'}>{result.target}</Typography>
                            <Typography variant={'body2'}>{result.target + result.variant}</Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs>
                        <Typography variant={'body1'}>{result.label}</Typography>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

export default Result;
