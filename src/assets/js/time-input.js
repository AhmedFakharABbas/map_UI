document.querySelectorAll('input[id=time]')
    .forEach(e => e.oninput = () => { 
        // Always 2 digits
        if (e.value.length >= 2) e.value = e.value.slice(-2);
        // 0 on the left (doesn't work on FF)
        if (e.value.length === 1) e.value = '0' + e.value;
        // Avoiding letters on FF
        if (!e.value) e.value = '00';
    });