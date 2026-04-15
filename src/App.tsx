import { useState } from "react";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

export default function OnboardingIQ() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  async function handleTransform() {
    setLoading(true);
    // 1. Call your Lambda/Bedrock Function via Amplify Actions
    // 2. For the demo, we'll assume the AI returns a JSON object
    try {
      const { data } = await client.queries.transformData({
        prompt: input,
      });

      const cleanData = JSON.parse(data!);
      setResults(cleanData);

      // 3. Save to DynamoDB
      await client.models.Customer.create({
        accountName: cleanData.accountName,
        billingEmail: cleanData.billingEmail,
        mrr: cleanData.mrr,
        status: cleanData.status,
        notes: "AI-Mapped from legacy source",
      });
    } catch (err) {
      console.error("Transformation failed", err);
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>OnboardingIQ</h1>
      <p>AI-Native Data Ingestion Engine</p>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <h3>Legacy Input (Messy)</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste messy client data here..."
            style={{
              width: "100%",
              height: "200px",
              borderRadius: "8px",
              padding: "10px",
            }}
          />
          <button
            onClick={handleTransform}
            disabled={loading}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {loading ? "Analyzing..." : "Map to OnboardingIQ"}
          </button>
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: "#f4f4f4",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Target Schema (Clean)</h3>
          {results ? (
            <pre>{JSON.stringify(results, null, 2)}</pre>
          ) : (
            <p style={{ color: "#666" }}>
              Upload data to see AI mapping results.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
