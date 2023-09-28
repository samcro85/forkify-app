import icons from "url:../../img/icons.svg"; // Parcel 2

export default class View {
  _data;
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered
   * @param {boolean} [render=true] If false, return a markup string instead of render to the DOM
   * @returns {undefined | string} if render=false return a string
   * @this {Object} Point to the child class Object of View class that calls the method
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    // Inseriamo il blocco HTML alla pagina
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // Ora dobbiamo convertire il markup, che è una stringa, in un oggetto DOM utilizzando il metodo 'createContextualFragment()' e come parametro passiamo la stringa del markup
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // Creiamo un nuovo oggetto Element, che esiste ma non è ancora stato inserito nella finestra. Restituisce una 'NodeList' che dobbiamo convertire in array
    const newElements = Array.from(newDOM.querySelectorAll("*"));

    // Selezioniamo l'elemento già presente nel DOM e lo convertiamo in Array
    const currentElements = Array.from(
      this._parentElement.querySelectorAll("*")
    );
    // console.log(newElement);
    // console.log(newDOM);

    // Iteriamo tra gli elementi del nuovo array
    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];
      
      // Ora dobbiamo comparare 'element' con 'curEl', ed esiste un metodo chiamato 'isEqualNode()' dove in argomento si passa il nodo da comparare. Questo metodo compara il contenuto del nodo, anche se i nodi sono diversi.
      if (
        !newEl.isEqualNode(curEl) &&
        // newEl.innerHTML?.trim() !== ""
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        // Ora ci serve un metodo per determinare se un elemento contiene solo testo,perchè vogliamo sostituire solo quello. Si sfrutta una proprietà presente in tutti i nodi chiamata 'nodeValue'
        curEl.textContent = newEl.textContent;
      }
      // Ora dobbiamo aggiornare gli attributi che sono cambiati per ogni elemento. Utilizziamo la proprietà 'attributes' che restituisce un oggetto con tutti gli attributi dell'elemento
      if (!newEl.isEqualNode(curEl)) {
        // facciamo un loop tra tutti gli attributi del nuovo elemento che sono cambiati e li copiamo nel vecchio elemento
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    // Elimiano il div di dafault dal contenitore
    this._parentElement.innerHTML = "";
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    // Prima di inserire l'elemento figlio cancelliamo tutto il contenuto dell'elemento genitore.
    this._clear();

    // Inseriamo il markup dentro l'elemento genitore
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errorMessage) {
    const markup = ` <div class="error">
     <div>
       <svg>
         <use href="${icons}#icon-alert-triangle"></use>
       </svg>
     </div>
     <p>${message}</p>
   </div>`;
    // Prima di inserire l'elemento figlio cancelliamo tutto il contenuto dell'elemento genitore.
    this._clear();

    // Inseriamo il markup dentro l'elemento genitore
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message) {
    const markup = ` <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;

    // Prima di inserire l'elemento figlio cancelliamo tutto il contenuto dell'elemento genitore.
    this._clear();

    // Inseriamo il markup dentro l'elemento genitore
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
