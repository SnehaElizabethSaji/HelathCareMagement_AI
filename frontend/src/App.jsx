import { useState } from "react";

function App() {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: age ? parseInt(age, 10) : null,
          sex: sex || null,
          symptoms,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Server error");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: 16 }}>
      <h1>Health Test Recommendation</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Age</label>
          <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 34" />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Sex</label>
          <input value={sex} onChange={(e) => setSex(e.target.value)} placeholder="female / male / other" />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Symptoms</label>
          <textarea
            rows={6}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe symptoms here..."
            style={{ width: "100%" }}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Thinking..." : "Get Recommendations"}
        </button>
      </form>

      {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}

      {result && (
        <div style={{ marginTop: 20, padding: 12, border: "1px solid #eee" }}>
          <h3>Recommended Tests</h3>
          {result.recommended_tests.length ? (
            <ul>
              {result.recommended_tests.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          ) : (
            <p>No tests suggested by model.</p>
          )}
          <h4>Rationale</h4>
          <p>{result.rationale}</p>

          {result.follow_up && (
            <>
              <h4>Follow up</h4>
              <p>{result.follow_up}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
