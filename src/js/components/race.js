/**
 * Race Component - Plain JavaScript implementation
 * Replaces Angular RaceComponent
 */

class RaceJs extends HTMLElement {
  constructor() {
    super();
    this._race = null;
    this._expand = false;
  }

  static get observedAttributes() {
    return ['expand'];
  }

  connectedCallback() {
    // Get expand attribute - Angular converts boolean to string "true" or "false"
    this._expand = this.getAttribute('expand') === 'true';
    
    // Apply template
    this.innerHTML = `
      ${this.getStyle()}
      <div class="card w-100" id="race-card">
        <div class="card-header clickable">
          <div class="card-title"></div>
        </div>
        <div class="card-body" style="display: none;"></div>
      </div>
    `;

    if (this._race) {
      this.populateData(this._race, this._expand);
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
        
        // Dispatch event with the NEW expanded state (not the old one)
        this.dispatchEvent(new CustomEvent('expanded', { 
          detail: { expanded: newExpandState },
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  set race(value) {
    this._race = value;
    const expand = this.getAttribute('expand') === 'true';
    if (value) {
      this.populateData(value, expand);
    }
  }

  get race() {
    return this._race;
  }

  set expand(value) {
    this._expand = value;
    const expandStr = String(value);
    this.setAttribute('expand', expandStr);
    if (this._race) {
      this.populateData(this._race, value);
    }
  }

  get expand() {
    return this._expand;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && name === 'expand') {
      const expand = this.getAttribute('expand') === 'true';
      if (this._race) {
        this.populateData(this._race, expand);
      }
    }
  }

  populateData(race, expand) {
    // Set name in card title
    const titleEl = this.querySelector('.card-title');
    if (titleEl && race.name) {
      titleEl.textContent = race.name;
    }

    // Show/hide details based on expand state
    const cardBody = this.querySelector('.card-body');
    if (cardBody) {
      cardBody.style.display = expand ? 'block' : 'none';
    }

    // Populate details if expanded
    if (expand && race) {
      this.populateDetails(race);
    }
  }

  populateDetails(race) {
    const cardBody = this.querySelector('.card-body');
    if (!cardBody || !race) return;

    let detailsHTML = '';

    // Description
    if (race.desc) {
      detailsHTML += `${race.desc}<br/><br/>`;
    }

    // Ability Bonuses
    if (race.ability_bonuses && race.ability_bonuses.length > 0) {
      detailsHTML += `<b>Ability Bonuses:</b>&nbsp;${this.getAbilityBonuses(race.ability_bonuses)}<br />`;
    }

    // Ability Bonus Options
    if (race.ability_bonus_options) {
      detailsHTML += `<div><b>Ability Bonus Options:</b>&nbsp;${this.getAbilityBonusOptions(race.ability_bonus_options)}<br /></div>`;
    }

    // Speed
    if (race.speed) {
      detailsHTML += `<b>Speed:</b>&nbsp;${race.speed} feet<br />`;
    }

    // Starting Proficiencies
    if (race.starting_proficiencies && race.starting_proficiencies.length > 0) {
      detailsHTML += `<div><b>Starting Proficiencies:</b>&nbsp;${this.getNameString(race.starting_proficiencies)}<br /></div>`;
    }

    // Starting Proficiency Options
    if (race.starting_proficiency_options) {
      detailsHTML += `<div><b>Starting Proficiency Options:</b>&nbsp;Choose ${race.starting_proficiency_options.choose} - ${this.getNameString(race.starting_proficiency_options.from)}<br /></div>`;
    }

    // Separator before alignment/age/languages
    detailsHTML += '<hr>';

    // Alignment
    if (race.alignment) {
      detailsHTML += `<b>Alignment:</b>&nbsp;${race.alignment}<br /><br />`;
    }

    // Age
    if (race.age) {
      detailsHTML += `<b>Age:</b>&nbsp;${race.age}<br /><br />`;
    }

    // Languages
    if (race.languages && race.languages.length > 0) {
      detailsHTML += `<b>Languages:</b>&nbsp;${this.getNameString(race.languages)} - ${race.language_desc || ''}<br /><br />`;
    }

    // Language Options
    if (race.language_options) {
      detailsHTML += `<div><b>Language Options:</b>&nbsp;Choose ${race.language_options.choose} - ${this.getNameString(race.language_options.from)}<br /><br /></div>`;
    }

    // Size
    if (race.size) {
      detailsHTML += `<b>Size:</b>&nbsp;${race.size} - ${race.size_description || ''}<br />`;
    }

    // Traits
    if (race.traits && race.traits.length > 0) {
      detailsHTML += '<div class="removeExtraLine"><hr><h5>Traits</h5>';
      
      race.traits.forEach(trait => {
        detailsHTML += `<div>`;
        detailsHTML += `<b>${trait.name}</b> - <span>${this.sanitizeHtml(trait.desc)}</span><br />`;
        
        if (trait.details) {
          detailsHTML += `<div><br /><span>${this.sanitizeHtml(trait.details)}</span><br /></div>`;
        }

        // Trait-specific subtext
        if (trait.proficiencies || (trait.trait_specific && (trait.trait_specific.subtrait_options || trait.trait_specific.spell_options))) {
          detailsHTML += `<div class="subtext">`;
          
          if (trait.proficiencies && trait.proficiencies.length > 0) {
            detailsHTML += `<div><b>Proficiencies:</b>&nbsp;${this.getNameString(trait.proficiencies)}<br /></div>`;
          }

          if (trait.trait_specific && trait.trait_specific.subtrait_options) {
            detailsHTML += `<div><b>Options:</b>&nbsp;Choose ${trait.trait_specific.subtrait_options.choose} - ${this.getNameString(trait.trait_specific.subtrait_options.from)}<br /></div>`;
          }

          if (trait.trait_specific && trait.trait_specific.spell_options) {
            detailsHTML += `<div><b>Spell Options:</b>&nbsp;Choose ${trait.trait_specific.spell_options.choose} - ${this.getNameString(trait.trait_specific.spell_options.from)}<br /></div>`;
          }

          detailsHTML += `</div>`;
        }

        detailsHTML += `</div>`;
      });

      detailsHTML += '</div>';
    }

    // Subraces
    if (race.subraces && race.subraces.length > 0) {
      detailsHTML += '<div class="removeExtraLine"><hr><h5>Subraces</h5>';
      
      race.subraces.forEach(subrace => {
        detailsHTML += `<div>`;
        detailsHTML += `<strong>${subrace.name}</strong> - ${subrace.desc || ''}<br />`;
        detailsHTML += `<div class="subtext">`;

        // Subrace Ability Bonuses
        if (subrace.ability_bonuses && subrace.ability_bonuses.length > 0) {
          detailsHTML += `<div><b>Ability Bonuses:</b>&nbsp;${this.getAbilityBonuses(subrace.ability_bonuses)}<br /></div>`;
        }

        // Subrace Ability Bonus Options
        if (subrace.ability_bonus_options) {
          detailsHTML += `<div><b>Ability Bonus Options:</b>&nbsp;${this.getAbilityBonusOptions(subrace.ability_bonus_options)}<br /></div>`;
        }

        // Subrace Starting Proficiencies
        if (subrace.starting_proficiencies && subrace.starting_proficiencies.length > 0) {
          detailsHTML += `<div><b>Starting Proficiencies:</b>&nbsp;${this.getNameString(subrace.starting_proficiencies)}<br /></div>`;
        }

        // Subrace Starting Proficiency Options
        if (subrace.starting_proficiency_options) {
          detailsHTML += `<div><b>Starting Proficiency Options:</b>&nbsp;Choose ${subrace.starting_proficiency_options.choose} - ${this.getNameString(subrace.starting_proficiency_options.from)}<br /></div>`;
        }

        // Subrace Languages
        if (subrace.languages && subrace.languages.length > 0) {
          detailsHTML += `<div><b>Languages:</b>&nbsp;${this.getNameString(subrace.languages)} - ${subrace.language_desc || ''}<br /><br /></div>`;
        }

        // Subrace Language Options
        if (subrace.language_options) {
          detailsHTML += `<div><b>Language Options:</b>&nbsp;Choose ${subrace.language_options.choose} - ${this.getNameString(subrace.language_options.from)}<br /><br /></div>`;
        }

        // Subrace Traits
        if (subrace.racial_traits && subrace.racial_traits.length > 0) {
          detailsHTML += `<div><h5>Traits</h5>`;
          
          subrace.racial_traits.forEach(trait => {
            detailsHTML += `<div>`;
            detailsHTML += `<b>${trait.name}</b> - ${trait.desc || ''}<br />`;
            detailsHTML += `<div class="subtext">`;

            if (trait.proficiencies && trait.proficiencies.length > 0) {
              detailsHTML += `<div><b>Proficiencies:</b>&nbsp;${this.getNameString(trait.proficiencies)}<br /></div>`;
            }

            if (trait.trait_specific && trait.trait_specific.subtrait_options) {
              detailsHTML += `<div><b>Options:</b>&nbsp;Choose ${trait.trait_specific.subtrait_options.choose} - ${this.getNameString(trait.trait_specific.subtrait_options.from)}<br /></div>`;
            }

            if (trait.trait_specific && trait.trait_specific.spell_options) {
              detailsHTML += `<div><b>Spell Options:</b>&nbsp;Choose ${trait.trait_specific.spell_options.choose} - ${this.getNameString(trait.trait_specific.spell_options.from)}<br /></div>`;
            }

            detailsHTML += `</div></div>`;
          });

          detailsHTML += `</div>`;
        }

        detailsHTML += `<hr></div>`;
      });

      detailsHTML += '</div>';
    }

    // Page reference
    if (race.page) {
      detailsHTML += `<div>${race.book} (page ${race.page})</div>`;
    }

    cardBody.innerHTML = detailsHTML;
  }

  getAbilityBonuses(ability_bonuses) {
    let abilityBonuses = '';
    ability_bonuses.forEach((abilityBonus) => {
      abilityBonuses += `+${abilityBonus.bonus} ${abilityBonus.ability_score}, `;
    });
    return abilityBonuses.length > 0 ? abilityBonuses.substr(0, abilityBonuses.length - 2) : '';
  }

  getAbilityBonusOptions(ability_bonus_options) {
    let abilityBonusOptions = '';
    if (ability_bonus_options) {
      abilityBonusOptions += `Choose ${ability_bonus_options.choose} - `;
      ability_bonus_options.from.forEach((abilityBonusOption) => {
        abilityBonusOptions += `${abilityBonusOption.ability_score}, `;
      });
    }
    return abilityBonusOptions.length > 0 ? abilityBonusOptions.substr(0, abilityBonusOptions.length - 2) : '';
  }

  getNameString(names) {
    if (!names || names.length === 0) return '';
    let nameString = '';
    names.forEach((name) => {
      nameString += `${name}, `;
    });
    return nameString.length > 0 ? nameString.substr(0, nameString.length - 2) : '';
  }

  sanitizeHtml(html) {
    // Simple HTML sanitization - in Angular this was done with DomSanitizer.bypassSecurityTrustHtml
    // For security, we should escape HTML entities or use a proper sanitization library
    if (!html) return '';
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  getStyle() {
    return `
      <style>
        strong {
          font-size: 1.1em;
        }
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
        .subrace {
          border: 1px solid lightgray;
          border-radius: 5px;
          margin: 5px;
          padding: 5px;
        }
        .subtext {
          padding: 10px 20px;
        }
      </style>
    `;
  }
}

// Register custom element
customElements.define('race-js', RaceJs);