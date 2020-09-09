const subjects = [
    "Artes",
    "Biologia",
    "Ciências",
    "Educação Física",
    "Geografia",
    "História",
    "Matemática",
    "Português",
    "Química",
]

const weekdays = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
]

function getSubjects(subjectNumber) {
    return subjects[+subjectNumber - 1];
};

function convertHoursToMinutes(time) {
    const hour = time.split(':')[0];
    const minutes = time.split(':')[1];

    return Number((hour * 60) + minutes);
};

module.exports = {
    subjects,
    weekdays,
    getSubjects,
    convertHoursToMinutes
};
