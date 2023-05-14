import "./style.css";
import { useEffect, useState } from "react";
function ShortPolling() {
  const [input, setInput] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [lastNotificationId, setLastNotificationId] = useState("");

  function handleInput(e) {
    setInput(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:3000/notifications", {
      method: "POST",
      body: JSON.stringify({ content: input }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((newNotification) => {
        setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
        setInput("");
      })
      .catch((error) => {
        console.error("Error creating notification:", error);
      });
  };
  
      useEffect(() => {
        const intervalId = setInterval(() => {
          fetchNotifications(lastNotificationId)
            .then((newNotifications) => {
              if (newNotifications && newNotifications.length > 0) {
                setNotifications((prevNotifications) => [...prevNotifications, ...newNotifications]);
                setLastNotificationId(newNotifications[newNotifications.length - 1]._id);
              }
            });
        }, 5000);   
        return () => clearInterval(intervalId);
      }, [lastNotificationId]);

      async function fetchNotifications(_Id = null) {
        const url = _Id
          ? `http://localhost:3000/notifications?lastNotificationId=${_Id}`
          : 'http://localhost:3000/notifications';
    
        try {
          const res = await fetch(url);
          return await res.json();
        } catch (error) {
          console.error('Error fetching notifications:', error);
 }
}
  return (
    <div className="mt-5 pt-5">
      <section className="section-50 mt-5">
        <center>
          <form onSubmit={handleSubmit}>
            <div className="input-group w-50">
              <span
                className="input-group-text"
                id="inputGroup-sizing-default"
              >
                Add
              </span>
              <input
                value={input}
                type="text"
                onChange={handleInput}
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
            </div>
            <button type="submit" className="btn btn-primary mt-5">
              Submit
            </button>
          </form>
        </center>
      </section>

      <section className="section-50">
        <div className="container">
          <h3 className="m-b-50 heading-line">
            Notifications <i className="fa fa-bell text-muted"></i>
          </h3>
          {notifications.map((n) => (

        <div className="notification-ui_dd-content" key={n._id}>
            <div className="notification-list">
              <div className="notification-list_content">
                <div className="notification-list_img">
                  <img src="images/users/user4.jpg" alt="user" />
                </div>
                <div className="notification-list_detail">
                  <p>
                    <b>Lance Bogrol</b> reacted to your post
                  </p>

                  <p className="text-muted">{n.content} </p>
                   <small className="text-muted"> </small>

                  <p className="text-muted">
                    <small>{n.createdAt}</small>
                  </p>
                </div>
              </div>
              <div className="notification-list_feature-img">
                <img src="images/features/random4.jpg" alt="Feature image" />
              </div>
            </div>
          </div>
          ))}
          {/* 
					<div className="text-center">
						<a href="#!" className="dark-link">Load more activity</a>
					</div> */}
        </div>
      </section>
    </div>
  );
}
export default ShortPolling;
