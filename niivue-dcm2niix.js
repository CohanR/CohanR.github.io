// niivue-dcm2niix.js
import { Niivue } from "https://niivue.github.io/niivue/dist/niivue.es.js";
import { NiiVueDcm2nii } from "https://niivue.github.io/niivue-dcm2niix/dist/niivue-dcm2niix.js";

const nv = new Niivue({
  dragAndDropEnabled: true,
  backColor: [0, 0, 0, 1],
  show3Dcrosshair: true,
});

nv.attachTo("gl");
nv.setSliceType(nv.sliceTypeMultiplanar);
nv.opts.multiplanarForceRender = true;

// Initialize the dcm2niix converter
const dicomConverter = new NiiVueDcm2nii();

// Handle Drop
document.body.ondragover = (e) => e.preventDefault();
document.body.ondrop = async (e) => {
  e.preventDefault();
  const dropStatus = document.getElementById("status");
  dropStatus.innerText = "⏳ Converting DICOMs... please wait";
  
  // This logic sends the files to the WASM converter
  try {
    const volumes = await dicomConverter.loadFromFiles(e.dataTransfer.files);
    if (volumes.length > 0) {
      nv.loadVolumes(volumes);
      dropStatus.innerText = "✅ Loaded: " + volumes[0].name;
    } else {
      dropStatus.innerText = "❌ No valid DICOMs found.";
    }
  } catch (err) {
    console.error(err);
    dropStatus.innerText = "❌ Error: " + err.message;
  }
};
