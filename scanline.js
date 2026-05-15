/**
 * Implementación del algoritmo Scanline Fill
 */
class ScanlineFill {
    /**
     * Constructor
     * @param {CanvasRenderingContext2D} ctx Contexto 2D del canvas donde se dibujará.
     */
    constructor(ctx) {
        this.ctx = ctx; // [cite: 69, 70]
    }
}

/**
     * MÉTODO PRINCIPAL
     * Ejecuta el algoritmo scanline fill.
     * @param {Array} polygon Array de vértices del poligono.
     * @param {String} color Color de relleno.
     */
    fill(polygon, color = "black"); {
        // 1. CONSTRUIR EDGE TABLE (ET)
        // La Edge Table organiza las aristas según la coordenada Y minima de cada una.
        // ET[y] = lista de aristas que comienzan en y
        // Cada arista guarda: ymax, invSlope, x inicial

        const edgeTable = [];
        const n = polygon.length;

        for (let i = 0; i < n; i++) {
            // Punto actual
            const p1 = polygon[i];
            // Siguiente punto (cerrando el poligono)
            const p2 = polygon[(i + 1) % n];

            // IGNORAR LÍNEAS HORIZONTALES
            // Las lineas horizontales no generan intersecciones útiles para scanline fill.
            if (p1.y === p2.y) {
                continue;
            }

            // IDENTIFICAR: ymin, ymax
            // La arista se procesa desde abajo hacia arriba.
            let ymin, ymax, xAtYmin, invSlope;

            if (p1.y < p2.y) {
                ymin = p1.y;
                ymax = p2.y;
                xAtYmin = p1.x;
                // dx/dy
                invSlope = (p2.x - p1.x) / (p2.y - p1.y);
            } else {
                ymin = p2.y;
                ymax = p1.y;
                xAtYmin = p2.x;
                invSlope = (p1.x - p2.x) / (p1.y - p2.y);
            }

            // Crear bucket si no existe
            if (!edgeTable[ymin]) {
                edgeTable[ymin] = [];
            }

            // Insertar arista
            edgeTable[ymin].push({
                ymax,
                x: xAtYmin,
                invSlope
            });
        }
        
    }