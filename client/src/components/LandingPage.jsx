import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function LandingPage() {
  const { token } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/landing/${token}`)
      .then((res) => res.json())
      .then((json) => setData(json.data));
  }, [token]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: data.suggested_color,
        color: 'white',
        padding: '60px',
        fontFamily: 'Arial',
      }}
    >
      <h1>{data.style_name}</h1>

      <p
        style={{
          fontSize: '24px',
          maxWidth: '700px',
        }}
      >
        {data.personalized_email}
      </p>

      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginTop: '40px',
        }}
      >
        <button>₪{data.option1}</button>

        <button>₪{data.option2}</button>

        <button>₪{data.option3}</button>
      </div>
    </div>
  );
}