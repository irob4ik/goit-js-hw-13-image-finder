import './sass/main.scss';
import 'regenerator-runtime/runtime';

import { error } from '@pnotify/core';
import "../node_modules/@pnotify/core/dist/PNotify.css";
import "../node_modules/@pnotify/core/dist/BrightTheme.css";

import _ from 'lodash';

import galleryCards from './templates/gallery_cards.hbs';
import fetchImage from './js/apiService';

const refs = {
    searchForm: document.querySelector('#js-search-form'),
    galleryContainer: document.querySelector('#js-gallery'),
    loadMoreBtn: document.querySelector('[data-action="load-more"]'),
    sQuery: '',
    pageToLoad: 1,    
}

refs.searchForm.addEventListener('input', _.debounce(onSearch, 500));
refs.loadMoreBtn.addEventListener('click', onClick);

function onSearch(e) {
    clearMarkup();
    e.preventDefault();
    refs.sQuery = e.target.value;
    refs.pageToLoad = 1;

    if (refs.sQuery.trim() === '') {
        return error({
            text: "Please type something..",
            delay: 1500
        });
    }
    
    fetchRequest();

    refs.loadMoreBtn.classList.remove("is-hidden");    
}

async function fetchRequest() {
    try {
        const gallery = await fetchImage(refs.sQuery, refs.pageToLoad);
        createMarkup(gallery.hits);
    } catch (e) {
        console.log(e);

        return error({
        text: "Country not found",
        delay: 1500
        });
    }
}

function createMarkup(galleryList) {
    const galleryMarkup = galleryList.map(galleryCards).join('');
    refs.galleryContainer.insertAdjacentHTML('beforeend', galleryMarkup);
}

function onClick() {
    refs.pageToLoad += 1;
    fetchRequest();
}

function clearMarkup() {
    refs.galleryContainer.innerHTML = "";
    refs.loadMoreBtn.classList.add("is-hidden");
}

