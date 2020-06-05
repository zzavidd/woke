/* eslint-disable jsdoc/require-returns */
import React, { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import { zDate } from 'zavid-modules';

import { alert } from '@components/alert.js';
import { SubmitButton, CancelButton } from '@components/button.js';
import { Group, Select, TextInput } from '@components/form.js';
import { Modal } from '@components/modal.js';

import { creationDate } from '@constants/settings.js';

import css from '@styles/components/Form.module.scss';

import { Icon } from './icon';

export const DatePicker = ({
  date,
  placeholderText,
  minDate,
  maxDate,
  withDayOfWeek,
  name,
  onConfirm
}) => {
  const {
    day: initialDay,
    month: initialMonth,
    year: initialYear
  } = extractDates(date);
  const [stateDay, setDay] = useState(initialDay);
  const [stateMonth, setMonth] = useState(initialMonth);
  const [stateYear, setYear] = useState(initialYear);
  const [visible, setModalVisibility] = useState(false);

  useEffect(() => {
    setDay(initialDay);
    setMonth(initialMonth);
    setYear(initialYear);
  }, [visible]);

  /** Update component dates on confirmation */
  const confirmDateSelection = () => {
    let day = stateDay;
    let month = stateMonth;
    let year = stateYear;

    if (!day) return alert.error('Please set the day of the month.');
    if (!month) return alert.error('Please set month of the year.');
    if (!year) return alert.error('Please set the year.');

    month = zDate.MONTHS[month.toUpperCase()].NUMBER - 1;
    day = parseInt(day.replace(/([0-9]+)(.*)/g, '$1'));

    const date = new Date(year, month, day);
    onConfirm(date, name);
    setModalVisibility(false);
  };

  /** Clear the date */
  const clearDate = () => {
    onConfirm(null, name);
  };

  const startYear = minDate && minDate.getFullYear();
  const endYear = maxDate && maxDate.getFullYear();

  const body = (
    <Group className={css['datepicker-modal']}>
      <Col xs={3}>
        <Select
          name={'day'}
          value={stateDay}
          items={zDate.getDatesForMonth(stateMonth)}
          placeholder={'DD'}
          onChange={(event) => setDay(event.target.value)}
        />
      </Col>
      <Col xs={6}>
        <Select
          name={'month'}
          value={stateMonth}
          items={zDate.getAllMonths()}
          placeholder={'MMMM'}
          onChange={(event) => setMonth(event.target.value)}
        />
      </Col>
      <Col xs={3}>
        <Select
          name={'year'}
          value={stateYear}
          items={zDate.getYearsInRange(startYear, endYear)}
          placeholder={'YYYY'}
          onChange={(event) => setYear(event.target.value)}
        />
      </Col>
    </Group>
  );

  const footer = (
    <>
      <SubmitButton onClick={confirmDateSelection}>Confirm</SubmitButton>
      <CancelButton onClick={() => setModalVisibility(false)}>
        Close
      </CancelButton>
    </>
  );

  return (
    <>
      <div className={css['datepicker-field']}>
        <button
          onClick={() => setModalVisibility(true)}
          className={css['datepicker']}>
          <Icon
            prefix={'far'}
            name={'calendar-alt'}
            className={css['calendar-icon']}
          />
          <TextInput
            value={date ? zDate.formatDate(date, withDayOfWeek) : null}
            placeholder={placeholderText}
            style={{ textAlign: 'left' }}
            className={css['datepicker-text-input']}
            readOnly
          />
        </button>
        <button onClick={clearDate} className={css['invisible_button']}>
          <Icon name={'times'} />
        </button>
      </div>

      <Modal show={visible} body={body} footer={footer} onlyBody={true} />
    </>
  );
};

export const EventDatePicker = ({ name, date, onConfirm }) => {
  return (
    <DatePicker
      name={name}
      date={date}
      onConfirm={onConfirm}
      placeholderText={'Select a date.'}
      minDate={creationDate}
      withDayOfWeek
    />
  );
};

export const BirthdayPicker = ({ name, date, onConfirm }) => {
  return (
    <DatePicker
      name={name}
      date={date}
      onConfirm={onConfirm}
      placeholderText={'Select date of birth.'}
      maxDate={new Date()}
    />
  );
};

export const AuthoredDatePicker = ({ name, date, onConfirm }) => {
  return (
    <DatePicker
      name={name}
      date={date}
      onConfirm={onConfirm}
      placeholderText={'Select the date written.'}
      minDate={creationDate}
      maxDate={new Date()}
      withDayOfWeek
    />
  );
};

/**
 * Extract the day, month and year from a specified date.
 * @param {Date} date - The specified date.
 * @returns {object[]} The day, month and year.
 */
const extractDates = (date) => {
  let day, month, year;

  if (date !== null) {
    date = new Date(date);
    const dayNum = date.getDate();
    const monthNum = date.getMonth() + 1;

    day = zDate.getDateAndSuffix(dayNum);
    month = zDate.getMonthByNumber(monthNum);
    year = date.getFullYear();
  }

  return { day, month, year };
};
