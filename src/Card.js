import noPriority from './assets/images/noPriority.svg';
import high from './assets/images/High.svg';
const Card = ({ title, id, tag, user , priority }) => {
  // Define the status based on the user
  const isActive = user === "usr-1"; // Check if the user is "user_1"
  const statusColor = isActive ? "#0bbb0b" : (user === "usr-2" ? "rgb(217 217 23)" : "grey"); // Assign colors based on user

  return (
    <div className="card">
      <div className="card-header">
        <span>{id}</span>
        <img src={`https://placehold.co/24x24?text=${user}`} alt="User  avatar" className="avatar" />
      <div className="status-indicator" style={{ backgroundColor: statusColor }}></div> {/* Status indicator */}
      </div>
      <p className="card-text">{title}</p>
      <div className="card-footer">
        <i className="fas fa-bars"></i>
       {priority < 3 ? <img src={noPriority} alt="" /> : <img src={high} alt="" />}
        <button style={{ border: '1px solid #f8f5f5' , display: 'flex' , alignItems: 'center' , gap: '4px' , color: '#c0c0c0' , backgroundColor: 'white' }}> 
          <div style={{borderRadius: '100%' , width: '10px' , height: '10px' , backgroundColor: '#c0c0c0'}} ></div> 
          {tag}
          </button>
      </div>
    </div>
  );
};

export default Card;