import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatWindow({ onClose }) {

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
 const [loading, setLoading] = useState(false);
 const messagesEndRef = useRef(null);

 useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);

  const exampleQuestions = [
    "Tell me about Yashi's technical skills.",
    "What projects has Yashi worked on?",
    "Tell me about QueryMind.",
    "What was Yashi's role in the Smart India Hackathon project?",
    "What are Yashi's strengths and soft skills?",
    "Tell me about Yashi's experience."
  ];

  const handleQuestion = (text) => {
    setQuestion(text);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!question.trim() || loading) return;

  const currentQuestion = question;

  setMessages((previous) => [
    ...previous,
    {
      role:"user",
      content:currentQuestion,
    },
  ]);

  setQuestion("");
  setLoading(true);

   // Create an empty AI message
    setMessages((previous) => [
      ...previous,
      {
        role: "assistant",
        content: "",
      },
    ]);

try {
  const response = await fetch("https://yashi-portfolio-backend.onrender.com/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: currentQuestion,
      history: messages,
    }),
  });

    if (!response.ok) {
      throw new Error("Failed to get response from server");
    }

    if(!response.body){
      throw new Error("Streaming is not supported");
    }
    const reader  = response.body.getReader();
    const decoder = new TextDecoder();

    let fullAnswer ="";

    while(true){
      const {value,done} = await reader.read();
      if(done) break;

      const chunk = decoder.decode(value,{
        stream:true,
      });

      fullAnswer += chunk;

        // Update the last AI message
      setMessages((previous) => {
        const updated = [...previous];

        updated[updated.length - 1] = {
          role: "assistant",
          content: fullAnswer,
        };

        return updated;
      });

    }
  } catch (error) {
    console.error("Chat error:", error);

    setMessages((previous) => {
      const updated = [...previous];

      updated[updated.length - 1] = {
        role: "assistant",
        content: "Sorry, I couldn't get a response right now.",
      };

      return updated;
    });

  } finally{
    setLoading(false);
  }
};

  return (
    <div className="chat-window">

      {/* HEADER */}

      <div className="chat-header">

        <div className="chat-title">

          <span className="chat-logo">
            ✦
          </span>

          <div>
            <div className="chat-title-main">
              Yashi's AI Assistant
            </div>

            <div className="chat-title-sub">
              Ask me anything about Yashi
            </div>
          </div>

        </div>

        <button
          className="chat-close"
          onClick={onClose}
        >
          ×
        </button>

      </div>


      {/* CONTENT */}

      <div className="chat-content">

              {messages.length === 0 && (
            <div className="welcome-message">

              <h2>
                Hi! 👋
              </h2>

              <p>
                I'm Yashi's AI assistant.
                Ask me anything about her skills,
                experience, projects, or background.
              </p>

            </div>
          )}

        <div className="messages">
         

          {messages.map((message, index) => (

       <div
  key={index}
  className={`message ${
    message.role === "user"
      ? "user-message"
      : "assistant-message"
  }`}
>
  <ReactMarkdown>
    {message.content}
  </ReactMarkdown>
</div>

          ))}

    {loading && (
  <div className="assistant-message typing">
    <span className="typing-text">
      Yashi's AI is thinking
    </span>

    <span className="typing-dots">
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </span>
  </div>
)}
         <div ref={messagesEndRef} />

</div>


        {/* EXAMPLE QUESTIONS */}

            {messages.length === 0 && !loading && (
          <div className="example-section">

            <div className="example-title">
              Try asking
            </div>

            <div className="example-questions">

              {exampleQuestions.map((q, index) => (

                <button
                  key={index}
                  className="example-question"
                  onClick={() => handleQuestion(q)}
                >
                  {q}
                </button>

              ))}

            </div>

          </div>
        )}

      </div>


      {/* INPUT */}

      <form
        className="chat-input-area"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about Yashi..."
        />

        <button
          type="submit"
          className="send-button"
        >
          ➤
        </button>

      </form>

    </div>
  );
}