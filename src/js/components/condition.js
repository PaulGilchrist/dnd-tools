/**
 * Condition Component - Plain JavaScript implementation
 * Replaces Angular ConditionComponent
 */

class ConditionJs extends HTMLElement {
  constructor() {
    super();
    this._condition = null;
  }

  static get observedAttributes() {
    return ['expand'];
  }

  connectedCallback() {
    // Get expand attribute - Angular converts boolean to string "true" or "false"
    const expand = this.getAttribute('expand') === 'true';

    // Apply template
    this.innerHTML = `
      ${this.getStyle()}
      <div class="card w-100" id="condition-card">
        <div class="card-header clickable" onclick="this.dispatchEvent(new CustomEvent('toggle-details'))">
          <div class="card-title"></div>
        </div>
        <div class="card-body" id="condition-details">
          <div class="card-text removeExtraLine"></div>
        </div>
      </div>
    `;

    if (this._condition) {
      this.populateData(this._condition, expand);
    }

    // Setup event dispatching for toggle details
    const clickable = this.querySelector('.clickable');
    if (clickable) {
      clickable.addEventListener('click', () => {
        const cardBody = this.querySelector('#condition-details');

        // Toggle the display state
        const isCurrentlyExpanded = cardBody && cardBody.style.display !== 'none';
        const newExpandState = !isCurrentlyExpanded;

        // Update the display
        cardBody.style.display = newExpandState ? 'block' : 'none';

        // Update the expand attribute so parent knows the new state
        this.setAttribute('expand', String(newExpandState));

        // Get the condition index from the data
        const index = this._condition?.index || '';

        // Dispatch event with the NEW expanded state (not the old one)
        this.dispatchEvent(new CustomEvent('expanded', {
          detail: { expanded: newExpandState, index: index },
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  set condition(value) {
    this._condition = value;
    const expand = this.getAttribute('expand') === 'true';
    if (value) {
      this.populateData(value, expand);
    }
  }

  get condition() {
    return this._condition;
  }

  populateData(condition, expand) {
    // Set name in card title
    const titleEl = this.querySelector('.card-title');
    if (titleEl && condition.name) {
      titleEl.textContent = condition.name;
    }

    // Show/hide details based on expand state
    const cardBody = this.querySelector('#condition-details');
    if (cardBody) {
      cardBody.style.display = expand ? 'block' : 'none';
    }

    // Populate details if expanded
    if (expand && condition) {
      this.populateDetails(condition);
    }
  }

  populateDetails(condition) {
    const detailsEl = this.querySelector('.card-text');
    if (!detailsEl || !condition) return;

    let detailsHTML = '';

    // Description
    if (condition.desc && condition.desc.length > 0) {
      condition.desc.forEach((description, index) => {
        detailsHTML += `<span>${description}<br /><br /></span>`;
      });
    }

    detailsEl.innerHTML = detailsHTML;
  }

  getStyle() {
    return `
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
        .clickable {
          cursor: pointer;
        }
        .removeExtraLine {
          margin-bottom: -20px;
        }
      </style>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && name === 'expand') {
      const expand = this.getAttribute('expand') === 'true';
      if (this._condition) {
        this.populateData(this._condition, expand);
      }
    }
  }
}

// Register custom element
customElements.define('condition-js', ConditionJs);
