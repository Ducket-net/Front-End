const fs = require("fs").promises;
const fetch = require("node-fetch");
const ByteBuffer = require("bytebuffer");

class ShroomAssetBundle {
  constructor() {
    this._files = new Map();
  }

  static fromBuffer(buffer) {
    const byteBuffer = ByteBuffer.wrap(buffer);

    const readFile = () => {
      const fileNameLength = byteBuffer.readUint16();
      const fileName = byteBuffer.readString(fileNameLength);
      const fileLength = byteBuffer.readUint32();
      const fileBuffer = byteBuffer.readBytes(fileLength);

      return {
        fileName,
        buffer: fileBuffer.toBuffer(),
      };
    };

    const version = byteBuffer.readByte();
    const fileCount = byteBuffer.readUint16();
    const bundle = new ShroomAssetBundle();

    for (let i = 0; i < fileCount; i++) {
      const file = readFile();
      bundle.addFile(file.fileName, file.buffer);
    }

    return bundle;
  }

  addFile(name, buffer) {
    this._files.set(name, buffer);
  }

  getFile(name) {
    const buffer = this._files.get(name);
    if (buffer === undefined) throw new Error(`File not found: ${name}`);
    return buffer;
  }

  getFileAsString(name) {
    return new TextDecoder().decode(this.getFile(name));
  }
}

async function loadAndSplitShroomFile(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch Shroom Asset Bundle from URL: ${url}`);
  }

  const buffer = await response.buffer();
  const assetBundle = ShroomAssetBundle.fromBuffer(buffer);

  const jsonString = assetBundle.getFileAsString("index.json");
  const pngBuffer = assetBundle.getFile("spritesheet.png");

  let fileName = url.split("/").pop();
  //remove .shroom extension
  fileName = fileName.substring(0, fileName.length - 7);

  await fs.writeFile(fileName + ".json", jsonString, "utf-8");
  await fs.writeFile(fileName + ".png", pngBuffer);
}

const shroomFileUrl =
  "https://ducket-net.github.io/resources/hof_furni/45508/club_sofa.shroom";
loadAndSplitShroomFile(shroomFileUrl)
  .then(() => {
    console.log("Successfully extracted and saved JSON and PNG files.");
  })
  .catch((error) => {
    console.error(
      "An error occurred while processing Shroom Asset Bundle:",
      error
    );
  });
