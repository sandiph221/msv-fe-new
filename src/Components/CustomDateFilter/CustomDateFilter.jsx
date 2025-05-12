import React, { useEffect } from 'react';
import { DateRangePicker } from 'materialui-daterange-picker';
import { DateTime } from 'luxon';
import { Button } from '@mui/material';
import { CustomButton } from '../CustomButton/CustomButton';
import { withRouter } from 'react-router-dom';

const CustomDateFilter = (props) => {
  const [dateRange, setDateRange] = React.useState({});
  const [initialDateRange, setInitialDateRange] = React.useState({});

  useEffect(() => {
    props.getSelectedDateRange(dateRange);
  }, [dateRange]);

  const onChange = (range) => {
    setInitialDateRange(range);
  };

  const handleDateChange = () => {
    if (initialDateRange) {
      setDateRange(initialDateRange);
    }
    props.setCustomDate(!props.customDate);
  };

  const toggle = () => props.setCustomDate(!props.customDate);
  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: props.location.pathname === '/contact-support' ? '20px' : '100%',
      }}
    >
      <DateRangePicker
        toggle={toggle}
        open={props.customDate}
        onChange={(range) => onChange(range)}
        closeOnClickOutside={true}
        initialDateRange={{
          startDate: DateTime.now().minus({ month: 1 }).toISODate(),
          endDate: DateTime.now().toISODate(),
        }}
        minDate={DateTime.now().minus({ year: 1 }).toISODate()}
      />
      {props.customDate && (
        <div
          style={{
            position: 'absolute',
            bottom: 25,
            right: '8%',
            zIndex: 999999,
          }}
        >
          <CustomButton
            defaultBackgroundColor
            onClick={handleDateChange}
          >
            Apply
          </CustomButton>
        </div>
      )}
    </div>
  );
};

export default withRouter(CustomDateFilter);
