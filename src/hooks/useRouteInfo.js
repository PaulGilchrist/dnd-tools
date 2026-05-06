import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import navRoutesConfig from '../config/navRoutes';

function useRouteInfo(ruleVersion) {
  const [selected, setSelected] = useState('');
  const location = useLocation();

  // Filter navRoutes based on ruleVersion
  // Dropdown items with requiredVersion that doesn't match are excluded
  // Items without requiredVersion are always included
  // If no ruleVersion is provided, include all items
  const navRoutes = navRoutesConfig.map(route => {
    if (route.type === 'dropdown' && route.items) {
      const filteredItems = ruleVersion
        ? route.items.filter(item => {
            return !item.requiredVersion || item.requiredVersion === ruleVersion;
          })
        : route.items;

      return {
        ...route,
        items: filteredItems
      };
    }
    return route;
  });

  const showDropdown = (name) => {
    return name === selected;
  };

  const handleSetSelected = (name) => {
    setSelected(prev => prev === name ? '' : name);
  };

  const isDropdownActive = (dropdownKey) => {
    const dropdown = navRoutes.find(route => route.key === dropdownKey && route.type === 'dropdown');

    if (!dropdown || !dropdown.items || dropdown.items.length === 0) {
      return false;
    }

    return dropdown.items.some(item => {
      return location.pathname.startsWith(item.path);
    });
  };

  return {
    navRoutes,
    selected,
    setSelected,
    showDropdown,
    handleSetSelected,
    isDropdownActive
  };
}

export default useRouteInfo;
