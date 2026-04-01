class EquipmentItemJs extends HTMLElement {
  connectedCallback() {
    // Get attributes/properties
    const equipmentItemStr = this.getAttribute('equipment-item');
    const expand = this.hasAttribute('expand');
    
    // Parse equipmentItem if provided
    let equipmentItem = null;
    if (equipmentItemStr) {
      try {
        equipmentItem = JSON.parse(equipmentItemStr);
      } catch (e) {
        console.error('Failed to parse equipment-item:', e);
      }
    }

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

    if (equipmentItem) {
      this.populateData(equipmentItem, expand);
    }

    // Setup event dispatching
    const toggleDetailsEl = this.querySelector('.clickable');
    if (toggleDetailsEl) {
      toggleDetailsEl.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('expanded'));
      });
    }

    const bookmarkCheckbox = this.querySelector('#bookmarked');
    if (bookmarkCheckbox) {
      bookmarkCheckbox.addEventListener('click', () => {
        const isBookmarked = bookmarkCheckbox.checked;
        this.dispatchEvent(new CustomEvent('bookmark-changed', { 
          detail: { bookmarked: isBookmarked } 
        }));
      });
    }
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

  static get observedAttributes() {
    return ['equipment-item', 'expand'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && name === 'equipment-item') {
      try {
        const equipmentItem = JSON.parse(newValue);
        this.populateData(equipmentItem, this.hasAttribute('expand'));
      } catch (e) {
        console.error('Failed to update equipment-item:', e);
      }
    }
  }
}

customElements.define('equipment-item-js', EquipmentItemJs);
