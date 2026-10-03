// מערכים גלובליים עם נתוני הצמחים.
// לכל צמח אותו אינדקס בשני המערכים: plantNames[i] הוא השם ו-plantFiles[i] הוא התמונה שלו.
// אינדקסים 0 עד 5: הרבה אור (לפי גודל, ובכל גודל: קודם "כמעט לא משקים" ואז שאר ההשקיות)
// אינדקסים 6 עד 8: אור בינוני (קטן, בינוני, גדול)
// אינדקסים 9 עד 11: מעט אור (קטן, בינוני, גדול)
const plantNames = ["סוקולנט", "הוורתיה", "אלוורה", "פיקוס ג'ינסנג", "עץ הכסף (קרסולה)", "סטרליציה (ציפור גן עדן)",
                    "סנסיווירה ננסית", "פפרומיה", "מונסטרה דליציוזה",
                    "צמח הנחש", "שושנת השלום", "דקל חמד"];

const plantFiles = ["images/plants/01-succulent.png", "images/plants/03-haworthia.png", "images/plants/02-aloe-vera.png",
                    "images/plants/05-ficus-ginseng.png", "images/plants/04-jade-plant-crassula.png", "images/plants/07-bird-of-paradise.png",
                    "images/plants/08-dwarf-snake-plant.png", "images/plants/09-peperomia.png", "images/plants/13-monstera-deliciosa.png",
                    "images/plants/14-snake-plant.png", "images/plants/17-peace-lily.png", "images/plants/19-parlor-palm.png"];


// פונקציה ראשית: מופעלת בטעינת העמוד ובכל שינוי בפקד (רדיו, Checkbox או הקלדה בשם)
// מעדכנת את כל חלקי התצוגה בלי צורך בלחיצה על כפתור האישור
function updateForm() {
    updatePlant();
    updateExtras();
    updateSubmitButton();
}


// מקבלת שם class של סט כפתורי רדיו ומחזירה את מספר האפשרות שנבחרה (0, 1, 2...)
// אם לא נבחרה אף אפשרות, מוחזר 1-
function getCheckedIndex(className) {
    const options = document.getElementsByClassName(className);
    for (let i = 0; i < options.length; i++) {
        if (options[i].checked) {
            return i;
        }
    }
    return -1;
}


// מקבלת שם class של סט כפתורי רדיו ומחזירה את הטקסט (value) של האפשרות שנבחרה
function getCheckedValue(className) {
    const index = getCheckedIndex(className);
    return document.getElementsByClassName(className)[index].value;
}


// מקבלת את מספרי הבחירות (אור, גודל, השקיה) ומחזירה את האינדקס של הצמח המתאים במערכים
function findPlantIndex(light, size, water) {
    if (light === 0) {
        // הרבה אור: לכל גודל יש שני צמחים, והבחירה ביניהם לפי ההשקיה
        if (water === 0) {
            return size * 2;       // כמעט לא משקים: 0, 2, 4
        }
        else {
            return size * 2 + 1;   // משקים יותר: 1, 3, 5
        }
    }
    // אור בינוני (1) או מעט (2): שלושה צמחים לכל רמת אור, לפי הגודל
    return 6 + (light - 1) * 3 + size;
}


// מציגה את תמונת הצמח המתאים, או את תמונת המדפים כל עוד לא נענו שלוש שאלות הרדיו
function updatePlant() {
    const light = getCheckedIndex("lightOpt");
    const size = getCheckedIndex("sizeOpt");
    const water = getCheckedIndex("waterOpt");

    if (light === -1 || size === -1 || water === -1) {
        document.getElementById("defaultShelvesView").style.display = "block";
        document.getElementById("plantResultContainer").style.display = "none";
        return; // יציאה מהפונקציה, אין עדיין צמח להציג
    }

    const plantIndex = findPlantIndex(light, size, water);

    document.getElementById("defaultShelvesView").style.display = "none";
    document.getElementById("plantResultContainer").style.display = "block";
    document.getElementById("plantTitle").innerHTML = "הצמח שלך הוא: " + plantNames[plantIndex];
    document.getElementById("plantImg").src = plantFiles[plantIndex];
    document.getElementById("plantImg").alt = plantNames[plantIndex];
}


// עוברת בלולאה על תיבות ה-Checkbox: תיבה מסומנת מדגישה את התמונה שלה, אחרת התמונה חוזרת לשקיפות חלקית
// התיבות והתמונות מסודרות באותו סדר ב-HTML ולכן אותו אינדקס i מחבר ביניהן
function updateExtras() {
    const extraBoxes = document.getElementsByClassName("extraOpt");
    const extraImages = document.getElementsByClassName("extraImg");

    for (let i = 0; i < extraBoxes.length; i++) {
        if (extraBoxes[i].checked) {
            extraImages[i].style.opacity = "1";
        }
        else {
            extraImages[i].style.opacity = "0.35";
        }
    }
}


// מפעילה את כפתור ההזמנה רק כשיש שם מלא ונבחרה אפשרות בכל שלושת סטי הרדיו
function updateSubmitButton() {
    const fullName = document.getElementById("fullName").value;
    const light = getCheckedIndex("lightOpt");
    const size = getCheckedIndex("sizeOpt");
    const water = getCheckedIndex("waterOpt");

    if (fullName !== "" && light !== -1 && size !== -1 && water !== -1) {
        document.getElementById("submitBtn").disabled = false;
    }
    else {
        document.getElementById("submitBtn").disabled = true;
    }
}


// מחזירה מחרוזת עם שמות התוספות שסומנו, מופרדות בפסיק
// אם לא סומנה אף תוספת, מוחזרת הודעה מתאימה
function getExtrasText() {
    const extraBoxes = document.getElementsByClassName("extraOpt");
    let extrasText = "";

    for (let i = 0; i < extraBoxes.length; i++) {
        if (extraBoxes[i].checked) {
            if (extrasText !== "") {
                extrasText += ", "; // פסיק רק לפני התוספת השנייה והלאה
            }
            extrasText += extraBoxes[i].value;
        }
    }

    if (extrasText === "") {
        extrasText = "לא נבחרו תוספות";
    }
    return extrasText;
}


// מופעלת בלחיצה על "שלח להזמנה": בונה את סיכום ההזמנה ומציגה אותו בחלון
function sendOrder() {
    const fullName = document.getElementById("fullName").value;
    let address = document.getElementById("address").value;
    if (address === "") {
        address = "לא צוינה כתובת";
    }

    const plantIndex = findPlantIndex(getCheckedIndex("lightOpt"), getCheckedIndex("sizeOpt"), getCheckedIndex("waterOpt"));

    let summary = "תודה " + fullName + ", ההזמנה שלך נקלטה.<br><br>";
    summary += "<strong>כתובת:</strong> " + address + "<br>";
    summary += "<strong>אור בחדר:</strong> " + getCheckedValue("lightOpt") + "<br>";
    summary += "<strong>גודל:</strong> " + getCheckedValue("sizeOpt") + "<br>";
    summary += "<strong>השקיה:</strong> " + getCheckedValue("waterOpt") + "<br>";
    summary += "<strong>הצמח שנבחר עבורך:</strong> " + plantNames[plantIndex] + "<br>";
    summary += "<strong>תוספות:</strong> " + getExtrasText();

    document.getElementById("summaryText").innerHTML = summary;
    document.getElementById("summaryModal").style.display = "block";
}


// סגירת חלון הסיכום
function closeSummary() {
    document.getElementById("summaryModal").style.display = "none";
}
