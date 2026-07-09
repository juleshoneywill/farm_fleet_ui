import {
  Tractor,
  Wheat,
  Package,
  Droplets,
  Droplet,
  Wrench,
  ClipboardCheck,
  CircleDot,
  Cog,
  type LucideIcon,
} from "lucide-react";

export const machineIcon = (type: string): LucideIcon => {
  switch (type) {
    case "tractor":
      return Tractor;
    case "combine":
      return Wheat;
    case "baler":
      return Package;
    case "sprayer":
      return Droplets;
    default:
      return Cog;
  }
};

export const serviceIcon = (type: string): LucideIcon => {
  switch (type) {
    case "oil-change":
      return Droplet;
    case "repair":
      return Wrench;
    case "inspection":
      return ClipboardCheck;
    case "tire":
      return CircleDot;
    default:
      return Wrench;
  }
};
