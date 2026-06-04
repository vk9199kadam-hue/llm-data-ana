// Upload CSV & get unified model
const formData = new FormData();
formData.append('file', csvFile);
formData.append('llm_provider', 'groq');

const res = await fetch('/api/v1/pipeline/run', { method: 'POST', body: formData });
const model = await res.json();

// Use model.relationships for graph, model.derived_columns for builder,
// model.final_viz_schema + model.recommended_dashboard_layout for auto-dashboard