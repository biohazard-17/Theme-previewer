const save_buttons = document.querySelectorAll('.save-buttons>button')

save_buttons.forEach(btn=>{
    btn.addEventListener('click',(e)=>{
        ripple(e);
    });
});

function ripple(e){
    let x = e.clientX - e.target.offsetLeft;
    let y = e.clientY - e.target.getBoundingClientRect().top;
    console.log(x, y)
    let ripples = document.createElement('div');
    ripples.classList.add('ripple');
    ripples.style.left = x + 'px';
    ripples.style.top = y + 'px';
    e.target.appendChild(ripples);

    setTimeout(()=>{
        ripples.remove();
    }, 800);
}