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
    } else {
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
    let lang = '';
    for (let key in languages) {
        lang = languages[key];
    }
    const countryCardMarkup = countries.map(country => {
        return `<div class="country-info-card"><img class="country-flag" src="${country.flags.svg}" alt="flag">
        <h1 class="country-name">${country.name.official}</h1><div>
        <ul class="country-list"
        <li class="country-item">
        <p>Capital: ${country.capital}</p>
        </li>
        <li class="country-item">
        <p>Population: ${country.population}</p>
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
    const countriesListMarkup = countries.map(country => {
        return `
        <li><img src="${flags.svg}" alt="flag" width="20" height="15">${country.name.official}</li>
        `
    }).join("");

    console.log(countriesListMarkup);
    refs.list.insertAdjacentHTML("beforeend", countriesListMarkup);
}

function clearInput() {
    refs.list.innerHTML = "";
    refs.info.innerHTML = "";
};





