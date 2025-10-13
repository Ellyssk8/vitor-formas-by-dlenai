import { GeometricShape } from "@/components/ShapeCard";

export const geometricShapes: GeometricShape[] = [
  {
    id: "square",
    name: "Quadrado",
    color: "blue",
    sides: 4,
    emoji: "⬜",
    description: "Um quadrado tem 4 lados iguais e 4 ângulos de 90°. É um polígono regular!"
  },
  {
    id: "rectangle",
    name: "Retângulo",
    color: "green",
    sides: 4,
    emoji: "📱",
    description: "Um retângulo tem 4 lados, sendo os lados opostos iguais e paralelos."
  },
  {
    id: "triangle",
    name: "Triângulo",
    color: "red",
    sides: 3, 
    emoji: "🔺",
    description: "Um triângulo tem 3 lados e 3 ângulos. A soma dos ângulos internos é sempre 180°!"
  },
  {
    id: "circle",
    name: "Círculo", 
    color: "orange",
    sides: 0,
    emoji: "⭕",
    description: "Um círculo é uma forma redonda perfeita. Todos os pontos estão à mesma distância do centro!"
  },
  {
    id: "pentagon",
    name: "Pentágono", 
    color: "purple",
    sides: 5,
    emoji: "⬟",
    description: "Um pentágono tem 5 lados e 5 ângulos. O Pentágono dos EUA tem essa forma!"
  },
  {
    id: "hexagon", 
    name: "Hexágono",
    color: "yellow",
    sides: 6,
    emoji: "⬢",
    description: "Um hexágono tem 6 lados. As abelhas fazem seus favos nesta forma!"
  },
  {
    id: "octagon",
    name: "Octógono",
    color: "red", 
    sides: 8,
    emoji: "🛑",
    description: "Um octógono tem 8 lados. As placas de 'PARE' têm formato octogonal!"
  },
  {
    id: "oval",
    name: "Oval",
    color: "turquoise",
    sides: 0,
    emoji: "🥚",
    description: "Um oval é uma forma alongada parecida com um ovo ou elipse."
  },
  {
    id: "diamond",
    name: "Losango",
    color: "pink",
    sides: 4,
    emoji: "◇",
    description: "Um losango tem 4 lados iguais, mas diferentes ângulos do quadrado."
  },
  {
    id: "star",
    name: "Estrela",
    color: "yellow",
    sides: 10,
    emoji: "⭐",
    description: "Uma estrela de 5 pontas tem 10 lados! Ela é formada por 5 triângulos."
  },
  {
    id: "trapezoid",
    name: "Trapézio",
    color: "green",
    sides: 4,
    emoji: "⏢",
    description: "Um trapézio tem 4 lados, sendo 2 lados paralelos entre si."
  },
  {
    id: "parallelogram",
    name: "Paralelogramo",
    color: "blue",
    sides: 4,
    emoji: "▱",
    description: "Um paralelogramo tem lados opostos paralelos e iguais."
  }
];

export const gameMessages = {
  welcome: "OLÁ! SOU O VITOR E VOU TE ENSINAR GEOMETRIA DE FORMA DIVERTIDA!",
  encouragement: [
    "FANTÁSTICO! VOCÊ ENTENDE BEM DE GEOMETRIA!",
    "PERFEITO! CONTINUE EXPLORANDO AS FORMAS!",
    "EXCELENTE RACIOCÍNIO MATEMÁTICO!",
    "PARABÉNS! VOCÊ TEM TALENTO PARA GEOMETRIA!",
    "INCRÍVEL! SUA COMPREENSÃO ESTÁ EVOLUINDO!",
    "MUITO BEM! A MATEMÁTICA ESTÁ FICANDO FÁCIL PARA VOCÊ!",
    "ÓTIMO TRABALHO! VOCÊ ESTÁ DOMINANDO AS FORMAS GEOMÉTRICAS!",
    "SHOW! CONTINUE PRATICANDO E VOCÊ SERÁ EXPERT EM GEOMETRIA!"
  ],
  instructions: {
    identification: "OBSERVE BEM A FORMA E IDENTIFIQUE SEU NOME CORRETO:",
    matching: "ARRASTE CADA FORMA GEOMÉTRICA PARA SUA SILHUETA CORRESPONDENTE:",
    counting: "ANALISE A FORMA E CONTE QUANTOS LADOS ELA POSSUI:"
  }
};

export enum GameMode {
  MENU = "menu",
  IDENTIFICATION = "identification", 
  MATCHING = "matching",
  COUNTING = "counting"
}

export interface GameState {
  mode: GameMode;
  score: number;
  currentShape: GeometricShape | null;
  options: GeometricShape[];
  showFeedback: boolean;
  isCorrect: boolean;
  level: number;
}