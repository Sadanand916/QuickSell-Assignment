import React, { useState, useEffect } from 'react';
import './App.css';
import  Highp from './assets/icons_FEtask/Img - High Priority.svg';
import  Midp from './assets/icons_FEtask/Img - Medium Priority.svg';
import  Lowp from './assets/icons_FEtask/Img - Low Priority.svg';
import  Nop from './assets/icons_FEtask/No-priority.svg';
import  Urgentp from './assets/icons_FEtask/SVG - Urgent Priority colour.svg';
import  addp from './assets/icons_FEtask/add.svg';
import  threedotp from './assets/icons_FEtask/3 dot menu.svg';
import  todo from './assets/icons_FEtask/To-do.svg';
import  inprogrees from './assets/icons_FEtask/in-progress.svg';
import  backlog from './assets/icons_FEtask/Backlog.svg';
import  doneIcon from './assets/icons_FEtask/Done.svg';
import  cancelledIcon from './assets/icons_FEtask/Cancelled.svg';

import avatar from "./assets/icons_FEtask/face-young-man-in-frame-circular-avatar-character-vector-28828812.jpg"

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState(localStorage.getItem('groupBy') || 'status');
  const [sortBy, setSortBy] = useState(localStorage.getItem('sortBy') || 'priority');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        setTickets(data.tickets);
        setUsers(data.users);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
  useEffect(() => {
    localStorage.setItem('groupBy', groupBy);
    localStorage.setItem('sortBy', sortBy);
  }, [groupBy, sortBy]);

  
  const groupTickets = (tickets, groupBy) => {
    switch (groupBy) {
      case 'user':
        return tickets.reduce((acc, ticket) => {
          const user = users.find((user) => user.id === ticket.userId);
          const userName = user ? user.name : 'Unassigned';
          acc[userName] = [...(acc[userName] || []), ticket];
          return acc;
        }, {});
      case 'priority':
        return tickets.reduce((acc, ticket) => {
          acc[ticket.priority] = [...(acc[ticket.priority] || []), ticket];
          return acc;
        }, {});
      default:
        return tickets.reduce((acc, ticket) => {
          acc[ticket.status] = [...(acc[ticket.status] || []), ticket];
          return acc;
        }, {});
    }
  };

  
  const sortedTickets = (tickets, sortBy) => {
    return [...tickets].sort((a, b) => {
      if (sortBy === 'priority') {
        return b.priority - a.priority;
      }
      return a.title.localeCompare(b.title);
    });
  };

  const countTicketsInGroup = (group) => {
    return group.length;
  };

  if (loading) {
    return <div>Loading tickets...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const groupedTickets = groupTickets(sortedTickets(tickets, sortBy), groupBy);

  return (
    <div className="kanban-board">
     <header className='header'>
      <div className="controls">
      <div className='Dropbtt'>
        <div onClick={toggleDropdown} className="dropbtn">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 10.5C9.63261 10.5 9.75979 10.5527 9.85355 10.6464C9.94732 10.7402 10 10.8674 10 11V14C10 14.1326 9.94732 14.2598 9.85355 14.3536C9.75979 14.4473 9.63261 14.5 9.5 14.5H8.5C8.36739 14.5 8.24021 14.4473 8.14645 14.3536C8.05268 14.2598 8 14.1326 8 14V11C8 10.8674 8.05268 10.7402 8.14645 10.6464C8.24021 10.5527 8.36739 10.5 8.5 10.5H9.5ZM7 11.5V13H1.75C1.55109 13 1.36032 12.921 1.21967 12.7803C1.07902 12.6397 1 12.4489 1 12.25C1 12.0511 1.07902 11.8603 1.21967 11.7197C1.36032 11.579 1.55109 11.5 1.75 11.5H7ZM14.25 11.5C14.4489 11.5 14.6397 11.579 14.7803 11.7197C14.921 11.8603 15 12.0511 15 12.25C15 12.4489 14.921 12.6397 14.7803 12.7803C14.6397 12.921 14.4489 13 14.25 13H11V11.5H14.25ZM5.5 6C5.63261 6 5.75979 6.05268 5.85355 6.14645C5.94732 6.24021 6 6.36739 6 6.5V9.5C6 9.63261 5.94732 9.75979 5.85355 9.85355C5.75979 9.94732 5.63261 10 5.5 10H4.5C4.36739 10 4.24021 9.94732 4.14645 9.85355C4.05268 9.75979 4 9.63261 4 9.5V6.5C4 6.36739 4.05268 6.24021 4.14645 6.14645C4.24021 6.05268 4.36739 6 4.5 6H5.5ZM3 7.25V8.75H1.75C1.55109 8.75 1.36032 8.67098 1.21967 8.53033C1.07902 8.38968 1 8.19891 1 8C1 7.80109 1.07902 7.61032 1.21967 7.46967C1.36032 7.32902 1.55109 7.25 1.75 7.25H3ZM14.25 7.25C14.4489 7.25 14.6397 7.32902 14.7803 7.46967C14.921 7.61032 15 7.80109 15 8C15 8.19891 14.921 8.38968 14.7803 8.53033C14.6397 8.67098 14.4489 8.75 14.25 8.75H7V7.25H14.25ZM11.5 1.75C11.6326 1.75 11.7598 1.80268 11.8536 1.89645C11.9473 1.99021 12 2.11739 12 2.25V5.25C12 5.38261 11.9473 5.50979 11.8536 5.60355C11.7598 5.69732 11.6326 5.75 11.5 5.75H10.5C10.3674 5.75 10.2402 5.69732 10.1464 5.60355C10.0527 5.50979 10 5.38261 10 5.25V2.25C10 2.11739 10.0527 1.99021 10.1464 1.89645C10.2402 1.80268 10.3674 1.75 10.5 1.75H11.5ZM9 3V4.5H1.75C1.55109 4.5 1.36032 4.42098 1.21967 4.28033C1.07902 4.13968 1 3.94891 1 3.75C1 3.55109 1.07902 3.36032 1.21967 3.21967C1.36032 3.07902 1.55109 3 1.75 3H9ZM14.25 3C14.4489 3 14.6397 3.07902 14.7803 3.21967C14.921 3.36032 15 3.55109 15 3.75C15 3.94891 14.921 4.13968 14.7803 4.28033C14.6397 4.42098 14.4489 4.5 14.25 4.5H13V3H14.25Z" fill="#5C5C5E"/>
</svg>

          <b>Display</b>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.99583 12.75C9.89583 12.75 9.80208 12.7326 9.71458 12.6979C9.62708 12.6632 9.5486 12.6111 9.47916 12.5416L5.52791 8.59038C5.37041 8.43288 5.29513 8.25343 5.30208 8.05204C5.30902 7.85065 5.38888 7.67357 5.54166 7.52079C5.69444 7.36801 5.87152 7.29163 6.07291 7.29163C6.2743 7.29163 6.45138 7.36801 6.60416 7.52079L9.99999 10.9375L13.4167 7.52079C13.5694 7.36801 13.7465 7.2951 13.9479 7.30204C14.1493 7.30899 14.3264 7.38885 14.4792 7.54163C14.6319 7.6944 14.7083 7.87149 14.7083 8.07288C14.7083 8.27426 14.6296 8.45329 14.4721 8.60996L10.5208 12.5416C10.4458 12.6111 10.3646 12.6632 10.2771 12.6979C10.1896 12.7326 10.0958 12.75 9.99583 12.75Z" fill="#535961"/>
</svg>
          </div>
          </div>
          <div>
        {isDropdownOpen && (
          <div className="dropdown-content">
            <div className="Grouping">
              <label>Grouping</label>
              <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                <option value="status">Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            <div className="Sorting">
              <label>Sorting</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
            </div>
            
        )}
        </div>
        </div>
        </header>
         
      
  

<div className="board">
  {Object.keys(groupedTickets).map((group) => (
    <div key={group} className="column">
      <h4>
        
                 {groupBy === 'priority' && (
          <>
            {group == 0 && (
              <>
             <div className='Eachheading'>

              <span>
                <img src={Nop} alt="No Priority" /> No Priority <span className='Prioritycount'>{countTicketsInGroup(groupedTickets[group])} </span>
                </span>
                <span>
                   <img src={addp} alt="Add" className="icon" />
                   <img src={threedotp} alt="More Options" className="icon" />
                </span>
                </div>
              </>
            )}
            
             {group == 4 && (
              <>
              <div className='Eachheading'>
              <span>
                <img src={Urgentp} alt="Urgent Priority" /> Urgent  <span className='Prioritycount'>{countTicketsInGroup(groupedTickets[group])}</span>
                </span>
                <span>
                   <img src={addp} alt="Add" className="icon" />
                   <img src={threedotp} alt="More Options" className="icon" />
                </span>
                </div>
              </>
            )}
            
            
            {group == 3 && (
              <>
              <div className='Eachheading'>
                <span>
                <img src={Highp} alt="High Priority" /> High  <span className='Prioritycount'>{countTicketsInGroup(groupedTickets[group])}</span>
                </span>
                <span>
                   <img src={addp} alt="Add" className="icon" />
                   <img src={threedotp} alt="More Options" className="icon" />
                </span>
                </div>
              </>
            )}
            {group == 2 && (
              <>
               <div className='Eachheading'>
                <span>
                <img src={Midp} alt="Medium Priority" /> Medium  <span className='Prioritycount'>{countTicketsInGroup(groupedTickets[group])}</span>
                </span>
                <span>
                   <img src={addp} alt="Add" className="icon" />
                   <img src={threedotp} alt="More Options" className="icon" />
                </span>
                </div>
              </>
            )}
           
            {group == 1 && (
              <>
              <div className='Eachheading'>
                <span>
                <img src={Lowp} alt="Low Priority" /> Low  <span className='Prioritycount'>{countTicketsInGroup(groupedTickets[group])}
                </span>
                </span>
                <span>
                   <img src={addp} alt="Add" className="icon" />
                   <img src={threedotp} alt="More Options" className="icon" />
                </span>
                </div>
              </>
            )}
          </> 
        )}
        
        </h4>
      <h4>
        
        {groupBy === 'status' && (
          <>
            {group === 'Todo' && (
              <>
               <div className='Eachheading'>
                <span>
                <img src={todo} alt="todo" /> Todo <span className='Prioritycount'>{countTicketsInGroup(groupedTickets[group])} </span>
                </span>
                <span>
                   <img src={addp} alt="Add" className="icon" />
                   <img src={threedotp} alt="More Options" className="icon" />
                </span>
                </div>
              </>
            )}
            {group === 'In progress' && (
              <>
              <div className='Eachheading'>
              <span>
                <img src={inprogrees} alt="In progress" /> In progress <span className='Prioritycount'>{countTicketsInGroup(groupedTickets[group])}</span>
                </span>
                <span>
                   <img src={addp} alt="Add" className="icon" />
                   <img src={threedotp} alt="More Options" className="icon" />
                </span>
                </div>
              </>
            )}
            {group === 'Backlog' && (
              <>
              <div className='Eachheading'>
              <span>
                <img src={backlog} alt="Backlog" /> Backlog <span className='Prioritycount'>{countTicketsInGroup(groupedTickets[group])}</span>
                </span>
                <span>
                   <img src={addp} alt="Add" className="icon" />
                   <img src={threedotp} alt="More Options" className="icon" />
                </span>
                </div>
              </>
            )}
            {/* Always include Done and Cancelled status columns */}
            {group === 'Done' && (
              <>
              
                <img src={doneIcon} alt="Done" /> Done <span className='Prioritycount'>{countTicketsInGroup(groupedTickets[group])}</span>
                
              </>
            )}
            {group === 'Cancelled' && (
              <>
                <img src={cancelledIcon} alt="Cancelled" /> Cancelled <span className='Prioritycount'>{countTicketsInGroup(groupedTickets[group])}</span>
              </>
            )}
          </>
        )}
      </h4>

       <h4>
   {groupBy === 'user' && (
    <>
    <div className='Userheading'>
    <span className='InsideUserheading'>
    <span><img className='image-avt' src={avatar} alt="avt"/></span>
      <span className="group-name">{group}</span>
      <span className="Prioritycount"> {countTicketsInGroup(groupedTickets[group])}</span>
      </span>
                <span>
                   <img src={addp} alt="Add" className="icon" />
                   <img src={threedotp} alt="More Options" className="icon" />
                </span>
                </div>
    </>
  )}
  
</h4>

                 



    
      {groupedTickets[group] ? (
        groupedTickets[group].map((ticket) => (
          <div key={ticket.id} className="ticket">
            <div className="cam-id">
                <div>
                 {ticket.id}
                 </div>
                 {(groupBy === 'status' || groupBy === 'priority') &&(
                 <div><img className='image-avt' src={avatar} alt="avt"/></div>)}
            </div>
             <div className='Statussymbol'>
            {(groupBy === 'priority' || groupBy === 'user') && (
            <span className={`priority priority-${ticket.status}`}>
              {ticket.status === 'Backlog' && <img src={backlog} alt="Backlog" />}
              {ticket.status === 'In progress' && <img src={inprogrees} alt="In progress" />}
              {ticket.status === 'Todo' && <img src={todo} alt="Todo" />}
              {/* {ticket.priority === 1 && <img src={Lowp} alt="Low " />}
              {ticket.priority === 2 && <img src={Midp} alt="Medium " />} */}
             
             </span>
             
            )}
             <h4 className='Titleof'>{ticket.title}</h4>
             </div>
            
            {(groupBy === 'status' || groupBy === 'user') && (
            <span className={`priority priority-${ticket.priority}`}>
              {ticket.priority === 0 && <img src={Nop} alt="No Priority" />}
              {ticket.priority === 4 && <img src={Urgentp} alt="Urgent Priority" />}
              {ticket.priority === 3 && <img src={Highp} alt="High Priority" />}
              {ticket.priority === 1 && <img src={Lowp} alt="Low " />}
              {ticket.priority === 2 && <img src={Midp} alt="Medium " />}
             
            </span>
            )}
            <span className='FeatureRequest'><span className='InsideFeature'>&#8226;</span>
            Feature Request</span>
            <div className="user">
              {/* Optionally display user information here */}
            </div>
          </div>
        ))
      ) : (
        
        <div className="no-tickets">No tickets available</div>
      )}
    </div>
  ))}

  {/* Ensure Done and Cancelled columns are always shown */}
  {groupBy === 'status' && !groupedTickets['Done'] && (
    <div className="column">
      <h4>
      
      <div className='Doneheading'>
      <span>     
        <img src={doneIcon} alt="Done" /> Done <span className='Prioritycount'>0</span>
        </span>
                <span>
                   <img src={addp} alt="Add" className="icon" />
                   <img src={threedotp} alt="More Options" className="icon" />
                </span>
                </div>
      </h4>
      <div className="no-tickets"></div>
    </div>
  )}
  {groupBy === 'status' && !groupedTickets['Cancelled'] && (
    <div className="column">
      <h4>
      <div className='Doneheading'>
      <span>  
        <img src={cancelledIcon} alt="Cancelled" /> Cancelled <span className='Prioritycount'>0</span>
        </span>
                <span>
                   <img src={addp} alt="Add" className="icon" />
                   <img src={threedotp} alt="More Options" className="icon" />
                </span>
                </div>
      </h4>
      <div className="no-tickets"></div>
    </div>
  )}
</div>


    </div>
  );
};

export default App;



