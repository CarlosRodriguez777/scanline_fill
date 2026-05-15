/**
 * Implementación del algoritmo Scanline Fill
 */
class ScanlineFill {
    /**
     * Constructor
     * @param {CanvasRenderingContext2D} ctx Contexto 2D del canvas donde se dibujará.
     */
    constructor(ctx) {
        this.ctx = ctx; //
    }

/**
     * MÉTODO PRINCIPAL
     * Ejecuta el algoritmo scanline fill.
     * @param {Array} polygon Array de vértices del poligono.
     * @param {String} color Color de relleno.
     */
    fill(polygon, color = "black") {
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
        // 2. OBTENER RANGO VERTICAL TOTAL
        const ys = polygon.map(p => p.y); 
        const miny = Math.min(...ys); 
        const maxy = Math.max(...ys); 

        // 3. ACTIVE EDGE TABLE (AET)
        let activeEdgeTable = []; 

        this.ctx.fillStyle = color; 

        // 4. RECORRER SCANLINES
        
        for (let y = miny; y <= maxy; y++) {
          // 4.1 AGREGAR NUEVAS ARISTAS ACTIVAS
       
            if (edgeTable[y]) {
                activeEdgeTable.push(...edgeTable[y]); 
            }

            // 4.2 ELIMINAR ARISTAS TERMINADAS
            activeEdgeTable = activeEdgeTable.filter(
                edge => edge.ymax > y
            );

            // 4.3 ORDENAR POR X
            
            activeEdgeTable.sort((a, b) => a.x - b.x);

            // 4.4 RELLENAR ENTRE PARES
            for (let i = 0; i < activeEdgeTable.length; i += 2) {
                
                if (i + 1 >= activeEdgeTable.length) {
                    break; 
                }

                const xStart = Math.ceil(activeEdgeTable[i].x);
                
                const xEnd = Math.floor(activeEdgeTable[i + 1].x);

                
                this.ctx.fillRect(
                    xStart, 
                    y, 
                    xEnd - xStart + 1, 
                    1 
                );
            }

            // 4.5 ACTUALIZAR INTERSECCIONES X
            
            for (const edge of activeEdgeTable) {
                edge.x += edge.invSlope; 
            }
        } 
    } 
}
const canvas = document.getElementById("canvas"); 
const ctx = canvas.getContext("2d"); 

const scanline = new ScanlineFill(ctx); 
const polygon = [
    {x: 100, y: 100}, 
    {x: 300, y: 120}, 
    {x: 350, y: 250}, 
    {x: 250, y: 350}, 
    {x: 120, y: 300}];


ctx.beginPath(); 
ctx.moveTo(polygon[0].x, polygon[0].y); 
for (let i = 1; i < polygon.length; i++) {
    ctx.lineTo(polygon[i].x, polygon[i].y); 
}
ctx.closePath();
ctx.strokeStyle = "red"; 
ctx.lineWidth = 2; 
ctx.stroke(); 
scanline.fill(polygon, "skyblue"); 
        