/* 1.
Tárold el az alábbi értéket egy token nevű, httpOnly cookie-ba, ami 15 perc után lejár:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
(közben kiderült, hogy httpOnly-t így nem tudunk csinálni)
(max age megadásával egyszerűbb)
*/

const now = new Date();
now.setTime(now.getTime() + 15 * 60 * 1000);
const expires = now.toUTCString();
document.cookie = `token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c; expires=${expires}; path=/`;

/*
Innentől Józsi megoldásai vannak itt.
*/

const saveCookie = (name, content, expireDate = new Date()) => {
    document.cookie = `${name}=${content}; expires=${expireDate}`;
};
const expire = new Date( new Date().getTime() + 15 * 60 * 1000 );
saveCookie('token', 'ldskjflkdsjf', expire);

/* 2.
Az alábbi cookie-k vannak a böngésződben tárolva (hozd létre őket):

viewed: 5
uid: 354774631237
ssid: Bx55OWbHJ0Vt_IGIFÍ

Írj egy olyan objectet, ami az alábbi három metódust megvalósítja:
- kiolvassa a sütik nevét, és értékét
- átmenti őket sessionStorage-be
- törli a sütiket
*/

document.cookie = 'viewed=5'
document.cookie = 'uid=354774631237'
document.cookie = 'ssid=Bx55OWbHJ0Vt_IGIFÍ'

const cookieHandler = {
    getCookie(name) {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith(name))
            .split('=')[1];
        return cookieValue;
    },
    removeCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    },
    setSessionStorage(key, value) {
        window.sessionStorage.setItem(key, value);
    },
    moveToSession(name) {
        const value = this.getCookie(name);
        this.removeCookie(name);
        this.setSessionStorage(name, value);
    }
};

console.log(cookieHandler.moveToSession('ssid'));


/* 3.
Adott egy json file, ami valójában egy tömb, lastName, firstName propertyket tartalmazó objektumokkal.
Írj egy függvényt, ami indít egy ajax kérést, ami elkéri a json tartalmát, és a firstName, lastName párosokat egymás alá beleírja
egy div-en belüli p-tagekbe, és létrehoz egy users nevű bejegyzés a localStorage-be, ahol a json tartalmát letárolja.
Módosítsd a függvényt úgy, hogy amennyiben a localStorage-ba van users bejegyzés, úgy onnan olvassa ki az adatokat,
ha nincs csak akkor küldjön ajax kérést.
(parancssorba: json-server .\users.json --watch
ezután feljön egy link (Resources résznél), amire ha megjelenik a json string a böngészőben, akkor OK)
*/

const userHandler = {
    getList() {
        return new Promise( (res, rej) => {
            if (localStorage.users) {
                res(JSON.parse(localStorage.users));
            } else {
                fetch('http://localhost:3000/users')
                    .then(response => res(response.json()));
            }
        });
    },
    showList(parent) {
        parent = document.querySelector(parent);
        this.getList().then(
            list => {
                this.generateList(parent, list);
                localStorage.users = JSON.stringify(list);
            },
            err => console.error(err)
        );
    },
    generateList(parent, list) {
        list.forEach(element => {
            const p = document.createElement('p');
            p.classList.add('user-row');
            p.textContent = `${element.firstName} ${element.lastName}`;
            parent.appendChild(p);
        });
    }
}

userHandler.showList('.user-list');