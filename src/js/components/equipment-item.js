class EquipmentItemJs extends HTMLElement {
  constructor() {
    super();
    this._equipmentItem = null;
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
      <div class="card w-100" id="equipment-card">
        <div class="card-header clickable">
          <div onclick="this.dispatchEvent(new CustomEvent('toggle-details'))">
            <div class="card-title" id="item-name"></div>
            <div id="item-meta"><i></i></div>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="bookmarked" name="bookmarked">
            <label class="form-check-label" for="bookmarked">Bookmarked</label>
          </div>
        </div>
        <div class="card-body" id="item-details" style="display: none;"></div>
      </div>
    `;

    if (this._equipmentItem) {
      this.populateData(this._equipmentItem, expand);
    }

    // Setup event dispatching
    const toggleDetailsEl = this.querySelector('.clickable');
    if (toggleDetailsEl) {
      toggleDetailsEl.addEventListener('click', () => {
        const cardBody = this.querySelector('#item-details');
        
        // Toggle the display state
        const isCurrentlyExpanded = cardBody && cardBody.style.display !== 'none';
        const newExpandState = !isCurrentlyExpanded;
        
        // Update the display
        cardBody.style.display = newExpandState ? 'block' : 'none';
        
        // Update the expand attribute so Angular knows the new state
        this.setAttribute('expand', String(newExpandState));
        
        // Get the equipment item index from the data
        const index = this._equipmentItem?.index || '';
        
        // Dispatch event with the NEW expanded state (not the old one)
        this.dispatchEvent(new CustomEvent('expanded', { 
          detail: { expanded: newExpandState, index: index },
          bubbles: true,
          composed: true
        }));
      });
    }

    const bookmarkCheckbox = this.querySelector('#bookmarked');
    if (bookmarkCheckbox) {
      bookmarkCheckbox.addEventListener('click', (event) => {
        // Prevent the click from bubbling up to the card-header and toggling the card
        event.stopPropagation();
        
        const isBookmarked = bookmarkCheckbox.checked;
        
        // Update the equipment item's bookmarked property so Angular sees the change
        if (this._equipmentItem) {
          this._equipmentItem.bookmarked = isBookmarked;
        }
        
        // Get the equipment item index from the data
        const index = this._equipmentItem?.index || '';
        
        this.dispatchEvent(new CustomEvent('bookmarkChanged', { 
          detail: { bookmarked: isBookmarked, index: index },
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  set equipmentItem(value) {
    this._equipmentItem = value;
    const expand = this.getAttribute('expand') === 'true';
    if (value) {
      this.populateData(value, expand);
    }
  }

  get equipmentItem() {
    return this._equipmentItem;
  }

  populateData(equipmentItem, expand) {
    // Set name
    const nameEl = this.querySelector('#item-name');
    if (nameEl && equipmentItem.name) {
      nameEl.textContent = equipmentItem.name;
    }

    // Set metadata (category, cost, weight)
    const metaEl = this.querySelector('#item-meta i');
    if (metaEl && equipmentItem) {
      let metaText = `${equipmentItem.equipment_category}, cost ${equipmentItem.cost?.quantity || 0} ${equipmentItem.cost?.unit || ''}`;
      if (equipmentItem.weight) {
        metaText += `, weight ${equipmentItem.weight} lb.`;
      }
      metaEl.textContent = metaText;
    }

    // Set bookmark state
    const bookmarkCheckbox = this.querySelector('#bookmarked');
    if (bookmarkCheckbox && equipmentItem) {
      bookmarkCheckbox.checked = !!equipmentItem.bookmarked;
    }

    // Show/hide details
    const cardBody = this.querySelector('#item-details');
    if (cardBody) {
      cardBody.style.display = expand ? 'block' : 'none';
    }

    // Populate details if expanded
    if (expand && equipmentItem) {
      this.populateDetails(equipmentItem);
    }
  }

  populateDetails(equipmentItem) {
    const cardBody = this.querySelector('#item-details');
    if (!cardBody) return;

    let detailsHTML = '';

    // Category-specific details
    switch (equipmentItem.equipment_category) {
      case 'Adventuring Gear':
        detailsHTML += '<div><b>Category:</b>&nbsp;' + (equipmentItem.gear_category || '') + '<br />';
        if (equipmentItem.contents && equipmentItem.contents.length > 0) {
          detailsHTML += '<div><b>Contents:</b>&nbsp;' + this.getContents(equipmentItem.contents) + '<br /></div>';
        }
        detailsHTML += '</div>';
        break;

      case 'Armor':
        detailsHTML += '<div><b>Category:</b>&nbsp;' + (equipmentItem.armor_category || '') + '<br />';
        const acBase = equipmentItem.armor_class?.base || '';
        detailsHTML += '<div><b>Armor Class:</b>&nbsp;' + acBase;
        
        if (equipmentItem.armor_class?.dex_bonus) {
          detailsHTML += '&nbsp;+ DEX bonus';
        }
        
        if (equipmentItem.armor_class?.max_bonus != null) {
          detailsHTML += `&nbsp;(max ${equipmentItem.armor_class.max_bonus})`;
        }
        
        detailsHTML += '<br />';
        
        if (equipmentItem.str_minimum > 0) {
          detailsHTML += '<div><b>Strength Min:</b>&nbsp;' + equipmentItem.str_minimum + '<br /></div>';
        }
        
        if (equipmentItem.stealth_disadvantage) {
          detailsHTML += '<div><b>Disadvantages:</b>&nbsp;Stealth<br /></div>';
        }
        
        detailsHTML += '</div>';
        break;

      case 'Mounts and Vehicles':
        detailsHTML += '<div><b>Category:</b>&nbsp;' + (equipmentItem.vehicle_category || '') + '<br />';
        
        if (equipmentItem.speed) {
          const speedQty = equipmentItem.speed.quantity || 0;
          detailsHTML += '<div><b>Speed:</b>&nbsp;' + speedQty + ' ' + (equipmentItem.speed.unit || '') + 
            ` (${speedQty * 24} miles per day)<br /></div>`;
        }
        
        if (equipmentItem.capacity) {
          detailsHTML += '<div><b>Capacity:</b>&nbsp;' + equipmentItem.capacity + '<br /></div>';
        }
        
        if (equipmentItem.armor_class) {
          detailsHTML += '<div><b>Armor Class:</b>&nbsp;' + equipmentItem.armor_class + '<br /></div>';
        }
        
        if (equipmentItem.hit_points) {
          detailsHTML += '<div><b>Hit Points:</b>&nbsp;' + equipmentItem.hit_points + '<br /></div>';
        }
        
        if (equipmentItem.threshold) {
          detailsHTML += '<div><b>Damage Threshold:</b>&nbsp;' + equipmentItem.threshold + '<br /></div>';
        }
        
        if (equipmentItem.crew) {
          detailsHTML += '<div><b>Crew:</b>&nbsp;' + equipmentItem.crew + '<br /></div>';
        }
        
        if (equipmentItem.passengers) {
          detailsHTML += '<div><b>Passengers:</b>&nbsp;' + equipmentItem.passengers + '<br /></div>';
        }
        
        if (equipmentItem.cargo) {
          detailsHTML += '<div><b>Cargo:</b>&nbsp;' + equipmentItem.cargo.quantity + '&nbsp;' + (equipmentItem.cargo.unit || '') + '<br /></div>';
        }
        
        detailsHTML += '</div>';
        break;

      case 'Property':
        if (equipmentItem.construction_time) {
          detailsHTML += '<div><b>Construction Time:</b>&nbsp;' + equipmentItem.construction_time.quantity + ' ' + (equipmentItem.construction_time.unit || '') + '<br /></div>';
        }
        if (equipmentItem.maintenance_cost) {
          detailsHTML += '<div><b>Maintenance Cost:</b>&nbsp;' + equipmentItem.maintenance_cost.quantity + ' ' + (equipmentItem.maintenance_cost.unit || '') + ' ' + (equipmentItem.maintenance_cost.interval || '') + '<br /></div>';
        }
        if (equipmentItem.skilled_hirelings) {
          detailsHTML += '<div><b>Skilled Hirelings:</b>&nbsp;' + equipmentItem.skilled_hirelings + '<br /></div>';
        }
        if (equipmentItem.untrained_hirelings) {
          detailsHTML += '<div><b>Unskilled Hirelings:</b>&nbsp;' + equipmentItem.untrained_hirelings + '<br /></div>';
        }
        break;

      case 'Tools':
        detailsHTML += '<div><b>Category:</b>&nbsp;' + (equipmentItem.tool_category || '') + '<br /></div>';
        break;

      case 'Weapon':
        detailsHTML += '<div><b>Category:</b>&nbsp;' + (equipmentItem.weapon_category || '') + '<br />';
        
        if (equipmentItem.weapon_range === 'Meele') {
          detailsHTML += '<div><b>Range:</b>&nbsp;Meele<br /></div>';
        }
        
        if (equipmentItem.weapon_range === 'Ranged') {
          detailsHTML += '<div><b>Range:</b>&nbsp;normal ' + (equipmentItem.range?.normal || '') + 
            ' feet, long ' + (equipmentItem.range?.long || '') + ' feet<br /></div>';
        }
        
        if (equipmentItem.damage) {
          detailsHTML += '<div><b>Damage:</b>&nbsp;' + (equipmentItem.damage.damage_dice || '') + 
            ' ' + (equipmentItem.damage.damage_type?.name || '') + '<br /></div>';
        }
        
        if (equipmentItem.two_handed_damage) {
          detailsHTML += '<div><b>Two Handed Damage:</b>&nbsp;' + equipmentItem.two_handed_damage.damage_dice + 
            ' ' + equipmentItem.two_handed_damage.damage_type.name + '<br /></div>';
        }
        
        if (equipmentItem.throw_range) {
          detailsHTML += '<div><b>Throw Range:</b>&nbsp;normal ' + equipmentItem.throw_range.normal + 
            ' feet, long ' + equipmentItem.throw_range.long + ' feet<br /></div>';
        }
        
        if (equipmentItem.properties && equipmentItem.properties.length > 0) {
          detailsHTML += '<div><b>Properties:</b>&nbsp;' + this.getProperties(equipmentItem.properties) + '<br /></div>';
        }
        
        detailsHTML += '</div>';
        break;
    }

    // Description
    if (equipmentItem.desc && equipmentItem.desc.length > 0) {
      detailsHTML += '<div class="removeExtraLine"><hr><h5>Description</h5>';
      equipmentItem.desc.forEach(desc => {
        detailsHTML += '<span>' + desc + '<br /><br /></span>';
      });
      detailsHTML += '</div>';
    }

    // Special properties
    if (equipmentItem.special && equipmentItem.special.length > 0) {
      detailsHTML += '<div class="removeExtraLine"><hr><h5>Special</h5>';
      equipmentItem.special.forEach(special => {
        detailsHTML += '<span>' + special + '<br /><br /></span>';
      });
      detailsHTML += '</div>';
    }

    cardBody.innerHTML = detailsHTML;
  }

  getContents(contents) {
    let result = '';
    contents.forEach((content, index) => {
      if (index > 0) result += ', ';
      result += content.quantity + ' ' + content.item.name;
    });
    return result;
  }

  getProperties(properties) {
    let result = '';
    properties.forEach((prop, index) => {
      if (index > 0) result += ', ';
      result += prop;
    });
    return result;
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
      if (this._equipmentItem) {
        this.populateData(this._equipmentItem, expand);
      }
    }
  }
}

customElements.define('equipment-item-js', EquipmentItemJs);
