const { subjects, weekdays, getSubjects, convertHoursToMinutes } = require('../components/format/index.js');
const dataBase = require('../database/db.js');

// nunjucks render func
function pageLanding(usRequest, svResponse) {
    return svResponse.render("index.html");
};

async function pageStudy(usRequest, svResponse) {
    const filters = usRequest.query;

    if (!filters.subject || !filters.weekday || !filters.time) {
        return svResponse.render("study.html", { filters, subjects, weekdays });
    };

    const timeToMinutes = convertHoursToMinutes(filters.time);

    const query = `
        SELECT classes.*, proffys.*
        FROM proffys
        JOIN classes ON (classes.proffy_id = proffys.id)
        WHERE EXISTS (
            SELECT class_schedule.*
            FROM class_schedule
            WHERE class_schedule.class_id = classes.id
            AND class_schedule.weekday = ${filters.weekday}
            AND class_schedule.time_from <= ${timeToMinutes}
            AND class_schedule.time_to > ${timeToMinutes}
        )
        AND classes.subject = '${filters.subject}'
    `
    
    // caso haja erro ao consultar o banco de dados
    try {
        const db = await dataBase;
        const proffys = await db.all(query);

        proffys.map((proffy) => {
            proffy.subject = getSubjects(proffy.subject);
        });

        return svResponse.render("study.html", { proffys, filters, subjects, weekdays });
    
    } catch (error) {
        console.log(error);
    };
};

function pageGiveClasses(usRequest, svResponse) {
    return svResponse.render("giveClasses.html", { subjects, weekdays });
};

async function saveClasses(usRequest, svResponse) {
    const createProffy = require('../database/createProffy.js')
    const teachData = usRequest.body;

    const proffyValue = {
        name: usRequest.body.name,
        avatar: usRequest.body.avatar,
        whatsapp: usRequest.body.whatsapp,
        bio: usRequest.body.bio,
    };

    const classValue = {
        subject: usRequest.body.subject,
        cost: usRequest.body.cost,
    };

    const classScheduleValues = usRequest.body.weekday.map((weekday, index) => {
        return {
            weekday: weekday,
            time_from: convertHoursToMinutes(usRequest.body.time_from[index]),
            time_to: convertHoursToMinutes(usRequest.body.time_to[index]),
        };
    });

    try {
        const db = await dataBase;
        await createProffy(db, { proffyValue, classValue, classScheduleValues });

        let queryString = "?subject=" + usRequest.body.subject;
        queryString = queryString + "&weekday=" + usRequest.body.weekday[0];
        queryString = queryString + "&time=" + usRequest.body.time_from[0];

        return svResponse.redirect("/study" + queryString);

    } catch (error) {
        console.log(error);
    };
};

module.exports = {
    pageLanding,
    pageStudy,
    pageGiveClasses,
    saveClasses
};
