# OpenAI API Key Validator

A web-based tool featuring a terminal-styled interface for bulk validation of OpenAI API keys. This application helps developers and teams manage multiple API keys by providing real-time validation status and convenient export capabilities.

## Features

- 🔑 Bulk API key validation
- 📤 File upload support for key lists
- ⚡ Real-time validation progress updates
- 🔒 Secure key masking in UI
- 📝 TXT export with full key data
- 💻 Terminal-styled interface
- 🚀 Built with Python (Flask) and JavaScript

## Demo

The application provides a terminal-styled interface where you can:
- Input multiple API keys (one per line)
- Upload a text file containing API keys
- View real-time validation progress
- Export results with full key data
- See masked keys in the UI for security

## Installation

1. Clone the repository:
```bash
git clone https://github.com/seinlinn02/openai-api-key-validator.git
cd openai-api-key-validator
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

1. Start the Flask server:
```bash
python main.py
```

2. Open your browser and navigate to `http://localhost:5000`

3. Use the application in one of two ways:
   - Paste your API keys directly into the textarea (one key per line)
   - Upload a text file containing API keys (one key per line)

4. Click "Validate Keys" to start the validation process

5. Monitor real-time progress and results

6. Use the "Export Results" button to download a TXT file containing the full validation results

## API Key Status Types

- `VALID`: The API key is active and working
- `INVALID`: The API key is not valid
- `RATE_LIMITED`: The API key is valid but currently rate-limited
- `ERROR`: An unexpected error occurred during validation

## Local Development

1. Clone the repository and install dependencies as described above

2. The project structure:
```
├── app.py              # Main Flask application
├── main.py            # Server startup
├── utils.py           # Validation utilities
├── static/
│   ├── css/          # Styling
│   └── js/           # Frontend logic
└── templates/         # HTML templates
```

3. Start the development server:
```bash
python main.py
```

## Dependencies

- Flask (3.0.0)
- OpenAI (1.3.0)

## Security Notes

- API keys are masked in the UI but stored in full for export functionality
- Keys are not stored in any database
- All processing is done in-memory
- Use HTTPS in production deployments

## License

This project is open source and available under the MIT License.

## Credits

Created by Sein Linn

## Repository

[View on GitHub](https://github.com/seinlinn02/openai-api-key-validator)
