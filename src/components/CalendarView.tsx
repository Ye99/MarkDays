import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarView.css';
import { useDayTracker } from '../hooks/useDayTracker';
import { MARKED_DAY_CSS_CLASS } from '../constants/storage';

const CalendarView: React.FC = () => {
  const { markedDays, toggleDay, isLoading, error } = useDayTracker();

  const tileClassName = ({ date }: { date: Date; view: string }) => {
    if (markedDays.has(date.toDateString())) {
      return MARKED_DAY_CSS_CLASS;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div>
        <h1>Mark Days</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Mark Days</h1>
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          Error: {error}
        </div>
      )}
      <Calendar
        onClickDay={toggleDay}
        tileClassName={tileClassName}
      />
      <p>Click on a day to mark it as completed.</p>
      
      <div className="legend">
        <h3>Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color unmarked-day"></div>
            <span>Unmarked day</span>
          </div>
          <div className="legend-item">
            <div className="legend-color marked-day"></div>
            <span>Marked day</span>
          </div>
          <div className="legend-item">
            <div className="legend-color today-day"></div>
            <span>Today</span>
          </div>
          <div className="legend-item">
            <div className="legend-color today-marked-day"></div>
            <span>Today (marked)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView; 