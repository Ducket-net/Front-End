// ExtendedFloorFurniture.js
import { FloorFurniture } from "@tetreum/shroom";

class ExtendedFloorFurniture extends FloorFurniture {
  /**
   * Get all available animations for this furniture.
   *
   * @returns {Promise<string[]>} List of available animation names
   */
  async getAvailableAnimations() {
    // Check if the furniture visualization data exists
    let loadFurniResult = await this._baseFurniture._loadFurniResultPromise;

    //return list of animations for this furni
    let animations =
      loadFurniResult.visualizationData._furniture["64"].animations;

    return Object.keys(animations);
  }
}

export default ExtendedFloorFurniture;
