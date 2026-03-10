fetch('http://localhost:8000/api/shgs?location=Pune')
    .then(res => res.json())
    .then(data => console.log('DATA:', data))
    .catch(err => console.error('ERROR:', err));
