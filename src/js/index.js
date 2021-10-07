import '/css/styles.css';
import Notiflix from 'notiflix';
const debounce = require('lodash.debounce');

import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const makeCountryList = arrChar => {
  const markup = arrChar
    .map(
      item => `<li class="country__item">
            <img src="${item.flags.svg}" alt="${item.name.common}" width="30" height="30">
            <span class="country__name">${item.name.common}</span>
            </li>`,
    )
    .join('');

  refs.list.innerHTML = markup;
};

const makeCountryInfo = item => {
  const markup = `<p class="country__title"><img src="${item.flags.svg}" alt="${
    item.name.common
  }" width="30" height="30">
  <span class="country__name">${item.name.common}</span></p>
              <p class="text"><span class="title">Capital:</span> ${item.capital}</p>
              <p class="text"><span class="title">Population:</span> ${item.population}</p>
              <p class="text"><span class="title">Languages:</span> ${[...Object.values(item.languages)].join(', ')}</p>`;

  refs.countryInfo.innerHTML = markup;
};

const clearData = () => {
  refs.countryInfo.innerHTML = '';
  refs.list.innerHTML = '';
}

const onInputClick = () => {
  const name = refs.input.value.trim();
  if (name.length === 0) {
    clearData();
    return;
  }
  else {
    fetchCountries(name)
    .then(data => {
      if (data.length > 1 && data.length < 10) {
        if (refs.countryInfo.textContent.length > 1) {
          refs.countryInfo.textContent = '';
        };
        return makeCountryList(data);
      }

      if (data.length === 1) {
        const country = data[0];
        if (refs.list.textContent.length > 1) {
          refs.list.textContent = '';
        };
        return makeCountryInfo(country);
      }

      if (data.length > 10) {
        clearData();
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
        return;
      }

      if (data.status === 404) {
        clearData();
        Notiflix.Notify.failure("Oops, there is no country with that name.");
        return;
      }
    })
    .catch(err => console.log(err));
  }

};

refs.input.addEventListener('input', debounce(onInputClick, DEBOUNCE_DELAY));
