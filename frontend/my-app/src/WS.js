import { useState, useEffect } from "react";
import Socket from "./Socket";

function WS() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!message) {
      setError("message cannot be empty");
      return false;
    } else if (message.length > 100000) {
      setError("message cannot be longer than 100000 characters");
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Socket.emit("message", { content: message });
    setMessages((prevMessages) => [...prevMessages, { content: message }]);
    setMessage("");
  };

  useEffect(() => {
    Socket.on("new-message", (msg) => {
      setMessages((prevMessages) => messages.concat(prevMessages));
    });
  }, []);

  return (
    <>
      <div className="form-wrapper mt-4 m-auto">
        <form
          id="form"
          onSubmit={handleSubmit}
          className="w-50 justify-content-between m-auto"
        >
          <div className="mb-3">
            <label htmlFor="messageInput" className="form-label">
              message
            </label>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              className={`form-control ${!!error ? "is-invalid" : ""}`}
              id="messageInput"
            />
            {error && <p className="text-danger">{error}</p>}
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center my-5">
              <h2>messages</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <ul className="list-group">
                {messages.map((message, index) => (
                  <li key={index} className="list-group-item">
                    {message.content}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default WS;
