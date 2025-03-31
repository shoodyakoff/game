import { useState, useCallback } from 'react';

interface Character {
  items: string[];
  equippedItems: string[];
}

export const useCharacter = () => {
  const [character, setCharacter] = useState<Character>({
    items: [],
    equippedItems: []
  });

  const addItem = useCallback((itemId: string) => {
    setCharacter(prev => ({
      ...prev,
      items: [...new Set([...prev.items, itemId])]
    }));
  }, []);

  const equipItem = useCallback((itemId: string) => {
    setCharacter(prev => ({
      ...prev,
      equippedItems: [...new Set([...prev.equippedItems, itemId])]
    }));
  }, []);

  const unequipItem = useCallback((itemId: string) => {
    setCharacter(prev => ({
      ...prev,
      equippedItems: prev.equippedItems.filter(id => id !== itemId)
    }));
  }, []);

  const hasItem = useCallback((itemId: string) => {
    return character.items.includes(itemId);
  }, [character.items]);

  const isItemEquipped = useCallback((itemId: string) => {
    return character.equippedItems.includes(itemId);
  }, [character.equippedItems]);

  return {
    character,
    addItem,
    equipItem,
    unequipItem,
    hasItem,
    isItemEquipped
  };
}; 