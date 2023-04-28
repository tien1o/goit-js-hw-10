import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputArea = document.getElementById('search-box');
const listArea = document.querySelector('.country-list');
const infoArea = document.querySelector('.country-info');
const cleanMarkup = ref => (ref.innerHTML = '');

const renderMarkup = data => {
  if (data.length === 1) {
    cleanMarkup(listArea);
    const markupInfo = createInfo(data);
    infoArea.innerHTML = markupInfo;
  } else {
    cleanMarkup(infoArea);
    const markupList = createList(data);
    listArea.innerHTML = markupList;
  }
};

const inputString = e => {
  const textInput = e.target.value.trim();

  if (!textInput) {
    cleanMarkup(listArea);
    cleanMarkup(infoArea);
    return;
  }

  fetchCountries(textInput)
    .then(data => {
      console.log(data);

      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      renderMarkup(data);
    })

    .catch(error => {
      cleanMarkup(listArea);
      cleanMarkup(infoArea);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
};

const createList = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="40" height="20"><p>${name.official}</p></li>`
    )
    .join('');
};

const createInfo = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1><img src="${flags.png}" width="60" height="40"alt="${
        name.official
      }" width="40" height="40">${name.official}</h1>
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Languages: ${Object.entries(languages)
          .map(entry => entry[1])
          .join(', ')}</p>`
  );
};

inputArea.addEventListener('input', debounce(inputString, DEBOUNCE_DELAY));
