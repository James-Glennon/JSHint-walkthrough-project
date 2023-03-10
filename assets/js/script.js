const API_KEY = 'c7PctCc7TPY9Q08Ip7U4jxfwe0I';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click',e => getStatus(e));
document.getElementById('submit').addEventListener('click',e => postForm(e));

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if(response.ok){
        displayStatus(data.expiry);
    }else{
        displayException(data);
        throw new Error(data.error);
    }
}

function displayStatus(data){
    document.getElementById('resultsModalTitle').textContent = 'API key status';
    document.getElementById('results-content').textContent = `Your key is valid until ${data}`;

    resultsModal.show()
}

function processOptions(form){
    let optArray = [];

    for(let entry of form.entries()){
        if(entry[0] === 'options'){
            optArray.push(entry[1]);
        }
    }
    form.delete('options');
    form.append('options',optArray.join());
    return form;
}

async function postForm(e){
    const form = processOptions(new FormData(document.getElementById('checksform')));
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
                    "Authorization": API_KEY,
                 },
        body: form,
        })

    const data = await response.json()

    if(response.ok){
        displayErrors(data);
        console.log(data);
    }else{
        displayException(data)
        throw new Error(data.error);
    }
};

function displayException(data){
    let heading = `An exception has occurred.`;
    let results = `<div>The API returned status code: ${data.status_code}</div>`;
    
    results += `<div>Error number: <strong>${data.error_no}</strong></div>`
    results += `<div>Error text: <strong>${data.error}</strong></div>`

    document.getElementById('resultsModalTitle').innerHTML = heading;
    document.getElementById('results-content').innerHTML = results

    resultsModal.show();
};


function displayErrors(data){
    let heading = `JS Hints results for ${data.file}`;
    let results = ``;

    if(data.total_errors === 0){
        results = `<div class = "no-errors"> No errors found.</div>`
    } else{
        results = `<div>Total Errors:<span class="error-count>${data.total_errors}</span></div>`
        
        for(let err of data.error_list){
            results += `<div>At line <span class="line">${err.line}</span>, `
            results += `column <span class="column">${err.col}</span></div>`
            results += `<div class="error">${err.error}</div>`
        }
    }

    document.getElementById('resultsModalTitle').innerHTML = heading;
    document.getElementById('results-content').innerHTML = results

    resultsModal.show();
}