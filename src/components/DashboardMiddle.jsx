import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBowlRice,
  faCow,
  faDrumstickBite,
  faCheese,
  faCarrot,
  faBasketShopping,
  faBreadSlice,
} from "@fortawesome/free-solid-svg-icons";
import FoodItemList from "./FoodItemList";

export default function DashboardMiddle({
  lists,
  setLists,
  handleItemSelection,
  selectedItems,
  listsDragged,
  setListsDragged,
}) {
  const screenWidthMobile = window.innerWidth < 576;

  const getListIcon = (listType) => {
    switch (listType) {
      case "snacks":
      case "pantry":
        return faBowlRice;
      case "dairy":
        return faCow;
      case "meats":
      case "meat":
        return faDrumstickBite;
      case "deli":
      case "cheese":
      case "cheeses":
        return faCheese;
      case "produce":
      case "veggies":
      case "vegetables":
        return faCarrot;
      case "bakery":
      case "baked goods":
      case "bread":
        return faBreadSlice;
      case "miscellaneous":
        return faBasketShopping;
      default:
        return faBasketShopping;
    }
  };
  //dnd stuff
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setLists((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        //change the state to trigger the useEffect
        setListsDragged(!listsDragged);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={lists}
        strategy={
          screenWidthMobile
            ? verticalListSortingStrategy
            : horizontalListSortingStrategy
        }
      >
        <div className="middle">
          {lists.map((list, index) => {
            const listName = list[0];
            const listItems = list[1];
            if (listItems.length > 0 && listName !== "inactive") {
              return (
                <SortableItem key={list} id={list}>
                  <div
                    className={`food-list list-color${index % 7}`}
                    key={listName}
                  >
                    <div className="list-title">
                      <FontAwesomeIcon
                        icon={getListIcon(listName)}
                        className={`list-icon`}
                        style={{ marginRight: "1em" }}
                      />
                      {listName.charAt(0).toUpperCase() + listName.slice(1)}
                    </div>
                    <FoodItemList
                      foodItems={listItems}
                      handleItemSelection={handleItemSelection}
                      selectedItems={selectedItems}
                    ></FoodItemList>
                  </div>
                </SortableItem>
              );
            } else {
              return null;
            }
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
