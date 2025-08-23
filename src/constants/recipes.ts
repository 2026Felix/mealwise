import { Recipe } from '../types'

type Difficulty = 'easy' | 'medium' | 'hard'
type Category = 'vegetables' | 'carbs' | 'protein' | 'dairy'

function make(
  id: number,
  name: string,
  description: string,
  ingredients: Array<{ name: string; quantity: number; unit: string }>,
  instructions: string[],
  prepTime: number,
  cookTime: number,
  category: Category,
  difficulty: Difficulty = 'easy',
  nutrition?: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber?: number
    sugar?: number
    sodium?: number
  },
  tags?: string[]
): Recipe {
  return { 
    id: String(id), 
    name, 
    description,
    ingredients, 
    instructions,
    prepTime, 
    cookTime,
    totalTime: prepTime + cookTime,
    servings: 4,
    category, 
    difficulty,
    nutrition,
    tags
  }
}

const baseRecipes: Recipe[] = [
  make(1, 'Köttbullar med potatismos', 
    'Klassiska svenska köttbullar med krämigt potatismos och lingonsylt',
    [
      { name: 'Nötfärs', quantity: 400, unit: 'g' },
      { name: 'Potatis', quantity: 600, unit: 'g' },
      { name: 'Lök', quantity: 1, unit: 'st' },
      { name: 'Grädde', quantity: 100, unit: 'ml' }
    ],
    [
      'Blanda nötfärs med finhackad lök, salt och peppar',
      'Forma till små bollar och stek dem i smör tills de är gyllenbruna',
      'Koka potatis tills den är mjuk, mos med grädde och smör',
      'Servera köttbullarna med potatismos och lingonsylt'
    ],
    20, 20, 'protein', 'medium',
    {
      calories: 450,
      protein: 35,
      carbs: 25,
      fat: 22,
      fiber: 3,
      sodium: 800
    },
    ['klassisk', 'svensk', 'kött', 'potatis']
  ),

  make(2, 'Korv Stroganoff', 
    'Krämig korvgryta med svamp och gräddesås, serverad med ris',
    [
      { name: 'Falukorv', quantity: 400, unit: 'g' },
      { name: 'Krossade tomater', quantity: 400, unit: 'g' },
      { name: 'Lök', quantity: 1, unit: 'st' },
      { name: 'Grädde', quantity: 100, unit: 'ml' }
    ],
    [
      'Skär korven i skivor och stek dem gyllenbruna',
      'Hetta upp olja och stek finhackad lök tills den är mjuk',
      'Lägg till korv, tomater och grädde',
      'Låt koka ihop i 10-15 minuter och servera med ris'
    ],
    15, 15, 'protein', 'easy',
    {
      calories: 380,
      protein: 18,
      carbs: 15,
      fat: 28,
      fiber: 2,
      sodium: 1200
    },
    ['korv', 'gryta', 'krämig', 'snabb']
  ),

  make(3, 'Kalops', 
    'Långkokt högrev med lök och morötter i buljong, serverad med potatis',
    [
      { name: 'Högrev', quantity: 600, unit: 'g' },
      { name: 'Lök', quantity: 2, unit: 'st' },
      { name: 'Morot', quantity: 2, unit: 'st' },
      { name: 'Buljong', quantity: 600, unit: 'ml' }
    ],
    [
      'Skär köttet i bitar och bruna av i olja',
      'Lägg till hackad lök och morötter',
      'Häll på buljong och låt koka sakta i 1-1,5 timme',
      'Servera med kokt potatis och lingonsylt'
    ],
    20, 70, 'protein', 'medium',
    {
      calories: 420,
      protein: 45,
      carbs: 18,
      fat: 18,
      fiber: 4,
      sodium: 900
    },
    ['långkok', 'kött', 'buljong', 'traditionell']
  ),

  make(4, 'Dillkött', 
    'Mörbakat kalvkött i dillsås med grädde, serverad med potatis',
    [
      { name: 'Kalvkött', quantity: 600, unit: 'g' },
      { name: 'Grädde', quantity: 200, unit: 'ml' },
      { name: 'Dill', quantity: 1, unit: 'kruka' },
      { name: 'Buljong', quantity: 600, unit: 'ml' }
    ],
    [
      'Skär köttet i bitar och bruna av i smör',
      'Lägg till buljong och låt koka sakta i 45 minuter',
      'Tillsätt grädde och finhackad dill',
      'Låt koka ihop i 5 minuter och servera med potatis'
    ],
    15, 65, 'protein', 'medium',
    {
      calories: 380,
      protein: 42,
      carbs: 12,
      fat: 18,
      fiber: 1,
      sodium: 850
    },
    ['kalv', 'dill', 'krämig', 'klassisk']
  ),

  make(5, 'Ugnspannkaka', 
    'Luftig pannkaka med bacon i ugn, serverad med lingonsylt',
    [
      { name: 'Mjölk', quantity: 600, unit: 'ml' },
      { name: 'Mjöl', quantity: 250, unit: 'g' },
      { name: 'Ägg', quantity: 3, unit: 'st' },
      { name: 'Bacon', quantity: 150, unit: 'g' }
    ],
    [
      'Vispa ihop mjölk, mjöl och ägg till en smidig smet',
      'Lägg bacon i botten av en ugnsform',
      'Häll på smeten och grädda i 200°C i 25-30 minuter',
      'Servera varm med lingonsylt'
    ],
    10, 30, 'protein', 'easy',
    {
      calories: 320,
      protein: 16,
      carbs: 28,
      fat: 18,
      fiber: 1,
      sodium: 600
    },
    ['pannkaka', 'ugn', 'bacon', 'snabb']
  ),

  make(6, 'Janssons frestelse', 
    'Potatisgratäng med ansjovis, lök och grädde, gräddad i ugn',
    [
      { name: 'Potatis', quantity: 700, unit: 'g' },
      { name: 'Ansjovis', quantity: 120, unit: 'g' },
      { name: 'Lök', quantity: 1, unit: 'st' },
      { name: 'Grädde', quantity: 300, unit: 'ml' }
    ],
    [
      'Skala och skiva potatis tunt',
      'Lägg halva potatisen i botten av en ugnsform',
      'Lägg på ansjovis och hackad lök',
      'Lägg på resten av potatisen och häll på grädde',
      'Grädda i 200°C i 45-50 minuter'
    ],
    20, 40, 'protein', 'medium',
    {
      calories: 410,
      protein: 22,
      carbs: 35,
      fat: 24,
      fiber: 4,
      sodium: 1100
    },
    ['gratäng', 'potatis', 'ansjovis', 'traditionsrätt']
  ),

  make(7, 'Raggmunk med fläsk', 
    'Potatisplättar med rökt sidfläsk, serverade med lingonsylt',
    [
      { name: 'Potatis', quantity: 600, unit: 'g' },
      { name: 'Mjölk', quantity: 300, unit: 'ml' },
      { name: 'Mjöl', quantity: 120, unit: 'g' },
      { name: 'Rökt sidfläsk', quantity: 200, unit: 'g' }
    ],
    [
      'Riv potatis fint och blanda med mjölk och mjöl',
      'Stek sidfläsket krispigt och ta upp',
      'Stek potatissmeten i fläskfettet till plättar',
      'Servera varma med lingonsylt och fläsket'
    ],
    15, 30, 'protein', 'medium',
    {
      calories: 380,
      protein: 16,
      carbs: 32,
      fat: 22,
      fiber: 3,
      sodium: 800
    },
    ['potatis', 'plättar', 'fläsk', 'klassisk']
  ),

  make(8, 'Stekt strömming med mos', 
    'Färsk strömming stekt i smör med potatismos och lingon',
    [
      { name: 'Strömmingsfilé', quantity: 400, unit: 'g' },
      { name: 'Potatis', quantity: 600, unit: 'g' },
      { name: 'Smör', quantity: 50, unit: 'g' },
      { name: 'Lingon', quantity: 100, unit: 'g' }
    ],
    [
      'Koka potatis tills den är mjuk och mos med smör',
      'Krydda strömmingen med salt och peppar',
      'Stek filéerna i smör tills de är gyllenbruna',
      'Servera med potatismos och lingonsylt'
    ],
    15, 20, 'protein', 'medium',
    {
      calories: 350,
      protein: 38,
      carbs: 28,
      fat: 16,
      fiber: 3,
      sodium: 700
    },
    ['strömming', 'fisk', 'potatis', 'klassisk']
  ),

  make(9, 'Pytt i panna', 
    'Stekt potatis med lök, kött och ägg, en klassisk svensk rätt',
    [
      { name: 'Potatis', quantity: 500, unit: 'g' },
      { name: 'Lök', quantity: 1, unit: 'st' },
      { name: 'Nötfärs', quantity: 300, unit: 'g' },
      { name: 'Ägg', quantity: 2, unit: 'st' }
    ],
    [
      'Koka potatis tills den är nästan mjuk, kyl och skär i tärningar',
      'Stek nötfärs tills den är genomstekt',
      'Lägg till potatis och hackad lök, stek tills allt är gyllenbrunt',
      'Stek ägg och servera ovanpå'
    ],
    15, 15, 'protein', 'easy',
    {
      calories: 420,
      protein: 28,
      carbs: 32,
      fat: 24,
      fiber: 3,
      sodium: 750
    },
    ['pytt', 'potatis', 'kött', 'klassisk']
  ),

  make(10, 'Ärtsoppa', 
    'Traditionsrätt med gula ärtor, fläsk och kryddor, serverad med pannkakor',
    [
      { name: 'Gula ärtor', quantity: 300, unit: 'g' },
      { name: 'Fläsk', quantity: 200, unit: 'g' },
      { name: 'Lök', quantity: 1, unit: 'st' },
      { name: 'Vatten', quantity: 1000, unit: 'ml' }
    ],
    [
      'Låt ärtorna ligga i vatten över natten',
      'Koka ärtorna med fläsk och lök i 1-1,5 timme',
      'Krydda med timjan och peppar',
      'Servera med pannkakor och lingonsylt'
    ],
    15, 75, 'protein', 'medium',
    {
      calories: 380,
      protein: 26,
      carbs: 42,
      fat: 18,
      fiber: 18,
      sodium: 600
    },
    ['ärtor', 'soppa', 'traditionsrätt', 'torsdag']
  )
]

export function expandToHundred(base: Recipe[]): Recipe[] {
  // För nu, returnera bara de första 10 recepten med fullständig information
  return base.slice(0, 10)
}

export const defaultRecipes: Recipe[] = expandToHundred(baseRecipes)


