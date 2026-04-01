class ConditionJs extends HTMLElement {
  static get observedAttributes() {
    return ['condition', 'expand'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._condition = null;
    this._expand = false;
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  disconnectedCallback() {
    // Cleanup if needed
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get condition() {
    return this._condition;
  }

  set condition(value) {
    this._condition = value;
    this.setAttribute('condition', JSON.stringify(value));
  }

  get expand() {
    return this._expand;
  }

  set expand(value) {
    this._expand = value === 'true' || value === true;
    this.setAttribute('expand', String(this._expand));
  }

  addEventListeners() {
    const cardHeader = this.shadowRoot.querySelector('.card-header');
    if (cardHeader) {
      cardHeader.addEventListener('click', () => this.toggleDetails());
    }
  }

  toggleDetails() {
    this._expand = !this._expand;
    this.setAttribute('expand', String(this._expand));
    
    // Dispatch custom event to notify parent
    const expandedEvent = new CustomEvent('expanded', {
      bubbles: true,
      composed: true,
      detail: { expanded: this._expand }
    });
    this.dispatchEvent(expandedEvent);
  }

  render() {
    // Parse condition from attribute if it's a string
    let condition = this._condition;
    if (typeof condition === 'string') {
      try {
        condition = JSON.parse(condition);
      } catch (e) {
        console.error('Failed to parse condition:', e);
        condition = null;
      }
    }

    // Parse expand from attribute
    let expand = this._expand;
    const expandAttr = this.getAttribute('expand');
    if (expandAttr !== null) {
      expand = expandAttr === 'true';
    }

    // Check if condition is available
    if (condition == null) {
      this.shadowRoot.innerHTML = '';
      return;
    }

    // Generate description HTML
    let descHtml = '';
    if (condition.desc && Array.isArray(condition.desc)) {
      descHtml = condition.desc.map(desc => 
        `<span>${desc}<br /><br /></span>`
      ).join('');
    }

    // Get active class based on expand state
    const activeClass = expand ? 'active' : '';

    this.shadowRoot.innerHTML = `
      <style>
        .card {
          margin-top: 5px;
          margin-left: 5px;
          width: 100%;
        }
        .card-header {
          align-content: center;
          display: grid;
          grid-template-columns: auto 110px;
        }
        .card-title {
          font-size: 1.5em;
          font-weight: 600;
          margin-bottom: 0;
        }
        .removeExtraLine {
          margin-bottom: -20px;
        }
        .card.active .card-body {
          display: block;
        }
      </style>
      <div class="card w-100 ${activeClass}">
        <div class="card-header clickable">
          <div class="card-title">${condition.name}</div>
        </div>
        <div class="card-body" style="${expand ? 'display: block;' : 'display: none;'}">
          <div class="card-text removeExtraLine">
            ${descHtml}
          </div>
        </div>
      </div>
    `;

    this.addEventListeners();
  }
}

// Register the custom element
customElements.define('condition-js', ConditionJs);
