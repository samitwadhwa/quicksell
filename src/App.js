import "./index.css"; // Import your CSS file
import { useState, useEffect } from "react";
import Card from "./Card";
import threeDotMenu from "./assets/images/3DotMenu.svg";
import addIcon from "./assets/images/add.svg";
import pending from "./assets/images/in-progress.svg";
import backlog from "./assets/images/Backlog.svg";
import todo from "./assets/images/To-do.svg";
import cancelled from "./assets/images/Cancelled.svg";
import high from './assets/images/High.svg';
import Low from './assets/images/Low.svg';
import Medium from './assets/images/Medium.svg';
import urgent from './assets/images/Urgentcolor.svg';
import noPriority from './assets/images/noPriority.svg';
import Display from './assets/images/Display.svg';
import down from './assets/images/down.svg';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGroupingDropdownOpen, setIsGroupingDropdownOpen] = useState(false);
  const [isOrderingDropdownOpen, setIsOrderingDropdownOpen] = useState(false);

  // Get saved user preferences for grouping and ordering from localStorage
  const [grouping, setGrouping] = useState(
    () => localStorage.getItem("grouping")
  );
  const [ordering, setOrdering] = useState(
    () => localStorage.getItem("ordering") 
  );

  // Fetch tickets from the API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          "https://api.quicksell.co/v1/internal/frontend-assignment"
        );
        const data = await response.json();
        
        setUsers(data.users);
        setTickets(data.tickets); 
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      }
    };
    fetchTickets();
  }, []);
  

  // Save the current grouping and ordering preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("grouping", grouping);
  }, [grouping]);

  useEffect(() => {
    localStorage.setItem("ordering", ordering);
  }, [ordering]);

  const handleGroupingClick = () => {
    setIsGroupingDropdownOpen(!isGroupingDropdownOpen);
    setIsOrderingDropdownOpen(false);
  };

  const handleOrderingClick = () => {
    setIsOrderingDropdownOpen(!isOrderingDropdownOpen);
    setIsGroupingDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".dropdown")) {
      setIsDropdownOpen(false);
      setIsGroupingDropdownOpen(false);
      setIsOrderingDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  


  // Group tickets based on the selected grouping option
  const groupTickets = (tickets, grouping) => {
    const grouped = {};
    tickets.forEach((ticket) => {
      let key;
      switch (grouping) {
        case "User":
          key = ticket.user;
          break;
        case "Priority":
          key = ticket.priority;
          break;
        case "Status":
        default:
          key = ticket.status;
      }
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(ticket);
    });
    return grouped;
  };
  console.log(ordering);
  

  // Sort tickets based on the selected ordering option
  const sortTickets = (tickets, ordering) => {
    return tickets.sort((a, b) => {
      if (ordering === "Priority") {
        return b.priority - a.priority;
      } else if (ordering === "Title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  // Apply grouping and sorting to the tickets
  const groupedTickets = groupTickets(tickets, grouping);
  const sortedGroupedTickets = {};
  Object.keys(groupedTickets).forEach((key) => {
    sortedGroupedTickets[key] = sortTickets(groupedTickets[key], ordering);
  });

  return (
    <div className="app-container">
      <div className="dropdown">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="dropdown-button"
        >
          <img src={Display} alt="" />
          Display
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-section">
              <span >Grouping</span>
          
            <div className="toggle-options">

              <button onClick={handleGroupingClick} className="dropdown-toggle">
                  {grouping}
                  <img src={down} alt="" />
                </button>
                {isGroupingDropdownOpen && (
                  <div className="dropdown-options">
                    <button
                      onClick={() => {
                        setGrouping("Status");
                        setIsGroupingDropdownOpen(false);
                      }}
                    >
                      Status
                     
                    </button>
                    <button
                      onClick={() => {
                        setGrouping("Priority");
                        setIsGroupingDropdownOpen(false);
                      }}
                    >
                      Priority
                     
                    </button>
                    <button
                      onClick={() => {
                        setGrouping("User");
                        setIsGroupingDropdownOpen(false);
                      }}
                    >
                      User
                    </button>
                  </div>
                )}
            </div>
            </div>
            <div className="dropdown-section">
             
            <span>Ordering</span>
            
            <div className="toggle-options">

              <button onClick={handleOrderingClick} className="dropdown-toggle">
                  {ordering}
                  <img src={down} alt="" />
                </button>
                {isOrderingDropdownOpen && (
                  <div className="dropdown-options">
                    <button
                      onClick={() => {
                        setOrdering("Priority");
                        setIsOrderingDropdownOpen(false);
                      }}
                    >
                      Priority
                    </button>
                    <button
                      onClick={() => {
                        setOrdering("Title");
                        setIsOrderingDropdownOpen(false);
                      }}
                    >
                      Title
                    </button>
                  </div>
                )}
            </div>
            </div>
          </div>
        )}
      </div>
      <div className="kanban-board">
       {/* { console.log(Object.keys(sortedGroupedTickets))} */}
        
        {Object.keys(sortedGroupedTickets).map((group) => (
          <div key={group} className="kanban-column">
            <div
              className="group-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              { 
                grouping === 'Status' ? 

                <div style={{ display: "flex", gap: "10px" }}>
                {group === "In progress" ? (
                  <>
                    <img src={pending} alt="pending" />
                    <span>{group}</span>
                  </>
                ) : group === "Todo" ? (
                  <>
                    <img src={todo} alt="todo" />
                    <span>{group}</span>
                  </>
                ) : group === "Backlog" ? ( // Add condition for "backlog"
                  <>
                    <img src={backlog} alt="backlog" />
                    <span>{group}</span>
                  </>
                ) : (
                  <>
                    <img src={cancelled} alt="cancelled" />{" "}
                    {/* Add default image */}
                    <span>{group}</span>
                  </>
                )}
              </div> :
             ( grouping == 'Priority' ?

              
              <div style={{ display: "flex", gap: "10px" }}>
                {group == 0 ? (
                  <>
                    <img src={noPriority} alt="pending" />
                    <span>No Priority</span>
                    <span>{group}</span>
                  </>
                ) : group == 1 ? (
                  <>
                    <img src={urgent} alt="todo" />
                    <span>Urgent</span>
                    <span>{group}</span>
                  </>
                ) : group == 2 ? ( // Add condition for "backlog"
                  <>
                    <img src={Medium} alt="backlog" />
                    <span>Medium</span>
                    <span>{group}</span>
                  </>
                ) : group == 3 ? ( // Add condition for "backlog"
                  <>
                    <img src={Medium} alt="backlog" />
                    <span>Medium</span>
                    <span>{group}</span>
                  </>
                ) 
                
              : group == 4 ? (
                <>
                    <img src={high} alt="backlog" />
                    <span>High</span>
                    <span>{group}</span>
                  </>
              )
              : 
              group == 5 ? (
                <>
                    <img src={high} alt="backlog" />
                    <span>High</span>
                    <span>{group}</span>
                  </>
              )
              : null
              }
              </div>
        : null
              )
             
            }
              <div>
                <img src={addIcon} alt="add" />
                <img src={threeDotMenu} alt="3dot" />
              </div>
            </div>
            <div className="card-list">
              {sortedGroupedTickets[group]?.map((ticket) => (
                <Card
                  key={ticket.id}
                  title={ticket.title}
                  id={ticket.id}
                  tag={ticket.tag}
                  user={ticket.userId}
                  priority={ticket.priority}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
