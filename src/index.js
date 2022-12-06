import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import API from './fetchCountries';

const DEBOUNCE_DELAY = 300;


const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info'),
};

let inputValue = '';

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
    e.preventDefault();
    inputValue = e.target.value.trim();
    if (inputValue === '') {
        clearInput();
        return;
    }

    API.fetchCountries(inputValue)
        .then(markupCountries)
        .catch(onFetchError)
};

function markupCountries(countries) {
    clearInput();
    console.log(countries);
    if (countries.length > 10) {
        clearInput();
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        return;
    } else if (countries.length === 1) {
        clearInput();
        createCountryCard(countries);
        return;
    } else if (countries.length > 1 && countries.length < 10) {
        clearInput();
        createCountriesList(countries);
        return;
    }
};

function onFetchError(error) {
    if (error) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
    }
};

function createCountryCard(countries) {
    
    const countryCardMarkup = countries.map(({ name, capital, population, flags, languages }) => {
        let lang = '';
    for (let key in languages) {
        lang = languages[key];
    }
        return `<div class="country-info-card"><img class="country-flag" src="${flags.svg}" width="210" height="160" alt="flag">
        <h1 class="country-name">${name.official}</h1><div>
        <ul class="country-list"
        <li class="country-item">
        <p>Capital: ${capital}</p>
        </li>
        <li class="country-item">
        <p>Population: ${population}</p>
        </li>
        <li class="country-item">
        <p>Languages: ${lang}</p>
        </li>
        </ul>
        `
    })
        .join('');
    console.log(countryCardMarkup);
    refs.info.insertAdjacentHTML("beforeend", countryCardMarkup);
}

function createCountriesList(countries) {
    const countriesListMarkup = countries.map(({name, flags}) => {
        return `
        <li><img src="${flags.svg}" alt="flag" width="20" height="15"><span class="span-text">${name.official}</span></li>
        `
    }).join("");

    console.log(countriesListMarkup);
    refs.list.insertAdjacentHTML("beforeend", countriesListMarkup);
}

function clearInput() {
    refs.list.innerHTML = "";
    refs.info.innerHTML = "";
};





