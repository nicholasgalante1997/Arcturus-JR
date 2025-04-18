// For this demo, we'll use hardcoded card data instead of making actual API calls
// In a real application, you would use fetch() to call the actual API

export const fetchPokemonCards = () => {
  // This is sample data that would normally come from the API
  return Promise.resolve([
    {
      id: 'xy1-1',
      name: 'Venusaur-EX',
      supertype: 'Pokémon',
      subtypes: ['Basic', 'EX'],
      hp: '180',
      types: ['Grass'],
      evolvesFrom: null,
      abilities: [
        {
          name: 'Resilient Life',
          text: 'Once during your turn (before your attack), you may attach a Grass Energy card from your discard pile to 1 of your Pokémon.',
          type: 'Ability'
        }
      ],
      attacks: [
        {
          cost: ['Grass', 'Grass', 'Colorless'],
          name: 'Jungle Hammer',
          text: 'Discard an Energy attached to this Pokémon.',
          damage: '120',
          convertedEnergyCost: 3
        }
      ],
      weaknesses: [
        {
          type: 'Fire',
          value: '×2'
        }
      ],
      retreatCost: ['Colorless', 'Colorless', 'Colorless', 'Colorless'],
      rarity: 'Rare Holo EX',
      images: {
        small: 'https://images.pokemontcg.io/xy1/1.png',
        large: 'https://images.pokemontcg.io/xy1/1_hires.png'
      }
    },
    {
      id: 'sm1-1',
      name: 'Caterpie',
      supertype: 'Pokémon',
      subtypes: ['Basic'],
      hp: '50',
      types: ['Grass'],
      evolvesTo: ['Metapod'],
      attacks: [
        {
          name: 'Nap',
          cost: ['Colorless'],
          convertedEnergyCost: 1,
          damage: '',
          text: 'Heal 20 damage from this Pokémon.'
        },
        {
          name: 'Gnaw',
          cost: ['Grass'],
          convertedEnergyCost: 1,
          damage: '10',
          text: ''
        }
      ],
      weaknesses: [
        {
          type: 'Fire',
          value: '×2'
        }
      ],
      retreatCost: ['Colorless'],
      rarity: 'Common',
      images: {
        small: 'https://images.pokemontcg.io/sm1/1.png',
        large: 'https://images.pokemontcg.io/sm1/1_hires.png'
      }
    },
    {
      id: 'swsh4-1',
      name: 'Weedle',
      supertype: 'Pokémon',
      subtypes: ['Basic'],
      hp: '40',
      types: ['Grass'],
      evolvesTo: ['Kakuna'],
      attacks: [
        {
          name: 'Call for Family',
          cost: ['Grass'],
          convertedEnergyCost: 1,
          damage: '',
          text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Then, shuffle your deck.'
        }
      ],
      weaknesses: [
        {
          type: 'Fire',
          value: '×2'
        }
      ],
      retreatCost: ['Colorless'],
      rarity: 'Common',
      images: {
        small: 'https://images.pokemontcg.io/swsh4/1.png',
        large: 'https://images.pokemontcg.io/swsh4/1_hires.png'
      }
    },
    {
      id: 'swsh1-1',
      name: 'Celebi V',
      supertype: 'Pokémon',
      subtypes: ['Basic', 'V'],
      hp: '180',
      types: ['Grass'],
      rules: ['V rule: When your Pokémon V is Knocked Out, your opponent takes 2 Prize cards.'],
      attacks: [
        {
          name: 'Find a Friend',
          cost: ['Grass'],
          convertedEnergyCost: 1,
          damage: '',
          text: 'Search your deck for a Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.'
        },
        {
          name: 'Line Force',
          cost: ['Grass', 'Colorless'],
          convertedEnergyCost: 2,
          damage: '50+',
          text: 'This attack does 20 more damage for each of your Benched Pokémon.'
        }
      ],
      weaknesses: [
        {
          type: 'Fire',
          value: '×2'
        }
      ],
      retreatCost: ['Colorless'],
      rarity: 'Ultra Rare',
      images: {
        small: 'https://images.pokemontcg.io/swsh1/1.png',
        large: 'https://images.pokemontcg.io/swsh1/1_hires.png'
      }
    },
    {
      id: 'sm115',
      name: 'Charizard-GX',
      supertype: 'Pokémon',
      subtypes: ['Stage 2', 'GX'],
      hp: '250',
      types: ['Fire'],
      evolvesFrom: 'Charmeleon',
      abilities: [
        {
          name: 'Flare Blitzer',
          text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon, you may discard any number of Fire Energy cards from your hand. This Pokémon does 50 more damage for each card you discarded in this way.',
          type: 'Ability'
        }
      ],
      attacks: [
        {
          cost: ['Fire', 'Fire', 'Colorless'],
          name: 'Crimson Storm',
          text: 'Discard 2 Energy from this Pokémon.',
          damage: '300',
          convertedEnergyCost: 3
        }
      ],
      rules: ["You can't use more than 1 GX attack in a game."],
      weaknesses: [
        {
          type: 'Water',
          value: '×2'
        }
      ],
      retreatCost: ['Colorless', 'Colorless', 'Colorless'],
      rarity: 'Rare Ultra',
      images: {
        small: 'https://images.pokemontcg.io/sm115/1.png',
        large: 'https://images.pokemontcg.io/sm115/1_hires.png'
      }
    }
  ]);
};
