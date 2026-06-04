# Clone & install
git clone https://github.com/your-org/autoinsight-ai.git
cd autoinsight-ai
pip install -r requirements.txt

# LLM Setup (Choose ONE)
export GROQ_API_KEY=gsk_...          # For Qwen 2.5 72B (free tier)
# OR
ollama pull llama3.1:8b              # For Llama 3.1 8B (local)
export LLM_PROVIDER=ollama           # Switch in llm_factory.py

# Start services
docker-compose up -d postgres redis minio
uvicorn backend.api:app --reload --port 8000