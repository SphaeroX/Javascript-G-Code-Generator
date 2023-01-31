# Javascript-G-Code-Generator

Javascript class for Generate G code including extrusion calculation

## Usage/Examples

```javascript
let slicer = new Slicer(nozzleDiameter, layerHeight, filamentDiameter);
let gcode = slicer.gcodeExtrusionMove(x, y, extrusionWidth));
```

```javascript
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
slicer.addLine("G1 Z0");

// prime
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
```

## Features

- gcodeExtrusionMove(x, y, extrusionWidth)
