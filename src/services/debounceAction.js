import { debounce } from "lodash";
import EventBus from "../eventBus";

export default {
  methods: {
    onFurnitureItemClick: debounce(
      function (item) {
        if (this.selectedFurnitureItem && this.selectedFurnitureItem !== item) {
          EventBus.$emit("item-unselected", this.selectedFurnitureItem);
        }

        if (this.selectedFurnitureItem === item) {
          EventBus.$emit("item-unselected", item);
          this.selectedFurnitureItem = null;
        } else {
          EventBus.$emit("item-selected", item);
          this.selectedFurnitureItem = item;
        }
      },
      500,
      { leading: true, trailing: false }
    ),
  },
};
