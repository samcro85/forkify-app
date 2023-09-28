import * as model from './model.js';
import { MODAL_CLOSE_SECONDS } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

// Importiamo pure questo modulo anche se non viene utilizzato perchè il controller è il punto di accesso del documento
import addRecipeView from './views/addRecipeView.js';

// Importiamo delle librerie per le vecchie versioni dei browser
//import "core-js/stable";
import 'regenerator-runtime/runtime';

///////////////////////////////////////
// per installare l'ultima versione di parcel, o software in generale, da terminale digitiamo: npm i parcel@next -D

// if (module.hot) {
//   module.hot.accept();
// }
///////////////////// ------ FUNCTIONS ------- /////////////////////

// Creiamo una funziona che faccia le richieste HTTP per avere le ricette
const controlRecipes = async function () {
  try {
    // Memorizziamo l'hash dell'URL
    const id = window.location.hash.slice(1);

    // mettiamo una clausola di guardia in modo che se non ci sia id esce dall'applicazione
    if (!id) return;
    // Facciamo apparire lo spinner
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultPage());

    bookmarksView.update(model.state.bookmarks);
    // 1. Load Recipe
    await model.loadRecipe(id);

    ////////////// ------- 2. RENDER RECIPE ------ /////////////////
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
    console.error(error);
  }
};

// Attacchiamo un elent listener all'oggetto window al cambio dell'hash dell' URL
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
// // Invece di duplicare il codice solo per il cambio di eventi

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultPage());
    console.log(model.state.search);

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Aggiornare le porzioni della ricetta nell'oggetto 'state'
  model.updateServings(newServings);

  // Aggiornare la vista della ricetta
  // recipeView.render(model.state.recipe);

  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1. Add or Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  // console.log(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. Update view
  recipeView.update(model.state.recipe);

  // 3.Render bookmark View
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render the recipe
    recipeView.render(model.state.recipe);

    // Display success message
    addRecipeView.renderMessage();

    // Re- render bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // Ora dobbiamo cambiare l'id nell'URL senza ricaricare la pagina utilizzando l'API 'History'. L'oggetto 'history' ha un metodo 'pushState()' che prende 3 argomenti:
    //  1. 'state': lo impostiamo a 'null'
    //  2. 'title': non rilevante e lo impostismo ad una stringa vuota
    //  3. 'URL': mettiamo l'id preceduto dal simbolo hash '#'
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    (function () {
      return new Promise(resolve =>
        setTimeout(function () {
          resolve(addRecipeView._toggleWindow());
        }, MODAL_CLOSE_SECONDS * 1000)
      );
    })().then(() => setTimeout(() => addRecipeView._generateMarkup(), 1000));
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};

const newFeature = function () {
  console.log('Welcome to the application');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerBookmark(controlAddBookmark);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();
