import View from "./View.js";
import icons from "url:../../img/icons.svg"; // Parcel 2

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _message = "Recipe was successfully uploaded!";
  // Selezioniamo tutti gli elementi a cui andremo a togliere la classe 'hidden'
  _overlay = document.querySelector(".overlay");
  _window = document.querySelector(".add-recipe-window");

  // Selezioniamo i bottoni di apertura e chiusura del modello
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  // Settiamo un costruttore perche all'avvio della pagina dobbiamo attaccare gli eventi al click
  constructor() {
    super();
    this.addHandlerShowForm();
    this.addHandlerHideForm();
  }
  _toggleWindow() {
    this._window.classList.toggle("hidden");
    this._overlay.classList.toggle("hidden");
  }

  addHandlerShowForm() {
    // Usiamo il metodo bind per collegare 'this' all'istanza della classe e non a '_btnOpen'
    this._btnOpen.addEventListener("click", this._toggleWindow.bind(this));
    
  }

  addHandlerHideForm() {
    this._btnClose.addEventListener("click", this._toggleWindow.bind(this));

    // Attacchiamo l'evento pure a questo elemento cosi anche se facciamo click fuori dal form, esso si chiude.
    this._overlay.addEventListener("click", this._toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();

      // Per raccogliere i dati da un form usiamo il costruttore 'FormData()' e come parametro passiamo un elemento 'form'.
      const formDataArray = [...new FormData(this)];
      const formDataObject = Object.fromEntries(formDataArray);

      handler(formDataObject);
    });
  }
  _generateMarkup() {
    const markup = `
    <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input value="TEST" required name="title" type="text" />
          <label>URL</label>
          <input value="TESTING" required name="sourceUrl" type="text" />
          <label>Image URL</label>
          <input value="TEST" required name="image" type="text" />
          <label>Publisher</label>
          <input value="TEST" required name="publisher" type="text" />
          <label>Prep time</label>
          <input value="23" required name="cookingTime" type="number" />
          <label>Servings</label>
          <input value="23" required name="servings" type="number" />
        </div>

        <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <label>Ingredient 1</label>
          <input
            value="0.5,kg,Rice"
            type="text"
            required
            name="ingredient-1"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 2</label>
          <input
            value="1,,Avocado"
            type="text"
            name="ingredient-2"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 3</label>
          <input
            value=",,salt"
            type="text"
            name="ingredient-3"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 4</label>
          <input
            type="text"
            name="ingredient-4"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 5</label>
          <input
            type="text"
            name="ingredient-5"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 6</label>
          <input
            type="text"
            name="ingredient-6"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
        </div>

        <button class="btn upload__btn">
          <svg>
            <use href="src/img/icons.svg#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
export default new AddRecipeView();
