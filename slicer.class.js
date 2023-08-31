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
    this.currentPosition = {x: null, y: null, z:null, e: null};
    this.eRoundFactor = 5;
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
    const eRounded = parseFloat(e.toFixed(this.eRoundFactor));
    this.currentPosition.e += eRounded;
    this.currentPosition.e = parseFloat(this.currentPosition.e.toFixed(this.eRoundFactor))
    return `G1 X${x2} Y${y2} E${eRounded}`;
  }

  addGcodeLine(gcode, speed) {
    this.gcode += `${gcode} F${speed * 60}\n`;
  }

  extrusionMove(x, y, speed = this.printSpeed) {
    const gcode = this.generateExtrusionGcode(0, 0, x, y);
    this.addGcodeLine(gcode, speed);
    this.currentPosition.x += x;
    this.currentPosition.y += y;
  }

  extrude(length, speed = this.printSpeed) {
    this.addGcodeLine(`G1 E${length}`, speed);
    this.currentPosition.e += length;
  }

  moveZ(z = this.layerHeight, speed = this.heightSpeed) {
    this.addGcodeLine(`G1 Z${z}`, speed);
    this.currentPosition.z += z;
  }

  move(x, y, z, speed = this.movementSpeed) {
    if (z) {
      this.addGcodeLine(`G1 X${x} Y${y} Z${z}`, speed);
      this.currentPosition.z += z;
    } else {
      this.addGcodeLine(`G1 X${x} Y${y}`, speed);
    }
    
    this.currentPosition.x += x;
    this.currentPosition.y += y;
  }

  retract(length = this.retractLength) {
    this.addGcodeLine(`G1 E-${length}`, this.retractSpeed);
    this.currentPosition.e -= e;
  }

  unretract(length = this.retractLength) {
    this.addGcodeLine(`G1 E${length}`, this.retractSpeed);
    this.currentPosition.e += e;
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

  home() {
    this.gcode += `G28\nG1 X0 Y0 Z10\n`;
    this.currentPosition = {x:0, y:0, z:10, e:0};
  }

  getGcode() {
    return this.gcode;
  }
}


// Example
const slicer = new Slicer(0.4, 0.2, 1.75);

slicer.home();


slicer.toolHeat(180);
slicer.bedHeatWait(50);
slicer.toolHeatWait(180);

slicer.move(100, 100, -9.8);

slicer.extrusionMove(20, 0);
slicer.extrusionMove(0, -20);
slicer.extrusionMove(-20, 0);
slicer.extrusionMove(0, 20);

slicer.move(-100, -100, 10);
slicer.disableAll();

// Show Code and Pos.
console.log(slicer.getGcode());
console.log(slicer.currentPosition);