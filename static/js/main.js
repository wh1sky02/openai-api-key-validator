document.addEventListener('DOMContentLoaded', function() {
    const apiKeysTextarea = document.getElementById('apiKeys');
    const fileInput = document.getElementById('fileInput');
    const validateBtn = document.getElementById('validateBtn');
    const exportBtn = document.getElementById('exportBtn');
    const resultsDiv = document.getElementById('results');
    const progressBar = document.getElementById('progressBar');
    const systemStatus = document.getElementById('systemStatus');
    const validatedCount = document.getElementById('validatedCount');

    let validationResults = [];

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                apiKeysTextarea.value = e.target.result;
            };
            reader.readAsText(file);
        }
    });

    validateBtn.addEventListener('click', function() {
        const keys = apiKeysTextarea.value.trim();
        if (!keys) {
            showStatus('error', 'No API keys provided');
            return;
        }

        // Reset UI state
        validateBtn.disabled = true;
        exportBtn.disabled = true;
        showStatus('warning', 'Validating keys...');
        progressBar.classList.remove('d-none');
        const progressBarInner = progressBar.querySelector('.progress-bar');
        progressBarInner.style.width = '0%';
        resultsDiv.innerHTML = '';
        validationResults = [];

        const formData = new FormData();
        if (fileInput.files.length > 0) {
            formData.append('file', fileInput.files[0]);
        } else {
            formData.append('keys', keys);
        }

        fetch('/validate', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to start validation');
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            function processStream() {
                reader.read().then(({done, value}) => {
                    if (done) {
                        showStatus('ok', 'Validation complete');
                        exportBtn.disabled = false;
                        validateBtn.disabled = false;
                        progressBar.classList.add('d-none');
                        return;
                    }

                    buffer += decoder.decode(value, {stream: true});
                    const lines = buffer.split('\n\n');
                    buffer = lines.pop();

                    lines.forEach(line => {
                        if (line.startsWith('data: ')) {
                            const result = JSON.parse(line.slice(6));
                            validationResults.push(result);
                            
                            // Update progress bar
                            progressBarInner.style.width = `${result.progress.percentage}%`;
                            validatedCount.textContent = result.progress.current;
                            
                            // Display individual result
                            displayResult(result);
                        }
                    });

                    processStream();
                }).catch(error => {
                    showStatus('error', 'Validation failed');
                    validateBtn.disabled = false;
                    progressBar.classList.add('d-none');
                    console.error(error);
                });
            }

            processStream();
        })
        .catch(error => {
            showStatus('error', 'Failed to start validation');
            validateBtn.disabled = false;
            progressBar.classList.add('d-none');
            console.error(error);
        });
    });

    // Export button directly triggers TXT export
    exportBtn.addEventListener('click', async function() {
        try {
            const response = await fetch('/export', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(validationResults)
            });

            if (!response.ok) throw new Error('Export failed');

            const data = await response.json();
            downloadFile(data.txt, 'api_key_validation_results.txt', 'text/plain');
        } catch (error) {
            showStatus('error', 'Export failed');
            console.error(error);
        }
    });

    function displayResult(result) {
        const resultElement = document.createElement('div');
        resultElement.className = `result-item result-${result.status}`;
        resultElement.innerHTML = `
            <span class="key">${result.masked_key}</span>
            <span class="status">[${result.status.toUpperCase()}]</span>
        `;
        resultsDiv.appendChild(resultElement);
        resultsDiv.scrollTop = resultsDiv.scrollHeight;
    }

    function showStatus(type, message) {
        systemStatus.className = `status-${type}`;
        systemStatus.textContent = message;
    }

    function downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});
