
# Slicer JavaScript Class

The `Slicer` class is designed to generate G-code instructions for 3D printing tasks. It provides methods to control movements and extrusion for your printer.

## Class Initialization

```javascript
const slicer = new Slicer(nozzleDiameter, layerHeight, filamentDiameter, movementSpeed, printSpeed, heightSpeed, retractSpeed, retractLength);
```

### Properties

- `nozzleDiameter`: Diameter of the printer nozzle.
- `layerHeight`: Height of each printed layer.
- `filamentDiameter`: Diameter of the filament.
- `movementSpeed`: Default movement speed.
- `printSpeed`: Default printing speed.
- `heightSpeed`: Default height change speed.
- `retractSpeed`: Retraction speed.
- `retractLength`: Retraction length.
- `extrusionWidth`: Width of extrusion.
- `currentPosition`: Current position of the printer.
- `eRoundFactor`: Rounding factor for extrusion calculations.
- `gcode`: Accumulated G-code instructions.

### Methods

- `calculateFilamentLength(distance)`: Calculate filament length based on distance.
- `calculateDistance(x1, y1, x2, y2)`: Calculate distance between two points.
- `generateExtrusionGcode(x1, y1, x2, y2)`: Generate G-code for extrusion move.
- `addGcodeLine(gcode, speed)`: Add a G-code line to the instructions.
- `extrusionMove(x, y, speed)`: Perform an extrusion move.
- `extrusionMoveTo(x, y, speed)`: Move to a position with extrusion.
- `extrude(length, speed)`: Extrude filament.
- `moveZ(z, retract, speed)`: Move in the Z direction.
- `move(x, y, z, speed)`: Move in the X, Y, and optionally Z directions.
- `moveTo(x, y, z, speed)`: Move to a position in the X, Y, and optionally Z directions.
- `retract(e)`: Perform retraction.
- `unretract(e)`: Cancel retraction.
- `bedHeat(temp)`: Heat the bed to the specified temperature.
- `bedHeatWait(temp)`: Heat the bed and wait.
- `toolHeat(temp)`: Heat the tool to the specified temperature.
- `toolHeatWait(temp)`: Heat the tool and wait.
- `setSpeed(speed)`: Set the movement speed.
- `disableAll()`: Disable all components.
- `home()`: Home the printer.
- `getGcode()`: Get the accumulated G-code instructions.

## Example Usage

```javascript
const slicer = new Slicer(0.4, 0.2, 1.75);

slicer.home();

slicer.toolHeat(180);
slicer.bedHeatWait(50);
slicer.toolHeatWait(180);

slicer.moveTo(90, 110, slicer.layerHeight);

// ... more method calls ...

slicer.disableAll();

// Display G-code and current position
console.log(slicer.getGcode());
console.log(slicer.currentPosition);
```

For more details about the methods and their parameters, please refer to the class implementation.
```