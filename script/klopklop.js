/*jshint
    camelcase:false, trailing:true */
/*jslint
    plusplus:true */
/*globals
    localStorage,
    navigator, document, location, window, event,
    alert, confirm,
    XMLHttpRequest,
    lib */

(function () {
    'use strict';

    var screens = {
            'spinner': {
                'divElement': document.getElementById('spinner'),
                'title': document.getElementById('spinnerTitle'),
                'message': document.getElementById('spinnerMessage')
            },
            'alert': {
                'divElement': document.getElementById('alert'),
                'title': document.getElementById('alertTitle'),
                'message': document.getElementById('alertMessage'),
                'buttonOk': document.getElementById('alertButtonOk')
            },
            'confirm': {
                'divElement': document.getElementById('confirm'),
                'title': document.getElementById('confirmTitle'),
                'message': document.getElementById('confirmMessage'),
                'buttonNo': document.getElementById('confirmButtonNo'),
                'buttonYes': document.getElementById('confirmButtonYes')
            },
            'home': {
                'divElement': document.getElementById('home'),
                'buttonAddressSelect': document.getElementById('homeButtonAddressSelect'),
                'buttonResults': document.getElementById('homeButtonResults'),
                'buttonClearLocalStorage': document.getElementById('homeButtonClearLocalStorage')
            },
            'results': {
                'divElement': document.getElementById('results'),
                'buttonBack': document.getElementById('resultsButtonBack'),
                'recipientEmail':  document.getElementById('recipientEmail'),
                'buttonSend': document.getElementById('resultsButtonSend'),
                'list': document.getElementById('resultsList')
            },
            'addressSelect': {
                'divElement': document.getElementById('addressSelect'),
                'municipality': document.getElementById('municipality'),
                'streetName': document.getElementById('streetName'),
                'houseNumber': document.getElementById('houseNumber'),
                'houseNumberAddon': document.getElementById('houseNumberAddon'),
                'buttonQuit': document.getElementById('addressSelectButtonQuit'),
                'buttonOk': document.getElementById('addressSelectButtonOk')
            },
            'doorKnockResult': {
                'divElement': document.getElementById('doorKnockResult'),
                'currentAddress': document.getElementById('currentAddress'),
                'buttonInterested': document.getElementById('doorKnockResultButtonInterested'),
                'buttonNotInterested': document.getElementById('doorKnockResultButtonNotInterested'),
                'buttonNotHome': document.getElementById('doorKnockResultButtonNotHome'),
                'buttonCancel': document.getElementById('doorKnockResultButtonCancel')
            },
            'respondentForm': {
                'divElement': document.getElementById('respondentForm'),
                'firstName': document.getElementById('firstName'),
                'lastName': document.getElementById('lastName'),
                'phone': document.getElementById('phone'),
                'email': document.getElementById('email'),
                'buttonCancel': document.getElementById('respondentFormButtonCancel'),
                'buttonOk': document.getElementById('respondentFormButtonOk')
            },
            'canvasserForm': {
                'divElement': document.getElementById('canvasserForm'),
                'responseData': document.getElementById('responseData'),
                'notes': document.getElementById('notes'),
                'buttonCancel': document.getElementById('canvasserFormButtonCancel'),
                'buttonOk': document.getElementById('canvasserFormButtonOk')
            }
        },
        currentScreen,
        results = [],
        httpRequest;

    function resultsListItem(result) {
        var listItem = lib.createElement('li');
        listItem.innerHTML =
            '<div class="resultOutcome">' + result.outcome + '</div>' +
            '<div class="resultMunicipality">' + result.municipality + '</div>' +
            '<div class="resultAddress">' +
                result.streetName + ' ' +
                result.houseNumber +
                (typeof result.houseNumberAddon === 'string' ? ' ' + result.houseNumberAddon : '') +
            '</div>' +
            '<div class="resultName">' +
                (typeof result.firstName === 'string' ? result.firstName + ' ' : '') +
                (typeof result.lastName === 'string' ? result.lastName : '') +
            '</div>' +
            '<div class="resultPhone">' + (typeof result.phone === 'string' ? result.phone : '') + '</div>' +
            '<div class="resultEmail">' + (typeof result.email === 'string' ? result.email : '') + '</div>' +
            '<div class="resultNotes">' + (typeof result.notes === 'string' ? result.notes : '') + '</div>' +
            '<div class="resultTimeStamp">' + result.timeStamp + '</div>';
        return listItem;
    }

    function goTo(screenName) {
        var i;

        //prepare screen:
        switch (screenName) {
        case 'alert':
        case 'confirm':
            break;
        case 'home':
            //TO ADD: render message?
            //TO ADD: display previous address and result?
            break;
        case 'results':
            screens.results.list.innerHTML = '';
            for (i = results.length - 1; i >= 0; i--) {
                screens.results.list.appendChild(resultsListItem(results[i]));
            }
            break;
        case 'addressSelect':
            break;
        case 'doorKnockResult':
            screens.doorKnockResult.currentAddress.innerHTML =
                screens.addressSelect.streetName.value + ' ' +
                screens.addressSelect.houseNumber.value + ' ' +
                screens.addressSelect.houseNumberAddon.value;
            break;
        case 'respondentForm':
            //FIXME: remove all invalid classes
            break;
        case 'canvasserForm':
            screens.canvasserForm.responseData.innerHTML =
                '<div class="responseAddress">' +
                    'Adres: ' +
                    screens.addressSelect.streetName.value + ' ' +
                    screens.addressSelect.houseNumber.value + ' ' +
                    screens.addressSelect.houseNumberAddon.value +
                '</div>' +
                '<div class="responseName">' +
                    'Naam: ' +
                    screens.respondentForm.firstName.value + ' ' +
                    screens.respondentForm.lastName.value +
                '</div>' +
                '<div class="responsePhone">' +
                    'Telefoon: ' +
                    screens.respondentForm.phone.value +
                '</div>' +
                '<div class="responseEmail">' +
                    'E-mail: ' +
                    screens.respondentForm.email.value +
                '</div>';
            break;
        }

        //hide current screen:
        if (currentScreen) {
            currentScreen.style.display = 'none';
        }

        //go to new screen:
        currentScreen = screens[screenName].divElement;
        currentScreen.style.display = 'block';
    }

    function spinnerScreen(title, messageHTML) {
        screens.spinner.title.textContent = title;
        screens.spinner.message.innerHTML = messageHTML;
        goTo('spinner');
    }

    function alertScreen(title, messageHTML, okLabel, okFunction) {
        screens.alert.title.textContent = title;
        screens.alert.message.innerHTML = messageHTML;
        screens.alert.buttonOk.value = okLabel;
        screens.alert.buttonOk.onclick = okFunction;
        goTo('alert');
    }

    function confirmScreen(title, messageHTML, yesLabel, yesFunction, noLabel, noFunction) {
        screens.confirm.title.textContent = title;
        screens.confirm.message.innerHTML = messageHTML;
        screens.confirm.buttonYes.value = yesLabel;
        screens.confirm.buttonYes.onclick = yesFunction;
        screens.confirm.buttonNo.value = noLabel;
        screens.confirm.buttonNo.onclick = noFunction;
        goTo('confirm');
    }

    function cleanValidate(inputElement, dataType) {

        //clean:
        inputElement.value = inputElement.value.trim();

        //validate:
        switch (dataType) {
        case 'municipality':
        case 'streetName':
            if (inputElement.value.length === 0) {
                lib.addClass(inputElement, 'invalid');
                return false;
            }
            break;
        case 'houseNumber':
            if (inputElement.value.length === 0) {
                lib.addClass(inputElement, 'invalid');
                return false;
            }
            if (/\D/.test(inputElement.value)) { //regular expression
                lib.addClass(inputElement, 'invalid');
                return false;
            }
            break;
        case 'phone':
            if (inputElement.value.length > 0 && (
                    /[^\d\s+\-]/.test(inputElement.value) || //invalid character in phonenumber
                    !/(\d[\D]*){10}/.test(inputElement.value) //valid Dutch numbers have 10 digits
                )) { //regular expressions
                lib.addClass(inputElement, 'invalid');
                return false;
            }
            break;
        case 'email':
            if (inputElement.value.length > 0 &&
                    !(/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(inputElement.value))) { //regular expression
                lib.addClass(inputElement, 'invalid');
                return false;
            }
            break;
        case 'houseNumberAddon':
        case 'firstName':
        case 'lastName':
            //no validation
            break;
        }

        lib.removeClass(inputElement, 'invalid');
        return true;
    }

    function cleanValidateAddressSelect() {
        if (!cleanValidate(screens.addressSelect.municipality, 'municipality')) {
            screens.addressSelect.municipality.focus();
        } else if (!cleanValidate(screens.addressSelect.streetName, 'streetName')) {
            screens.addressSelect.streetName.focus();
        } else if (!cleanValidate(screens.addressSelect.houseNumber, 'houseNumber')) {
            screens.addressSelect.houseNumber.focus();
        } else if (!cleanValidate(screens.addressSelect.houseNumberAddon, 'houseNumberAddon')) {
            screens.addressSelect.houseNumberAddon.focus();
        } else {
            return true;
        }
        return false;
    }

    function cleanValidateRespondentForm() {
        if (!cleanValidate(screens.respondentForm.firstName, 'firstName')) {
            screens.respondentForm.firstName.focus();
        } else if (!cleanValidate(screens.respondentForm.lastName, 'lastName')) {
            screens.respondentForm.lastName.focus();
        } else if (!cleanValidate(screens.respondentForm.phone, 'phone')) {
            screens.respondentForm.phone.focus();
        } else if (!cleanValidate(screens.respondentForm.email, 'email')) {
            screens.respondentForm.email.focus();
        } else if (screens.respondentForm.phone.value.length === 0 &&
                screens.respondentForm.email.value.length === 0) {
            alert('Telefoon of E-mail moet ingevuld zijn.');
        } else {
            return true;
        }
        return false;
    }

    function saveResult(outcome) {

        var result = {};

        result.outcome = outcome;
        result.timeStamp = String((new Date()).getTime());

        result.municipality = screens.addressSelect.municipality.value.trim();
        result.streetName = screens.addressSelect.streetName.value.trim();
        result.houseNumber = screens.addressSelect.houseNumber.value.trim();

        if (screens.addressSelect.houseNumberAddon.value.trim().length > 0) {
            result.houseNumberAddon = screens.addressSelect.houseNumberAddon.value.trim();
        }

        if (outcome === 'interested') {
            if (screens.respondentForm.firstName.value.trim().length > 0) {
                result.firstName = screens.respondentForm.firstName.value.trim();
            }
            if (screens.respondentForm.lastName.value.trim().length > 0) {
                result.lastName = screens.respondentForm.lastName.value.trim();
            }
            if (screens.respondentForm.phone.value.trim().length > 0) {
                result.phone = screens.respondentForm.phone.value.trim();
            }
            if (screens.respondentForm.email.value.trim().length > 0) {
                result.email = screens.respondentForm.email.value.trim();
            }
            if (screens.canvasserForm.notes.value.trim().length > 0) {
                result.notes = screens.canvasserForm.notes.value.trim();
            }
        }

        //add result object to global results variable and save it to localStorage
        results.push(result);
        localStorage.results = JSON.stringify(results);

        //for debugging
        console.log(results);

        //clear inputs (except municipality and streetName, which are probably the same for the next door)
        screens.addressSelect.houseNumber.value = '';
        screens.addressSelect.houseNumberAddon.value = '';
        screens.respondentForm.firstName.value = '';
        screens.respondentForm.lastName.value = '';
        screens.respondentForm.phone.value = '';
        screens.respondentForm.email.value = '';
        screens.canvasserForm.notes.value = '';
    }

    function timeoutFunc() {
        alertScreen(
            'Oeps',
            '<p>De server reageert niet.</p>' +
                '<p>Waarschijnlijk is je verbinding weg.</p>',
            'Ok',
            function () { goTo('results'); }
        );
    }

    function errorFunc() {
        alertScreen(
            'Error',
            '<p>Er ging iets mis...</p>',
            'Ok',
            function () { goTo('results'); }
        );
    }

    function responseFunc(httpRequest) {
        var response = lib.tryParseJSON(httpRequest.responseText);
        if (httpRequest.status === 200) {
            if (response) {
                alertScreen(
                    'Computer says:',
                    '<p>' + response.result + '</p>',
                    'Ok',
                    function () { goTo('results'); }
                );
            } else {
                alertScreen(
                    'Error',
                    '<p>' + httpRequest.responseText + '</p>',
                    'Ok',
                    function () { goTo('results'); }
                );
            }
        } else {
            alertScreen(
                'Error',
                '<p>Status: ' + httpRequest.status + '</p>',
                'Ok',
                function () { goTo('results'); }
            );
        }
    }

    function sendResults() {
        var payload = {
                'timeSent': (new Date()).getTime(),
                'recipient': screens.results.recipientEmail.value,
                'results': results
            };

        localStorage.recipientEmail = screens.results.recipientEmail.value;

        httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', 'send.php', true);
        httpRequest.setRequestHeader('Content-Type', 'application/json');
        httpRequest.timeout = 12000;
        httpRequest.ontimeout = timeoutFunc;
        httpRequest.onerror = errorFunc;
        httpRequest.onload = function () {
            responseFunc(httpRequest);
        };
        httpRequest.send(JSON.stringify(payload));
    }

    if (!localStorage) {

        document.body.innerHTML =
            '<div class="alert screen red" style="display:block;">' +
                '<h1 id="alertTitle">ERROR</h1>' +
                '<div id="alertMessage">' +
                    '<p>Deze browser ondersteunt geen localStorage.</p>' +
                '</div>' +
            '</div>';

    } else {

        if (typeof localStorage.results === 'string') {
            results = JSON.parse(localStorage.results);
        } else {
            localStorage.results = JSON.stringify(results);
        }

        //home screen:
        screens.home.buttonResults.onclick = function () {
            if (typeof localStorage.recipientEmail === 'string') {
                screens.results.recipientEmail.value = localStorage.recipientEmail;
            }
            goTo('results');
        };
        screens.home.buttonAddressSelect.onclick = function () {
            if (typeof localStorage.municipality === 'string') {
                screens.addressSelect.municipality.value = localStorage.municipality;
            }
            if (typeof localStorage.streetName === 'string') {
                screens.addressSelect.streetName.value = localStorage.streetName;
            }
            screens.addressSelect.houseNumber.value = '';
            screens.addressSelect.houseNumberAddon.value = '';
            goTo('addressSelect');
        };
        screens.home.buttonClearLocalStorage.onclick = function () {
            confirmScreen(
                'Data wissen',
                '<p>Weet je zeker dat je alle lokaal opgeslagen data wil wissen?',
                'Wissen',
                function () {
                    localStorage.clear();
                    alertScreen(
                        'Gewist',
                        '<p>Alle lokaal opgeslagen data (localStorage) is gewist.</p>',
                        'Ok',
                        function () {window.location.reload(); }
                    );
                },
                'Annuleren',
                function () { goTo('home'); }
            );
        };

        //results screen:
        screens.results.buttonBack.onclick = function () { goTo('home'); };
        screens.results.recipientEmail.onblur = function () {
            cleanValidate(screens.results.recipientEmail, 'email');
        };
        screens.results.recipientEmail.oninput = function () {
            lib.removeClass(this, 'invalid');
        };
        screens.results.buttonSend.onclick = function () {
            if (cleanValidate(screens.results.recipientEmail, 'email')) {
                confirmScreen(
                    'Data versturen',
                    '<p>Wil je een email met al jouw resultaten naar ' +
                        screens.results.recipientEmail.value + ' sturen?</p>',
                    'Versturen',
                    function () {
                            spinnerScreen(
                                'Even geduld',
                                '<p>Wacht op antwoord van de server.</p>'
                            );
                            sendResults();
                        },
                    'Annuleren',
                    function () { goTo('results'); }
                );
            }
        };

        //addressSelect screen:
        screens.addressSelect.municipality.onblur = function () {
            cleanValidate(screens.addressSelect.municipality, 'municipality');
        };
        screens.addressSelect.municipality.oninput = function () {
            lib.removeClass(this, 'invalid');
        };
        screens.addressSelect.streetName.onblur = function () {
            cleanValidate(screens.addressSelect.streetName, 'streetName');
        };
        screens.addressSelect.streetName.oninput = function () {
            lib.removeClass(this, 'invalid');
        };
        screens.addressSelect.houseNumber.onblur = function () {
            cleanValidate(screens.addressSelect.houseNumber, 'houseNumber');
        };
        screens.addressSelect.houseNumber.oninput = function () {
            lib.removeClass(this, 'invalid');
        };
        screens.addressSelect.houseNumberAddon.onblur = function () {
            cleanValidate(screens.addressSelect.houseNumberAddon, 'houseNumberAddon');
        };
        screens.addressSelect.houseNumberAddon.oninput = function () {
            lib.removeClass(this, 'invalid');
        };
        screens.addressSelect.buttonQuit.onclick =  function () { goTo('home'); };
        screens.addressSelect.buttonOk.onclick = function () {
            if (cleanValidateAddressSelect()) {
                localStorage.municipality = screens.addressSelect.municipality.value;
                localStorage.streetName = screens.addressSelect.streetName.value;
                goTo('doorKnockResult');
            }
        };

        //doorKnockresult screen:
        screens.doorKnockResult.buttonInterested.onclick = function () {
            goTo('respondentForm');
        };
        screens.doorKnockResult.buttonNotInterested.onclick = function () {
            saveResult('notInterested');
            confirmScreen(
                'Opgeslagen',
                '<p>Door naar de volgende deur?!</p>',
                'Ok',
                function () { goTo('addressSelect'); },
                'Stoppen',
                function () { goTo('home'); }
            );
        };
        screens.doorKnockResult.buttonNotHome.onclick = function () {
            saveResult('notHome');
            confirmScreen(
                'Opgeslagen',
                '<p>Door naar de volgende deur?!</p>',
                'Ok',
                function () { goTo('addressSelect'); },
                'Stoppen',
                function () { goTo('home'); }
            );
        };
        screens.doorKnockResult.buttonCancel.onclick =  function () { goTo('addressSelect'); };

        //respondentForm screen:
        screens.respondentForm.firstName.onblur = function () {
            cleanValidate(screens.respondentForm.firstName, 'firstName');
        };
        screens.respondentForm.firstName.oninput = function () {
            lib.removeClass(this, 'invalid');
        };
        screens.respondentForm.lastName.onblur = function () {
            cleanValidate(screens.respondentForm.lastName, 'lastName');
        };
        screens.respondentForm.lastName.oninput = function () {
            lib.removeClass(this, 'invalid');
        };
        screens.respondentForm.phone.onblur = function () {
            cleanValidate(screens.respondentForm.phone, 'phone');
        };
        screens.respondentForm.phone.oninput = function () {
            lib.removeClass(this, 'invalid');
        };
        screens.respondentForm.email.onblur = function () {
            cleanValidate(screens.respondentForm.email, 'email');
        };
        screens.respondentForm.email.oninput = function () {
            lib.removeClass(this, 'invalid');
        };
        screens.respondentForm.buttonCancel.onclick =  function () { goTo('doorKnockResult'); };
        screens.respondentForm.buttonOk.onclick = function () {
            if (cleanValidateRespondentForm()) {
                alertScreen(
                    'Bedankt!',
                    '<p>Geef nu de telefoon of tablet terug.</p>',
                    'Ok',
                    function () { goTo('canvasserForm'); }
                );
            }
        };

        //canvasserForm screen:
        screens.canvasserForm.buttonCancel.onclick =  function () { goTo('respondentForm'); };
        screens.canvasserForm.buttonOk.onclick = function () {
            saveResult('interested');
            confirmScreen(
                'Opgeslagen!',
                '<p>Door naar de volgende deur?</p>',
                'Ok',
                function () { goTo('addressSelect'); },
                'Stoppen',
                function () { goTo('home'); }
            );
        };

        goTo('home'); //render home screen

    }

}());