import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import moment from 'moment-timezone';
import styles from './TimezoneSearch.module.css';
import Slider from '../Slider/Slider';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FaRegCalendarPlus } from "react-icons/fa6";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { PiLinkBold } from "react-icons/pi";
import { IoMoon } from "react-icons/io5";
import PlusComp from '../PlusComp/PlusComp';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const TimezoneConvertor = () => {

  //initiazing stats
  const [selectedTimezones, setSelectedTimezones] = useState([]);
  const [zonesTime, setZonesTime] = useState([]);
  const [date, setDate] = useState(moment().format('YYYY/MM/DD'))
  const [timezoneOptions, setTimeZoneOptions] = useState(moment.tz.names().map((tz) => ({
    value: tz,
    label: tz
  })));


  useEffect(()=>{
    const newTime = {
        value: "indian standart time",
        label: "Indian standard time/IST"
      }

    moment.tz.add(`IST|5:30|0|`)
    setTimeZoneOptions([...timezoneOptions, newTime])

  },[])

  //function to convert the time of one time zone to another
  const convertTimezone = (time, sourceTimezone, destTimezone) => {
    if (!time || !sourceTimezone || !destTimezone) {
      return '';
    }
    const newTime = moment.tz(time, 'HH:mm', sourceTimezone).tz(destTimezone).format('HH:mm');

    return newTime;
  };

  //function to add one time zone in the list
  function handleTimezoneAdd(selectedOption){
    let newItems = [...selectedTimezones, selectedOption];
    setSelectedTimezones(newItems);

    let timeInZone;
    if (zonesTime.length < 1) {
      timeInZone = moment.tz(selectedOption.value).format('HH:mm');
    } else {
      timeInZone = convertTimezone(
        zonesTime[0],
        selectedTimezones[0]?.value,
        selectedOption.value
      );
    }

    setZonesTime([...zonesTime, timeInZone]);
  };


  //function to handle the dragging the component for re-ordering
  const handleDragEnd = (e) => {
    if (!e.destination) return;
    let tempSelectedZones = Array.from(selectedTimezones);
    let tempZonesTime = Array.from(zonesTime);

    let [draggedItem] = tempSelectedZones.splice(e.source.index, 1);
    tempSelectedZones.splice(e.destination.index, 0, draggedItem);
    setSelectedTimezones(tempSelectedZones);

    let [source_data] = tempZonesTime.splice(e.source.index, 1);
    tempZonesTime.splice(e.destination.index, 0, source_data);
    setZonesTime(tempZonesTime);
  };


  //function to handle the date when change
  const inputDateHandler = (e) => {
    const inputDate = e.target.value;
    setDate(inputDate);
  };

  //function to reverse the selectedTimezones by clicking on icon
  const reverseHandler = () => {
    const reversedZonesTime = zonesTime.reverse();
    setZonesTime([...reversedZonesTime])
    const reversedSelectedTimeZones = selectedTimezones.reverse();
    setSelectedTimezones([...reversedSelectedTimeZones])

  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={styles.container}>
        <div className={styles.box}>
          <div className={styles.head}>
            <Select
              className={styles.select}
              options={timezoneOptions}
              onChange={handleTimezoneAdd}
              components={{ DropdownIndicator: PlusComp }}
              placeholder="Select a time zone..."
            />
            <div className={styles.date}>
              <input type="date" value={date} onChange={inputDateHandler} />
            </div>
            <div className={styles.icons}>
              <div><FaRegCalendarPlus /></div>
              <div  onClick={reverseHandler} ><CgArrowsExchangeAltV/></div>
              <CopyToClipboard text='https://timezone-convertor-ataul.netlify.app/' onCopy={() => { alert("Link copied into clipboard") }}>
                <div><PiLinkBold /></div>
              </CopyToClipboard>
              <div><IoMoon /></div>
            </div>
          </div>
          {
            selectedTimezones.length > 0 ?
              <Droppable droppableId="droppable-1">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {selectedTimezones.map((z, i) => (
                      <Draggable key={`${z.value}-${i}`} draggableId={`${z.value}-${i}`} index={i}>
                        {(provided) => (
                          <div >
                            <Slider
                              draggableProps={provided.draggableProps}
                              dragHandleProps={provided.dragHandleProps}
                              zonesTime={zonesTime}
                              setZonesTime={setZonesTime}
                              i={i}
                              selectedTimezones={selectedTimezones}
                              convertFun={convertTimezone}
                              setSelectedTimezones={setSelectedTimezones}
                              date={date}
                              refr={provided.innerRef}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable> :
              <div className={styles.noSelectedZone}>
                <h1>Start by searching and adding time zone, city or town in the search box above</h1>
              </div>
          }
        </div>
      </div>
    </DragDropContext>
  );
};

export default TimezoneConvertor;
