class Slicer {
  nozzleDiameter = false;
  layerHeight = false;
  extrusionWidth = false;
  filamentDiameter = false;

  constructor(nozzleDiameter, layerHeight, filamentDiameter) {
    this.nozzleDiameter = nozzleDiameter;
    this.layerHeight = layerHeight;
    this.filamentDiameter = filamentDiameter;
  }

  calculateFilamentLength(distance, extrusionWidth) {
    const A = ((extrusionWidth - this.layerHeight) * this.layerHeight) + (Math.PI * (this.layerHeight / 2) ** 2);
    const E = (A * distance * 4) / (Math.PI * this.filamentDiameter ** 2);

    return E;
  }

  calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  gcodeExtrusionMove(x, y, extrusionWidth) {
    var distance = this.calculateDistance(0, 0, x, y);
    var e = this.calculateFilamentLength(distance, extrusionWidth);

    return `G1 X${x} Y${y} E${e.toFixed(5)}`;
  }
}
