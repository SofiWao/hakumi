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
  // ==========================================
  // CAPÍTULO I: EL DESPERTAR - Donde la lumbre no alumbra
  // Subtítulo: ¿Y si la luz es el único velo?
  // ==========================================
  start: {
    id: 'start',
    imagePath: '/web de referencia/imagenes/HakumiIcon.jpg',
    description: [
      'Abre los ojos...',
      'No despiertas en una habitación ni en una calle familiar. Despiertas dentro de una sensación.',
      'Un neutro absoluto te rodea: un vacío desolado donde el silencio zumba como un cristal a punto de romperse.',
      'Tu pequeño cuerpo blanco emite un leve fulgor en la oscuridad. Ante ti, la penumbra se bifurca en dos caminos contrapuestos.'
    ],
    choices: [
      {
        text: 'Caminar hacia El Resplandor (cálido, brillante y en apariencia seguro).',
        nextSceneId: 'escena_resplandor',
        stateChanges: { ansiedad: 5, esperanza: 2 }
      },
      {
        text: 'Adentrarte en La Penumbra (fría, incómoda y desolada).',
        nextSceneId: 'escena_penumbra',
        stateChanges: { ansiedad: -2, esperanza: 4 },
        newThought: {
          id: 't_introspeccion',
          title: 'Adentrarse en lo Incierto',
          description: 'No todas las lumbres guían; algunas veces debes adentrarte en la penumbra para encontrar claridad.'
        }
      }
    ]
  },

  // RAMIFICACIÓN RESPLANDOR (EVASIÓN ANSIOSA)
  escena_resplandor: {
    id: 'escena_resplandor',
    imagePath: '/web de referencia/imagenes/HakumiIcon.jpg',
    description: [
      'El Resplandor te envuelve en una calidez acogedora, deslumbrante y casi infantil.',
      'Un murmullo suave susurra en el aire que todo está bien, que aquí estás a salvo de tus propios miedos.',
      'Sin embargo, cada pocos segundos la melodía cálida se pausa en seco por medio segundo, como un mecanismo trabado. Tu mirada se deslumbrante ante tanto brillo.'
    ],
    isGlitchy: true,
    choices: [
      {
        text: 'Refugiarte en la luz bella y ocultar el dolor que sientes.',
        nextSceneId: 'resplandor_falso',
        stateChanges: { ansiedad: 10, esperanza: -3 },
        newThought: {
          id: 't_evasion',
          title: 'Velo de Cristal',
          description: 'Si cubres las grietas con luz deslumbrante, la fractura interna sigue estando ahí.'
        }
      },
      {
        text: 'Cuestionar la calidez de la luz y buscar las imperfecciones.',
        nextSceneId: 'grieta_resplandor',
        stateChanges: { ansiedad: 3, esperanza: 6 },
        newThought: {
          id: 't_duda',
          title: 'Confort Roto',
          description: 'Aquello que nos consuela demasiado rápido suele ser un anestésico para no mirar la verdad.'
        }
      }
    ]
  },

  resplandor_falso: {
    id: 'resplandor_falso',
    imagePath: '/web de referencia/imagenes/HakumiIcon.jpg',
    description: [
      'Te esfuerzas por sonreír y mantenerte dentro de la luz cálida.',
      'El brillo se vuelve sofocante. Las grietas en tu cuerpo blanco comienzan a arder bajo el resplandor artificial.',
      'Sientes que estás escapando de algo, pero el precio de huir es dejar pedazos de tu ser atrás.'
    ],
    isGlitchy: true,
    choices: [
      {
        text: 'Forzar el paso hacia la salida cegadora (Huir sin entender).',
        nextSceneId: 'bad_ending_light',
        stateChanges: { ansiedad: 25, esperanza: -10 }
      },
      {
        text: 'Soltar la ilusión y dejarte caer hacia las sombras subterráneas.',
        nextSceneId: 'cap2_el_naufragio',
        stateChanges: { ansiedad: -5, esperanza: 8 }
      }
    ]
  },

  grieta_resplandor: {
    id: 'grieta_resplandor',
    imagePath: '/web de referencia/imagenes/HakumiIcon.jpg',
    description: [
      'Al observar con atención, notas que la luz brillante era solo un velo proyectado sobre ruinas.',
      'Al no encandilarte con el resplandor, tus ojos heterocromáticos perciben el suelo de cristal roto bajo tus patas.',
      'Un eco distante resonando como agua en movimiento te invita a descender hacia las profundidades de tu mente.'
    ],
    choices: [
      {
        text: 'Avanzar hacia las aguas oscuras de la memoria.',
        nextSceneId: 'cap2_el_naufragio',
        stateChanges: { ansiedad: 2, esperanza: 10 }
      }
    ]
  },

  // RAMIFICACIÓN PENUMBRA (INTROSPECCIÓN & LA ENTIDAD)
  escena_penumbra: {
    id: 'escena_penumbra',
    imagePath: '/web de referencia/imagenes/HakumiIcon.jpg',
    description: [
      'La Penumbra es fría, clínica y extraña. El ruido mental se apaga y queda un silencio denso.',
      'Caminas sobre un espejo de agua negra que refleja las estrellas bioluminiscentes de tu interior.',
      'De repente, toda melodía se corta por completo. Frente a ti, envuelta en la oscuridad, surge una figura sombría de mirada penetrante: La Entidad.',
      'No ataca. No habla en voz alta. Pero escuchas en tu mente su frase enigmática: "A veces, lo que ves no es lo que es..."'
    ],
    choices: [
      {
        text: 'Dar un paso hacia La Entidad y sostenerle la mirada.',
        nextSceneId: 'encuentro_entidad',
        stateChanges: { ansiedad: -4, esperanza: 12 },
        newThought: {
          id: 't_entidad',
          title: 'La Sombra Guía',
          description: 'La sombra no viene a devorarte; viene a mostrarte lo que aún no has tenido el valor de mirar.'
        }
      },
      {
        text: 'Dar la espalda asustada y refugiarte en tus pensamientos.',
        nextSceneId: 'penumbra_rumiacion',
        stateChanges: { ansiedad: 12, esperanza: -4 },
        newThought: {
          id: 't_rumiacion',
          title: 'Niebla Mental',
          description: 'El miedo a la oscuridad transforma cualquier silencio en una amenaza imaginaria.'
        }
      }
    ]
  },

  encuentro_entidad: {
    id: 'encuentro_entidad',
    imagePath: '/web de referencia/imagenes/HakumiIcon.jpg',
    description: [
      'Al dar el paso, La Entidad no se mueve. Por un segundo, la oscuridad se aclara un semitono, permitiéndote ver más allá.',
      'Ves tus propias cicatrices brillando con una luz dorada y suave. La Entidad señala hacia un lago profundo donde flotan los vestigios del pasado.',
      'Comprendes que la sombra no es tu enemiga, sino una parte de ti que esperaba ser entendida.'
    ],
    choices: [
      {
        text: 'Sumergirte junto a La Entidad hacia El Naufragio.',
        nextSceneId: 'cap2_el_naufragio',
        stateChanges: { ansiedad: -5, esperanza: 15 }
      }
    ]
  },

  penumbra_rumiacion: {
    id: 'penumbra_rumiacion',
    imagePath: '/web de referencia/imagenes/HakumiIcon.jpg',
    description: [
      'Al huir de La Entidad, te encierras en una espiral de pensamientos acelerados.',
      'El aire se vuelve pesado y la niebla te desorienta. Los recuerdos rotos giran a tu alrededor como un torbellino de ecos indefinidos.',
      'Sientes que te ahogas en el ayer.'
    ],
    choices: [
      {
        text: 'Dejarte llevar por la corriente de recuerdos marchitos.',
        nextSceneId: 'cap2_el_naufragio',
        stateChanges: { ansiedad: 8, esperanza: 2 }
      },
      {
        text: 'Intentar aferrarte a una ilusión del pasado (Aislamiento nostálgico).',
        nextSceneId: 'good_ending_acceptance',
        stateChanges: { ansiedad: -5, esperanza: -10 }
      }
    ]
  },

  // ==========================================
  // CAPÍTULO II: EL NAUFRAGIO
  // Subtítulo: Hiraeth - El anhelo de un lugar que no existe
  // ==========================================
  cap2_el_naufragio: {
    id: 'cap2_el_naufragio',
    imagePath: '/web de referencia/imagenes/HakumiIcon.jpg',
    description: [
      'CAPÍTULO II: EL NAUFRAGIO',
      '"Hiraeth - El anhelo de un lugar que no existe."',
      'Emerges en una inmensidad de agua negra reflectante sumergida en la penumbra. El sonido parece transmitirse bajo el agua.',
      'A tu alrededor flotan objetos cotidianos deformados, relojes de arena suspendidos sin tiempo y espejos agrietados que muestran rostros que no terminas de reconocer.',
      'Sientes una profunda nostalgia: la añoranza por un tiempo que ya no existe, o que tal vez nunca existió.'
    ],
    choices: [
      {
        text: 'Acercarte a los Espejos Agrietados para mirar tus reflejos fragmentados.',
        nextSceneId: 'cap2_espejos_rotos',
        stateChanges: { ansiedad: 6, esperanza: 8 },
        newThought: {
          id: 't_hiraeth',
          title: 'Hiraeth',
          description: 'Extrañar un lugar que ya no existe es la forma en que el alma intenta reconstruir su propio hogar.'
        }
      },
      {
        text: 'Intentar tocar los Relojes Suspendidos para detener el paso del tiempo.',
        nextSceneId: 'cap2_relojes_detenidos',
        stateChanges: { ansiedad: 10, esperanza: -2 },
        newThought: {
          id: 't_tiempo',
          title: 'Tiempo Suspendido',
          description: 'Aferrarse al ayer no congela el dolor; solo impide que el presente respire.'
        }
      },
      {
        text: 'Seguir la silueta de La Entidad que camina sobre la superficie del agua negra hacia Punto Ciego.',
        nextSceneId: 'cap2_sombra_lago',
        stateChanges: { ansiedad: -3, esperanza: 14 }
      }
    ]
  },

  cap2_espejos_rotos: {
    id: 'cap2_espejos_rotos',
    imagePath: '/web de referencia/imagenes/HakumiIcon.jpg',
    description: [
      'Te contemplas en el cristal agrietado. Cada grieta del espejo coincide exactamente con las grietas en tu cuerpo blanco.',
      'Al aceptar la imagen fragmentada, comprendes que no necesitas estar "entera" para ser real.',
      'El estanque se distorsiona y los pasillos de cristal conducen hacia el Punto Ciego de tu psique.'
    ],
    choices: [
      {
        text: 'Adentrarte en los pasillos vigilados del Punto Ciego.',
        nextSceneId: 'cap3_punto_ciego',
        stateChanges: { ansiedad: 5, esperanza: 8 }
      }
    ]
  },

  cap2_relojes_detenidos: {
    id: 'cap2_relojes_detenidos',
    imagePath: '/web de referencia/imagenes/HakumiIcon.jpg',
    description: [
      'Tocas la esfera del reloj suspendido. Las agujas se mueven violentamente hacia atrás.',
      'Te sumerges en una espiral de melancolía sofocante. La nostalgia se vuelve demasiado cálida y pesada, encadenándote al pasado.'
    ],
    choices: [
      {
        text: 'Resistir la parálisis del tiempo y forzar el paso hacia Punto Ciego.',
        nextSceneId: 'cap3_punto_ciego',
        stateChanges: { ansiedad: 12, esperanza: 2 }
      },
      {
        text: 'Permanecer sumergida en los recuerdos eternos (Final Bueno / El Refugio).',
        nextSceneId: 'good_ending_acceptance',
        stateChanges: { esperanza: 5, ansiedad: -5 }
      }
    ]
  },

  cap2_sombra_lago: {
    id: 'cap2_sombra_lago',
    imagePath: '/web de referencia/imagenes/HakumiIcon.jpg',
    description: [
      'Caminas tras La Entidad sobre el lago estelar. El agua refleja tus dos ojos: el cian del dolor y el dorado del futuro.',
      'La Entidad se da la vuelta. Al extender su mano de sombra, sus ojos brillan con la misma heterocromía que los tuyos.',
      'Te guía con calma a través del abismo directamente hacia los corredores del Punto Ciego.'
    ],
    choices: [
      {
        text: 'Cruzar el umbral del Punto Ciego tomada de su mano de sombra.',
        nextSceneId: 'cap3_punto_ciego',
        stateChanges: { ansiedad: -5, esperanza: 15 }
      }
    ]
  },

  // ==========================================
  // CAPÍTULO III: PUNTO CIEGO
  // Subtítulo: El trauma es un reflejo que no se puede romper
  // ==========================================
  cap3_punto_ciego: {
    id: 'cap3_punto_ciego',
    imagePath: '/web de referencia/imagenes/HakumiIcon.jpg',
    description: [
      'CAPÍTULO III: PUNTO CIEGO',
      '"El trauma es un reflejo que no se puede romper."',
      'Ingresas en un laberinto no euclidiano de paredes traslúcidas y grietas flotantes.',
      'Sientes una presencia constante: ojos abstractos observándote desde cada esquina. La percepción del espacio pierde estabilidad. Si miras fijamente un pasillo, este cambia o desaparece.',
      'El trauma no es un monstruo exterior; es lo que permanece no reconocido dentro de ti.'
    ],
    isGlitchy: true,
    choices: [
      {
        text: 'Sostener la mirada a las sombras vigilantes y aceptar el dolor del trauma.',
        nextSceneId: 'cap3_mirada_directa',
        stateChanges: { ansiedad: 8, esperanza: 10 },
        newThought: {
          id: 't_hipervigilancia',
          title: 'Hipervigilancia',
          description: 'La sensación de estar siendo juzgada desaparece cuando dejas de ser tu propio verdugo.'
        }
      },
      {
        text: 'Usar la niebla densa como refugio paradójico para protegerte.',
        nextSceneId: 'cap3_refugio_niebla',
        stateChanges: { ansiedad: -4, esperanza: 5 },
        newThought: {
          id: 't_niebla_refugio',
          title: 'Refugio de Niebla',
          description: 'A veces la niebla no busca ocultar el camino, sino darte un respiro cuando la luz quema.'
        }
      },
      {
        text: 'Permitir que La Entidad camine a tu lado a través del juicio de los espejos.',
        nextSceneId: 'cap3_sombra_trauma',
        stateChanges: { ansiedad: -8, esperanza: 16 }
      }
    ]
  },

  cap3_mirada_directa: {
    id: 'cap3_mirada_directa',
    imagePath: '/web de referencia/imagenes/HakumiIcon.jpg',
    description: [
      'Te detienes en seco. Dejas de huir de los ojos implacables que acechan en las sombras.',
      'Al mirar directamente al espejo del trauma, la superficie agrietada se quiebra en mil destellos dorados.',
      'Entiendes que no eres el dolor de tu pasado, sino lo que eliges construir con las heridas que permanecen.',
      'El laberinto se disuelve y una escalera de luz abisal se eleva hacia El Descanso.'
    ],
    choices: [
      {
        text: 'Ascender por la escalera hacia el Capítulo Final: El Descanso.',
        nextSceneId: 'cap4_el_descanso',
        stateChanges: { ansiedad: -5, esperanza: 12 }
      }
    ]
  },

  cap3_refugio_niebla: {
    id: 'cap3_refugio_niebla',
    imagePath: '/web de referencia/imagenes/HakumiIcon.jpg',
    description: [
      'La niebla te rodea como un abrazo protector. Los ojos vigilantes se desvanecen en la penumbra.',
      'Caminas despacio, guiada únicamente por el latido pausado de tu corazón.',
      'La niebla abre un pasaje sereno hacia el umbral del clímax.'
    ],
    choices: [
      {
        text: 'Avanzar a través de la niebla hacia El Descanso.',
        nextSceneId: 'cap4_el_descanso',
        stateChanges: { ansiedad: -2, esperanza: 8 }
      }
    ]
  },

  cap3_sombra_trauma: {
    id: 'cap3_sombra_trauma',
    imagePath: '/web de referencia/imagenes/HakumiIcon.jpg',
    description: [
      'La Entidad se coloca entre ti y los espejos del juicio.',
      'Su figura de sombra absorbe los murmullos del trauma, transformándolos en notas musicales armónicas.',
      'Hakumi y La Entidad caminan sincronizadas. Las alas de cristal abisal en tu espalda comienzan a desplegarse.',
      'El camino hacia El Descanso se abre en plenitud.'
    ],
    choices: [
      {
        text: 'Cruzar juntas hacia El Descanso final.',
        nextSceneId: 'cap4_el_descanso',
        stateChanges: { ansiedad: -10, esperanza: 20 }
      }
    ]
  },

  // ==========================================
  // CAPÍTULO IV: EL DESCANSO
  // Subtítulo: ¿O es que la sombra siempre fue el espejo?
  // ==========================================
  cap4_el_descanso: {
    id: 'cap4_el_descanso',
    imagePath: '/web de referencia/imagenes/HakumiIcon.jpg',
    description: [
      'CAPÍTULO IV: EL DESCANSO',
      '"¿O es que la sombra siempre fue el espejo?"',
      'Llegas a la cumbre de la psique: una meseta serena donde un faro abisal ilumina un estanque cristalino.',
      'El final de tu viaje no se trata de ganar o perder, sino de cómo te relacionaste con la luz y la penumbra.',
      'Frente a ti se yergue el espejo final. Tu destino acumulado aguarda tu elección definitiva.'
    ],
    choices: [
      {
        text: 'Cerrar los ojos y forzar la huida cegadora (Final Malo: La Fuga Incompleta).',
        nextSceneId: 'bad_ending_light',
        stateChanges: { ansiedad: 20, esperanza: -10 }
      },
      {
        text: 'Quedarte a habitar los recuerdos en la quietud de la nostalgia (Final Bueno: El Reflejo Roto).',
        nextSceneId: 'good_ending_acceptance',
        stateChanges: { esperanza: 10, ansiedad: -5 }
      },
      {
        text: 'Fundirte con La Entidad y aceptar tu ser completo (Final Verdadero: La Sombra fue el Faro).',
        nextSceneId: 'true_ending_equilibrium',
        stateChanges: { esperanza: 25, ansiedad: -20 },
        newThought: {
          id: 't_integracion',
          title: 'Integración Abisal',
          description: 'No estás rota. Las grietas son los canales por donde la luz y la sombra conversan dentro de ti.'
        }
      }
    ]
  },

  // ==========================================
  // FINALES PRINCIPALES DE HAKUMI
  // ==========================================
  bad_ending_light: {
    id: 'bad_ending_light',
    description: [
      'FINAL MALO: LA FUGA INCOMPLETA',
      '"Escapaste de la penumbra, pero te llevaste el velo puesto."',
      'Te acercaste tanto al resplandor cegador que las grietas de tu cuerpo se sellaron con luz artificial.',
      'Crees haber ganado y escapado, pero sigues ciega e incompleta. Abandonaste tus recuerdos verdaderos para refugiarte en una ilusión de bienestar.'
    ],
    choices: [
      { text: 'Abre los ojos nuevamente (Despertar de nuevo)', nextSceneId: 'start' }
    ]
  },

  good_ending_acceptance: {
    id: 'good_ending_acceptance',
    description: [
      'FINAL BUENO: EL REFLEJO ROTO',
      '"Rompiste el espejo para por fin verte entera."',
      'Abrazaste tus recuerdos fragmentados en la serenidad de la nostalgia.',
      'Te quedas sumida en tus propios recuerdos dentro del abismo, intentando comprenderlos. No logras escapar al mundo exterior, pero encuentras un sueño eterno reconfortante.'
    ],
    choices: [
      { text: 'Abre los ojos nuevamente (Despertar de nuevo)', nextSceneId: 'start' }
    ]
  },

  true_ending_equilibrium: {
    id: 'true_ending_equilibrium',
    description: [
      'FINAL VERDADERO (EL OCULTO): LA SOMBRA FUE EL FARO',
      '"La que creíste que te perseguía, era la que te estaba esperando."',
      'Has alcanzado la integración y el equilibrio emocional. Tus alas fragmentadas de cristal abisal ahora brillan con un halo de luz dorada.',
      'La Entidad y tú se funden en un solo ser. No huyes de la oscuridad ni le temes al resplandor; la luz y la sombra caminan juntas en ti.'
    ],
    choices: [
      { text: 'Abre los ojos nuevamente (Reiniciar ciclo emocional)', nextSceneId: 'start' }
    ]
  }
};
