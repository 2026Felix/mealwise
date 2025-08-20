import { Recipe } from '../types'

type Difficulty = 'easy' | 'medium' | 'hard'
type Category = 'vegetables' | 'carbs' | 'protein' | 'dairy'

function make(
  id: number,
  name: string,
  ingredients: Array<{ name: string; quantity: number; unit: string }>,
  prepTime: number,
  category: Category,
  difficulty: Difficulty = 'easy'
): Recipe {
  return { id: String(id), name, ingredients, prepTime, category, difficulty }
}

const baseRecipes: Recipe[] = [
  make(1, 'Köttbullar med potatismos', [
    { name: 'Nötfärs', quantity: 400, unit: 'g' },
    { name: 'Potatis', quantity: 600, unit: 'g' },
    { name: 'Lök', quantity: 1, unit: 'st' },
    { name: 'Grädde', quantity: 100, unit: 'ml' }
  ], 40, 'protein', 'medium'),

  make(2, 'Korv Stroganoff', [
    { name: 'Falukorv', quantity: 400, unit: 'g' },
    { name: 'Krossade tomater', quantity: 400, unit: 'g' },
    { name: 'Lök', quantity: 1, unit: 'st' },
    { name: 'Grädde', quantity: 100, unit: 'ml' }
  ], 30, 'protein', 'easy'),

  make(3, 'Kalops', [
    { name: 'Högrev', quantity: 600, unit: 'g' },
    { name: 'Lök', quantity: 2, unit: 'st' },
    { name: 'Morot', quantity: 2, unit: 'st' },
    { name: 'Buljong', quantity: 600, unit: 'ml' }
  ], 90, 'protein', 'medium'),

  make(4, 'Dillkött', [
    { name: 'Kalvkött', quantity: 600, unit: 'g' },
    { name: 'Grädde', quantity: 200, unit: 'ml' },
    { name: 'Dill', quantity: 1, unit: 'kruka' },
    { name: 'Buljong', quantity: 600, unit: 'ml' }
  ], 80, 'protein', 'medium'),

  make(5, 'Ugnspannkaka', [
    { name: 'Mjölk', quantity: 600, unit: 'ml' },
    { name: 'Mjöl', quantity: 250, unit: 'g' },
    { name: 'Ägg', quantity: 3, unit: 'st' },
    { name: 'Bacon', quantity: 150, unit: 'g' }
  ], 40, 'carbs', 'easy'),

  make(6, 'Janssons frestelse', [
    { name: 'Potatis', quantity: 700, unit: 'g' },
    { name: 'Ansjovis', quantity: 120, unit: 'g' },
    { name: 'Lök', quantity: 1, unit: 'st' },
    { name: 'Grädde', quantity: 300, unit: 'ml' }
  ], 60, 'carbs', 'medium'),

  make(7, 'Raggmunk med fläsk', [
    { name: 'Potatis', quantity: 600, unit: 'g' },
    { name: 'Mjölk', quantity: 300, unit: 'ml' },
    { name: 'Mjöl', quantity: 120, unit: 'g' },
    { name: 'Rökt sidfläsk', quantity: 200, unit: 'g' }
  ], 45, 'carbs', 'medium'),

  make(8, 'Stekt strömming med mos', [
    { name: 'Strömmingsfilé', quantity: 400, unit: 'g' },
    { name: 'Potatis', quantity: 600, unit: 'g' },
    { name: 'Smör', quantity: 50, unit: 'g' },
    { name: 'Lingon', quantity: 100, unit: 'g' }
  ], 35, 'protein', 'medium'),

  make(9, 'Pytt i panna', [
    { name: 'Potatis', quantity: 500, unit: 'g' },
    { name: 'Lök', quantity: 1, unit: 'st' },
    { name: 'Nötfärs', quantity: 300, unit: 'g' },
    { name: 'Ägg', quantity: 2, unit: 'st' }
  ], 30, 'protein', 'easy'),

  make(10, 'Ärtsoppa', [
    { name: 'Gula ärtor', quantity: 300, unit: 'g' },
    { name: 'Fläsk', quantity: 200, unit: 'g' },
    { name: 'Lök', quantity: 1, unit: 'st' },
    { name: 'Vatten', quantity: 1000, unit: 'ml' }
  ], 90, 'protein', 'medium'),

  make(11, 'Wallenbergare', [
    { name: 'Kalvfärs', quantity: 400, unit: 'g' },
    { name: 'Grädde', quantity: 150, unit: 'ml' },
    { name: 'Äggula', quantity: 2, unit: 'st' },
    { name: 'Potatis', quantity: 500, unit: 'g' }
  ], 45, 'protein', 'medium'),

  make(12, 'Biff à la Lindström', [
    { name: 'Nötfärs', quantity: 500, unit: 'g' },
    { name: 'Rödbetor', quantity: 150, unit: 'g' },
    { name: 'Kapris', quantity: 2, unit: 'msk' },
    { name: 'Lök', quantity: 1, unit: 'st' }
  ], 40, 'protein', 'medium'),

  make(13, 'Kåldolmar', [
    { name: 'Vitkål', quantity: 1, unit: 'st' },
    { name: 'Blandfärs', quantity: 500, unit: 'g' },
    { name: 'Ris', quantity: 100, unit: 'g' },
    { name: 'Lök', quantity: 1, unit: 'st' }
  ], 80, 'protein', 'hard'),

  make(14, 'Kålpudding', [
    { name: 'Vitkål', quantity: 700, unit: 'g' },
    { name: 'Blandfärs', quantity: 500, unit: 'g' },
    { name: 'Sirap', quantity: 2, unit: 'msk' },
    { name: 'Lök', quantity: 1, unit: 'st' }
  ], 70, 'protein', 'medium'),

  make(15, 'Falukorv i ugn', [
    { name: 'Falukorv', quantity: 500, unit: 'g' },
    { name: 'Potatis', quantity: 600, unit: 'g' },
    { name: 'Lök', quantity: 1, unit: 'st' },
    { name: 'Ost', quantity: 100, unit: 'g' }
  ], 40, 'protein', 'easy'),

  make(16, 'Fiskpinnar med potatis', [
    { name: 'Fiskpinnar', quantity: 12, unit: 'st' },
    { name: 'Potatis', quantity: 600, unit: 'g' },
    { name: 'Citron', quantity: 1, unit: 'st' },
    { name: 'Ärter', quantity: 200, unit: 'g' }
  ], 25, 'protein', 'easy'),

  make(17, 'Fiskgratäng', [
    { name: 'Torskfilé', quantity: 400, unit: 'g' },
    { name: 'Grädde', quantity: 200, unit: 'ml' },
    { name: 'Dill', quantity: 1, unit: 'kruka' },
    { name: 'Potatis', quantity: 500, unit: 'g' }
  ], 45, 'protein', 'medium'),

  make(18, 'Torsk i ugn med citron', [
    { name: 'Torskfilé', quantity: 400, unit: 'g' },
    { name: 'Citron', quantity: 1, unit: 'st' },
    { name: 'Smör', quantity: 40, unit: 'g' },
    { name: 'Potatis', quantity: 500, unit: 'g' }
  ], 35, 'protein', 'easy'),

  make(19, 'Laxpasta', [
    { name: 'Pasta', quantity: 250, unit: 'g' },
    { name: 'Lax', quantity: 200, unit: 'g' },
    { name: 'Grädde', quantity: 150, unit: 'ml' },
    { name: 'Dill', quantity: 1, unit: 'kruka' }
  ], 25, 'carbs', 'easy'),

  make(20, 'Kyckling i ugn med rotfrukter', [
    { name: 'Kycklinglår', quantity: 600, unit: 'g' },
    { name: 'Morot', quantity: 3, unit: 'st' },
    { name: 'Palsternacka', quantity: 2, unit: 'st' },
    { name: 'Potatis', quantity: 500, unit: 'g' }
  ], 60, 'protein', 'medium'),

  make(21, 'Kycklinggryta med curry', [
    { name: 'Kycklingfilé', quantity: 400, unit: 'g' },
    { name: 'Grädde', quantity: 200, unit: 'ml' },
    { name: 'Currypulver', quantity: 2, unit: 'tsk' },
    { name: 'Lök', quantity: 1, unit: 'st' }
  ], 30, 'protein', 'easy'),

  make(22, 'Köttfärssås och spaghetti', [
    { name: 'Nötfärs', quantity: 400, unit: 'g' },
    { name: 'Spaghetti', quantity: 250, unit: 'g' },
    { name: 'Krossade tomater', quantity: 400, unit: 'g' },
    { name: 'Lök', quantity: 1, unit: 'st' }
  ], 35, 'protein', 'easy'),

  make(23, 'Lasagne klassisk', [
    { name: 'Lasagneplattor', quantity: 250, unit: 'g' },
    { name: 'Nötfärs', quantity: 400, unit: 'g' },
    { name: 'Krossade tomater', quantity: 400, unit: 'g' },
    { name: 'Ost', quantity: 150, unit: 'g' }
  ], 50, 'carbs', 'medium'),

  make(24, 'Tacopaj', [
    { name: 'Pajdeg', quantity: 1, unit: 'st' },
    { name: 'Nötfärs', quantity: 400, unit: 'g' },
    { name: 'Taco-krydda', quantity: 1, unit: 'påse' },
    { name: 'Ost', quantity: 150, unit: 'g' }
  ], 45, 'carbs', 'easy'),

  make(25, 'Färsbiffar med lök', [
    { name: 'Blandfärs', quantity: 500, unit: 'g' },
    { name: 'Lök', quantity: 1, unit: 'st' },
    { name: 'Ägg', quantity: 1, unit: 'st' },
    { name: 'Potatis', quantity: 500, unit: 'g' }
  ], 35, 'protein', 'easy'),

  make(26, 'Stekt falukorv med stuvade makaroner', [
    { name: 'Falukorv', quantity: 400, unit: 'g' },
    { name: 'Makaroner', quantity: 300, unit: 'g' },
    { name: 'Mjölk', quantity: 400, unit: 'ml' },
    { name: 'Smör', quantity: 30, unit: 'g' }
  ], 30, 'protein', 'easy'),

  make(27, 'Blodpudding med lingon', [
    { name: 'Blodpudding', quantity: 400, unit: 'g' },
    { name: 'Lingonsylt', quantity: 100, unit: 'g' },
    { name: 'Smör', quantity: 20, unit: 'g' },
    { name: 'Äpple', quantity: 1, unit: 'st' }
  ], 15, 'protein', 'easy'),

  make(28, 'Gulasch', [
    { name: 'Högrev', quantity: 600, unit: 'g' },
    { name: 'Potatis', quantity: 400, unit: 'g' },
    { name: 'Paprika', quantity: 2, unit: 'st' },
    { name: 'Lök', quantity: 1, unit: 'st' }
  ], 70, 'protein', 'medium'),

  make(29, 'Chili con carne', [
    { name: 'Nötfärs', quantity: 500, unit: 'g' },
    { name: 'Kidneybönor', quantity: 400, unit: 'g' },
    { name: 'Krossade tomater', quantity: 400, unit: 'g' },
    { name: 'Lök', quantity: 1, unit: 'st' }
  ], 45, 'protein', 'easy'),

  make(30, 'Linsgryta', [
    { name: 'Röda linser', quantity: 300, unit: 'g' },
    { name: 'Krossade tomater', quantity: 400, unit: 'g' },
    { name: 'Lök', quantity: 1, unit: 'st' },
    { name: 'Spiskummin', quantity: 1, unit: 'tsk' }
  ], 30, 'vegetables', 'easy')
]

function variantsFrom(recipe: Recipe, index: number): Recipe[] {
  const idBase = Number(recipe.id)
  const v1: Recipe = {
    ...recipe,
    id: String(idBase + index * 2000 + 1),
    name: `${recipe.name} – snabb variant`,
    prepTime: Math.max(15, Math.round(recipe.prepTime * 0.75)),
    ingredients: recipe.ingredients.map(i =>
      i.name === 'Potatis' ? { ...i, quantity: Math.round(i.quantity * 0.8) } : i
    )
  }
  const v2: Recipe = {
    ...recipe,
    id: String(idBase + index * 2000 + 2),
    name: `${recipe.name} – festlig variant`,
    prepTime: Math.round(recipe.prepTime * 1.2),
    ingredients: [
      ...recipe.ingredients,
      { name: 'Persilja', quantity: 1, unit: 'kruka' }
    ]
  }
  return [v1, v2]
}

export function expandToHundred(base: Recipe[]): Recipe[] {
  const normalized = base.map((r, i) => ({ ...r, id: String(i + 1) }))
  let out = [...normalized]

  let idx = 0
  while (out.length < 100) {
    const seed = normalized[idx % normalized.length]
    out.push(...variantsFrom(seed, Math.floor(out.length / normalized.length)))
    idx++
  }
  out = out.slice(0, 100)
  out = out.map((r, i) => ({ ...r, id: String(i + 1) }))
  return out
}

export const defaultRecipes: Recipe[] = expandToHundred(baseRecipes)


