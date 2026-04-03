/**
 * MagicItem Component - Plain JavaScript implementation
 * Replaces Angular MagicItemComponent
 */

class MagicItemJs extends HTMLElement {
  constructor() {
    super();
    this._magicItem = null;
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
      <div class="card w-100" id="magic-item-card">
        <div class="card-header clickable">
          <div onclick="this.dispatchEvent(new CustomEvent('toggle-details'))">
            <div class="card-title"></div>
            <i></i><br />
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="bookmarked" name="bookmarked">
            <label class="form-check-label" for="bookmarked">Bookmarked</label>
          </div>
        </div>
        <div class="card-body">
          <div class="card-text removeExtraLine"></div>
        </div>
      </div>
    `;

    if (this._magicItem) {
      this.populateData(this._magicItem, expand);
    }

    // Setup event dispatching for toggle details
    const clickable = this.querySelector('.clickable');
    if (clickable) {
      clickable.addEventListener('click', () => {
        const cardBody = this.querySelector('.card-body');
        
        // Toggle the display state
        const isCurrentlyExpanded = cardBody && cardBody.style.display !== 'none';
        const newExpandState = !isCurrentlyExpanded;
        
        // Update the display
        cardBody.style.display = newExpandState ? 'block' : 'none';
        
        // Update the expand attribute so parent knows the new state
        this.setAttribute('expand', String(newExpandState));
        
        // Get the magic item index from the data
        const index = this._magicItem?.index || '';
        
        // Dispatch event with the NEW expanded state (not the old one)
        this.dispatchEvent(new CustomEvent('expanded', { 
          detail: { expanded: newExpandState, index: index },
          bubbles: true,
          composed: true
        }));
      });
    }

    // Setup bookmark checkbox
    const bookmarkCheckbox = this.querySelector('#bookmarked');
    if (bookmarkCheckbox) {
      bookmarkCheckbox.addEventListener('click', (event) => {
        event.stopPropagation();
        
        const isBookmarked = bookmarkCheckbox.checked;
        
        // Update the magic item's bookmarked property so parent sees the change
        if (this._magicItem) {
          this._magicItem.bookmarked = isBookmarked;
        }
        
        // Get the magic item index from the data
        const index = this._magicItem?.index || '';
        
        this.dispatchEvent(new CustomEvent('bookmarkChanged', { 
          detail: { bookmarked: isBookmarked, index: index },
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  set magicItem(value) {
    this._magicItem = value;
    const expand = this.getAttribute('expand') === 'true';
    if (value) {
      this.populateData(value, expand);
    }
  }

  get magicItem() {
    return this._magicItem;
  }

  populateData(magicItem, expand) {
    // Set name in card title
    const titleEl = this.querySelector('.card-title');
    if (titleEl && magicItem.name) {
      titleEl.textContent = magicItem.name;
    }

    // Set type, subtype, rarity, and attunement info
    const iEl = this.querySelector('.card-header i');
    if (iEl && magicItem) {
      let typeText = '';
      
      if (magicItem.type) {
        typeText += magicItem.type;
      }
      
      if (magicItem.subtype) {
        typeText += ` (${magicItem.subtype})`;
      }
      
      if (magicItem.rarity) {
        typeText += `, ${magicItem.rarity}`;
      }
      
      if (magicItem.requiresAttunement) {
        if (!magicItem.attunementRequirements) {
          typeText += ' (requires attunement)';
        } else if (magicItem.attunementRequirements) {
          typeText += ` (${magicItem.attunementRequirements})`;
        }
      }
      
      iEl.textContent = typeText;
    }

    // Set bookmark state
    const bookmarkCheckbox = this.querySelector('#bookmarked');
    if (bookmarkCheckbox && magicItem) {
      bookmarkCheckbox.checked = !!magicItem.bookmarked;
    }

    // Show/hide details based on expand state
    const cardBody = this.querySelector('.card-body');
    if (cardBody) {
      cardBody.style.display = expand ? 'block' : 'none';
    }

    // Populate details if expanded
    if (expand && magicItem) {
      this.populateDetails(magicItem);
    }
  }

  populateDetails(magicItem) {
    const cardTextEl = this.querySelector('.card-text');
    if (!cardTextEl || !magicItem) return;

    let descHTML = '';
    
    // Get description array - handle both 'desc' and 'description' properties
    const descArray = magicItem.desc || (magicItem.description ? [magicItem.description] : []);
    
    descArray.forEach((desc, index) => {
      // Use innerHTML to allow HTML content (like Angular's bypassSecurityTrustHtml)
      descHTML += `<span>${desc}</span>`;
    });

    cardTextEl.innerHTML = descHTML;
  }

  getStyle() {
    return `
      <style>
        .card {
          margin-top: 5px;
          margin-left: 5px;
          width: 100%;
        }
        .card.active {
          background-color: var(--background-color-inverse);
          border-radius: 5px;
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
      if (this._magicItem) {
        this.populateData(this._magicItem, expand);
      }
    }
  }
}

customElements.define('magic-item-js', MagicItemJs);
