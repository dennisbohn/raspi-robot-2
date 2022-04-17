const fs = require("fs");

// Arguments
const action = process.argv[2];
const key = process.argv[3];
const value = process.argv[4];

// Config
const configFile = __dirname + "/config.json";
const config = fs.existsSync(configFile)
  ? JSON.parse(fs.readFileSync(configFile).toString())
  : {};
const saveConfig = function () {
  fs.writeFileSync(configFile, JSON.stringify(config, null, 4));
};

// Set
const set = function (key, value) {
  if (value === undefined) return;
  // Server
  if (["authtoken", "hostname"].includes(key)) {
    config.server = config.server || {};
    config.server[key] = value;
    saveConfig();
  }
  // Libcamera
  if (["width", "height", "framerate", "bitrate"].includes(key)) {
    config.libcamera = config.libcamera || {};
    config.libcamera[key] = parseInt(value) || 0;
    saveConfig();
  }
  if (key === "libcamera" && value === "defaults") {
    config.libcamera = {
      width: 640,
      height: 360,
      framerate: 30,
      bitrate: 1000000,
    };
    saveConfig();
  }
};

// Action
if (action === "set") set(key, value);
