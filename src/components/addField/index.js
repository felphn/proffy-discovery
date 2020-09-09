document.querySelector("#addTime")
.addEventListener('click', cloneField);

function cloneField() {
    const newFieldContainer = document.querySelector('.scheduleItem').cloneNode(true);
    const fields = newFieldContainer.querySelectorAll('input');

    fields.forEach(field => {
        field.value = '';
    });
    document.querySelector('#scheduleItems').appendChild(newFieldContainer);
};
