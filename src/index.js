import './sass/main.scss';
import 'regenerator-runtime/runtime';

import { error } from '@pnotify/core';
import "../node_modules/@pnotify/core/dist/PNotify.css";
import "../node_modules/@pnotify/core/dist/BrightTheme.css";

import _ from 'lodash';

import galleryCards from './templates/gallery_cards.hbs';
import fetchImage from './apiService';

const refs = {
    searchForm: document.querySelector('#js-search-form'),
    galleryContainer: document.querySelector('#js-gallery'),
    loadMoreBtn: document.querySelector('[data-action="load-more"]'),
    sQuery: '',
    pageToLoad: 1,    
}

refs.searchForm.addEventListener('input', _.debounce(onSearch, 500));
refs.loadMoreBtn.addEventListener('click', onBtnClick);

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
    
    fetchAndDraw();

    refs.loadMoreBtn.classList.remove("is-hidden");
}

async function fetchAndDraw() {
    try {
        const gallery = await fetchImage(refs.sQuery, refs.pageToLoad);
        
        if (gallery.hits.length === 0) {
            return error({
                text: "Requested images not found :/",
                delay: 1500
            });
        }

        createMarkup(gallery.hits);

        refs.galleryContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        });
        
    } catch (e) {
        console.log(e);
    }
}

function createMarkup(galleryList) {
    const galleryMarkup = galleryList.map(galleryCards).join('');
    refs.galleryContainer.insertAdjacentHTML('beforeend', galleryMarkup);
}

function onBtnClick() {
    refs.pageToLoad += 1;
    fetchAndDraw();    
}

function clearMarkup() {
    refs.galleryContainer.innerHTML = "";
    refs.loadMoreBtn.classList.add("is-hidden");
}

