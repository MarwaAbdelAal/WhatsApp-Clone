import { useState, useEffect } from 'react';
const backendUrl = 'http://localhost:3000';

function LongPolling() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!message) {
      setError('message cannot be empty');
      return false;
    }
    else if (message.length > 100000) {
      setError('message cannot be longer than 100000 characters');
      return false;
    }
    else {
      setError('');
      return true;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return
    }
    const response = await fetch(`${backendUrl}/sse/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: message })
    });
    if (response.ok) {
      setMessage('');
    }
  }

  useEffect(() => {
    const eventSource = new EventSource(`${backendUrl}/sse/messages`);
    eventSource.onmessage = (e) => {
      console.log(e);
      const parsedData = JSON.parse(e.data);
      setMessages(prevMessages => [...prevMessages, parsedData]);
    }
  }, []);

  return (
    <>
      <div className="form-wrapper mt-4 m-auto">
        <form id="form" onSubmit={handleSubmit} className='w-50 justify-content-between m-auto'>
          <div className="mb-3">
            <label htmlFor="messageInput" className="form-label">message</label>
            <input value={message} onChange={e => setMessage(e.target.value)} type="text" className={`form-control ${!!error ? "is-invalid" : ""}`} id="messageInput" />
            {error && <p className="text-danger">{error}</p>}
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
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
                {messages.map(message => (
                  <li key={message._id} className="list-group-item">{message.content}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default LongPolling;