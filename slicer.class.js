class Slicer {
  nozzleDiameter = false;
  layerHeight = false;
  extrusionWidth = false;
  filamentDiameter = false;

  currentSpeed = false;

  gcode = new String();
  movementSpeed = 100;
  printSpeed = 60;
  heightSpeed = 20;
  retractSpeed = 60;
  retractLength = 2.5;

  constructor(nozzleDiameter, layerHeight, filamentDiameter) {
    this.nozzleDiameter = nozzleDiameter;
    this.layerHeight = layerHeight;
    this.filamentDiameter = filamentDiameter;
  }

  calculateFilamentLength(distance, extrusionWidth) {
    const A = (extrusionWidth - this.layerHeight) * this.layerHeight + Math.PI * (this.layerHeight / 2) ** 2;
    const E = (A * distance * 4) / (Math.PI * this.filamentDiameter ** 2);

    return E;
  }

  calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  gcodeExtrusionMove(x1, y1, x2, y2, extrusionWidth) {
    var distance = this.calculateDistance(x1, y1, x2, y2);
    var e = this.calculateFilamentLength(distance, extrusionWidth);
    return `G1 X${x2} Y${y2} E${e.toFixed(5)}`;
  }

  addExtrusionMove(x, y, speed = false, extrusionWidth = 0.45) {
    if (!speed) {
      speed = this.printSpeed;
    }

    this.gcode += `${this.gcodeExtrusionMove(0, 0, x, y, extrusionWidth)} F${speed * 60}\n`;
  }

  addExtrude(length, speed = false) {
    if (!speed) {
      speed = this.printSpeed;
    }

    this.gcode += `G1 E${length} F${speed * 60}\n`;
  }

  addZMove(z, speed = false) {
    if (!speed) {
      speed = this.heightSpeed;
    }

    this.layerHeight = z;

    this.gcode += `G1 Z${z} F${speed * 60}\n`;
  }

  addMove(x, y, speed = false) {
    if (!speed) {
      speed = this.movementSpeed;
    }

    this.gcode += `G1 X${x} Y${y} F${speed * 60}\n`;
  }

  addLine(str) {
    this.gcode += `${str}\n`;
  }

  addRetract(length = false) {
    if (!length) {
      length = this.retractLength;
    }
    this.gcode += `G1 E${Math.abs(length)} F${this.retractSpeed * 60}\n`;
  }

  addUnretract(length = false) {
    if (!length) {
      length = this.retractLength;
    }
    this.gcode += `G1 E${length} F${this.retractSpeed * 60}\n`;
  }

  addBedHeat(temp) {
    this.gcode += `M190 S${temp}\n`;
  }

  addBedHeatWait(temp) {
    this.gcode += `M140 S${temp}\n`;
  }

  addToolHeat(temp) {
    this.gcode += `M104 S${temp}\n`;
  }

  addToolHeatWait(temp) {
    this.gcode += `M109 S${temp}\n`;
  }

  // input mm/s
  addSetSpeed(speed) {
    this.gcode += `G1 F${speed * 60}\n`;
  }

  disableAll() {
    this.gcode += `M106 S0\nM104 S0\nM140 S0\nM84\n`;
  }

  printGcode() {
    return this.gcode;
  }
}
