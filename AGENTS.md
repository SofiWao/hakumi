<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Guía para Desarrolladores y Agentes — Hakumi: Abyssal Light

Este archivo sirve como manual de referencia para cualquier agente de IA o desarrollador humano que trabaje en el proyecto **Hakumi**. Contiene la visión conceptual del juego, la arquitectura del software y reglas específicas para expandir el código en futuras actualizaciones.

---

## 1. Visión del Juego y Filosofía

**Hakumi: Abyssal Light of a Mind Lost in Darkness** es una experiencia narrativa interactiva de terror psicológico, dreamcore/weirdcore y exploración emocional.

* **El Propósito Central:** La experiencia está diseñada con un fin terapéutico e introspectivo. El objetivo no es derrotar monstruos ni limitarse a escapar, sino **comprender** la mente fragmentada de Hakumi.
* **Protagonista:** Hakumi, una pequeña gata blanca de ojos heterocromáticos (Azul: tristeza/recuerdos; Dorado: esperanza/futuro) con grietas físicas que cambian según las estadísticas del jugador.
* **La Entidad:** Una presencia ambigua (la sombra interior) que aparece en momentos clave. Seguirla o ignorarla define los finales.
* **Finales Principales:**
  1. *Bueno (La Salida):* Huir sin comprender del todo, abandonando partes de sí misma.
  2. *Malo (El Refugio):* Permanecer en la comodidad de la oscuridad sin avanzar.
  3. *Verdadero (El Desconocido):* Integrar la luz y la oscuridad al seguir a la Entidad y encontrar el equilibrio.

---

## 2. Arquitectura de Software y Tecnologías

El proyecto está construido sobre Next.js (v16.2.6) usando TypeScript y React.

### Estructura de Directorios Clave:
* [app/](file:///c:/Users/Sofiwii/Desktop/cosas importantes de toda mi computadora/Juego terapeutico (proyecto personal)/hakumi/app) - Punto de entrada principal y ruteo. Contiene [page.tsx](file:///c:/Users/Sofiwii/Desktop/cosas importantes de toda mi computadora/Juego terapeutico (proyecto personal)/hakumi/app/page.tsx) (Menú de inicio y lógica de flujo del juego).
* [components/](file:///c:/Users/Sofiwii/Desktop/cosas importantes de toda mi computadora/Juego terapeutico (proyecto personal)/hakumi/components) - Componentes visuales autónomos:
  * [Sidebar.tsx](file:///c:/Users/Sofiwii/Desktop/cosas importantes de toda mi computadora/Juego terapeutico (proyecto personal)/hakumi/components/Sidebar.tsx): Menú derecho ("Mente" / "Tejido") que maneja estadísticas, pensamientos e integra el diagrama.
  * [StoryFlowchart.tsx](file:///c:/Users/Sofiwii/Desktop/cosas importantes de toda mi computadora/Juego terapeutico (proyecto personal)/hakumi/components/StoryFlowchart.tsx): Diagrama de flujo interactivo en SVG.
  * [SceneViewer.tsx](file:///c:/Users/Sofiwii/Desktop/cosas importantes de toda mi computadora/Juego terapeutico (proyecto personal)/hakumi/components/SceneViewer.tsx): Renderiza textos progresivos e imágenes con efecto glitch.
  * [ActionPanel.tsx](file:///c:/Users/Sofiwii/Desktop/cosas importantes de toda mi computadora/Juego terapeutico (proyecto personal)/hakumi/components/ActionPanel.tsx): Botones de opciones para tomar decisiones.
* [lib/](file:///c:/Users/Sofiwii/Desktop/cosas importantes de toda mi computadora/Juego terapeutico (proyecto personal)/hakumi/lib) - Estado y datos estructurados:
  * [store.ts](file:///c:/Users/Sofiwii/Desktop/cosas importantes de toda mi computadora/Juego terapeutico (proyecto personal)/hakumi/lib/store.ts): Gestor de estado Zustand con persistencia en `localStorage`.
  * [storyNodes.ts](file:///c:/Users/Sofiwii/Desktop/cosas importantes de toda mi computadora/Juego terapeutico (proyecto personal)/hakumi/lib/storyNodes.ts): Grafo y definición de las escenas y opciones de la historia.

---

## 3. Estado de Juego y Sistema de Saltos Temporales (`lib/store.ts`)

El estado del juego utiliza un sistema de **historial basado en instantáneas** para posibilitar viajes en el tiempo consistentes:

### Estructuras de Datos
* **`HistoryStep`**: Registra `{ sceneId, ansiedad, esperanza, thoughts }`.
* **`visitedNodeIds`**: Almacena de forma global todos los nodos que se han visitado alguna vez (se preserva al reiniciar una partida para mantener el mapa de exploración desbloqueado).

### Lógica de `jumpToNode(sceneId)`
1. **Viaje en Línea Temporal Actual:** Si el nodo de destino está en la pila de `history`, el juego simplemente corta la pila hasta ese índice y restaura el estado mental guardado en esa instantánea.
2. **Viaje Cruzado (Cross-Playthrough):** Si el nodo de destino fue visitado en otra partida pero no está en la línea de tiempo actual, el sistema ejecuta una **búsqueda en anchura (BFS)** sobre el grafo de `storyNodes` partiendo desde `'start'`. Calcula la ruta más corta hasta el nodo objetivo, acumula los cambios de estadísticas y pensamientos de cada opción tomada, y genera un historial simulado consistente para posicionar al jugador directamente allí.

---

## 4. Instrucciones para Expandir y Actualizar el Juego

Cuando agregues nuevas escenas, puzles o mecánicas, sigue al pie de la letra estas directrices:

### A. Añadir una nueva escena
1. Define la escena en [storyNodes.ts](file:///c:/Users/Sofiwii/Desktop/cosas importantes de toda mi computadora/Juego terapeutico (proyecto personal)/hakumi/lib/storyNodes.ts).
2. Estructura la propiedad `choices` asociando cada opción a su `nextSceneId`.
3. Utiliza cambios incrementales moderados en `stateChanges` (por ejemplo, `ansiedad: 5` o `esperanza: -2`).
4. Si la decisión genera una revelación interna, asóciala a un `newThought` para poblar la pestaña de pensamientos fragmentados.

### B. Actualizar el Diagrama de Flujo (`components/StoryFlowchart.tsx`)
Si agregas nodos narrativos intermedios o nuevos finales, debes actualizar el componente visual del diagrama:
1. **Definir Coordenadas en HTML/SVG:** Añade el nodo al arreglo `FLOW_NODES` asignándole coordenadas relativas `x` e `y` (porcentaje) para posicionarlo en el lienzo responsive.
   * *Coordenadas actuales (Lienzo 100x115):*
     * `start`: `(50, 15)`
     * `escena_luz`: `(20, 50)` | `escena_oscuridad`: `(80, 50)`
     * `bad_ending_light`: `(20, 85)` | `good_ending_acceptance`: `(80, 85)`
2. **Crear Conexiones:** Añade un objeto en `FLOW_EDGES` de la forma `{ from: 'nodo_origen', to: 'nodo_destino', side: 'left' | 'right' }`. El renderizador dibujará automáticamente las curvas de transición y aplicará la coloración activa cuando el jugador recorra esa línea temporal.
3. **Iconografía Coherente:** Usa iconos de `lucide-react` acordes a la carga emocional del escenario (ej. `Compass` para explorar, `Sun` para luz/ansiedad, `Moon` para oscuridad/paz).

### C. Implementación de Variables Invisibles Futuras
Para agregar variables indicadas en [historia.md](file:///c:/Users/Sofiwii/Desktop/cosas importantes de toda mi computadora/Juego terapeutico (proyecto personal)/hakumi/historia.md) como *Confianza*, *Curiosidad*, o *Comodidad*:
1. Extiende los campos de la interfaz `GameState` y `HistoryStep` en `lib/store.ts`.
2. Actualiza `findPathAndState`, `makeChoice` y `resetGame` para inicializar y acumular estas nuevas variables en el historial de instantáneas.
3. Integra estos nuevos indicadores emocionales en la pestaña **ESTADO** de [Sidebar.tsx](file:///c:/Users/Sofiwii/Desktop/cosas importantes de toda mi computadora/Juego terapeutico (proyecto personal)/hakumi/components/Sidebar.tsx).
