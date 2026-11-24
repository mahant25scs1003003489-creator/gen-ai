async function explainCode() {
    const code = document.getElementById('codeInput').value;
    const ouput = document.getElementById('output');
    const codeLanguage = document.getElementById('codeLanguage').value;
    const level = document.getElementById('level').value;
    const explainLang = document.getElementById('explainLang').value;
    const loading = document.getElementById('loading')
    const loadingText = document.getElementById('loadingText')

    if (!code.trim()) {
        ouput.textContent = explainLang === 'hi' ? "कृपया पहले कोड पेस्ट करें।" : "Please Paste some code first.";
        return;
    }

    ouput.style.display = 'none';
    loadingText.textContent = explainLang === 'hi' ? "AI कोड समझा रहा है..." : "AI is explaining the code...";
    loading.style.display = 'flex'

    try {
        const res = await fetch('/explain', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                code,
                codeLanguage,
                level,
                explainLang
            })
        })

        if (res.ok) {
            const data = await res.json();
            ouput.textContent = data.explanation;
        }else{
            const data = await res.json();
            ouput.textContent = data.error;
        }        
    } catch (err) {
        ouput.textContent = 'Something went wrong!';
    }finally{
        loading.style.display = 'none';
        ouput.style.display = 'block';    
    }    
}

async function pasteCode(){
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('codeInput').value = text;
    } catch (err) {
        alert('Failed to copy from clipboard. Paste code manually.')   
    }
}

function clearCode(){
    document.getElementById('codeInput').value = "";
    const output = document.getElementById('output');
    const defaultText = 'Your Explanation will appear here...';
    if (output.textContent !== defaultText) {
        output.textContent = defaultText;
    }
}

function copyExplanation(){
    const text = document.getElementById('output').textContent;
    if (!text || text === 'Your Explanation will appear here...') {
        alert('No explanation to copy!')
        return;
    }

    navigator.clipboard.writeText(text).then(()=>{
        alert('Explanation copied to clipboard.')
    }).catch((err)=>{
        console.log('Failed to copy', err);
        alert('Failed to copy explanation');
    })
}