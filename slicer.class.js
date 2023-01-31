class Slicer {
  nozzleDiameter = false;
  layerHeight = false;
  extrusionWidth = false;
  filamentDiameter = false;

  gcode = new String();
  movementSpeed = false;
  extrusionSpeed = false;
  heightSpeed = false;

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

  addExtrusionMove(x, y, extrusionWidth = 0.45) {
    if (this.extrusionSpeed) {
      this.addSetSpeed(this.extrusionSpeed);
    }

    this.gcode += `${this.gcodeExtrusionMove(0, 0, x, y, extrusionWidth)}\n`;
  }

  addExtrude(length) {
    if (this.extrusionSpeed) {
      this.addSetSpeed(this.extrusionSpeed);
    }

    this.gcode += `G1 E${length}\n`;
  }

  addZMove(z) {
    this.layerHeight = z;

    if (this.heightSpeed) {
      this.addSetSpeed(this.heightSpeed);
    }

    this.gcode += `G1 Z${z}\n`;
  }

  addMove(x, y) {
    if (this.movementSpeed) {
      this.addSetSpeed(this.movementSpeed);
    }

    this.gcode += `G1 X${x} Y${y}\n`;
  }

  addLine(str) {
    this.gcode += `${str}\n`;
  }

  addRetract(length = 2) {
    this.gcode += `G1 E${Math.abs(length)}\n`;
  }

  addUnretract(length = 2) {
    this.gcode += `G1 E${length}\n`;
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

  printGcode() {
    return this.gcode;
  }
}

let slicer = new Slicer(0.4, 0.2, 1.75);
// setup
slicer.movementSpeed = 100;
slicer.extrusionSpeed = 30;
slicer.heightSpeed = 20;

// preheat and wait
slicer.addLine("G28");
slicer.addMove(5, 10);
slicer.addBedHeatWait(50);
slicer.addToolHeatWait(190);

// prime and move to start point
slicer.addZMove(0.2);
slicer.addExtrude(5);
slicer.addMove(125, 125);

// set absolute, must be provided for extrusion
slicer.addLine("G91");

// generate cubus
for (let index = 0; index < 10; index++) {
  slicer.addExtrusionMove(60, 0);
  slicer.addExtrusionMove(0, 60);
  slicer.addExtrusionMove(-60, 0);
  slicer.addExtrusionMove(0, -60);
  slicer.addZMove(0.2);
}

// the end
slicer.addZMove(20);
slicer.addLine("G90");

console.log(slicer.printGcode());
