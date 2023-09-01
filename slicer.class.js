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

  extrusionMoveTo(x, y, speed = this.printSpeed) {
    const distanceX = x - this.currentPosition.x;
    const distanceY = y - this.currentPosition.y;
                                  
    const gcode = this.generateExtrusionGcode(0, 0, distanceX, distanceY);
    this.addGcodeLine(gcode, speed);
    this.currentPosition.x += distanceX;
    this.currentPosition.y += distanceY;
  }

  extrude(length, speed = this.printSpeed) {
    this.addGcodeLine(`G1 E${length}`, speed);
    this.currentPosition.e += length;
  }

  moveZ(z = this.layerHeight, retract = false, speed = this.heightSpeed) {
    if (retract) {
      this.retract();
    }

    this.addGcodeLine(`G1 Z${z}`, speed);
    
    if (retract) {
      this.unretract();
    }
    
    this.currentPosition.z += z;
    this.currentPosition.z = parseFloat(this.currentPosition.z.toFixed(this.eRoundFactor))
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

  moveTo(x, y, z, speed = this.movementSpeed) {
    const distanceX = x - this.currentPosition.x;
    const distanceY = y - this.currentPosition.y;
    
    if (z) {
      const distanceZ = z - this.currentPosition.z;
      this.addGcodeLine(`G1 X${distanceX} Y${distanceY} Z${distanceZ}`, speed);
      this.currentPosition.z += distanceZ;
    } else {
      this.addGcodeLine(`G1 X${distanceX} Y${distanceY}`, speed);
    }
    
    this.currentPosition.x += distanceX;
    this.currentPosition.y += distanceY;
  }

  retract(e = this.retractLength) {
    this.addGcodeLine(`G1 E-${e}`, this.retractSpeed);
    this.currentPosition.e -= e;
  }

  unretract(e = this.retractLength) {
    this.addGcodeLine(`G1 E${e}`, this.retractSpeed);
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
    this.gcode += `G90\nG28\nG1 X0 Y0 Z10\nG91\n`;
    this.currentPosition = {x:0, y:0, z:10, e:0};
  }

printRectangle(x, y, startDirection = "right", isClockwise = true) {
    const dirMap = {
        "right": {
            cw: [this.extrusionMove.bind(this, x, 0), this.extrusionMove.bind(this, 0, y), this.extrusionMove.bind(this, -x, 0), this.extrusionMove.bind(this, 0, -y)],
            ccw: [this.extrusionMove.bind(this, x, 0), this.extrusionMove.bind(this, 0, -y), this.extrusionMove.bind(this, -x, 0), this.extrusionMove.bind(this, 0, y)]
        },
        "up": {
            cw: [this.extrusionMove.bind(this, 0, y), this.extrusionMove.bind(this, -x, 0), this.extrusionMove.bind(this, 0, -y), this.extrusionMove.bind(this, x, 0)],
            ccw: [this.extrusionMove.bind(this, 0, y), this.extrusionMove.bind(this, x, 0), this.extrusionMove.bind(this, 0, -y), this.extrusionMove.bind(this, -x, 0)],
        },
        "left": {
            cw: [this.extrusionMove.bind(this, -x, 0), this.extrusionMove.bind(this, 0, -y), this.extrusionMove.bind(this, x, 0), this.extrusionMove.bind(this, 0, y)],
            ccw: [this.extrusionMove.bind(this, -x, 0), this.extrusionMove.bind(this, 0, y), this.extrusionMove.bind(this, x, 0), this.extrusionMove.bind(this, 0, -y)],
        },
        "down": {
            cw: [this.extrusionMove.bind(this, 0, -y), this.extrusionMove.bind(this, x, 0), this.extrusionMove.bind(this, 0, y), this.extrusionMove.bind(this, -x, 0)],
            ccw: [this.extrusionMove.bind(this, 0, -y), this.extrusionMove.bind(this, -x, 0), this.extrusionMove.bind(this, 0, y), this.extrusionMove.bind(this, x, 0)],
        }
    };
    
    if (!dirMap.hasOwnProperty(startDirection)) {
        console.error("Invalid start direction");
        return;
    }
    
    const moves = isClockwise ? dirMap[startDirection].cw : dirMap[startDirection].ccw;
    
    for (let move of moves) {
        move();
    }
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

slicer.moveTo(90, 110, slicer.layerHeight);


slicer.extrusionMoveTo(100, 100);

slicer.extrusionMove(20, 0);
slicer.extrusionMove(0, -20);
slicer.extrusionMove(-20, 0);
slicer.extrusionMove(0, 20);

slicer.moveTo(10, 10);
slicer.printRectangle(10,10, "left", false);

slicer.moveZ(0.2, true);

slicer.move(-100, -100, 10);

slicer.disableAll();

// Show Code and Pos.
console.log(slicer.getGcode());
console.log(slicer.currentPosition);