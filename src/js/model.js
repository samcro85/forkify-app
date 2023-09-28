import { async } from "regenerator-runtime";
import { API_URL, RESULT_PER_PAGE, KEY } from "./config.js";
import { getJSON, postJSON } from "./helpers";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RESULT_PER_PAGE,
  },
  bookmarks: [],
};
// Creiamo una funzione che formatta i dati in arrivo
const createRecipeObject = function (data) {
  // Riformattiamo la proprietà data.recipe attraverso la destrutturazione
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

///////////// ----- LOADING RECIPE ------ //////////////////////
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    console.log(state.recipe);
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
    console.log(state.search.results);
  } catch (error) {
    throw error;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ingredient) => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

// Inizializziamo la varibile 'bookmarks' nel localStorage
const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add recipe to bookmarks state property
  state.bookmarks.push(recipe);

  // Dobbiamo ora segnare come 'bookmarked' la recipe per poter impostare uno stile nella recipeView
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete Bookmarked recipe from bookmark array
  const index = state.bookmarks.findIndex((element) => element.id === id);
  state.bookmarks.splice(index, 1);

  // Unbookmark the recipe
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

// Creiamo la funzione che all'avvio della pagina estragga il localStorage per rendere i dati disponibili
const init = function () {
  const storage = localStorage.getItem("bookmarks");

  // Se il localStorage esiste prendiamo i dati e li salviamo nell'oggetto state
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
console.log(state.bookmarks);

const deleteBookmarks = function () {
  localStorage.clear("bookmarks");
};

// Creiamo una funzione per mandare la ricetta alla 'Forkify App'
export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(newRecipe);
    // Dobbiamo prendere i dati e trasformarli nello stesso formato in cui l'API li invia
    // Prima di tutto dobbiamo mettere tutti gli ingredienti in un array
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ingredient) => {
        const ingredientsArray = ingredient[1]
          .split(",")
          .map((element) => element.trim());

        if (ingredientsArray.length !== 3)
          throw new Error("Wrong ingredients format!");

        const [quantity, unit, description] = ingredientsArray;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // Costruiamo l'ggetto che dobbiamo mandare nello stesso formato
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    const data = await postJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
