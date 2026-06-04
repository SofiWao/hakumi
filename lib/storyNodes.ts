export type StoryChoice = {
  text: string;
  nextSceneId: string;
  stateChanges?: {
    ansiedad?: number;
    esperanza?: number;
  };
  newThought?: {
    id: string;
    title: string;
    description: string;
  };
};

export type StoryNode = {
  id: string;
  imagePath?: string;
  description: string[];
  choices: StoryChoice[];
  isGlitchy?: boolean;
};

export const storyNodes: Record<string, StoryNode> = {
  start: {
    id: 'start',
    imagePath: '/web de referencia/imagenes/HakumiIcon.jpg',
    description: [
      'En lo profundo de la oscuridad, nace una radiante luz imparable.',
      'Capaz de dejar sin ver a quienes admiren su belleza, pero incluso quiere matar a quienes opten por ignorarla.',
      'Un mundo de sueños repleto de pesadillas que nunca terminan...',
      'Y de repente, apareces tú. Hakumi. No recuerdas cómo llegaste aquí, pero sabes que debes moverte.'
    ],
    choices: [
      {
        text: 'Caminar hacia la luz deslumbrante.',
        nextSceneId: 'escena_luz',
        stateChanges: { ansiedad: 5, esperanza: 2 }
      },
      {
        text: 'Quedarte en la oscuridad y observar.',
        nextSceneId: 'escena_oscuridad',
        stateChanges: { ansiedad: -2, esperanza: -1 },
        newThought: {
          id: 't_oscuridad',
          title: 'Aliada Silenciosa',
          description: 'A veces la oscuridad no es tu enemiga, sino el único lugar que te permite ver.'
        }
      }
    ]
  },
  escena_luz: {
    id: 'escena_luz',
    imagePath: '/web de referencia/imagenes/HakumiIcon.jpg',
    description: [
      'La luz te quema los ojos, dejándote temporalmente ciega.',
      'Un dolor agudo recorre tu pequeña figura blanca. Escuchas voces que te exigen cambiar, ser mejor, ser "brillante".'
    ],
    isGlitchy: true,
    choices: [
      {
        text: 'Soportar el dolor y seguir acercándote.',
        nextSceneId: 'bad_ending_light',
        stateChanges: { ansiedad: 20 }
      },
      {
        text: 'Retroceder, buscando el cobijo de las sombras.',
        nextSceneId: 'start',
        newThought: {
          id: 't_luz_cegadora',
          title: 'Luz Engañosa',
          description: 'La luz a veces extingue tu verdadera esencia. Te obliga a cerrar los ojos ante el dolor.'
        }
      }
    ]
  },
  escena_oscuridad: {
    id: 'escena_oscuridad',
    imagePath: '/web de referencia/imagenes/HakumiIcon.jpg',
    description: [
      'Te envuelve un manto negro y frío. Al principio asusta, pero pronto notas una extraña paz.',
      'En la penumbra, tus ojos bicolor comienzan a distinguir formas. No estás sola.'
    ],
    choices: [
      {
        text: 'Acercarte a las formas en la oscuridad.',
        nextSceneId: 'good_ending_acceptance',
        stateChanges: { esperanza: 10 }
      },
      {
        text: 'Huir hacia atrás asustada.',
        nextSceneId: 'start',
        stateChanges: { ansiedad: 5 }
      }
    ]
  },
  bad_ending_light: {
    id: 'bad_ending_light',
    description: [
      'FINAL: LA CEGUERA',
      'Te acercaste tanto a la luz que te consumió. Ya no hay miedo, pero tampoco queda nada de Hakumi. Solo eres parte del resplandor vacío.'
    ],
    choices: [
      { text: 'Volver a despertar (Reintentar)', nextSceneId: 'start' }
    ]
  },
  good_ending_acceptance: {
    id: 'good_ending_acceptance',
    description: [
      'FINAL: LA ACEPTACIÓN',
      'Las formas eran tus propios recuerdos fragmentados. Al abrazarlos en la oscuridad, te completas a ti misma. La niebla se disipa.'
    ],
    choices: [
      { text: 'Volver a despertar (Reintentar)', nextSceneId: 'start' }
    ]
  }
};
