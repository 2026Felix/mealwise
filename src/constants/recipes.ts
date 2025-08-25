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
    ['klassisk', 'svensk', 'kött', 'potatis', 'husman', 'familj', 'vinter', 'söndagsmiddag']
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
    ['korv', 'gryta', 'krämig', 'snabb', 'varm', 'ris', 'vinter', 'vardag']
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
    ['långkok', 'kött', 'buljong', 'traditionell', 'vinter', 'helg', 'mörbakat', 'husman']
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
    ['kalv', 'dill', 'krämig', 'klassisk', 'vår', 'sommar', 'elegant', 'middag']
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
    ['pannkaka', 'ugn', 'bacon', 'snabb', 'varm', 'lingon', 'vardag', 'familj']
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
    ['gratäng', 'potatis', 'ansjovis', 'traditionsrätt', 'jul', 'vinter', 'ugn', 'fest']
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
    ['potatis', 'plättar', 'fläsk', 'klassisk', 'vinter', 'husman', 'lingon', 'traditionell']
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
    ['strömming', 'fisk', 'potatis', 'klassisk', 'vår', 'sommar', 'färsk', 'husman']
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
    ['pytt', 'potatis', 'kött', 'klassisk', 'snabb', 'vardag', 'rest', 'husman']
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
    ['ärtor', 'soppa', 'traditionsrätt', 'torsdag', 'vinter', 'buljong', 'långkok', 'klassisk']
  ),

  make(11, 'Lax med dillsås', 
    'Ugnsbakad lax med krämig dillsås och kokt potatis',
    [
      { name: 'Laxfilé', quantity: 400, unit: 'g' },
      { name: 'Grädde', quantity: 200, unit: 'ml' },
      { name: 'Dill', quantity: 1, unit: 'kruka' },
      { name: 'Potatis', quantity: 500, unit: 'g' }
    ],
    [
      'Krydda laxen med salt och peppar',
      'Bak i ugn i 200°C i 15-20 minuter',
      'Vispa grädde med hackad dill',
      'Koka potatis och servera med lax och dillsås'
    ],
    10, 20, 'protein', 'easy',
    {
      calories: 420,
      protein: 35,
      carbs: 25,
      fat: 22,
      fiber: 2,
      sodium: 500
    },
    ['lax', 'fisk', 'dill', 'hälsosam', 'vår', 'sommar', 'ugn', 'elegant', 'middag']
  ),

  make(12, 'Köttfärslimpa', 
    'Saftig köttfärslimpa med bacon och lök, serverad med potatis',
    [
      { name: 'Nötfärs', quantity: 500, unit: 'g' },
      { name: 'Bacon', quantity: 100, unit: 'g' },
      { name: 'Lök', quantity: 1, unit: 'st' },
      { name: 'Ströbröd', quantity: 50, unit: 'g' }
    ],
    [
      'Blanda färs med hackad lök, ströbröd och kryddor',
      'Forma till en limpa och lägg bacon ovanpå',
      'Bak i ugn i 200°C i 45-50 minuter',
      'Servera med kokt potatis och grönsaker'
    ],
    15, 50, 'protein', 'medium',
    {
      calories: 450,
      protein: 38,
      carbs: 18,
      fat: 28,
      fiber: 2,
      sodium: 900
    },
    ['köttfärs', 'limpa', 'ugn', 'klassisk', 'vinter', 'helg', 'familj', 'husman']
  ),

  make(13, 'Blodpudding', 
    'Traditionsrätt med blodpudding, stekt fläsk och lingon',
    [
      { name: 'Blodpudding', quantity: 400, unit: 'g' },
      { name: 'Rökt sidfläsk', quantity: 200, unit: 'g' },
      { name: 'Potatis', quantity: 400, unit: 'g' },
      { name: 'Lingon', quantity: 100, unit: 'g' }
    ],
    [
      'Stek blodpuddingen i smör tills den är krispig',
      'Stek sidfläsket krispigt',
      'Koka potatis och mos med smör',
      'Servera med lingonsylt'
    ],
    10, 20, 'protein', 'easy',
    {
      calories: 380,
      protein: 22,
      carbs: 28,
      fat: 24,
      fiber: 2,
      sodium: 800
    },
    ['blodpudding', 'traditionsrätt', 'fläsk', 'klassisk', 'vinter', 'husman', 'lingon', 'vardag']
  ),

  make(14, 'Kroppkakor', 
    'Potatisbullar fyllda med fläsk och lök, serverade med smör',
    [
      { name: 'Potatis', quantity: 800, unit: 'g' },
      { name: 'Mjöl', quantity: 200, unit: 'g' },
      { name: 'Fläsk', quantity: 150, unit: 'g' },
      { name: 'Lök', quantity: 1, unit: 'st' }
    ],
    [
      'Koka och mos potatis, blanda med mjöl',
      'Fyll med hackat fläsk och lök',
      'Forma till bullar och koka i saltat vatten',
      'Servera med smält smör och lingon'
    ],
    25, 15, 'protein', 'medium',
    {
      calories: 420,
      protein: 18,
      carbs: 45,
      fat: 22,
      fiber: 4,
      sodium: 600
    },
    ['kroppkakor', 'potatis', 'bullar', 'traditionsrätt', 'vinter', 'husman', 'lingon', 'helg']
  ),

  make(15, 'Surströmming', 
    'Fermenterad strömming med tunnbröd, lök och potatis',
    [
      { name: 'Surströmming', quantity: 200, unit: 'g' },
      { name: 'Tunnbröd', quantity: 4, unit: 'st' },
      { name: 'Lök', quantity: 1, unit: 'st' },
      { name: 'Potatis', quantity: 400, unit: 'g' }
    ],
    [
      'Öppna burken utomhus och låt lufta',
      'Koka potatis och skala',
      'Lägg surströmming på tunnbröd med hackad lök',
      'Servera med kokt potatis och smör'
    ],
    15, 10, 'protein', 'hard',
    {
      calories: 280,
      protein: 25,
      carbs: 32,
      fat: 12,
      fiber: 3,
      sodium: 1200
    },
    ['surströmming', 'fermenterad', 'traditionsrätt', 'avancerad', 'sommar', 'fest', 'norrland', 'special']
  ),

  make(16, 'Vegetarisk lasagne', 
    'Lasagne med zucchini, aubergine och ricotta, gräddad i ugn',
    [
      { name: 'Lasagneplattor', quantity: 200, unit: 'g' },
      { name: 'Zucchini', quantity: 2, unit: 'st' },
      { name: 'Aubergine', quantity: 1, unit: 'st' },
      { name: 'Ricotta', quantity: 250, unit: 'g' }
    ],
    [
      'Skiva zucchini och aubergine tunt',
      'Lägg lager av lasagneplattor, grönsaker och ricotta',
      'Häll på tomatsås och mozzarella',
      'Bak i ugn i 180°C i 35-40 minuter'
    ],
    20, 40, 'vegetables', 'medium',
    {
      calories: 320,
      protein: 18,
      carbs: 35,
      fat: 16,
      fiber: 6,
      sodium: 600
    },
    ['vegetarisk', 'lasagne', 'grönsaker', 'italiensk', 'ugn', 'familj', 'vinter', 'middag']
  ),

  make(17, 'Kikärtscurry', 
    'Kryddig curry med kikärter, kokosmjölk och ris',
    [
      { name: 'Kikärter', quantity: 400, unit: 'g' },
      { name: 'Kokosmjölk', quantity: 400, unit: 'ml' },
      { name: 'Lök', quantity: 1, unit: 'st' },
      { name: 'Ris', quantity: 200, unit: 'g' }
    ],
    [
      'Stek hackad lök i olja tills den är mjuk',
      'Lägg till currykryddor och kikärter',
      'Häll på kokosmjölk och låt koka ihop',
      'Servera med kokt ris och koriander'
    ],
    15, 25, 'vegetables', 'easy',
    {
      calories: 380,
      protein: 16,
      carbs: 45,
      fat: 18,
      fiber: 12,
      sodium: 400
    },
    ['vegetarisk', 'curry', 'kikärter', 'indisk', 'varm', 'kryddig', 'billig', 'vardag']
  ),

  make(18, 'Pasta carbonara', 
    'Klassisk italiensk pasta med bacon, ägg och parmesan',
    [
      { name: 'Spaghetti', quantity: 400, unit: 'g' },
      { name: 'Bacon', quantity: 200, unit: 'g' },
      { name: 'Ägg', quantity: 3, unit: 'st' },
      { name: 'Parmesan', quantity: 100, unit: 'g' }
    ],
    [
      'Koka pasta enligt anvisning på förpackningen',
      'Stek bacon krispigt och ta upp',
      'Vispa ägg med rivet parmesan',
      'Blanda varm pasta med äggblandning och bacon'
    ],
    10, 15, 'protein', 'medium',
    {
      calories: 520,
      protein: 28,
      carbs: 45,
      fat: 32,
      fiber: 2,
      sodium: 800
    },
    ['pasta', 'italiensk', 'bacon', 'klassisk', 'snabb', 'elegant', 'middag', 'varm']
  ),

  make(19, 'Tacos med nötfärs', 
    'Mexikanska tacos med kryddig nötfärs och grönsaker',
    [
      { name: 'Nötfärs', quantity: 400, unit: 'g' },
      { name: 'Tacoskal', quantity: 8, unit: 'st' },
      { name: 'Tomat', quantity: 2, unit: 'st' },
      { name: 'Sallad', quantity: 100, unit: 'g' }
    ],
    [
      'Stek nötfärs med tacokryddor',
      'Värm tacoskalen enligt anvisning',
      'Fyll med färs, hackade tomater och sallad',
      'Servera med salsa och gräddfil'
    ],
    15, 20, 'protein', 'easy',
    {
      calories: 380,
      protein: 32,
      carbs: 28,
      fat: 22,
      fiber: 4,
      sodium: 700
    },
    ['tacos', 'mexikansk', 'kött', 'snabb', 'familj', 'fest', 'varm', 'vardag']
  ),

  make(20, 'Sushi med lax', 
    'Hemlagad sushi med lax, ris och grönsaker',
    [
      { name: 'Sushiris', quantity: 300, unit: 'g' },
      { name: 'Laxfilé', quantity: 200, unit: 'g' },
      { name: 'Nori', quantity: 4, unit: 'ark' },
      { name: 'Avokado', quantity: 1, unit: 'st' }
    ],
    [
      'Koka sushiris enligt anvisning',
      'Lägg ris på nori med lax och avokado',
      'Rulla ihop och skär i bitar',
      'Servera med sojasås och ingefära'
    ],
    25, 10, 'protein', 'hard',
    {
      calories: 320,
      protein: 22,
      carbs: 38,
      fat: 18,
      fiber: 3,
      sodium: 500
    },
    ['sushi', 'japansk', 'lax', 'avancerad', 'sommar', 'fest', 'elegant', 'special']
  ),

  // Middagar
  make(21, 'Kyckling tikka masala',
    'Kryddig indisk kycklinggryta i tomat- och yoghurtssås, serveras med ris',
    [
      { name: 'Kycklinglårfilé', quantity: 500, unit: 'g' },
      { name: 'Krossade tomater', quantity: 400, unit: 'g' },
      { name: 'Yoghurt', quantity: 150, unit: 'g' },
      { name: 'Lök', quantity: 1, unit: 'st' }
    ],
    [
      'Stek lök och kryddor tills doftande',
      'Lägg i tärnad kyckling och bryn runt om',
      'Häll på tomater och sjud 15 minuter',
      'Tillsätt yoghurt och smaka av; servera med ris'
    ],
    15, 25, 'protein', 'medium',
    {
      calories: 460,
      protein: 38,
      carbs: 28,
      fat: 20,
      fiber: 5,
      sodium: 700
    },
    ['indisk', 'kyckling', 'gryta', 'kryddig', 'varm', 'familj', 'middag', 'ris']
  ),

  make(22, 'Chili sin carne',
    'Mustig vegetarisk chili med bönor och paprika, serveras med ris eller bröd',
    [
      { name: 'Kidneybönor', quantity: 400, unit: 'g' },
      { name: 'Krossade tomater', quantity: 400, unit: 'g' },
      { name: 'Paprika', quantity: 1, unit: 'st' },
      { name: 'Lök', quantity: 1, unit: 'st' }
    ],
    [
      'Fräs lök, vitlök och chilipulver',
      'Tillsätt paprika och låt mjukna',
      'Häll i bönor och tomat och sjud 20 minuter',
      'Smaka av med salt, peppar och kakao'
    ],
    10, 25, 'vegetables', 'easy',
    {
      calories: 360,
      protein: 18,
      carbs: 48,
      fat: 8,
      fiber: 14,
      sodium: 450
    },
    ['vegetarisk', 'gryta', 'mexikansk', 'varm', 'kryddig', 'billig', 'vardag', 'familj']
  ),

  make(23, 'Tonfiskpasta med citron',
    'Snabb pasta med tonfisk, citron och persilja',
    [
      { name: 'Pasta', quantity: 400, unit: 'g' },
      { name: 'Tonfisk i olja', quantity: 240, unit: 'g' },
      { name: 'Citron', quantity: 1, unit: 'st' },
      { name: 'Persilja', quantity: 10, unit: 'g' }
    ],
    [
      'Koka pastan al dente',
      'Blanda avrunnen tonfisk med citronskal- och saft',
      'Vänd ner i varm pasta med persilja och lite pastavatten',
      'Smaka av med salt och peppar'
    ],
    10, 12, 'protein', 'easy',
    {
      calories: 520,
      protein: 30,
      carbs: 70,
      fat: 14,
      fiber: 4,
      sodium: 550
    },
    ['pasta', 'fisk', 'snabb', 'citron', 'vår', 'sommar', 'vardag', 'elegant']
  ),

  make(24, 'Linsgryta med spenat',
    'Värmande linsgryta med spenat och kokosmjölk',
    [
      { name: 'Röda linser', quantity: 300, unit: 'g' },
      { name: 'Kokosmjölk', quantity: 400, unit: 'ml' },
      { name: 'Spenat', quantity: 150, unit: 'g' },
      { name: 'Lök', quantity: 1, unit: 'st' }
    ],
    [
      'Fräs lök och curry',
      'Tillsätt sköljda linser och kokosmjölk; sjud 15 minuter',
      'Vänd ner spenaten tills den sjunker ihop',
      'Smaka av och servera med ris eller bröd'
    ],
    10, 20, 'vegetables', 'easy',
    {
      calories: 420,
      protein: 20,
      carbs: 46,
      fat: 16,
      fiber: 12,
      sodium: 500
    },
    ['vegansk', 'gryta', 'linser', 'varm', 'kryddig', 'billig', 'vardag', 'hälsosam']
  ),

  make(25, 'Biff med bea och klyftpotatis',
    'Stekt biff med ugnsrostad potatis och enkel bearnaisesås',
    [
      { name: 'Ryggbiff', quantity: 500, unit: 'g' },
      { name: 'Potatis', quantity: 700, unit: 'g' },
      { name: 'Smör', quantity: 100, unit: 'g' },
      { name: 'Äggula', quantity: 2, unit: 'st' }
    ],
    [
      'Rosta klyftad potatis 30–35 min i 225°C',
      'Stek biffen till önskad stekgrad',
      'Vispa ihop enkel bea med smör, äggula och dragon',
      'Servera biff, potatis och sås med sallad'
    ],
    15, 30, 'protein', 'medium',
    {
      calories: 680,
      protein: 42,
      carbs: 48,
      fat: 34,
      fiber: 6,
      sodium: 700
    },
    ['nötkött', 'sås', 'ugnspotatis', 'elegant', 'helg', 'middag', 'fest', 'husman']
  ),

  make(26, 'Kycklingwok med nudlar',
    'Snabb wok med kyckling, grönsaker och äggnudlar',
    [
      { name: 'Kycklingbröst', quantity: 400, unit: 'g' },
      { name: 'Äggnudlar', quantity: 250, unit: 'g' },
      { name: 'Morot', quantity: 2, unit: 'st' },
      { name: 'Sojasås', quantity: 3, unit: 'msk' }
    ],
    [
      'Koka nudlar enligt anvisning',
      'Woka kyckling i het panna',
      'Tillsätt strimlade grönsaker och sojasås',
      'Vänd i nudlar och servera direkt'
    ],
    10, 12, 'protein', 'easy',
    {
      calories: 520,
      protein: 36,
      carbs: 64,
      fat: 12,
      fiber: 5,
      sodium: 900
    },
    ['asiatisk', 'wok', 'snabb', 'kyckling', 'vardag', 'familj', 'varm', 'nudlar']
  ),

  make(27, 'Falafel i pitabröd',
    'Krispiga falafel med tahinisås och grönsaker i pita',
    [
      { name: 'Kikärter', quantity: 400, unit: 'g' },
      { name: 'Pitabröd', quantity: 4, unit: 'st' },
      { name: 'Tomat', quantity: 2, unit: 'st' },
      { name: 'Yoghurt', quantity: 150, unit: 'g' }
    ],
    [
      'Mixa kikärter med kryddor och forma bollar',
      'Fritera eller ugnsbaka tills krispiga',
      'Blanda yoghurt, tahini och citron till sås',
      'Fyll pitabröd med falafel, sås och grönsaker'
    ],
    20, 20, 'vegetables', 'medium',
    {
      calories: 480,
      protein: 20,
      carbs: 62,
      fat: 16,
      fiber: 10,
      sodium: 700
    },
    ['vegetarisk', 'mellanöstern', 'snabb', 'falafel', 'varm', 'familj', 'vardag', 'fest']
  ),

  make(28, 'Torsk med brynt smör',
    'Ugnsbakad torsk med brynt smör, kapris och potatis',
    [
      { name: 'Torskfilé', quantity: 500, unit: 'g' },
      { name: 'Smör', quantity: 80, unit: 'g' },
      { name: 'Kapris', quantity: 2, unit: 'msk' },
      { name: 'Potatis', quantity: 600, unit: 'g' }
    ],
    [
      'Baka torsken i 200°C i 12–15 minuter',
      'Bryn smöret nötigt och rör i kapris',
      'Koka potatis och servera med fisken och smöret',
      'Toppa med persilja och citron'
    ],
    10, 20, 'protein', 'easy',
    {
      calories: 430,
      protein: 36,
      carbs: 38,
      fat: 16,
      fiber: 5,
      sodium: 500
    },
    ['fisk', 'ugn', 'klassisk', 'vår', 'sommar', 'elegant', 'middag', 'husman']
  ),

  make(29, 'Pad Thai med räkor',
    'Thailändsk nudelrätt med räkor, jordnötter och lime',
    [
      { name: 'Räkor', quantity: 300, unit: 'g' },
      { name: 'Risnudlar', quantity: 250, unit: 'g' },
      { name: 'Ägg', quantity: 2, unit: 'st' },
      { name: 'Jordnötter', quantity: 40, unit: 'g' }
    ],
    [
      'Blötlägg nudlar och woka snabbt med räkor',
      'Skjut åt sidan, knäck i ägg och rör runt',
      'Tillsätt pad thai-sås och blanda; toppa med jordnötter',
      'Servera med lime och koriander'
    ],
    15, 10, 'protein', 'medium',
    {
      calories: 560,
      protein: 30,
      carbs: 70,
      fat: 16,
      fiber: 4,
      sodium: 900
    },
    ['thailändsk', 'nudlar', 'räkor', 'asiatisk', 'varm', 'fest', 'middag', 'elegant']
  ),

  make(30, 'Gnocchi med tomat och mozzarella',
    'Snabb gnocchi i tomatsås, gratinerad med mozzarella',
    [
      { name: 'Gnocchi', quantity: 500, unit: 'g' },
      { name: 'Passerade tomater', quantity: 400, unit: 'g' },
      { name: 'Mozzarella', quantity: 200, unit: 'g' },
      { name: 'Basilika', quantity: 10, unit: 'g' }
    ],
    [
      'Stek gnocchi i olivolja tills lätt gyllene',
      'Häll på tomatsås och sjud 5 minuter',
      'Toppa med mozzarella och gratinera snabbt',
      'Strö över basilika och servera'
    ],
    10, 15, 'carbs', 'easy',
    {
      calories: 520,
      protein: 22,
      carbs: 62,
      fat: 18,
      fiber: 4,
      sodium: 600
    },
    ['italiensk', 'vegetarisk', 'gnocchi', 'snabb', 'ugn', 'familj', 'vardag', 'tomat']
  ),

  // Fler vanliga middagar
  make(31, 'Kyckling Alfredo',
    'Krämig pasta med kyckling och parmesan',
    [
      { name: 'Pasta', quantity: 400, unit: 'g' },
      { name: 'Kycklingbröst', quantity: 400, unit: 'g' },
      { name: 'Grädde', quantity: 300, unit: 'ml' },
      { name: 'Parmesan', quantity: 80, unit: 'g' }
    ],
    [
      'Koka pasta al dente',
      'Stek kyckling i smör',
      'Koka ihop grädde och parmesan till sås',
      'Blanda pasta och kyckling i såsen'
    ],
    10, 20, 'protein', 'easy',
    { calories: 700, protein: 38, carbs: 60, fat: 32 },
    ['pasta', 'kyckling', 'krämig', 'italiensk', 'familj', 'middag', 'varm', 'vardag']
  ),

  make(32, 'Fish tacos',
    'Krispiga fiskbitar i tortillabröd med kålslaw',
    [
      { name: 'Vit fisk', quantity: 400, unit: 'g' },
      { name: 'Tortilla', quantity: 8, unit: 'st' },
      { name: 'Kål', quantity: 200, unit: 'g' },
      { name: 'Yoghurt', quantity: 150, unit: 'g' }
    ],
    [
      'Panera och stek fisken krispig',
      'Blanda kålslaw med yoghurt och lime',
      'Värm tortilla och fyll',
      'Toppa med koriander'
    ],
    15, 15, 'protein', 'easy',
    { calories: 480, protein: 28, carbs: 40, fat: 20 },
    ['mexikansk', 'fisk', 'snabb', 'tortilla', 'varm', 'familj', 'fest', 'vardag']
  ),

  make(33, 'Biffwok med broccoli',
    'Snabb wok med strimlad biff och broccoli',
    [
      { name: 'Nötkött', quantity: 400, unit: 'g' },
      { name: 'Broccoli', quantity: 300, unit: 'g' },
      { name: 'Sojasås', quantity: 3, unit: 'msk' },
      { name: 'Vitlök', quantity: 2, unit: 'klyfta' }
    ],
    [
      'Woka biff snabbt i het panna',
      'Tillsätt broccoli och vitlök',
      'Häll på sojasås och lite vatten',
      'Servera med ris'
    ],
    10, 10, 'protein', 'easy',
    { calories: 420, protein: 35, carbs: 20, fat: 22 },
    ['asiatisk', 'wok', 'snabb', 'nötkött', 'varm', 'vardag', 'familj', 'grönsaker']
  ),

  make(34, 'Shepherd\'s pie',
    'Köttfärspaj med potatismosgratäng',
    [
      { name: 'Nötfärs', quantity: 500, unit: 'g' },
      { name: 'Potatis', quantity: 700, unit: 'g' },
      { name: 'Morot', quantity: 1, unit: 'st' },
      { name: 'Buljong', quantity: 300, unit: 'ml' }
    ],
    [
      'Gör köttfärssås med morot',
      'Koka potatis och gör mos',
      'Lägg färs i form, toppa med mos',
      'Gratinera 20 minuter'
    ],
    20, 30, 'protein', 'medium',
    { calories: 650, protein: 32, carbs: 70, fat: 24 },
    ['brittisk', 'gratäng', 'potatis', 'familj', 'vinter', 'helg', 'husman', 'middag']
  ),

  make(35, 'Korv och mos',
    'Stekt korv med krämigt potatismos och senap',
    [
      { name: 'Korv', quantity: 400, unit: 'g' },
      { name: 'Potatis', quantity: 700, unit: 'g' },
      { name: 'Smör', quantity: 50, unit: 'g' },
      { name: 'Mjölk', quantity: 150, unit: 'ml' }
    ],
    [
      'Stek korv gyllene',
      'Koka potatis och gör mos med smör och mjölk',
      'Servera med senap och gurka',
      'Toppa med rostad lök om önskas'
    ],
    10, 20, 'protein', 'easy',
    { calories: 620, protein: 22, carbs: 58, fat: 28 },
    ['klassisk', 'snabb', 'korv', 'husman', 'vardag', 'familj', 'vinter', 'potatis']
  ),

  make(36, 'Teriyaki lax',
    'Lax i söt-salt teriyakisås med ris',
    [
      { name: 'Laxfilé', quantity: 400, unit: 'g' },
      { name: 'Teriyakisås', quantity: 100, unit: 'ml' },
      { name: 'Sesamfrön', quantity: 10, unit: 'g' },
      { name: 'Ris', quantity: 300, unit: 'g' }
    ],
    [
      'Stek lax och häll över teriyakisås',
      'Koka ris',
      'Strö sesamfrön och servera',
      'Tillsätt vårlök'
    ],
    10, 12, 'protein', 'easy',
    { calories: 520, protein: 34, carbs: 52, fat: 18 },
    ['fisk', 'asiatisk', 'snabb', 'lax', 'vår', 'sommar', 'elegant', 'middag']
  ),

  make(37, 'Vegetarisk pytt i panna',
    'Tärnade rotfrukter och tofu stekt krispigt',
    [
      { name: 'Potatis', quantity: 500, unit: 'g' },
      { name: 'Morot', quantity: 2, unit: 'st' },
      { name: 'Tofu', quantity: 250, unit: 'g' },
      { name: 'Lök', quantity: 1, unit: 'st' }
    ],
    [
      'Koka potatis nästan mjuk, tärna',
      'Stek potatis, morot och lök krispigt',
      'Tillsätt tofu och krydda',
      'Servera med senap'
    ],
    15, 15, 'vegetables', 'easy',
    { calories: 420, protein: 20, carbs: 52, fat: 14 },
    ['vegetarisk', 'snabb', 'tofu', 'rotfrukter', 'vardag', 'familj', 'vinter', 'husman']
  ),

  make(38, 'Pulled pork tacos',
    'Långkokt fläsk i tortilla med picklad lök',
    [
      { name: 'Fläskkarré', quantity: 800, unit: 'g' },
      { name: 'Tortilla', quantity: 10, unit: 'st' },
      { name: 'Lök', quantity: 1, unit: 'st' },
      { name: 'BBQ-sås', quantity: 150, unit: 'ml' }
    ],
    [
      'Långbaka karré tills mör',
      'Strimla och blanda med BBQ-sås',
      'Värm tortilla och fyll',
      'Toppa med picklad lök'
    ],
    20, 180, 'protein', 'medium',
    { calories: 680, protein: 42, carbs: 50, fat: 32 },
    ['mexikansk', 'långkok', 'fläsk', 'BBQ', 'helg', 'fest', 'familj', 'varm']
  ),

  make(39, 'Kalkonköttbullar med tomatsås',
    'Magrare köttbullar i enkel tomatsås',
    [
      { name: 'Kalkonfärs', quantity: 500, unit: 'g' },
      { name: 'Krossade tomater', quantity: 400, unit: 'g' },
      { name: 'Lök', quantity: 1, unit: 'st' },
      { name: 'Ströbröd', quantity: 40, unit: 'g' }
    ],
    [
      'Rör färs med lök och ströbröd',
      'Rulla och bryn bollarna',
      'Sjud i tomatsås 15 min',
      'Servera med pasta'
    ],
    15, 20, 'protein', 'easy',
    { calories: 540, protein: 36, carbs: 56, fat: 16 },
    ['färs', 'pasta', 'snabb', 'kalkon', 'familj', 'vardag', 'hälsosam', 'middag']
  ),

  make(40, 'Räkor i vitlök',
    'Snabba vitlöksräkor med citron och bröd',
    [
      { name: 'Räkor', quantity: 400, unit: 'g' },
      { name: 'Vitlök', quantity: 3, unit: 'klyfta' },
      { name: 'Citron', quantity: 1, unit: 'st' },
      { name: 'Bröd', quantity: 4, unit: 'skiva' }
    ],
    [
      'Stek vitlök i olivolja',
      'Tillsätt räkor kort och pressa citron',
      'Servera direkt med bröd',
      'Toppa med persilja'
    ],
    10, 5, 'protein', 'easy',
    { calories: 380, protein: 30, carbs: 18, fat: 18 },
    ['skaldjur', 'snabb', 'medelhav', 'vitlök', 'vår', 'sommar', 'elegant', 'förrätt']
  ),

  make(41, 'Kyckling fajitas',
    'Stekt kyckling med paprika och lök i tortilla',
    [
      { name: 'Kycklingbröst', quantity: 450, unit: 'g' },
      { name: 'Paprika', quantity: 2, unit: 'st' },
      { name: 'Lök', quantity: 1, unit: 'st' },
      { name: 'Tortilla', quantity: 8, unit: 'st' }
    ],
    [
      'Strimla och stek kyckling med fajitaskrydda',
      'Tillsätt paprika och lök',
      'Värm tortilla',
      'Servera med lime och gräddfil'
    ],
    10, 12, 'protein', 'easy',
    { calories: 520, protein: 36, carbs: 48, fat: 18 },
    ['mexikansk', 'kyckling', 'snabb', 'tortilla', 'varm', 'familj', 'fest', 'vardag']
  ),

  make(42, 'Burritos med nötkött',
    'Stora burritos fyllda med köttfärs, ris och bönor',
    [
      { name: 'Nötfärs', quantity: 500, unit: 'g' },
      { name: 'Ris', quantity: 250, unit: 'g' },
      { name: 'Svarta bönor', quantity: 240, unit: 'g' },
      { name: 'Tortilla', quantity: 6, unit: 'st' }
    ],
    [
      'Koka ris',
      'Stek färs med kryddor',
      'Fyll tortilla med ris, bönor och färs',
      'Rulla ihop och stek ytan lätt'
    ],
    15, 20, 'protein', 'medium',
    { calories: 760, protein: 40, carbs: 90, fat: 24 },
    ['mexikansk', 'wrap', 'matlåda', 'familj', 'fest', 'varm', 'middag', 'husman']
  ),

  make(43, 'Svampstroganoff',
    'Vegetarisk stroganoff med champinjoner och grädde',
    [
      { name: 'Champinjoner', quantity: 400, unit: 'g' },
      { name: 'Grädde', quantity: 200, unit: 'ml' },
      { name: 'Lök', quantity: 1, unit: 'st' },
      { name: 'Ris', quantity: 250, unit: 'g' }
    ],
    [
      'Stek svamp och lök',
      'Häll på grädde och senap',
      'Sjud 10 minuter',
      'Servera med ris'
    ],
    10, 15, 'vegetables', 'easy',
    { calories: 520, protein: 12, carbs: 70, fat: 18 },
    ['vegetarisk', 'gryta', 'svamp', 'krämig', 'varm', 'vinter', 'vardag', 'familj']
  ),

  make(44, 'Fläskkotlett med äpple',
    'Stekt fläskkotlett med äpple och potatis',
    [
      { name: 'Fläskkotlett', quantity: 600, unit: 'g' },
      { name: 'Äpple', quantity: 2, unit: 'st' },
      { name: 'Potatis', quantity: 700, unit: 'g' },
      { name: 'Smör', quantity: 40, unit: 'g' }
    ],
    [
      'Stek kotletter',
      'Stek skivade äpplen i smör',
      'Koka eller rosta potatis',
      'Servera allt tillsammans'
    ],
    10, 20, 'protein', 'easy',
    { calories: 620, protein: 42, carbs: 48, fat: 26 },
    ['fläsk', 'snabb', 'husman', 'äpple', 'vinter', 'familj', 'vardag', 'potatis']
  ),

  make(45, 'Kyckling curry kokos',
    'Mild kycklingcurry med kokosmjölk och ris',
    [
      { name: 'Kycklinglårfilé', quantity: 500, unit: 'g' },
      { name: 'Kokosmjölk', quantity: 400, unit: 'ml' },
      { name: 'Currypasta', quantity: 2, unit: 'msk' },
      { name: 'Ris', quantity: 300, unit: 'g' }
    ],
    [
      'Bryn kyckling',
      'Rör i currypasta och kokosmjölk',
      'Sjud 15 minuter',
      'Servera med ris'
    ],
    10, 20, 'protein', 'easy',
    { calories: 600, protein: 36, carbs: 60, fat: 22 },
    ['asiatisk', 'kyckling', 'gryta', 'kryddig', 'varm', 'familj', 'middag', 'kokos']
  ),

  make(46, 'Linsbolognese',
    'Vegetarisk bolognese på röda linser',
    [
      { name: 'Röda linser', quantity: 250, unit: 'g' },
      { name: 'Krossade tomater', quantity: 800, unit: 'g' },
      { name: 'Lök', quantity: 1, unit: 'st' },
      { name: 'Spaghetti', quantity: 400, unit: 'g' }
    ],
    [
      'Fräs lök och vitlök',
      'Tillsätt linser och tomat, sjud 20 minuter',
      'Servera med pasta',
      'Toppa med parmesan om önskas'
    ],
    10, 25, 'vegetables', 'easy',
    { calories: 520, protein: 20, carbs: 86, fat: 8 },
    ['vegetarisk', 'pasta', 'billig', 'linser', 'italiensk', 'vardag', 'familj', 'hälsosam']
  ),

  make(47, 'BBQ-kyckling i ugn',
    'Ugnsbakad kyckling med BBQ-sås och majs',
    [
      { name: 'Kycklingklubbor', quantity: 800, unit: 'g' },
      { name: 'BBQ-sås', quantity: 150, unit: 'ml' },
      { name: 'Majs', quantity: 300, unit: 'g' },
      { name: 'Potatis', quantity: 600, unit: 'g' }
    ],
    [
      'Blanda kyckling med BBQ-sås',
      'Baka 35–40 min i 200°C',
      'Rosta potatis och servera med majs',
      'Toppa med salladslök'
    ],
    15, 40, 'protein', 'easy',
    { calories: 700, protein: 44, carbs: 68, fat: 24 },
    ['ugn', 'kyckling', 'familj', 'BBQ', 'helg', 'fest', 'varm', 'middag']
  ),

  make(48, 'Grekisk souvlaki',
    'Grillspett av fläsk med tzatziki och pitabröd',
    [
      { name: 'Fläskkarré', quantity: 600, unit: 'g' },
      { name: 'Pitabröd', quantity: 4, unit: 'st' },
      { name: 'Yoghurt', quantity: 200, unit: 'g' },
      { name: 'Gurka', quantity: 100, unit: 'g' }
    ],
    [
      'Marinera köttet och trä på spett',
      'Grilla eller stek hett',
      'Gör tzatziki av yoghurt och gurka',
      'Servera med pita och lök'
    ],
    20, 15, 'protein', 'medium',
    { calories: 620, protein: 40, carbs: 52, fat: 24 },
    ['grekisk', 'grillat', 'snabb', 'spett', 'sommar', 'fest', 'familj', 'medelhav']
  ),

  make(49, 'Pytt med korv',
    'Potatispytt med korv och ägg',
    [
      { name: 'Potatis', quantity: 600, unit: 'g' },
      { name: 'Korv', quantity: 300, unit: 'g' },
      { name: 'Lök', quantity: 1, unit: 'st' },
      { name: 'Ägg', quantity: 2, unit: 'st' }
    ],
    [
      'Tärna och stek potatis och lök',
      'Tillsätt skivad korv',
      'Toppa med stekt ägg',
      'Servera med rödbetor'
    ],
    15, 15, 'protein', 'easy',
    { calories: 620, protein: 26, carbs: 56, fat: 28 },
    ['husman', 'snabb', 'korv', 'pytt', 'vinter', 'vardag', 'familj', 'rest']
  ),

  make(50, 'Shakshuka med feta',
    'Tomatgryta med ägg och fetaost, serveras med bröd',
    [
      { name: 'Krossade tomater', quantity: 800, unit: 'g' },
      { name: 'Ägg', quantity: 4, unit: 'st' },
      { name: 'Fetaost', quantity: 150, unit: 'g' },
      { name: 'Lök', quantity: 1, unit: 'st' }
    ],
    [
      'Fräs lök och paprikapulver',
      'Häll i tomater och sjud',
      'Gör gropar och knäck i ägg',
      'Smula feta ovanpå och servera'
    ],
    10, 20, 'dairy', 'easy',
    { calories: 480, protein: 24, carbs: 28, fat: 28 },
    ['mellanöstern', 'vegetarisk', 'gryta', 'ägg', 'varm', 'vår', 'sommar', 'brunch']
  )
]

export function expandToHundred(base: Recipe[]): Recipe[] {
  // Returnera alla 50 recept
  return base.slice(0, 50)
}

export const defaultRecipes: Recipe[] = expandToHundred(baseRecipes)


