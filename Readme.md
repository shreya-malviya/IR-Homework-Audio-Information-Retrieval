Command to run Frontend:
```
npm install
npm run dev
```

Command to run Backend:
```
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```
