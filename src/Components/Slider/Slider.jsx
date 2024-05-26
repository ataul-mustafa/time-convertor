import React, { useEffect, useMemo, useState } from 'react';
import styles from './Slider.module.css';
import { times } from '../data/time';
import Select from 'react-select';
import { RxCross1 } from "react-icons/rx";
import moment from 'moment-timezone';


const Slider = ({ draggableProps, dragHandleProps, zonesTime, setZonesTime, i, selectedTimezones, convertFun, setSelectedTimezones, date, refr }) => {

    const labels = ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm', ''];   //labels to show as time below time input range
    const [currentValue, setCurrentValue] = useState(0); // inititlizing state

    //function to convert the 00:00 into number
    const convertToMinutes = () => {
        const [hours, minutes] = zonesTime[i].split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;
        setCurrentValue(totalMinutes);
    };

    //function to convert the number into 00:00 time formate
    const convertToTime = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    //function to convert the time of all zones from number to 00:00 
    const convertAllZonesTime = (newMinutes) => {
        const newTimes = zonesTime.map((time, index) => {
            if (index === i) return convertToTime(newMinutes);
            const data = convertFun(
                convertToTime(newMinutes),
                selectedTimezones[i]?.value,
                selectedTimezones[index]?.value,
            );
            return data;
        });
        setZonesTime(newTimes);
    };

    //function to handle the time when time change through input range slider
    const handleTimeRangeChange = (e) => {
        const newValue = e.target.value;
        setCurrentValue(newValue);

        const mins = parseInt(newValue, 10);
        if (!isNaN(mins)) {
            convertAllZonesTime(mins);
        }
    };

    // Function to get the GMT offset of a specific timezone
    const getGMTOffset = useMemo(()=>{
        const now = moment.tz(selectedTimezones[i].value);
        return now.format('Z');
    },[i])


    //function to convert the the time into number when any zone time change
    useEffect(() => {
        convertToMinutes();
    }, [zonesTime, i]);


    //function to delete any zone from list
    const deleteHandler = () => {
        const index = i;
        const filteredItems = selectedTimezones.filter((_, i) => i !== index);
        const filteredZonesTime = zonesTime.filter((_, i) => i !== index);
        setSelectedTimezones(filteredItems);
        setZonesTime(filteredZonesTime);
    };

    //function to change all zones time when any zone time change
    const handleZoneTimeChange = (selectedTime) => {
        const newTimes = zonesTime.map((time, index) => {
            if (index === i) return selectedTime.value;
            const data = convertFun(
                selectedTime.value,
                selectedTimezones[i]?.value,
                selectedTimezones[index]?.value,
            );
            return data;
        });
        setZonesTime(newTimes);
    };

    //funcion to formate the date in form of Fri 24, 2024
    const formattdDate = useMemo(() => {
        const parsedDate = moment(date, 'YYYY/MM/DD');
        const formattedDate = parsedDate.format('ddd, MMM D');

        return formattedDate;
    }, [date]);

    // Custom component that returns null to remove the dropdown indicator
    const CustomDropdownIndicator = () => null;


    return (
        <div className={styles.sliderCard} ref={refr} {...draggableProps}>
            <div className={styles.crossIcon}><RxCross1 onClick={deleteHandler} className={styles.icon} /></div>
            <div className={styles.dragIcon} {...dragHandleProps}></div>
            <div className={styles.sliderCont}>
                <div className={styles.info}>
                    <div className={styles.left}>
                        <h1>{selectedTimezones[i]?.label?.split('/')[1] ? selectedTimezones[i]?.label?.split('/')[1] : selectedTimezones[i]?.label}</h1>
                        <h4>{selectedTimezones[i]?.label}</h4>
                    </div>
                    <div className={styles.right}>
                        <Select
                            className={styles.timeCont}
                            options={times}
                            value={{ label: zonesTime[i], value: zonesTime[i] }}
                            placeholder={zonesTime[i]}
                            components={{ DropdownIndicator: CustomDropdownIndicator }}
                            onChange={handleZoneTimeChange}
                        />
                        <div className={styles.bottom}>
                            <h4>GMT {getGMTOffset}</h4>
                            <h4>{formattdDate}</h4>
                        </div>
                    </div>
                </div>
                <div className={styles.slider}>
                    <input type="range" onChange={handleTimeRangeChange} value={currentValue} min={0} max={1440} />
                    <div className={styles.steps}>
                        {Array.from({ length: 23 }).map((_, index) => (
                            (index + 1) % 3 === 0 ?
                                <div className={styles.fullLine} key={index}></div> :
                                <div className={styles.halfLine} key={index}></div>
                        ))}
                    </div>
                </div>
                <div className={styles.timeStamp}>
                    {labels.map((t, index) => (
                        <h3 key={index}>{t}</h3>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Slider;
