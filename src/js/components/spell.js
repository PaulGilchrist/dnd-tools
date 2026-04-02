/**
 * Spell Component - Plain JavaScript implementation
 * Replaces Angular SpellComponent
 */

class SpellJs extends HTMLElement {
  constructor() {
    super();
    this._spell = null;
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
      <div class="card w-100" [class.active]="expand">
        <div class="card-header clickable">
          <div onclick="this.dispatchEvent(new CustomEvent('toggle-details'))">
            <div class="card-title"></div>
            <i></i><br />
          </div>
          <div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="prepared" name="prepared">
              <label class="form-check-label" for="prepared">Prepared</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="known" name="known">
              <label class="form-check-label" for="known">Known</label>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="card-text">
            <div class="stats"></div>
            <hr>
            <div class="description"></div>
          </div>
        </div>
      </div>
    `;

    if (this._spell) {
      this.populateData(this._spell, expand);
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
        
        // Get the spell index from the data
        const index = this._spell?.index || '';
        
        // Dispatch event with the NEW expanded state (not the old one)
        this.dispatchEvent(new CustomEvent('expanded', { 
          detail: { expanded: newExpandState, index: index },
          bubbles: true,
          composed: true
        }));
      });
    }

    // Setup prepared checkbox
    const preparedCheckbox = this.querySelector('#prepared');
    if (preparedCheckbox) {
      preparedCheckbox.addEventListener('click', (event) => {
        event.stopPropagation();
        
        const isPrepared = preparedCheckbox.checked;
        
        // Update the spell's prepared property so parent sees the change
        if (this._spell) {
          this._spell.prepared = isPrepared;
        }
        
        // Get the spell index from the data
        const index = this._spell?.index || '';
        
        this.dispatchEvent(new CustomEvent('preparedChanged', { 
          detail: { prepared: isPrepared, index: index },
          bubbles: true,
          composed: true
        }));
      });
    }

    // Setup known checkbox
    const knownCheckbox = this.querySelector('#known');
    if (knownCheckbox) {
      knownCheckbox.addEventListener('click', (event) => {
        event.stopPropagation();
        
        const isKnown = knownCheckbox.checked;
        
        // Update the spell's known property so parent sees the change
        if (this._spell) {
          this._spell.known = isKnown;
          
          // A spell must be known to be prepared
          if (isKnown === false && this._spell.prepared === true) {
            this._spell.prepared = false;
            preparedCheckbox.checked = false;
            
            // Get the spell index from the data
            const index = this._spell?.index || '';
            
            this.dispatchEvent(new CustomEvent('preparedChanged', { 
              detail: { prepared: false, index: index },
              bubbles: true,
              composed: true
            }));
          }
        }
        
        // Get the spell index from the data
        const index = this._spell?.index || '';
        
        this.dispatchEvent(new CustomEvent('knownChanged', { 
          detail: { known: isKnown, index: index },
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  set spell(value) {
    this._spell = value;
    const expand = this.getAttribute('expand') === 'true';
    if (value) {
      this.populateData(value, expand);
    }
  }

  get spell() {
    return this._spell;
  }

  populateData(spell, expand) {
    // Set name in card title
    const titleEl = this.querySelector('.card-title');
    if (titleEl && spell.name) {
      titleEl.textContent = spell.name;
    }

    // Set level and school text
    const iEl = this.querySelector('.card-header i');
    if (iEl && spell.level !== undefined) {
      let levelText = this.getLevelText(spell.level);
      const schoolText = spell.school ? spell.school.toLowerCase() : '';
      
      let ritualText = spell.ritual ? ' (ritual)' : '';
      
      iEl.textContent = `${levelText} ${schoolText}${ritualText}`;
    }

    // Set prepared checkbox state
    const preparedCheckbox = this.querySelector('#prepared');
    if (preparedCheckbox && spell) {
      // Disable prepared checkbox if not known
      preparedCheckbox.disabled = spell.known !== true;
      preparedCheckbox.checked = !!spell.prepared;
    }

    // Set known checkbox state
    const knownCheckbox = this.querySelector('#known');
    if (knownCheckbox && spell) {
      knownCheckbox.checked = !!spell.known;
    }

    // Show/hide details based on expand state
    const cardBody = this.querySelector('.card-body');
    if (cardBody) {
      cardBody.style.display = expand ? 'block' : 'none';
    }

    // Populate details if expanded
    if (expand && spell) {
      this.populateDetails(spell);
    }
  }

  populateDetails(spell) {
    // Set stats grid
    const statsEl = this.querySelector('.stats');
    if (!statsEl || !spell) return;

    let statsHTML = '<div>';
    
    // Casting time, range, components, duration
    if (spell.casting_time) {
      statsHTML += `<b>Casting Time:</b> ${spell.casting_time}<br />`;
    }
    if (spell.range) {
      statsHTML += `<b>Range:</b> ${spell.range}<br />`;
    }
    if (spell.components) {
      statsHTML += `<b>Components:</b> ${spell.components}`;
      if (spell.material) {
        statsHTML += `<span>(${spell.material})</span>`;
      }
      statsHTML += '<br />';
    }
    if (spell.duration) {
      let durationText = '';
      if (spell.concentration) {
        durationText += 'Concentration, ';
      }
      durationText += spell.duration;
      statsHTML += `<b>Duration:</b> ${durationText}<br />`;
    }
    
    statsHTML += '</div>';

    statsHTML += '<div>';
    
    // Classes
    if (spell.classes && spell.classes.length > 0) {
      let classes = '';
      spell.classes.forEach((spellClass, index) => {
        if (index > 0) classes += ', ';
        classes += spellClass;
      });
      statsHTML += `<b>Classes:</b> ${classes}<br />`;
    }

    // Area of effect
    if (spell.area_of_effect) {
      statsHTML += `<div><b>Area of Effect:</b> ${spell.area_of_effect.size} foot ${spell.area_of_effect.type}<br /></div>`;
    }

    // Damage type
    if (spell.damage) {
      statsHTML += `<div><b>Damage Type:</b> ${spell.damage.damage_type}<br /></div>`;
    }

    // DC
    if (spell.dc) {
      statsHTML += `<div><b>DC:</b> ${spell.dc.dc_type} (${spell.dc.dc_success})<br /></div>`;
    }

    statsHTML += '</div>';
    
    statsEl.innerHTML = statsHTML;

    // Set description
    const descEl = this.querySelector('.description');
    if (descEl && spell.desc) {
      let descHTML = '';
      spell.desc.forEach((description, index) => {
        // Use innerHTML to allow HTML content (like Angular's bypassSecurityTrustHtml)
        descHTML += `<div><span>${description}</span></div>`;
      });
      descEl.innerHTML = descHTML;
    }

    // Higher level text
    if (spell.higher_level) {
      const hr = document.createElement('hr');
      descEl.appendChild(hr);
      
      const higherLevelDiv = document.createElement('div');
      higherLevelDiv.innerHTML = `<br/><b>At higher levels.</b> ${spell.higher_level}<br />`;
      descEl.appendChild(higherLevelDiv);
    }
  }

  getClasses() {
    let classes = '';
    if (this._spell && this._spell.classes) {
      this._spell.classes.forEach((spellClass, index) => {
        if (index > 0) classes += ', ';
        classes += spellClass;
      });
    }
    return classes;
  }

  getLevelText(level) {
    switch (level) {
      case 0:
        return 'Cantrip';
      case 1:
        return '1st-level';
      case 2:
        return '2nd-level';
      case 3:
        return '3rd-level';
      default:
        return level + 'th-level';
    }
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
        .stats {
          display: grid;
          grid-template-columns: 1fr 1fr; 
        }
        ul {
          margin-bottom: 0;
          padding-bottom: 0;
        }
      </style>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && name === 'expand') {
      const expand = this.getAttribute('expand') === 'true';
      if (this._spell) {
        this.populateData(this._spell, expand);
      }
    }
  }
}

customElements.define('spell-js', SpellJs);
