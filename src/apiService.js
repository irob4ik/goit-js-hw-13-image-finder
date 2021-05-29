const API_KEY = "21847768-5e5b2f7eaa86d5895d80eb462";
const URL = "https://pixabay.com/api/?image_type=photo&orientation=horizontal&per_page=12&key=";

export default async function fetchCountries(searchQuery, page) {
    const response = await fetch(`${URL}${API_KEY}&q=${searchQuery}&page=${page}`);
    
    return await response.json();
}