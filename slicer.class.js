class Slicer {
  constructor(nozzleDiameter, layerHeight, filamentDiameter, movementSpeed = 100, printSpeed = 60, heightSpeed = 20, retractSpeed = 60, retractLength = 2.5) {
    this.nozzleDiameter = nozzleDiameter;
    this.layerHeight = layerHeight;
    this.filamentDiameter = filamentDiameter;
    this.movementSpeed = movementSpeed;
    this.printSpeed = printSpeed;
    this.heightSpeed = heightSpeed;
    this.retractSpeed = retractSpeed;
    this.retractLength = retractLength;
    this.extrusionWidth = layerHeight * 1.2;
    this.gcode = '';
  }

  calculateFilamentLength(distance) {
    const A = (this.extrusionWidth - this.layerHeight) * this.layerHeight + Math.PI * (this.layerHeight / 2) ** 2;
    const E = (A * distance * 4) / (Math.PI * this.filamentDiameter ** 2);
    return E;
  }

  calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  generateExtrusionGcode(x1, y1, x2, y2) {
    const distance = this.calculateDistance(x1, y1, x2, y2);
    const e = this.calculateFilamentLength(distance);
    return `G1 X${x2} Y${y2} E${e.toFixed(5)}`;
  }

  addGcodeLine(gcode, speed) {
    this.gcode += `${gcode} F${speed * 60}\n`;
  }

  extrudeMove(x, y, speed = this.printSpeed) {
    const gcode = this.generateExtrusionGcode(0, 0, x, y);
    this.addGcodeLine(gcode, speed);
  }

  extrude(length, speed = this.printSpeed) {
    this.addGcodeLine(`G1 E${length}`, speed);
  }

  zMove(z = this.layerHeight, speed = this.heightSpeed) {
    this.addGcodeLine(`G1 Z${z}`, speed);
  }

  move(x, y, speed = this.movementSpeed) {
    this.addGcodeLine(`G1 X${x} Y${y}`, speed);
  }

  retract(length = this.retractLength) {
    this.addGcodeLine(`G1 E-${length}`, this.retractSpeed);
  }

  unretract(length = this.retractLength) {
    this.addGcodeLine(`G1 E${length}`, this.retractSpeed);
  }

  bedHeat(temp) {
    this.gcode += `M190 S${temp}\n`;
  }

  bedHeatWait(temp) {
    this.gcode += `M140 S${temp}\n`;
  }

  toolHeat(temp) {
    this.gcode += `M104 S${temp}\n`;
  }

  toolHeatWait(temp) {
    this.gcode += `M109 S${temp}\n`;
  }

  setSpeed(speed) {
    this.gcode += `G1 F${speed * 60}\n`;
  }

  disableAll() {
    this.gcode += `M106 S0\nM104 S0\nM140 S0\nM84\n`;
  }

  getGcode() {
    return this.gcode;
  }
}

