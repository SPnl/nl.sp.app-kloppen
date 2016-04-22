/*jslint
    plusplus:true */
/*globals
    document */

var lib = (function () {
    'use strict';

    function hasClass(element, className) {
        if (element.className.indexOf(className) >= 0) {
            return true;
        }
        return false;
    }

    function addClass(element, className) {
        if (!hasClass(element)) {
            element.className += ' ' + className;
            return true;
        }
        return false;
    }

    function removeClass(element, className) {
        var classArray = element.className.split(' ');
        if (classArray.indexOf(className) >= 0) {
            classArray.splice(classArray.indexOf(className), 1);
            element.className =  classArray.join(' ');
            return true;
        }
        return false;
    }

    function createElement(tagName, className, content) {
        var element = document.createElement(tagName);
        if (typeof className === 'string') {
            element.className = className;
        }
        if (typeof content === 'string') {
            element.innerHTML = content;
        } else if (typeof content === 'object') {
            element.appendChild(content);
        }
        return element;
    }

    function createAppendElement(element, tagName, className, content) {
        return element.appendChild(createElement(tagName, className, content));
    }

    function createInput(type, name, id, className) {
        var element = document.createElement('input');
        element.setAttribute('type', type);
        element.setAttribute('name', name);
        if (typeof id === 'string') {
            element.setAttribute('id', id);
        }
        if (typeof className === 'string') {
            element.className = className;
        }
        return element;
    }

    function createAppendInput(element, type, name, id, className) {
        return element.appendChild(createInput(type, name, id, className));
    }

    function createButton(value, className, onClick) {
        var element = document.createElement('input');
        element.setAttribute('type', 'button');
        element.setAttribute('value', value);
        if (typeof className === 'string') {
            element.className = className;
        }
        if (typeof onClick === 'function') {
            element.addEventListener('click', onClick);
        }
        return element;
    }

    function createAppendButton(element, value, className, onClick) {
        return element.appendChild(createButton(value, className, onClick));
    }

    function removeElement(element) {
        return element.parentElement.removeChild(element);
    }

    function replaceElement(newElement, referenceElement) {
        return referenceElement.parentElement.replaceChild(newElement, referenceElement);
    }

    function insertAsFirstChild(newElement, referenceElement) {
        var firstChild = referenceElement.firstChild;
        if (firstChild) {
            return referenceElement.insertBefore(newElement, firstChild);
        }
        return referenceElement.appendChild(newElement);
    }

    function insertBefore(newElement, referenceElement) {
        referenceElement.parentElement.insertBefore(newElement, referenceElement);
    }

    function insertAfter(newElement, referenceElement) {
        var nextElement = referenceElement.nextSibling;
        if (nextElement) {
            return referenceElement.parentElement.insertBefore(newElement, nextElement);
        }
        return referenceElement.parentElement.appendChild(newElement);
    }

    function getMonthName(month, language) {
        var monthNames = {
            'English': [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ],
            'Dutch': [
                'Januari',
                'Februari',
                'Maart',
                'April',
                'Mei',
                'Juni',
                'Juli',
                'Augustus',
                'September',
                'Oktober',
                'November',
                'December'
            ]
        };
        if (month === undefined) {
            month = (new Date()).getMonth();
        }
        if (language === undefined) {
            language = 'English';
        }
        return monthNames[language][month];
    }

    function getByKeyValue(object, key, value) {
        var i;

        for (i in object) {
            if (object.hasOwnProperty(i)) {
                if (object[i][key] === value) {
                    return object[i];
                }
            }
        }

        return false;
    }

    function compareStringsAsIntegers(a, b) {
        return parseInt(a, 10) - parseInt(b, 10);
    }

    function tryParseJSON(input) {
        //adapted from http://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try
        try {
            var obj = JSON.parse(input);
            // Handle non-exception-throwing cases:
            // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
            // but... JSON.parse(null) returns 'null', and typeof null === "object", 
            // so we must check for that, too.
            if (obj && typeof obj === 'object' && obj !== null) {
                return obj;
            }
        } catch (ignore) {
            //
        }
        return false;
    }

    return {

        version: 20160417,

        //dom manipulation
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        createElement: createElement,
        createAppendElement: createAppendElement,
        createInput: createInput,
        createAppendInput: createAppendInput,
        createButton: createButton,
        createAppendButton: createAppendButton,
        removeElement: removeElement,
        replaceElement: replaceElement,
        insertAsFirstChild: insertAsFirstChild,
        insertBefore: insertBefore,
        insertAfter: insertAfter,

        //date and time functions
        getMonthName: getMonthName,

        //miscellaneous utilities
        getByKeyValue: getByKeyValue,
        compareStringsAsIntegers: compareStringsAsIntegers,
        tryParseJSON: tryParseJSON

    };
}());