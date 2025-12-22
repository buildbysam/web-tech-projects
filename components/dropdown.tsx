"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

interface IDropdownItem {
  title: string;
  value: string;
}

interface Props {
  dropdown_items: IDropdownItem[];
  selected_item?: IDropdownItem;
  handleChange: (value: string) => void;
}

export default function Dropdown({ dropdown_items, selected_item, handleChange }: Props) {
  const [selectedItem, setSelectedItem] = useState(selected_item || dropdown_items[0]);
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative">
      <button
        className="relative bg-transparent border-muted-foreground/25 text-foreground hover:bg-muted-foreground/10 hover:text-primary border hover:opacity-85 py-1.5 px-2.5 text-sm font-normal transition-all text-center outline-none cursor-pointer rounded-md disabled:opacity-75 disabled:cursor-not-allowed"
        onClick={toggleDropdown}
      >
        <span className="flex-center gap-4">
          {selectedItem.title}
          <ChevronDown className="size-4" />
        </span>
      </button>

      {isOpen ? (
        <ul className="p-1.5 absolute top-[120%] left-0 bg-muted/95 rounded-lg border border-muted-foreground/25 z-10 w-[130%]">
          {dropdown_items.map((item) => {
            const active = item.value === selectedItem.value;
            return (
              <button
                className="px-2.5 py-1.5 w-full text-sm text-left hover:bg-accent hover:text-accent-foreground rounded-md flex-between"
                key={item.value}
                onClick={() => {
                  if (active) return;
                  toggleDropdown();
                  setSelectedItem(item);
                  handleChange(item.value);
                }}
              >
                {item.title}
                {item.value === selectedItem.value ? <Check className="size-3.5" /> : null}
              </button>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
