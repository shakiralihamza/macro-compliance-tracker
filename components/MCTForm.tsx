/* eslint-disable react-hooks/exhaustive-deps */
import React, {FC, useEffect} from 'react';
import {Button, Stack, TextField} from "@mui/material";
import {macroType} from "../pages";

enum macroTypeValues {
    calories = 'calories',
    carbs = 'carbs',
    fat = 'fat',
    protein = 'protein'
}

const inputStyles = {
    width: '120px',
}

interface MCTFormProps {
    handleChange: ({value, name}: { value: number, name: string }) => void
    name: string,
    data: macroType
}

const MctForm: FC<MCTFormProps> = ({handleChange, name, data}) => {
    const [calories, setCalories] = React.useState(0);
    const [fat, setFat] = React.useState(0);
    const [carbs, setCarbs] = React.useState(0);
    const [protein, setProtein] = React.useState(0);

    useEffect(() => {
        // @ts-ignore
        setCalories(data[macroTypeValues.calories][name]);
        // @ts-ignore
        setFat(data[macroTypeValues.fat][name]);
        // @ts-ignore
        setCarbs(data[macroTypeValues.carbs][name]);
        // @ts-ignore
        setProtein(data[macroTypeValues.protein][name]);
    },[]);
    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        const _name = name.split(' ')[1];
        const _value = Number(value);

        switch (_name) {
            case macroTypeValues.calories:
                if (!isNaN(_value)) {
                    setCalories(_value);
                    handleChange({value: _value, name});
                }
                break;
            case macroTypeValues.fat:
                if (!isNaN(_value)) {
                    setFat(_value);
                    handleChange({value: _value, name});
                }
                break;
            case macroTypeValues.carbs:
                if (!isNaN(_value)) {
                    setCarbs(_value);
                    handleChange({value: _value, name});
                }
                break;
            case macroTypeValues.protein:
                if (!isNaN(_value)) {
                    setProtein(_value);
                    handleChange({value: _value, name});
                }
                break;
        }
    }
    return (
        <>
            <Stack spacing={3}>
                <TextField name={name + ' ' + macroTypeValues.calories}
                           label={'Calories'}
                           value={calories}
                           variant={'outlined'}
                           style={inputStyles}
                           onChange={(e) => handleInput(e)}
                />
                <TextField name={name + ' ' + macroTypeValues.fat}
                           label={'Fat'}
                           value={fat}
                           variant={'outlined'}
                           style={inputStyles}
                           onChange={(e) => handleInput(e)}
                />
                <TextField name={name + ' ' + macroTypeValues.carbs}
                           label={'Carbs'}
                           value={carbs}
                           variant={'outlined'}
                           style={inputStyles}
                           onChange={(e) => handleInput(e)}
                />
                <TextField name={name + ' ' + macroTypeValues.protein}
                           label={'Protein'}
                           value={protein}
                           variant={'outlined'}
                           style={inputStyles}
                           onChange={(e) => handleInput(e)}
                />
                <Button variant={'contained'}>Save</Button>
            </Stack>
        </>
    );
}

export default MctForm;
