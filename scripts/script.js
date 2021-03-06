 // przechowywanie aktualnie kliknietego dnia
 let kliknietyDzien;
 // zmienne do nastepnego i poprzednego  miesiaca
 let nextMonth = 0;
 // zmienne do rysowania obecnego miesiaca
 var obecnyCzas = new Date();
 var timeStamp = Date.now();
 let dzis = obecnyCzas.getDate();
 let rok = obecnyCzas.getFullYear();
 let miesiac = obecnyCzas.getMonth();
 let dzienTygodnia = obecnyCzas.getDay(); // 1 - poniedzialek
 // day - zmienna sprawdzajaca jaki dzien tygodnia jest pierwszym dniem w miesiacu
 let day = new Date(rok, miesiac, 1).getDay();

 function leapYear(year) {
     return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
 }
 const nazwyMiesiecy = ["Styczen", "Luty", "Marzec", "Kwiecien", "Maj", "Czerwiec", "Lipiec", "Sierpien", "Wrzesien", "Pazdziernik", "Listopad", "Grudzien"];
 const dniTygodniaNazwa = ["", "Pon.", "Wt.", "Śr.", "Czw.", "Pt.", "Sob.", "Niedz."];
 const dniMiesiecyZwykly = [31, // styczen- miesdiac nr 0 dniMiesiecyZwykly[0]
     29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
 ];
 const dniMiesiecyPrzestepny = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

 //RYSOWANIE MIESIACA
 function drawMonth(nazwaMiesiaca, dzienTygodnia, dniTygodniaNazwa, day, rok, dniMiesiecyZwykly, nextMonth) {
     clear();
     document.querySelector(".nazwa-miesiaca").innerHTML = nazwaMiesiaca[miesiac] + ", " + rok;
     if (day === 0) {
         day = 7
     };
     for (j = 0; j < 7; j++) {
         document.querySelector('.test').innerHTML += '<div class="tyg nazwa-dnia' + (j + 1) + '">' + dniTygodniaNazwa[j + 1] + '</div>';
     }
     for (let i = 1; i < dniMiesiecyZwykly[miesiac] + day; i++) {
         if (day >= i) {
             $('.box').css('opacity', '0')
         }
         if (i === dzis && miesiac == obecnyCzas.getMonth()) {
             document.querySelector('.test').innerHTML += '<div id="day_' + (i - day + 1) + '" class="box day' + (i - day + 1) + ' ' + nazwyMiesiecy[miesiac + nextMonth] + (i - day + 1) + rok + " " + (i - day + 1) + " " + "today" + ' ">' + (i - day + 1) + '</div>';
         } else {
             document.querySelector('.test').innerHTML += '<div id="day_' + (i - day + 1) + '" class="box day' + (i - day + 1) + ' ' + nazwyMiesiecy[miesiac + nextMonth] + (i - day + 1) + rok + " " + (i - day + 1) + ' ">' + (i - day + 1) + '</div>';
         }
     }
     hasEvent();
 }
 const chwyt = document.getElementsByClassName('box');

 function clear() {
     document.querySelector(".test").innerHTML = "";
 }

 // SPRAWDZANIE JAKIE DNI MAJA EVENTY I WRZUCANIE IM KLASY KTORA DODA OZNACZENIE
 function hasEvent() {
     let eventDay = [];
     let days;

     let objectKey = [];
     const childDiv = document.createElement('div');
     for (i = 0; i < localStorage.length; i++) {
         key = localStorage.key(i);
         objectKey[i] = JSON.parse(localStorage.getItem(key));

         if (objectKey[i].miesiacWydarzeniaLiczba == miesiac && objectKey[i].rokWydarzenia == rok) {
             eventDay[i] = objectKey[i].dzienWydarzenia;
             NodeList.prototype.forEach = Array.prototype.forEach
             var children = document.querySelector('.test').childNodes;
             children.forEach(function (item) {
                 if (parseInt(item.classList.item(3)) == eventDay[i]) {
                     item.innerHTML += `
                    <div class='has-Event'></div>  
                     `
                 }
             });

         }
     }
 }

 function startTime() {
     let dzis = new Date();
     let h = dzis.getHours();
     let m = dzis.getMinutes();
     let s = dzis.getSeconds();
     m = checkTime(m);
     s = checkTime(s);
     document.querySelector('.clock').innerHTML =
         h + " : " + m + " : " + '<div class="sec">' + s + '</div>';
     let t = setTimeout(startTime, 500);
 }

 function checkTime(i) {
     if (i < 10) {
         i = "0" + i
     }; // dodaj zero jesli numer < 10
     return i;
 }

 window.onload = function () {
     drawMonth(nazwyMiesiecy, dzienTygodnia, dniTygodniaNazwa, day, rok, dniMiesiecyZwykly, nextMonth);
     startTime();


 };
 // Programowanie klikow na next miesiac i poprzedni miesiac
 let guzik = document.querySelector('.nextMonthButt');

 guzik.onclick = function (e) {
     miesiac++;
     day = new Date(rok, miesiac, 1).getDay();
     if (day === 0) {
         day = 7
     };
     if (e.preventDefault) {
         e.preventDefault();
     }
     e.returnValue = false;
     if (miesiac % 12 == 0) {
         miesiac = 0;
         rok++;
         console.log("pyrklo");
     }
     drawMonth(nazwyMiesiecy, dzienTygodnia, dniTygodniaNazwa, day, rok, dniMiesiecyZwykly, nextMonth);
 };

 // poprzedni miesiac
 let guzik2 = document.querySelector('.prevMonthButt');
 guzik2.onclick = function (e) {
     miesiac--;
     day = new Date(rok, miesiac, 1).getDay();
     if (day === 0) {
         day = 7
     };
     if (e.preventDefault) {
         e.preventDefault();
     }
     if (miesiac <= 0) {
         miesiac = 12;
         rok--;
     }
     e.returnValue = false;
     drawMonth(nazwyMiesiecy, dzienTygodnia, dniTygodniaNazwa, day, rok, dniMiesiecyZwykly, nextMonth);
 };

 // klikniecie dnia powoduje pojawienie sie okna 
 $('.test').on('click', '.box', pokazOkno);
 $('.test').on('click', '.box', getLocalStorage);

 function pokazOkno() {
     // wyciagniecie ktory dzien zostal klikniety
     let kliknietyDzienID = this.id;
     const dniMies = [];
     for (let i = 1; i <= 31; i++) {
         dniMies[i] = ["day_" + i];
     };
     let jakidzien = "";
     for (let i = 0; i < dniMies.length; i++) {
         if (dniMies[i] == kliknietyDzienID)
             jakidzien = i;
     }
     // przypisanie dnia do globalnej zmiennej
     kliknietyDzien = jakidzien;

     // wsadzenie forma w diva
     let formHTML = `
     <form id="calAdd" action="" method="post">
     <p>Dodaj akcję do kalendarza na dzien <span class="info-callAdd">` + jakidzien + ' ' + nazwyMiesiecy[miesiac] + `</span></p>
     <fieldset>
       <input id="nazWyd" placeholder="Nazwa wydarzenia" type="text" tabindex="1" required autofocus>
     </fieldset>
     <fieldset>
         <label for="timeFrom">Od : 
             <input id="timeFrom" type="time" tabindex="2" required autocomplete >  
                                 Do:
                                 <input id="timeTo" type="time" tabindex="3" required autocomplete>
         </label>
         
         
         
     </fieldset>
     <fieldset>
         <label for="timeFrom">Opisz przyszłe wydarzenie: </label><br>
         <textarea id="opisWyd" placeholder="Opis wydarzenia" type="textarea" tabindex="4" required autofocus rows="6" cols="30"></textarea>
     </fieldset>
     <button onClick="odbierz()"name="submit" type="submit" id="wrzucDane" data-submit="Wysylanie">Dodaj</button>
     
   </form>
                 `;
     document.querySelector('.addEvent').classList.add("pojaw");
     document.querySelector('.addEvent').innerHTML = formHTML;
     return kliknietyDzien;
 }
 // obslugiwanie local storage

 if (typeof (Storage) !== "undefined") {
     // Web Storage dostępny

 } else {
     // Web Storage nie wspierany
     console.log("niedostepny");
 }
 //RYSOWANIE ZRZUCONYCH W LOCAL STORAGE DANYCH NA APLIKACJE (HTML)   
 //proba wyciagniecia z local storage itemu oraz sparsowania go do obiektu spowrotem
 function getLocalStorage() {
     function clearPlace() {
         miejsce.innerHTML = "";
     }
     let i, ls = localStorage,
         l = ls.length,
         key, objectKey = [];
     const miejsce = document.querySelector('.zaplanowane-content');
     clearPlace();
     let info = [];
     // petla przelatuje cale localstorage, key lapie nazwy wydarzen
     for (i = 0; i < l; i++) {
         key = ls.key(i);
         objectKey[i] = JSON.parse(ls.getItem(key));

         //sprawdzam czy klikniety dzien ma odpowiedni zapis w storage
         if (objectKey[i].dzienWydarzenia === kliknietyDzien && objectKey[i].miesiacWydarzeniaLiczba == miesiac && objectKey[i].rokWydarzenia == rok) {
             info[i] = key;
             miejsce.innerHTML += `
    <div class="Planned-Events-Info" id="` + key + `" >
    <div class="exit-Box" title="Usunięcie wpisu z kalendarza"></div>
    <div class="eventDivKeeper"> 
        <span class="eventSpan-Name">
                Nazwa wydarzenia: 
        </span>
        
        <span class="eventSpan-FromTime">
                    Od której:  
        </span>
        <span class="eventSpan-ToTime">
                Do której:  
        </span>
        <span class="eventSpan-Desc">
                Opis Wydarzenia:  
        </span>
    </div>
    <div class="eventDivKeeper2"> 
            <span class="eventSpan-Name-js">
                    ` + objectKey[i].nazwaWydarzenia + `
            </span>
            
            <span class="eventSpan-FromTime-js">
                    ` + objectKey[i].odKiedy + `
            </span>
            <span class="eventSpan-ToTime-js">
                    ` + objectKey[i].doKiedy + `
            </span>
            <span class="eventSpan-Desc-js">
                    ` + objectKey[i].opisWydarzenia + ` 
            </span>
        </div>
    </div>`;
             $(".Planned-Events-Info").addClass('pojaw');

         }
     }
     // USUWANIE  WYBRANEGO ELEMENTU Z LOCAL STORAGE 

     $('.zaplanowane-content').on('click', '.exit-Box', function () {
         if (confirm('Czy jesteś pewny, że chcesz usunąć wpis z kalendarza?')) {
             localStorage.removeItem(this.parentElement.id);
             window.location.reload();
             hasEvent();

         } else {
             return;
         }
     });

 }