//all checkboxes
const checkBoxes = document.querySelectorAll('input[type="checkbox"].checkbox');
//expand button
const expand = document.getElementById('_expand');
const expandText = document.querySelector('.select-text');
//dropdown items
const color_menu = document.getElementById('items');

checkBoxes.forEach(checkbox=>{
    checkbox.addEventListener('change',()=>{
        const selected_boxes = Array.from(checkBoxes).filter(checkbox=>checkbox.checked);
        document.querySelector('.select-text').innerHTML= `${selected_boxes.length} elements selected`;
        document.getElementById(`${checkbox.id.replace('opt-','')}`).classList.toggle('visible');
        document.querySelector(`label #${checkbox.id}`).parentNode.classList.toggle('selected');
    });
});

function expandMenu(){
    color_menu.classList.toggle('visible');
    color_menu.classList.toggle('hide');
    expand.classList.toggle('up');
    expand.classList.toggle('down');
}

expand.addEventListener('click', ()=>{
    expandMenu();
});

expandText.addEventListener('click', ()=>{
    expandMenu();
});

const color_boxes = document.querySelectorAll('.box');
color_boxes.forEach((box)=>{
    box.addEventListener('click', ()=>{
        console.log(box.id)
    });
});