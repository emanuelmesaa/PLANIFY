// src/pages/CalendarioPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import './CalendarioPage.css';

const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const DAY_NAMES_HEADER = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState('');
  const [selectedImportance, setSelectedImportance] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  const getProjectDeadlineDates = useCallback(() => { 
    const proyectos = JSON.parse(localStorage.getItem('proyectos')) || []; 
    const projectDates = {}; 
    proyectos.forEach(proyecto => { 
      if (proyecto.fechaLimite) { 
        const [year, month, day] = proyecto.fechaLimite.split('-'); 
        const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`; 
        projectDates[dateKey] = { text: `Límite: ${proyecto.nombre}`, color: 'bg-red-500', isProjectDeadline: true, }; 
      } 
    }); 
    return projectDates; 
  }, []);

  useEffect(() => { 
    const storedMarkedDates = JSON.parse(localStorage.getItem('markedCalendarDates')) || {}; 
    const projectDates = getProjectDeadlineDates(); 
    setMarkedDates({ ...storedMarkedDates, ...projectDates }); 
  }, [getProjectDeadlineDates]);

  useEffect(() => { 
    const manualDates = {}; 
    for (const dateKey in markedDates) { 
      if (markedDates[dateKey] && !markedDates[dateKey].isProjectDeadline) { 
        manualDates[dateKey] = markedDates[dateKey]; 
      } 
    } 
    localStorage.setItem('markedCalendarDates', JSON.stringify(manualDates)); 
  }, [markedDates]);

  useEffect(() => { 
    const handleStorageChange = () => { 
      const projectDates = getProjectDeadlineDates(); 
      setMarkedDates(prev => { 
        const newMarkedDates = {...prev}; 
        for (const dateKey in projectDates) { 
          newMarkedDates[dateKey] = projectDates[dateKey]; 
        } 
        return newMarkedDates; 
      }); 
    }; 
    window.addEventListener('storage', handleStorageChange); 
    handleStorageChange(); 
    return () => window.removeEventListener('storage', handleStorageChange); 
  }, [getProjectDeadlineDates]);

  const generateCalendarGrid = (year, monthIndex) => { 
    const firstDayDate = new Date(year, monthIndex, 1); 
    let dayOfWeekOfFirst = firstDayDate.getDay(); 
    dayOfWeekOfFirst = (dayOfWeekOfFirst === 0) ? 6 : dayOfWeekOfFirst - 1; 
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate(); 
    const grid = []; 
    let day = 1; 
    for (let i = 0; i < 6; i++) { 
      const week = []; 
      for (let j = 0; j < 7; j++) { 
        if (i === 0 && j < dayOfWeekOfFirst) { 
          week.push({ key: `empty-${i}-${j}-${year}-${monthIndex}`, isEmpty: true }); 
        } else if (day <= daysInMonth) { 
          const dateKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`; 
          week.push({ key: dateKey, day, month: monthIndex + 1, year, event: markedDates[dateKey] }); 
          day++; 
        } else { 
          week.push({ key: `empty-fill-${i}-${j}-${year}-${monthIndex}`, isEmpty: true }); 
        } 
      } 
      grid.push(week); 
      if (day > daysInMonth) break; 
    } 
    return grid; 
  };

  const handleDateFormSubmit = (e) => { 
    e.preventDefault(); 
    if (!selectedDeliveryDate || !selectedImportance) { 
      alert("Por favor, selecciona una fecha y una importancia."); 
      return; 
    } 
    const [year, month, day] = selectedDeliveryDate.split('-'); 
    const dateKey = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`; 
    let importanceText = '', colorClass = ''; 
    if (selectedImportance === 'yellow') { 
      importanceText = 'Entrega (Media)'; colorClass = 'bg-yellow-400'; 
    } else if (selectedImportance === 'red') { 
      importanceText = 'Entrega (Alta)'; colorClass = 'bg-red-500'; 
    } else if (selectedImportance === 'green') { 
      importanceText = 'Entregado'; colorClass = 'bg-green-500'; 
    } 
    setMarkedDates(prev => ({ ...prev, [dateKey]: { text: importanceText, color: colorClass, isProjectDeadline: false } })); 
    setShowModal(false); 
    setSelectedDeliveryDate(''); 
    setSelectedImportance(''); 
  };

  const renderCalendarForMonth = (year, monthIndex) => { 
    let displayYear = year, displayMonthIndex = monthIndex; 
    if (displayMonthIndex > 11) { 
      displayYear += Math.floor(displayMonthIndex / 12); 
      displayMonthIndex %= 12; 
    } else if (displayMonthIndex < 0) { 
      displayYear += Math.floor(displayMonthIndex / 12); 
      displayMonthIndex = (displayMonthIndex % 12 + 12) % 12; 
    } 
    const calendarGrid = generateCalendarGrid(displayYear, displayMonthIndex); 
    return ( 
      <div className="month-wrapper" key={`${displayYear}-${displayMonthIndex}`}> 
        <h2 className="month-header">{MONTH_NAMES[displayMonthIndex]} {displayYear}</h2> 
        <div className="calendar-table-wrapper"> 
          <table className="calendar-table">
            <thead>
              <tr>{DAY_NAMES_HEADER.map(dayName => <th key={dayName}>{dayName}</th>)}</tr>
            </thead>
            <tbody>
              {calendarGrid.map((week, weekIndex) => (
                <tr key={weekIndex}>
                  {week.map(cell => (
                    <td key={cell.key} className={`date-cell ${cell.isEmpty ? 'empty-cell' : ''} ${cell.event ? cell.event.color : ''}`}>
                      {!cell.isEmpty && (
                        <>
                          <span className="day-number">{cell.day}</span>
                          {cell.event && <span className="event-text">{cell.event.text}</span>}
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> 
    ); 
  };

  return (
    <div className="calendario-page-wrapper"> 
      <Navbar /> 
      <div className="calendario-content-area"> 
        <header className="page-header-calendario">
          <h1>Calendario del Mes</h1>
          <div className="add-date-button-container">
            <button onClick={() => setShowModal(true)} className="add-date-button">Agregar fecha de entrega</button>
          </div>
        </header>
        <main className="calendario-page-main">
          <div className="calendars-wrapper">
            {renderCalendarForMonth(currentDate.getFullYear(), currentDate.getMonth())}
            {renderCalendarForMonth(currentDate.getFullYear(), currentDate.getMonth() + 1)}
          </div>
        </main>
      </div>
      {showModal && (
        <div className="modal-overlay-calendar">
          <div className="modal-content-calendar">
            <h2>Selecciona la fecha de entrega</h2>
            <form onSubmit={handleDateFormSubmit}>
              <label htmlFor="deliveryDate">Fecha de entrega:</label>
              <input type="date" id="deliveryDate" value={selectedDeliveryDate} onChange={(e) => setSelectedDeliveryDate(e.target.value)} required />
              <div className="importance-selector">
                <p>Importancia:</p>
                <div className="importance-buttons">
                  <button type="button" onClick={() => setSelectedImportance('yellow')} className="btn-priority-medium">Media</button>
                  <button type="button" onClick={() => setSelectedImportance('red')} className="btn-priority-high">Alta</button>
                  <button type="button" onClick={() => setSelectedImportance('green')} className="btn-priority-delivered">Entregado</button>
                </div>
                {selectedImportance && 
                  <p>Seleccionado: <span style={{fontWeight:'bold', color: selectedImportance === 'yellow' ? '#ca8a04' : selectedImportance }}>{selectedImportance.charAt(0).toUpperCase() + selectedImportance.slice(1)}</span></p>
                }
              </div>
              <div className="modal-action-buttons">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">Cancelar</button>
                <button type="submit" className="btn-save">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default CalendarioPage;